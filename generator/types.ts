import { propertyKey, singular, pascal } from './names.js';
import type { Schema, Spec } from './spec.js';

/**
 * A TypeScript type as the generator writes it, without its nullability.
 *
 * Input object types are written as `@@input:Name@@` until the end of the run, when it is known whether the name collides
 * with a model (then the input becomes `NameInput`).
 */
export interface TypeInfo {
  ts: string;
  nullable: boolean;
  model?: string;
  enum?: string;
  /** A file of a multipart request. */
  file?: boolean;
}

export interface Property {
  type: TypeInfo;
  required: boolean;
  description: string | null;
}

export interface Field extends Property {
  constraints: Record<string, unknown>;
}

export interface Model {
  properties: Record<string, Property>;
  description: string | null;
}

export interface Enum {
  values: string[];
  description: string | null;
}

export interface Input {
  fields: Record<string, Field>;
  description: string | null;
}

export type Rule = [string, ...unknown[]];

export function t(ts: string, nullable = false, extra: Partial<TypeInfo> = {}): TypeInfo {
  return { ts, nullable, ...extra };
}

/** The type with its nullability. */
export function declaration(type: TypeInfo): string {
  if (!type.nullable || type.ts === 'unknown' || type.ts === 'null') {
    return type.ts;
  }
  return `${type.ts} | null`;
}

/** A union of type expressions, without repeats; `unknown` swallows the rest. */
export function union(types: string[]): string {
  const parts: string[] = [];
  for (const type of types) {
    for (const part of splitUnion(type)) {
      if (!parts.includes(part)) {
        parts.push(part);
      }
    }
  }
  return parts.includes('unknown') ? 'unknown' : parts.join(' | ');
}

/** The members of a top-level union (not those inside brackets or braces). */
function splitUnion(type: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < type.length; i++) {
    const char = type[i]!;
    if ('<({['.includes(char)) depth++;
    if ('>)}]'.includes(char)) depth--;
    if (depth === 0 && type.startsWith(' | ', i)) {
      parts.push(current);
      current = '';
      i += 2;
      continue;
    }
    current += char;
  }
  parts.push(current);
  return parts.map((part) => part.trim()).filter((part) => part !== '');
}

export function arrayOf(item: string): string {
  return /^[A-Za-z0-9_@:<>]+$/.test(item) && !item.includes('|') ? `${item}[]` : `Array<${item}>`;
}

/**
 * Maps OpenAPI schemas to TypeScript types and collects the models, enums and inputs those types need.
 */
export class Types {
  models: Record<string, Model> = {};
  enums: Record<string, Enum> = {};
  inputs: Record<string, Input> = {};
  /** Corrections of `nullable` that were applied. */
  corrected = new Set<string>();

  private sources: Record<string, string> = {};
  /** Above zero while an inline request object is described: its enums stay inline. */
  private inShape = 0;

  constructor(
    private readonly enumNames: Record<string, string> = {},
    private readonly modelNames: Record<string, string> = {},
    private readonly nullable: Record<string, string> = {},
    private readonly plainEnums: string[] = [],
    private readonly skipFields: Record<string, string> = {},
  ) {}

  /** The type of a value the API returns. `context` names an inline object or enum at this position; `path` is its place. */
  output(spec: Spec, schema: Schema, context: string, path: string): TypeInfo {
    const ref = spec.refName(schema);
    if (ref !== null) {
      const target = spec.schema(ref);
      if (spec.isObject(target)) {
        // A named object can itself allow null (`type: [object, 'null']`).
        const name = this.model(spec, ref, target);
        return t(name, typeOf(target)[1], { model: name });
      }
      return this.output(spec, target, ref, ref);
    }

    if (schema.allOf !== undefined) {
      const alias = spec.alias(schema);
      if (alias !== null) {
        return this.output(spec, alias, context, path);
      }
      const name = this.model(spec, context, schema);
      return t(name, false, { model: name });
    }

    if (schema.oneOf !== undefined || schema.anyOf !== undefined) {
      const variants: Schema[] = schema.oneOf ?? schema.anyOf;
      const rest = variants.filter((variant) => !isNull(variant));
      const nullable = rest.length < variants.length;
      if (rest.length === 0) {
        return t('null');
      }
      const types = rest.map((variant) => this.output(spec, variant, context, path));
      if (types.length === 1) {
        return { ...types[0]!, nullable: types[0]!.nullable || nullable };
      }
      return t(union(types.map((type) => declaration(type))), nullable);
    }

    const [type, nullable] = typeOf(schema);

    if (schema.enum !== undefined) {
      return this.enumType(schema, context, path, nullable, true);
    }
    if ('const' in schema) {
      return t(literal(schema.const), nullable);
    }
    if (Array.isArray(type)) {
      return t(union(type.map(scalar)), nullable);
    }

    if (type === 'array') {
      const item = this.output(spec, schema.items ?? {}, singular(context), `${path}[]`);
      return t(arrayOf(declaration(item)), nullable);
    }

    if (type === 'object' || schema.properties !== undefined) {
      if (Object.keys(schema.properties ?? {}).length > 0) {
        const name = this.model(spec, context, schema);
        return t(name, nullable, { model: name });
      }
      const values = schema.additionalProperties;
      if (values !== null && typeof values === 'object' && Object.keys(values).length > 0) {
        const value = this.output(spec, values, singular(context), `${path}{}`);
        return t(`Record<string, ${declaration(value)}>`, nullable);
      }
      return t('Record<string, unknown>', nullable);
    }

    switch (type) {
      case 'string':
      case 'integer':
      case 'number':
      case 'boolean':
        return t(scalar(type), nullable);
      case 'null':
        return t('null');
      case null:
        return t('unknown');
      default:
        throw new Error(`Unsupported type ${String(type)} at ${path}.`);
    }
  }

