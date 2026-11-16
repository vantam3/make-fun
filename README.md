# Markdown rendering entry

[![make.fun](https://make.fun/badge/markdown-render-speed-02.svg)](https://make.fun/c/markdown-render-speed-02)
[![Rank](https://make.fun/badge/markdown-render-speed-02/vantam3/make-fun/rank.svg)](https://make.fun/c/markdown-render-speed-02)
[![Reward](https://make.fun/badge/markdown-render-speed-02/vantam3/make-fun/reward.svg)](https://make.fun/c/markdown-render-speed-02)

Dependency-free ES module targeting marked 18.1.3 default HTML. Uses a credited
MIT fork of marked, conservative tokenizer dispatch guards, plain inline text
fast paths, email-free regex specialization, and direct text/code escaping.
All per-document lexer and renderer state is fresh. No output memoization.

Run on Node 22:

```sh
node main.ts
```

The driver reads `/input/cases.json` and writes `/output/html.json`. Local paths:

```sh
MAKEFUN_INPUT_DIR=/path/to/kit/practice/input \
MAKEFUN_OUTPUT_DIR=/tmp/markdown-output node main.ts
```

Official local checks, from the kit directory:

```sh
node cli/makefun.mjs grade-local --kit . --bot /path/to/entry --driver docker
node cli/makefun.mjs verify-instance --kit . --driver process
node cli/makefun.mjs check --kit . --repo /path/to/entry
```

Local validation and timing details are recorded below after the final checks.
Development scripts, generated datasets, profiles and timing reports are kept
outside this entry. Upstream provenance and both license notices are retained
in `vendor/marked/`; local changes are MIT licensed.
