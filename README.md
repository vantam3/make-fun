# SIGNAL BREAK

[![make.fun](https://make.fun/badge/threejs-fps-02.svg)](https://make.fun/competitions/threejs-fps-02)
[![Rank](https://make.fun/badge/threejs-fps-02/vantam3/make-fun/rank.svg)](https://make.fun/competitions/threejs-fps-02)
[![Reward](https://make.fun/badge/threejs-fps-02/vantam3/make-fun/reward.svg)](https://make.fun/competitions/threejs-fps-02)

An original single-player tactical FPS in a coastal radar station. First to four rounds: eliminate three sentries or plant the uplink and defend its transmission. Sentries patrol, investigate gunfire, engage visible operators and navigate to defuse. Buy a precision sidearm, automatic rifle, extra frag or ablative armor between rounds.

Run `node serve.ts` with Node 22, then visit `http://localhost:8080`. Desktop Chrome with WebGL 2 and pointer lock is required. All game resources are local; no build or runtime network dependencies.

WASD moves, mouse aims, click fires, R reloads, Shift sprints, C/Ctrl crouches, G throws a frag, and holding E while stationary at terminal A plants. Escape pauses; use Resume to recapture the mouse. Armor absorbs half of body damage until its 60-point capacity runs out. Crouching and stopping improve accuracy. The Needle fires once per click; the Tide supports automatic fire.

`node tests/core.mjs` checks simulation mechanics. `MAKEFUN_OUTPUT_DIR=/tmp/signal-break-output node main.ts` copies the game and screenshots and builds the official deterministic dossier with the unchanged kit library. Capture screenshots through real browser interaction before packaging. The parent-run capture/check script is maintained outside this entry at `/tmp/fps-browser-check.mjs`.

The pre-existing simulation, input, map, combat, AI, HTML/CSS and parent armor correction were retained. This completion adds rendering, HUD and integration, round presentation, tests, packaging, and defuse/trigger refinements. three.js and the official dossier library are supplied kit dependencies, preserved unchanged with their notices. Original game code is MIT licensed.
