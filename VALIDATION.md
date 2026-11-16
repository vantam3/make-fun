# Measured validation

- `node tests/game.test.mjs`: 7 passing checks: official vendor byte equality; menu/pause/resume/timeout/restart; axes/normalization/bounds; keyboard tether targeting and cargo capacity; storm damage/cargo scatter/invulnerability/sanctuary/hull loss; held-input release/autorepeat; full normal-control win and exact deterministic replay.
- Winning pilot: 12 delivered relics, all three stages, 5600 points, 15.13 simulation seconds, hull 5. Test fixtures exercise boundary cases only in Node; screenshots are never produced from fixtures.
- `node tests/packaging.test.mjs`: passing overlap rejection test covering source, descendants, ancestors, root and symlinks.
- `node tests/references.test.mjs`: passing local references and game-tree caps test; 9 entries, 23,775 bytes. No runtime fetch/WebSocket/XMLHttpRequest calls.
- Parent's `/workspace/makefun-tools/check-game-rules.mjs`: passes transitions, bounds, collection, delivery/win, timeout/loss, restart and deterministic 3600-step replay against the revised rules.
- Syntax checks passed for root main.ts, all six browser JS modules, and both external validation scripts.
- Official `vendor/makefun-game.ts` matches the starter exactly (`cmp` and byte-array assertion).
- Three genuine parent browser JPEG captures visually inspected: title, real collected cargo with storm warning, and storm defeat at 38 seconds with one delivery and restart. Sizes: 65,607 / 53,378 / 69,250 bytes; each 1200×760.
- `MAKEFUN_OUTPUT_DIR=/tmp/tideglass-final-output node main.ts` succeeded: 276,263-byte dossier.
- `node /tmp/tideglass-package-check.mjs` passed: screenshot dimensions/byte caps, library equality, unchanged screenshot copies, every output byte equal across two actual main.ts runs, and exact dossier equality against the official kit library. Retained outputs: `/tmp/tideglass-verify-tG7YwU`.

# Limits

Node checks ran on 24.22.1; source uses Node 22.18-compatible erasable TypeScript and standard library APIs, but native Node 22 was not executed here. The nested sandbox denies HTTP listening (`EPERM`) and Chromium sockets (`SIGTRAP`); browser captures were produced by the parent outside it. The images demonstrate actual play and defeat, but this session has not received the parent's full browser-assertion output. Audible sound quality and a human difficulty assessment remain unmeasured. Browser automation/capture and package-verification scripts are outside the repo at `/tmp/tideglass-browser-check.mjs` and `/tmp/tideglass-package-check.mjs`.

No credentials or session logs were accessed or changed. No agents, worktrees, paid APIs, financial actions, commits, pushes or submissions were used.
