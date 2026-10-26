import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

export type Schema = Record<string, any>;

export interface Flat {
  properties: Record<string, Schema>;
  required: string[];
  description: string | null;
  additionalProperties: unknown;
  /** Property => the named schema it is declared in, so an object nested in it gets one type wherever it is merged. */
  origins: Record<string, string>;
}

export interface RawOperation {
  path: string;
  method: string;
  operation: Schema;
  item: Schema;
}

const SCHEMA_REF = '#/components/schemas/';
const PARAMETER_REF = '#/components/parameters/';

/**
 * One bundled OpenAPI document and the lookups the generator needs on it.
 */
export class Spec {
  readonly doc: Schema;

  /** Path prefix of the API below the origin, for example `/v1`. */
  readonly prefix: string;

  constructor(
    readonly name: string,
    file: string,
  ) {
    const doc = parse(readFileSync(file, 'utf8')) as Schema;
    if (doc === null || typeof doc !== 'object' || !doc.paths) {
      throw new Error(`${file} is not an OpenAPI document.`);
    }
    this.doc = doc;
    const server = String(doc.servers?.[0]?.url ?? '');
    this.prefix = server === '' ? '' : new URL(server).pathname.replace(/\/+$/, '');
  }

  version(): string {
    return String(this.doc.info?.version ?? '0');
  }

  schema(name: string): Schema {
    const schema = this.doc.components?.schemas?.[name];
    if (schema === undefined) {
      throw new Error(`Schema ${name} is not defined in the ${this.name} spec.`);
    }
    return schema;
  }

  hasSchema(name: string): boolean {
    return this.doc.components?.schemas?.[name] !== undefined;
  }

  /** The schema name a `$ref` points at, or null for an inline schema. */
  refName(schema: Schema): string | null {
    const ref = schema?.$ref;
    if (typeof ref !== 'string') {
      return null;
    }
    if (!ref.startsWith(SCHEMA_REF)) {
      throw new Error(`Unsupported schema reference ${ref}.`);
    }
    return ref.slice(SCHEMA_REF.length);
  }

  /** Follows `$ref`s until an inline schema is reached. */
  resolve(schema: Schema): Schema {
    let name: string | null;
    while ((name = this.refName(schema)) !== null) {
      schema = this.schema(name);
    }
    return schema;
  }

  /** An object schema with every `allOf` member merged in. */
  flatten(schema: Schema): Flat {
    let origin: string | null = null;
    let name: string | null;
    while ((name = this.refName(schema)) !== null) {
      origin = name;
      schema = this.schema(name);
    }

    const flat: Flat = {
      properties: {},
      required: [],
      description: schema.description ?? null,
      additionalProperties: schema.additionalProperties ?? null,
      origins: {},
    };

    for (const member of schema.allOf ?? []) {
      const part = this.flatten(member);
      // A later member narrows a property of an earlier one (the event `data` of a webhook envelope).
      Object.assign(flat.properties, part.properties);
      Object.assign(flat.origins, part.origins);
      flat.required.push(...part.required);
      flat.description ??= part.description;
      flat.additionalProperties ??= part.additionalProperties;
    }

    for (const [property, definition] of Object.entries<Schema>(schema.properties ?? {})) {
      flat.properties[property] = definition;
      delete flat.origins[property];
      if (origin !== null) {
        flat.origins[property] = origin;
      }
    }
    flat.required = [...new Set([...flat.required, ...(schema.required ?? [])])];

    return flat;
  }

  /** The schema an `allOf` with a single member stands for: `{allOf: [{$ref: X}], description: ...}` is X. */
  alias(schema: Schema): Schema | null {
    const keys = Object.keys(schema);
    if ((schema.allOf ?? []).length !== 1 || keys.some((key) => !['allOf', 'description', 'examples', 'title'].includes(key))) {
      return null;
    }
    return schema.allOf[0];
  }

  /** Whether a schema describes an object with named fields (directly or through `allOf`). */
  isObject(schema: Schema): boolean {
    schema = this.resolve(schema);
    if (schema.properties !== undefined) {
      return true;
    }
    return (schema.allOf ?? []).some((member: Schema) => this.isObject(member));
  }

  parameter(parameter: Schema): Schema {
    const ref = parameter.$ref;
    if (typeof ref !== 'string') {
      return parameter;
    }
    const name = ref.slice(PARAMETER_REF.length);
    const found = this.doc.components?.parameters?.[name];
    if (found === undefined) {
      throw new Error(`Parameter ${name} is not defined in the ${this.name} spec.`);
    }
    return found;
  }

  operations(): RawOperation[] {
    const operations: RawOperation[] = [];
    for (const [path, item] of Object.entries<Schema>(this.doc.paths)) {
      for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
        if (item[method] !== undefined) {
          operations.push({ path, method, operation: item[method], item });
        }
      }
    }
    return operations;
  }

  /** Webhook event type => the schema of its body and the description of the event. */
  webhooks(): Record<string, { schema: Schema; summary: string | null }> {
    const events: Record<string, { schema: Schema; summary: string | null }> = {};
    for (const [type, item] of Object.entries<Schema>(this.doc.webhooks ?? {})) {
      const schema = item.post?.requestBody?.content?.['application/json']?.schema;
      if (schema !== null && typeof schema === 'object') {
        events[type] = { schema, summary: item.post?.description ?? null };
      }
    }
    return events;
  }
}
