# Default Markdown, less repeated work

[![make.fun](https://make.fun/badge/markdown-render-speed-02.svg)](https://make.fun/bounty/markdown-render-speed-02)
[![rank](https://make.fun/badge/markdown-render-speed-02/vantam3/make-fun/rank.svg)](https://make.fun/bounty/markdown-render-speed-02/leaderboard)
[![reward](https://make.fun/badge/markdown-render-speed-02/vantam3/make-fun/reward.svg)](https://make.fun/bounty/markdown-render-speed-02)

A default-options parser backed by the attributed marked 18.1.3 fork, with conservative plain-text tokenization and a standard-library batch driver. Vendored MIT notices remain under `vendor/marked/`.

```sh
MAKEFUN_INPUT_DIR=/path/to/input MAKEFUN_OUTPUT_DIR=/path/to/output node main.ts
```

The input directory holds cases.json; the output is html.json. The parse.js module exports parse(markdown). No runtime installation or network access is needed.

Local checks: 720/720 practice cases and 3,000 deterministic differential fuzz cases matched the unmodified reference exactly. Nine interleaved local rounds measured median 795 ms versus 995 ms (about 1.25x); these host timings do not establish the grader's CPU ranking. The interrupted original recording sealed without session documents after Cloud restoration; submission eligibility is unresolved.
