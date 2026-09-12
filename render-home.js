(() => {
  const root = document.getElementById('renderHome');
  const art = document.getElementById('renderArt');
  if (!root || !art) return;

  const activateRender = async () => {
    try {
      const parts = [];
      for (let index = 0; index < 10; index += 1) {
        const response = await fetch(`assets/render-v2-${index}.txt`, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`render chunk ${index}: ${response.status}`);
        parts.push((await response.text()).replace(/\s/g, ''));
      }

      const payload = parts.join('');
      if (!payload.startsWith('/9j/') || payload.length % 4 !== 0) {
        throw new Error('render payload is invalid');
      }

      art.src = `data:image/jpeg;base64,${payload}`;
      if (art.decode) await art.decode();
      art.classList.add('ready');
      document.body.classList.add('render-home-active');
    } catch (error) {
      console.error('Skola render failed to load', error);
      root.setAttribute('hidden', '');
      document.body.classList.remove('render-home-active');
    }
  };

  activateRender();

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