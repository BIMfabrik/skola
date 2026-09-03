# Sprint 02 — Manipulate, Explore, Adapt

## Goal

Move Skola from a silent quiz-like prototype toward a place where a pre-reader can learn by physically manipulating ideas.

## Shipped

### 1. Home island is navigation

The five learning worlds are now touchable objects placed directly on the island. The previous standalone subject dock is removed from the child flow. The selected world is shown only through visual state.

### 2. Direct-manipulation mathematics

- Shapes: drag a shape into its silhouette.
- Fractions: recreate the visual target by dragging colored pieces into equal partitions.
- Patterns: drag the missing object into the sequence.
- Symmetry: complete the mirrored grid directly.
- Angles: rotate the ray until it matches the target.

The first three no longer use answer-card selection as their primary mechanic.

### 3. Ghost gesture coach

Each new interaction type has a first-use demonstration. A small animated hand shows tap, drag, or motion without language. If the learner stops interacting, the relevant gesture can repeat as a hint.

Seen demonstrations are persisted locally so onboarding does not repeatedly interrupt normal play.

### 4. Adaptive challenge selection

Each activity now stores hidden local telemetry:

- mastery estimate
- successes
- mistakes
- hint use
- success streak
- rolling completion time

Stages have explicit difficulty. `chooseStageIndex()` selects the next stage nearest the current mastery estimate and avoids mechanically advancing through a fixed list. Clean, fast success increases mastery more strongly. Mistakes and hints reduce the increase and may cause an easier repeat.

The child never sees a level, mastery percentage, or algorithmic score.

## Acceptance checks

- Five island world nodes are the primary subject navigation.
- No visible child instruction text was introduced.
- Shape, fraction, and pattern activities require drag manipulation.
- First-use ghost gesture renders in a real browser.
- Low mastery selects the easiest shape stage; high mastery selects the hardest.
- A deliberate wrong shape move is recorded as an error and recovery still succeeds.
- A real stage completes in math, music, physics, chemistry, and nature.
- Progress persists to `localStorage`.
- Browser smoke test completes with zero runtime errors and zero browser warnings.
- iPad portrait and short-landscape layouts remain usable.

## Next candidates

- true fraction split / recombine gestures
- tangram composition and rotation
- balance / equality physics
- quantity and counting garden
- cross-activity skill graph
- parent/teacher layer behind a gate
