/* Skola programming world — visual, wordless coding basics for children. */
(() => {
  const PROGRAMMING_WORLD = 'programming';
  const PROGRAMMING_IDS = ['codeSequence', 'codeRepeat', 'codeCondition', 'codeVariable', 'codeDebug'];
  const NEW_SKILL = () => ({ mastery: .08, attempts: 0, successes: 0, errors: 0, hints: 0, avgMs: 0, streak: 0 });

  WORLDS[PROGRAMMING_WORLD] = PROGRAMMING_IDS;
  Object.assign(ACTIVITIES, {
    codeSequence: {
      world: PROGRAMMING_WORLD, type: 'program', concept: 'sequence', skill: 'program-sequence', art: 'art-code-sequence',
      stages: [
        { difficulty: 1, cols: 4, rows: 4, start: [0, 2], dir: 1, goal: [3, 2], solution: ['F', 'F', 'F'], palette: ['F'] },
        { difficulty: 1.7, cols: 4, rows: 4, start: [0, 3], dir: 0, goal: [2, 1], solution: ['F', 'F', 'R', 'F', 'F'], palette: ['F', 'L', 'R'] },
        { difficulty: 2.6, cols: 4, rows: 4, start: [3, 3], dir: 0, goal: [0, 0], solution: ['F', 'F', 'F', 'L', 'F', 'F', 'F'], palette: ['F', 'L', 'R'] },
      ],
    },
    codeRepeat: {
      world: PROGRAMMING_WORLD, type: 'program', concept: 'repeat', skill: 'program-loops', art: 'art-code-repeat',
      stages: [
        { difficulty: 1.4, cols: 5, rows: 3, start: [0, 1], dir: 1, goal: [4, 1], solution: ['F3', 'F'], palette: ['F', 'F2', 'F3'], require: 'repeat' },
        { difficulty: 2.2, cols: 4, rows: 4, start: [0, 3], dir: 0, goal: [3, 0], solution: ['F3', 'R', 'F3'], palette: ['F', 'R', 'F2', 'F3'], require: 'repeat' },
        { difficulty: 3, cols: 5, rows: 5, start: [4, 4], dir: 3, goal: [0, 0], solution: ['F3', 'F', 'R', 'F3', 'F'], palette: ['F', 'L', 'R', 'F2', 'F3'], require: 'repeat' },
      ],
    },
    codeCondition: {
      world: PROGRAMMING_WORLD, type: 'program', concept: 'condition', skill: 'program-conditions', art: 'art-code-condition',
      stages: [
        { difficulty: 1.7, cols: 4, rows: 4, start: [0, 1], dir: 1, goal: [1, 3], walls: [[2, 1]], solution: ['F', 'IFW', 'F', 'F'], palette: ['F', 'R', 'IFW'], require: 'condition' },
        { difficulty: 2.5, cols: 4, rows: 4, start: [0, 0], dir: 1, goal: [0, 2], walls: [[2, 0], [1, 3]], solution: ['F', 'IFW', 'F', 'F', 'IFW', 'F'], palette: ['F', 'L', 'R', 'IFW'], require: 'condition' },
        { difficulty: 3.2, cols: 5, rows: 4, start: [4, 3], dir: 3, goal: [3, 0], walls: [[2, 3]], solution: ['F', 'IFW', 'F', 'F', 'F'], palette: ['F', 'L', 'R', 'IFW'], require: 'condition' },
      ],
    },
    codeVariable: {
      world: PROGRAMMING_WORLD, type: 'program', concept: 'variable', skill: 'program-state', art: 'art-code-variable',
      stages: [
        { difficulty: 1.9, cols: 5, rows: 4, start: [0, 2], dir: 1, goal: [4, 2], gems: [[1, 2]], gate: [3, 2], need: 1, solution: ['F', 'PICK', 'F', 'OPEN', 'F', 'F'], palette: ['F', 'PICK', 'OPEN'], require: 'variable' },
        { difficulty: 2.7, cols: 6, rows: 3, start: [0, 1], dir: 1, goal: [5, 1], gems: [[1, 1], [2, 1]], gate: [4, 1], need: 2, solution: ['F', 'PICK', 'F', 'PICK', 'F', 'OPEN', 'F', 'F'], palette: ['F', 'PICK', 'OPEN'], require: 'variable' },
        { difficulty: 3.4, cols: 5, rows: 5, start: [0, 4], dir: 0, goal: [2, 0], gems: [[0, 2]], gate: [0, 0], need: 1, solution: ['F', 'F', 'PICK', 'F', 'OPEN', 'F', 'R', 'F', 'F'], palette: ['F', 'L', 'R', 'PICK', 'OPEN'], require: 'variable' },
      ],
    },
    codeDebug: {
      world: PROGRAMMING_WORLD, type: 'program', concept: 'debug', skill: 'program-debugging', art: 'art-code-debug',
      stages: [
        { difficulty: 1.8, cols: 4, rows: 4, start: [0, 2], dir: 0, goal: [1, 0], solution: ['F', 'F', 'R', 'F'], prefill: ['F', 'R', 'R', 'F'], palette: ['F', 'L', 'R'], require: 'debug' },
        { difficulty: 2.6, cols: 4, rows: 4, start: [0, 3], dir: 0, goal: [2, 1], solution: ['F', 'F', 'R', 'F', 'F'], prefill: ['F', 'F', 'L', 'F', 'F'], palette: ['F', 'L', 'R'], require: 'debug' },
        { difficulty: 3.3, cols: 4, rows: 4, start: [0, 3], dir: 0, goal: [2, 0], solution: ['F3', 'R', 'F2'], prefill: ['F2', 'R', 'F2'], palette: ['F', 'R', 'F2', 'F3'], require: 'debug' },
      ],
    },
  });

  PROGRAMMING_IDS.forEach((id) => {
    if (!Number.isFinite(state.progress[id])) state.progress[id] = 0;
    if (!state.skills[id]) state.skills[id] = NEW_SKILL();
  });

  if (window.__skolaBootWorld === PROGRAMMING_WORLD) state.world = PROGRAMMING_WORLD;

  const baseRenderApp = renderApp;
  renderApp = function renderAppWithProgramming() {
    baseRenderApp();
    const node = $('.code-world-node');
    if (node) node.classList.toggle('active', state.world === PROGRAMMING_WORLD);
  };
  const programmingNode = $('.code-world-node');
  if (programmingNode) programmingNode.addEventListener('click', () => {
    state.world = PROGRAMMING_WORLD;
    playTap();
    renderApp();
  });

  const tokenHTML = (token) => {
    if (token === 'F') return '<span class="cmd-forward"></span>';
    if (token === 'L') return '<span class="cmd-turn left"></span>';
    if (token === 'R') return '<span class="cmd-turn right"></span>';
    if (token === 'F2' || token === 'F3') return `<span class="cmd-loop"></span><b>${token.slice(1)}</b><span class="cmd-forward small"></span>`;
    if (token === 'IFW') return '<span class="cmd-if"></span><span class="cmd-wall"></span><span class="cmd-turn right small"></span>';
    if (token === 'PICK') return '<span class="cmd-gem"></span><b>+1</b>';
    if (token === 'OPEN') return '<span class="cmd-memory"></span><span class="cmd-gate"></span>';
    return '';
  };

  const cellKey = (point) => `${point[0]}-${point[1]}`;
  const samePoint = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];

  function programGridHTML(stage) {
    const walls = new Set((stage.walls || []).map(cellKey));
    const gems = new Set((stage.gems || []).map(cellKey));
    const cells = [];
    for (let y = 0; y < stage.rows; y += 1) {
      for (let x = 0; x < stage.cols; x += 1) {
        const key = `${x}-${y}`;
        const classes = ['program-cell'];
        if (walls.has(key)) classes.push('wall');
        if (gems.has(key)) classes.push('gem-cell');
        if (samePoint(stage.goal, [x, y])) classes.push('goal');
        if (stage.gate && samePoint(stage.gate, [x, y])) classes.push('gate-cell');
        cells.push(`<span class="${classes.join(' ')}" data-x="${x}" data-y="${y}" style="grid-column:${x + 1};grid-row:${y + 1}"></span>`);
      }
    }
    return `<div class="program-target-wrap">
      <div class="program-concept concept-${ACTIVITIES[state.session.id].concept}" aria-hidden="true"></div>
      <div class="program-grid" style="--cols:${stage.cols};--rows:${stage.rows}">
        ${cells.join('')}
        <span class="program-robot" style="grid-column:${stage.start[0] + 1};grid-row:${stage.start[1] + 1};--dir:${stage.dir}"></span>
      </div>
      ${stage.need ? `<span class="program-memory target-memory"><span class="cmd-memory"></span><b>${stage.need}</b></span>` : ''}
    </div>`;
  }

  function setProgramForStage(stage) {
    if (!state.session.program || state.session.programStage !== state.session.index) {
      state.session.program = stage.prefill ? [...stage.prefill] : [];
      state.session.programStage = state.session.index;
      state.session.programSelected = -1;
      state.session.programRunning = false;
    }
  }

  function renderProgramStage(stage) {
    setProgramForStage(stage);
    $('#stageTarget').innerHTML = programGridHTML(stage);
    const board = $('#stageBoard');
    const slotCount = stage.solution.length;
    const slots = Array.from({ length: slotCount }, (_, index) => {
      const token = state.session.program[index];
      return `<button class="program-slot ${token ? 'filled' : ''}" data-slot="${index}" aria-label="program slot">${token ? tokenHTML(token) : ''}</button>`;
    }).join('');
    board.innerHTML = `<div class="program-lab">
      <div class="program-runtime">
        <span class="program-memory" id="programMemory"><span class="cmd-memory"></span><b>0</b></span>
        <span class="program-bug" aria-hidden="true"></span>
      </div>
      <div class="program-slots">${slots}</div>
      <div class="program-palette">${stage.palette.map((token) => `<button class="program-token token-${token.toLowerCase()}" data-token="${token}" aria-label="command">${tokenHTML(token)}</button>`).join('')}</div>
      <div class="program-controls">
        <button class="program-undo" aria-label="undo"><span></span></button>
        <button class="program-run" aria-label="run"><span></span></button>
      </div>
    </div>`;

    $$('.program-slot', board).forEach((slot) => slot.addEventListener('click', () => {
      if (!state.session || state.session.done || state.session.programRunning) return;
      const index = Number(slot.dataset.slot);
      if (ACTIVITIES[state.session.id].concept === 'debug') {
        state.session.programSelected = index;
        $$('.program-slot', board).forEach((node) => node.classList.toggle('selected', node === slot));
      } else if (state.session.program[index]) {
        state.session.program.splice(index, 1);
        renderProgramStage(stage);
      }
      resetHint();
      playTap();
    }));

    $$('.program-token', board).forEach((button) => button.addEventListener('click', () => {
      if (!state.session || state.session.done || state.session.programRunning) return;
      const token = button.dataset.token;
      if (ACTIVITIES[state.session.id].concept === 'debug') {
        const index = state.session.programSelected;
        if (index < 0) {
          const firstWrong = firstProgramDifference(stage, state.session.program);
          state.session.programSelected = firstWrong >= 0 ? firstWrong : 0;
        }
        state.session.program[state.session.programSelected] = token;
        state.session.programSelected = -1;
      } else if (state.session.program.length < slotCount) {
        state.session.program.push(token);
      }
      playTap();
      resetHint();
      renderProgramStage(stage);
    }));

    $('.program-undo', board).addEventListener('click', () => {
      if (!state.session || state.session.done || state.session.programRunning) return;
      if (ACTIVITIES[state.session.id].concept === 'debug') {
        state.session.program = [...stage.prefill];
        state.session.programSelected = -1;
      } else {
        state.session.program.pop();
      }
      playTap();
      resetHint();
      renderProgramStage(stage);
    });
    $('.program-run', board).addEventListener('click', () => runProgram(stage));
  }

  function firstProgramDifference(stage, program) {
    const max = Math.max(stage.solution.length, program.length);
    for (let i = 0; i < max; i += 1) if (stage.solution[i] !== program[i]) return i;
    return -1;
  }

  function meetsConcept(stage, program) {
    if (stage.require === 'repeat') return program.some((token) => token === 'F2' || token === 'F3');
    if (stage.require === 'condition') return program.includes('IFW');
    if (stage.require === 'variable') return program.includes('PICK') && program.includes('OPEN');
    if (stage.require === 'debug') return stage.prefill && program.some((token, index) => token !== stage.prefill[index]);
    return true;
  }

  function simulateProgram(stage, program) {
    const walls = new Set((stage.walls || []).map(cellKey));
    const gems = new Set((stage.gems || []).map(cellKey));
    const collected = new Set();
    const gateKey = stage.gate ? cellKey(stage.gate) : null;
    let gateOpen = !gateKey;
    let x = stage.start[0];
    let y = stage.start[1];
    let dir = stage.dir;
    let memory = 0;
    let failed = false;
    let failIndex = -1;
    const snapshots = [{ tokenIndex: -1, x, y, dir, memory, gateOpen, collected: [] }];
    const vectors = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    const blockedAhead = () => {
      const [dx, dy] = vectors[dir];
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= stage.cols || ny >= stage.rows) return true;
      const key = `${nx}-${ny}`;
      return walls.has(key) || (gateKey === key && !gateOpen);
    };
    const push = (tokenIndex) => snapshots.push({ tokenIndex, x, y, dir, memory, gateOpen, collected: [...collected] });
    const forward = (tokenIndex) => {
      if (blockedAhead()) {
        failed = true;
        failIndex = tokenIndex;
        return;
      }
      const [dx, dy] = vectors[dir];
      x += dx;
      y += dy;
      push(tokenIndex);
    };

    for (let i = 0; i < program.length && !failed; i += 1) {
      const token = program[i];
      if (token === 'F') forward(i);
      else if (token === 'L') { dir = (dir + 3) % 4; push(i); }
      else if (token === 'R') { dir = (dir + 1) % 4; push(i); }
      else if (token === 'F2' || token === 'F3') {
        const count = Number(token.slice(1));
        for (let step = 0; step < count && !failed; step += 1) forward(i);
      } else if (token === 'IFW') {
        if (blockedAhead()) dir = (dir + 1) % 4;
        push(i);
      } else if (token === 'PICK') {
        const key = `${x}-${y}`;
        if (gems.has(key) && !collected.has(key)) { collected.add(key); memory += 1; }
        push(i);
      } else if (token === 'OPEN') {
        const [dx, dy] = vectors[dir];
        const front = `${x + dx}-${y + dy}`;
        if (gateKey && front === gateKey && memory >= (stage.need || 1)) gateOpen = true;
        else { failed = true; failIndex = i; }
        push(i);
      }
    }
    const success = !failed && x === stage.goal[0] && y === stage.goal[1] && meetsConcept(stage, program);
    if (!success && failIndex < 0) failIndex = firstProgramDifference(stage, program);
    return { success, failIndex, snapshots };
  }

  function updateProgramVisual(stage, snapshot) {
    const robot = $('.program-robot', $('#stageTarget'));
    if (robot) {
      robot.style.gridColumn = String(snapshot.x + 1);
      robot.style.gridRow = String(snapshot.y + 1);
      robot.style.setProperty('--dir', snapshot.dir);
    }
    $$('.program-cell.gem-cell', $('#stageTarget')).forEach((cell) => {
      const key = `${cell.dataset.x}-${cell.dataset.y}`;
      cell.classList.toggle('collected', snapshot.collected.includes(key));
    });
    const gate = $('.program-cell.gate-cell', $('#stageTarget'));
    if (gate) gate.classList.toggle('open', snapshot.gateOpen);
    const memory = $('#programMemory');
    if (memory) $('b', memory).textContent = snapshot.memory;
    $$('.program-slot').forEach((slot) => slot.classList.toggle('running', Number(slot.dataset.slot) === snapshot.tokenIndex));
  }

  function runProgram(stage) {
    if (!state.session || state.session.done || state.session.programRunning) return;
    const program = [...state.session.program];
    if (program.length !== stage.solution.length || program.some((token) => !token)) {
      const run = $('.program-run');
      if (run) markWrong(run);
      return;
    }
    resetHint();
    state.session.programRunning = true;
    $$('.program-slot').forEach((slot) => slot.classList.remove('wrong', 'hint', 'running'));
    const result = simulateProgram(stage, program);
    const snapshots = result.snapshots;
    snapshots.forEach((snapshot, index) => {
      addTimer(setTimeout(() => {
        if (!state.session) return;
        updateProgramVisual(stage, snapshot);
      }, index * 230));
    });
    addTimer(setTimeout(() => {
      if (!state.session) return;
      state.session.programRunning = false;
      if (result.success) {
        completeStage();
      } else {
        const slot = $(`.program-slot[data-slot="${Math.max(0, result.failIndex)}"]`);
        if (slot) markWrong(slot); else markWrong($('.program-run'));
        const bug = $('.program-bug');
        if (bug) { bug.classList.add('show'); setTimeout(() => bug.classList.remove('show'), 900); }
      }
    }, snapshots.length * 230 + 120));
  }

  const baseRenderStage = renderStage;
  renderStage = function renderStageWithProgramming() {
    const session = state.session;
    const activity = session ? ACTIVITIES[session.id] : null;
    if (!session || !activity || activity.type !== 'program') return baseRenderStage();
    const stage = activity.stages[session.index];
    $('#overlayStars').textContent = state.stars;
    $('#gameProgress').innerHTML = Array.from({ length: session.rounds }, (_, index) => `<i class="${index <= session.round ? 'filled' : ''}"></i>`).join('');
    renderProgramStage(stage);
    resetStageTelemetry();
    scheduleFirstDemo('program');
    scheduleHint();
  };

  const baseGestureDemo = showGestureDemo;
  showGestureDemo = function showGestureDemoWithProgramming(type = ACTIVITIES[state.session?.id]?.type) {
    if (type !== 'program') return baseGestureDemo(type);
    if (!state.session || state.session.done) return;
    const board = $('#stageBoard');
    if (!board || $('.gesture-hand', board)) return;
    const stage = ACTIVITIES[state.session.id].stages[state.session.index];
    const wrong = firstProgramDifference(stage, state.session.program || []);
    const from = $('.program-token', board);
    const to = $(`.program-slot[data-slot="${wrong >= 0 ? wrong : 0}"]`, board);
    if (!from || !to) return;
    const boardRect = board.getBoundingClientRect();
    const start = elementCenter(from, boardRect);
    const end = elementCenter(to, boardRect);
    const hand = document.createElement('div');
    hand.className = 'gesture-hand';
    hand.setAttribute('aria-hidden', 'true');
    hand.innerHTML = '<span></span>';
    hand.style.left = `${start.x}px`;
    hand.style.top = `${start.y}px`;
    board.appendChild(hand);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const animation = hand.animate([
      { opacity: 0, transform: 'translate(-50%,-50%) scale(.92)' },
      { opacity: 1, transform: 'translate(-50%,-50%) scale(1)', offset: .16 },
      { opacity: 1, transform: `translate(-50%,-50%) translate(${dx}px,${dy}px) scale(.9)`, offset: .78 },
      { opacity: 0, transform: `translate(-50%,-50%) translate(${dx}px,${dy}px) scale(.78)` },
    ], { duration: 1300, easing: 'cubic-bezier(.2,.8,.2,1)' });
    animation.onfinish = () => hand.remove();
  };

  const baseShowHint = showHint;
  showHint = function showHintWithProgramming() {
    if (!state.session || ACTIVITIES[state.session.id]?.type !== 'program') return baseShowHint();
    const stage = ACTIVITIES[state.session.id].stages[state.session.index];
    recordStageHint();
    const index = firstProgramDifference(stage, state.session.program || []);
    const slot = $(`.program-slot[data-slot="${index >= 0 ? index : 0}"]`);
    if (slot) { slot.classList.add('hint'); setTimeout(() => slot.classList.remove('hint'), 900); }
    const expected = stage.solution[index >= 0 ? index : 0];
    const token = $(`.program-token[data-token="${expected}"]`);
    if (token) { token.classList.add('hint'); setTimeout(() => token.classList.remove('hint'), 900); }
    showGestureDemo('program');
    scheduleHint();
  };

  validateCatalog();
  renderApp();
})();
