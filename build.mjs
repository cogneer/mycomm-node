// Writes dist/: ES modules, one file per module (not a bundle, so `@mycomm/node/testing` shares the classes of the main
// entry and `instanceof` keeps working), and type declarations. The declarations keep their comments, since that is where an
// editor reads the docs; the JavaScript is emitted without them, and esbuild drops its whitespace. CommonJS code loads the
// package with `require()`, which Node.js supports for ES modules from 20.19 and 22.12.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { transformSync } from 'esbuild';

const tsc = (...args) =>
  execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.build.json', ...args], { stdio: 'inherit' });

rmSync('dist', { recursive: true, force: true });
tsc('--emitDeclarationOnly');
tsc('--declaration', 'false', '--removeComments');
// Whitespace and syntax only: names stay as written, so stack traces still read like the source.
for (const entry of readdirSync('dist', { recursive: true })) {
  const file = join('dist', String(entry));
  if (file.endsWith('.js')) {
    const { code } = transformSync(readFileSync(file, 'utf8'), {
      format: 'esm',
      target: 'es2022',
      minifyWhitespace: true,
      minifySyntax: true,
    });
    writeFileSync(file, code);
  }
}
console.log('Built dist/.');
