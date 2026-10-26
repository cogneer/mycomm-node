import { InvalidArgumentError, type Violation } from './errors.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * The checks the API documents, run on the arguments of a call before anything is sent. The constraints and the
 * cross-field rules come from the OpenAPI document (`generator/` writes them into the operation table), so the SDK cannot
 * drift from the contract by hand. Follows `Validation\Guard` of mycomm-php.
 *
 * A value that is `undefined` or `null` is "not sent" (or "clear it") and is never checked against a limit; `required`
 * catches a required argument left out, which matters to callers without TypeScript.
 *
 * @internal
 */
export function guard(
  operation: string,
  values: Record<string, unknown>,
  constraints: Record<string, Record<string, unknown>>,
  rules: Array<[string, ...unknown[]]>,
): void {
  const violations: Violation[] = [];

  for (const [field, constraint] of Object.entries(constraints)) {
    const value = values[field];
    if (value === undefined && constraint.required === true) {
      violations.push({ field, rule: 'REQUIRED', message: `${field} is required.` });
      continue;
    }
    if (absent(value)) {
      continue;
    }
    violations.push(...check(field, value, constraint));
  }

  for (const rule of rules) {
    const violation = checkRule(values, rule);
    if (violation !== null) {
      violations.push(violation);
    }
  }

  if (violations.length > 0) {
    throw new InvalidArgumentError(operation, violations);
  }
}

function check(field: string, value: unknown, constraint: Record<string, unknown>): Violation[] {
  const found: Violation[] = [];
  const add = (rule: string, message: string): void => {
    found.push({ field, rule, message });
  };

  const allowed = constraint.enum;
  if (Array.isArray(allowed) && isScalar(value) && !allowed.map(String).includes(String(value))) {
    add('INVALID_ENUM', `${field} must be one of ${allowed.join(', ')} (got ${show(value)}).`);
  }

  if (typeof value === 'number') {
    const min = constraint.min as number | undefined;
    const max = constraint.max as number | undefined;
    if ((min !== undefined && value < min) || (max !== undefined && value > max)) {
      const range =
        min !== undefined && max !== undefined
          ? `between ${min} and ${max}`
          : min !== undefined
            ? `at least ${min}`
            : `at most ${max}`;
      add('OUT_OF_RANGE', `${field} must be ${range} (got ${value}).`);
    }
  }

  if (typeof value === 'string') {
    const length = [...value].length;
    const maxLength = constraint.maxLength as number | undefined;
    const minLength = constraint.minLength as number | undefined;
    if (maxLength !== undefined && length > maxLength) {
      add('TOO_LONG', `${field} must be at most ${maxLength} characters (got ${length}).`);
    }
    if (minLength !== undefined && length < minLength) {
      add('TOO_SHORT', `${field} must be at least ${minLength} characters (got ${length}).`);
    }
    if (typeof constraint.pattern === 'string' && !matches(constraint.pattern, value)) {
      add('INVALID_FORMAT', `${field} is not in the expected format (${constraint.pattern}).`);
    }
    if (constraint.uuid === true && !UUID.test(value)) {
      add('INVALID_FORMAT', `${field} must be a UUID (got ${show(value)}).`);
    }
  }

  const isList = Array.isArray(value);
  const isMap = isPlainObject(value);
  if (isList || isMap) {
    const count = isList ? value.length : Object.keys(value).length;
    const maxItems = constraint.maxItems as number | undefined;
    const minItems = constraint.minItems as number | undefined;
    const maxProperties = constraint.maxProperties as number | undefined;
    if (maxItems !== undefined && count > maxItems) {
      add('TOO_LONG', `${field} may hold at most ${maxItems} items (got ${count}).`);
    }
    if (minItems !== undefined && count < minItems) {
      add('TOO_SHORT', `${field} needs at least ${minItems} items (got ${count}).`);
    }
    if (maxProperties !== undefined && count > maxProperties) {
      add('TOO_LONG', `${field} may hold at most ${maxProperties} keys (got ${count}).`);
    }
    if (constraint.uuid === true && isList) {
      const bad = value.find((item) => typeof item === 'string' && !UUID.test(item));
      if (bad !== undefined) {
        add('INVALID_FORMAT', `${field} must hold UUIDs (got ${show(bad)}).`);
      }
    }
    if (constraint.scalarValues === true) {
      const entry = Object.entries(value).find(([, item]) => !isScalar(item) && item !== null);
      if (entry !== undefined) {
        add('INVALID_TYPE', `${field} may only hold text, number, boolean or null values; '${entry[0]}' does not.`);
      }
    }
    const maxBytes = constraint.maxBytes as number | undefined;
    if (maxBytes !== undefined) {
      const bytes = new TextEncoder().encode(JSON.stringify(value)).length;
      if (bytes > maxBytes) {
        add('TOO_LONG', `${field} may be at most ${maxBytes} bytes as JSON (got ${bytes}).`);
      }
    }
  }

  return found;
}

function checkRule(values: Record<string, unknown>, rule: [string, ...unknown[]]): Violation | null {
  const present = (field: string): boolean => !absent(values[field]);

  switch (rule[0]) {
    case 'exactlyOne': {
      const fields = rule[1] as string[];
      const given = fields.filter(present);
      if (given.length === 1) return null;
      return given.length === 0
        ? { field: fields[0]!, rule: 'REQUIRED_WITH', message: `Give one of ${fields.join(', ')}.` }
        : { field: given[1]!, rule: 'EXCLUSIVE', message: `Give only one of ${fields.join(', ')}, not ${given.join(' and ')}.` };
    }
    case 'atLeastOne': {
      const fields = rule[1] as string[];
      return fields.some(present)
        ? null
        : { field: fields[0]!, rule: 'REQUIRED_WITH', message: `Give at least one of ${fields.join(', ')}.` };
    }
    case 'requires': {
      const [, field, other] = rule as [string, string, string];
      return present(field) && !present(other) ? { field, rule: 'REQUIRED_WITH', message: `${field} needs ${other}.` } : null;
    }
    case 'requiredWhen': {
      const [, field, when, value] = rule as [string, string, string, unknown];
      return !present(field) && values[when] === value
        ? { field, rule: 'REQUIRED_WHEN', message: `${field} is required when ${when} is ${String(value)}.` }
        : null;
    }
  }
  return null;
}

function absent(value: unknown): boolean {
  return value === undefined || value === null;
}

function isScalar(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

const patterns = new Map<string, RegExp | null>();

function matches(pattern: string, value: string): boolean {
  if (!patterns.has(pattern)) {
    try {
      patterns.set(pattern, new RegExp(pattern, 'u'));
    } catch {
      // A pattern JavaScript cannot read is left to the server.
      patterns.set(pattern, null);
    }
  }
  const regex = patterns.get(pattern);
  return regex === null || regex === undefined || regex.test(value);
}

function show(value: unknown): string {
  return typeof value === 'string' ? `'${[...value].slice(0, 40).join('')}'` : JSON.stringify(value);
}
