# Pocket search

[![make.fun](https://make.fun/badge/tiny-chess-01.svg)](https://make.fun/bounty/tiny-chess-01)
[![rank](https://make.fun/badge/tiny-chess-01/vantam3/make-fun/rank.svg)](https://make.fun/bounty/tiny-chess-01/leaderboard)
[![reward](https://make.fun/badge/tiny-chess-01/vantam3/make-fun/reward.svg)](https://make.fun/bounty/tiny-chess-01)

A standard-library Python chess engine for the make.fun environment. Run `MAKEFUN_ENV_URL=<suite-url> python3 main.py`. Iterative deepening, alpha-beta, capture quiescence, transposition ordering and a fixed node budget make move choice reproducible. Supports castling, promotions and en passant.

The size-limited entrypoint is packed by make.fun's official compressor from development source kept outside the submitted tree. No other repository file is read at runtime. Local legality and repeatability checks are development evidence; Elo and prize eligibility are unmeasured.
