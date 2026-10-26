import { MyCommError } from './errors.js';

/**
 * A file for a multipart request, for example `media.upload({ file })`: a `File` or a `Blob`. Build one with `toFile()`
 * from bytes or text, or with `fileFromPath()` from a file on disk.
 */
export type Uploadable = Blob;

/** A file from bytes or text, with its name and type. */
export function toFile(
  data: Blob | ArrayBuffer | ArrayBufferView | string,
  filename: string,
  contentType = 'application/octet-stream',
): File {
  const part = typeof data === 'string' || data instanceof Blob ? data : data instanceof ArrayBuffer ? data : copy(data);
  return new File([part], filename, { type: contentType });
}

/**
 * A file read from disk (Node.js, Bun and Deno). The type is guessed from the extension for the formats the API takes;
 * pass it when yours is not among them.
 */
export async function fileFromPath(path: string, options: { filename?: string; contentType?: string } = {}): Promise<File> {
  const { readFile } = await import('node:fs/promises');
  const { basename, extname } = await import('node:path');
  let data: Uint8Array;
  try {
    data = await readFile(path);
  } catch (error) {
    throw new MyCommError(`The file ${path} cannot be read.`, { cause: error });
  }
  const filename = options.filename ?? basename(path);
  return toFile(data, filename, options.contentType ?? TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream');
}

/** The name a multipart part is sent with. */
export function filenameOf(file: Blob, fallback: string): string {
  return typeof (file as File).name === 'string' && (file as File).name !== '' ? (file as File).name : fallback;
}

function copy(view: ArrayBufferView): ArrayBuffer {
  const bytes = new Uint8Array(view.byteLength);
  bytes.set(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
  return bytes.buffer;
}

const TYPES: Record<string, string> = {
  '.csv': 'text/csv',
  '.txt': 'text/plain',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.3gp': 'video/3gpp',
  '.vcf': 'text/vcard',
};
