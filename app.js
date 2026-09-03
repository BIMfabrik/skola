const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const WORLDS = {
  math: ['shapes', 'parts', 'mirror', 'pattern', 'turn'],
  music: ['rhythm', 'melody'],
  physics: ['ramp'],
  chemistry: ['mix'],
  nature: ['grow'],
};

const ACTIVITIES = {
  shapes: {
    world: 'math', type: 'choice', art: 'art-shapes',
    stages: [
      { target: { kind: 'shape', value: 'circle' }, options: ['triangle', 'circle', 'diamond', 'square'], answer: 1 },
      { target: { kind: 'shape', value: 'triangle' }, options: ['circle', 'square', 'triangle', 'diamond'], answer: 2 },
      { target: { kind: 'shape', value: 'square' }, options: ['hexagon', 'triangle', 'square', 'circle'], answer: 2 },
    ],
  },
  parts: {
    world: 'math', type: 'fraction', art: 'art-parts',
    stages: [
      { target: { parts: 2, fill: [0] }, options: [{ parts: 2, fill: [0] }, { parts: 3, fill: [0] }, { parts: 4, fill: [0] }, { parts: 4, fill: [0, 1] }], answer: 0 },
      { target: { parts: 3, fill: [0] }, options: [{ parts: 2, fill: [0] }, { parts: 3, fill: [0, 1] }, { parts: 3, fill: [0] }, { parts: 4, fill: [0] }], answer: 2 },
      { target: { parts: 4, fill: [0, 1, 2] }, options: [{ parts: 4, fill: [0, 1] }, { parts: 3, fill: [0, 1] }, { parts: 4, fill: [0, 1, 2] }, { parts: 2, fill: [0] }], answer: 2 },
    ],
  },
  mirror: {
    world: 'math', type: 'mirror', art: 'art-mirror',
    stages: [
      { rows: 4, cols: 6, source: ['0-0', '1-0', '1-1', '2-1', '3-1', '2-2'] },
      { rows: 4, cols: 6, source: ['0-1', '1-0', '1-1', '1-2', '2-0', '2-2', '3-1'] },
      { rows: 4, cols: 6, source: ['0-2', '1-1', '1-2', '2-0', '2-1', '2-2', '3-2'] },
    ],
  },
  pattern: {
    world: 'math', type: 'pattern', art: 'art-pattern',
    stages: [
      { sequence: ['circle', 'square', 'circle'], options: ['square', 'triangle', 'diamond'], answer: 0 },
      { sequence: ['triangle', 'triangle', 'square'], options: ['triangle', 'square', 'circle'], answer: 0 },
      { sequence: ['diamond', 'circle', 'diamond'], options: ['triangle', 'circle', 'diamond'], answer: 1 },
    ],
  },
  turn: {
    world: 'math', type: 'angle', art: 'art-turn',
    stages: [
      { target: 45, start: 120 },
      { target: 90, start: 28 },
      { target: 135, start: 78 },
    ],
  },
  rhythm: {
    world: 'music', type: 'rhythm', art: 'art-rhythm',
    stages: [
      { sequence: [0, 2, 1] },
      { sequence: [3, 1, 2, 1] },
      { sequence: [0, 1, 3, 2, 3] },
    ],
  },
  melody: {
    world: 'music', type: 'rhythm', art: 'preview-music',
    stages: [
      { sequence: [0, 1, 2] },
      { sequence: [0, 2, 3, 2] },
      { sequence: [3, 2, 1, 0, 1] },
    ],
  },
  ramp: {
    world: 'physics', type: 'ramp', art: 'preview-physics',
    stages: [
      { target: 28, start: 8 },
      { target: 50, start: 18 },
      { target: 72, start: 36 },
    ],
  },
  mix: {
    world: 'chemistry', type: 'mix', art: 'preview-chemistry',
    stages: [
      { target: '#7bcf8b', ingredients: ['#5d9df5', '#ffcf57', '#ff6b6b'], answer: [0, 1] },
      { target: '#a878dc', ingredients: ['#5d9df5', '#ffcf57', '#eb6c9d'], answer: [0, 2] },
      { target: '#f19a68', ingredients: ['#ffcf57', '#ff6b6b', '#5d9df5'], answer: [0, 1] },
    ],
  },
  grow: {
    world: 'nature', type: 'order', art: 'art-preview',
    stages: [
      { order: ['seed', 'sprout', 'plant', 'flower'] },
      { order: ['egg', 'caterpillar', 'cocoon', 'butterfly'] },
      { order: ['cloud', 'rain', 'puddle', 'sun'] },
    ],
  },
};

