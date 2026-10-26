/*
 * Generates everything of the SDK that follows from the API reference: types, the operation table, resources, webhook
 * events, the examples of the testing fake, and the datasets and type checks the tests run every operation with.
 *
 *   npm run generate
 */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import { config } from './config.js';
import { Emitter, HEADER, fileName, methodPath, returns } from './emitter.js';
import { UUID, example, minimalExample } from './examples.js';
import { pascal } from './names.js';
import { Operations, type Operation } from './operations.js';
import { Spec, type Schema } from './spec.js';
import { Types, type Property } from './types.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Directories and files the generator owns: emptied before each run so nothing stale survives. */
const OWNED = ['src/generated', 'src/testing/examples.ts', 'test/generated'];

const files: Record<string, string> = {};

const types = new Types(config.enums, config.models, config.nullable, config.plainEnums, config.skipFields);
const emitter = new Emitter();
const reader = new Operations(types, config.multipart, config.operations);

const specs: Record<string, Spec> = {};
const operations: Operation[] = [];
for (const [name, file] of Object.entries(config.specs)) {
  specs[name] = new Spec(name, join(root, file));
  operations.push(...reader.read(specs[name]));
}
const main = Object.values(specs)[0]!;

// The errors compare against it, so it exists even when no answer refers to it.
types.output(main, { $ref: '#/components/schemas/ErrorCode' }, 'ErrorCode', 'ErrorCode');

// Webhook events.
const webhooks = main.webhooks();
const envelope = main.flatten({ $ref: '#/components/schemas/WebhookEnvelope' });
const base: Record<string, Property> = {};
for (const [property, definition] of Object.entries(envelope.properties)) {
  if (property !== 'data') {
    base[property] = {
      type: types.output(main, definition, `WebhookEnvelope${pascal(property)}`, `WebhookEnvelope.${property}`),
      required: envelope.required.includes(property),
      description: definition.description ?? null,
    };
  }
}
const events: Array<{ type: string; name: string; description: string | null; data: ReturnType<Types['output']> }> = [];
const eventExamples: Record<string, unknown> = {};
const eventMinimal: Record<string, unknown> = {};
for (const [type, { schema, summary }] of Object.entries(webhooks)) {
  const flat = main.flatten(schema);
  const extra = Object.keys(flat.properties).filter((key) => envelope.properties[key] === undefined);
  if (extra.length > 0) {
    throw new Error(`Webhook ${type} has fields outside the envelope: ${extra.join(', ')}.`);
  }
  const name = pascal(type);
  events.push({
    type,
    name: `${name}Event`,
    description: summary,
    data: types.output(main, flat.properties.data ?? {}, `${name}Data`, `webhook:${type}.data`),
  });
  eventExamples[type] = example(main, schema);
  eventMinimal[type] = minimalExample(main, schema);
}

const unused = Object.keys(config.nullable).filter((key) => !types.corrected.has(key));
if (unused.length > 0) {
  throw new Error(`These corrections in generator/config.ts match no field of the spec: ${unused.join(', ')}.`);
}

files['src/generated/types.ts'] = emitter.types(types.enums, types.models, types.inputs, operations);
files['src/generated/events.ts'] = emitter.events(base, events);
files['src/generated/operations.ts'] = emitter.operations(operations);

// Resources: a tree keyed by resource path ("contacts", "contacts.identities").
const nodes = new Map<string, { path: string[]; operations: Operation[]; children: string[] }>();
for (const operation of operations) {
  if (operation.resource.length === 0) {
    throw new Error(`${operation.id} has no resource segment.`);
  }
  for (let depth = 1; depth <= operation.resource.length; depth++) {
    const path = operation.resource.slice(0, depth);
    const key = path.join('.');
    if (!nodes.has(key)) nodes.set(key, { path, operations: [], children: [] });
    const child = operation.resource[depth];
    if (child !== undefined && !nodes.get(key)!.children.includes(child)) nodes.get(key)!.children.push(child);
  }
  nodes.get(operation.resource.join('.'))!.operations.push(operation);
}
const top: string[] = [];
for (const [key, node] of nodes) {
  const names = node.operations.map((operation) => operation.name);
  if (new Set(names).size !== names.length || names.some((name) => node.children.includes(name))) {
    throw new Error(`Two operations of ${key} would get the same method name.`);
  }
  if (node.path.length === 1) top.push(key);
}
for (const resource of top) {
  const group = [...nodes.values()].filter((node) => node.path[0] === resource);
  files[`src/generated/resources/${fileName(resource)}.ts`] = emitter.resourceFile(group);
}
files['src/generated/resources/index.ts'] = emitter.resourcesIndex(top);

