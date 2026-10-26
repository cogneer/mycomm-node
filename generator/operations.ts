import { pascal } from './names.js';
import type { Schema, Spec } from './spec.js';
import { t, type Field, type Rule, type TypeInfo, type Types } from './types.js';

export interface Response {
  kind: 'none' | 'page' | 'model';
  description: string | null;
  type?: TypeInfo;
  item?: TypeInfo;
  schema?: Schema;
}

export interface Operation {
  /** The SDK's name, for example `contacts.identities.block`. */
  id: string;
  /** The document's operation id, for example `blockContactIdentity`. */
  documentId: string;
  spec: string;
  resource: string[];
  /** The method name; differs from the last segment of `id` for the multipart variant of an operation. */
  name: string;
  http: string;
  path: string;
  pathParams: string[];
  summary: string | null;
  description: string | null;
  deprecated: boolean;
  format: 'none' | 'json' | 'multipart';
  fields: Record<string, Field>;
  query: Record<string, Field>;
  rules: Rule[];
  /** Success status => answer, in ascending order. */
  responses: Array<[number, Response]>;
}

/**
 * Reads the operations of a spec into the shape the emitter works from.
 */
export class Operations {
  constructor(
    private readonly types: Types,
    private readonly multipartNames: Record<string, string> = {},
    private readonly operationNames: Record<string, string> = {},
  ) {}

  read(spec: Spec): Operation[] {
    return spec.operations().flatMap(({ path, method, operation, item }) => this.operation(spec, path, method, operation, item));
  }

  private operation(spec: Spec, path: string, method: string, operation: Schema, item: Schema): Operation[] {
    const documentId = operation.operationId;
    if (typeof documentId !== 'string') {
      throw new Error(`${method} ${path} has no operationId.`);
    }
    // A table is required for the real documents; a spec without one (a test fixture) keeps its ids.
    const id = Object.keys(this.operationNames).length === 0 ? documentId : this.operationNames[documentId];
    if (id === undefined) {
      throw new Error(`${method} ${path} (${documentId}) has no SDK name: add it to 'operations' in generator/config.ts.`);
    }
    const segments = id.split('.');
    const name = segments.pop()!;
    const context = pascal(id);

    const base = {
      id,
      documentId,
      spec: spec.name,
      resource: segments,
      http: method.toUpperCase(),
      path: spec.prefix + path,
      pathParams: [...path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!),
      summary: operation.summary ?? null,
      description: operation.description ?? null,
      deprecated: operation.deprecated === true,
      query: this.query(spec, [...(item.parameters ?? []), ...(operation.parameters ?? [])], context, id),
      responses: this.responses(spec, operation.responses ?? {}, context, id),
    };

    const bodies: Array<{ format: 'json' | 'multipart'; fields: Record<string, Field>; rules: Rule[] }> = [];
    for (const [contentType, media] of Object.entries<Schema>(operation.requestBody?.content ?? {})) {
      const schema = media.schema ?? {};
      const ref = spec.refName(schema);
      const format = contentType.startsWith('multipart/') ? 'multipart' : 'json';
      bodies.push({
        format,
        rules: format === 'json' ? this.types.rules(spec, schema) : [],
        fields: this.types.fields(spec, schema, ref === null ? context : ref.replace(/Request$/, ''), ref ?? context),
      });
    }

    if (bodies.length === 0) {
      return [{ ...base, name, format: 'none', fields: {}, rules: [] }];
    }

    return bodies.map((body) => {
      let variant = name;
      if (body.format === 'multipart' && bodies.length > 1) {
        const named = this.multipartNames[id];
        if (named === undefined) {
          throw new Error(`${id} takes JSON and multipart bodies: name its multipart method in generator/config.ts.`);
        }
        variant = named;
      }
      return { ...base, name: variant, format: body.format, fields: body.fields, rules: body.rules };
    });
  }

  private query(spec: Spec, parameters: Schema[], context: string, id: string): Record<string, Field> {
    const query: Record<string, Field> = {};
    for (const reference of parameters) {
      const parameter = spec.parameter(reference);
      if (parameter.in !== 'query') {
        continue;
      }

      const name = String(parameter.name);
      const schema: Schema = parameter.schema ?? {};
      let description: string | null = parameter.description ?? null;
      let type: TypeInfo;

      // A filter is a plain string on the wire (several values are comma-separated), so an inline list of values is
      // documented instead of turned into a type: the server may accept more values than this SDK version knows.
      if (schema.enum !== undefined) {
        description = `${description ?? ''} One of: ${listOf(schema.enum)}.`.trim();
        type = t('string');
      } else if (schema.type === 'array' && parameter.explode === false) {
        // A comma list (`style: form, explode: false`): pass a list, or the comma-separated text itself.
        const items = spec.resolve(schema.items ?? {});
        if (items.enum !== undefined) {
          description = `${description ?? ''} Values: ${listOf(items.enum)}.`.trim();
        }
        type = t('string[] | string');
      } else {
        type = this.types.input(spec, schema, context + pascal(name), `${id}?${name}`);
      }

      const constraints = this.types.constraints(spec, schema);
      delete constraints.enum;
      query[name] = { type, required: parameter.required === true, description, constraints };
    }

    // Filters first, then the paging pair.
    const ordered: Record<string, Field> = {};
    for (const [name, field] of Object.entries(query)) {
      if (name !== 'limit' && name !== 'cursor') ordered[name] = field;
    }
    for (const name of ['limit', 'cursor']) {
      if (query[name] !== undefined) ordered[name] = query[name];
    }
    return ordered;
  }

  /** The success answers by status: nothing, one page of a list, or an object. */
  private responses(spec: Spec, responses: Schema, context: string, id: string): Array<[number, Response]> {
    const success: Array<[number, Response]> = [];
    for (const [code, response] of Object.entries<Schema>(responses)) {
      const status = Number(code);
      if (!(status >= 200 && status <= 299)) {
        continue;
      }

      const schema = response.content?.['application/json']?.schema;
      if (schema === null || typeof schema !== 'object') {
        success.push([status, { kind: 'none', description: response.description ?? null }]);
        continue;
      }

      if (spec.refName(schema) === null) {
        const flat = spec.flatten(schema);
        const data = flat.properties.data !== undefined ? spec.resolve(flat.properties.data) : null;
        if (
          data !== null &&
          data.type === 'array' &&
          Object.keys(flat.properties).every((key) => key === 'data' || key === 'next_cursor')
        ) {
          success.push([
            status,
            {
              kind: 'page',
              description: response.description ?? null,
              item: this.types.output(spec, data.items ?? {}, `${context}Item`, `${id}[]`),
              schema,
            },
          ]);
          continue;
        }
      }

      success.push([
        status,
        {
          kind: 'model',
          description: response.description ?? null,
          type: this.types.output(spec, schema, `${context}Response`, `${id}()`),
          schema,
        },
      ]);
    }
    return success.sort((a, b) => a[0] - b[0]);
  }
}

function listOf(values: unknown[]): string {
  return values
    .filter((value) => typeof value === 'string')
    .map((value) => `\`${value}\``)
    .join(', ');
}
