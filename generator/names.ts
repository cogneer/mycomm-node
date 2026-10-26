/** `webhook-endpoints`, `rotate_secret`, `message.sent`, `apiKeys` => `WebhookEndpoints`, `RotateSecret`, ... */
export function pascal(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter((word) => word !== '')
    .map((word) => word[0]!.toUpperCase() + word.slice(1))
    .join('');
}

/** The key of an enum value in its constant object: `android_sim` => `AndroidSim`, `24h` => `V24h`. */
export function enumCase(value: string): string {
  const name = pascal(value.toLowerCase());
  if (name === '') {
    return 'Empty';
  }
  return /^[0-9]/.test(name) ? `V${name}` : name;
}

export function singular(name: string): string {
  if (name.endsWith('ies')) {
    return `${name.slice(0, -3)}y`;
  }
  if (name.endsWith('ses')) {
    return name.slice(0, -2);
  }
  if (name.endsWith('s') && !/(ss|us|is)$/.test(name)) {
    return name.slice(0, -1);
  }
  return name;
}

/**
 * Drops the pointers into the internal design documents, such as ` (03 section 2.5)`: they mean nothing to a reader of
 * the SDK.
 */
function withoutSectionRefs(text: string): string {
  const ref = String.raw`\d{2} sections? \d+(?:\.\d+)*(?: and \d+(?:\.\d+)*)?`;
  return text.replace(new RegExp(String.raw`\s*\((?:${ref})(?:,\s*${ref})*\)`, 'g'), '');
}

function safe(text: string): string {
  return text.replaceAll('*/', '* /');
}

function wrap(paragraph: string, width: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of paragraph.split(' ')) {
    if (line !== '' && line.length + 1 + word.length > width) {
      lines.push(line);
      line = word;
    } else {
      line = line === '' ? word : `${line} ${word}`;
    }
  }
  if (line !== '') {
    lines.push(line);
  }
  return lines;
}

/** A description as the lines of a doc comment, wrapped and safe to embed. */
export function docLines(text: string | null | undefined, width = 110): string[] {
  const clean = safe(withoutSectionRefs(String(text ?? '')).replaceAll('\r', '')).trim();
  if (clean === '') {
    return [];
  }
  const lines: string[] = [];
  clean.split('\n\n').forEach((paragraph, index) => {
    if (index > 0) {
      lines.push('');
    }
    for (const line of wrap(paragraph.replace(/\s+/g, ' ').trim(), width)) {
      // A line that starts with "@" would be read as a tag.
      lines.push(line.startsWith('@') ? ` ${line}` : line);
    }
  });
  return lines;
}

/** A one-line description for a tag. */
export function inline(text: string | null | undefined, limit = 220): string {
  const clean = safe(withoutSectionRefs(String(text ?? '')))
    .replace(/\s+/g, ' ')
    .trim();
  const chars = [...clean];
  return chars.length > limit
    ? `${chars
        .slice(0, limit - 1)
        .join('')
        .trimEnd()}…`
    : clean;
}

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/** A property name as written in a type: quoted when it is not an identifier. */
export function propertyKey(name: string): string {
  return IDENTIFIER.test(name) ? name : JSON.stringify(name);
}
