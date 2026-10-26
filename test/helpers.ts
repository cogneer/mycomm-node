import { MyComm, TRANSPORT, type InternalOptions } from '../src/client.js';
import { ConnectionError } from '../src/core/errors.js';
import { MyCommResponse, type MyCommRequest, type Transport } from '../src/core/http.js';

export type Scripted = MyCommResponse | Error | ((request: MyCommRequest) => MyCommResponse);

/** A transport that answers from a script, in order, and records the requests. The last answer repeats. */
export class ScriptedTransport implements Transport {
  readonly requests: MyCommRequest[] = [];

  constructor(private readonly script: Scripted[]) {}

  async send(request: MyCommRequest): Promise<MyCommResponse> {
    this.requests.push(request);
    const next = this.script.length > 1 ? this.script.shift()! : this.script[0]!;
    if (next instanceof Error) throw next;
    return typeof next === 'function' ? next(request) : next;
  }
}

export function json(status: number, body: unknown, headers: Record<string, string> = {}): MyCommResponse {
  return new MyCommResponse(
    status,
    { 'Content-Type': 'application/json', ...headers },
    body === undefined ? '' : JSON.stringify(body),
  );
}

export function error(
  status: number,
  code: string,
  headers: Record<string, string> = {},
  details: Record<string, unknown> = {},
): MyCommResponse {
  return json(status, { error: { code, message: `${code} happened.`, details, request_id: 'req-1' } }, headers);
}

export const offline = (): ConnectionError => new ConnectionError('Could not reach MyComm: ECONNREFUSED');

/** A client on a scripted transport that records how long it would have waited between retries. */
export function scripted(script: Scripted[], options: Partial<InternalOptions> = {}) {
  const transport = new ScriptedTransport(script);
  const waits: number[] = [];
  const client = new MyComm({
    apiKey: 'mc_live_test',
    sleep: async (seconds: number) => {
      waits.push(seconds);
    },
    ...options,
    [TRANSPORT]: transport,
  } as InternalOptions);
  return { client, transport, waits };
}

export const MESSAGE = {
  id: '01923f80-5c6a-7b10-9c21-0d3e4f5a6b7c',
  status: 'queued',
  to: '+923001234567',
};
