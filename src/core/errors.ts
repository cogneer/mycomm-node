import type { ErrorCode, Open } from '../generated/types.js';
import type { MyCommResponse } from './http.js';
import { retryAfterSeconds } from './retry-after.js';

/** Base of everything this SDK throws. */
export class MyCommError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = new.target.name;
  }
}

export interface APIErrorInit {
  status: number;
  /** Error code of the API, for example `RECIPIENT_OPTED_OUT`; empty when the answer carried none. */
  code: string;
  details: Record<string, unknown>;
  requestId: string | undefined;
  docUrl: string | undefined;
  response: MyCommResponse | undefined;
}

/**
 * The API answered with an error. Branch on `code` (stable); `message` is the English text of the server, written to say
 * what happened and what to do, and may change. `summary()` puts everything you need for a log line or a support request
 * in one string, and `docUrl` is the page that explains the code.
 */
export class APIError extends MyCommError {
  /** HTTP status. */
  readonly status: number;
  /** Error code of the API, for example `RECIPIENT_OPTED_OUT`; empty when the answer carried none. A newer code arrives as it is. */
  readonly code: Open<ErrorCode> | '';
  /** Code-specific details. */
  readonly details: Record<string, unknown>;
  /** Quote it to support. */
  readonly requestId: string | undefined;
  /** The page of the error reference that explains the code (`error.doc_url`). */
  readonly docUrl: string | undefined;
  readonly response: MyCommResponse | undefined;

  constructor(message: string, init: APIErrorInit) {
    super(message);
    this.status = init.status;
    this.code = init.code;
    this.details = init.details;
    this.requestId = init.requestId;
    this.docUrl = init.docUrl;
    this.response = init.response;
  }

  is(code: Open<ErrorCode>): boolean {
    return this.code === code;
  }

  /** Whether the error is any of these codes. */
  isAnyOf(...codes: Array<Open<ErrorCode>>): boolean {
    return codes.some((code) => this.code === code);
  }

  /** One line with the code, status, message, details and request id, for logs and support requests. */
  summary(): string {
    const parts = [`${this.code !== '' ? this.code : 'ERROR'} (${this.status}): ${this.message}`];
    const details = this.summaryDetails();
    if (details !== '') parts.push(`details: ${details}`);
    if (this.requestId !== undefined) parts.push(`request_id: ${this.requestId}`);
    if (this.docUrl !== undefined) parts.push(`see: ${this.docUrl}`);
    return parts.join('  ');
  }

  override toString(): string {
    return `${this.name}: ${this.summary()}`;
  }

  /** The details worth printing; a validation error lists its fields instead. */
  protected summaryDetails(): string {
    return Object.keys(this.details).length === 0 ? '' : JSON.stringify(this.details);
  }

  /** @internal */
  static fromResponse(response: MyCommResponse): APIError {
    let parsed: unknown;
    try {
      parsed = JSON.parse(response.body);
    } catch {
      parsed = undefined;
    }
    const error = isRecord(parsed) && isRecord(parsed.error) ? parsed.error : {};

    const code = typeof error.code === 'string' ? error.code : '';
    const message =
      typeof error.message === 'string' && error.message !== ''
        ? error.message
        : `The MyComm API answered with HTTP ${response.status}.`;
    const init: APIErrorInit = {
      status: response.status,
      code,
      details: isRecord(error.details) ? error.details : {},
      requestId: typeof error.request_id === 'string' ? error.request_id : response.header('MyComm-Request-Id'),
      docUrl: typeof error.doc_url === 'string' ? error.doc_url : undefined,
      response,
    };

    // Unknown codes fall back on the status, as the API's versioning policy asks of clients.
    const status = response.status;
    const Class =
      code === 'VALIDATION_FAILED'
        ? ValidationError
        : code === 'INVALID_HEADER'
          ? InvalidHeaderError
          : status === 415
            ? UnsupportedMediaTypeError
            : status === 400
              ? BadRequestError
              : status === 401
                ? AuthenticationError
                : status === 403
                  ? PermissionDeniedError
                  : status === 404
                    ? NotFoundError
                    : status === 409
                      ? ConflictError
                      : status === 413
                        ? PayloadTooLargeError
                        : status === 422
                          ? UnprocessableError
                          : status === 429
                            ? RateLimitError
                            : status >= 500
                              ? ServerError
                              : APIError;
    return new Class(message, init);
  }
}

/** 400: the request is malformed, the cursor is invalid or the account context is missing. */
export class BadRequestError extends APIError {}

/**
 * 400 `INVALID_HEADER`: a request header has a value the API cannot use. `details.header` names it, `details.reason` says
 * why and `details.expected` what is accepted.
 */
export class InvalidHeaderError extends BadRequestError {}

