# Skola — Silent Learning Playground

## Product thesis

Skola is a tablet-first learning playground for children roughly 5–12. Its defining rule is simple: **a child should be able to begin learning before they can read**.

The child-facing experience therefore teaches through visual demonstration, direct manipulation, animation, sound, rhythm, spatial relationships, and immediate physical-style feedback. Text belongs mainly in the adult layer and appears in the child layer only when symbols or written language become the learning subject itself.

## Design principles

1. **Show, do not explain.** New mechanics are demonstrated by motion or a ghost hand, not written instructions.
2. **Manipulate the idea itself.** Children move shapes, split wholes, balance weights, mix colors, repeat rhythms, rotate rays, and complete patterns instead of answering worksheet-style questions.
3. **One interaction language.** Reuse tap, drag, rotate, split, trace, group, and sort across all subjects.
4. **No submit button.** Correct actions resolve immediately and the next challenge arrives automatically.
5. **No punishment language.** Wrong actions wobble, bounce back, or simply fail to fit. Avoid red error screens, scores of failure, and written correction.
6. **Progress creates something.** Completion grows a persistent world instead of relying mainly on XP.
7. **Difficulty is invisible.** The child should not select age, grade, or difficulty. The system adapts behind the scenes.
8. **Works muted.** Early activities must remain understandable without audio. Sound should enrich rather than carry instructions.
9. **Tablet native first.** Large targets, safe-area support, landscape/portrait layouts, no hover dependency, no tiny controls.
10. **Calm delight.** Reward discovery with motion and sound without turning every action into overstimulation.

## Child interaction vocabulary

| Gesture | Meaning | Reused in |
| --- | --- | --- |
| Tap | choose / activate | shapes, pattern, music, sorting |
| Drag | move / give / place | fractions, building, physics, chemistry |
| Rotate | align / compare direction | geometry, gears, molecules |
| Split / swipe | divide a whole | fractions, symmetry |
| Trace | follow path / contour | geometry, motion, later writing |
| Group / sort | classify / count | number sense, nature, materials |

When a gesture is new, Skola briefly demonstrates it. If the child is inactive for several seconds, a subtle hint repeats. Hints disappear immediately once the child acts.

## Home world

The home screen is a persistent visual island. Learning adds visible objects to it: tree, house, roof, bridge, wheel, sun, flag, and later larger world elements. This turns progress into ownership: **I built this**.

Subject navigation is icon-only in the child UI:

- Math / geometry
- Music
- Physics
- Chemistry
- Nature
- Future: logic / coding, art / pattern, astronomy

The adult layer may name these sections; the child layer should not require the names.

## Learning worlds

### Math and geometry

Early progression is quantity and space first, symbols second.

- Match and sort shapes
- Build pictures from geometric pieces
- Fractions as splitting and recombining objects
- Symmetry and reflection
- Visual patterns
- Bigger / smaller, more / less, same / different
- Counting objects, then dots, then number symbols
- Spatial relations and coordinates
- Length, perimeter, area, volume through filling and building
- Angles by rotating objects to targets
- Fractions, ratios, decimals through visual equivalence
- Pythagoras by rearranging areas
- Sine / cosine through changing right triangles before formulas appear

### Music

Music can remain almost completely language-free.

- Copy a rhythm
- Repeat a short melody
- High / low sound matching
- Fast / slow pulse
- Instrument timbre matching
- Arrange sound blocks to make patterns
- Hear and reproduce intervals
- Later: notation appears only after auditory/visual understanding

### Physics

Physics begins as cause and effect.

- Roll balls down adjustable ramps
- Balance different objects
- Push / pull with springs and fans
- Magnet attraction and repulsion
- Floating and sinking
- Light and shadow
- Simple gears and levers
- Motion, friction, momentum
- Later: graph the motion the child already created

### Chemistry

For young children this is a materials and transformation laboratory, not chemical notation.

- Mix colors
- Dissolve / not dissolve
- Solid / liquid / gas transformations
- Temperature effects
- Safe visual reaction simulations
- Sort materials by observable properties
- Build molecules as spatial puzzles
- Later: symbols and the periodic table attach to already-known behaviors

### Nature

- Seed to plant growth
- Life cycles
- Match animals to habitats
- Food chains
- Seasons
- Tracks and silhouettes
- Classification by visible properties
- Ecosystems and simple cause/effect relationships

## Age progression

### Approx. 5–6: direct visual reasoning

Minimal symbols. Focus on matching, sorting, counting, shapes, patterns, symmetry, halves, spatial orientation, rhythm, cause/effect, and observation.

### Approx. 6–8: visual models with emerging symbols

