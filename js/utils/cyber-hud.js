/**
 * CyberShield — Military SOC & Tactical Radar Defense Engine
 * Inspired by Tactical Command Center HUDs & Reference Telemetry Architecture.
 * 
 * STRICT MODE ISOLATION:
 * - Active ONLY when documentElement has [data-theme="dark"].
 * - Completely dormant, hidden, and zero CPU usage in [data-theme="light"].
 * 
 * CORE FEATURES:
 * 1. Giant Central Tactical Radar HUD with 360° degree calibration, concentric range rings, and polar coordinates.
 * 2. Continuous 360° Rotating Radar Sweep with leading neon laser and trailing illuminated conical phosphor fan.
 * 3. Dynamic Threat Blips with phosphor decay, ping ripples, and tactical identity tags upon sweep contact.
 * 4. Left Telemetry Array: Animated Audio / Frequency Oscilloscope waveform + jumping Equalizer Spectrum bars + System status box.
 * 5. Bottom-Left Global Threat Vector Matrix: Vector world map with international cyber hubs and traveling laser arcs.
 * 6. Right Telemetry Array: Live scrolling security packet stream and secondary telemetry monitors.
 * 7. Bottom-Right Holographic Cyber Shield: Multi-layered glowing neon shield with internal chevron facets and vertical scanlines.
 * 8. Interactive Parallax 3D Cockpit Tilt that responds to mouse movements.
 * 9. Holographic Cursor HUD Reticle with live coordinate telemetry in background.
 * 10. Click/Tap Electromagnetic (EMP) shockwave ripple rings.
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

  // Radar geometry and state
  let radarAngle = 0;
  const radarSweepSpeed = 0.016; // ~5 seconds per revolution

  // Pre-seeded radar threat/asset blips
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

  // Frequency spectrum equalizer bars
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

  // Live packet log stream lines
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

  // Global map nodes and international attack/defense laser arcs
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

    const cards = document.querySelectorAll('.card, .quick-tool-card, .metric-card, .ai-verdict-card, .lesson-card, .hero-banner');
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

    // Smooth Parallax Target
    parallax.targetX = ((e.clientX - width / 2) / (width / 2)) * 16;
    parallax.targetY = ((e.clientY - height / 2) / (height / 2)) * 14;

    cursorHud.targetX = e.clientX;
    cursorHud.targetY = e.clientY;

    updateSpotlights(e.clientX, e.clientY);

    // Spawn subtle kinetic sparks on swift cursor motions
    if (mouse.speed > 5.0 && sparks.length < MAX_SPARKS) {
      sparks.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.5) * 2.2,
        life: 1.0,
        decay: 0.038 + Math.random() * 0.02,
        color: Math.random() > 0.4 ? '#00F0FF' : '#00FF88',
        size: Math.random() * 2.0 + 1.0
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
    parallax.targetX = ((touch.clientX - width / 2) / (width / 2)) * 10;
    parallax.targetY = ((touch.clientY - height / 2) / (height / 2)) * 10;
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
    parallax.targetX = ((touch.clientX - width / 2) / (width / 2)) * 10;
    parallax.targetY = ((touch.clientY - height / 2) / (height / 2)) * 10;
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
      radius: 10,
      maxRadius: Math.min(280, width * 0.6),
      speed: 7.2,
      alpha: 0.9
    });
  }

  function handleClick(e) {
    if (!isRunning) return;
    triggerShockwave(e.clientX, e.clientY);
  }

  // Helper to draw tech corner brackets [  ]
  function drawCornerBrackets(ctx, x, y, w, h, size, color) {
    ctx.save();
    ctx.strokeStyle = color || 'rgba(0, 240, 255, 0.55)';
    ctx.lineWidth = 1.2;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(x + size, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + size);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(x + w - size, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + size);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(x + size, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + h - size);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(x + w - size, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w, y + h - size);
    ctx.stroke();

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // 1. MAIN RENDER LOOP
  // --------------------------------------------------------------------------
  function renderFrame() {
    if (!isRunning || !ctx) return;

    const now = Date.now();
    const isMobile = width <= 768;
    const isTablet = width > 768 && width <= 1024;

    // Smooth parallax interpolation
    parallax.x += (parallax.targetX - parallax.x) * 0.08;
    parallax.y += (parallax.targetY - parallax.y) * 0.08;

    // Clear entire frame
    ctx.clearRect(0, 0, width, height);

    // ------------------------------------------------------------------------
    // LAYER 0: Ambient Cyber Nebula & Subtle Matrix Grid
    // ------------------------------------------------------------------------
    ctx.save();
    // Deep gradient fill
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
    ctx.restore();

    // ------------------------------------------------------------------------
    // LAYER 1: TACTICAL RADAR CENTER DISPLAY (Exact Match to Reference Image)
    // ------------------------------------------------------------------------
    // Determine Radar Center Position
    // Desktop: Horizontally offset to comfortably frame content (or centered across main wrapper)
    const sidebarWidth = width > 1024 ? 260 : 0;
    const radarCenterX = (width > 1024) 
      ? sidebarWidth + (width - sidebarWidth) * 0.5 + parallax.x 
      : width * 0.5 + parallax.x;
    const radarCenterY = (isMobile ? height * 0.38 : height * 0.45) + parallax.y;
    
    // Calculate radius
    const maxRadarR = isMobile 
      ? Math.min(160, width * 0.44, height * 0.30)
      : (isTablet ? Math.min(220, width * 0.30, height * 0.36) : Math.min(290, width * 0.24, height * 0.42));
    const radarRadius = Math.max(120, maxRadarR);

    ctx.save();
    ctx.translate(radarCenterX, radarCenterY);

    // 1A. Radar Outer Ambient Glow
    const radarAura = ctx.createRadialGradient(0, 0, radarRadius * 0.7, 0, 0, radarRadius * 1.25);
    radarAura.addColorStop(0, 'rgba(0, 240, 255, 0.07)');
    radarAura.addColorStop(0.7, 'rgba(0, 102, 255, 0.04)');
    radarAura.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = radarAura;
    ctx.beginPath();
    ctx.arc(0, 0, radarRadius * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // 1B. Outermost Compass Bearing Calibration Ring (Degree Tick Marks)
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

      // Degree Numbers at 30° intervals on desktop
      if (!isMobile && deg % 30 === 0) {
        const textR = ringTicksR + 20;
        ctx.font = '600 8.5px "Montserrat", monospace, sans-serif';
        ctx.fillStyle = 'rgba(0, 240, 255, 0.65)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const degText = deg.toString().padStart(3, '0') + '°';
        ctx.fillText(degText, cos * textR, sin * textR);
      }
    }

    // 1C. Outer Segmented Ring with Corner HUD Brackets
    const outerBorderR = radarRadius + 6;
    ctx.beginPath();
    ctx.arc(0, 0, outerBorderR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Segmented dashed outer ring
    ctx.beginPath();
    ctx.arc(0, 0, outerBorderR + 4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.35)';
    ctx.setLineDash([12, 18]);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // 4 Corner HUD Crosshairs around Radar
    const bDist = outerBorderR + 14;
    const bArm = 10;
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.5;
    [
      { x: -bDist, y: -bDist, sx: 1, sy: 1 },
      { x: bDist, y: -bDist, sx: -1, sy: 1 },
      { x: -bDist, y: bDist, sx: 1, sy: -1 },
      { x: bDist, y: bDist, sx: -1, sy: -1 }
    ].forEach(c => {
      ctx.beginPath();
      ctx.moveTo(c.x, c.y + c.sy * bArm);
      ctx.lineTo(c.x, c.y);
      ctx.lineTo(c.x + c.sx * bArm, c.y);
      ctx.stroke();
    });

    // 1D. Concentric Distance Range Rings (4-5 rings)
    const numRings = 4;
    for (let rIdx = 1; rIdx <= numRings; rIdx++) {
      const ringR = (radarRadius / numRings) * rIdx;
      ctx.beginPath();
      ctx.arc(0, 0, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = (rIdx === numRings) 
        ? 'rgba(0, 240, 255, 0.35)' 
        : 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Range calibration distance labels
      if (!isMobile && rIdx > 0) {
        ctx.font = '500 8px monospace, sans-serif';
        ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
        ctx.textAlign = 'left';
        ctx.fillText(`${rIdx * 25}KM`, 5, -ringR + 9);
      }
    }

    // Secondary intermediate dotted ring
    ctx.beginPath();
    ctx.arc(0, 0, radarRadius * 0.62, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 1E. Polar Coordinate Radial Rays (every 30°)
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.10)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * radarRadius, Math.sin(a) * radarRadius);
      ctx.stroke();
    }

    // 1F. Main Horizontal & Vertical Axis Crosshairs with Center Reticle
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';

    // Horizontal axis
    ctx.beginPath();
    ctx.moveTo(-radarRadius - 10, 0);
    ctx.lineTo(radarRadius + 10, 0);
    ctx.stroke();

    // Vertical axis
    ctx.beginPath();
    ctx.moveTo(0, -radarRadius - 10);
    ctx.lineTo(0, radarRadius + 10);
    ctx.stroke();

    // Small tick marks along horizontal & vertical axes
    const axisTickStep = 24;
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.6)';
    for (let d = -radarRadius; d <= radarRadius; d += axisTickStep) {
      if (Math.abs(d) > 10) {
        ctx.beginPath();
        ctx.moveTo(d, -3);
        ctx.lineTo(d, 3);
        ctx.moveTo(-3, d);
        ctx.lineTo(3, d);
        ctx.stroke();
      }
    }

    // 1G. Center Glowing Core Dot & Nucleus Aura
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 16);
    coreGrad.addColorStop(0, '#FFFFFF');
    coreGrad.addColorStop(0.3, '#00F0FF');
    coreGrad.addColorStop(0.7, 'rgba(0, 102, 255, 0.4)');
    coreGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // 1H. 360° Rotating Radar Sweep Beam & Trailing Phosphor Cone
    radarAngle += radarSweepSpeed;
    if (radarAngle >= Math.PI * 2) {
      radarAngle -= Math.PI * 2;
    }

    // Trailing Illuminated Conical Wedge (~42 degrees)
    const sweepFanAngle = 0.72; // ~41.2 degrees
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

    // Leading High-Intensity Laser Beam
    const leadCos = Math.cos(radarAngle);
    const leadSin = Math.sin(radarAngle);
    const leadX = leadCos * (radarRadius + 4);
    const leadY = leadSin * (radarRadius + 4);

    const beamLineGrad = ctx.createLinearGradient(0, 0, leadX, leadY);
    beamLineGrad.addColorStop(0, '#FFFFFF');
    beamLineGrad.addColorStop(0.2, '#00FF88');
    beamLineGrad.addColorStop(1, '#00F0FF');

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leadX, leadY);
    ctx.strokeStyle = beamLineGrad;
    ctx.lineWidth = 2.0;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#00F0FF';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Glowing tip bead at leading edge
    ctx.beginPath();
    ctx.arc(leadX, leadY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // 1I. Tactical Threat / Asset Target Blips
    for (let b = 0; b < radarBlips.length; b++) {
      const blip = radarBlips[b];
      const blipR = blip.rFrac * radarRadius;
      const bx = Math.cos(blip.angle) * blipR;
      const by = Math.sin(blip.angle) * blipR;

      // Angular distance between radar sweep and blip
      let diff = radarAngle - blip.angle;
      while (diff < 0) diff += Math.PI * 2;
      while (diff >= Math.PI * 2) diff -= Math.PI * 2;

      // When the sweep passes over the blip
      if (diff < 0.08 && (now - blip.lastSwept) > 1000) {
        blip.lastSwept = now;
        blip.pingR = 2;
      }

      // Calculate phosphor decay (persists for ~2.5 seconds after sweep)
      const elapsed = now - blip.lastSwept;
      const isFresh = elapsed < 2600;
      const decayAlpha = isFresh ? Math.max(0.25, 1.0 - (elapsed / 2600)) : 0.22;

      const isAlert = blip.status === 'alert';
      const mainColor = isAlert ? '#FF4455' : '#00F0FF';
      const glowColor = isAlert ? 'rgba(255, 68, 85, ' : 'rgba(0, 240, 255, ';

      // Draw Expanding Ping Ripple Ring
      if (blip.pingR > 0 && blip.pingR < 32) {
        blip.pingR += 0.9;
        const ringAlpha = Math.max(0, 1.0 - blip.pingR / 32) * 0.85;
        ctx.beginPath();
        ctx.arc(bx, by, blip.pingR, 0, Math.PI * 2);
        ctx.strokeStyle = glowColor + ringAlpha + ')';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // Draw Blip Node
      ctx.beginPath();
      ctx.arc(bx, by, isFresh ? 3.2 : 2.2, 0, Math.PI * 2);
      ctx.fillStyle = isFresh ? '#FFFFFF' : mainColor;
      ctx.shadowBlur = isFresh ? 14 : 6;
      ctx.shadowColor = mainColor;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Target Label Callout if freshly swept or hovered
      if (!isMobile && (isFresh && elapsed < 1800)) {
        ctx.font = '600 7.5px "Montserrat", monospace, sans-serif';
        ctx.fillStyle = glowColor + (decayAlpha * 0.9) + ')';
        ctx.textAlign = 'left';
        ctx.fillText(`[${blip.label}]`, bx + 6, by + 3);
      }
    }

    ctx.restore(); // Restore radar center transform

    // ------------------------------------------------------------------------
    // LAYER 2: LEFT TELEMETRY SUITE (Oscilloscope, Equalizer, System Status)
    // ------------------------------------------------------------------------
    if (!isMobile) {
      const leftX = (width > 1200) ? 285 + parallax.x * 0.7 : 20 + parallax.x * 0.7;
      const leftY = 85 + parallax.y * 0.7;
      const leftW = Math.min(210, width * 0.20);

      // 2A. Frequency Oscilloscope Telemetry Box
      const oscH = 75;
      drawCornerBrackets(ctx, leftX, leftY, leftW, oscH, 8, 'rgba(0, 240, 255, 0.45)');

      // Box Title
      ctx.font = '600 8px "Montserrat", monospace, sans-serif';
      ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
      ctx.textAlign = 'left';
      ctx.fillText('// FREQ MONITOR [CH-01]', leftX + 8, leftY + 12);

      // Oscilloscope Sine Wave
      ctx.save();
      ctx.beginPath();
      const waveMidY = leftY + 44;
      const t = now * 0.0035;

      for (let x = 0; x <= leftW - 16; x += 2) {
        const wx = leftX + 8 + x;
        const wy = waveMidY + 
          Math.sin(t * 2.2 + x * 0.065) * 11 + 
          Math.sin(t * 1.4 + x * 0.025) * 6;
        if (x === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }

      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 1.4;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00F0FF';
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // 2B. Dynamic Equalizer Spectrum Analyzer Bars
      const eqY = leftY + oscH + 14;
      const eqH = 80;
      drawCornerBrackets(ctx, leftX, eqY, leftW, eqH, 8, 'rgba(0, 240, 255, 0.35)');

      ctx.font = '600 8px "Montserrat", monospace, sans-serif';
      ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';
      ctx.textAlign = 'left';
      ctx.fillText('// TELEMETRY SPECTRUM', leftX + 8, eqY + 12);

      const barPadding = 3;
      const availW = leftW - 20;
      const barW = Math.floor((availW - (NUM_EQ_BARS - 1) * barPadding) / NUM_EQ_BARS);
      const barBaseY = eqY + eqH - 12;
      const maxBarH = 46;

      for (let b = 0; b < NUM_EQ_BARS; b++) {
        const bar = eqBars[b];
        // Jitter bar heights naturally
        if (Math.random() < 0.08) {
          bar.targetHeight = Math.random() * 0.8 + 0.15;
        }
        bar.height += (bar.targetHeight - bar.height) * bar.speed;

        // Peak hold decay
        if (bar.height > bar.peak) {
          bar.peak = bar.height;
        } else {
          bar.peak = Math.max(bar.height, bar.peak - 0.008);
        }

        const bx = leftX + 10 + b * (barW + barPadding);
        const bh = bar.height * maxBarH;
        const by = barBaseY - bh;

        // Gradient for bar
        const barGrad = ctx.createLinearGradient(bx, barBaseY, bx, by);
        barGrad.addColorStop(0, '#0055FF');
        barGrad.addColorStop(0.7, '#00F0FF');
        barGrad.addColorStop(1, '#00FF88');

        ctx.fillStyle = barGrad;
        ctx.fillRect(bx, by, barW, bh);

        // Peak dot
        const peakY = barBaseY - bar.peak * maxBarH - 2;
        ctx.fillStyle = '#00FF88';
        ctx.fillRect(bx, peakY, barW, 1.5);
      }

      // 2C. Tactical System Status Readout Box
      const statY = eqY + eqH + 14;
      const statH = 88;
      drawCornerBrackets(ctx, leftX, statY, leftW, statH, 8, 'rgba(0, 240, 255, 0.35)');

      ctx.font = '600 8px "Montserrat", monospace, sans-serif';
      ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
      ctx.fillText('// SYSTEM INTEGRITY', leftX + 8, statY + 12);

      const statusLines = [
        { label: 'RADAR SWEEP', val: '360° ACTIVE', col: '#00FF88' },
        { label: 'FREQ BAND', val: '14.8 GHz SECURE', col: '#00F0FF' },
        { label: 'SENTINEL AI', val: 'MONITORING', col: '#00FF88' },
        { label: 'SOC DEFENSE', val: 'LEVEL 1 ARMED', col: '#00F0FF' }
      ];

      statusLines.forEach((item, idx) => {
        const lineY = statY + 28 + idx * 14;
        ctx.font = '500 7.5px monospace, sans-serif';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.textAlign = 'left';
        ctx.fillText(item.label + ':', leftX + 8, lineY);

        ctx.font = '700 7.5px monospace, sans-serif';
        ctx.fillStyle = item.col;
        ctx.textAlign = 'right';
        ctx.fillText(item.val, leftX + leftW - 8, lineY);
      });
    }

    // ------------------------------------------------------------------------
    // LAYER 3: BOTTOM-LEFT GLOBAL THREAT VECTOR MATRIX (World Map & Arcs)
    // ------------------------------------------------------------------------
    if (width > 900) {
      const mapX = (width > 1200) ? 285 + parallax.x * 0.6 : 20 + parallax.x * 0.6;
      const mapW = Math.min(240, width * 0.22);
      const mapH = 110;
      const mapY = height - mapH - 24 + parallax.y * 0.6;

      drawCornerBrackets(ctx, mapX, mapY, mapW, mapH, 8, 'rgba(0, 240, 255, 0.4)');

      ctx.font = '600 8px "Montserrat", monospace, sans-serif';
      ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
      ctx.textAlign = 'left';
      ctx.fillText('// GLOBAL THREAT VECTOR MATRIX', mapX + 8, mapY + 12);

      // Stylized Dot-Matrix Continent Silhouettes
      const mapInnerX = mapX + 12;
      const mapInnerY = mapY + 20;
      const mapInnerW = mapW - 24;
      const mapInnerH = mapH - 30;

      // Draw faint dot grid for world map
      ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
      const stepX = mapInnerW / 24;
      const stepY = mapInnerH / 12;

      for (let mx = 0; mx < 24; mx++) {
        for (let my = 0; my < 12; my++) {
          // Approximate world continent density map
          const isLand = (
            (mx >= 2 && mx <= 7 && my >= 2 && my <= 5) || // North America
            (mx >= 4 && mx <= 7 && my >= 6 && my <= 10) || // South America
            (mx >= 11 && mx <= 14 && my >= 2 && my <= 4) || // Europe
            (mx >= 11 && mx <= 15 && my >= 5 && my <= 9) || // Africa
            (mx >= 15 && mx <= 21 && my >= 2 && my <= 6) || // Asia
            (mx >= 19 && mx <= 22 && my >= 8 && my <= 11)   // Australia
          );

          if (isLand) {
            ctx.beginPath();
            ctx.arc(mapInnerX + mx * stepX, mapInnerY + my * stepY, 1.0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw Traveling Laser Arcs between Global Hubs
      for (let a = 0; a < mapArcs.length; a++) {
        const arc = mapArcs[a];
        arc.progress += arc.speed;
        if (arc.progress > 1) arc.progress = 0;

        const n1 = mapNodes[arc.from];
        const n2 = mapNodes[arc.to];

        const x1 = mapInnerX + n1.x * mapInnerW;
        const y1 = mapInnerY + n1.y * mapInnerH;
        const x2 = mapInnerX + n2.x * mapInnerW;
        const y2 = mapInnerY + n2.y * mapInnerH;

        // Arc baseline
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Traveling energy bead
        const beadX = x1 + (x2 - x1) * arc.progress;
        const beadY = y1 + (y2 - y1) * arc.progress;

        ctx.beginPath();
        ctx.arc(beadX, beadY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#00FF88';
        ctx.fill();
      }

      // Draw World Hub Nodes
      for (let n = 0; n < mapNodes.length; n++) {
        const node = mapNodes[n];
        node.pulse += 0.05;
        const nx = mapInnerX + node.x * mapInnerW;
        const ny = mapInnerY + node.y * mapInnerH;

        // Pulsing ring
        const pR = 2.5 + Math.sin(node.pulse) * 1.5;
        ctx.beginPath();
        ctx.arc(nx, ny, pR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.7)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(nx, ny, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = '#00F0FF';
        ctx.fill();
      }
    }

    // ------------------------------------------------------------------------
    // LAYER 4: RIGHT TELEMETRY SUITE (Live Packet Stream & Security Terminal)
    // ------------------------------------------------------------------------
    if (width > 1100) {
      const rightW = Math.min(230, width * 0.18);
      const rightX = width - rightW - 24 + parallax.x * 0.7;
      const rightY = 85 + parallax.y * 0.7;
      const streamH = 150;

      drawCornerBrackets(ctx, rightX, rightY, rightW, streamH, 8, 'rgba(0, 240, 255, 0.45)');

      ctx.font = '600 8px "Montserrat", monospace, sans-serif';
      ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
      ctx.textAlign = 'left';
      ctx.fillText('// PACKET INSPECTOR STREAM', rightX + 8, rightY + 12);

      // Simulated Smooth Code Stream
      logScrollOffset += 0.25;
      const lineHeight = 16;
      const totalContentH = packetLogs.length * lineHeight;
      if (logScrollOffset > totalContentH) logScrollOffset = 0;

      ctx.save();
      // Clip to stream container
      ctx.beginPath();
      ctx.rect(rightX + 6, rightY + 18, rightW - 12, streamH - 24);
      ctx.clip();

      for (let p = 0; p < packetLogs.length * 2; p++) {
        const log = packetLogs[p % packetLogs.length];
        const py = rightY + 32 + p * lineHeight - logScrollOffset;

        if (py >= rightY + 16 && py <= rightY + streamH) {
          ctx.font = '500 7px monospace, sans-serif';
          ctx.fillStyle = (p % 3 === 0) ? '#00FF88' : 'rgba(0, 240, 255, 0.75)';
          ctx.fillText(log.text, rightX + 8, py);
        }
      }
      ctx.restore();
    }

    // ------------------------------------------------------------------------
    // LAYER 5: BOTTOM-RIGHT HOLOGRAPHIC CYBER DEFENSE SHIELD (Exact Reference Match)
    // ------------------------------------------------------------------------
    if (!isMobile) {
      const shieldBoxW = 160;
      const shieldBoxH = 125;
      const shieldBoxX = width - shieldBoxW - 24 + parallax.x * 0.6;
      const shieldBoxY = height - shieldBoxH - 24 + parallax.y * 0.6;

      drawCornerBrackets(ctx, shieldBoxX, shieldBoxY, shieldBoxW, shieldBoxH, 8, 'rgba(0, 240, 255, 0.45)');

      ctx.font = '600 8px "Montserrat", monospace, sans-serif';
      ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
      ctx.textAlign = 'center';
      ctx.fillText('CYBERSHIELD DEFENSE', shieldBoxX + shieldBoxW / 2, shieldBoxY + 12);

      // Holographic Neon Shield Icon
      const scx = shieldBoxX + shieldBoxW / 2;
      const scy = shieldBoxY + 66;
      const sw = 38;
      const sh = 46;

      ctx.save();
      // Outer Shield Path
      ctx.beginPath();
      ctx.moveTo(scx, scy - sh);
      ctx.lineTo(scx + sw, scy - sh * 0.6);
      ctx.lineTo(scx + sw, scy + sh * 0.1);
      ctx.bezierCurveTo(scx + sw, scy + sh * 0.6, scx + sw * 0.4, scy + sh * 0.85, scx, scy + sh);
      ctx.bezierCurveTo(scx - sw * 0.4, scy + sh * 0.85, scx - sw, scy + sh * 0.6, scx - sw, scy + sh * 0.1);
      ctx.lineTo(scx - sw, scy - sh * 0.6);
      ctx.closePath();

      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#00F0FF';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner Layer Shield Path
      const isw = sw * 0.72;
      const ish = sh * 0.72;
      ctx.beginPath();
      ctx.moveTo(scx, scy - ish);
      ctx.lineTo(scx + isw, scy - ish * 0.6);
      ctx.lineTo(scx + isw, scy + ish * 0.1);
      ctx.bezierCurveTo(scx + isw, scy + ish * 0.6, scx + isw * 0.4, scy + ish * 0.85, scx, scy + ish);
      ctx.bezierCurveTo(scx - isw * 0.4, scy + ish * 0.85, scx - isw, scy + ish * 0.6, scx - isw, scy + ish * 0.1);
      ctx.lineTo(scx - isw, scy - ish * 0.6);
      ctx.closePath();

      ctx.strokeStyle = 'rgba(0, 255, 136, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Inner Chevron Core Line
      ctx.beginPath();
      ctx.moveTo(scx, scy - ish * 0.7);
      ctx.lineTo(scx, scy + ish * 0.75);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Vertical Laser Scanline passing through the Shield
      const scanPeriod = sh * 2.2;
      const scanOffset = ((now * 0.04) % scanPeriod) - sh;
      const scanY = scy + scanOffset;

      ctx.beginPath();
      ctx.moveTo(scx - sw * 0.85, scanY);
      ctx.lineTo(scx + sw * 0.85, scanY);
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.9)';
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00FF88';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Shield Core Glowing Dot
      ctx.beginPath();
      ctx.arc(scx, scy + 4, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.restore();
    }

    // ------------------------------------------------------------------------
    // LAYER 6: INTERACTIVE MOUSE HUD & KINETIC EFFECTS
    // ------------------------------------------------------------------------
    // 6A. Draw Active EMP Shockwaves from Clicks
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
      ctx.strokeStyle = `rgba(0, 240, 255, ${wave.alpha * 0.75})`;
      ctx.lineWidth = 2.0;
      ctx.stroke();

      if (wave.radius > 20) {
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius * 0.75, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 136, ${wave.alpha * 0.45})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 6B. Draw Kinetic Cursor Sparks
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

    // 6C. Holographic Cursor HUD Reticle
    if (cursorHud.targetX > -1000) {
      if (cursorHud.x < -1000) {
        cursorHud.x = cursorHud.targetX;
        cursorHud.y = cursorHud.targetY;
      } else {
        cursorHud.x += (cursorHud.targetX - cursorHud.x) * 0.22;
        cursorHud.y += (cursorHud.targetY - cursorHud.y) * 0.22;
      }

      cursorHud.angle += 0.024;
      if (mouse.isActive) {
        cursorHud.alpha = Math.min(1.0, cursorHud.alpha + 0.08);
      } else {
        cursorHud.alpha = Math.max(0, cursorHud.alpha - 0.05);
      }

      if (cursorHud.alpha > 0.01 && !isMobile) {
        ctx.save();
        ctx.globalAlpha = cursorHud.alpha;

        // Ambient Spotlight Aura
        const auraGrad = ctx.createRadialGradient(cursorHud.x, cursorHud.y, 0, cursorHud.x, cursorHud.y, 160);
        auraGrad.addColorStop(0, 'rgba(0, 240, 255, 0.16)');
        auraGrad.addColorStop(0.4, 'rgba(0, 102, 255, 0.06)');
        auraGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.beginPath();
        ctx.arc(cursorHud.x, cursorHud.y, 160, 0, Math.PI * 2);
        ctx.fillStyle = auraGrad;
        ctx.fill();

        // Rotating Segmented HUD Reticle
        const reticleRadius = 22;
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 1.4;

        for (let a = 0; a < 3; a++) {
          const arcStart = cursorHud.angle + a * (Math.PI * 2 / 3);
          ctx.beginPath();
          ctx.arc(cursorHud.x, cursorHud.y, reticleRadius, arcStart, arcStart + 0.8);
          ctx.stroke();
        }

        // Inner crosshair ticks
        const tick = 6;
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.85)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cursorHud.x - tick, cursorHud.y);
        ctx.lineTo(cursorHud.x + tick, cursorHud.y);
        ctx.moveTo(cursorHud.x, cursorHud.y - tick);
        ctx.lineTo(cursorHud.x, cursorHud.y + tick);
        ctx.stroke();

        // 4 Tactical Brackets [  ]
        const bSize = 32;
        const bLen = 6;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
        ctx.lineWidth = 1;

        // Top-Left [
        ctx.beginPath();
        ctx.moveTo(cursorHud.x - bSize + bLen, cursorHud.y - bSize);
        ctx.lineTo(cursorHud.x - bSize, cursorHud.y - bSize);
        ctx.lineTo(cursorHud.x - bSize, cursorHud.y - bSize + bLen);
        ctx.stroke();

        // Top-Right ]
        ctx.beginPath();
        ctx.moveTo(cursorHud.x + bSize - bLen, cursorHud.y - bSize);
        ctx.lineTo(cursorHud.x + bSize, cursorHud.y - bSize);
        ctx.lineTo(cursorHud.x + bSize, cursorHud.y - bSize + bLen);
        ctx.stroke();

        // Bottom-Left [
        ctx.beginPath();
        ctx.moveTo(cursorHud.x - bSize + bLen, cursorHud.y + bSize);
        ctx.lineTo(cursorHud.x - bSize, cursorHud.y + bSize);
        ctx.lineTo(cursorHud.x - bSize, cursorHud.y + bSize - bLen);
        ctx.stroke();

        // Bottom-Right ]
        ctx.beginPath();
        ctx.moveTo(cursorHud.x + bSize - bLen, cursorHud.y + bSize);
        ctx.lineTo(cursorHud.x + bSize, cursorHud.y + bSize);
        ctx.lineTo(cursorHud.x + bSize, cursorHud.y + bSize - bLen);
        ctx.stroke();

        // Real-Time Coordinate Telemetry Readout
        ctx.font = '500 8.5px monospace, sans-serif';
        ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
        ctx.fillText(
          `[X: ${Math.round(cursorHud.x)} | Y: ${Math.round(cursorHud.y)} | SOC: ACTIVE]`,
          cursorHud.x + 36,
          cursorHud.y + 12
        );

        ctx.restore();
      }
    }

    // Schedule next frame
    animId = requestAnimationFrame(renderFrame);
  }

  // --------------------------------------------------------------------------
  // LIFECYCLE & EVENT HANDLERS
  // --------------------------------------------------------------------------
  function start() {
    if (isRunning) return;
    if (!canvas) {
      setupCanvas();
    }
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

  const CyberHUD = {
    init: function() {
      setupCanvas();
      updateThemeState();

      // Listen for theme preference changes in CyberShield.State
      if (global.CyberShield.State && typeof global.CyberShield.State.subscribe === 'function') {
        global.CyberShield.State.subscribe((type) => {
          if (type === 'preference_changed') {
            updateThemeState();
          }
        });
      }

      // Also observe data-theme attribute on documentElement
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          if (m.type === 'attributes' && m.attributeName === 'data-theme') {
            updateThemeState();
          }
        });
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    },

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

  // Auto-init on DOMContentLoaded if DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CyberHUD.init());
  } else {
    CyberHUD.init();
  }

})(typeof window !== 'undefined' ? window : global);