/** 401: the API key is missing, malformed, revoked or expired. */
export class AuthenticationError extends APIError {}

/** 403: the key may not do this (its scope, the account's state, or a partner key without `MyComm-Account`). */
export class PermissionDeniedError extends APIError {}

/** 404: nothing with that id in this account. */
export class NotFoundError extends APIError {}

/** 409: the request conflicts with the current state, or an `Idempotency-Key` was reused with another body. */
export class ConflictError extends APIError {}

/** 413: the body or the file is larger than the API accepts. */
export class PayloadTooLargeError extends APIError {}

/** 415: the body is not of a type the operation accepts. */
export class UnsupportedMediaTypeError extends APIError {}

/**
 * 422: the request is well formed but a rule refuses it, for example `RECIPIENT_OPTED_OUT` or `CHANNEL_INACTIVE`. Do not
 * retry it unchanged.
 */
export class UnprocessableError extends APIError {}

/** 422 `VALIDATION_FAILED`: one or more fields are invalid. */
export class ValidationError extends UnprocessableError {
  /** Violations per field path, for example `{ to: [{ code: 'INVALID_NUMBER', message: '...' }] }`. */
  fields(): Record<string, Array<{ code: string; message: string }>> {
    const fields: Record<string, Array<{ code: string; message: string }>> = {};
    const source = isRecord(this.details.fields) ? this.details.fields : {};
    for (const [path, violations] of Object.entries(source)) {
      for (const violation of Array.isArray(violations) ? violations : []) {
        (fields[path] ??= []).push({
          code: String(isRecord(violation) ? (violation.code ?? '') : ''),
          message: String(isRecord(violation) ? (violation.message ?? '') : ''),
        });
      }
    }
    return fields;
  }

  /** The messages of one field, empty when the field is valid. */
  messagesFor(field: string): string[] {
    return (this.fields()[field] ?? []).map((violation) => violation.message);
  }

  protected override summaryDetails(): string {
    const lines: string[] = [];
    for (const [field, violations] of Object.entries(this.fields())) {
      for (const violation of violations) lines.push(`${field}: ${violation.code}: ${violation.message}`);
    }
    return lines.join('; ');
  }
}

/** 429: too many requests. The SDK has already waited and retried before throwing this. */
export class RateLimitError extends APIError {
  /** Seconds the API asks to wait, from `Retry-After`. */
  retryAfter(): number | undefined {
    return retryAfterSeconds(this.response?.header('Retry-After'));
  }
}

/** 5xx: the API failed. Reads and keyed writes were retried before this was thrown. */
export class ServerError extends APIError {}

/**
 * No answer arrived: DNS, TLS, timeout or a dropped connection. The request may or may not have reached the API; repeating
 * a POST with the same `Idempotency-Key` is safe.
 */
export class ConnectionError extends MyCommError {}

/** A successful answer whose body is not the JSON the API documents, usually a proxy in between. */
export class UnexpectedResponseError extends MyCommError {
  constructor(
    message: string,
    readonly response?: MyCommResponse,
  ) {
    super(message);
  }
}

export interface Violation {
  field: string;
  rule: string;
  message: string;
}

/**
 * A request was refused before it was sent, because an argument breaks a rule the API documents (a value out of range, a
 * missing recipient, two fields that exclude each other). No request was made, so it is not an `APIError`.
 *
 * `field` and `rule` describe the first problem; `violations` lists all of them. The rules are named like the codes of the
 * API's own `VALIDATION_FAILED` answer (`OUT_OF_RANGE`, `TOO_LONG`, `EXCLUSIVE`, `REQUIRED_WITH`, ...). Turn the checks off
 * with `new MyComm({ validate: false })` if the API has relaxed a rule your SDK version does not know yet.
 */
export class InvalidArgumentError extends MyCommError {
  /** The field (argument) of the first problem. */
  readonly field: string;
  /** The rule of the first problem, for example `OUT_OF_RANGE`. */
  readonly rule: string;

  constructor(
    /** The SDK call, for example `messages.send`. */
    readonly operation: string,
    /** Every problem found, in the order the arguments are declared. */
    readonly violations: Violation[],
  ) {
    const first = violations[0] ?? { field: '', rule: '', message: 'The arguments are not valid.' };
    const more = violations.length - 1;
    const rest = violations
      .slice(1, 3)
      .map((violation) => violation.message)
      .join(' ');
    super(first.message + (more > 0 ? ` (and ${more} more: ${rest})` : ''));
    this.field = first.field;
    this.rule = first.rule;
  }
}

/** A webhook request must be rejected (answer 400): the signature is missing, stale or does not match, or the body is not an event. */
export class WebhookSignatureError extends MyCommError {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
