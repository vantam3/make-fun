// SPDX-License-Identifier: MIT
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from './parse.js';

// Only the two documented directory overrides affect execution.
const input = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const documents = JSON.parse(readFileSync(resolve(input, 'cases.json'), 'utf8'));
const rendered = new Array(documents.length);
for (let index = 0; index < documents.length; index++) {
  rendered[index] = parse(documents[index].markdown);
}
mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, 'html.json'), JSON.stringify(rendered));
