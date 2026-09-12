/* Castle UI glue. Learning/game state remains owned by app.js/programming.js. */
(() => {
  const summary = document.getElementById('topicSummary');
  const kicker = document.getElementById('summaryKicker');
  const title = document.getElementById('summaryTitle');
  const text = document.getElementById('summaryText');
  const start = document.getElementById('continueButton');
  if (!summary || !kicker || !title || !text || !start) return;

  const topics = {
    math: {
      label: 'Geometry',
      title: 'Shapes build a brighter world',
      text: 'Touch, match, mirror and turn shapes. Each lesson becomes a small visual puzzle.',
      action: 'Start Geometry',
    },
    music: {
      label: 'Music',
      title: 'Hear it. See it. Build the rhythm.',
      text: 'Follow visual beats and remember short melodies with almost no reading required.',
      action: 'Start Music',
    },
    chemistry: {
      label: 'Chemistry',
      title: 'Mix colors and discover reactions',
      text: 'Experiment with simple combinations and learn through immediate visual feedback.',
      action: 'Start Chemistry',
    },
    physics: {
      label: 'Physics',
      title: 'Move, roll and test what happens',
      text: 'Explore ramps, angles and motion through small hands-on challenges.',
      action: 'Start Physics',
    },
    nature: {
      label: 'Nature',
      title: 'Watch little worlds grow',
      text: 'Put natural cycles in order and discover how living things change over time.',
      action: 'Start Nature',
    },
    programming: {
      label: 'Coding',
      title: 'Guide the robot through the castle',
      text: 'Build sequences, repeats and simple logic using visual command blocks.',
      action: 'Start Coding',
    },
  };

  function currentTopic() {
    return topics[state.world] || topics.math;
  }

  function updateSummary() {
    const topic = currentTopic();
    summary.dataset.world = state.world;
    document.documentElement.dataset.skolaWorld = state.world;
    kicker.textContent = topic.label;
    title.textContent = topic.title;
    text.textContent = topic.text;
    start.textContent = topic.action;

    document.querySelectorAll('.topic-tile').forEach((node) => {
      const active = node.dataset.world === state.world;
      node.classList.toggle('active', active);
      if (active) node.setAttribute('aria-current', 'page');
      else node.removeAttribute('aria-current');
    });
  }

  function firstNextActivity() {
    const ids = WORLDS[state.world] || [];
    return ids.find((id) => (state.progress[id] || 0) < ACTIVITY_MILESTONES) || ids[0];
  }

  start.addEventListener('click', () => {
    const id = firstNextActivity();
    if (id) openActivity(id);
  });

  document.querySelectorAll('.topic-tile').forEach((node) => {
    node.addEventListener('click', () => requestAnimationFrame(updateSummary));
  });

  updateSummary();
})();