  /** The type of a value the caller sends. */
  input(spec: Spec, schema: Schema, context: string, path: string): TypeInfo {
    const ref = spec.refName(schema);
    if (ref !== null) {
      const target = spec.schema(ref);
      if (spec.isObject(target)) {
        return t(`@@input:${this.inputObject(spec, ref, target)}@@`, typeOf(target)[1]);
      }
      return this.input(spec, target, ref, ref);
    }

    if (schema.allOf !== undefined) {
      const alias = spec.alias(schema);
      if (alias !== null) {
        return this.input(spec, alias, context, path);
      }
      return t(this.shape(spec, schema));
    }

    if (schema.oneOf !== undefined || schema.anyOf !== undefined) {
      const variants: Schema[] = schema.oneOf ?? schema.anyOf;
      const rest = variants.filter((variant) => !isNull(variant));
      const nullable = rest.length < variants.length;
      const types = rest.map((variant) => this.input(spec, variant, context, path));
      if (types.length === 1) {
        return { ...types[0]!, nullable: types[0]!.nullable || nullable };
      }
      return t(union(types.map((type) => declaration(type))), nullable, { file: types.some((type) => type.file) });
    }

    const [type, nullable] = typeOf(schema);

    if (schema.enum !== undefined) {
      return this.enumType(schema, context, path, nullable, false);
    }
    if ('const' in schema) {
      return t(literal(schema.const), nullable);
    }
    if (Array.isArray(type)) {
      return t(union(type.map(scalar)), nullable);
    }

    if (type === 'array') {
      const item = this.input(spec, schema.items ?? {}, singular(context), `${path}[]`);
      return t(arrayOf(declaration(item)), nullable);
    }

    if (type === 'object' || schema.properties !== undefined) {
      if (Object.keys(schema.properties ?? {}).length === 0) {
        const values = schema.additionalProperties;
        if (values !== null && typeof values === 'object' && Object.keys(values).length > 0) {
          const value = this.input(spec, values, singular(context), `${path}{}`);
          return t(`Record<string, ${declaration(value)}>`, nullable);
        }
      }
      return t(this.shape(spec, schema), nullable);
    }

    if (type === 'string' && (schema.format === 'date-time' || schema.format === 'date')) {
      return t(schema.format === 'date-time' ? 'Date | string' : 'string', nullable);
    }
    if (type === 'string' && schema.format === 'binary') {
      return t('Uploadable', nullable, { file: true });
    }

    switch (type) {
      case 'string':
      case 'integer':
      case 'number':
      case 'boolean':
        return t(scalar(type), nullable);
      case 'null':
        return t('null');
      case null:
        return t('unknown');
      default:
        throw new Error(`Unsupported input type ${String(type)} at ${path}.`);
    }
  }

  /** The fields of a request body (or of a nested input object), in declaration order. */
  fields(spec: Spec, schema: Schema, context: string, path: string): Record<string, Field> {
    const flat = spec.flatten(schema);
    const fields: Record<string, Field> = {};
    for (const [name, property] of Object.entries(flat.properties)) {
      if (this.skipFields[`${path}.${name}`] !== undefined) {
        continue;
      }
      fields[name] = {
        type: this.input(spec, property, context + pascal(name), `${path}.${name}`),
        required: flat.required.includes(name),
        description: property.description ?? null,
        constraints: this.constraints(spec, property),
      };
    }
    return fields;
  }

