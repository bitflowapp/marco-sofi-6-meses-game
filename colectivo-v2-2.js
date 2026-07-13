function chooseObstacle() {
    const t = state.elapsed;
    const pool = ['car', 'taxi', 'pothole', 'cone'];
    if (t > 12) pool.push('moto');
    if (t > 22) pool.push('bus');
    if (t > 35) pool.push('truck');
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function spawnObstacle(lane, kind = chooseObstacle(), yOffset = 0) {
    const def = obstacleKinds[kind];
    state.obstacles.push({
      lane,
      x: laneCenter(lane),
      y: -def.h - 35 - yOffset,
      w: def.w,
      h: def.h,
      speedMul: def.speed,
      kind,
      color: def.color,
      score: def.score,
      passed: false,
      nearMiss: false,
      wobble: Math.random() * Math.PI * 2
    });
  }

  function spawnPattern() {
    const rush = state.event === 'rush';
    const roadworks = state.event === 'roadworks';
    const roll = Math.random();

    if ((roadworks || roll > .77) && state.elapsed > 10) {
      const safeLane = Math.floor(Math.random() * 3);
      for (let lane = 0; lane < 3; lane++) {
        if (lane !== safeLane) spawnObstacle(lane, roadworks ? 'cone' : chooseObstacle());
      }
      return;
    }

    if (roll > .54 && state.elapsed > 8) {
      const first = Math.floor(Math.random() * 3);
      let second = Math.floor(Math.random() * 3);
      while (second === first) second = Math.floor(Math.random() * 3);
      spawnObstacle(first);
      spawnObstacle(second, chooseObstacle(), 110 + Math.random() * 80);
      return;
    }

    spawnObstacle(Math.floor(Math.random() * 3));
    if (rush && Math.random() > .45) {
      const lane = Math.floor(Math.random() * 3);
      spawnObstacle(lane, chooseObstacle(), 150 + Math.random() * 80);
    }
  }

  function spawnPickup(kind = 'coin', lane = Math.floor(Math.random() * 3), y = -45) {
    const isCoin = kind === 'coin';
    const def = isCoin ? { color: '#ffd75a', icon: '$', label: 'Moneda' } : pickupKinds.find((p) => p.id === kind);
    state.pickups.push({
      lane,
      x: laneCenter(lane),
      y,
      r: isCoin ? 12 : 16,
      kind,
      spin: Math.random() * Math.PI * 2,
      color: def.color,
      icon: def.icon,
      label: def.label
    });
  }

  function spawnCoinLine() {
    const lane = Math.floor(Math.random() * 3);
    for (let i = 0; i < 5; i++) spawnPickup('coin', lane, -35 - i * 58);
  }

  function addParticles(x, y, color, count = 12, force = 170) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * force + 35;
      state.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: .3 + Math.random() * .42,
        max: .72,
        r: 1.2 + Math.random() * 3.2,
        color
      });
    }
    if (state.particles.length > 130) state.particles.splice(0, state.particles.length - 130);
  }

  function popup(text, x, y, color = '#fff') {
    state.popups.push({ text, x, y, color, life: .8, max: .8 });
  }

  function triggerEvent() {
    const choices = ['rush', 'coinRain', 'roadworks'];
    state.event = choices[Math.floor(Math.random() * choices.length)];
    state.eventTimer = 7.5;
    state.nextEvent = 24 + Math.random() * 9;

    if (state.event === 'rush') {
      showEvent('HORA PICO', 'Más tránsito, más combo');
    } else if (state.event === 'coinRain') {
      showEvent('LLUVIA DE MONEDAS', 'Cobrá antes de que cobre otro');
      spawnCoinLine();
    } else {
      showEvent('OBRAS EN LA RUTA', 'Seguí el carril libre');
    }
  }

  function showEvent(title, subtitle) {
    state.eventTitle = title;
    state.eventSubtitle = subtitle;
    state.eventBanner = 2.7;
    toast(`⚠️ ${title}`);
  }

  function spawnBoss() {
    state.event = null;
    state.eventTimer = 0;
    state.boss = {
      x: laneCenter(1), y: -180, lane: 1, targetLane: 1,
      w: 92, h: 156, timer: 0, duration: 13,
      phaseTimer: 2.2, warning: 0, exiting: false,
      passed: false
    };
    state.bossHit = false;
    state.nextBoss = 58;
    showEvent('MINI JEFE', 'Colectivo articulado fuera de control');
    sounds.boss();
    vibrate([25, 45, 25]);
  }

  function updateBoss(dt, worldDt) {
    const boss = state.boss;
    if (!boss) return;
    boss.timer += dt;

    if (!boss.exiting) {
      const targetY = state.height * .27;
      boss.y += (targetY - boss.y) * Math.min(1, worldDt * 2.4);
      boss.phaseTimer -= dt;
      if (boss.phaseTimer <= 0) {
        let next = Math.floor(Math.random() * 3);
        if (next === boss.lane) next = (next + 1 + Math.floor(Math.random() * 2)) % 3;
        boss.targetLane = next;
        boss.warning = .85;
        boss.phaseTimer = 2.1 + Math.random() * .8;
      }
      boss.warning = Math.max(0, boss.warning - dt);
      if (boss.warning <= .25) boss.lane += (boss.targetLane - boss.lane) * Math.min(1, worldDt * 3.6);
      boss.x = laneCenter(boss.lane);
      if (boss.timer >= boss.duration) boss.exiting = true;
    } else {
      boss.y += 380 * worldDt;
      if (boss.y > state.height + 200) {
        if (!state.bossHit) unlock('bossDodger');
        state.score += 1400 * comboMultiplier();
        toast('🚌 Mini jefe superado: +1400 puntos');
        state.boss = null;
      }
    }

    const px = laneCenter(state.lane);
    const py = playerY();
    if (rectHit(px, py, 44, 74, boss.x, boss.y, boss.w, boss.h)) {
      hitPlayer(true);
      boss.y -= 90;
    }
  }

  function rectHit(ax, ay, aw, ah, bx, by, bw, bh) {
    return Math.abs(ax - bx) < (aw + bw) * .38 && Math.abs(ay - by) < (ah + bh) * .38;
  }

  function hitPlayer(fromBoss = false) {
    if (state.effects.ghost > 0) return;
    if (state.invulnerable > 0) return;
    if (state.effects.shield > 0) {
      state.effects.shield = 0;
      addParticles(laneCenter(state.lane), playerY(), '#65e9ff', 22, 220);
      popup('BLOQUEADO', laneCenter(state.lane), playerY() - 55, '#65e9ff');
      sounds.power();
      vibrate(25);
      return;
    }

    state.lives -= 1;
    state.hits += 1;
    if (fromBoss) state.bossHit = true;
    state.invulnerable = 1.15;
    state.flash = .28;
    state.shake = .34;
    state.combo = 0;
    state.comboTimer = 0;
    addParticles(laneCenter(state.lane), playerY(), '#ff5c6a', 24, 260);
    popup('-1 VIDA', laneCenter(state.lane), playerY() - 55, '#ff6b78');
    sounds.hit();
    vibrate([45, 25, 65]);
    if (state.lives <= 0) endGame();
  }

  function passObstacle(o) {
    state.passes += 1;
    state.combo += 1;
    state.comboTimer = 3;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    const near = Math.abs(o.x - laneCenter(state.lane)) < o.w * .72 + 52;
    const bonus = o.score * comboMultiplier() * (state.effects.double > 0 ? 2 : 1);
    state.score += bonus + (near ? 65 * comboMultiplier() : 0);
    updateMission('dodge');
    if (near) {
      state.nearMissPulse = .32;
      addParticles(o.x, playerY() + 35, '#7fc8ff', 7, 110);
      popup('¡CERCA!', o.x, playerY() + 5, '#7fc8ff');
    }
    if (state.combo > 0 && state.combo % 5 === 0) sounds.combo();
    if (state.maxCombo >= 25) unlock('comboMaster');
  }

  function collect(p) {
    const px = laneCenter(state.lane);
    if (p.kind === 'coin') {
      const valueBoost = 1 + save.upgrades.coin * .25;
      const points = 70 * valueBoost * comboMultiplier() * (state.effects.double > 0 ? 2 : 1);
      state.runCoins += 1;
      state.score += points;
      updateMission('coins');
      addParticles(p.x, p.y, '#ffd75a', 8, 110);
      popup(`+${Math.floor(points)}`, p.x, p.y - 10, '#ffd75a');
      sounds.coin();
      vibrate(10);
      return;
    }

    state.usedPowers.add(p.kind);
    if (state.usedPowers.size >= pickupKinds.length) unlock('powerTour');

    switch (p.kind) {
      case 'shield': state.effects.shield = 1; break;
      case 'magnet': state.effects.magnet = 8; break;
      case 'turbo': state.effects.turbo = 5.5; break;
      case 'repair':
        state.lives = Math.min(state.maxLives, state.lives + 1);
        break;
      case 'double': state.effects.double = 9; break;
      case 'slow': state.effects.slow = 6.5; break;
      case 'bomb': activateBomb(); break;
      case 'ghost': state.effects.ghost = 5.5; break;
    }

    state.score += 140 * comboMultiplier();
    addParticles(p.x, p.y, p.color, 18, 210);
    popup(p.label.toUpperCase(), px, playerY() - 60, p.color);
    toast(`${p.label} activado`);
    sounds.power();
    vibrate([15, 16, 15]);
  }

  function activateBomb() {
    let cleared = 0;
    for (const o of state.obstacles) {
      if (o.y > -80 && o.y < state.height) {
        addParticles(o.x, o.y, '#ff5f72', 12, 260);
        cleared += 1;
      }
    }
    state.obstacles = state.obstacles.filter((o) => o.y <= -80 || o.y >= state.height);
    state.score += cleared * 130 * comboMultiplier();
    state.flash = .35;
    state.shake = .45;
    sounds.bomb();
  }

  function updateEffects(dt) {
    for (const key of ['magnet', 'turbo', 'double', 'slow', 'ghost']) {
      state.effects[key] = Math.max(0, state.effects[key] - dt);
    }
  }

  function updateHUD() {
    ui.score.innerHTML = `🏁 <strong>${Math.floor(state.score)}</strong>`;
    ui.coins.textContent = `🪙 ${state.runCoins}`;
    ui.lives.textContent = `${'❤️'.repeat(Math.max(0, state.lives))}${state.effects.shield ? ' 🛡️' : ''}`;
    const multiplier = comboMultiplier().toFixed(1);
    ui.comboBadge.textContent = `COMBO ${state.combo} · ×${multiplier}`;
    ui.comboBadge.classList.toggle('show', state.combo >= 3);

    const powerMap = {
      powerShield: state.effects.shield,
      powerMagnet: state.effects.magnet,
      powerTurbo: state.effects.turbo,
      powerDouble: state.effects.double,
      powerSlow: state.effects.slow,
      powerGhost: state.effects.ghost
    };
    for (const [id, value] of Object.entries(powerMap)) {
      ui[id].classList.toggle('hidden', value <= 0);
      if (value > 1 && id !== 'powerShield') {
        const base = ui[id].textContent.split(' · ')[0];
        ui[id].textContent = `${base} · ${Math.ceil(value)}s`;
      }
    }
  }

  function update(dt) {
    if (state.mode !== 'playing' || state.paused) return;

    state.elapsed += dt;
    if (state.mission?.type === 'survive' && !state.mission.complete) {
      state.mission.progress = Math.min(state.mission.target, state.elapsed);
      if (state.mission.progress >= state.mission.target) updateMission('survive', 0);
      updateMissionUI();
    }

    if (state.elapsed >= 60) unlock('survivor');
    state.zoneTimer += dt;
    if (state.zoneTimer >= 28) {
      state.zoneTimer = 0;
      state.zoneIndex = (state.zoneIndex + 1) % zones.length;
      toast(`📍 Zona: ${zones[state.zoneIndex].name}`);
    }

    state.nextEvent -= dt;
    if (state.nextEvent <= 0 && !state.boss) triggerEvent();
    if (state.event) {
      state.eventTimer -= dt;
      if (state.eventTimer <= 0) state.event = null;
    }

    state.nextBoss -= dt;
    if (state.nextBoss <= 0 && !state.boss) spawnBoss();

    updateEffects(dt);
    const worldScale = state.effects.slow > 0 ? .58 : 1;
    const worldDt = dt * worldScale;
    const turboBoost = state.effects.turbo > 0 ? 165 : 0;
    state.speed = Math.min(720, 330 + state.elapsed * 4.2 + turboBoost);
    state.roadOffset = (state.roadOffset + state.speed * worldDt) % 94;
    state.invulnerable = Math.max(0, state.invulnerable - dt);
    state.flash = Math.max(0, state.flash - dt);
    state.shake = Math.max(0, state.shake - dt);
    state.nearMissPulse = Math.max(0, state.nearMissPulse - dt);
    state.eventBanner = Math.max(0, state.eventBanner - dt);
    state.hintTimer = Math.max(0, state.hintTimer - dt);
    if (state.hintTimer <= 0) ui.controlsHint.style.opacity = '0';

    state.comboTimer = Math.max(0, state.comboTimer - dt);
    if (state.comboTimer <= 0 && state.combo > 0) state.combo = Math.max(0, state.combo - Math.ceil(dt * 5));

    state.lane += (state.targetLane - state.lane) * Math.min(1, dt * 11.5);
    state.score += dt * (11 + state.speed * .027) * comboMultiplier() * (state.effects.double > 0 ? 2 : 1);

    state.spawnTimer -= worldDt;
    if (state.spawnTimer <= 0 && !state.boss) {
      spawnPattern();
      const difficulty = Math.min(.52, state.elapsed * .0044);
      let base = Math.max(.42, 1.04 - difficulty);
      if (state.event === 'rush') base *= .62;
      if (state.event === 'roadworks') base *= .83;
      state.spawnTimer = base * (.82 + Math.random() * .38);
    }

    state.pickupTimer -= worldDt;
    if (state.pickupTimer <= 0) {
      if (state.event === 'coinRain') spawnCoinLine();
      else spawnPickup('coin');
      state.pickupTimer = state.event === 'coinRain' ? .72 : 1.05 + Math.random() * 1.25;
    }

    state.powerTimer -= worldDt;
    if (state.powerTimer <= 0) {
      const power = pickupKinds[Math.floor(Math.random() * pickupKinds.length)].id;
      spawnPickup(power);
      state.powerTimer = 8.5 + Math.random() * 6;
    }

    updateBoss(dt, worldDt);

    const px = laneCenter(state.lane);
    const py = playerY();

    for (let i = state.obstacles.length - 1; i >= 0; i--) {
      const o = state.obstacles[i];
      o.y += state.speed * o.speedMul * worldDt;
      o.wobble += dt * 3;

      if (state.effects.ghost > 0 && rectHit(px, py, 44, 74, o.x, o.y, o.w, o.h)) {
        addParticles(o.x, o.y, '#dce9ff', 12, 140);
        state.score += 75 * comboMultiplier();
        state.obstacles.splice(i, 1);
        continue;
      }

      if (rectHit(px, py, 44, 74, o.x, o.y, o.w, o.h)) {
        hitPlayer();
        state.obstacles.splice(i, 1);
        continue;
      }

      if (!o.passed && o.y > py + 52) {
        o.passed = true;
        passObstacle(o);
      }

      if (o.y > state.height + 150) state.obstacles.splice(i, 1);
    }

    for (let i = state.pickups.length - 1; i >= 0; i--) {
      const p = state.pickups[i];
      p.y += state.speed * .91 * worldDt;
      p.spin += dt * 6;
      if (state.effects.magnet > 0 && Math.abs(p.y - py) < 220) {
        p.x += (px - p.x) * Math.min(1, dt * 9.5);
      }
      if (Math.hypot(p.x - px, p.y - py) < p.r + 26) {
        collect(p);
        state.pickups.splice(i, 1);
        continue;
      }
      if (p.y > state.height + 70) state.pickups.splice(i, 1);
    }

    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= .97;
      p.vy *= .97;
      if (p.life <= 0) state.particles.splice(i, 1);
    }

    for (let i = state.popups.length - 1; i >= 0; i--) {
      const p = state.popups[i];
      p.life -= dt;
      p.y -= 34 * dt;
      if (p.life <= 0) state.popups.splice(i, 1);
    }

    updateHUD();
  }

  function endGame() {
    if (state.mode !== 'playing') return;
    state.mode = 'gameover';
    state.paused = false;
    const final = Math.floor(state.score);
    const newBest = final > save.best;
    save.best = Math.max(save.best, final);
    save.totalCoins += state.runCoins;
    if (save.totalCoins >= 100) unlock('coinHunter');
    persist();

    ui.finalScore.textContent = final;
    ui.finalCoins.textContent = state.runCoins;
    ui.finalCombo.textContent = state.maxCombo;
    ui.gameOverText.textContent = newBest
      ? 'Nuevo récord. Te pasaste de parada con dignidad.'
      : state.mission?.complete
        ? 'La misión salió bien. El paragolpes, más o menos.'
        : 'El tránsito ganó esta ronda. Sólo esta.';
    ui.gameOverOverlay.classList.remove('hidden');
    ui.pauseButton.textContent = 'Ⅱ';
    sounds.gameOver();
    updateMenu();
  }

  function togglePause(force) {
    if (state.mode !== 'playing') return;
    state.paused = typeof force === 'boolean' ? force : !state.paused;
    ui.pauseOverlay.classList.toggle('hidden', !state.paused);
    ui.pauseButton.textContent = state.paused ? '▶' : 'Ⅱ';
    if (!state.paused) {
      state.lastTime = performance.now();
      ensureAudio();
    }
  }
