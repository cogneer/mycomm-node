import { docLines, enumCase, inline, pascal, propertyKey } from './names.js';
import type { Operation, Response } from './operations.js';
import { declaration, type Enum, type Field, type Input, type Model, type Property, type TypeInfo } from './types.js';

export const HEADER = '// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.\n\n';

/** What a method hands back, as the runtime reads it. */
export type Returns = 'void' | 'model' | 'maybe' | 'page' | 'json';

/**
 * Writes the TypeScript source of the types, operations, resources and webhook events.
 *
 * Input object types arrive as `@@input:Name@@`; `resolve()` turns them into their final names once `types()` has named
 * the inputs.
 */
export class Emitter {
  /** Input name => the name it is emitted as. */
  private inputNames: Record<string, string> = {};

  /** Every exported type name, for the import lists. */
  readonly typeNames = new Set<string>();

  /** An input that shares its name with a model or an enum becomes `NameInput`. */
  private nameInputs(inputs: Record<string, Input>, taken: Set<string>): void {
    for (const name of Object.keys(inputs)) {
      this.inputNames[name] = taken.has(name) ? `${name}Input` : name;
      if (taken.has(this.inputNames[name]!)) {
        throw new Error(`The input ${name} and a model or enum both want the name ${this.inputNames[name]}.`);
      }
    }
  }

  resolve(ts: string): string {
    return ts.replace(/@@input:([A-Za-z0-9_]+)@@/g, (_, name: string) => this.inputNames[name] ?? name);
  }

  private decl(type: TypeInfo): string {
    return this.resolve(declaration(type));
  }

  types(
    enums: Record<string, Enum>,
    models: Record<string, Model>,
    inputs: Record<string, Input>,
    operations: Operation[],
  ): string {
    const register = (name: string, what: string): void => {
      if (this.typeNames.has(name)) {
        throw new Error(`Two types want the name ${name} (the second is ${what}).`);
      }
      this.typeNames.add(name);
    };
    this.nameInputs(inputs, new Set([...Object.keys(models), ...Object.keys(enums)]));

    let code = HEADER;
    code += "import type { Uploadable } from '../core/uploads.js';\n\n";
    code +=
      '/**\n * A value of an enum the API may extend: one of the values this SDK version knows, or a newer one as a plain string.\n */\n' +
      'export type Open<T extends string> = T | (string & {});\n\n';
    register('Open', 'the open-enum helper');

    for (const [name, definition] of Object.entries(enums)) {
      register(name, 'an enum');
      // Answers type it `Open<Name>`, whose own doc says that newer values arrive as plain strings.
      const doc = docLines(definition.description);
      const used = new Set<string>();
      const cases = definition.values.map((value) => {
        let key = enumCase(value);
        while (used.has(key)) key += '_';
        used.add(key);
        return `  ${key}: ${JSON.stringify(value)},`;
      });
      code += comment(doc, [], '');
      code += `export type ${name} = ${definition.values.map((value) => JSON.stringify(value)).join(' | ')};\n`;
      code += `export const ${name} = {\n${cases.join('\n')}\n} as const;\n\n`;
    }

    for (const [name, model] of Object.entries(models)) {
      register(name, 'a model');
      code += comment(docLines(model.description), [], '');
      code += `export interface ${name} {\n${this.members(model.properties)}}\n\n`;
    }

    for (const [name, input] of Object.entries(inputs)) {
      const final = this.inputNames[name] ?? name;
      register(final, 'an input');
      code += comment(docLines(input.description), [], '');
      code += `export interface ${final} {\n${this.members(input.fields)}}\n\n`;
    }

    for (const operation of operations) {
      const params = paramsName(operation);
      if (params === null) continue;
      register(params, `the parameters of ${operation.id}`);
      code += comment([`The parameters of \`${methodPath(operation)}()\`.`], [], '');
      code += `export interface ${params} {\n${this.members({ ...operation.fields, ...operation.query })}}\n\n`;
    }

    return code;
  }

  /** The members of an interface: `?` for a field an answer may leave out or a request need not send. */
  private members(properties: Record<string, Property | Field>): string {
    let code = '';
    for (const [name, property] of Object.entries(properties)) {
      const description = inline(property.description, 600);
      code += comment(description === '' ? [] : docLines(description), [], '  ');
      const optional = property.required ? '' : '?';
      code += `  ${propertyKey(name)}${optional}: ${this.decl(property.type)};\n`;
    }
    return code;
  }