Addition/subtraction as objects and groups, multiplication as repeated groups, fractions, number lines, measuring, perimeter, area grids, clocks, simple coordinates, rhythm structures, simple physical systems.

### Approx. 8–10: visual-to-symbolic transition

Multiplication/division, decimals, more complex fractions, angles, area/volume, transformations, ratios, simple equations, graphs, material properties, force and motion.

### Approx. 10–12: symbols become a normal tool

Algebra, percentages, ratios, Pythagoras, graphing, probability, trigonometry, physical quantities, chemistry notation. Even here, symbolic rules should emerge from interactive models first.

## Adaptation model

The prototype now includes a first hidden mastery engine. Each activity stores local skill telemetry without exposing a score to the child:

- successful stage completions
- mistakes during a stage
- hint usage
- completion time
- clean-success streaks
- rolling response time
- estimated mastery from 0–1

The next stage is selected by matching the learner's mastery to stage difficulty. A clean, fast success moves the estimate upward more strongly; errors and hints reduce the increase or can lower mastery slightly. The selector may repeat an easier stage when the learner struggles and selects harder variants as mastery rises.

The learner never sees this algorithmic score. Adaptation changes the next challenge silently. A future production model should extend this into a graph of transferable skills across activities and subjects.

## Feedback model

Correct:
- object snaps into place
- short harmonious sound
- restrained particle burst
- world progress may unlock visibly
- next challenge appears automatically

Incorrect:
- object returns / wiggles
- soft neutral tone
- no written message
- optional visual hint after repeated hesitation

## Adult layer — future

Hidden behind a parent gate / PIN / long press:

- learner profiles
- progress by concept
- difficulty calibration
- sound and accessibility controls
- daily time limits
- learning goals
- content availability
- language / reading mode when appropriate
- export / sync

## Technical architecture

The prototype remains a static web app deployable on GitHub Pages. Keep the child experience offline-friendly and deterministic.

### Core modules

- **Shell:** navigable home island, safe-area/layout management
- **Activity catalog:** data describing activities, visual variants, and difficulty
- **Adaptive selector:** maps hidden mastery to the next suitable stage
- **Activity engine:** tracks round telemetry and advances automatically
- **Interaction renderers:** drag-to-fit, fraction construction, pattern drag, mirror grid, rotate, rhythm, ramp, mixing, ordering
- **Gesture coach:** first-use and idle-time ghost-hand demonstrations
- **Feedback engine:** motion, tones, particles, hint timing
- **Progress store:** localStorage for progress, mastery, and learned gestures; replaceable later
- **World builder:** maps progress to persistent visual unlocks

### Engineering rules

- No external framework unless the product needs one
- No network dependency for core games
- Semantic buttons and ARIA labels even when labels are visually hidden
- Pointer events must support touch and mouse
- Respect `prefers-reduced-motion`
- No reliance on hover
- Avoid layout shifts when stages change
- Separate game data from rendering logic
- Validate all game stages programmatically
- Keep game state reset/cleanup deterministic

## Prototype scope — current milestone

### Fully playable

Math:
- drag shapes into matching silhouettes
- construct visual fractions by moving pieces into equal partitions
- mirror completion
- complete visual sequences by dragging the missing object
- angle matching by direct rotation

Music:
- rhythm and short melody imitation using four colored bars

Physics:
- direct manipulation of an adjustable ramp

Chemistry:
- visual color mixing

Nature:
- touch-drag life-cycle and sequence ordering

The home island itself is now the subject selector. First use of a mechanic is demonstrated by a ghost hand and repeated after inactivity when useful.

## Next high-value activities

1. **Fraction playground II:** allow true split/recombine gestures and fraction equivalence.
2. **Tangram builder:** drag and rotate several pieces into silhouettes.
3. **Number garden:** quantities → dots → digits.
4. **Physics sandbox:** add balls, friction surfaces, momentum and prediction.
5. **Balance lab:** drag masses onto scales and discover equality.
6. **Chemistry lab II:** pour/dissolve/state-change interactions beyond color mixing.
7. **Plant growth lab:** choose light/water conditions and observe changes.
8. **Music composer:** place sound blocks to create and replay short melodies.
9. **Visual coding:** arrow blocks to navigate the companion.
10. **Cross-skill graph:** connect mastery signals between related activities.

## Success criteria

A strong 5–6-year-old prototype passes these tests:

- A child can start a game without an adult reading anything.
- The first meaningful action is obvious within a few seconds.
- A wrong action explains itself through behavior rather than text.
- The child can complete the core loop with sound muted.
- Navigation remains usable in iPad portrait and landscape.
- Progress is visible as a changed world, not only a number.
- Replaying an activity is possible without resetting the whole app.
- No child-facing screen depends on English.
