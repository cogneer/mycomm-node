/**
 * What the runtime knows about one operation. `generator/` writes one per SDK method into `src/generated/operations.ts`.
 *
 * @internal
 */
export interface OperationSpec {
  /** The operation's id in the SDK, for example `messages.send`. Both variants of `imports.create` share one. */
  operation: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Path below the origin, with `{name}` for each path parameter: `/v1/contacts/{id}`. */
  path: string;
  pathParams?: string[];
  /** The names in `params` that go into the query string; every other name goes into the body. */
  query?: string[];
  format?: 'json' | 'multipart';
  /** Fields of a multipart body that carry a file. */
  files?: string[];
  /**
   * `model`: the JSON object of the answer. `maybe`: the same, or `null` for an answer without a body. `void`: nothing.
   * `page`: one page of a list. `json`: the JSON of an operation whose answer the reference does not describe yet.
   */
  returns: 'model' | 'maybe' | 'void' | 'page' | 'json';
  /** A `list` that takes a `cursor`: its page can fetch the next one. */
  paginated?: boolean;
  /** Field name => what the guard checks (`required`, `min`, `maxLength`, `enum`, `uuid`, ...). */
  constraints?: Record<string, Record<string, unknown>>;
  /** Rules between fields: `['exactlyOne', [fields]]`, `['requires', field, other]`, `['requiredWhen', field, when, value]`. */
  rules?: Array<[string, ...unknown[]]>;
}