  operations(operations: Operation[]): string {
    // Compact JSON, parsed once at load: half the size of an object literal in the published files. `operation` is left out
    // where it equals the key, which is every operation but the multipart variant of `imports.create`.
    const table: Record<string, unknown> = {};
    for (const operation of operations) {
      const constraints: Record<string, unknown> = {};
      for (const [name, field] of Object.entries({ ...operation.fields, ...operation.query })) {
        const entry = { ...(field.required ? { required: true } : {}), ...field.constraints };
        if (Object.keys(entry).length > 0) constraints[name] = entry;
      }
      const spec: Record<string, unknown> = {};
      if (operation.id !== methodPath(operation)) spec.operation = operation.id;
      spec.method = operation.http;
      spec.path = operation.path;
      if (operation.pathParams.length > 0) spec.pathParams = operation.pathParams;
      if (Object.keys(operation.query).length > 0) spec.query = Object.keys(operation.query);
      if (operation.format !== 'none') spec.format = operation.format;
      if (operation.format === 'multipart') {
        spec.files = Object.entries(operation.fields)
          .filter(([, field]) => field.type.file === true)
          .map(([name]) => name);
      }
      spec.returns = returns(operation);
      if (paginated(operation)) spec.paginated = true;
      if (Object.keys(constraints).length > 0) spec.constraints = constraints;
      if (operation.rules.length > 0) spec.rules = operation.rules;
      table[methodPath(operation)] = spec;
    }
    return (
      HEADER +
      "import type { OperationSpec } from '../core/operation.js';\n\n" +
      '/** Every operation of both APIs, keyed by its SDK method (`messages.send`). */\n' +
      'export const OPERATIONS: Record<string, OperationSpec> = Object.fromEntries(\n' +
      `  Object.entries(JSON.parse(${JSON.stringify(JSON.stringify(table))}) as Record<string, Omit<OperationSpec, 'operation'> & { operation?: string }>).map(\n` +
      '    ([key, spec]) => [key, { ...spec, operation: spec.operation ?? key }],\n' +
      '  ),\n' +
      ');\n'
    );
  }

  /** One file per top-level resource, holding it and its nested resources. */
  resourceFile(nodes: Array<{ path: string[]; operations: Operation[]; children: string[] }>): string {
    const used = new Set<string>();
    let body = '';
    for (const node of nodes) {
      body += this.resource(node.path, node.operations, node.children, used);
    }
    const names = [...used].filter((name) => this.typeNames.has(name)).sort();
    let code = HEADER;
    code += "import type { Connection } from '../../core/connection.js';\n";
    code += "import type { WithMeta } from '../../core/meta.js';\n";
    code += "import type { Page } from '../../core/page.js';\n";
    code += "import type { RequestOptions } from '../../core/request-options.js';\n";
    if (names.length > 0) code += `import type { ${names.join(', ')} } from '../types.js';\n`;
    return code + '\n' + body;
  }

  private resource(path: string[], operations: Operation[], children: string[], used: Set<string>): string {
    const name = className(path);
    let code = '';
    code += comment([`\`client.${path.join('.')}\``], [], '');
    code += `export class ${name} {\n`;
    for (const child of children) {
      code += `  readonly ${child}: ${className([...path, child])};\n`;
    }
    if (children.length > 0) code += '\n';
    code += '  /** @internal */\n';
    code += `  constructor(private readonly _connection: Connection) {\n`;
    for (const child of children) {
      code += `    this.${child} = new ${className([...path, child])}(_connection);\n`;
    }
    code += '  }\n';
    for (const operation of operations) {
      code += '\n' + this.method(operation, used);
    }
    code += '}\n\n';
    // Children are emitted after their parent, in the same file; classes are hoisted only as declarations, which is enough
    // because they are constructed at run time.
    return code;
  }

