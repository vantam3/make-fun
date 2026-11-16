import {cpSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDossier} from './vendor/makefun-threejs.ts';
const root=fileURLToPath(new URL('.',import.meta.url));
const out=process.env.MAKEFUN_OUTPUT_DIR??'/output';
mkdirSync(out,{recursive:true});
for(const name of ['game','screenshots'])cpSync(join(root,name),join(out,name),{recursive:true});
writeFileSync(join(out,'dossier.json'),buildDossier(out,{text_max_bytes:163840,screenshots:{max:4,max_bytes:262144},game_max_files:993,game_max_bytes:50331648}));
