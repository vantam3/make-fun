# TIDEGLASS

[![make.fun](https://make.fun/badge/best-game-01.svg)](https://make.fun/c/best-game-01)
[![Rank](https://make.fun/badge/best-game-01/vantam3/make-fun/rank.svg)](https://make.fun/c/best-game-01)
[![Reward](https://make.fun/badge/best-game-01/vantam3/make-fun/reward.svg)](https://make.fun/c/best-game-01)

An original tactical salvage game for desktop browsers. Recover luminous relics with a magnetic tether and carry them to a drifting lighthouse before dawn. Three stages require 3, 4, then 5 delivered relics. Storms telegraph their origin before expanding; the lighthouse shelters and repairs your skiff. Cargo slows you down, but larger deliveries earn bonuses. Deliver again within 18 seconds to build a score multiplier. Five storm hits or running out of time ends the expedition.

Run `node serve.ts`, then open **http://127.0.0.1:8080**. No build or dependencies. Static `game/` can be hosted by any HTTP server. All art is original procedural Canvas2D; sounds are original synthesized WebAudio tones, enabled only by a gesture. No runtime network or external assets.

- **WASD / arrows:** steer. **Mouse aim + hold left button:** tether a relic within the faint range ring. **Hold Space:** tether the nearest relic, for keyboard-only play.
- Carry up to three relics, then sail inside the gold sanctuary ring to deliver automatically. Short trips are safer; full holds score more. Keep moving after an orange pulse warning.
- **Enter:** launch, resume, restart. **P / Esc:** pause. **M:** mute. All menu controls support Tab and Enter. **Quiet sea** reduces decorative motion and honors the browser's reduced-motion preference. Leaving the tab pauses play.

A reproducible winning route is exercised by `node tests/game.test.mjs`: use the nearest relic until holding `min(3, stage quota remaining)`, return to the moving sanctuary, and repeat. These tests also cover controls, collisions, protection, loss, restart and deterministic replay. They do not substitute for browser play-testing.

`main.ts` runs on Node 22.18+ with the standard library only. After capturing **3–4 genuine browser screenshots** into `screenshots/`, run:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/tideglass-output node main.ts
```

The output folder must not overlap this checkout. Packaging copies the actual game and screenshots and writes the official dossier using the unchanged kit library. Images must be PNG/JPEG, ≤256 KiB each, long side ≤1280 and short side ≥480; alphabetical first is the cover. No screenshot fixtures or staged game states are provided.

Parent browser validation/capture script: `/tmp/tideglass-browser-check.mjs` (outside the repository). With this server running, execute `node /tmp/tideglass-browser-check.mjs`; it uses installed Playwright and `/usr/bin/chromium`, real mouse/keyboard interactions and clock advancement to capture title, play and actual defeat results. Then run `node /tmp/tideglass-package-check.mjs` for output and dossier repeatability. Three genuine parent browser captures are present (title, cargo/storm gameplay, and storm defeat with restart). Each is 1200×760 and below 256 KiB. Two actual packaging runs matched byte for byte, copied screenshots were unchanged, and the dossier equaled a rebuild using the official kit library. Nine Node checks passed on Node 24.22.1, plus the parent’s 3600-step replay check. Local HTTP and Chromium launch are denied in the nested sandbox; full browser assertions must be reported from the parent’s run. Native Node 22 execution and audible sound quality have not been measured here.

Source modules separate fixed-step simulation, input, rendering, UI and audio. MIT licensed. Repository: [vantam3/make-fun](https://github.com/vantam3/make-fun). No rank or reward is claimed.
