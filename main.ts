// SPDX-License-Identifier: MIT
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from './parse.js';

// Directory overrides are the only environment-dependent behavior.
const inputPath = resolve(process.env.MAKEFUN_INPUT_DIR ?? '/input', 'cases.json');
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const documents: Array<{ markdown: string }> = JSON.parse(readFileSync(inputPath, 'utf8'));
const rendered = new Array<string>(documents.length);
for (let index = 0; index < documents.length; index++) {
  rendered[index] = parse(documents[index].markdown);
}
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, 'html.json'), JSON.stringify(rendered));