  private method(operation: Operation, used: Set<string>): string {
    const params = paramsName(operation);
    const hasRequired = Object.values({ ...operation.fields, ...operation.query }).some((field) => field.required);
    const signature: string[] = operation.pathParams.map((name) => `${name}: string`);
    if (params !== null) {
      used.add(params);
      signature.push(hasRequired ? `params: ${params}` : `params?: ${params}`);
    }
    signature.push('options?: RequestOptions');

    const result = this.resultType(operation);
    for (const word of result.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? []) used.add(word);

    const doc: string[] = [];
    if (operation.summary !== null) {
      doc.push(`${operation.summary.replace(/\.$/, '')}.`, '');
    }
    // The first paragraph says what the call does; the rest (errors, edge cases) is in the API reference, which the @see names.
    // Keeping all of it would double the size of the package.
    doc.push(...docLines(lead(operation.description)));
    const tags: string[] = [];
    if (operation.deprecated) tags.push('@deprecated');
    tags.push(`@see ${REFERENCE}/${operation.spec} \`${operation.documentId}\``);

    const pathArgs = `[${operation.pathParams.join(', ')}]`;
    const paramsArg = params === null ? 'undefined' : 'params';
    const key = JSON.stringify(methodPath(operation));
    const docs = comment(doc, tags, '  ');
    let code = '';
    const dryRun = params === null ? null : this.dryRun(operation);
    if (dryRun !== null) {
      // A dry run answers with a preview, a real call with the record: the overloads tell them apart by `dry_run`. The two an
      // editor picks carry the docs.
      const head = (narrowed: string): string =>
        [...signature.slice(0, -2), `params: ${params} & ${narrowed}`, 'options?: RequestOptions'].join(', ');
      code += docs + `  ${operation.name}(${head('{ dry_run?: false }')}): Promise<${dryRun.real}>;\n`;
      code += docs + `  ${operation.name}(${head('{ dry_run: true }')}): Promise<${dryRun.preview}>;\n`;
      code += `  ${operation.name}(${signature.join(', ')}): Promise<${result}>;\n`;
    } else {
      code += docs;
    }
    code += `  ${operation.name}(${signature.join(', ')}): Promise<${result}> {\n`;
    code += `    return this._connection.call(${key}, ${pathArgs}, ${paramsArg}, options) as Promise<${result}>;\n`;
    code += '  }\n';

    if (operation.name === 'list' && paginated(operation)) {
      const item = this.pageItem(operation)!;
      const allSignature = operation.pathParams.map((name) => `${name}: string`);
      if (params !== null) {
        allSignature.push(hasRequired ? `params: Omit<${params}, 'cursor'>` : `params?: Omit<${params}, 'cursor'>`);
      }
      allSignature.push('options?: RequestOptions');
      code += '\n';
      code += comment(
        [
          'Every item of `list()`, fetching the following pages as the loop reaches them:',
          '',
          `\`for await (const item of client.${methodPath(operation).replace(/\.list$/, '.all')}()) { ... }\``,
          '',
          '`limit` is the page size, not a cap on the items.',
        ],
        [],
        '  ',
      );
      code += `  all(${allSignature.join(', ')}): AsyncGenerator<${item}> {\n`;
      code += `    return this._connection.all(${key}, ${pathArgs}, ${paramsArg}, options) as AsyncGenerator<${item}>;\n`;
      code += '  }\n';
    }
    return code;
  }

  /**
   * The answers of an operation that takes `dry_run`: the preview (the status whose description says "Dry run") and the
   * record a real call returns. `null` when the operation has no such pair.
   */
  private dryRun(operation: Operation): { preview: string; real: string } | null {
    if (operation.fields.dry_run === undefined) return null;
    const models = operation.responses.filter(([, response]) => response.kind === 'model');
    const preview = models.filter(([, response]) => /^dry run/i.test(response.description ?? ''));
    const real = models.filter(([, response]) => !/^dry run/i.test(response.description ?? ''));
    if (preview.length !== 1 || real.length !== 1) return null;
    const type = (response: Response): string => withMeta(this.decl(response.type!), response);
    return { preview: type(preview[0]![1]), real: type(real[0]![1]) };
  }

  private pageItem(operation: Operation): string | null {
    const page = operation.responses.find(([, response]) => response.kind === 'page');
    return page === undefined ? null : this.decl(page[1].item!);
  }