const DEFAULT_PROGRESS = Object.fromEntries(Object.keys(ACTIVITIES).map((id) => [id, 0]));
const DEFAULT_STATE = { world: 'math', stars: 0, muted: false, progress: DEFAULT_PROGRESS };

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('skola-silent-v3') || '{}');
    return {
      world: WORLDS[saved.world] ? saved.world : DEFAULT_STATE.world,
      stars: Number.isFinite(saved.stars) ? saved.stars : 0,
      muted: Boolean(saved.muted),
      progress: { ...DEFAULT_PROGRESS, ...(saved.progress || {}) },
      session: null,
    };
  } catch {
    return { ...DEFAULT_STATE, progress: { ...DEFAULT_PROGRESS }, session: null };
  }
}

const state = loadState();
const overlay = $('#gameOverlay');
let audioContext = null;
let audioUnlocked = false;

function validateCatalog() {
  const errors = [];
  for (const [world, ids] of Object.entries(WORLDS)) {
    for (const id of ids) {
      const activity = ACTIVITIES[id];
      if (!activity) errors.push(`Missing activity: ${id}`);
      else if (activity.world !== world) errors.push(`Wrong world for ${id}`);
    }
  }
  for (const [id, activity] of Object.entries(ACTIVITIES)) {
    if (!Array.isArray(activity.stages) || activity.stages.length === 0) errors.push(`No stages: ${id}`);
    if (!activity.type) errors.push(`No type: ${id}`);
  }
  if (errors.length) throw new Error(`Skola catalog invalid:\n${errors.join('\n')}`);
}

function saveState() {
  localStorage.setItem('skola-silent-v3', JSON.stringify({
    world: state.world,
    stars: state.stars,
    muted: state.muted,
    progress: state.progress,
  }));
}

function totalProgress() {
  return Object.values(state.progress).reduce((sum, value) => sum + value, 0);
}

