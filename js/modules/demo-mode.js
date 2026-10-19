/**
 * CyberShield — Exhibition Demo Mode Module
 * Kiosk experience designed for school exhibitions and project showcases.
 * Clean visitor session isolation, 60s inactivity auto-reset timer,
 * quick 3-minute interactive tracks, audio chimes, and certificate generation.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  let demoState = {
    activeTrack: null, // 'sprint' | 'link' | 'message'
    sprintIndex: 0,
    sprintScore: 0,
    sprintAnswers: []
  };

  let idleSecondsLeft = 60;
  let idleIntervalId = null;
  let idleActivityHandler = null;
  let fsChangeHandler = null;

  const DEMO_SPRINT_SCENARIOS = [
    {
      sender: 'Bank Fraud Alert SMS',
      message: 'Unrecognized $480 charge to Merchant-XYZ. Reply with your 6-digit OTP to cancel immediately.',
      choices: [
        { id: 'A', text: 'Reply with the OTP code quickly.', correct: false },
        { id: 'B', text: 'Scam: Banks never ask for OTPs to cancel a charge; call bank via card number.', correct: true }
      ],
      explanation: 'OTPs approve transactions. A scammer needs your OTP to complete their theft.'
    },
    {
      sender: 'Delivery Exception Notice',
      message: 'Package #8819 on hold. Confirm address on: http://paypal.com.account-update.invalid/login',
      choices: [
        { id: 'A', text: 'It has "paypal.com" so it is safe.', correct: false },
        { id: 'B', text: 'Phishing: The real authoritative domain is "account-update.invalid".', correct: true }
      ],
      explanation: 'Always inspect the domain directly preceding the final dot (TLD).'
    },
    {
      sender: 'Discord / Telegram Admin',
      message: 'Exclusive Giveaway! Connect your crypto wallet in the next 10 minutes for 5x guaranteed returns!',
      choices: [
        { id: 'A', text: 'Connect wallet immediately to avoid missing out.', correct: false },
        { id: 'B', text: 'FOMO Drainer: Artificial countdowns trick you into signing malicious contracts.', correct: true }
      ],
      explanation: 'Extreme urgency combined with unrealistic profit promises is the classic drainer scam.'
    }
  ];

  function startIdleTimer(container) {
    stopIdleTimer();
    idleSecondsLeft = 60;

    const resetActivity = () => {
      idleSecondsLeft = 60;
      updateIdleDisplay();
    };

    const updateIdleDisplay = () => {
      const el = document.querySelector('#kiosk-idle-timer');
      if (el) el.textContent = `${idleSecondsLeft}s`;
    };

    idleActivityHandler = resetActivity;
    window.addEventListener('mousemove', resetActivity, { passive: true });
    window.addEventListener('mousedown', resetActivity, { passive: true });
    window.addEventListener('touchstart', resetActivity, { passive: true });
    window.addEventListener('keydown', resetActivity, { passive: true });

    idleIntervalId = setInterval(() => {
      // If user navigated away from demo-mode, cancel idle timer immediately
      const currentRoute = global.CyberShield.State 
        ? global.CyberShield.State.getTransient().currentRoute 
        : 'demo-mode';
      if (currentRoute !== 'demo-mode') {
        stopIdleTimer();
        return;
      }

      idleSecondsLeft -= 1;
      updateIdleDisplay();
      if (idleSecondsLeft <= 0) {
        // Auto-reset kiosk due to visitor leaving!
        stopIdleTimer();
        demoState = { activeTrack: null, sprintIndex: 0, sprintScore: 0, sprintAnswers: [] };
        DemoModeModule.render(container);
        global.CyberShield.Accessibility.announce('Kiosk auto-reset to home due to inactivity.');
      }
    }, 1000);
  }

  function stopIdleTimer() {
    if (idleIntervalId) {
      clearInterval(idleIntervalId);
      idleIntervalId = null;
    }
    if (idleActivityHandler) {
      window.removeEventListener('mousemove', idleActivityHandler);
      window.removeEventListener('mousedown', idleActivityHandler);
      window.removeEventListener('touchstart', idleActivityHandler);
      window.removeEventListener('keydown', idleActivityHandler);
      idleActivityHandler = null;
    }
  }

  const DemoModeModule = {
    cleanup: function() {
      stopIdleTimer();
      if (fsChangeHandler) {
        document.removeEventListener('fullscreenchange', fsChangeHandler);
        fsChangeHandler = null;
      }
    },

    render: function(container) {
      startIdleTimer(container);

      if (demoState.activeTrack === 'sprint') {
        this.renderSprint(container);
      } else if (demoState.activeTrack === 'link') {
        this.renderLinkDemo(container);
      } else if (demoState.activeTrack === 'message') {
        this.renderMessageDemo(container);
      } else {
        this.renderHub(container);
      }
    },

    // ----------------------------------------------------
    // Kiosk Main Hub
    // ----------------------------------------------------
    renderHub: function(container) {
      const getIcon = global.CyberShield.getIcon;
      const isFs = !!document.fullscreenElement;

      container.innerHTML = `
        <!-- High-Contrast Kiosk Banner -->
        <div class="demo-banner">
          <div class="demo-banner-content">
            <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-bottom: var(--space-xs);">
              <span class="badge" style="background: rgba(255, 255, 255, 0.2); color: #FFFFFF;">
                ${getIcon('monitor')} Exhibition Showcase Mode
              </span>
              <span class="badge" style="background: rgba(255, 255, 255, 0.2); color: #FFFFFF;" title="Auto-resets station if user walks away">
                ${getIcon('rotate-ccw')} Auto-reset idle: <strong id="kiosk-idle-timer" style="margin-left: 4px;">60s</strong>
              </span>
            </div>
            <h2>CyberShield Interactive Kiosk</h2>
            <p>Try a 2-minute hands-on challenge. Visitor data is automatically isolated and reset for the next person.</p>
          </div>
          <div style="display: flex; gap: var(--space-sm); align-items: center;">
            <button class="btn btn-secondary btn-sm" id="btn-toggle-fullscreen">
              ${getIcon('maximize')}
              <span id="fs-btn-label">${isFs ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>
            <button class="btn btn-danger btn-sm" id="btn-reset-kiosk">
              ${getIcon('rotate-ccw')}
              <span>Reset Kiosk</span>
            </button>
          </div>
        </div>

        <!-- 3 Exhibition Tracks -->
        <div class="demo-tracks-grid">
          <!-- Track 1: Phishing Sprint -->
          <div class="demo-track-card" id="track-sprint-btn">
            <div>
              <span class="demo-track-num">Track 1 • Interactive Drill</span>
              <h3 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-xs);">
                3-Question Phishing Sprint
              </h3>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); line-height: 1.5;">
                Face 3 quick simulated digital traps and test your scam detection reflexes in under 60 seconds.
              </p>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: var(--space-lg);">
              <span>Start 3-Question Sprint</span>
              ${getIcon('arrow-right')}
            </button>
          </div>

          <!-- Track 2: Live Link Inspector -->
          <div class="demo-track-card" id="track-link-btn">
            <div>
              <span class="demo-track-num">Track 2 • Technical Tool</span>
              <h3 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-xs);">
                Live Link Anatomy Demo
              </h3>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); line-height: 1.5;">
                See how CyberShield deconstructs a deceptive subdomain trick and unmasks the real server locally.
              </p>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: var(--space-lg);">
              <span>Inspect Sample Link</span>
              ${getIcon('arrow-right')}
            </button>
          </div>

          <!-- Track 3: Message Analyzer -->
          <div class="demo-track-card" id="track-message-btn">
            <div>
              <span class="demo-track-num">Track 3 • Social Engineering</span>
              <h3 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); margin-bottom: var(--space-xs);">
                Message Red-Flag Scanner
              </h3>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); line-height: 1.5;">
                Test a simulated OTP-theft SMS and see transparent keyword rule highlights in action.
              </p>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: var(--space-lg);">
              <span>Analyze Sample Message</span>
              ${getIcon('arrow-right')}
            </button>
          </div>
        </div>

        <!-- Exhibition Key Takeaways Card -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Exhibition Takeaway: 3 Golden Rules of Online Safety</span>
          </div>
          <div class="card-body">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-md);">
              <div style="background-color: var(--color-bg-subtle); padding: var(--space-md); border-radius: var(--radius-md);">
                <div style="color: var(--color-primary); font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); margin-bottom: 4px;">
                  1. Pause on Panic
                </div>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin: 0;">
                  If a message claims you will be arrested, fined, or blocked within minutes, it is manufactured emotional manipulation.
                </p>
              </div>

              <div style="background-color: var(--color-bg-subtle); padding: var(--space-md); border-radius: var(--radius-md);">
                <div style="color: var(--color-primary); font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); margin-bottom: 4px;">
                  2. Read URLs Right-to-Left
                </div>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin: 0;">
                  Always check the authoritative domain directly before the final dot. Subdomains can contain any brand name.
                </p>
              </div>

              <div style="background-color: var(--color-bg-subtle); padding: var(--space-md); border-radius: var(--radius-md);">
                <div style="color: var(--color-primary); font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); margin-bottom: 4px;">
                  3. Verify Independently
                </div>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin: 0;">
                  Never use phone numbers or links inside the message. Look up the official contact info yourself.
                </p>
              </div>
            </div>
          </div>
        </div>
      `;

      this.attachHubEvents(container);
    },

    attachHubEvents: function(container) {
      container.querySelector('#track-sprint-btn').addEventListener('click', () => {
        demoState.activeTrack = 'sprint';
        demoState.sprintIndex = 0;
        demoState.sprintScore = 0;
        demoState.sprintAnswers = [];
        this.render(container);
      });

      container.querySelector('#track-link-btn').addEventListener('click', () => {
        demoState.activeTrack = 'link';
        this.render(container);
      });

      container.querySelector('#track-message-btn').addEventListener('click', () => {
        demoState.activeTrack = 'message';
        this.render(container);
      });

      container.querySelector('#btn-reset-kiosk').addEventListener('click', () => {
        demoState = { activeTrack: null, sprintIndex: 0, sprintScore: 0, sprintAnswers: [] };
        this.render(container);
        global.CyberShield.Accessibility.announce('Kiosk session reset for next visitor.');
      });

      const fsBtn = container.querySelector('#btn-toggle-fullscreen');
      if (fsBtn) {
        fsBtn.addEventListener('click', () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(e => {
              console.warn('Fullscreen request denied by browser:', e);
            });
          } else {
            document.exitFullscreen().catch(e => {});
          }
        });
      }

      if (!fsChangeHandler) {
        fsChangeHandler = () => {
          const fsLabel = document.querySelector('#fs-btn-label');
          if (fsLabel) {
            fsLabel.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
          }
        };
        document.addEventListener('fullscreenchange', fsChangeHandler);
      }
    },

    // ----------------------------------------------------
    // Sprint Flow
    // ----------------------------------------------------
    renderSprint: function(container) {
      const getIcon = global.CyberShield.getIcon;
      const total = DEMO_SPRINT_SCENARIOS.length;

      if (demoState.sprintIndex >= total) {
        // Sprint Results
        const pct = Math.round((demoState.sprintScore / total) * 100);
        container.innerHTML = `
          <div class="demo-kiosk-box">
            <div style="text-align: center;">
              <span class="badge badge-brand" style="margin-bottom: var(--space-sm);">Demo Sprint Finished</span>
              <div class="score-circle-display">
                <span class="score-num">${pct}%</span>
                <span class="score-label">Score</span>
              </div>
              <h2 style="font-size: var(--font-size-xl); margin-bottom: var(--space-xs);">
                ${demoState.sprintScore === 3 ? 'Outstanding! 3/3 Correct' : `${demoState.sprintScore} of 3 Correct`}
              </h2>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-xl);">
                Thank you for trying CyberShield! Remember to always inspect domain names and never share OTPs.
              </p>

              <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-secondary btn-lg" id="btn-sprint-cert">
                  ${getIcon('award')}
                  <span>Get Defense Certificate</span>
                </button>
                <button class="btn btn-primary btn-lg" id="btn-next-visitor">
                  ${getIcon('rotate-ccw')}
                  <span>Next Visitor / Return to Kiosk</span>
                </button>
              </div>
            </div>
          </div>
        `;

        container.querySelector('#btn-sprint-cert').addEventListener('click', () => {
          if (global.CyberShield.Certificate) {
            global.CyberShield.Certificate.openModal({ accuracy: pct });
          }
        });

        container.querySelector('#btn-next-visitor').addEventListener('click', () => {
          demoState = { activeTrack: null, sprintIndex: 0, sprintScore: 0, sprintAnswers: [] };
          this.render(container);
        });
        return;
      }

      const q = DEMO_SPRINT_SCENARIOS[demoState.sprintIndex];
      container.innerHTML = `
        <div class="demo-kiosk-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
            <div style="display: flex; gap: var(--space-xs); align-items: center;">
              <span class="badge badge-brand">Sprint Question ${demoState.sprintIndex + 1} of ${total}</span>
              <span class="badge badge-neutral">Auto-reset: <strong id="kiosk-idle-timer" style="margin-left: 2px;">60s</strong></span>
            </div>
            <button class="btn btn-quiet btn-sm" id="btn-exit-sprint">Exit to Kiosk</button>
          </div>

          <div class="scenario-box">
            <div class="scenario-sender">
              <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">From:</span>
              <span class="sender-badge">${q.sender}</span>
            </div>
            <div class="scenario-message-bubble">${q.message}</div>
          </div>

          <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-md);">
            What is the safest action?
          </h3>

          <div class="choices-list" id="sprint-choices">
            ${q.choices.map(c => `
              <button class="choice-card sprint-choice-btn" data-choice-id="${c.id}" data-correct="${c.correct}">
                <span class="choice-key">${c.id}</span>
                <span class="choice-text">${c.text}</span>
              </button>
            `).join('')}
          </div>

          <div id="sprint-feedback" style="display: none; margin-top: var(--space-md);"></div>
        </div>
      `;

      container.querySelector('#btn-exit-sprint').addEventListener('click', () => {
        demoState.activeTrack = null;
        this.render(container);
      });

      const choices = container.querySelectorAll('.sprint-choice-btn');
      const feedback = container.querySelector('#sprint-feedback');

      choices.forEach(btn => {
        btn.addEventListener('click', () => {
          choices.forEach(c => c.disabled = true);
          const isCorrect = btn.dataset.correct === 'true';
          if (isCorrect) {
            demoState.sprintScore += 1;
            btn.classList.add('correct');
            if (global.CyberShield.Sound) global.CyberShield.Sound.playSuccess();
          } else {
            btn.classList.add('incorrect');
            if (global.CyberShield.Sound) global.CyberShield.Sound.playWarning();
            // Highlight correct one
            choices.forEach(c => {
              if (c.dataset.correct === 'true') c.classList.add('correct');
            });
          }

          feedback.innerHTML = `
            <div class="alert ${isCorrect ? 'alert-success' : 'alert-caution'}">
              <div class="alert-content">
                <div class="alert-title">${isCorrect ? 'Correct Decision!' : 'Unsafe Choice'}</div>
                <div class="alert-message">${q.explanation}</div>
              </div>
            </div>
            <button class="btn btn-primary" id="btn-sprint-next" style="width: 100%; margin-top: var(--space-sm);">
              ${demoState.sprintIndex + 1 < total ? 'Next Scenario' : 'View Results'} ${getIcon('arrow-right')}
            </button>
          `;
          feedback.style.display = 'block';

          feedback.querySelector('#btn-sprint-next').addEventListener('click', () => {
            demoState.sprintIndex += 1;
            this.renderSprint(container);
          });
        });
      });
    },

    // ----------------------------------------------------
    // Live Link Demo
    // ----------------------------------------------------
    renderLinkDemo: function(container) {
      const getIcon = global.CyberShield.getIcon;
      const sampleUrl = 'http://paypal.com.account-update.invalid/login';
      const parsed = global.CyberShield.UrlParser.parse(sampleUrl);
      const evalRes = global.CyberShield.UrlRules.evaluate(parsed);
      const result = global.CyberShield.EvidenceAggregator.aggregateUrlResult(evalRes);

      container.innerHTML = `
        <div class="demo-kiosk-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
            <div style="display: flex; gap: var(--space-xs); align-items: center;">
              <span class="badge badge-purple">Track 2: Link Anatomy Inspection</span>
              <span class="badge badge-neutral">Auto-reset: <strong id="kiosk-idle-timer" style="margin-left: 2px;">60s</strong></span>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-back-kiosk">Back to Kiosk</button>
          </div>

          <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--space-xs);">
            Sample Phishing Link Deconstruction
          </h2>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-md);">
            Notice how attackers craft misleading subdomains to fool users into trusting their links.
          </p>

          <div style="background-color: var(--color-bg-subtle); padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-family-mono); font-size: var(--font-size-sm); margin-bottom: var(--space-lg); word-break: break-all;">
            ${sampleUrl}
          </div>

          <div class="url-anatomy-grid" style="margin-bottom: var(--space-lg);">
            <div class="anatomy-item">
              <span class="anatomy-label">Scheme</span>
              <span class="anatomy-value">${parsed.scheme} (Unencrypted)</span>
            </div>
            <div class="anatomy-item" style="border: 2px solid var(--color-warning);">
              <span class="anatomy-label" style="color: var(--color-warning);">Authoritative Domain</span>
              <span class="anatomy-value" style="color: var(--color-warning);">${parsed.registrableDomain}</span>
            </div>
            <div class="anatomy-item">
              <span class="anatomy-label">Deceptive Subdomain</span>
              <span class="anatomy-value">${parsed.subdomain}</span>
            </div>
          </div>

          <div class="alert alert-warning" style="margin-bottom: var(--space-lg);">
            <div class="alert-icon">${getIcon('alert-triangle')}</div>
            <div class="alert-content">
              <div class="alert-title">Verdict: High Concern</div>
              <div class="alert-message">
                The authentic domain is "account-update.invalid". The word "paypal.com" is merely a deceitful subdomain created by an attacker!
              </div>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-return-kiosk-2" style="width: 100%;">
            Next Visitor / Return to Kiosk
          </button>
        </div>
      `;

      container.querySelector('#btn-back-kiosk').addEventListener('click', () => {
        demoState.activeTrack = null;
        this.render(container);
      });
      container.querySelector('#btn-return-kiosk-2').addEventListener('click', () => {
        demoState.activeTrack = null;
        this.render(container);
      });
    },

    // ----------------------------------------------------
    // Live Message Demo
    // ----------------------------------------------------
    renderMessageDemo: function(container) {
      const sampleText = 'BANK ALERT: A transaction of $480.00 is pending. If this was NOT you, reply immediately with the 6-digit OTP code to cancel within 10 minutes.';
      const evalRes = global.CyberShield.MessageRules.evaluate(sampleText);
      const result = global.CyberShield.EvidenceAggregator.aggregateMessageResult(evalRes);
      const getIcon = global.CyberShield.getIcon;

      container.innerHTML = `
        <div class="demo-kiosk-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
            <div style="display: flex; gap: var(--space-xs); align-items: center;">
              <span class="badge badge-caution">Track 3: Message Scanner</span>
              <span class="badge badge-neutral">Auto-reset: <strong id="kiosk-idle-timer" style="margin-left: 2px;">60s</strong></span>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-back-kiosk-3">Back to Kiosk</button>
          </div>

          <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--space-xs);">
            Sample Social Engineering Analysis
          </h2>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-md);">
            Transparent rules match urgency triggers and credential harvesting phrases without sending text to the cloud.
          </p>

          <div class="highlighted-text-box" style="margin-bottom: var(--space-lg);">
            ${global.CyberShield.MessageAnalyzerModule.generateHighlightedHtml(sampleText, evalRes.highlightRanges)}
          </div>

          <div class="alert alert-warning" style="margin-bottom: var(--space-lg);">
            <div class="alert-icon">${getIcon('alert-triangle')}</div>
            <div class="alert-content">
              <div class="alert-title">Verdict: High Concern (${evalRes.matches.length} Red Flags Triggered)</div>
              <div class="alert-message">
                Detected Direct OTP Request and Artificial Urgency. Banks NEVER ask for OTPs to cancel a charge.
              </div>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-return-kiosk-3" style="width: 100%;">
            Next Visitor / Return to Kiosk
          </button>
        </div>
      `;

      container.querySelector('#btn-back-kiosk-3').addEventListener('click', () => {
        demoState.activeTrack = null;
        this.render(container);
      });
      container.querySelector('#btn-return-kiosk-3').addEventListener('click', () => {
        demoState.activeTrack = null;
        this.render(container);
      });
    }
  };

  global.CyberShield.DemoModeModule = DemoModeModule;
})(window);
