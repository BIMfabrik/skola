(() => {
  const root = document.getElementById('renderHome');
  const art = document.getElementById('renderArt');
  if (!root || !art) return;
  document.body.classList.add('render-home-active');

  const loadRender = async () => {
    try {
      const parts = await Promise.all([0,1,2,3,4].map(async (index) => {
        const response = await fetch(`assets/render-home-b64-${index}.txt`, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`render chunk ${index}: ${response.status}`);
        return (await response.text()).replace(/\s/g, '');
      }));
      art.src = `data:image/jpeg;base64,${parts.join('')}`;
      art.addEventListener('load', () => art.classList.add('ready'), { once: true });
      if (art.complete) art.classList.add('ready');
    } catch (error) {
      console.error('Skola render failed to load', error);
      const message = document.createElement('div');
      message.className = 'render-load-error';
      message.textContent = 'Skola';
      root.querySelector('.render-canvas')?.appendChild(message);
    }
  };
  loadRender();

  const firstActivity = (world) => {
    const ids = WORLDS[world] || [];
    return ids.find((id) => (state.progress[id] || 0) < ACTIVITY_MILESTONES) || ids[0];
  };

  root.querySelectorAll('[data-world]').forEach((button) => {
    button.addEventListener('click', () => {
      const world = button.dataset.world;
      state.world = world;
      renderApp();
      playTap();
      const id = firstActivity(world);
      if (id) openActivity(id);
    });
  });

  root.querySelectorAll('[data-activity]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.activity;
      const activity = ACTIVITIES[id];
      if (!activity) return;
      state.world = activity.world;
      renderApp();
      playTap();
      openActivity(id);
    });
  });

  root.querySelector('[data-action="sound"]')?.addEventListener('click', () => {
    state.muted = !state.muted;
    renderApp();
  });
})();