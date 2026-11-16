import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join,dirname,resolve } from 'node:path';
import { readGameTree,htmlFacts,sourceImports } from '../vendor/makefun-game.ts';
const root=resolve(new URL('../game',import.meta.url).pathname);
test('game fits caps; every declared page/module asset stays local and exists',()=>{
 const tree=readGameTree(root,{game_max_files:993,game_max_bytes:50331648,game_path_max_bytes:1000});
 const files=new Set(tree.files.map(f=>f.path)),html=htmlFacts(readFileSync(join(root,'index.html'),'utf8'));
 function local(ref,from){if(ref.startsWith('data:'))return;assert.ok(!/^(?:[a-z]+:|\/)/i.test(ref),ref);const target=resolve(dirname(join(root,from)),ref);assert.ok(target.startsWith(root+'/'));assert.ok(files.has(target.slice(root.length+1)),ref);}
 for(const r of [...html.scripts.map(s=>s.src).filter(Boolean),...html.links.map(l=>l.href),...html.resources.map(r=>r.src)])local(r,'index.html');
 for(const f of tree.files.filter(f=>f.path.endsWith('.js'))){const src=readFileSync(join(root,f.path),'utf8');for(const ref of sourceImports(src))local(ref,f.path);assert.doesNotMatch(src,/\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b/);}
 console.log(`Static game: ${tree.count} entries, ${tree.totalBytes} bytes, all references local`);
});