// The answer the fake gives per operation: the highest documented success status.
const responses: Record<string, { status: number; body: unknown }> = {};
for (const operation of operations) {
  const last = operation.responses[operation.responses.length - 1];
  if (last === undefined) continue;
  const [status, response] = last;
  responses[operation.id] = {
    status,
    body: response.schema === undefined ? null : example(specs[operation.spec]!, response.schema),
  };
}
files['src/testing/examples.ts'] = emitter.examples(sortKeys(responses), eventExamples);

files['test/generated/operations.json'] = JSON.stringify(dataset(), null, 2) + '\n';
files['test/generated/minimal.json'] = JSON.stringify(minimal(), null, 2) + '\n';
files['test/generated/types.check.ts'] = typeChecks();

await write();

console.log(
  `Generated ${operations.length} operations, ${Object.keys(types.models).length} models, ${Object.keys(types.enums).length} enums, ` +
    `${Object.keys(types.inputs).length} inputs and ${events.length} events into ${Object.keys(files).length} files.`,
);

/** One row per method: how to call it with example arguments and what must come out. */
function dataset(): unknown[] {
  return operations.map((operation) => {
    const spec = specs[operation.spec]!;
    const source = requestSchemas(spec, operation);
    let path = operation.path;
    for (const name of operation.pathParams) path = path.replace(`{${name}}`, UUID);

    const params: Record<string, unknown> = {};
    for (const [name, field] of Object.entries(operation.fields)) {
      if (field.required) params[name] = field.type.file === true ? '@file' : example(spec, source.fields[name] ?? {}, name);
    }
    // A call must satisfy the rules between fields too: one of an exclusive or at-least-one group.
    for (const rule of operation.rules) {
      const names = rule[1] as string[];
      if ((rule[0] === 'exactlyOne' || rule[0] === 'atLeastOne') && !names.some((name) => name in params)) {
        const name = names.includes('body') ? 'body' : names[0]!;
        params[name] = example(spec, source.fields[name] ?? {}, name);
      }
    }
    // And a field required by the value of another, or by the presence of another.
    for (const rule of operation.rules) {
      const needed =
        rule[0] === 'requiredWhen' && params[rule[2] as string] === rule[3]
          ? (rule[1] as string)
          : rule[0] === 'requires' && (rule[1] as string) in params
            ? (rule[2] as string)
            : null;
      if (needed !== null && !(needed in params)) params[needed] = example(spec, source.fields[needed] ?? {}, needed);
    }
    for (const [name, parameter] of Object.entries(operation.query)) {
      if (parameter.required) params[name] = example(spec, source.query[name] ?? {}, name);
    }

    const hasParams = Object.keys(operation.fields).length + Object.keys(operation.query).length > 0;
    const answer = operation.responses[operation.responses.length - 1];
    const kind = returns(operation);
    return {
      operation: operation.id,
      key: methodPath(operation),
      resource: operation.resource,
      method: operation.name,
      args: [...operation.pathParams.map(() => UUID), ...(hasParams ? [params] : [])],
      http: operation.http,
      path,
      format: operation.format,
      returns: answer?.[1].kind === 'none' && kind === 'maybe' ? 'null' : kind,
    };
  });
}

