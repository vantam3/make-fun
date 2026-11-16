import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, symlinkSync } from 'node:fs';
import { resolve } from 'node:path';
const repo=resolve(new URL('..',import.meta.url).pathname);
const run=output=>spawnSync(process.execPath,[resolve(repo,'main.ts')],{env:{...process.env,MAKEFUN_OUTPUT_DIR:output},encoding:'utf8'});
test('packaging rejects checkout, descendants, ancestors and symlink overlaps before writes',()=>{
 const tmp=mkdtempSync('/tmp/tideglass-overlap-');symlinkSync(repo,`${tmp}/source`,'dir');
 for(const path of [repo,`${repo}/game`,`${repo}/screenshots`,`${repo}/new/output`,resolve(repo,'..'),`${tmp}/source/output`,'/']){
  const result=run(path);assert.notEqual(result.status,0,path);assert.match(result.stderr,/must not overlap/,path);
 }
});