  /** The type the promise of a method resolves to. */
  resultType(operation: Operation): string {
    const item = this.pageItem(operation);
    if (item !== null) {
      return `Page<${item}>`;
    }
    const kind = returns(operation);
    if (kind === 'json') return 'Record<string, unknown>';
    if (kind === 'void') return 'void';
    const types: string[] = [];
    for (const [, response] of operation.responses) {
      if (response.kind === 'model') {
        const type = withMeta(this.decl(response.type!), response);
        if (!types.includes(type)) types.push(type);
      }
    }
    if (kind === 'maybe') types.push('null');
    return types.join(' | ');
  }

  /** The type of the answer a status carries, for the type checks of the examples. */
  answerType(response: Response): string {
    if (response.kind === 'page') {
      return `{ data: ${arrayType(this.decl(response.item!))}; next_cursor?: string | null }`;
    }
    return this.decl(response.type!);
  }

  events(
    base: Record<string, Property>,
    events: Array<{ type: string; name: string; description: string | null; data: TypeInfo }>,
  ): string {
    const used = new Set<string>();
    let body = '';
    body += comment(
      [
        'The envelope every webhook event shares. `type` names the event; `data` (on each event type) carries what happened.',
        '',
        'Delivery is at least once and unordered: de-duplicate on `id` and never move a status backwards.',
      ],
      [],
      '',
    );
    body += `export interface WebhookEventBase {\n${this.members(base)}}\n\n`;
    for (const property of Object.values(base)) {
      for (const word of this.decl(property.type).match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? []) used.add(word);
    }

    for (const event of events) {
      if (this.typeNames.has(event.name)) {
        throw new Error(`The event ${event.type} wants the type name ${event.name}, which is taken.`);
      }
      const data = this.decl(event.data);
      for (const word of data.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? []) used.add(word);
      body += comment(docLines(`\`${event.type}\`: ${event.description ?? ''}`), [], '');
      body += `export interface ${event.name} extends WebhookEventBase {\n  type: ${JSON.stringify(event.type)};\n  data: ${data};\n}\n\n`;
    }

    body += '/** Every event type this SDK version knows. Narrow on `type` after `Webhook.isKnown(event)`. */\n';
    body += `export type WebhookEvent =\n${events.map((event) => `  | ${event.name}`).join('\n')};\n\n`;
    body += "export type WebhookEventType = WebhookEvent['type'];\n\n";
    body += '/** The event types this SDK version knows. */\n';
    body += `export const EVENT_TYPES: readonly WebhookEventType[] = [\n${events.map((event) => `  ${JSON.stringify(event.type)},`).join('\n')}\n];\n`;

    const names = [...used].filter((name) => this.typeNames.has(name)).sort();
    return HEADER + (names.length > 0 ? `import type { ${names.join(', ')} } from './types.js';\n\n` : '') + body;
  }

  resourcesIndex(top: string[]): string {
    let code = HEADER + "import type { Connection } from '../../core/connection.js';\n";
    for (const resource of top) {
      code += `import { ${className([resource])} } from './${fileName(resource)}.js';\n`;
    }
    for (const resource of top) {
      code += `export * from './${fileName(resource)}.js';\n`;
    }
    code += '\n/** The top-level resources of the API. */\nexport class Resources {\n';
    for (const resource of top) {
      code += `  readonly ${resource}: ${className([resource])};\n`;
    }
    code += '\n  /** @internal */\n  constructor(connection: Connection) {\n';
    for (const resource of top) {
      code += `    this.${resource} = new ${className([resource])}(connection);\n`;
    }
    return code + '  }\n}\n';
  }

  /**
   * The examples, packed: the same message or contact recurs in many answers, so each repeated object is kept once and
   * referred to (`unpack()` in src/testing/unpack.ts restores them). A third of the size of the plain JSON.
   */
  examples(responses: Record<string, { status: number; body: unknown }>, events: Record<string, unknown>): string {
    const packed = pack({ responses, events });
    return (
      HEADER +
      "import { unpack } from './unpack.js';\n\n" +
      '/**\n * A realistic answer for every operation and a payload for every webhook event, built from the API reference.\n' +
      ' * The testing fake answers with these.\n *\n * @internal\n */\n' +
      `export const { responses: RESPONSES, events: EVENTS } = unpack(${JSON.stringify(JSON.stringify(packed))}) as {\n` +
      '  responses: Record<string, { status: number; body: unknown }>;\n' +
      '  events: Record<string, Record<string, unknown>>;\n' +
      '};\n'
    );
  }
}