/** The sparsest success answer of every status of every operation, and the sparsest payload of every event. */
function minimal(): unknown {
  const answers: unknown[] = [];
  for (const operation of operations) {
    for (const [status, response] of operation.responses) {
      if (response.schema !== undefined) {
        answers.push({
          operation: operation.id,
          key: methodPath(operation),
          status,
          body: minimalExample(specs[operation.spec]!, response.schema),
        });
      }
    }
  }
  return { responses: answers, events: eventMinimal };
}

/**
 * A file the type checker reads (`npm run lint`): every example answer (full and sparsest) must fit the type the SDK
 * declares for it, and every method must accept the example arguments of the dataset.
 */
function typeChecks(): string {
  const lines: string[] = [];
  const used = new Set<string>();
  const note = (type: string): string => {
    for (const word of type.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? []) used.add(word);
    return type;
  };
  let index = 0;
  for (const operation of operations) {
    const spec = specs[operation.spec]!;
    for (const [status, response] of operation.responses) {
      if (response.schema === undefined) continue;
      const type = note(emitter.answerType(response));
      for (const [label, body] of [
        ['full', example(spec, response.schema)],
        ['minimal', minimalExample(spec, response.schema)],
      ] as const) {
        lines.push(`// ${operation.id} ${status} (${label})`);
        lines.push(`export const answer${index++} = ${JSON.stringify(body)} satisfies ${type};`);
      }
    }
  }
  for (const event of events) {
    for (const [label, body] of [
      ['full', eventExamples[event.type]],
      ['minimal', eventMinimal[event.type]],
    ] as const) {
      lines.push(`// ${event.type} (${label})`);
      lines.push(`export const event${index++} = ${JSON.stringify(body)} satisfies ${event.name};`);
    }
  }

  const calls: string[] = [];
  for (const row of dataset() as Array<{ resource: string[]; method: string; args: unknown[]; operation: string }>) {
    const args = row.args.map((arg) => JSON.stringify(arg).replaceAll('"@file"', 'new Blob(["phone\\n"])'));
    calls.push(`  await client.${[...row.resource, row.method].join('.')}(${args.join(', ')});`);
  }

  const names = [...used].filter((name) => emitter.typeNames.has(name)).sort();
  const eventNames = events.map((event) => event.name).sort();
  return (
    HEADER +
    "import type { MyComm } from '../../src/index.js';\n" +
    (names.length > 0 ? `import type { ${names.join(', ')} } from '../../src/generated/types.js';\n` : '') +
    `import type { ${eventNames.join(', ')} } from '../../src/generated/events.js';\n\n` +
    lines.join('\n') +
    '\n\nexport async function calls(client: MyComm): Promise<void> {\n' +
    calls.join('\n') +
    '\n}\n'
  );
}

/** The raw schemas behind the fields and query parameters of an operation, for building example arguments. */
function requestSchemas(spec: Spec, operation: Operation): { fields: Record<string, Schema>; query: Record<string, Schema> } {
  const item = spec.doc.paths[operation.path.slice(spec.prefix.length)];
  const definition = item[operation.http.toLowerCase()];
  let fields: Record<string, Schema> = {};
  for (const [contentType, media] of Object.entries<Schema>(definition.requestBody?.content ?? {})) {
    if ((contentType.startsWith('multipart/') ? 'multipart' : 'json') === operation.format) {
      fields = spec.flatten(media.schema ?? {}).properties;
    }
  }
  const query: Record<string, Schema> = {};
  for (const reference of [...(item.parameters ?? []), ...(definition.parameters ?? [])]) {
    const parameter = spec.parameter(reference);
    if (parameter.in === 'query') query[String(parameter.name)] = parameter.schema ?? {};
  }
  return { fields, query };
}

function sortKeys<T>(record: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(record).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

async function write(): Promise<void> {
  for (const owned of OWNED) {
    rmSync(join(root, owned), { recursive: true, force: true });
  }
  const options = (await resolveConfig(join(root, 'src/index.ts'))) ?? {};
  for (const [path, contents] of Object.entries(files)) {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    const parser = path.endsWith('.json') ? 'json' : 'typescript';
    writeFileSync(target, await format(contents, { ...options, parser }));
  }
}
