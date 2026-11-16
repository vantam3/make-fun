import { cpSync, mkdirSync, readdirSync, writeFileSync, rmSync, realpathSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const source = fileURLToPath(new URL('.', import.meta.url));
const output = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
// Resolve existing ancestors too, so a symlink cannot hide source/output overlap.
function physical(path: string): string {
  if (existsSync(path)) return realpathSync(path);
  const parent = resolve(path, '..');
  return join(physical(parent), path.slice(parent.length + (parent.endsWith('/') ? 0 : 1)));
}
const srcPath = realpathSync(source), outPath = physical(output);
if (outPath === srcPath || outPath.startsWith(srcPath + '/') || srcPath.startsWith(outPath.endsWith('/') ? outPath : outPath + '/')) {
  throw new Error('Output must not overlap the source checkout');
}
const shots = readdirSync(join(source, 'screenshots')).filter(n => !n.startsWith('.'));
if (shots.length < 3 || shots.length > 4) throw new Error('Capture 3–4 genuine browser screenshots before packaging. See README.');
mkdirSync(output, { recursive: true });
for (const folder of ['game', 'screenshots']) {
  rmSync(join(output, folder), { recursive: true, force: true });
  cpSync(join(source, folder), join(output, folder), { recursive: true });
}
const dossier = buildDossier(output, {
  text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993, game_max_bytes: 50331648, game_path_max_bytes: 1000,
});
if (dossier.length > 1572864) throw new Error('Dossier exceeds bounty cap');
writeFileSync(join(output, 'dossier.json'), dossier);
console.log(`TIDEGLASS packaged: ${shots.length} genuine captures, ${dossier.length} dossier bytes`);
