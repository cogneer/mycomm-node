import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import { describe, expect, it } from 'vitest';
import { Emitter, lead } from '../generator/emitter.js';
import { UUID, example, minimalExample } from '../generator/examples.js';
import { docLines, enumCase, inline, pascal, singular } from '../generator/names.js';
import { Operations } from '../generator/operations.js';
import { Spec } from '../generator/spec.js';
import { Types, declaration } from '../generator/types.js';

/*
 * The rules of the generator, on a small spec that has one of each shape the real ones use (the fixture of mycomm-php).
 */

const mini = () => new Spec('mini', fileURLToPath(new URL('./fixtures/mini.yaml', import.meta.url)));

function petTypes(types: Types): Record<string, string> {
  types.output(mini(), { $ref: '#/components/schemas/Pet' }, 'Pet', 'Pet');
  return Object.fromEntries(
    Object.entries(types.models.Pet!.properties).map(([name, property]) => [
      name,
      `${property.required ? '' : '?'}${declaration(property.type)}`,
    ]),
  );
}

/** The code as `npm run generate` writes it: formatted. */
async function formatted(code: string): Promise<string> {
  return format(code, { ...((await resolveConfig(fileURLToPath(import.meta.url))) ?? {}), parser: 'typescript' });
}

function resource(path = 'pets'): Promise<string> {
  const types = new Types();
  const operations = new Operations(types).read(mini()).filter((operation) => operation.resource.join('.') === path);
  const emitter = new Emitter();
  emitter.types(types.enums, types.models, types.inputs, operations);
  return formatted(emitter.resourceFile([{ path: path.split('.'), operations, children: [] }]));
}

