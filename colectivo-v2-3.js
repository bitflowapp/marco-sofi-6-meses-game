function roundedPath(x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function roundedRect(x, y, w, h, r, fill, stroke = null, lineWidth = 1) {
    roundedPath(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  function drawScenery(zone) {
    const road = roadMetrics();
    for (const item of state.scenery) {
      item.y += state.speed * item.depth * .22 / 60;
      if (item.y > state.height + item.h) item.y = -item.h - Math.random() * 120;
      const x = item.side < 0 ? 8 : state.width - item.w - 8;
      const color = state.zoneIndex === 1 ? 'rgba(121, 83, 43, .28)' : 'rgba(45, 78, 119, .24)';
      roundedRect(x, item.y, item.w, item.h, 4, color);
      ctx.fillStyle = state.zoneIndex === 1 ? 'rgba(255, 186, 83, .42)' : 'rgba(255, 216, 112, .34)';
      for (let i = 0; i < item.lights; i++) {
        const wx = x + 7 + (i % 2) * 11;
        const wy = item.y + 12 + Math.floor(i / 2) * 18;
        ctx.fillRect(wx, wy, 5, 8);
      }
    }

    if (state.zoneIndex === 2) {
      const horizon = state.height * .32;
      ctx.fillStyle = 'rgba(80, 183, 232, .11)';
      ctx.fillRect(0, horizon, road.left - 16, state.height - horizon);
      ctx.fillRect(road.right + 16, horizon, state.width - road.right - 16, state.height - horizon);
      ctx.strokeStyle = 'rgba(111, 220, 255, .22)';
      ctx.lineWidth = 1;
      for (let y = horizon + 12; y < state.height; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(road.left - 16, y + 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(road.right + 16, y + 3);
        ctx.lineTo(state.width, y);
        ctx.stroke();
      }
    }

    if (state.zoneIndex === 3) {
      ctx.strokeStyle = 'rgba(171, 205, 255, .32)';
      ctx.lineWidth = 1;
      for (const drop of state.rain) {
        drop.y += drop.speed / 60;
        drop.x -= 1.8;
        if (drop.y > state.height + 20) {
          drop.y = -20;
          drop.x = Math.random() * state.width;
        }
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 5, drop.y + drop.len);
        ctx.stroke();
      }
    }
  }

  function drawBackground() {
    const zone = zones[state.zoneIndex];
    const sky = ctx.createLinearGradient(0, 0, 0, state.height);
    sky.addColorStop(0, zone.skyA);
    sky.addColorStop(1, zone.skyB);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, state.width, state.height);

    drawScenery(zone);

    const road = roadMetrics();
    ctx.fillStyle = zone.side;
    ctx.fillRect(0, 0, road.left, state.height);
    ctx.fillRect(road.right, 0, state.width - road.right, state.height);

    const curb = ctx.createLinearGradient(road.left - 25, 0, road.left + 8, 0);
    curb.addColorStop(0, 'rgba(35, 48, 65, .9)');
    curb.addColorStop(1, 'rgba(94, 112, 136, .82)');
    ctx.fillStyle = curb;
    ctx.fillRect(road.left - 23, 0, 23, state.height);
    const curbR = ctx.createLinearGradient(road.right, 0, road.right + 25, 0);
    curbR.addColorStop(0, 'rgba(94, 112, 136, .82)');
    curbR.addColorStop(1, 'rgba(35, 48, 65, .9)');
    ctx.fillStyle = curbR;
    ctx.fillRect(road.right, 0, 23, state.height);

    ctx.fillStyle = zone.road;
    ctx.fillRect(road.left, 0, road.width, state.height);

    const shine = ctx.createLinearGradient(road.left, 0, road.right, 0);
    shine.addColorStop(0, `${zone.accent}15`);
    shine.addColorStop(.5, 'rgba(255,255,255,.018)');
    shine.addColorStop(1, `${zone.accent}15`);
    ctx.fillStyle = shine;
    ctx.fillRect(road.left, 0, road.width, state.height);

    ctx.strokeStyle = state.zoneIndex === 1 ? 'rgba(255, 186, 97, .44)' : 'rgba(224, 235, 246, .34)';
    ctx.lineWidth = 3;
    ctx.setLineDash([43, 51]);
    ctx.lineDashOffset = state.roadOffset;
    for (let i = 1; i < 3; i++) {
      const x = road.left + road.laneWidth * i;
      ctx.beginPath();
      ctx.moveTo(x, -100);
      ctx.lineTo(x, state.height + 100);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    for (let y = -80; y < state.height + 80; y += 112) {
      const yy = (y + state.roadOffset * .85) % (state.height + 160) - 80;
      const glow = ctx.createRadialGradient(road.left - 8, yy, 1, road.left - 8, yy, 36);
      glow.addColorStop(0, `${zone.accent}80`);
      glow.addColorStop(1, `${zone.accent}00`);
      ctx.fillStyle = glow;
      ctx.fillRect(road.left - 46, yy - 38, 76, 76);
      ctx.fillStyle = zone.accent;
      ctx.fillRect(road.left - 11, yy - 3, 6, 6);
      ctx.fillRect(road.right + 5, yy - 3, 6, 6);
    }

    if (state.effects.turbo > 0) {
      ctx.strokeStyle = 'rgba(112, 204, 255, .5)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 14; i++) {
        const x = road.left + Math.random() * road.width;
        const y = Math.random() * state.height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 35 + Math.random() * 60);
        ctx.stroke();
      }
    }
  }

  function drawPlayer() {
    const x = laneCenter(state.lane);
    const y = playerY();
    const blink = state.invulnerable > 0 && Math.floor(state.invulnerable * 13) % 2 === 0;
    if (blink) return;

    ctx.save();
    ctx.translate(x, y);
    if (state.effects.ghost > 0) ctx.globalAlpha = .56 + Math.sin(state.elapsed * 10) * .16;

    if (state.effects.shield > 0) {
      ctx.strokeStyle = 'rgba(99, 235, 255, .9)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#65e9ff';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, 0, 39, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    if (state.effects.turbo > 0) {
      const flame = ctx.createLinearGradient(0, 34, 0, 70);
      flame.addColorStop(0, '#e9fbff');
      flame.addColorStop(.35, '#4bc7ff');
      flame.addColorStop(1, 'rgba(57, 120, 255, 0)');
      ctx.fillStyle = flame;
      ctx.beginPath();
      ctx.moveTo(-12, 34);
      ctx.lineTo(-4, 68 + Math.sin(state.elapsed * 20) * 6);
      ctx.lineTo(2, 34);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(7, 34);
      ctx.lineTo(13, 65 + Math.cos(state.elapsed * 18) * 7);
      ctx.lineTo(18, 34);
      ctx.fill();
    }

    const shadow = ctx.createRadialGradient(0, 29, 2, 0, 29, 38);
    shadow.addColorStop(0, 'rgba(0, 0, 0, .48)');
    shadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadow;
    ctx.fillRect(-42, 2, 84, 58);

    ctx.shadowColor = 'rgba(45, 142, 255, .62)';
    ctx.shadowBlur = 16;
    const body = ctx.createLinearGradient(-22, -35, 22, 35);
    body.addColorStop(0, '#58b2ff');
    body.addColorStop(.45, '#2784ef');
    body.addColorStop(1, '#1553c3');
    roundedRect(-23, -38, 46, 76, 13, body, 'rgba(255,255,255,.24)');
    ctx.shadowBlur = 0;

    roundedRect(-16, -29, 32, 21, 7, '#bfe9ff');
    const glass = ctx.createLinearGradient(0, -27, 0, -8);
    glass.addColorStop(0, 'rgba(239, 250, 255, .94)');
    glass.addColorStop(1, 'rgba(71, 139, 189, .72)');
    roundedRect(-14, -27, 28, 17, 5, glass);
    roundedRect(-15, 1, 30, 24, 7, '#1357bd');

    ctx.fillStyle = '#eefaff';
    ctx.shadowColor = '#dff8ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(-14, -30, 4, 0, Math.PI * 2);
    ctx.arc(14, -30, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#082c68';
    ctx.fillRect(-26, -19, 4, 17);
    ctx.fillRect(22, -19, 4, 17);
    ctx.fillRect(-26, 15, 4, 17);
    ctx.fillRect(22, 15, 4, 17);

    ctx.fillStyle = '#d9f3ff';
    ctx.beginPath();
    ctx.arc(-14, 31, 4.5, 0, Math.PI * 2);
    ctx.arc(14, 31, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawVehicle(o) {
    ctx.save();
    ctx.translate(o.x, o.y);
    const wobble = o.kind === 'moto' ? Math.sin(o.wobble) * .05 : 0;
    ctx.rotate(wobble);

    if (o.kind === 'pothole') {
      const g = ctx.createRadialGradient(0, 0, 2, 0, 0, o.w * .58);
      g.addColorStop(0, '#030405');
      g.addColorStop(.54, '#11161d');
      g.addColorStop(1, 'rgba(70, 76, 83, .18)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, o.w / 2, o.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.09)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-24, 0); ctx.lineTo(-8, -7); ctx.lineTo(7, -2); ctx.lineTo(24, -8);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (o.kind === 'cone') {
      ctx.shadowColor = '#ff6d38';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ff743e';
      ctx.beginPath();
      ctx.moveTo(0, -o.h / 2);
      ctx.lineTo(o.w / 2, o.h / 2);
      ctx.lineTo(-o.w / 2, o.h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff4dd';
      ctx.fillRect(-10, -2, 20, 7);
      roundedRect(-18, o.h / 2 - 5, 36, 8, 3, '#de5525');
      ctx.restore();
      return;
    }

    const shadow = ctx.createRadialGradient(0, o.h * .32, 3, 0, o.h * .32, o.w * .7);
    shadow.addColorStop(0, 'rgba(0,0,0,.48)');
    shadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadow;
    ctx.fillRect(-o.w, 0, o.w * 2, o.h * .65);

    ctx.shadowColor = 'rgba(0,0,0,.48)';
    ctx.shadowBlur = 11;
    const body = ctx.createLinearGradient(-o.w / 2, -o.h / 2, o.w / 2, o.h / 2);
    body.addColorStop(0, lighten(o.color, 28));
    body.addColorStop(.55, o.color);
    body.addColorStop(1, darken(o.color, 35));
    roundedRect(-o.w / 2, -o.h / 2, o.w, o.h, o.kind === 'moto' ? 9 : 11, body, 'rgba(255,255,255,.14)');
    ctx.shadowBlur = 0;

    if (o.kind === 'moto') {
      roundedRect(-8, -20, 16, 34, 6, '#1a2535');
      ctx.fillStyle = '#f6f9ff';
      ctx.beginPath(); ctx.arc(0, -22, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffec8c';
      ctx.beginPath(); ctx.arc(0, 24, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return;
    }

    const windowColor = o.kind === 'bus' || o.kind === 'truck' ? '#b8dce9' : '#c1e5f5';
    roundedRect(-o.w * .34, -o.h * .34, o.w * .68, o.h * .21, 5, windowColor);
    roundedRect(-o.w * .34, o.h * .05, o.w * .68, o.h * .17, 5, 'rgba(17, 43, 70, .58)');

    if (o.kind === 'taxi') {
      roundedRect(-12, -o.h * .51, 24, 8, 3, '#fff8cd');
      ctx.fillStyle = '#161b22';
      ctx.font = '900 7px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('TAXI', 0, -o.h * .45);
    }

    if (o.kind === 'bus') {
      ctx.fillStyle = 'rgba(255,255,255,.65)';
      for (let y = -16; y < 28; y += 16) ctx.fillRect(-o.w * .36, y, o.w * .72, 2);
    }

    if (o.kind === 'truck') {
      roundedRect(-o.w * .39, 2, o.w * .78, o.h * .36, 5, 'rgba(238,245,250,.22)');
      ctx.strokeStyle = 'rgba(255,255,255,.3)';
      ctx.strokeRect(-o.w * .31, 9, o.w * .62, o.h * .23);
    }

    ctx.fillStyle = '#fff2ba';
    ctx.shadowColor = '#fff2ba';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(-o.w * .27, o.h * .4, 4, 0, Math.PI * 2);
    ctx.arc(o.w * .27, o.h * .4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function lighten(hex, amount) { return adjustColor(hex, amount); }
  function darken(hex, amount) { return adjustColor(hex, -amount); }
  function adjustColor(hex, amount) {
    const value = parseInt(hex.replace('#', ''), 16);
    const r = clamp((value >> 16) + amount, 0, 255);
    const g = clamp(((value >> 8) & 255) + amount, 0, 255);
    const b = clamp((value & 255) + amount, 0, 255);
    return `rgb(${r},${g},${b})`;
  }

  function drawPickup(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.spin);
    const pulse = 1 + Math.sin(state.elapsed * 7 + p.spin) * .08;
    ctx.scale(pulse, pulse);
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 16;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    if (p.kind === 'coin') {
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
    } else {
      for (let i = 0; i < 8; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 4;
        const r = i % 2 === 0 ? p.r : p.r * .78;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
    }
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.rotate(-p.spin);
    ctx.fillStyle = p.kind === 'coin' ? '#7b4c0b' : '#06101f';
    ctx.font = `950 ${p.kind === 'coin' ? 15 : 12}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.icon, 0, 1);
    ctx.restore();
  }

  function drawBoss() {
    const b = state.boss;
    if (!b) return;
    if (b.warning > .25) {
      const road = roadMetrics();
      const x = laneCenter(b.targetLane) - road.laneWidth / 2 + 4;
      ctx.fillStyle = `rgba(255, 70, 76, ${.12 + Math.sin(state.elapsed * 14) * .06})`;
      ctx.fillRect(x, 0, road.laneWidth - 8, state.height);
      ctx.fillStyle = '#ff6b74';
      ctx.font = '950 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('⚠ CAMBIO DE CARRIL', laneCenter(b.targetLane), state.height * .48);
    }

    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.shadowColor = '#ff774f';
    ctx.shadowBlur = 18;
    const body = ctx.createLinearGradient(-45, -75, 45, 75);
    body.addColorStop(0, '#ffb14b');
    body.addColorStop(.5, '#e86b2f');
    body.addColorStop(1, '#8d2f20');
    roundedRect(-46, -78, 92, 156, 17, body, 'rgba(255,255,255,.25)', 2);
    ctx.shadowBlur = 0;
    roundedRect(-35, -61, 70, 31, 8, '#bde5ef');
    roundedRect(-35, -17, 70, 58, 7, '#27374a');
    ctx.fillStyle = '#ffe69a';
    for (let y = -8; y < 32; y += 14) {
      ctx.fillRect(-28, y, 18, 7);
      ctx.fillRect(10, y, 18, 7);
    }
    ctx.fillStyle = '#ff384d';
    ctx.shadowColor = '#ff384d';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(-26, 65, 6, 0, Math.PI * 2);
    ctx.arc(26, 65, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    roundedRect(-23, -88, 46, 13, 6, '#192230');
    ctx.fillStyle = '#fff';
    ctx.font = '950 9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('FUERA DE SERVICIO', 0, -79);
    ctx.restore();
  }

  function drawParticlesAndPopups() {
    for (const p of state.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (const p of state.popups) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.font = '950 12px system-ui';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,.8)';
      ctx.shadowBlur = 6;
      ctx.fillText(p.text, p.x, p.y);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  function drawEventBanner() {
    if (state.eventBanner <= 0) return;
    const alpha = Math.min(1, state.eventBanner * 1.4);
    ctx.globalAlpha = alpha;
    const w = Math.min(330, state.width - 36);
    const x = (state.width - w) / 2;
    const y = state.height * .37;
    roundedRect(x, y, w, 72, 18, 'rgba(4, 10, 20, .86)', 'rgba(255,255,255,.16)');
    ctx.fillStyle = '#fff';
    ctx.font = '1000 20px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(state.eventTitle, state.width / 2, y + 30);
    ctx.fillStyle = '#9cb2cf';
    ctx.font = '800 11px system-ui';
    ctx.fillText(state.eventSubtitle, state.width / 2, y + 52);
    ctx.globalAlpha = 1;
  }

  function render() {
    ctx.save();
    const shakeAmount = state.shake > 0 ? state.shake * 13 : 0;
    if (shakeAmount) ctx.translate((Math.random() - .5) * shakeAmount, (Math.random() - .5) * shakeAmount);
    drawBackground();
    for (const p of state.pickups) drawPickup(p);
    for (const o of state.obstacles) drawVehicle(o);
    drawBoss();
    drawPlayer();
    drawParticlesAndPopups();
    drawEventBanner();

    if (state.effects.slow > 0) {
      ctx.fillStyle = 'rgba(71, 112, 255, .07)';
      ctx.fillRect(0, 0, state.width, state.height);
    }
    if (state.flash > 0) {
      ctx.fillStyle = `rgba(255, 70, 85, ${state.flash * .52})`;
      ctx.fillRect(0, 0, state.width, state.height);
    }
    if (state.nearMissPulse > 0) {
      ctx.strokeStyle = `rgba(103, 191, 255, ${state.nearMissPulse})`;
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, state.width - 8, state.height - 8);
    }
    ctx.restore();
  }