function renderApp() {
  $('#starCount').textContent = state.stars;
  $('#overlayStars').textContent = state.stars;
  $('#soundButton').textContent = state.muted ? '♫' : '♪';
  $('#soundButton').classList.toggle('muted', state.muted);
  $$('.world-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.world === state.world));
  renderWorldProgress();
  renderActivities();
  saveState();
}

function renderWorldProgress() {
  const thresholds = [
    ['.tree', 1], ['.house', 2], ['.roof', 3], ['.bridge', 5],
    ['.wheel', 7], ['.sun', 9], ['.flag', 12],
  ];
  const progress = totalProgress();
  thresholds.forEach(([selector, threshold]) => $(selector).classList.toggle('unlocked', progress >= threshold));
}

function renderActivities() {
  const grid = $('#activityGrid');
  grid.innerHTML = '';
  const ids = WORLDS[state.world];
  const firstIncomplete = ids.find((id) => state.progress[id] < ACTIVITIES[id].stages.length);

  ids.forEach((id) => {
    const activity = ACTIVITIES[id];
    const completed = state.progress[id] || 0;
    const total = activity.stages.length;
    const card = document.createElement('button');
    card.className = `activity-card ${id === firstIncomplete ? 'current' : ''}`;
    card.dataset.activity = id;
    card.setAttribute('aria-label', id);
    const dots = Array.from({ length: total }, (_, index) => `<i class="${index < completed ? 'filled' : ''}"></i>`).join('');
    card.innerHTML = `
      <div class="card-ring"></div>
      <div class="card-art ${activity.art}"></div>
      <div class="card-footer">
        <span class="progress-dots">${dots}</span>
        <span class="card-badge ${completed >= total ? 'done' : ''}">${completed >= total ? '✓' : '▶'}</span>
      </div>`;
    card.addEventListener('click', () => openActivity(id));
    grid.appendChild(card);
  });
}

function startIndexFor(id) {
  const total = ACTIVITIES[id].stages.length;
  const saved = state.progress[id] || 0;
  return saved >= total ? 0 : saved;
}

function openActivity(id) {
  closeSessionTimers();
  const index = startIndexFor(id);
  const activity = ACTIVITIES[id];
  state.session = {
    id,
    index,
    done: false,
    timers: [],
    hintTimer: null,
    selected: new Set(),
    input: [],
    locked: false,
    angle: activity.type === 'angle' ? activity.stages[index].start : 0,
    ramp: activity.type === 'ramp' ? activity.stages[index].start : 0,
    dragOrder: [],
  };
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  renderStage();
}

function closeSessionTimers() {
  if (!state.session) return;
  state.session.timers.forEach(clearTimeout);
  clearTimeout(state.session.hintTimer);
}

function closeActivity() {
  closeSessionTimers();
  state.session = null;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderStage() {
  const session = state.session;
  const activity = ACTIVITIES[session.id];
  const stage = activity.stages[session.index];
  $('#overlayStars').textContent = state.stars;
  $('#gameProgress').innerHTML = activity.stages.map((_, index) => `<i class="${index <= session.index ? 'filled' : ''}"></i>`).join('');
  $('#stageTarget').innerHTML = renderTarget(activity.type, stage);
  $('#stageBoard').innerHTML = '';

  const renderer = {
    choice: renderChoiceStage,
    fraction: renderFractionStage,
    mirror: renderMirrorStage,
    pattern: renderPatternStage,
    angle: renderAngleStage,
    rhythm: renderRhythmStage,
    ramp: renderRampStage,
    mix: renderMixStage,
    order: renderOrderStage,
  }[activity.type];

  renderer(stage);
  scheduleHint();
}

function renderTarget(type, stage) {
  if (type === 'choice') return `<div class="target-bubble">${shapeHTML(stage.target.value)}</div>`;
  if (type === 'fraction') return `<div class="target-bubble">${fractionHTML(stage.target)}</div>`;
  if (type === 'mirror') return `<div class="target-bubble">${butterflySVG()}</div>`;
  if (type === 'pattern') return `<div class="pattern-strip">${stage.sequence.map((shape) => `<div class="pattern-slot">${shapeHTML(shape)}</div>`).join('')}<div class="pattern-arrow"></div><div class="pattern-slot blank"></div></div>`;
  if (type === 'angle') return angleHTML(stage.target, true);
  if (type === 'rhythm') return `<div class="target-bubble">${barsSVG()}</div>`;
  if (type === 'ramp') return `<div class="target-bubble">${rampTargetSVG(stage.target)}</div>`;
  if (type === 'mix') return `<div class="target-bubble"><span class="mix-target" style="--mix-target:${stage.target}"></span></div>`;
  if (type === 'order') return `<div class="target-bubble">${cycleTargetSVG(stage.order)}</div>`;
  return '<div class="target-bubble"></div>';
}

function renderChoiceStage(stage) {
  renderChoices(stage.options, stage.answer, (option) => shapeHTML(option));
}

function renderFractionStage(stage) {
  renderChoices(stage.options, stage.answer, fractionHTML);
}

function renderPatternStage(stage) {
  renderChoices(stage.options, stage.answer, shapeHTML);
}

function renderChoices(options, answer, renderOption) {
  const grid = document.createElement('div');
  grid.className = 'choice-grid';
  options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'answer-card';
    button.dataset.correct = String(index === answer);
    button.innerHTML = renderOption(option);
    button.addEventListener('click', () => handleChoice(button, index === answer));
    grid.appendChild(button);
  });
  $('#stageBoard').appendChild(grid);
}

function handleChoice(button, correct) {
  if (!state.session || state.session.done) return;
  resetHint();
  if (correct) {
    $$('.answer-card').forEach((card) => { card.style.pointerEvents = 'none'; });
    button.classList.add('correct');
    completeStage();
  } else {
    markWrong(button);
  }
}

function renderMirrorStage(stage) {
  const board = document.createElement('div');
  board.className = 'mirror-board';
  board.style.setProperty('--cols', stage.cols);
  const half = stage.cols / 2;
  const targets = mirrorTargets(stage);

  for (let row = 0; row < stage.rows; row += 1) {
    for (let col = 0; col < stage.cols; col += 1) {
      const key = `${row}-${col}`;
      const cell = document.createElement('button');
      cell.className = 'mirror-cell';
      if (col < half) {
        cell.disabled = true;
        if (stage.source.includes(key)) cell.classList.add('source');
      } else {
        cell.classList.add('target');
        cell.dataset.key = key;
        cell.dataset.correct = String(targets.includes(key));
        cell.addEventListener('click', () => handleMirrorCell(cell, targets));
      }
      board.appendChild(cell);
    }
  }
  $('#stageBoard').appendChild(board);
}

