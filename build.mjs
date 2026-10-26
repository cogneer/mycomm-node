// Writes dist/: an ES module build (dist/esm) and a CommonJS build (dist/cjs), each with type declarations. One file per
// module, not a bundle, so `@mycomm/node/testing` shares the classes of the main entry (`instanceof` keeps working).
import { execFileSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';

const tsc = (project) => execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', project], { stdio: 'inherit' });

rmSync('dist', { recursive: true, force: true });
tsc('tsconfig.build.json');
tsc('tsconfig.cjs.json');
// The package is "type": "module"; this marks the files under dist/cjs as CommonJS.
writeFileSync('dist/cjs/package.json', '{\n  "type": "commonjs"\n}\n');
console.log('Built dist/esm and dist/cjs.');
