# Skola

A tablet-first learning platform prototype for children aged 5–12.

## Prototype scope

- iPad/iPhone-first responsive interface using Apple-style interaction patterns
- large touch targets and shallow subject navigation
- game-like progress through learning “worlds”
- Geometry curriculum from basic shapes and fractions through sine/cosine
- playable visual challenges with immediate feedback
- age-band filtering for 5–6, 7–8, 9–10 and 11–12
- local progress persistence with no backend required

## Run locally

Open `index.html`, or run a small static server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Product direction

The top-level subject model is intentionally shallow: Geometry, Numbers, Words, Nature and Logic. Within a subject, children navigate a visual learning path rather than nested menus. Each world contains short, touch-first challenges.
