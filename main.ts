// UNDERCURRENT — offline, standard-library Node 22.18+ entrypoint.
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync, rmSync, realpathSync, lstatSync } from 'node:fs';
import { join, resolve, dirname, basename, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-board.ts';
const root = fileURLToPath(new URL('.', import.meta.url));
function arg(key, fallback) {
  const i = process.argv.indexOf('--' + key);
  return i < 0 ? (process.argv.find(x => x.startsWith('--' + key + '='))?.split('=').slice(1).join('=') ?? fallback) : process.argv[i + 1];
}
const input = arg('input', '/input/snapshot.json');
const out = resolve(arg('output', process.env.MAKEFUN_OUTPUT_DIR || '/output'));
// Resolve existing ancestors, including symlinks, before creating or deleting anything.
function canonical(path) {
  path = resolve(path);
  if (existsSync(path)) return realpathSync(path);
  try { lstatSync(path); throw Error('Dangling symlink in output path'); }
  catch (e) { if (e.code !== 'ENOENT') throw e; }
  const parent = dirname(path);
  if (parent === path) return path;
  return join(canonical(parent), basename(path));
}
function contains(parent, child) {
  const rel = relative(parent, child);
  return rel === '' || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + '/'));
}
const sourcePath = canonical(root), outputPath = canonical(out);
const inputPath = canonical(input.endsWith('.json') ? input : join(input, 'snapshot.json'));
if (contains(sourcePath, outputPath) || contains(outputPath, sourcePath) || contains(outputPath, inputPath)) {
  throw Error('Output must be disjoint from source and must not contain input');
}
// Reject existing symlink children so file writes cannot follow an alias into the input/source.
if (existsSync(out)) for (const name of ['board.json','data.js','dashboard','screenshots','dossier.json']) {
  try { if (lstatSync(join(out,name)).isSymbolicLink()) throw Error('Output child must not be a symlink: ' + name); }
  catch (e) { if (e.code !== 'ENOENT') throw e; }
}
const s = JSON.parse(readFileSync(input.endsWith('.json') ? input : join(input, 'snapshot.json'), 'utf8'));
if (!Array.isArray(s.protocols) || !Array.isArray(s.watchlist) || !Number.isFinite(Date.parse(s.as_of))) throw Error('Invalid snapshot');
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lexical = (a,b) => a < b ? -1 : a > b ? 1 : 0;
const quantile = (a, q) => { const x = (a.length - 1) * q, i = Math.floor(x); return a[i] + (a[Math.ceil(x)] - a[i]) * (x-i); };
const recorded = p => p.gecko_id !== null || p.symbol !== null || p.mcap_usd !== null;
const peers = s.protocols.filter(p => recorded(p) && Number.isFinite(p.mcap_usd) && p.mcap_usd > 0 && p.tvl_usd > 0);
if (!peers.length) throw Error('No positive tokenized peers: cannot calibrate a defensible model');
function robust(list) {
  const raw = list.map(p => p.mcap_usd / p.tvl_usd).sort((a,b) => a-b);
  const lo = quantile(raw,.1), hi = quantile(raw,.9);
  const wins = raw.map(x => clamp(x,lo,hi));
  return { n: raw.length, median: quantile(wins,.5), q25: quantile(wins,.25), q75: quantile(wins,.75), lo, hi };
}
const global = robust(peers);
const categories = Object.fromEntries([...new Set(s.protocols.map(p=>p.category || 'Uncategorized'))].sort(lexical).map(c => {
  const set = peers.filter(p => (p.category || 'Uncategorized') === c);
  return [c, set.length ? robust(set) : null];
}));
function plan(p) {
  const c = (p.category || '').toLowerCase();
  let research = 'Map the documented user workflow, fees, permission model and exit conditions; flag any feature the public documentation does not confirm.';
  let risk = 'Check admin powers, upgrade delays, audits and dependency exposure; note what would prevent an orderly exit.';
  if (/lend|cdp|collateral/.test(c)) { research = 'Read the collateral list, oracle design, liquidation thresholds and rate model. Work through a hypothetical position on paper without supplying or borrowing assets.'; risk = 'Compare utilization, bad-debt handling and withdrawal restrictions; model a collateral price shock and record liquidation risks.'; }
  else if (/dex|amm|liquidity/.test(c)) { research = 'Inspect documented pool types and fee tiers. Calculate a hypothetical swap and liquidity position on paper, including slippage and impermanent loss.'; risk = 'Check pool concentration, oracle dependencies, MEV exposure and liquidity exit constraints; do not assume quoted depth will remain available.'; }
  else if (/staking|restak/.test(c)) { research = 'Trace the documented receipt asset, validator or operator selection, reward sources and redemption queue without staking assets.'; risk = 'Review slashing, operator concentration, receipt depegs and withdrawal delays; distinguish base yield from incentives.'; }
  else if (/bridge/.test(c)) { research = 'Diagram the documented message verification and source/destination asset custody; inspect supported routes without initiating a bridge transfer.'; risk = 'Review signer thresholds, relayer dependencies, finality assumptions and emergency pauses; record route-specific failure cases.'; }
  else if (/rwa|stable|yield|curator|vault|allocator|farm/.test(c)) { research = 'Read the vault or asset mandate, underlying exposures, fee waterfall and redemption policy. Build a paper allocation without depositing funds.'; risk = 'Check custody, strategy leverage, depeg exposure, access restrictions and redemption gates; distinguish reported TVL from assets you could redeem.'; }
  else if (/derivative|perpetual|option/.test(c)) { research = 'Read the margin, funding and settlement rules. Calculate one hypothetical position and adverse price move without opening a trade.'; risk = 'Review liquidation, counterparty, oracle and insurance-fund assumptions; record maximum paper loss and withdrawal restrictions.'; }
  return [
    `Verify ${p.name}'s identity using independently confirmed official documentation; compare token disclosures with the snapshot. A missing record is not proof of no token. Cost: $0; time: 15–20 minutes.`,
    `${research} Scope: ${p.category || 'uncategorized'}; snapshot chains: ${p.chains.slice(0,3).join(', ') || 'unreported'}${p.chains.length > 3 ? ' and ' + (p.chains.length-3) + ' more (see details)' : ''}. Cost: $0; time: 25–40 minutes.`,
    `${risk} Cost: $0; time: 20–30 minutes.`,
    `For ${p.name}, look for an explicitly documented public testnet, governance discussion or bug-report workflow. If available, use only faucet assets or submit a reproducible documentation issue; otherwise stop at research. Cost: $0; time: 20–40 minutes.`,
    `Log the snapshot TVL of $${p.tvl_usd.toLocaleString('en-US')}, the reported 7d change (${p.change_7d === null ? 'unreported' : p.change_7d + '%'}) and your evidence. Recheck disclosures weekly; no points, eligibility, launch or airdrop is assumed. Cost: $0; time: 10 minutes per review.`
  ];
}
function score(p) {
  const category = p.category || 'Uncategorized', local = categories[category];
  const n = local?.n || 0, weight = n / (n + 8);
  const ratio = Math.exp(weight * Math.log(local?.median || global.median) + (1-weight)*Math.log(global.median));
  const age = p.listed_at && Number.isFinite(Date.parse(p.listed_at)) ? Math.max(0,Math.floor((Date.parse(s.as_of)-Date.parse(p.listed_at))/86400000)) : null;
  const growth = 1 + clamp(p.change_7d ?? 0,-50,50)/100 * .25;
  const maturity = age === null ? .9 : .8 + .2 * Math.min(age,730)/730;
  const value = Math.max(1,Math.min(1e14,Math.round(p.tvl_usd * ratio * growth * maturity)));
  const dispersion = Math.max(2, global.q75 / Math.max(global.q25,1e-9), local ? local.q75 / Math.max(local.q25,1e-9) : 2);
  const uncertainty = Math.min(12, Math.sqrt(dispersion) * (1 + (1-weight)) * (age === null || p.change_7d === null ? 1.25 : 1));
  return { ...p, category, watchlist: s.watchlist.includes(p.slug), age_days: age, peer_n:n, peer_weight:weight, peer_median:local?.median ?? null, ratio, growth_multiplier:growth, maturity_multiplier:maturity, implied_value_usd:value, low_usd:Math.max(1,Math.round(value/uncertainty)), high_usd:Math.min(1e14,Math.round(value*uncertainty)), farm_steps:plan(p) };
}
const rows = s.protocols.filter(p=>!recorded(p) || s.watchlist.includes(p.slug)).map(score).sort((a,b)=>b.implied_value_usd-a.implied_value_usd || lexical(a.slug,b.slug)).map((p,i)=>({...p,rank:i+1}));
if (rows.length < 100 || new Set(rows.map(p=>p.slug)).size !== rows.length || s.watchlist.some(x=>!rows.some(p=>p.slug===x))) throw Error('Insufficient or duplicate coverage');
const data = { as_of:s.as_of, source:s.source, floor_usd:s.floor_usd, rows, peers: peers.map(p=>({...p,category:p.category || 'Uncategorized',ratio:p.mcap_usd/p.tvl_usd})), recorded_count:s.protocols.filter(recorded).length, global, categories, watchlist_size:s.watchlist.length };
mkdirSync(out,{recursive:true});
writeFileSync(join(out,'board.json'), JSON.stringify({model:'undercurrent-1',as_of:s.as_of,rows})+'\n');
writeFileSync(join(out,'data.js'), 'window.UNDERCURRENT='+JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4,'0'))+';\n');
for (const dir of ['dashboard','screenshots']) {
  rmSync(join(out,dir),{recursive:true,force:true});
  if (existsSync(join(root,dir))) cpSync(join(root,dir),join(out,dir),{recursive:true});
}
if ((existsSync(join(out,'screenshots')) ? readdirSync(join(out,'screenshots')).filter(n=>!n.startsWith('.')).length : 0) < 3) {
  rmSync(join(out,'dossier.json'),{force:true});
  console.error('Board and dashboard generated. Missing genuine screenshots: capture three views, then rerun to build the official dossier.');
  process.exitCode = 2;
} else {
  writeFileSync(join(out,'dossier.json'),buildDossier(out,{text_max_bytes:65536}));
  console.log(`UNDERCURRENT: ${rows.length} ranked rows; ${s.watchlist.length} watchlist; ${peers.length} calibration peers; dossier built.`);
}
