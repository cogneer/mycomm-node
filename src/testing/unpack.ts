/**
 * Restores the examples `generator/` packed (`pack()` in generator/emitter.ts): `{ "$ref#": n }` stands for `table[n]`.
 * Every use gets its own copy, so a test that changes one answer cannot change another.
 *
 * @internal
 */
export function unpack(json: string): unknown {
  const { table, root } = JSON.parse(json) as { table: unknown[]; root: unknown };
  const expand = (node: unknown): unknown => {
    if (node === null || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.map(expand);
    const ref = (node as Record<string, unknown>)['$ref#'];
    if (typeof ref === 'number' && Object.keys(node).length === 1) return expand(table[ref]);
    return Object.fromEntries(Object.entries(node).map(([key, item]) => [key, expand(item)]));
  };
  return expand(root);
}
