'use strict';

  const $ = (id) => document.getElementById(id);
  const canvas = $('game');
  const ctx = canvas.getContext('2d', { alpha: false });

  const ui = {
    hud: $('hud'), score: $('score'), coins: $('coins'), lives: $('lives'),
    soundButton: $('soundButton'), pauseButton: $('pauseButton'),
    missionText: $('missionText'), missionProgress: $('missionProgress'), missionFill: $('missionFill'),
    comboBadge: $('comboBadge'), controlsHint: $('controlsHint'), toastStack: $('toastStack'),
    startOverlay: $('startOverlay'), pauseOverlay: $('pauseOverlay'), gameOverOverlay: $('gameOverOverlay'),
    shopOverlay: $('shopOverlay'), achievementsOverlay: $('achievementsOverlay'),
    bestScoreStart: $('bestScoreStart'), totalCoinsStart: $('totalCoinsStart'), gamesStart: $('gamesStart'),
    finalScore: $('finalScore'), finalCoins: $('finalCoins'), finalCombo: $('finalCombo'), gameOverText: $('gameOverText'),
    shopCoins: $('shopCoins'), shopList: $('shopList'), achievementList: $('achievementList'),
    powerShield: $('powerShield'), powerMagnet: $('powerMagnet'), powerTurbo: $('powerTurbo'),
    powerDouble: $('powerDouble'), powerSlow: $('powerSlow'), powerGhost: $('powerGhost')
  };

  const STORAGE_KEY = 'colectivo_escape_v2';
  const LEGACY_KEYS = ['colectivo_escape_live_v1', 'colectivo_escape_v1'];

  const zones = [
    { name: 'Centro', skyA: '#08172d', skyB: '#040a14', road: '#17212e', accent: '#2f8cff', side: '#101b29' },
    { name: 'Túnel', skyA: '#25170b', skyB: '#070707', road: '#202020', accent: '#ffad45', side: '#302418' },
    { name: 'Puente', skyA: '#071426', skyB: '#03101d', road: '#18222f', accent: '#69d7ff', side: '#091827' },
    { name: 'Tormenta', skyA: '#101522', skyB: '#03070d', road: '#121923', accent: '#b37aff', side: '#0c121c' }
  ];

  const obstacleKinds = {
    car: { w: 47, h: 78, speed: 1.0, color: '#ef5565', score: 28 },
    taxi: { w: 49, h: 80, speed: 1.04, color: '#f6c548', score: 30 },
    bus: { w: 61, h: 112, speed: .82, color: '#f29138', score: 40 },
    truck: { w: 65, h: 118, speed: .76, color: '#5d7c9c', score: 45 },
    moto: { w: 28, h: 62, speed: 1.24, color: '#dd6fff', score: 36 },
    pothole: { w: 62, h: 31, speed: 1.12, color: '#171b21', score: 24 },
    cone: { w: 30, h: 40, speed: 1.13, color: '#ff773c', score: 22 }
  };

  const pickupKinds = [
    { id: 'shield', icon: 'S', label: 'Escudo', color: '#65e9ff' },
    { id: 'magnet', icon: 'M', label: 'Imán', color: '#d58cff' },
    { id: 'turbo', icon: 'T', label: 'Turbo', color: '#ff8c4d' },
    { id: 'repair', icon: '+', label: 'Reparación', color: '#70ef9c' },
    { id: 'double', icon: '2×', label: 'Doble puntaje', color: '#ffd764' },
    { id: 'slow', icon: '◷', label: 'Tiempo lento', color: '#7aa7ff' },
    { id: 'bomb', icon: 'B', label: 'Bomba', color: '#ff5f72' },
    { id: 'ghost', icon: 'G', label: 'Fantasma', color: '#d9e7ff' }
  ];

  const achievements = [
    { id: 'firstRun', icon: '🚦', title: 'Primera salida', text: 'Jugá tu primera partida.' },
    { id: 'coinHunter', icon: '🪙', title: 'Monedero pesado', text: 'Acumulá 100 monedas.' },
    { id: 'survivor', icon: '⏱️', title: 'No me bajo', text: 'Sobreviví 60 segundos.' },
    { id: 'comboMaster', icon: '🔥', title: 'En racha', text: 'Alcanzá un combo de 25.' },
    { id: 'bossDodger', icon: '🚌', title: 'Eso fue cerca', text: 'Superá un mini jefe sin recibir daño.' },
    { id: 'powerTour', icon: '✨', title: 'Caja de herramientas', text: 'Usá los ocho poderes distintos.' }
  ];

  const shopDefinitions = [
    {
      id: 'armor', icon: '❤️', title: 'Chasis reforzado', max: 2,
      costs: [80, 180], description: (level) => level ? `+${level} vida${level === 1 ? '' : 's'} al comenzar.` : 'Sumá una vida inicial permanente.'
    },
    {
      id: 'coin', icon: '🪙', title: 'Monedas premium', max: 3,
      costs: [100, 220, 400], description: (level) => `+${level * 25}% de puntos por moneda.`
    },
    {
      id: 'shield', icon: '🛡️', title: 'Salida protegida', max: 1,
      costs: [150], description: (level) => level ? 'Comenzás cada partida con escudo.' : 'Comenzá con un escudo.'
    }
  ];

  const defaultSave = () => ({
    version: 2,
    best: 0,
    totalCoins: 0,
    games: 0,
    audioEnabled: true,
    upgrades: { armor: 0, coin: 0, shield: 0 },
    achievements: Object.fromEntries(achievements.map((a) => [a.id, false]))
  });

  function finite(value, fallback = 0) {
    return Number.isFinite(value) ? value : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function loadSave() {
    const base = defaultSave();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        base.best = Math.max(0, finite(parsed.best));
        base.totalCoins = Math.max(0, finite(parsed.totalCoins));
        base.games = Math.max(0, finite(parsed.games));
        base.audioEnabled = parsed.audioEnabled !== false;
        for (const def of shopDefinitions) {
          base.upgrades[def.id] = clamp(Math.floor(finite(parsed.upgrades?.[def.id])), 0, def.max);
        }
        for (const item of achievements) {
          base.achievements[item.id] = parsed.achievements?.[item.id] === true;
        }
        return base;
      }

      for (const legacyKey of LEGACY_KEYS) {
        const legacyRaw = localStorage.getItem(legacyKey);
        if (!legacyRaw) continue;
        const legacy = JSON.parse(legacyRaw);
        base.best = Math.max(base.best, finite(legacy.best));
        base.totalCoins = Math.max(base.totalCoins, finite(legacy.totalCoins ?? legacy.total));
        base.games = Math.max(base.games, finite(legacy.games));
        base.audioEnabled = legacy.audioEnabled !== false && legacy.sound !== false;
        break;
      }
    } catch (_) {}
    return base;
  }

  const save = loadSave();

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(save)); } catch (_) {}
  }

  const state = {
    mode: 'menu', paused: false,
    width: 0, height: 0, dpr: 1,
    lastTime: 0, elapsed: 0, score: 0, runCoins: 0,
    lives: 3, maxLives: 3,
    speed: 330, roadOffset: 0,
    lane: 1, targetLane: 1,
    invulnerable: 0, flash: 0, shake: 0,
    spawnTimer: 0, pickupTimer: 0, powerTimer: 0,
    obstacles: [], pickups: [], particles: [], popups: [], scenery: [], rain: [],
    combo: 0, comboTimer: 0, maxCombo: 0, passes: 0, hits: 0,
    effects: { shield: 0, magnet: 0, turbo: 0, double: 0, slow: 0, ghost: 0 },
    usedPowers: new Set(),
    zoneIndex: 0, zoneTimer: 0,
    event: null, eventTimer: 0, nextEvent: 20,
    boss: null, nextBoss: 42, bossHit: false,
    mission: null,
    audioEnabled: save.audioEnabled,
    touchStartX: null,
    hintTimer: 0,
    nearMissPulse: 0,
    eventBanner: 0,
    eventTitle: '',
    eventSubtitle: ''
  };

  let audioCtx = null;

  function ensureAudio() {
    if (!state.audioEnabled) return;
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx?.state === 'suspended') audioCtx.resume().catch(() => {});
  }

  function tone(freq, duration, type = 'sine', volume = .035, slide = 0, delay = 0) {
    if (!state.audioEnabled) return;
    ensureAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime + delay;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slide) osc.frequency.linearRampToValueAtTime(Math.max(40, freq + slide), now + duration);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration + .03);
  }

  const sounds = {
    lane() { tone(260, .04, 'triangle', .022, 80); },
    coin() { tone(720, .06, 'sine', .035, 180); },
    hit() { tone(155, .18, 'sawtooth', .055, -90); },
    power() { tone(420, .12, 'triangle', .045, 320); tone(720, .1, 'sine', .028, 120, .07); },
    combo() { tone(520 + Math.min(280, state.combo * 8), .05, 'square', .018, 100); },
    bomb() { tone(120, .28, 'sawtooth', .07, -60); },
    boss() { tone(95, .4, 'sawtooth', .05, 20); tone(140, .3, 'square', .025, -20, .18); },
    winMission() { tone(520, .08, 'sine', .03, 120); tone(690, .1, 'sine', .03, 120, .09); },
    gameOver() { tone(210, .18, 'sawtooth', .05, -100); tone(130, .28, 'triangle', .045, -50, .12); }
  };

  function vibrate(pattern) {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  }

  function toast(message) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    ui.toastStack.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  function unlock(id) {
    if (save.achievements[id]) return;
    save.achievements[id] = true;
    persist();
    const item = achievements.find((a) => a.id === id);
    if (item) toast(`🏆 Logro: ${item.title}`);
  }

  function randomMission() {
    const missions = [
      { type: 'dodge', label: 'Esquivá 15 obstáculos', target: 15, reward: 8 },
      { type: 'coins', label: 'Juntá 12 monedas', target: 12, reward: 10 },
      { type: 'survive', label: 'Sobreviví 35 segundos', target: 35, reward: 12 }
    ];
    const selected = missions[Math.floor(Math.random() * missions.length)];
    return { ...selected, progress: 0, complete: false };
  }

  function updateMission(type, amount = 1) {
    const mission = state.mission;
    if (!mission || mission.complete || mission.type !== type) return;
    mission.progress = Math.min(mission.target, mission.progress + amount);
    if (mission.progress >= mission.target) {
      mission.complete = true;
      state.runCoins += mission.reward;
      state.score += mission.reward * 120;
      toast(`✅ Misión completa: +${mission.reward} monedas`);
      sounds.winMission();
      vibrate([18, 20, 18]);
    }
    updateMissionUI();
  }

  function updateMissionUI() {
    const m = state.mission;
    if (!m) return;
    ui.missionText.textContent = m.complete ? `✅ ${m.label}` : m.label;
    ui.missionProgress.textContent = `${Math.floor(m.progress)}/${m.target}`;
    ui.missionFill.style.width = `${(m.progress / m.target) * 100}%`;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = Math.max(1, rect.width);
    state.height = Math.max(1, rect.height);
    canvas.width = Math.round(state.width * state.dpr);
    canvas.height = Math.round(state.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    buildScenery();
  }

  function buildScenery() {
    state.scenery = [];
    const road = roadMetrics();
    for (let i = 0; i < 18; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const maxW = side < 0 ? Math.max(16, road.left - 18) : Math.max(16, state.width - road.right - 18);
      state.scenery.push({
        side,
        y: Math.random() * state.height,
        w: Math.max(12, maxW * (.55 + Math.random() * .45)),
        h: 45 + Math.random() * 95,
        depth: .35 + Math.random() * .65,
        lights: 1 + Math.floor(Math.random() * 4)
      });
    }
    state.rain = Array.from({ length: 50 }, () => ({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      len: 8 + Math.random() * 16,
      speed: 280 + Math.random() * 380
    }));
  }

  function roadMetrics() {
    const width = Math.min(state.width * .8, 372);
    const left = (state.width - width) / 2;
    return { left, width, right: left + width, laneWidth: width / 3 };
  }

  function laneCenter(index) {
    const road = roadMetrics();
    return road.left + road.laneWidth * (index + .5);
  }

  function playerY() { return state.height * .79; }

  function comboMultiplier() {
    return Math.min(5, 1 + Math.floor(state.combo / 5) * .5);
  }

  function updateMenu() {
    ui.bestScoreStart.textContent = Math.floor(save.best);
    ui.totalCoinsStart.textContent = Math.floor(save.totalCoins);
    ui.gamesStart.textContent = Math.floor(save.games);
    ui.soundButton.textContent = state.audioEnabled ? '🔊' : '🔇';
    ui.shopCoins.textContent = Math.floor(save.totalCoins);
    renderShop();
    renderAchievements();
  }

  function renderShop() {
    ui.shopList.innerHTML = '';
    for (const def of shopDefinitions) {
      const level = save.upgrades[def.id];
      const maxed = level >= def.max;
      const cost = maxed ? null : def.costs[level];
      const row = document.createElement('div');
      row.className = 'shop-item';
      row.innerHTML = `
        <div class="shop-icon">${def.icon}</div>
        <div class="shop-copy">
          <strong>${def.title} · Nv. ${level}/${def.max}</strong>
          <span>${def.description(level)}</span>
        </div>
        <button class="buy-btn" ${maxed || save.totalCoins < cost ? 'disabled' : ''}>
          ${maxed ? 'MÁX.' : `🪙 ${cost}`}
        </button>`;
      row.querySelector('button').addEventListener('click', () => buyUpgrade(def));
      ui.shopList.appendChild(row);
    }
  }

  function buyUpgrade(def) {
    const level = save.upgrades[def.id];
    if (level >= def.max) return;
    const cost = def.costs[level];
    if (save.totalCoins < cost) {
      toast('No alcanzan las monedas. El taller no fía.');
      return;
    }
    save.totalCoins -= cost;
    save.upgrades[def.id] += 1;
    persist();
    sounds.power();
    toast(`${def.icon} ${def.title} mejorado`);
    updateMenu();
  }

  function renderAchievements() {
    ui.achievementList.innerHTML = '';
    for (const item of achievements) {
      const unlocked = save.achievements[item.id];
      const row = document.createElement('div');
      row.className = `achievement-item${unlocked ? '' : ' locked'}`;
      row.innerHTML = `
        <div class="achievement-icon">${unlocked ? item.icon : '🔒'}</div>
        <div class="achievement-copy">
          <strong>${item.title}</strong>
          <span>${item.text}</span>
        </div>`;
      ui.achievementList.appendChild(row);
    }
  }

  function resetGame() {
    const armor = save.upgrades.armor;
    state.mode = 'playing';
    state.paused = false;
    state.lastTime = performance.now();
    state.elapsed = 0;
    state.score = 0;
    state.runCoins = 0;
    state.maxLives = 3 + armor;
    state.lives = state.maxLives;
    state.speed = 330;
    state.roadOffset = 0;
    state.lane = 1;
    state.targetLane = 1;
    state.invulnerable = 0;
    state.flash = 0;
    state.shake = 0;
    state.spawnTimer = .8;
    state.pickupTimer = .75;
    state.powerTimer = 7.5;
    state.obstacles = [];
    state.pickups = [];
    state.particles = [];
    state.popups = [];
    state.combo = 0;
    state.comboTimer = 0;
    state.maxCombo = 0;
    state.passes = 0;
    state.hits = 0;
    state.effects = { shield: save.upgrades.shield ? 1 : 0, magnet: 0, turbo: 0, double: 0, slow: 0, ghost: 0 };
    state.usedPowers = new Set();
    state.zoneIndex = 0;
    state.zoneTimer = 0;
    state.event = null;
    state.eventTimer = 0;
    state.nextEvent = 19 + Math.random() * 5;
    state.boss = null;
    state.nextBoss = 42;
    state.bossHit = false;
    state.mission = randomMission();
    state.hintTimer = 4.3;
    state.nearMissPulse = 0;
    state.eventBanner = 0;

    save.games += 1;
    persist();
    unlock('firstRun');

    ui.startOverlay.classList.add('hidden');
    ui.pauseOverlay.classList.add('hidden');
    ui.gameOverOverlay.classList.add('hidden');
    ui.shopOverlay.classList.add('hidden');
    ui.achievementsOverlay.classList.add('hidden');
    ui.hud.classList.remove('hidden');
    ui.controlsHint.style.opacity = '1';
    ui.pauseButton.textContent = 'Ⅱ';
    updateMissionUI();
    updateHUD();
    ensureAudio();
    sounds.power();
  }

  function goMenu() {
    state.mode = 'menu';
    state.paused = false;
    ui.hud.classList.add('hidden');
    ui.pauseOverlay.classList.add('hidden');
    ui.gameOverOverlay.classList.add('hidden');
    ui.shopOverlay.classList.add('hidden');
    ui.achievementsOverlay.classList.add('hidden');
    ui.startOverlay.classList.remove('hidden');
    updateMenu();
  }

  function moveLane(delta) {
    if (state.mode !== 'playing' || state.paused) return;
    const next = clamp(state.targetLane + delta, 0, 2);
    if (next !== state.targetLane) {
      state.targetLane = next;
      state.hintTimer = 0;
      ui.controlsHint.style.opacity = '0';
      sounds.lane();
    }
  }
