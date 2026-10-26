import { singular } from './names.js';
import type { Schema, Spec } from './spec.js';

export const UUID = '01923f80-5c6a-7b10-9c21-0d3e4f5a6b7c';

/**
 * Builds a realistic payload for a schema. The testing fake answers with these, and the SDK's own tests run every
 * operation against them. Follows `generator/src/Examples.php` of mycomm-php, so both fakes answer alike.
 *
 * `stack` holds the schemas being built, to stop at one that refers to itself.
 */
export function example(spec: Spec, schema: Schema, name = '', stack: string[] = [], minimal = false): unknown {
  const ref = spec.refName(schema);
  if (ref !== null) {
    if (stack.includes(ref)) {
      return null;
    }
    return example(spec, spec.schema(ref), name, [...stack, ref], minimal);
  }

  if (name === 'next_cursor' || (minimal && nullable(schema))) {
    return null;
  }
  if (Array.isArray(schema.examples) && schema.examples.length > 0) {
    return conform(spec, schema, schema.examples[0]);
  }
  if ('const' in schema) {
    return schema.const;
  }

  if (spec.isObject(schema)) {
    const value: Record<string, unknown> = {};
    const flat = spec.flatten(schema);
    for (const [property, definition] of Object.entries(flat.properties)) {
      if (!minimal || flat.required.includes(property)) {
        value[property] = example(spec, definition, property, stack, minimal);
      }
    }
    return value;
  }

  if (schema.oneOf !== undefined || schema.anyOf !== undefined) {
    for (const variant of (schema.oneOf ?? schema.anyOf) as Schema[]) {
      const value = example(spec, variant, name, stack, minimal);
      if (value !== null) {
        return value;
      }
    }
    return null;
  }

  if (Array.isArray(schema.enum)) {
    return schema.enum.find((value: unknown) => value !== null) ?? null;
  }

  const types = (Array.isArray(schema.type) ? schema.type : schema.type === undefined ? [] : [schema.type]).filter(
    (type: string) => type !== 'null',
  );

  switch (types[0]) {
    case 'string':
      return matching(schema, string(schema, name));
    case 'integer':
      return Math.max(1, Math.trunc(Number(schema.minimum ?? 1)));
    case 'number':
      return 0.5;
    case 'boolean':
      return true;
    case 'array':
      return schema.items === undefined || Object.keys(schema.items).length === 0 || minimal
        ? []
        : [example(spec, schema.items, singular(name), stack)];
    case 'object': {
      const values = schema.additionalProperties;
      return values !== null && typeof values === 'object' && Object.keys(values).length > 0 && !minimal
        ? { example: example(spec, values, name, stack) }
        : {};
    }
    default:
      return null;
  }
}

/**
 * The sparsest payload the schema allows: optional fields left out, nullable ones null, lists empty. That is what a
 * fresh record looks like.
 */
export function minimalExample(spec: Spec, schema: Schema): unknown {
  return example(spec, schema, '', [], true);
}

/**
 * An example of the document with every empty list written as a list. The backend's bundler writes an empty list in an
 * example as `{}` (`media: []` in openapi/public/messages-send.yaml becomes `media: {}` in the bundle); PHP reads both as
 * an empty array, JavaScript does not.
 */
function conform(spec: Spec, schema: Schema, value: unknown, depth = 0): unknown {
  if (depth > 20 || value === null || typeof value !== 'object') {
    return value;
  }
  schema = spec.resolve(schema);
  const variants = [schema, ...((schema.oneOf ?? schema.anyOf ?? []) as Schema[]).map((variant) => spec.resolve(variant))];
  const list = variants.find(
    (variant) => variant.type === 'array' || (Array.isArray(variant.type) && variant.type.includes('array')),
  );
  if (!Array.isArray(value) && Object.keys(value).length === 0 && list !== undefined) {
    return [];
  }
  if (Array.isArray(value)) {
    return list === undefined ? value : value.map((item) => conform(spec, list.items ?? {}, item, depth + 1));
  }
  const object = variants.find((variant) => spec.isObject(variant));
  if (object === undefined) {
    const values = schema.additionalProperties;
    if (values === null || typeof values !== 'object') return value;
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, conform(spec, values, item, depth + 1)]));
  }
  const properties = spec.flatten(object).properties;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      properties[key] === undefined ? item : conform(spec, properties[key], item, depth + 1),
    ]),
  );
}

function nullable(schema: Schema): boolean {
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (types.includes('null') || (Array.isArray(schema.enum) && schema.enum.includes(null))) {
    return true;
  }
  for (const variant of (schema.oneOf ?? schema.anyOf ?? []) as Schema[]) {
    if (variant.type === 'null' || (Array.isArray(variant.enum) && variant.enum.length === 1 && variant.enum[0] === null)) {
      return true;
    }
  }
  return false;
}

/** A value that also keeps the schema's `pattern`, when it has one. */
function matching(schema: Schema, value: string): string {
  if (typeof schema.pattern !== 'string') {
    return value;
  }
  let regex: RegExp;
  try {
    regex = new RegExp(schema.pattern, 'u');
  } catch {
    return value;
  }
  return [value, 'example', 'example_key', 'example-1', 'example1', 'a'].find((candidate) => regex.test(candidate)) ?? value;
}

function string(schema: Schema, name: string): string {
  switch (schema.format) {
    case 'uuid':
      return UUID;
    case 'date-time':
      return '2026-10-01T09:15:02Z';
    case 'date':
      return '2026-10-01';
  }
  if (name === 'id' || name.endsWith('_id')) return UUID;
  if (name.includes('url')) return 'https://example.com/mycomm';
  if (name.includes('email')) return 'ada@example.com';
  if (['to', 'from', 'address', 'display_address', 'phone'].includes(name)) return '+923001234567';
  if (name === 'country_iso') return 'PK';
  if (['timezone', 'tz'].includes(name)) return 'Asia/Karachi';
  if (['language', 'default_locale', 'locale'].includes(name)) return 'en';
  if (name.includes('token') || name.includes('secret')) return 'mc_test_example';
  if (name === 'mime') return 'image/jpeg';
  if (name === 'sha256') return 'a'.repeat(64);
  if (name.endsWith('_at')) return '2026-10-01T09:15:02Z';
  if (name.endsWith('ip')) return '203.0.113.10';
  if (name === 'start') return '09:00';
  if (name === 'end') return '21:00';
  return name === '' ? 'example' : `Example ${name.replaceAll('_', ' ')}`;
}
