# Programming World Curriculum

## Target learner

Primary starting point: a capable child around age 8 who can reason about patterns and spatial problems but should not need to read programming instructions or learn syntax first.

The goal is not to teach a specific language. The goal is to build the mental models that later transfer to Scratch, Python, JavaScript, robotics, and similar systems.

## Learning sequence

### 1. Sequence

Mental model: a program is an ordered list of instructions and order matters.

The child builds a path for a robot using forward and turn blocks. Early stages use only forward movement; later stages require turns and longer command chains.

Success criterion: predict and construct the exact order needed to reach the goal.

### 2. Repeat / loops

Mental model: repeated work can be expressed once.

The child receives compact repeat blocks such as “forward ×2” and “forward ×3”. A path may also be solvable using many individual steps, but successful loop stages require a repeat block so the intended abstraction is learned rather than bypassed.

Success criterion: recognize repetition and shorten the program.

### 3. Conditions

Mental model: a program can decide what to do based on what is true now.

The first condition is visual: “if blocked, turn right”. Walls are shown directly in the robot grid. The command has an icon representing a test, wall, and turn rather than written `if` syntax.

Success criterion: place a conditional command where the robot must react to the environment.

### 4. State / variables

Mental model: a program can remember a value and use it later.

The robot collects gems into a visible memory box. The count increases, and a gate opens only when the remembered count is high enough. This introduces mutable state without requiring variable names or assignment syntax.

Success criterion: deliberately change stored state and later use that state to unlock progress.

### 5. Debugging

Mental model: a program can be almost correct; debugging means finding and changing the part that causes the wrong behavior.

Stages begin with a pre-built program containing an error. The child selects a command slot, replaces the command, runs the program, observes the robot, and iterates.

Success criterion: identify and repair a faulty instruction rather than rebuilding the whole solution.

## Interaction model

The programming world follows the existing Skola design rules:

- no child-facing written instructions
- large tablet touch targets
- pictographic blocks instead of language-specific syntax
- first-use ghost-hand demonstrations
- immediate run/observe feedback
- non-punitive errors
- hints point to the next problematic program position
- progress, mastery, mistakes, hints, and timing feed the existing adaptive system
- sound is optional; the activity remains fully usable muted

## Current command vocabulary

| Internal token | Child-facing meaning |
| --- | --- |
| `F` | move forward one cell |
| `L` | turn left |
| `R` | turn right |
| `F2` | repeat forward twice |
| `F3` | repeat forward three times |
| `IFW` | if the next cell is blocked, turn right |
| `PICK` | collect the gem and increase remembered count |
| `OPEN` | use remembered count to open the gate |

The internal token names are implementation details and are not shown as programming syntax to the child.

## Difficulty model

Each activity currently contains three stage families. The existing Skola mastery model chooses a stage near the learner’s current mastery and adjusts mastery using completion time, errors, hints, and clean success.

The first version deliberately keeps the command vocabulary small. Difficulty should increase primarily through reasoning depth, not through adding many buttons.

## Recommended next expansion

After the five current concepts are stable, the next useful progression is:

1. nested repeat blocks
2. two-way conditions (`if / else`)
3. named visual variables with `+1`, `-1`, and comparisons
4. reusable procedures / functions represented as colored custom blocks
5. events such as “when touched”, “when timer ends”, or “when another robot signals”
6. two-robot coordination and simple parallel logic
7. optional bridge to real syntax for older children, while preserving the visual model alongside it

Avoid introducing typed code before the child can comfortably explain the behavior of sequences, loops, conditions, state, and debugging through the visual system.
