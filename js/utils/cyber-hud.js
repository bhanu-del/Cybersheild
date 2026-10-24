/**
 * CyberShield — Animated Cyber Defense & Activity Map Engine
 * 
 * MODES:
 * 1. LINK ANALYZER MODE (activeRoute === 'link-inspector'):
 *    - Fullscreen animated "CyberX Activity Map / Attack Paths" network topology.
 *    - Interconnected glowing Blue Defense Shield Hubs & Red Threat Alert Hubs.
 *    - Animated laser energy packets continuously traveling along attack paths.
 *    - Satellite child nodes, breathing concentric rings, expanding pulse waves.
 *    - Deep royal midnight purple nebula & dotted coordinate matrix.
 * 
 * 2. DASHBOARD / GENERAL MODE:
 *    - Tactical Military Radar Defense HUD with 360° sweep, telemetry & system status.
 * 
 * STRICT LIGHT MODE ISOLATION:
 * - Completely dormant and hidden in [data-theme="light"]. Zero CPU/GPU usage.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  let canvas = null;
  let ctx = null;
  let animId = null;
  let isRunning = false;
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Active navigation route ('overview', 'link-inspector', 'arena', etc.)
  let activeRoute = (typeof window !== 'undefined' && window.location.hash) 
    ? window.location.hash.replace(/^#\/?/, '').trim() 
    : 'overview';

  // Real-time raw mouse coordinates & speed
  const mouse = {
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    speed: 0,
    radius: 220,
    isActive: false
  };

  // Parallax camera tilt values
  const parallax = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };

  // Smoothly interpolated HUD reticle coordinates
  const cursorHud = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    angle: 0,
    alpha: 0
  };

  // Active EMP shockwaves & click ripples
  const shockwaves = [];

  // Kinetic cursor motion sparks
  const sparks = [];
  const MAX_SPARKS = 24;

  // ==========================================================================
  // MODE 1: CYBERX ACTIVITY MAP / ATTACK PATHS TOPOLOGY (LINK ANALYZER MODE)
  // ==========================================================================
  const activityHubs = [
    // 0: Master Center-Left Blue Shield Hub (largest master core)
    { id: 0, xR: 0.46, yR: 0.48, type: 'blue', radius: 36, label: 'MASTER_CORE', satCount: 8, satR: 54, satAngleOffset: 0.2 },
    // 1: Top-Center Red Threat Hub (Critical Attack Vector)
    { id: 1, xR: 0.62, yR: 0.24, type: 'red', radius: 30, label: 'ATTACK_VECTOR_01', satCount: 4, satR: 44, satAngleOffset: 2.1 },
    // 2: Far-Left Red Threat Hub (Suspicious Ingress)
    { id: 2, xR: 0.22, yR: 0.54, type: 'red', radius: 32, label: 'SPOOF_INGRESS', satCount: 3, satR: 42, satAngleOffset: 3.8 },
    // 3: Mid-Left Red Threat Hub (Phishing Gateway)
    { id: 3, xR: 0.36, yR: 0.62, type: 'red', radius: 28, label: 'PHISH_GATEWAY', satCount: 4, satR: 40, satAngleOffset: 1.4 },
    // 4: Bottom-Left Blue Hub (Secure Proxy)
    { id: 4, xR: 0.25, yR: 0.76, type: 'blue', radius: 24, label: 'PROXY_SECURE', satCount: 3, satR: 36, satAngleOffset: 0.8 },
    // 5: Top-Left Blue Node (SSL SAN)
    { id: 5, xR: 0.29, yR: 0.40, type: 'blue', radius: 18, label: 'SSL_VALIDATOR', satCount: 0, satR: 0 },
    // 6: Mid-Center Blue Hub (WAF Filter)
    { id: 6, xR: 0.57, yR: 0.58, type: 'blue', radius: 26, label: 'WAF_FILTER', satCount: 0, satR: 0 },
    // 7: Upper-Right Blue Shield Hub (Domain Authority)
    { id: 7, xR: 0.72, yR: 0.36, type: 'blue', radius: 34, label: 'DOMAIN_AUTHORITY', satCount: 0, satR: 0 },
    // 8: Far-Right Red Threat Hub (Payload Emitter)
    { id: 8, xR: 0.86, yR: 0.46, type: 'red', radius: 30, label: 'PAYLOAD_EMIT', satCount: 3, satR: 40, satAngleOffset: 4.2 },
    // 9: Bottom-Center Red Threat Hub (C2 Beacon)
    { id: 9, xR: 0.62, yR: 0.74, type: 'red', radius: 28, label: 'C2_BEACON', satCount: 4, satR: 38, satAngleOffset: 5.1 },
    // 10: Bottom-Right Blue Hub (DNSSEC)
    { id: 10, xR: 0.88, yR: 0.72, type: 'blue', radius: 22, label: 'DNSSEC', satCount: 4, satR: 34, satAngleOffset: 2.7 },
    // 11: Bottom Mid-Left Blue Hub (Heuristic Validator)
    { id: 11, xR: 0.53, yR: 0.88, type: 'blue', radius: 20, label: 'HEURISTIC_CORE', satCount: 4, satR: 32, satAngleOffset: 1.1 },
    // 12: Bottom Mid-Right Blue Hub (Reputation Feed)
    { id: 12, xR: 0.74, yR: 0.86, type: 'blue', radius: 22, label: 'REPUTATION_FEED', satCount: 3, satR: 32, satAngleOffset: 0.5 },
    // 13: Center-Right Blue Hub (Network Traffic Router)
    { id: 13, xR: 0.71, yR: 0.57, type: 'blue', radius: 22, label: 'TRAFFIC_ROUTER', satCount: 0, satR: 0 }
  ];

  const activityLinks = [
    { from: 0, to: 1, type: 'threat' },
    { from: 0, to: 2, type: 'threat' },
    { from: 0, to: 3, type: 'threat' },
    { from: 0, to: 5, type: 'defense' },
    { from: 0, to: 6, type: 'defense' },
    { from: 0, to: 7, type: 'defense' },
    { from: 1, to: 7, type: 'threat' },
    { from: 1, to: 13, type: 'threat' },
    { from: 2, to: 5, type: 'threat' },
    { from: 2, to: 4, type: 'threat' },
    { from: 3, to: 4, type: 'threat' },
    { from: 4, to: 11, type: 'defense' },
    { from: 6, to: 9, type: 'threat' },
    { from: 6, to: 13, type: 'defense' },
    { from: 7, to: 8, type: 'threat' },
    { from: 7, to: 13, type: 'defense' },
    { from: 8, to: 10, type: 'threat' },
    { from: 9, to: 11, type: 'threat' },
    { from: 9, to: 12, type: 'threat' },
    { from: 9, to: 13, type: 'threat' },
    { from: 10, to: 12, type: 'defense' },
    { from: 11, to: 12, type: 'defense' }
  ];

  // Traveling laser packets along the attack paths
  const activityPackets = [];
  const NUM_ACTIVITY_PACKETS = 22;
  for (let p = 0; p < NUM_ACTIVITY_PACKETS; p++) {
    const linkIdx = Math.floor(Math.random() * activityLinks.length);
    activityPackets.push({
      linkIdx: linkIdx,
      progress: Math.random(),
      speed: 0.004 + Math.random() * 0.006,
      direction: Math.random() > 0.4 ? 1 : -1
    });
  }

  // Periodic pulse ripple waves emitted from hubs
  const activityRipples = [];
  let lastRippleSpawnTime = 0;

  // ==========================================================================
  // MODE 2: TACTICAL RADAR SUITE DATA (GENERAL DASHBOARD MODE)
  // ==========================================================================
  let radarAngle = 0;
  const radarSweepSpeed = 0.016;

  const radarBlips = [
    { rFrac: 0.32, angle: 0.45, label: 'SRV-01', status: 'secure', lastSwept: 0, pingR: 0 },
    { rFrac: 0.68, angle: 1.15, label: 'GATEWAY', status: 'secure', lastSwept: 0, pingR: 0 },
    { rFrac: 0.85, angle: 1.85, label: 'DNS-SEC', status: 'secure', lastSwept: 0, pingR: 0 },
    { rFrac: 0.42, angle: 2.65, label: 'FIREWALL', status: 'secure', lastSwept: 0, pingR: 0 },
    { rFrac: 0.74, angle: 3.40, label: 'THREAT-PING', status: 'alert', lastSwept: 0, pingR: 0 },
    { rFrac: 0.55, angle: 4.10, label: 'IP-NODE', status: 'secure', lastSwept: 0, pingR: 0 },
    { rFrac: 0.88, angle: 4.85, label: 'SSL-AUTH', status: 'secure', lastSwept: 0, pingR: 0 },
    { rFrac: 0.28, angle: 5.60, label: 'SENTINEL', status: 'secure', lastSwept: 0, pingR: 0 },
    { rFrac: 0.62, angle: 0.90, label: 'HEURISTIC', status: 'secure', lastSwept: 0, pingR: 0 },
    { rFrac: 0.78, angle: 2.20, label: 'INSPECT', status: 'secure', lastSwept: 0, pingR: 0 },
    { rFrac: 0.48, angle: 3.80, label: 'AI-AGENT', status: 'secure', lastSwept: 0, pingR: 0 },
    { rFrac: 0.92, angle: 5.95, label: 'EXT-PROXY', status: 'alert', lastSwept: 0, pingR: 0 }
  ];

  const eqBars = [];
  const NUM_EQ_BARS = 14;
  for (let i = 0; i < NUM_EQ_BARS; i++) {
    eqBars.push({
      height: Math.random() * 0.7 + 0.2,
      targetHeight: Math.random() * 0.7 + 0.2,
      peak: 0.8,
      speed: 0.05 + Math.random() * 0.08
    });
  }

  const packetLogs = [
    { text: '[0x7F4B] TLSv1.3 AES-256-GCM', ts: '00:01' },
    { text: '[0x8A12] HEURISTICS: RULE 04 PASS', ts: '00:02' },
    { text: '[0x3C90] ZERO-DAY FILTER: OK', ts: '00:03' },
    { text: '[0x1E44] ANTI-PHISH ENGINE: ON', ts: '00:04' },
    { text: '[0x9D05] SOC SENTINEL: ARMED', ts: '00:05' },
    { text: '[0x4F88] SSL_CERT_SAN: VERIFIED', ts: '00:06' },
    { text: '[0x22C1] PORT INTEGRITY: NOMINAL', ts: '00:07' }
  ];
  let logScrollOffset = 0;

  const mapNodes = [
    { name: 'US-WEST', x: 0.16, y: 0.38, pulse: 0 },
    { name: 'US-EAST', x: 0.27, y: 0.40, pulse: 1.2 },
    { name: 'EUROPE', x: 0.52, y: 0.32, pulse: 2.4 },
    { name: 'INDIA', x: 0.71, y: 0.52, pulse: 3.6 },
    { name: 'E-ASIA', x: 0.84, y: 0.44, pulse: 4.8 },
    { name: 'AUS', x: 0.88, y: 0.78, pulse: 0.8 }
  ];

  const mapArcs = [
    { from: 0, to: 1, progress: 0.2, speed: 0.007 },
    { from: 1, to: 2, progress: 0.6, speed: 0.009 },
    { from: 2, to: 3, progress: 0.1, speed: 0.008 },
    { from: 3, to: 4, progress: 0.8, speed: 0.010 },
    { from: 4, to: 5, progress: 0.4, speed: 0.006 }
  ];

  // --------------------------------------------------------------------------
  // CORE ENGINE LIFECYCLE & EVENT HANDLERS
  // --------------------------------------------------------------------------
  function resize() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  function updateSpotlights(clientX, clientY) {
    document.documentElement.style.setProperty('--bg-mouse-x', `${clientX}px`);
    document.documentElement.style.setProperty('--bg-mouse-y', `${clientY}px`);

    const cards = document.querySelectorAll('.card, .quick-tool-card, .metric-card, .ai-verdict-card, .lesson-card, .hero-banner, .intel-hero-card, .investigation-dossier-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  }

  function handleMouseMove(e) {
    if (mouse.x > -1000) {
      const dx = e.clientX - mouse.x;
      const dy = e.clientY - mouse.y;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
    }

    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isActive = true;

    // Smooth Parallax Camera Tilt
    parallax.targetX = ((e.clientX - width / 2) / (width / 2)) * 18;
    parallax.targetY = ((e.clientY - height / 2) / (height / 2)) * 16;

    cursorHud.targetX = e.clientX;
    cursorHud.targetY = e.clientY;

    updateSpotlights(e.clientX, e.clientY);

    // Spawn subtle kinetic sparks on swift cursor movements
    if (mouse.speed > 5.2 && sparks.length < MAX_SPARKS) {
      const sparkColor = (activeRoute === 'link-inspector')
        ? (Math.random() > 0.4 ? '#C084FC' : '#38BDF8')
        : (Math.random() > 0.4 ? '#00F0FF' : '#00FF88');

      sparks.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.5) * 2.2,
        life: 1.0,
        decay: 0.038 + Math.random() * 0.02,
        color: sparkColor,
        size: Math.random() * 2.2 + 1.0
      });
    }
  }

  function handleMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
    mouse.isActive = false;
    mouse.speed = 0;
    parallax.targetX = 0;
    parallax.targetY = 0;
  }

  function handleTouchStart(e) {
    if (!e.touches || !e.touches[0]) return;
    const touch = e.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
    mouse.isActive = true;
    cursorHud.targetX = touch.clientX;
    cursorHud.targetY = touch.clientY;
    parallax.targetX = ((touch.clientX - width / 2) / (width / 2)) * 12;
    parallax.targetY = ((touch.clientY - height / 2) / (height / 2)) * 12;
    updateSpotlights(mouse.x, mouse.y);
    triggerShockwave(touch.clientX, touch.clientY);
  }

  function handleTouchMove(e) {
    if (!e.touches || !e.touches[0]) return;
    const touch = e.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
    mouse.isActive = true;
    cursorHud.targetX = touch.clientX;
    cursorHud.targetY = touch.clientY;
    parallax.targetX = ((touch.clientX - width / 2) / (width / 2)) * 12;
    parallax.targetY = ((touch.clientY - height / 2) / (height / 2)) * 12;
    updateSpotlights(mouse.x, mouse.y);
  }

  function handleTouchEnd() {
    mouse.isActive = false;
    mouse.x = -9999;
    mouse.y = -9999;
    parallax.targetX = 0;
    parallax.targetY = 0;
  }

  function triggerShockwave(x, y) {
    shockwaves.push({
      x: x,
      y: y,
      radius: 12,
      maxRadius: Math.min(290, width * 0.65),
      speed: 7.5,
      alpha: 0.95
    });
  }

  function handleClick(e) {
    if (!isRunning) return;
    triggerShockwave(e.clientX, e.clientY);
  }

  function drawCornerBrackets(ctx, x, y, w, h, size, color) {
    ctx.save();
    ctx.strokeStyle = color || 'rgba(0, 240, 255, 0.55)';
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.moveTo(x + size, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + w - size, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + size, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + h - size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + w - size, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w, y + h - size);
    ctx.stroke();

    ctx.restore();
  }

  // Helper to draw a tactical shield icon with exclamation badge
  function drawShieldBadge(ctx, cx, cy, radius, isRed) {
    const sw = radius * 0.44;
    const sh = radius * 0.52;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - sh);
    ctx.lineTo(cx + sw, cy - sh * 0.6);
    ctx.lineTo(cx + sw, cy + sh * 0.1);
    ctx.bezierCurveTo(cx + sw, cy + sh * 0.6, cx + sw * 0.4, cy + sh * 0.85, cx, cy + sh);
    ctx.bezierCurveTo(cx - sw * 0.4, cy + sh * 0.85, cx - sw, cy + sh * 0.6, cx - sw, cy + sh * 0.1);
    ctx.lineTo(cx - sw, cy - sh * 0.6);
    ctx.closePath();

    ctx.fillStyle = isRed ? '#F43F5E' : '#38BDF8';
    ctx.shadowBlur = 10;
    ctx.shadowColor = isRed ? '#F43F5E' : '#38BDF8';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Exclamation mark '!' in center
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.rect(cx - 1.4, cy - sh * 0.45, 2.8, sh * 0.45);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy + sh * 0.28, 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // RENDERER 1: CYBERX ACTIVITY MAP / ATTACK PATHS (FOR LINK ANALYZER MODE)
  // --------------------------------------------------------------------------
  function renderActivityMap(now, isMobile, isTablet) {
    const startX = (width > 1024) ? 256 : 0;
    const usableW = width - startX;

    // 1. Deep Royal Midnight Violet / Purple Galaxy Backdrop
    const bgGrad = ctx.createRadialGradient(
      startX + usableW * 0.55 + parallax.x * 2, height * 0.42 + parallax.y * 2, 40,
      startX + usableW * 0.55, height * 0.42, Math.max(width, height) * 0.85
    );
    bgGrad.addColorStop(0, '#10072b');
    bgGrad.addColorStop(0.35, '#0b0420');
    bgGrad.addColorStop(0.7, '#070216');
    bgGrad.addColorStop(1, '#03010a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Purple Nebula Glow Spots
    const neb1 = ctx.createRadialGradient(startX + usableW * 0.72, height * 0.35, 10, startX + usableW * 0.72, height * 0.35, 320);
    neb1.addColorStop(0, 'rgba(147, 51, 234, 0.18)');
    neb1.addColorStop(0.5, 'rgba(99, 102, 241, 0.08)');
    neb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = neb1;
    ctx.fillRect(0, 0, width, height);

    // 2. Fine Dotted Coordinate Matrix Grid
    ctx.save();
    const dotSpacing = isMobile ? 32 : 38;
    ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';

    for (let dx = (startX % dotSpacing); dx < width; dx += dotSpacing) {
      for (let dy = 0; dy < height; dy += dotSpacing) {
        ctx.beginPath();
        ctx.arc(dx, dy, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Compute live pixel coordinates for all 14 hubs
    const hubCoords = [];
    const scaleFactor = isMobile ? 0.72 : (isTablet ? 0.88 : 1.0);

    for (let h = 0; h < activityHubs.length; h++) {
      const hub = activityHubs[h];
      const hx = startX + hub.xR * usableW + parallax.x;
      const hy = hub.yR * height + parallax.y;
      hubCoords.push({ x: hx, y: hy });
    }

    // 3. Draw Connecting Attack Path Vectors (Network Lines)
    ctx.save();
    for (let l = 0; l < activityLinks.length; l++) {
      const link = activityLinks[l];
      const p1 = hubCoords[link.from];
      const p2 = hubCoords[link.to];

      const isThreatPath = link.type === 'threat';
      const lineGrad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);

      if (isThreatPath) {
        lineGrad.addColorStop(0, 'rgba(244, 63, 94, 0.38)');
        lineGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.35)');
        lineGrad.addColorStop(1, 'rgba(56, 189, 248, 0.38)');
      } else {
        lineGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        lineGrad.addColorStop(0.5, 'rgba(129, 140, 248, 0.30)');
        lineGrad.addColorStop(1, 'rgba(56, 189, 248, 0.35)');
      }

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = isThreatPath ? 1.4 : 1.1;
      ctx.stroke();
    }
    ctx.restore();

    // 4. Draw Traveling Laser Energy Packets along Attack Paths
    ctx.save();
    for (let p = 0; p < activityPackets.length; p++) {
      const pkt = activityPackets[p];
      pkt.progress += pkt.speed * pkt.direction;
      if (pkt.progress >= 1.0) {
        pkt.progress = 0;
        pkt.linkIdx = Math.floor(Math.random() * activityLinks.length);
      } else if (pkt.progress <= 0) {
        pkt.progress = 1.0;
        pkt.linkIdx = Math.floor(Math.random() * activityLinks.length);
      }

      const activeLink = activityLinks[pkt.linkIdx];
      const p1 = hubCoords[activeLink.from];
      const p2 = hubCoords[activeLink.to];

      const curX = p1.x + (p2.x - p1.x) * pkt.progress;
      const curY = p1.y + (p2.y - p1.y) * pkt.progress;

      const isThreatPkt = activeLink.type === 'threat';
      const pktColor = isThreatPkt ? '#FF3366' : '#38BDF8';
      const trailDx = (p2.x - p1.x) * 0.05 * pkt.direction;
      const trailDy = (p2.y - p1.y) * 0.05 * pkt.direction;

      // Trailing laser streak
      ctx.beginPath();
      ctx.moveTo(curX - trailDx, curY - trailDy);
      ctx.lineTo(curX, curY);
      ctx.strokeStyle = pktColor;
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // Glowing head bead
      ctx.beginPath();
      ctx.arc(curX, curY, isThreatPkt ? 2.6 : 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowBlur = 8;
      ctx.shadowColor = pktColor;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();

    // 5. Spawn & Draw Expanding Pulse Ripple Waves from Hubs
    if (now - lastRippleSpawnTime > 2600) {
      lastRippleSpawnTime = now;
      // Spawn ripple from random hub
      const randHubIdx = Math.floor(Math.random() * activityHubs.length);
      const rh = activityHubs[randHubIdx];
      activityRipples.push({
        hubIdx: randHubIdx,
        r: rh.radius * scaleFactor,
        maxR: rh.radius * scaleFactor * 2.8,
        speed: 0.9,
        isRed: rh.type === 'red'
      });
    }

    ctx.save();
    for (let r = activityRipples.length - 1; r >= 0; r--) {
      const rip = activityRipples[r];
      rip.r += rip.speed;
      const progress = rip.r / rip.maxR;
      const alpha = Math.max(0, 1.0 - progress);

      if (rip.r >= rip.maxR || alpha <= 0.02) {
        activityRipples.splice(r, 1);
        continue;
      }

      const hCoord = hubCoords[rip.hubIdx];
      ctx.beginPath();
      ctx.arc(hCoord.x, hCoord.y, rip.r, 0, Math.PI * 2);
      ctx.strokeStyle = rip.isRed 
        ? `rgba(244, 63, 94, ${alpha * 0.6})` 
        : `rgba(56, 189, 248, ${alpha * 0.6})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
    ctx.restore();

    // 6. Draw all 14 Hubs with Concentric Rings, Shield Badges & Satellites
    for (let h = 0; h < activityHubs.length; h++) {
      const hub = activityHubs[h];
      const hCoord = hubCoords[h];
      const isRed = hub.type === 'red';

      // Ambient breathing scale
      const breath = 1.0 + Math.sin(now * 0.0025 + hub.id * 1.1) * 0.045;
      const baseR = hub.radius * scaleFactor * breath;

      ctx.save();

      // 6A. Outer Ambient Glow Halo
      const haloGrad = ctx.createRadialGradient(hCoord.x, hCoord.y, baseR * 0.7, hCoord.x, hCoord.y, baseR * 2.1);
      if (isRed) {
        haloGrad.addColorStop(0, 'rgba(239, 68, 68, 0.32)');
        haloGrad.addColorStop(0.6, 'rgba(159, 18, 57, 0.12)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        haloGrad.addColorStop(0, 'rgba(37, 99, 235, 0.32)');
        haloGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.12)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(hCoord.x, hCoord.y, baseR * 2.1, 0, Math.PI * 2);
      ctx.fill();

      // 6B. Concentric Outer Rings (Matching Reference Image)
      // Ring 1: Outer glowing ring
      ctx.beginPath();
      ctx.arc(hCoord.x, hCoord.y, baseR * 1.48, 0, Math.PI * 2);
      ctx.strokeStyle = isRed ? 'rgba(251, 113, 133, 0.35)' : 'rgba(56, 189, 248, 0.32)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Ring 2: Concentric middle ring
      ctx.beginPath();
      ctx.arc(hCoord.x, hCoord.y, baseR * 1.22, 0, Math.PI * 2);
      ctx.strokeStyle = isRed ? 'rgba(239, 68, 68, 0.65)' : 'rgba(59, 130, 246, 0.65)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // 6C. Inner Solid Core Disk
      const diskGrad = ctx.createRadialGradient(hCoord.x, hCoord.y, 2, hCoord.x, hCoord.y, baseR);
      if (isRed) {
        diskGrad.addColorStop(0, '#4C0519');
        diskGrad.addColorStop(0.7, '#24030B');
        diskGrad.addColorStop(1, '#110105');
      } else {
        diskGrad.addColorStop(0, '#0F2656');
        diskGrad.addColorStop(0.7, '#071536');
        diskGrad.addColorStop(1, '#030A1C');
      }

      ctx.beginPath();
      ctx.arc(hCoord.x, hCoord.y, baseR, 0, Math.PI * 2);
      ctx.fillStyle = diskGrad;
      ctx.fill();

      ctx.strokeStyle = isRed ? '#F43F5E' : '#38BDF8';
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = isRed ? '#F43F5E' : '#38BDF8';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 6D. Tactical Shield Badge Emblem in Center of Hub
      drawShieldBadge(ctx, hCoord.x, hCoord.y, baseR, isRed);

      // 6E. Satellite Child Nodes (Connected by Radial Spokes)
      if (hub.satCount > 0) {
        const satRadius = hub.satR * scaleFactor;

        for (let s = 0; s < hub.satCount; s++) {
          const satAngle = hub.satAngleOffset + (s * (Math.PI * 2 / hub.satCount)) + Math.sin(now * 0.001 + s) * 0.06;
          const sx = hCoord.x + Math.cos(satAngle) * satRadius;
          const sy = hCoord.y + Math.sin(satAngle) * satRadius;

          // Radial connector spoke from hub rim to satellite
          const rimX = hCoord.x + Math.cos(satAngle) * (baseR * 1.22);
          const rimY = hCoord.y + Math.sin(satAngle) * (baseR * 1.22);

          ctx.beginPath();
          ctx.moveTo(rimX, rimY);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = isRed ? 'rgba(244, 63, 94, 0.45)' : 'rgba(56, 189, 248, 0.45)';
          ctx.lineWidth = 1.0;
          ctx.stroke();

          // Outer mini ripple ring on satellite
          ctx.beginPath();
          ctx.arc(sx, sy, 7, 0, Math.PI * 2);
          ctx.strokeStyle = isRed ? 'rgba(251, 113, 133, 0.35)' : 'rgba(56, 189, 248, 0.35)';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Satellite center bead
          ctx.beginPath();
          ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = isRed ? '#F43F5E' : '#38BDF8';
          ctx.shadowBlur = 6;
          ctx.shadowColor = isRed ? '#F43F5E' : '#38BDF8';
          ctx.fill();
          ctx.shadowBlur = 0;

          // Satellite white core dot
          ctx.beginPath();
          ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        }
      }

      // 6F. Mouse Hover Interactive Callout Tag
      if (mouse.isActive && !isMobile) {
        const dx = mouse.x - hCoord.x;
        const dy = mouse.y - hCoord.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < baseR * 1.6) {
          ctx.font = '700 8.5px "Montserrat", monospace, sans-serif';
          ctx.fillStyle = isRed ? '#FDA4AF' : '#BAE6FD';
          ctx.textAlign = 'center';
          ctx.fillText(`[${hub.label}]`, hCoord.x, hCoord.y + baseR + 18);
        }
      }

      ctx.restore();
    }
  }

  // --------------------------------------------------------------------------
  // RENDERER 2: TACTICAL MILITARY RADAR HUD (FOR GENERAL DASHBOARD)
  // --------------------------------------------------------------------------
  function renderStandardHud(now, isMobile, isTablet) {
    const bgGrad = ctx.createRadialGradient(
      width * 0.5 + parallax.x * 2, height * 0.45 + parallax.y * 2, 50,
      width * 0.5, height * 0.45, Math.max(width, height) * 0.8
    );
    bgGrad.addColorStop(0, '#040d24');
    bgGrad.addColorStop(0.5, '#020717');
    bgGrad.addColorStop(1, '#01030a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Cyan Grid Matrix
    const gridSize = isMobile ? 36 : 48;
    const scrollY = (now * 0.012) % gridSize;

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.038)';

    ctx.beginPath();
    for (let gx = 0; gx <= width; gx += gridSize) {
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
    }
    for (let gy = scrollY; gy <= height; gy += gridSize) {
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
    }
    ctx.stroke();

    // Radar Center & Dimensions
    const sidebarWidth = width > 1024 ? 260 : 0;
    const radarCenterX = (width > 1024) 
      ? sidebarWidth + (width - sidebarWidth) * 0.5 + parallax.x 
      : width * 0.5 + parallax.x;
    const radarCenterY = (isMobile ? height * 0.38 : height * 0.45) + parallax.y;
    
    const maxRadarR = isMobile 
      ? Math.min(160, width * 0.44, height * 0.30)
      : (isTablet ? Math.min(220, width * 0.30, height * 0.36) : Math.min(290, width * 0.24, height * 0.42));
    const radarRadius = Math.max(120, maxRadarR);

    ctx.save();
    ctx.translate(radarCenterX, radarCenterY);

    // Radar Rings & Ticks
    const ringTicksR = radarRadius + (isMobile ? 14 : 22);
    ctx.lineWidth = 1;

    for (let deg = 0; deg < 360; deg += 3) {
      const rad = (deg * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      let tickLen = 4;
      let tickColor = 'rgba(0, 240, 255, 0.22)';
      if (deg % 30 === 0) {
        tickLen = 12;
        tickColor = 'rgba(0, 255, 136, 0.85)';
      } else if (deg % 15 === 0) {
        tickLen = 8;
        tickColor = 'rgba(0, 240, 255, 0.65)';
      }

      ctx.beginPath();
      ctx.moveTo(cos * ringTicksR, sin * ringTicksR);
      ctx.lineTo(cos * (ringTicksR + tickLen), sin * (ringTicksR + tickLen));
      ctx.strokeStyle = tickColor;
      ctx.stroke();
    }

    // Outer Border
    const outerBorderR = radarRadius + 6;
    ctx.beginPath();
    ctx.arc(0, 0, outerBorderR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Concentric Range Rings
    for (let rIdx = 1; rIdx <= 4; rIdx++) {
      const ringR = (radarRadius / 4) * rIdx;
      ctx.beginPath();
      ctx.arc(0, 0, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(-radarRadius - 10, 0);
    ctx.lineTo(radarRadius + 10, 0);
    ctx.moveTo(0, -radarRadius - 10);
    ctx.lineTo(0, radarRadius + 10);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.stroke();

    // 360° Rotating Radar Sweep
    radarAngle += radarSweepSpeed;
    if (radarAngle >= Math.PI * 2) radarAngle -= Math.PI * 2;

    const sweepFanAngle = 0.72;
    const sweepGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, radarRadius);
    sweepGrad.addColorStop(0, 'rgba(0, 255, 136, 0.35)');
    sweepGrad.addColorStop(0.45, 'rgba(0, 240, 255, 0.22)');
    sweepGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radarRadius, radarAngle - sweepFanAngle, radarAngle);
    ctx.closePath();
    ctx.fillStyle = sweepGrad;
    ctx.fill();

    // Leading Laser Edge
    const leadX = Math.cos(radarAngle) * (radarRadius + 4);
    const leadY = Math.sin(radarAngle) * (radarRadius + 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leadX, leadY);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // Radar Target Blips
    for (let b = 0; b < radarBlips.length; b++) {
      const blip = radarBlips[b];
      const blipR = blip.rFrac * radarRadius;
      const bx = Math.cos(blip.angle) * blipR;
      const by = Math.sin(blip.angle) * blipR;

      ctx.beginPath();
      ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = blip.status === 'alert' ? '#FF4455' : '#00F0FF';
      ctx.fill();
    }

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // MASTER RENDER LOOP
  // --------------------------------------------------------------------------
  function renderFrame() {
    if (!isRunning || !ctx) return;

    const now = Date.now();
    const isMobile = width <= 768;
    const isTablet = width > 768 && width <= 1024;

    parallax.x += (parallax.targetX - parallax.x) * 0.08;
    parallax.y += (parallax.targetY - parallax.y) * 0.08;

    ctx.clearRect(0, 0, width, height);

    // Route-specific rendering branch
    if (activeRoute === 'link-inspector') {
      renderActivityMap(now, isMobile, isTablet);
    } else {
      renderStandardHud(now, isMobile, isTablet);
    }

    // Interactive EMP Shockwaves on click/tap
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const wave = shockwaves[i];
      wave.radius += wave.speed;
      wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);

      if (wave.radius >= wave.maxRadius || wave.alpha <= 0.01) {
        shockwaves.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.strokeStyle = (activeRoute === 'link-inspector')
        ? `rgba(168, 85, 247, ${wave.alpha * 0.8})`
        : `rgba(0, 240, 255, ${wave.alpha * 0.8})`;
      ctx.lineWidth = 2.0;
      ctx.stroke();
      ctx.restore();
    }

    // Kinetic Cursor Sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i];
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.life -= spark.decay;

      if (spark.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size * spark.life, 0, Math.PI * 2);
      ctx.fillStyle = spark.color;
      ctx.globalAlpha = spark.life * 0.85;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Holographic Cursor HUD Reticle
    if (cursorHud.targetX > -1000 && !isMobile) {
      if (cursorHud.x < -1000) {
        cursorHud.x = cursorHud.targetX;
        cursorHud.y = cursorHud.targetY;
      } else {
        cursorHud.x += (cursorHud.targetX - cursorHud.x) * 0.22;
        cursorHud.y += (cursorHud.targetY - cursorHud.y) * 0.22;
      }

      cursorHud.angle += 0.024;
      cursorHud.alpha = mouse.isActive ? Math.min(1.0, cursorHud.alpha + 0.08) : Math.max(0, cursorHud.alpha - 0.05);

      if (cursorHud.alpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = cursorHud.alpha;

        const reticleColor = (activeRoute === 'link-inspector') ? '#C084FC' : '#00F0FF';
        ctx.strokeStyle = reticleColor;
        ctx.lineWidth = 1.4;

        for (let a = 0; a < 3; a++) {
          const arcStart = cursorHud.angle + a * (Math.PI * 2 / 3);
          ctx.beginPath();
          ctx.arc(cursorHud.x, cursorHud.y, 20, arcStart, arcStart + 0.8);
          ctx.stroke();
        }

        ctx.font = '500 8.5px monospace, sans-serif';
        ctx.fillStyle = reticleColor;
        ctx.fillText(
          `[X: ${Math.round(cursorHud.x)} | Y: ${Math.round(cursorHud.y)} | MODE: ${activeRoute.toUpperCase()}]`,
          cursorHud.x + 32,
          cursorHud.y + 12
        );
        ctx.restore();
      }
    }

    animId = requestAnimationFrame(renderFrame);
  }

  // --------------------------------------------------------------------------
  // LIFECYCLE MANAGEMENT
  // --------------------------------------------------------------------------
  function start() {
    if (isRunning) return;
    if (!canvas) setupCanvas();
    if (!canvas) return;

    canvas.style.display = 'block';
    isRunning = true;
    resize();

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    animId = requestAnimationFrame(renderFrame);
  }

  function stop() {
    if (!isRunning) return;
    isRunning = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    if (canvas) {
      canvas.style.display = 'none';
      if (ctx) ctx.clearRect(0, 0, width, height);
    }
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('click', handleClick);

    document.documentElement.style.removeProperty('--bg-mouse-x');
    document.documentElement.style.removeProperty('--bg-mouse-y');
  }

  function setupCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'cyber-hud-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.display = 'none';
    document.body.prepend(canvas);

    ctx = canvas.getContext('2d');
  }

  function updateThemeState() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      start();
    } else {
      stop();
    }
  }

  function setRoute(routeKey) {
    activeRoute = routeKey || 'overview';
  }

  const CyberHUD = {
    init: function() {
      setupCanvas();
      updateThemeState();

      if (global.CyberShield.State && typeof global.CyberShield.State.subscribe === 'function') {
        global.CyberShield.State.subscribe((type) => {
          if (type === 'preference_changed') {
            updateThemeState();
          }
        });
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          if (m.type === 'attributes' && m.attributeName === 'data-theme') {
            updateThemeState();
          }
        });
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    },

    setRoute: setRoute,

    destroy: function() {
      stop();
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      canvas = null;
      ctx = null;
    }
  };

  global.CyberShield.CyberHUD = CyberHUD;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CyberHUD.init());
  } else {
    CyberHUD.init();
  }

})(typeof window !== 'undefined' ? window : global);