const REFERENCE = 'https://mycomm.cogneer.tech/docs/api';

/** The opening of a description: its first paragraph, cut after the sentence that passes 280 characters. */
function lead(text: string | null): string {
  const paragraph = (
    (text ?? '')
      .replaceAll('\r', '')
      .trim()
      .split(/\n\s*\n/)[0] ?? ''
  ).replace(/\s+/g, ' ');
  const sentences = paragraph.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g) ?? [paragraph];
  let out = '';
  for (const sentence of sentences) {
    out += sentence;
    if (out.length > 280) break;
  }
  return out.trim();
}

/**
 * `{ table, root }`: every object or list whose JSON is longer than 80 characters and that occurs more than once is put in
 * `table` once and replaced by `{ "$ref#": index }` wherever it occurs. The marker key cannot clash with a field of the API.
 */
export function pack(value: unknown): { table: unknown[]; root: unknown } {
  const counts = new Map<string, number>();
  const count = (node: unknown): void => {
    if (node === null || typeof node !== 'object') return;
    const json = JSON.stringify(node);
    if (json.length > 80) counts.set(json, (counts.get(json) ?? 0) + 1);
    Object.values(node).forEach(count);
  };
  count(value);

  const table: unknown[] = [];
  const index = new Map<string, number>();
  const walk = (node: unknown): unknown => {
    if (node === null || typeof node !== 'object') return node;
    const json = JSON.stringify(node);
    const shared = json.length > 80 && (counts.get(json) ?? 0) > 1;
    if (shared && index.has(json)) return { '$ref#': index.get(json) };
    const copy = Array.isArray(node)
      ? node.map(walk)
      : Object.fromEntries(Object.entries(node).map(([key, item]) => [key, walk(item)]));
    if (!shared) return copy;
    index.set(json, table.length);
    table.push(copy);
    return { '$ref#': table.length - 1 };
  };
  return { root: walk(value), table };
}

export function returns(operation: Operation): Returns {
  if (operation.responses.length === 0) {
    // No success answer is documented (an operation that is not enabled yet): hand back the JSON.
    return 'json';
  }
  if (operation.responses.some(([, response]) => response.kind === 'page')) {
    return 'page';
  }
  const models = operation.responses.filter(([, response]) => response.kind === 'model');
  if (models.length === 0) return 'void';
  return models.length < operation.responses.length ? 'maybe' : 'model';
}

export function paginated(operation: Operation): boolean {
  return operation.responses.some(([, response]) => response.kind === 'page') && operation.query.cursor !== undefined;
}

/** `contacts.identities.block`, or `imports.createFromFile` for a multipart variant. */
export function methodPath(operation: Operation): string {
  return [...operation.resource, operation.name].join('.');
}

export function paramsName(operation: Operation): string | null {
  if (Object.keys(operation.fields).length === 0 && Object.keys(operation.query).length === 0) {
    return null;
  }
  return `${pascal(methodPath(operation))}Params`;
}

/** `['contacts', 'identities']` => `ContactsIdentitiesResource`; the suffix keeps it apart from the model `Contact`. */
export function className(path: string[]): string {
  return `${path.map(pascal).join('')}Resource`;
}

/** `webhookEndpoints` => `webhook-endpoints`. */
export function fileName(resource: string): string {
  return resource.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function withMeta(type: string, response: Response): string {
  return response.type?.model !== undefined && !response.type.nullable ? `WithMeta<${type}>` : type;
}

function arrayType(item: string): string {
  return item.includes(' ') ? `Array<${item}>` : `${item}[]`;
}

/** A doc comment, or nothing when there is nothing to say. */
export function comment(lines: string[], tags: string[], pad: string): string {
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  if (lines.length === 0 && tags.length === 0) return '';
  const all = [...lines];
  if (lines.length > 0 && tags.length > 0) all.push('');
  all.push(...tags);
  if (all.length === 1) return `${pad}/** ${all[0]} */\n`;
  return `${pad}/**\n${all.map((line) => `${pad} * ${line}`.trimEnd()).join('\n')}\n${pad} */\n`;
}