function mirrorTargets(stage) {
  const half = stage.cols / 2;
  return stage.source.map((key) => {
    const [row, col] = key.split('-').map(Number);
    const distance = (half - 1) - col;
    return `${row}-${half + distance}`;
  });
}

function handleMirrorCell(cell, targets) {
  if (!state.session || state.session.done) return;
  resetHint();
  if (cell.dataset.correct === 'true') {
    cell.classList.add('good');
    state.session.selected.add(cell.dataset.key);
    playTap();
    if (targets.every((key) => state.session.selected.has(key))) completeStage();
  } else {
    markWrong(cell);
  }
}

function renderAngleStage(stage) {
  const board = $('#stageBoard');
  const preview = document.createElement('div');
  preview.className = 'angle-preview';
  preview.innerHTML = angleHTML(stage.target, false, true);
  board.appendChild(preview);

  const pad = document.createElement('div');
  pad.className = 'angle-pad';
  pad.style.setProperty('--target', stage.target);
  pad.innerHTML = '<div class="angle-arc"></div><div class="base"></div><div class="ray"></div><div class="angle-center"></div><button class="angle-knob" aria-label="turn"></button>';
  board.appendChild(pad);
  updateAngleVisual();

  const knob = $('.angle-knob', pad);
  const move = (event) => {
    if (!state.session) return;
    const rect = pad.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = (rect.top + rect.height / 2) - event.clientY;
    const degrees = Math.max(5, Math.min(175, Math.atan2(y, x) * 180 / Math.PI));
    state.session.angle = degrees;
    updateAngleVisual();
    resetHint();
    if (Math.abs(degrees - stage.target) <= 7 && !state.session.done) completeStage();
  };
  const release = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', release);
  };
  knob.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    playTap();
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', release);
    move(event);
  });
  pad.addEventListener('pointerdown', (event) => { playTap(); move(event); });
}

function updateAngleVisual() {
  const pad = $('.angle-pad');
  if (!pad || !state.session) return;
  pad.style.setProperty('--angle', state.session.angle);
  const knob = $('.angle-knob', pad);
  const radius = 104;
  const radians = state.session.angle * Math.PI / 180;
  knob.style.left = `calc(50% - 18px + ${Math.cos(radians) * radius}px)`;
  knob.style.top = `calc(50% - 18px - ${Math.sin(radians) * radius}px)`;
}

function renderRhythmStage(stage) {
  const xylophone = document.createElement('div');
  xylophone.className = 'xylophone';
  for (let note = 0; note < 4; note += 1) {
    const bar = document.createElement('button');
    bar.className = 'xylophone-bar';
    bar.dataset.note = String(note);
    bar.addEventListener('click', () => handleRhythmTap(note, bar, stage));
    xylophone.appendChild(bar);
  }
  $('#stageBoard').appendChild(xylophone);
  state.session.input = [];
  addTimer(setTimeout(() => playSequence(stage.sequence), 200));
}

function handleRhythmTap(note, bar, stage) {
  if (!state.session || state.session.locked || state.session.done) return;
  resetHint();
  flashBar(bar);
  playNote(note);
  state.session.input.push(note);
  const expected = stage.sequence[state.session.input.length - 1];
  if (expected !== note) {
    markWrong(bar);
    state.session.input = [];
    state.session.locked = true;
    addTimer(setTimeout(() => {
      if (!state.session) return;
      state.session.locked = false;
      playSequence(stage.sequence);
    }, 800));
    return;
  }
  if (state.session.input.length === stage.sequence.length) completeStage();
}

function playSequence(sequence) {
  if (!state.session) return;
  state.session.locked = true;
  const bars = $$('.xylophone-bar');
  sequence.forEach((note, index) => {
    addTimer(setTimeout(() => {
      if (!state.session || !bars[note]) return;
      flashBar(bars[note]);
      playNote(note, .14);
      if (index === sequence.length - 1) {
        addTimer(setTimeout(() => { if (state.session) state.session.locked = false; }, 150));
      }
    }, index * 350));
  });
}

function flashBar(bar) {
  bar.classList.add('flash');
  setTimeout(() => bar.classList.remove('flash'), 180);
}