  /** The limits a request value must keep, from its schema: what the guard checks before a call is sent. */
  constraints(spec: Spec, property: Schema): Record<string, unknown> {
    let schema = spec.resolve(property);
    const alias = spec.alias(schema);
    if (alias !== null) {
      schema = spec.resolve(alias);
    }
    for (const keyword of ['oneOf', 'anyOf']) {
      if (schema[keyword] !== undefined) {
        const branches = (schema[keyword] as Schema[]).filter((branch) => !isNull(branch));
        if (branches.length === 1) {
          schema = spec.resolve(branches[0]!);
        }
      }
    }

    const found: Record<string, unknown> = {};
    if (schema.enum !== undefined) {
      const values = (schema.enum as unknown[]).filter((value) => typeof value === 'string');
      if (values.length > 0) {
        found.enum = values;
      }
    }
    const keywords: Record<string, string> = {
      minimum: 'min',
      maximum: 'max',
      minLength: 'minLength',
      maxLength: 'maxLength',
      pattern: 'pattern',
      minItems: 'minItems',
      maxItems: 'maxItems',
      maxProperties: 'maxProperties',
      'x-max-json-bytes': 'maxBytes',
    };
    for (const [keyword, name] of Object.entries(keywords)) {
      if (schema[keyword] !== undefined && schema[keyword] !== null) {
        found[name] = schema[keyword];
      }
    }
    if (schema.format === 'uuid' || (schema.type === 'array' && spec.resolve(schema.items ?? {}).format === 'uuid')) {
      found.uuid = true;
    }
    const extra = schema.additionalProperties;
    if (
      extra !== null &&
      typeof extra === 'object' &&
      Array.isArray(extra.type) &&
      extra.type.every((type: string) => ['string', 'number', 'integer', 'boolean', 'null'].includes(type))
    ) {
      found.scalarValues = true;
    }
    return found;
  }

  /** The rules between the fields of a request body, from the JSON Schema keywords of its schema. */
  rules(spec: Spec, schema: Schema): Rule[] {
    const rules: Rule[] = [];
    this.collectRules(spec, schema, rules);
    return rules;
  }

  private collectRules(spec: Spec, schema: Schema, rules: Rule[]): void {
    schema = spec.resolve(schema);
    for (const member of schema.allOf ?? []) {
      this.collectRules(spec, member, rules);
    }
    for (const [keyword, rule] of [
      ['oneOf', 'exactlyOne'],
      ['anyOf', 'atLeastOne'],
    ] as const) {
      let names: string[] = [];
      for (const branch of (schema[keyword] ?? []) as Schema[]) {
        const keys = Object.keys(branch);
        if (Array.isArray(branch.required) && branch.required.length === 1 && keys.length === 1 && keys[0] === 'required') {
          names.push(branch.required[0]);
        } else {
          names = [];
          break;
        }
      }
      if (names.length > 1) {
        rules.push([rule, names]);
      }
    }
    for (const [field, needs] of Object.entries<string[]>(schema.dependentRequired ?? {})) {
      for (const need of needs) {
        rules.push(['requires', field, need]);
      }
    }
    if (schema.if !== undefined && schema.then !== undefined) {
      for (const [when, condition] of Object.entries<Schema>(schema.if.properties ?? {})) {
        if ('const' in condition) {
          for (const field of schema.then.required ?? []) {
            rules.push(['requiredWhen', field, when, condition.const]);
          }
        }
      }
    }
  }

  /** Registers the model of an object schema and returns its name. */
  private model(spec: Spec, name: string, schema: Schema): string {
    name = this.modelNames[name] ?? name;
    const source = JSON.stringify(withoutAnnotations(schema));
    const known = this.sources[`model:${name}`];
    if (known !== undefined) {
      if (known !== source) {
        throw new Error(`Two different schemas want the model name ${name}.`);
      }
      return name;
    }
    this.sources[`model:${name}`] = source;

    const flat = spec.flatten(schema);
    // Registered before its properties are resolved, so a schema that refers to itself terminates.
    const model: Model = { properties: {}, description: flat.description };
    this.models[name] = model;

    for (const [property, definition] of Object.entries(flat.properties)) {
      const owner = flat.origins[property] ?? name;
      const type = this.output(spec, definition, owner + pascal(property), `${owner}.${property}`);
      const required = flat.required.includes(property);

      if (this.nullable[`${owner}.${property}`] !== undefined) {
        if (type.nullable || !required) {
          throw new Error(`The spec now allows null for ${owner}.${property}: remove its correction from generator/config.ts.`);
        }
        type.nullable = true;
        this.corrected.add(`${owner}.${property}`);
      }

      model.properties[property] = { type, required, description: definition.description ?? null };
    }

    return name;
  }

