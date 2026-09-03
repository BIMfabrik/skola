# Skola

A tablet-first **silent learning playground** for children roughly 5–12.

The child-facing interface is designed to work before fluent reading: learning is communicated through visual targets, direct manipulation, animation, sound, rhythm, spatial relationships, and immediate feedback rather than written instructions.

**Live prototype:** https://bimfabrik.github.io/skola/

## Current playable worlds

- **Math / geometry:** drag-to-fit shapes, construct fractions, symmetry, drag-complete patterns, angle rotation
- **Music:** rhythm and melody imitation
- **Physics:** adjustable ramp matching
- **Chemistry:** visual color mixing
- **Nature:** touch-drag life-cycle / sequence ordering

Progress persists locally and visibly builds the home island. The island itself is now the subject navigation: children select worlds by touching objects in the scene rather than using a conventional menu.

## Product specification

See [`PRODUCT_SPEC.md`](PRODUCT_SPEC.md) for the learning model, 5–12 progression, gesture vocabulary, adaptive-learning direction, adult layer, architecture, and roadmap.

## Design constraints

- no child-facing written instructions
- large touch targets and iPad-safe layouts
- direct drag / tap / rotate interaction vocabulary
- first-use ghost-hand gesture demonstrations
- hidden adaptive difficulty based on mistakes, hints, completion time, and mastery
- automatic progression after success
- non-punitive wrong-answer behavior
- useful with sound muted
- no network dependency for core games
- no framework dependency for the prototype

## Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Validate

```bash
python3 tests/validate.py
```

With a local Chrome DevTools session available, the deeper interaction suite is:

```bash
python3 tests/browser_smoke.py
```

The validation checks JavaScript syntax, required product files, offline/static-resource assumptions, the wordless child shell, minimum touch-target styling, and the presence of every activity renderer.

For the current milestone, browser QA was also performed in headless Google Chrome at desktop and iPad-sized viewports with interaction smoke tests across every subject world.