function renderRampStage(stage) {
  const board = $('#stageBoard');
  board.innerHTML = `
    <div class="ramp-lab" style="--ramp:${-state.session.ramp}deg">
      <div class="ramp-target" style="--target-ramp:${-stage.target}deg"></div>
      <div class="ramp-line"></div>
      <div class="ramp-ball"></div>
      <button class="ramp-knob" aria-label="move ramp"></button>
      <div class="ramp-ground"></div>
    </div>`;
  updateRampVisual();
  const lab = $('.ramp-lab', board);
  const knob = $('.ramp-knob', board);
  const move = (event) => {
    if (!state.session) return;
    const rect = lab.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const ratio = x / rect.width;
    state.session.ramp = 5 + ratio * 75;
    updateRampVisual();
    resetHint();
    if (Math.abs(state.session.ramp - stage.target) <= 5 && !state.session.done) completeStage();
  };
  const release = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', release);
  };
  knob.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', release);
    move(event);
  });
  lab.addEventListener('pointerdown', move);
}

function updateRampVisual() {
  const lab = $('.ramp-lab');
  if (!lab || !state.session) return;
  lab.style.setProperty('--ramp', `${-state.session.ramp}deg`);
  const knob = $('.ramp-knob', lab);
  const left = 18 + (state.session.ramp - 5) / 75 * 64;
  knob.style.left = `${left}%`;
}

function renderMixStage(stage) {
  const board = $('#stageBoard');
  board.innerHTML = `
    <div class="mix-lab">
      <div class="mix-options">
        ${stage.ingredients.map((color, index) => `<button class="drop" data-index="${index}" style="--drop:${color}" aria-label="color"></button>`).join('')}
      </div>
      <div class="mix-arrow"></div>
      <div class="mix-well" id="mixWell"></div>
    </div>`;
  state.session.selected = new Set();
  $$('.drop', board).forEach((drop) => drop.addEventListener('click', () => handleDrop(drop, stage)));
}

function handleDrop(drop, stage) {
  if (!state.session || state.session.done) return;
  resetHint();
  const index = Number(drop.dataset.index);
  state.session.selected.add(index);
  drop.classList.add('selected');
  playTap();
  const selected = [...state.session.selected].sort();
  if (selected.length === stage.answer.length) {
    const correct = stage.answer.every((value, i) => selected[i] === value);
    const well = $('#mixWell');
    if (correct) {
      well.style.background = stage.target;
      well.classList.add('mixed');
      completeStage();
    } else {
      markWrong(well);
      state.session.selected.clear();
      $$('.drop', board).forEach((item) => item.classList.remove('selected'));
    }
  }
}

function renderOrderStage(stage) {
  const board = $('#stageBoard');
  const items = [...stage.order].sort(() => Math.random() - .5);
  board.innerHTML = `
    <div class="order-lab">
      <div class="order-slots">${stage.order.map((_, index) => `<div class="order-slot" data-slot="${index}"></div>`).join('')}</div>
      <div class="order-items">${items.map((item) => `<button class="order-item" data-item="${item}" aria-label="move item">${natureIcon(item)}</button>`).join('')}</div>
    </div>`;
  state.session.dragOrder = Array(stage.order.length).fill(null);
  $$('.order-item', board).forEach(enableDragItem);
}

