// Copies the bundled OpenAPI documents of a backend checkout into spec/ and records the commit they come from.
//
//   npm run spec:sync -- ../mycomm-backend      then: npm run generate
import { execFileSync } from 'node:child_process';
import { copyFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const backend = process.argv[2];
if (backend === undefined) {
  console.error('usage: npm run spec:sync -- <path to the backend checkout>');
  process.exit(1);
}
for (const set of ['public', 'partner']) {
  copyFileSync(join(backend, 'openapi', `${set}.yaml`), join('spec', `${set}.yaml`));
}
const commit = execFileSync('git', ['-C', backend, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
writeFileSync(join('spec', 'SOURCE'), `${commit}\n`);
console.log(`Copied the specs at backend commit ${commit}. Now run npm run generate.`);
