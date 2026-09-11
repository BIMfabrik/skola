/* Harder route-planning puzzles for the programming world. */
(() => {
  if (typeof ACTIVITIES === 'undefined' || !ACTIVITIES.codeSequence || !ACTIVITIES.codeRepeat) return;

  ACTIVITIES.codeSequence.stages = [
    {
      difficulty: 1.15,
      cols: 4, rows: 4,
      start: [0, 3], dir: 0, goal: [2, 1],
      walls: [[0, 1], [3, 2]],
      solution: ['F', 'R', 'F', 'F', 'L', 'F'],
      palette: ['F', 'L', 'R'],
    },
    {
      difficulty: 1.8,
      cols: 4, rows: 4,
      start: [0, 3], dir: 0, goal: [3, 0],
      walls: [[0, 1], [2, 2]],
      solution: ['F', 'R', 'F', 'L', 'F', 'F', 'R', 'F', 'F'],
      palette: ['F', 'L', 'R'],
    },
    {
      difficulty: 2.5,
      cols: 5, rows: 5,
      start: [4, 4], dir: 3, goal: [0, 0],
      walls: [[1, 4], [2, 0], [4, 2]],
      solution: ['F', 'F', 'R', 'F', 'F', 'F', 'L', 'F', 'F', 'R', 'F'],
      palette: ['F', 'L', 'R'],
    },
    {
      difficulty: 3.1,
      cols: 5, rows: 5,
      start: [0, 4], dir: 0, goal: [4, 0],
      walls: [[0, 2], [1, 2], [3, 2]],
      solution: ['F', 'R', 'F', 'F', 'L', 'F', 'F', 'R', 'F', 'F', 'L', 'F'],
      palette: ['F', 'L', 'R'],
    },
    {
      difficulty: 3.7,
      cols: 6, rows: 5,
      start: [5, 4], dir: 3, goal: [0, 0],
      walls: [[2, 4], [0, 2], [3, 0], [5, 2]],
      solution: ['F', 'F', 'R', 'F', 'F', 'L', 'F', 'F', 'R', 'F', 'F', 'L', 'F'],
      palette: ['F', 'L', 'R'],
    },
  ];

  /* Loops should compress a route, not just replace four identical arrows. */
  ACTIVITIES.codeRepeat.stages = [
    {
      difficulty: 1.55,
      cols: 5, rows: 4,
      start: [0, 3], dir: 0, goal: [2, 0],
      solution: ['F3', 'R', 'F2'],
      palette: ['F', 'L', 'R', 'F2', 'F3'],
      require: 'repeat',
    },
    {
      difficulty: 2.35,
      cols: 5, rows: 5,
      start: [0, 4], dir: 0, goal: [4, 0],
      solution: ['F3', 'F', 'R', 'F3', 'F'],
      palette: ['F', 'L', 'R', 'F2', 'F3'],
      require: 'repeat',
    },
    {
      difficulty: 3.1,
      cols: 5, rows: 5,
      start: [4, 4], dir: 3, goal: [0, 0],
      solution: ['F3', 'F', 'R', 'F3', 'F'],
      palette: ['F', 'L', 'R', 'F2', 'F3'],
      require: 'repeat',
    },
  ];

  validateCatalog();
  renderApp();
})();