function enableDragItem(item) {
  item.addEventListener('pointerdown', (event) => {
    if (!state.session || state.session.done) return;
    event.preventDefault();
    resetHint();
    const startRect = item.getBoundingClientRect();
    const ghost = item.cloneNode(true);
    ghost.classList.add('drag-ghost');
    ghost.style.width = `${startRect.width}px`;
    ghost.style.height = `${startRect.height}px`;
    document.body.appendChild(ghost);
    const move = (moveEvent) => {
      ghost.style.left = `${moveEvent.clientX - startRect.width / 2}px`;
      ghost.style.top = `${moveEvent.clientY - startRect.height / 2}px`;
    };
    const release = (upEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', release);
      const slot = document.elementFromPoint(upEvent.clientX, upEvent.clientY)?.closest('.order-slot');
      ghost.remove();
      if (!slot) return;
      placeOrderItem(item, slot);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', release);
    move(event);
  });
}

function placeOrderItem(item, slot) {
  const session = state.session;
  const stage = ACTIVITIES[session.id].stages[session.index];
  const slotIndex = Number(slot.dataset.slot);
  const itemName = item.dataset.item;
  const previousOccupant = session.dragOrder[slotIndex];
  if (previousOccupant && previousOccupant !== itemName) {
    const previousItem = $(`.order-item[data-item="${previousOccupant}"]`);
    if (previousItem) previousItem.classList.remove('placed');
  }
  const previousIndex = session.dragOrder.indexOf(itemName);
  if (previousIndex >= 0) {
    const previousSlot = $(`.order-slot[data-slot="${previousIndex}"]`);
    if (previousSlot) previousSlot.innerHTML = '';
    session.dragOrder[previousIndex] = null;
  }
  session.dragOrder[slotIndex] = itemName;
  slot.innerHTML = natureIcon(itemName);
  item.classList.add('placed');
  playTap();

  if (session.dragOrder.every(Boolean)) {
    const correct = stage.order.every((name, index) => session.dragOrder[index] === name);
    if (correct) completeStage();
    else {
      $$('.order-slot').forEach((orderSlot) => orderSlot.classList.add('bad'));
      playFail();
      addTimer(setTimeout(() => {
        if (!state.session) return;
        session.dragOrder = Array(stage.order.length).fill(null);
        $$('.order-slot').forEach((orderSlot) => { orderSlot.innerHTML = ''; orderSlot.classList.remove('bad'); });
        $$('.order-item').forEach((orderItem) => orderItem.classList.remove('placed'));
      }, 650));
    }
  }
}

function completeStage() {
  if (!state.session || state.session.done) return;
  state.session.done = true;
  playSuccess();
  const { id, index } = state.session;
  const previous = state.progress[id] || 0;
  const total = ACTIVITIES[id].stages.length;

  if (index === previous && previous < total) {
    state.progress[id] = previous + 1;
    state.stars += 1;
    renderApp();
  }

  burst(true);
  const isLast = index === total - 1;
  addTimer(setTimeout(() => {
    if (!state.session) return;
    if (isLast) {
      closeActivity();
      return;
    }
    state.session.index += 1;
    state.session.done = false;
    state.session.selected = new Set();
    state.session.input = [];
    state.session.locked = false;
    const activity = ACTIVITIES[id];
    const nextStage = activity.stages[state.session.index];
    if (activity.type === 'angle') state.session.angle = nextStage.start;
    if (activity.type === 'ramp') state.session.ramp = nextStage.start;
    renderStage();
  }, isLast ? 900 : 760));
}

function markWrong(node) {
  node.classList.add('wrong', 'bad');
  playFail();
  setTimeout(() => node.classList.remove('wrong', 'bad'), 280);
}

function addTimer(timer) {
  if (state.session) state.session.timers.push(timer);
}

function resetHint() {
  if (!state.session) return;
  clearTimeout(state.session.hintTimer);
  scheduleHint();
}

function scheduleHint() {
  if (!state.session) return;
  clearTimeout(state.session.hintTimer);
  state.session.hintTimer = setTimeout(showHint, 3600);
}

function showHint() {
  if (!state.session || state.session.done) return;
  const activity = ACTIVITIES[state.session.id];
  const stage = activity.stages[state.session.index];

  if (['choice', 'fraction', 'pattern'].includes(activity.type)) {
    const correct = $('.answer-card[data-correct="true"]');
    if (correct) {
      correct.classList.add('hint');
      setTimeout(() => correct.classList.remove('hint'), 760);
    }
  }
  if (activity.type === 'mirror') {
    mirrorTargets(stage).forEach((key) => {
      const cell = $(`.mirror-cell[data-key="${key}"]`);
      if (cell && !cell.classList.contains('good')) {
        cell.classList.add('hint');
        setTimeout(() => cell.classList.remove('hint'), 760);
      }
    });
  }
  if (['angle', 'ramp', 'order'].includes(activity.type)) {
    const board = $('#stageBoard');
    if (!$('.idle-hand', board)) {
      const hand = document.createElement('div');
      hand.className = 'idle-hand';
      hand.textContent = '☝︎';
      board.appendChild(hand);
      setTimeout(() => hand.remove(), 1100);
    }
  }
  if (activity.type === 'rhythm') playSequence(stage.sequence);
  if (activity.type === 'mix') {
    stage.answer.forEach((index) => {
      const drop = $(`.drop[data-index="${index}"]`);
      if (drop) {
        drop.classList.add('hint');
        setTimeout(() => drop.classList.remove('hint'), 760);
      }
    });
  }
}

function shapeHTML(name) {
  return `<div class="shape-box"><span class="shape ${name}"></span></div>`;
}

function fractionHTML(model) {
  const filled = new Set(model.fill || []);
  const cells = Array.from({ length: model.parts }, (_, index) => `<span class="${filled.has(index) ? 'filled' : ''}"></span>`).join('');
  return `<div class="fraction-grid cols-${model.parts}">${cells}</div>`;
}

function butterflySVG() {
  return `<svg viewBox="0 0 180 90" width="170" height="86" aria-hidden="true"><path d="M92 44 C126 6,170 14,155 48 C148 66,121 72,92 58" fill="#ec7ca7" opacity=".86"/><path d="M88 44 C54 6,10 14,25 48 C32 66,59 72,88 58" fill="#7fd3b4" opacity=".9"/><line x1="90" y1="8" x2="90" y2="82" stroke="#fff" stroke-width="6" stroke-linecap="round"/><line x1="90" y1="8" x2="82" y2="0" stroke="#65718a" stroke-width="4" stroke-linecap="round"/><line x1="90" y1="8" x2="98" y2="0" stroke="#65718a" stroke-width="4" stroke-linecap="round"/></svg>`;
}

function barsSVG() {
  return `<svg viewBox="0 0 140 70" width="136" height="70" aria-hidden="true"><rect x="10" y="22" rx="10" width="22" height="36" fill="#ef7aa7"/><rect x="42" y="10" rx="10" width="22" height="48" fill="#ffbf62"/><rect x="74" y="18" rx="10" width="22" height="40" fill="#7fd3b4"/><rect x="106" y="2" rx="10" width="22" height="56" fill="#7d6cea"/></svg>`;
}

function angleHTML(target, large = false, compact = false) {
  const style = `--target:${target};${compact ? 'width:68px;' : ''}`;
  return `<div class="angle-target" style="${style}"><div class="angle-arc"></div><div class="base"></div><div class="ghost"></div><div class="angle-center"></div></div>`;
}

function rampTargetSVG(target) {
  const y = 62 - target * .5;
  return `<svg viewBox="0 0 180 90" width="180" height="90" aria-hidden="true"><line x1="18" y1="72" x2="162" y2="72" stroke="#71809b" stroke-width="7" stroke-linecap="round"/><line x1="28" y1="68" x2="128" y2="${Math.max(16, y)}" stroke="#7d6cea" stroke-width="9" stroke-linecap="round"/><circle cx="118" cy="${Math.max(13, y - 7)}" r="12" fill="#ffb84d"/></svg>`;
}

function cycleTargetSVG(order) {
  return `<div class="cycle-target">${order.map(natureIcon).join('<span class="cycle-dot"></span>')}</div>`;
}

function natureIcon(name) {
  const icons = {
    seed: '<svg viewBox="0 0 70 70"><ellipse cx="35" cy="40" rx="15" ry="22" fill="#9c6a46" transform="rotate(28 35 40)"/><path d="M34 26c8-8 13-13 20-12" fill="none" stroke="#5bbf9c" stroke-width="5" stroke-linecap="round"/></svg>',
    sprout: '<svg viewBox="0 0 70 70"><path d="M35 58V29" stroke="#55ad7e" stroke-width="6" stroke-linecap="round"/><path d="M35 34C20 31 18 19 21 15c11 0 18 6 14 19Z" fill="#7ed2b4"/><path d="M36 41c14-2 19-11 19-17-11-2-19 5-19 17Z" fill="#9be0c1"/></svg>',
    plant: '<svg viewBox="0 0 70 70"><path d="M35 60V19" stroke="#4aa577" stroke-width="6" stroke-linecap="round"/><ellipse cx="22" cy="31" rx="13" ry="8" fill="#79cfae" transform="rotate(25 22 31)"/><ellipse cx="49" cy="39" rx="13" ry="8" fill="#8cdbb9" transform="rotate(-25 49 39)"/></svg>',
    flower: '<svg viewBox="0 0 70 70"><path d="M35 61V31" stroke="#4aa577" stroke-width="6"/><circle cx="35" cy="24" r="9" fill="#ffcf57"/><circle cx="25" cy="21" r="10" fill="#ef7aa7"/><circle cx="45" cy="21" r="10" fill="#8c7cf0"/><circle cx="35" cy="13" r="10" fill="#7fd3b4"/></svg>',
    egg: '<svg viewBox="0 0 70 70"><ellipse cx="35" cy="38" rx="21" ry="27" fill="#fff3d9" stroke="#ddb976" stroke-width="4"/></svg>',
    caterpillar: '<svg viewBox="0 0 70 70"><circle cx="18" cy="40" r="10" fill="#7ed2b4"/><circle cx="32" cy="36" r="10" fill="#67c69d"/><circle cx="46" cy="39" r="10" fill="#55b98d"/><circle cx="57" cy="32" r="9" fill="#8adbb7"/></svg>',
    cocoon: '<svg viewBox="0 0 70 70"><path d="M35 11v13" stroke="#7b8396" stroke-width="4"/><ellipse cx="35" cy="40" rx="15" ry="24" fill="#d6b38a" stroke="#b88e63" stroke-width="4"/></svg>',
    butterfly: butterflySVG(),
    cloud: '<svg viewBox="0 0 70 70"><path d="M19 48h35c8 0 11-11 3-15-1-11-18-15-24-5-9-7-23 3-18 13-5 4-1 7 4 7Z" fill="#cbd7ec"/></svg>',
    rain: '<svg viewBox="0 0 70 70"><path d="M19 37h35c8 0 11-11 3-15-1-11-18-15-24-5-9-7-23 3-18 13-5 4-1 7 4 7Z" fill="#b8c8e6"/><path d="M24 45l-4 10M38 45l-4 10M52 45l-4 10" stroke="#5d9df5" stroke-width="5" stroke-linecap="round"/></svg>',
    puddle: '<svg viewBox="0 0 70 70"><ellipse cx="35" cy="43" rx="27" ry="13" fill="#7eb9f7"/><ellipse cx="29" cy="39" rx="10" ry="4" fill="#cfe6ff"/></svg>',
    sun: '<svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="18" fill="#ffbf58"/><circle cx="35" cy="35" r="27" fill="none" stroke="#ffd783" stroke-width="5" stroke-dasharray="5 8"/></svg>',
  };
  return `<div class="nature-icon">${icons[name] || ''}</div>`;
}

function burst(big = false) {
  const layer = $('#celebrationLayer');
  const colors = ['#6755e7', '#5bbf9c', '#ffb84d', '#eb6c9d', '#5d9df5'];
  const count = big ? 28 : 12;
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement('i');
    piece.className = 'spark';
    const angle = (Math.PI * 2 * i / count) + Math.random() * .24;
    const radius = (big ? 170 : 100) + Math.random() * 70;
    piece.style.setProperty('--x', `${Math.cos(angle) * radius}px`);
    piece.style.setProperty('--y', `${Math.sin(angle) * radius}px`);
    piece.style.setProperty('--rotate', `${Math.random() * 260}deg`);
    piece.style.setProperty('--color', colors[i % colors.length]);
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 850);
  }
}