describe('the generator', () => {
  it('maps the schemas of an answer to TypeScript types', () => {
    expect(petTypes(new Types())).toEqual({
      id: 'string',
      kind: 'Open<PetKind>',
      hours: 'Hours | null', // a named object that allows null
      born_at: 'string | null', // a timestamp stays the ISO 8601 text of the API
      tags: 'string[]',
      owner: 'PetOwner', // an inline object gets a type of its own
      status: 'string', // one allowed value is not an enum
      score: 'number', // nor is a list of numbers
      mood: 'Open<PetMood> | null',
      home: 'Address', // allOf with one member is that member
      twin: 'Address | Preview | null', // objects without a discriminator
      limits: 'Record<string, Address>',
      sold_to: 'string',
      nickname: '?string', // not required
    });
  });

  it('collects the enums and nested models it met', () => {
    const types = new Types();
    petTypes(types);

    expect(Object.keys(types.enums)).toEqual(['PetKind', 'PetMood']);
    expect(types.enums.PetMood!.values).toEqual(['happy', 'sad']);
    expect(Object.keys(types.models).sort()).toEqual(['Address', 'Hours', 'Pet', 'PetOwner', 'Preview']);
  });

  it('names an enum from the config and refuses lists that drifted apart', () => {
    expect(() => petTypes(new Types({ 'Pet.kind': 'Species', 'Pet.mood': 'Species' }))).toThrow(
      'Enum Species at Pet.mood has other values',
    );
  });

  it('applies a correction and reports one the spec no longer needs', () => {
    expect(petTypes(new Types({}, {}, { 'Pet.sold_to': 'sold to nobody yet' })).sold_to).toBe('string | null');
    expect(() => petTypes(new Types({}, {}, { 'Pet.born_at': 'already nullable' }))).toThrow(
      'The spec now allows null for Pet.born_at',
    );
  });

  it('types the parameters of a call and tells null from left out', async () => {
    const types = new Types();
    const operations = new Operations(types).read(mini());
    const emitter = new Emitter();
    const code = await formatted(emitter.types(types.enums, types.models, types.inputs, operations));

    expect(code).toContain(
      'export interface PetsCreateParams {\n  name: string;\n  kind: CreatePetKind;\n  nickname?: string | null;',
    );
    expect(code).toContain('  born_at?: Date | string;\n  home?: AddressInput;\n  metadata?: Record<string, unknown>;');
    expect(code).toContain("  owner?: { name: string; mood?: 'happy' | 'sad' };");
    expect(code).toContain(
      "export type PetKind = 'cat' | 'dog';\nexport const PetKind = {\n  Cat: 'cat',\n  Dog: 'dog',\n} as const;",
    );
  });

  it('returns a page with all(), and both answers of a dry run', async () => {
    const code = await resource();

    expect(code).toContain('list(params?: PetsListParams, options?: RequestOptions): Promise<Page<Pet>> {');
    expect(code).toContain("all(params?: Omit<PetsListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Pet> {");
    expect(code).toContain(
      'create(params: PetsCreateParams, options?: RequestOptions): Promise<WithMeta<Preview> | WithMeta<Pet>> {',
    );
    expect(code).toContain('delete(id: string, options?: RequestOptions): Promise<WithMeta<PetsDeleteResponse> | null> {');
  });

  it('nests a resource and passes every path argument', async () => {
    const code = await resource('pets.photos');

    expect(code).toContain('export class PetsPhotosResource {');
    // A body of free-form keys has no fields to type, as in the PHP SDK.
    expect(code).toContain(
      "tag(id: string, photo_id: string, options?: RequestOptions): Promise<void> {\n    return this._connection.call('pets.photos.tag', [id, photo_id], undefined, options)",
    );
  });

  it('builds a full and a sparse example of a schema', () => {
    const pet = { $ref: '#/components/schemas/Pet' };
    const full = example(mini(), pet) as Record<string, unknown>;
    const sparse = minimalExample(mini(), pet) as Record<string, unknown>;

    expect(full.id).toBe(UUID);
    expect(full.kind).toBe('cat');
    expect(full.hours).toEqual({ start: '09:00' });
    expect(full.born_at).toBe('2026-10-01T09:15:02Z');
    expect(full.limits).toEqual({ example: { city: 'Example city' } });
    expect(full).toHaveProperty('nickname');
    expect(sparse.hours).toBeNull();
    expect(sparse.born_at).toBeNull();
    expect(sparse.mood).toBeNull();
    expect(sparse.tags).toEqual([]);
    expect(sparse.home).toEqual({ city: 'Example city' });
    expect(sparse).not.toHaveProperty('nickname');
  });

  it('writes an empty list of an example as a list, whatever the bundle says', () => {
    const spec = mini();
    spec.doc.components.schemas.Listed = {
      type: 'object',
      properties: { tags: { type: 'array', items: { type: 'string' } } },
      examples: [{ tags: {} }],
    };

    expect(example(spec, { $ref: '#/components/schemas/Listed' })).toEqual({ tags: [] });
  });

  it.each([
    [pascal, 'webhook-endpoints', 'WebhookEndpoints'],
    [pascal, 'apiKeys.rotate_secret', 'ApiKeysRotateSecret'],
    [pascal, 'message.sent', 'MessageSent'],
    [enumCase, 'android_sim', 'AndroidSim'],
    [enumCase, 'auto:health_critical', 'AutoHealthCritical'],
    [enumCase, 'VALIDATION_FAILED', 'ValidationFailed'],
    [enumCase, '24h', 'V24h'],
    [singular, 'identities', 'identity'],
    [singular, 'addresses', 'address'],
    [singular, 'connect_methods', 'connect_method'],
    [singular, 'status', 'status'],
  ])('derives names: %o(%s) is %s', (derive, input, expected) => {
    expect(derive(input)).toBe(expected);
  });

  it('keeps a sentence whole when a dot sits inside it', () => {
    const description =
      'Requires `channels:write`. The link stops working at once. Only an `open`\nsession can be revoked; any other ' +
      'status is `409 INVALID_STATE` with `details.status`.\n\nA second paragraph.';
    expect(lead(description)).toBe(
      'Requires `channels:write`. The link stops working at once. Only an `open` session can be revoked; any other ' +
        'status is `409 INVALID_STATE` with `details.status`.',
    );
  });

  it('keeps internal section pointers and comment terminators out of the docs', () => {
    expect(docLines('Queues one message (03 section 3.1, 07 section 5). Ends a */ comment.')).toEqual([
      'Queues one message. Ends a * / comment.',
    ]);
    expect(inline('Page size, 1 to 200 (03 section 2.5).\nSecond line.')).toBe('Page size, 1 to 200. Second line.');
  });

  it('reads the prefix and version of a spec', () => {
    expect(mini().prefix).toBe('/v9');
    expect(mini().version()).toBe('1.2.3');
  });
});
