/**
 * CyberShield — Overview Dashboard Module (Smooth, Soft & Minimalist)
 * Designed for calm clarity, zero visual clutter ("hotch-potch free"):
 * 1. Soft Hero Greeting with an elegant 3-metric stats ribbon.
 * 2. Sleek Spotlight Scanner with 4 curated real-world presets.
 * 3. Calm state by default — results only slide in gracefully when scanned.
 * 4. Exactly 3 soft primary tool cards (Link Inspector, Message Analyzer, Awareness Arena).
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const OverviewModule = {
    render: function(container) {
      const state = global.CyberShield.State;
      const derived = state.getDerivedStats();
      const getIcon = global.CyberShield.getIcon;
      const prefs = state.getData().preferences || {};
      const isHinglish = prefs.language === 'hinglish';

      const accuracyDisplay = derived.overallAccuracyPct !== null ? `${derived.overallAccuracyPct}%` : '—';
      const allExamples = global.CyberShield.FastShowcaseScanner 
        ? global.CyberShield.FastShowcaseScanner.getExamples() 
        : [];

      // Select top 4 most common real-world scenarios for India to prevent visual overload
      const topPresets = allExamples.slice(0, 4);

      container.innerHTML = `
        <div class="soft-dashboard-container">
          <!-- 1. Soft Header with Calm Greeting & Minimalist Stats Ribbon -->
          <div class="soft-header-row">
            <div class="soft-greeting">
              <div class="soft-status-pill">
                <span class="soft-dot"></span>
                <span>${isHinglish ? 'CyberShield Lab • Offline Active' : 'CyberShield Command • Offline Engine'}</span>
              </div>
              <h1 class="soft-title">
                ${isHinglish ? 'CyberShield Security Space' : 'CyberShield Security Hub'}
              </h1>
              <p class="soft-subtitle">
                ${isHinglish 
                  ? 'Local transparent forensics aur interactive simulation se phishing & cyber fraud se bachein.' 
                  : 'Proactive scam analysis, transparent URL forensics, and offline security simulations.'}
              </p>
            </div>

            <!-- Soft 3-Metric Stats Ribbon -->
            <div class="soft-stats-ribbon" aria-label="Key Performance Metrics">
              <div class="soft-stat-item">
                <span class="soft-stat-val">${accuracyDisplay}</span>
                <span class="soft-stat-lbl">${isHinglish ? 'Accuracy' : 'Accuracy'}</span>
              </div>
              <div class="soft-stat-divider" aria-hidden="true"></div>
              <div class="soft-stat-item">
                <span class="soft-stat-val">${derived.totalRounds}</span>
                <span class="soft-stat-lbl">${isHinglish ? 'Rounds' : 'Rounds'}</span>
              </div>
              <div class="soft-stat-divider" aria-hidden="true"></div>
              <div class="soft-stat-item">
                <span class="soft-stat-val">${derived.completedLessonsCount}/7</span>
                <span class="soft-stat-lbl">${isHinglish ? 'Lessons' : 'Lessons'}</span>
              </div>
            </div>
          </div>

          <!-- 2. Sleek Spotlight Scanner (Centerpiece) -->
          <div class="soft-search-card" id="spotlight-scanner-section">
            <div class="soft-search-bar">
              <span class="soft-search-icon" aria-hidden="true">${getIcon('search')}</span>
              <input 
                type="text" 
                id="spotlight-input" 
                class="soft-search-input" 
                placeholder="${isHinglish ? 'Koi bhi suspicious link, fake SMS, WhatsApp offer ya call scenario paste karein...' : 'Paste any suspicious URL, fake SMS, WhatsApp text, or fraud scenario to inspect...'}" 
                aria-label="Universal security scanner input"
                autocomplete="off"
              />
              <button type="button" class="soft-search-clear-btn" id="btn-spotlight-clear" aria-label="Clear input" style="display: none;">
                ${getIcon('x')}
              </button>
              <button type="button" class="btn btn-primary btn-sm soft-search-submit" id="btn-spotlight-inspect">
                <span>${isHinglish ? 'Inspect' : 'Inspect'}</span>
              </button>
            </div>

            <!-- 4 Clean, Gentle Preset Pills -->
            <div class="soft-presets-row">
              <span class="soft-presets-label">${isHinglish ? 'Quick Tests:' : 'Quick Tests:'}</span>
              <div class="soft-presets-pills">
                ${topPresets.map(preset => `
                  <button type="button" class="soft-preset-pill" data-preset-id="${preset.id}">
                    <span class="preset-name">${preset.title}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Result or Calm Guide Area -->
            <div id="spotlight-result-area" class="soft-result-area" aria-live="polite">
              <!-- Default: Soft, Calm Empty State (No 50-line wall of text!) -->
              <div class="soft-empty-guide">
                <div class="soft-guide-icon">${getIcon('shield-check')}</div>
                <div class="soft-guide-text">
                  <span class="soft-guide-title">
                    ${isHinglish ? 'Instant Local Threat Triage' : 'Instant Security Diagnosis'}
                  </span>
                  <span class="soft-guide-desc">
                    ${isHinglish 
                      ? 'Upar diye gaye kisi bhi example par click karein ya message paste karke turant Problem aur Solution dekhein.' 
                      : 'Click any scenario above or paste a message to inspect spotted red flags and get an immediate action checklist.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Primary Security Tools Grid (Exactly 3 Soft Cards) -->
          <div class="soft-tools-section">
            <div class="soft-section-title">
              ${isHinglish ? 'Primary Security Tools' : 'Primary Security Tools'}
            </div>

            <div class="soft-tools-grid">
              <!-- Tool 1: Link Inspector -->
              <div class="soft-tool-card" id="card-launch-link">
                <div class="soft-tool-icon blue">${getIcon('link')}</div>
                <div class="soft-tool-content">
                  <h3 class="soft-tool-title">${isHinglish ? 'Link Inspector' : 'Link Inspector'}</h3>
                  <p class="soft-tool-desc">
                    ${isHinglish 
                      ? 'Suspicious URLs, domain spoofs aur QR codes ko safely deconstruct karein.' 
                      : 'Deconstruct suspicious URLs, domain spoofs & QR codes safely before clicking.'}
                  </p>
                  <div class="soft-tool-link blue">
                    <span>${isHinglish ? 'Open Inspector' : 'Open Inspector'}</span>
                    ${getIcon('arrow-right', 'icon-inline')}
                  </div>
                </div>
              </div>

              <!-- Tool 2: Message Analyzer -->
              <div class="soft-tool-card" id="card-launch-message">
                <div class="soft-tool-icon amber">${getIcon('message-square')}</div>
                <div class="soft-tool-content">
                  <h3 class="soft-tool-title">${isHinglish ? 'Message Analyzer' : 'Message Analyzer'}</h3>
                  <p class="soft-tool-desc">
                    ${isHinglish 
                      ? 'SMS, emails aur WhatsApp texts me fake OTP demands aur extortion pakdein.' 
                      : 'Scan SMS, emails or WhatsApp texts to detect social-engineering traps & fake OTPs.'}
                  </p>
                  <div class="soft-tool-link amber">
                    <span>${isHinglish ? 'Analyze Text' : 'Analyze Text'}</span>
                    ${getIcon('arrow-right', 'icon-inline')}
                  </div>
                </div>
              </div>

              <!-- Tool 3: Awareness Arena -->
              <div class="soft-tool-card" id="card-launch-arena">
                <div class="soft-tool-icon green">${getIcon('gamepad')}</div>
                <div class="soft-tool-content">
                  <h3 class="soft-tool-title">${isHinglish ? 'Awareness Arena' : 'Awareness Arena'}</h3>
                  <p class="soft-tool-desc">
                    ${isHinglish 
                      ? 'Interactive challenge rounds khel kar real-life fraud detection seekhein.' 
                      : 'Sharpen your scam-detection reflexes across 3 realistic difficulty tiers.'}
                  </p>
                  <div class="soft-tool-link green">
                    <span>${isHinglish ? 'Start Practice' : 'Start Practice'}</span>
                    ${getIcon('arrow-right', 'icon-inline')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      this.attachEvents(container);
    },

    /**
     * Executes the scan and renders the smooth, soft result card
     */
    runScan: function(container, rawText) {
      const getIcon = global.CyberShield.getIcon;
      const resultArea = container.querySelector('#spotlight-result-area');
      if (!resultArea) return;

      if (!rawText || !rawText.trim()) {
        this.renderEmptyState(resultArea);
        return;
      }

      if (!global.CyberShield.FastShowcaseScanner) {
        resultArea.innerHTML = `<div class="alert alert-danger">Scanner engine not initialized.</div>`;
        return;
      }

      let res;
      try {
        res = global.CyberShield.FastShowcaseScanner.analyze(rawText);
      } catch (err) {
        resultArea.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
        return;
      }

      const isThreat = res.verdict === 'HIGH_RISK';
      const isSuspicious = res.verdict === 'SUSPICIOUS';
      const verdictClass = isThreat ? 'threat' : (isSuspicious ? 'suspicious' : 'safe');

      // Check for embedded link to offer a direct 1-click forensic jump
      const urlRegex = /\bhttps?:\/\/[^\s<>"'{}|\\^`]+[^\s<>"'{}|\\^`.,;:?!()\[\]]/gi;
      const extractedUrls = rawText.match(urlRegex) || [];
      const hasUrl = extractedUrls.length > 0;
      const firstUrl = hasUrl ? extractedUrls[0] : '';

      resultArea.innerHTML = `
        <div class="soft-report-card ${verdictClass}">
          <!-- Top Header Row -->
          <div class="soft-report-header">
            <div class="soft-report-verdict">
              <span class="soft-verdict-pill ${verdictClass}">
                ${isThreat ? getIcon('alert-triangle') : (isSuspicious ? getIcon('info') : getIcon('check-circle'))}
                <span>${res.verdictLabel}</span>
              </span>
              <span class="soft-report-category">${res.category}</span>
            </div>

            <div class="soft-report-actions">
              <span class="soft-score-pill ${verdictClass}">Threat Score: ${res.riskScore}/100</span>
              <button type="button" class="soft-close-btn" id="btn-close-report" title="Close report">
                ${getIcon('x')}
              </button>
            </div>
          </div>

          <!-- Dual Column: 🚨 The Problem vs 🛡️ The Solution -->
          <div class="soft-report-grid">
            <!-- Column 1: The Problem -->
            <div class="soft-problem-col">
              <div class="soft-col-header red">
                <span class="soft-col-icon">${getIcon('alert-circle')}</span>
                <h4>1. 🚨 What is Dangerous (The Problem)</h4>
              </div>
              <p class="soft-summary-text">${res.problem.summary}</p>
              
              <div class="soft-bullet-block">
                <span class="soft-block-label red">Spotted Red Flags:</span>
                <ul class="soft-bullets-list">
                  ${res.problem.redFlags.map(rf => `
                    <li><span class="soft-bullet-dot red"></span><span>${rf}</span></li>
                  `).join('')}
                </ul>
              </div>

              ${res.problem.mechanism ? `
                <div class="soft-mechanism-note">
                  <strong>Attack Method:</strong> ${res.problem.mechanism}
                </div>
              ` : ''}
            </div>

            <!-- Column 2: The Solution -->
            <div class="soft-solution-col">
              <div class="soft-col-header green">
                <span class="soft-col-icon">${getIcon('shield-check')}</span>
                <h4>2. 🛡️ What to Do (The Solution)</h4>
              </div>

              <div class="soft-bullet-block">
                <span class="soft-block-label green">Immediate Action Checklist:</span>
                <ol class="soft-steps-list">
                  ${res.solution.immediateSteps.map(step => `
                    <li><span class="soft-step-chk">✓</span><span>${step}</span></li>
                  `).join('')}
                </ol>
              </div>

              <div class="soft-verification-note">
                <strong>Official Verification:</strong> ${res.solution.officialVerification}
              </div>

              <!-- Quick Action & 1930 Helpline Row -->
              <div class="soft-helpline-row">
                <span class="soft-helpline-pill">SOS: National Helpline 1930</span>
                ${hasUrl ? `
                  <button type="button" class="btn btn-primary btn-sm btn-jump-link" data-url="${encodeURIComponent(firstUrl)}">
                    ${getIcon('link')}
                    <span>Inspect Link in Forensics</span>
                  </button>
                ` : `
                  <button type="button" class="btn btn-secondary btn-sm btn-jump-msg">
                    ${getIcon('message-square')}
                    <span>Analyze in Message Tool</span>
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>
      `;

      // Wire close report button
      const closeBtn = resultArea.querySelector('#btn-close-report');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          const inputEl = container.querySelector('#spotlight-input');
          if (inputEl) inputEl.value = '';
          const clearBtn = container.querySelector('#btn-spotlight-clear');
          if (clearBtn) clearBtn.style.display = 'none';
          this.renderEmptyState(resultArea);
        });
      }

      // Wire deep dive button
      const router = global.CyberShield.Router;
      const jumpLinkBtn = resultArea.querySelector('.btn-jump-link');
      if (jumpLinkBtn) {
        jumpLinkBtn.addEventListener('click', () => {
          const u = decodeURIComponent(jumpLinkBtn.dataset.url || '');
          router.navigate('link-inspector');
          setTimeout(() => {
            if (global.CyberShield.LinkInspectorModule && typeof global.CyberShield.LinkInspectorModule.inspectUrl === 'function') {
              global.CyberShield.LinkInspectorModule.inspectUrl(u);
            }
          }, 120);
        });
      }

      const jumpMsgBtn = resultArea.querySelector('.btn-jump-msg');
      if (jumpMsgBtn) {
        jumpMsgBtn.addEventListener('click', () => {
          router.navigate('message-analyzer');
          setTimeout(() => {
            const msgInput = document.querySelector('#message-input');
            const btnAnalyze = document.querySelector('#btn-analyze-message');
            if (msgInput) {
              msgInput.value = rawText;
              if (btnAnalyze) btnAnalyze.click();
            }
          }, 120);
        });
      }
    },

    renderEmptyState: function(resultArea) {
      const state = global.CyberShield.State;
      const getIcon = global.CyberShield.getIcon;
      const prefs = state.getData().preferences || {};
      const isHinglish = prefs.language === 'hinglish';

      resultArea.innerHTML = `
        <div class="soft-empty-guide">
          <div class="soft-guide-icon">${getIcon('shield-check')}</div>
          <div class="soft-guide-text">
            <span class="soft-guide-title">
              ${isHinglish ? 'Instant Local Threat Triage' : 'Instant Security Diagnosis'}
            </span>
            <span class="soft-guide-desc">
              ${isHinglish 
                ? 'Upar diye gaye kisi bhi example par click karein ya message paste karke turant Problem aur Solution dekhein.' 
                : 'Click any scenario above or paste a message to inspect spotted red flags and get an immediate action checklist.'}
            </span>
          </div>
        </div>
      `;
    },

    attachEvents: function(container) {
      const router = global.CyberShield.Router;

      const bindClick = (id, route) => {
        const el = container.querySelector('#' + id);
        if (el) {
          el.addEventListener('click', () => router.navigate(route));
        }
      };

      bindClick('card-launch-arena', 'arena');
      bindClick('card-launch-link', 'link-inspector');
      bindClick('card-launch-message', 'message-analyzer');

      const input = container.querySelector('#spotlight-input');
      const inspectBtn = container.querySelector('#btn-spotlight-inspect');
      const clearBtn = container.querySelector('#btn-spotlight-clear');
      const presetButtons = container.querySelectorAll('.soft-preset-pill');
      const allExamples = global.CyberShield.FastShowcaseScanner 
        ? global.CyberShield.FastShowcaseScanner.getExamples() 
        : [];

      // Input changes toggle clear button visibility
      if (input && clearBtn) {
        input.addEventListener('input', () => {
          clearBtn.style.display = input.value.trim() ? 'flex' : 'none';
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.runScan(container, input.value);
          }
        });
      }

      // Inspect button click
      if (inspectBtn && input) {
        inspectBtn.addEventListener('click', () => {
          this.runScan(container, input.value);
        });
      }

      // Clear button click
      if (clearBtn && input) {
        clearBtn.addEventListener('click', () => {
          input.value = '';
          clearBtn.style.display = 'none';
          input.focus();
          presetButtons.forEach(b => b.classList.remove('active'));
          const resultArea = container.querySelector('#spotlight-result-area');
          if (resultArea) this.renderEmptyState(resultArea);
        });
      }

      // Preset pills click
      presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          presetButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const exId = btn.dataset.presetId;
          const found = allExamples.find(e => e.id === exId);
          if (found && input) {
            input.value = found.text;
            if (clearBtn) clearBtn.style.display = 'flex';
            this.runScan(container, found.text);
          }
        });
      });
    }
  };

  global.CyberShield.OverviewModule = OverviewModule;
})(window);