function getAudioContext(force = false) {
  if (state.muted || (!audioUnlocked && !force)) return null;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  if (!audioContext) audioContext = new AudioCtor();
  if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  return audioContext;
}

function tone(frequency, duration = .12, type = 'sine', gainValue = .03) {
  const context = getAudioContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = gainValue;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + duration);
  oscillator.stop(context.currentTime + duration);
}

function playTap() { tone(420, .08, 'sine', .022); }
function playNote(note, duration = .18) { tone([330, 392, 494, 587][note] || 440, duration, 'triangle', .026); }
function playFail() { tone(220, .12, 'square', .018); }
function playSuccess() {
  playNote(0, .12);
  setTimeout(() => playNote(2, .14), 90);
  setTimeout(() => playNote(3, .16), 180);
}

document.addEventListener('pointerdown', () => {
  audioUnlocked = true;
  getAudioContext(true);
}, { once: true, passive: true });

$$('.world-tab').forEach((tab) => tab.addEventListener('click', () => { state.world = tab.dataset.world; renderApp(); }));
$('#homeButton').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
$('#soundButton').addEventListener('click', () => { state.muted = !state.muted; renderApp(); });
$('#closeGame').addEventListener('click', closeActivity);
overlay.addEventListener('click', (event) => { if (event.target === overlay) closeActivity(); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && state.session) closeActivity(); });

validateCatalog();
renderApp();