  private inputObject(spec: Spec, schemaName: string, schema: Schema): string {
    const name = schemaName.replace(/Request$/, '');
    const source = JSON.stringify(schema);
    const known = this.sources[`input:${name}`];
    if (known !== undefined) {
      if (known !== source) {
        throw new Error(`Two different schemas want the input name ${name}.`);
      }
      return name;
    }
    this.sources[`input:${name}`] = source;
    const input: Input = { fields: {}, description: spec.flatten(schema).description };
    this.inputs[name] = input;
    input.fields = this.fields(spec, schema, name, schemaName);
    return name;
  }

  private enumType(schema: Schema, context: string, path: string, nullable: boolean, output: boolean): TypeInfo {
    const all = schema.enum as unknown[];
    const values = all.filter((value) => value !== null);
    nullable = nullable || values.length < all.length;

    if (values.length === 0) {
      return t('null');
    }
    if (values.every((value) => typeof value === 'boolean')) {
      return t('boolean', nullable);
    }
    if (!values.every((value) => typeof value === 'string')) {
      // A list of allowed numbers: the number type says enough.
      return t(union(values.map((value) => scalarOf(value))), nullable);
    }
    const strings = values as string[];
    if (strings.length < 2 || this.inShape > 0) {
      // A single allowed value is a constant, not a choice worth a named type; an inline request object keeps its lists inline.
      return output ? t('string', nullable) : t(union(strings.map((value) => literal(value))), nullable);
    }

    const name = this.enumNames[path] ?? context;
    if (this.plainEnums.includes(name)) {
      return t('string', nullable);
    }
    const known = this.enums[name]?.values;
    if (
      known !== undefined &&
      (known.some((value) => !strings.includes(value)) || strings.some((value) => !known.includes(value)))
    ) {
      throw new Error(`Enum ${name} at ${path} has other values than its earlier definition.`);
    }
    this.enums[name] ??= { values: strings, description: schema.description ?? null };

    return t(output ? `Open<${name}>` : name, nullable, { enum: name });
  }

  /** The type of an inline request object. */
  private shape(spec: Spec, schema: Schema): string {
    const flat = spec.flatten(schema);
    if (Object.keys(flat.properties).length === 0) {
      return 'Record<string, unknown>';
    }
    this.inShape++;
    const parts: string[] = [];
    for (const [name, property] of Object.entries(flat.properties)) {
      const type = this.input(spec, property, 'Inline', 'inline');
      parts.push(`${propertyKey(name)}${flat.required.includes(name) ? '' : '?'}: ${declaration(type)}`);
    }
    this.inShape--;
    return `{ ${parts.join('; ')} }`;
  }
}

/** The `type` of a schema without `null`, and whether `null` was among them. */
export function typeOf(schema: Schema): [string | string[] | null, boolean] {
  const type = schema.type ?? null;
  if (!Array.isArray(type)) {
    return [type, false];
  }
  const rest = type.filter((name: string) => name !== 'null');
  const nullable = rest.length < type.length;
  if (rest.length === 0) return ['null', false];
  if (rest.length === 1) return [rest[0], nullable];
  return [rest, nullable];
}

export function isNull(schema: Schema): boolean {
  const type = schema.type;
  return (
    type === 'null' ||
    (Array.isArray(type) && type.length === 1 && type[0] === 'null') ||
    (Array.isArray(schema.enum) && schema.enum.length === 1 && schema.enum[0] === null)
  );
}

function scalar(type: string): string {
  switch (type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      return 'Record<string, unknown>';
    case 'array':
      return 'unknown[]';
    default:
      throw new Error(`Unsupported scalar type ${type}.`);
  }
}

function scalarOf(value: unknown): string {
  switch (typeof value) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    default:
      return 'unknown';
  }
}

function literal(value: unknown): string {
  return value === null
    ? 'null'
    : typeof value === 'string'
      ? `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`
      : JSON.stringify(value);
}

/** A schema without the keys that do not change its shape, so two copies that differ only in their wording count as the same. */
function withoutAnnotations(schema: unknown): unknown {
  if (Array.isArray(schema)) {
    return schema.map(withoutAnnotations);
  }
  if (schema === null || typeof schema !== 'object') {
    return schema;
  }
  const copy: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema)) {
    if (!['description', 'examples', 'title'].includes(key)) {
      copy[key] = withoutAnnotations(value);
    }
  }
  return copy;
}
