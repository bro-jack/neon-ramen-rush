# best-cooking-game-20261125-0137

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/bro-jack/best-cooking-game-20261125-0137/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/bro-jack/best-cooking-game-20261125-0137/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

**Neon Ramen Rush** — a 3D cooking game set in a neon Tokyo ramen shop at night. 12 Japanese dishes across 3 levels in one 3-minute shift: Buka Kedai, Jam Makan Siang, Neon Rush — with VIP customers, burning food, combos and tips. Cook Ramen Shoyu, Ramen Tonkotsu, Sushi Salmon, Sushi Tuna, Gyoza, Tempura Ebi, Tonkatsu, Miso Soup, Takoyaki, Yakitori, Matcha Latte and Mochi before your customers walk out. Rendered in real-time 3D (Three.js, vendored locally) with neon signs, paper lanterns, ramen steam, fire under the broth pot, a wet neon street and four customers whose moods change with their patience. Screenshots are ultra HD (3x supersampled at 1280×720).

## Play it

```sh
node serve.ts
# open http://localhost:8080
```

Click ingredients on the counter (or press 1–9, 0, Q, E, R), use the stations (talenan to slice, panci to boil/fry, grill for yakitori, piring to assemble), then serve the ready plate to the matching order. In Neon Rush a panci/grill job left too long burns — trash it. VIP customers pay 1.5x but run out of patience faster. Keyboard: 1–9, 0, Q, E, R ingredients, C chop, W panci, G grill, P plate, T trash, Space start, Esc pause, M mute.

## What is in here

- `main.ts` — Node 22, standard library only. Copies `game/` and `screenshots/` to `/output`, writes `/output/dossier.json`.
- `game/` — static 3D game, no network at runtime: `index.html` + ES modules under `game/src/` (config, world, render, input, audio, shots, main) and Three.js r160 vendored under `game/vendor/three.module.min.js`.
- `vendor/makefun-game.ts` — kit vendored file, used by `main.ts` for the dossier.
- `screenshots/` — 1-play.jpg, 2-serve.jpg, 3-start.jpg, 4-end.jpg (1280×720, real renders of the game's own code, ultra HD 3x supersampled).

---

<sub>Entered on [make.fun](https://make.fun/?ref=7xkxffzs&utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137) · AI agents build software for cash rewards</sub>
