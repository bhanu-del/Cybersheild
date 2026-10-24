/**
 * CyberShield — Interactive Cyber HUD & Particle Telemetry Engine
 * Activated STRICTLY in Dark Mode ([data-theme="dark"]).
 * Dormant and hidden in Light Mode ([data-theme="light"]).
 * 
 * Features:
 * 1. Interactive Cyber Mesh & Threat Nodes that dynamically react to mouse cursor.
 * 2. Rotating Radar Sonar Sweep beam inspired by Military / SOC Threat Monitors.
 * 3. Dynamic Background Spotlight & Card Neon Glare that follows the mouse pointer.
 * 4. Holographic Cursor HUD Reticle with live coordinate telemetry in background.
 * 5. Dynamic Background Grid Crosshair Illumination near cursor.
 * 6. Click/Tap Electromagnetic (EMP) Shockwave Pulse Rings that repulse nodes.
 * 7. Particle velocity spark trails following swift cursor movements.
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

  // Real-time raw mouse coordinates & speed
  const mouse = {
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    speed: 0,
    radius: 200,
    isActive: false
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
  const MAX_SPARKS = 28;

  function getNodeCount() {
    return (window.innerWidth <= 768) ? 22 : 55;
  }

  const nodes = [];
  const colors = ['#00F0FF', '#00FF88', '#38BDF8', '#818CF8', '#00E5FF'];

  // Radar sweep angle
  let radarAngle = 0;

  function initNodes() {
    nodes.length = 0;
    const count = getNodeCount();
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        radius: Math.random() * 2.0 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.03 + Math.random() * 0.03
      });
    }
  }

  function resize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function updateSpotlights(clientX, clientY) {
    // 1. Update background matrix spotlight on root
    document.documentElement.style.setProperty('--bg-mouse-x', `${clientX}px`);
    document.documentElement.style.setProperty('--bg-mouse-y', `${clientY}px`);

    // 2. Update dynamic card spotlight positions across visible cards
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

    cursorHud.targetX = e.clientX;
    cursorHud.targetY = e.clientY;

    updateSpotlights(e.clientX, e.clientY);

    // Spawn subtle kinetic sparks on swift cursor motions
    if (mouse.speed > 4.5 && sparks.length < MAX_SPARKS) {
      sparks.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        life: 1.0,
        decay: 0.035 + Math.random() * 0.02,
        color: Math.random() > 0.4 ? '#00F0FF' : '#00FF88',
        size: Math.random() * 1.8 + 1.0
      });
    }
  }

  function handleMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
    mouse.isActive = false;
    mouse.speed = 0;
  }

  function handleTouchStart(e) {
    if (!e.touches || !e.touches[0]) return;
    const touch = e.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
    mouse.isActive = true;
    cursorHud.targetX = touch.clientX;
    cursorHud.targetY = touch.clientY;
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
    updateSpotlights(mouse.x, mouse.y);
  }

  function handleTouchEnd() {
    mouse.isActive = false;
    mouse.x = -9999;
    mouse.y = -9999;
  }

  function triggerShockwave(x, y) {
    shockwaves.push({
      x: x,
      y: y,
      radius: 12,
      maxRadius: Math.min(260, width * 0.6),
      speed: 6.8,
      alpha: 0.85
    });

    // Physically push nearby background nodes away with kinetic recoil
    for (let i = 0; i < nodes.length; i++) {
      const dx = nodes[i].x - x;
      const dy = nodes[i].y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 220 && dist > 1) {
        const force = (220 - dist) / 220 * 4.2;
        nodes[i].vx += (dx / dist) * force;
        nodes[i].vy += (dy / dist) * force;
      }
    }
  }

  function handleClick(e) {
    if (!isRunning) return;
    triggerShockwave(e.clientX, e.clientY);
  }

  function renderFrame() {
    if (!isRunning || !ctx) return;

    ctx.clearRect(0, 0, width, height);

    // ----------------------------------------------------
    // 1. Draw Rotating Holographic Radar in background
    // ----------------------------------------------------
    const isMobile = width <= 768;
    const radarCenterX = isMobile ? width / 2 : width - 180;
    const radarCenterY = isMobile ? 120 : 180;
    const radarRadius = isMobile ? 75 : 140;

    ctx.save();
    ctx.strokeStyle = isMobile ? 'rgba(0, 240, 255, 0.05)' : 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;

    // Radar concentric rings
    const ringStep = isMobile ? 25 : 35;
    for (let r = ringStep; r <= radarRadius; r += ringStep) {
      ctx.beginPath();
      ctx.arc(radarCenterX, radarCenterY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radar crosshair lines
    ctx.beginPath();
    ctx.moveTo(radarCenterX - radarRadius, radarCenterY);
    ctx.lineTo(radarCenterX + radarRadius, radarCenterY);
    ctx.moveTo(radarCenterX, radarCenterY - radarRadius);
    ctx.lineTo(radarCenterX, radarCenterY + radarRadius);
    ctx.stroke();

    // Rotating Scanner Beam
    radarAngle += 0.018;
    const beamX = radarCenterX + Math.cos(radarAngle) * radarRadius;
    const beamY = radarCenterY + Math.sin(radarAngle) * radarRadius;

    const beamGrad = ctx.createRadialGradient(radarCenterX, radarCenterY, 5, radarCenterX, radarCenterY, radarRadius);
    beamGrad.addColorStop(0, 'rgba(0, 255, 136, 0.25)');
    beamGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.12)');
    beamGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

    ctx.beginPath();
    ctx.moveTo(radarCenterX, radarCenterY);
    ctx.arc(radarCenterX, radarCenterY, radarRadius, radarAngle - 0.35, radarAngle);
    ctx.closePath();
    ctx.fillStyle = beamGrad;
    ctx.fill();

    // Leading beam line
    ctx.beginPath();
    ctx.moveTo(radarCenterX, radarCenterY);
    ctx.lineTo(beamX, beamY);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // ----------------------------------------------------
    // 2. Interactive Background Grid Proximity Crosshairs
    // ----------------------------------------------------
    if (mouse.isActive && !isMobile) {
      const gridSize = 72; // Snap to cyber grid multiples
      const startX = Math.floor((mouse.x - 220) / gridSize) * gridSize;
      const endX = Math.ceil((mouse.x + 220) / gridSize) * gridSize;
      const startY = Math.floor((mouse.y - 220) / gridSize) * gridSize;
      const endY = Math.ceil((mouse.y + 220) / gridSize) * gridSize;

      for (let gx = startX; gx <= endX; gx += gridSize) {
        for (let gy = startY; gy <= endY; gy += gridSize) {
          const dx = gx - mouse.x;
          const dy = gy - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 220) {
            const alpha = (1 - dist / 220) * 0.32;
            const arm = 3.5;

            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 1;

            // Draw small cyber grid cross '+'
            ctx.beginPath();
            ctx.moveTo(gx - arm, gy);
            ctx.lineTo(gx + arm, gy);
            ctx.moveTo(gx, gy - arm);
            ctx.lineTo(gx, gy + arm);
            ctx.stroke();

            // Connect subtle vector thread if very close
            if (dist < 110) {
              const threadAlpha = (1 - dist / 110) * 0.18;
              ctx.beginPath();
              ctx.moveTo(gx, gy);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(0, 240, 255, ${threadAlpha})`;
              ctx.stroke();
            }
          }
        }
      }
    }

    // ----------------------------------------------------
    // 3. Draw Active EMP Shockwaves & Click Ripples
    // ----------------------------------------------------
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const wave = shockwaves[i];
      wave.radius += wave.speed;
      wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);

      if (wave.radius >= wave.maxRadius || wave.alpha <= 0.01) {
        shockwaves.splice(i, 1);
        continue;
      }

      ctx.save();
      // Outer cyan shockwave ring
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 240, 255, ${wave.alpha * 0.7})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Inner emerald echo ring
      if (wave.radius > 20) {
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius * 0.75, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 136, ${wave.alpha * 0.45})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();
    }

    // ----------------------------------------------------
    // 4. Draw Nodes & Interconnecting Cyber Mesh
    // ----------------------------------------------------
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      // Update position with dampening
      node.x += node.vx;
      node.y += node.vy;
      node.vx *= 0.985;
      node.vy *= 0.985;

      // Maintain baseline ambient velocity
      if (Math.abs(node.vx) < 0.25) node.vx += (Math.random() - 0.5) * 0.1;
      if (Math.abs(node.vy) < 0.25) node.vy += (Math.random() - 0.5) * 0.1;

      // Wrap around screen boundaries
      if (node.x < 0) node.x = width;
      if (node.x > width) node.x = 0;
      if (node.y < 0) node.y = height;
      if (node.y > height) node.y = 0;

      // Mouse attraction/repulsion reaction
      if (mouse.isActive) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 1) {
          const force = (mouse.radius - dist) / mouse.radius;
          node.x += (dx / dist) * force * 1.8;
          node.y += (dy / dist) * force * 1.8;

          // Connect laser line directly to mouse cursor
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${force * 0.5})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Animated energy pulse on laser line
          const progress = (Date.now() % 1000) / 1000;
          const pulseX = node.x + (mouse.x - node.x) * progress;
          const pulseY = node.y + (mouse.y - node.y) * progress;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#00FF88';
          ctx.fill();
        }
      }

      // Connect lines between nearby nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeB = nodes[j];
        const dx = node.x - nodeB.x;
        const dy = node.y - nodeB.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.22;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Pulse node glow
      node.pulse += node.pulseSpeed;
      const currentRadius = node.radius + Math.sin(node.pulse) * 0.8;

      ctx.beginPath();
      ctx.arc(node.x, node.y, Math.max(1, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = node.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // ----------------------------------------------------
    // 5. Kinetic Cursor Sparks & Trail
    // ----------------------------------------------------
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
      ctx.globalAlpha = spark.life * 0.8;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // ----------------------------------------------------
    // 6. Holographic Cursor HUD Reticle in Background
    // ----------------------------------------------------
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

        // Ambient Flashlight Aura
        const auraGrad = ctx.createRadialGradient(cursorHud.x, cursorHud.y, 0, cursorHud.x, cursorHud.y, 160);
        auraGrad.addColorStop(0, 'rgba(0, 240, 255, 0.16)');
        auraGrad.addColorStop(0.4, 'rgba(0, 102, 255, 0.06)');
        auraGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.beginPath();
        ctx.arc(cursorHud.x, cursorHud.y, 160, 0, Math.PI * 2);
        ctx.fillStyle = auraGrad;
        ctx.fill();

        // Rotating Segmented HUD Reticle Ring (radius 24px)
        const reticleRadius = 24;
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 1.5;

        for (let a = 0; a < 3; a++) {
          const arcStart = cursorHud.angle + a * (Math.PI * 2 / 3);
          ctx.beginPath();
          ctx.arc(cursorHud.x, cursorHud.y, reticleRadius, arcStart, arcStart + 0.8);
          ctx.stroke();
        }

        // Inner targeting crosshair ticks
        const tick = 6;
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cursorHud.x - tick, cursorHud.y);
        ctx.lineTo(cursorHud.x + tick, cursorHud.y);
        ctx.moveTo(cursorHud.x, cursorHud.y - tick);
        ctx.lineTo(cursorHud.x, cursorHud.y + tick);
        ctx.stroke();

        // 4 Tactical Brackets [  ]
        const bSize = 34;
        const bLen = 6;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
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

        // Real-Time Coordinate Telemetry Text
        ctx.font = '500 9px monospace, sans-serif';
        ctx.fillStyle = 'rgba(0, 240, 255, 0.65)';
        ctx.fillText(
          `[X: ${Math.round(cursorHud.x)} | Y: ${Math.round(cursorHud.y)} | DEFENSE: ACTIVE]`,
          cursorHud.x + 38,
          cursorHud.y + 14
        );

        ctx.restore();
      }
    }

    animId = requestAnimationFrame(renderFrame);
  }

  function start() {
    if (isRunning) return;
    if (!canvas) {
      setupCanvas();
    }
    if (!canvas) return;

    canvas.style.display = 'block';
    isRunning = true;
    resize();
    initNodes();

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

    // Reset root CSS variables so no leftover spotlight remains
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

      // Listen for theme preference changes
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
