function frame(now) {
    const dt = Math.min(.034, Math.max(0, (now - state.lastTime) / 1000 || 0));
    state.lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(frame);
  }

  canvas.addEventListener('pointerdown', (event) => {
    state.touchStartX = event.clientX;
    ensureAudio();
  }, { passive: true });

  canvas.addEventListener('pointermove', (event) => {
    if (state.touchStartX == null || state.mode !== 'playing' || state.paused) return;
    const delta = event.clientX - state.touchStartX;
    if (Math.abs(delta) >= 32) {
      moveLane(delta > 0 ? 1 : -1);
      state.touchStartX = event.clientX;
    }
  }, { passive: true });

  const clearPointer = () => { state.touchStartX = null; };
  canvas.addEventListener('pointerup', clearPointer, { passive: true });
  canvas.addEventListener('pointercancel', clearPointer, { passive: true });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (event.key === 'ArrowLeft' || key === 'a') {
      event.preventDefault(); moveLane(-1);
    } else if (event.key === 'ArrowRight' || key === 'd') {
      event.preventDefault(); moveLane(1);
    } else if (event.key === 'Escape' || key === 'p') {
      event.preventDefault(); togglePause();
    } else if (event.key === 'Enter' && state.mode === 'gameover') {
      resetGame();
    }
  });

  $('startButton').addEventListener('click', resetGame);
  $('restartButton').addEventListener('click', resetGame);
  $('restartPauseButton').addEventListener('click', resetGame);
  $('resumeButton').addEventListener('click', () => togglePause(false));
  $('pauseButton').addEventListener('click', () => togglePause());
  $('menuButton').addEventListener('click', goMenu);
  $('menuPauseButton').addEventListener('click', goMenu);

  $('shopButton').addEventListener('click', () => {
    updateMenu();
    ui.startOverlay.classList.add('hidden');
    ui.shopOverlay.classList.remove('hidden');
  });
  $('closeShopButton').addEventListener('click', () => {
    ui.shopOverlay.classList.add('hidden');
    ui.startOverlay.classList.remove('hidden');
  });
  $('achievementsButton').addEventListener('click', () => {
    renderAchievements();
    ui.startOverlay.classList.add('hidden');
    ui.achievementsOverlay.classList.remove('hidden');
  });
  $('closeAchievementsButton').addEventListener('click', () => {
    ui.achievementsOverlay.classList.add('hidden');
    ui.startOverlay.classList.remove('hidden');
  });

  ui.soundButton.addEventListener('click', () => {
    state.audioEnabled = !state.audioEnabled;
    save.audioEnabled = state.audioEnabled;
    persist();
    ui.soundButton.textContent = state.audioEnabled ? '🔊' : '🔇';
    if (state.audioEnabled) { ensureAudio(); sounds.power(); }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.mode === 'playing' && !state.paused) togglePause(true);
  });

  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 120));

  resize();
  updateMenu();
  render();
  requestAnimationFrame((time) => {
    state.lastTime = time;
    requestAnimationFrame(frame);
  });
