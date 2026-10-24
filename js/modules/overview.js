/**
 * CyberShield — Overview Dashboard Module (Radically Simplified & Streamlined)
 * Focuses on what matters:
 * 1. Compact Header with live micro-KPI stats.
 * 2. Instant Showcase Security Scanner: 1-click real-world examples & Problem/Solution diagnosis.
 * 3. Exactly 3 clean, direct launch cards for primary tools (Link Inspector, Message Analyzer, Awareness Arena).
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
      const showcaseExamples = global.CyberShield.FastShowcaseScanner 
        ? global.CyberShield.FastShowcaseScanner.getExamples() 
        : [];

      container.innerHTML = `
        <!-- Compact, Executive Header with Micro-KPIs -->
        <div class="overview-header-clean">
          <div class="overview-header-left">
            <div class="overview-badge-row">
              <span class="status-live-dot"></span>
              <span class="overview-badge-text">
                ${isHinglish ? 'Security Lab • Local Offline Engine Active' : 'Security Command Center • Local Engine Active'}
              </span>
            </div>
            <h1 class="overview-main-title">
              ${isHinglish ? 'CyberShield Security Space' : 'CyberShield Security Hub'}
            </h1>
            <p class="overview-main-sub">
              ${isHinglish 
                ? 'Niche diye gaye example chips click karein ya koi bhi link/message scan karke instant Problem aur Solution dekhein.'
                : 'Click any example scenario below or input your own link or message to instantly diagnose the Problem & Solution.'}
            </p>
          </div>

          <!-- Micro-KPI Stats Strip -->
          <div class="overview-micro-kpi-bar">
            <div class="kpi-pill" title="Training Rounds Completed">
              <span class="kpi-icon blue">${getIcon('gamepad')}</span>
              <div class="kpi-info">
                <span class="kpi-val">${derived.totalRounds}</span>
                <span class="kpi-lbl">${isHinglish ? 'Rounds' : 'Rounds'}</span>
              </div>
            </div>
            <div class="kpi-pill" title="Overall Defense Accuracy">
              <span class="kpi-icon green">${getIcon('trending-up')}</span>
              <div class="kpi-info">
                <span class="kpi-val">${accuracyDisplay}</span>
                <span class="kpi-lbl">${isHinglish ? 'Accuracy' : 'Accuracy'}</span>
              </div>
            </div>
            <div class="kpi-pill" title="Questions Answered">
              <span class="kpi-icon purple">${getIcon('check')}</span>
              <div class="kpi-info">
                <span class="kpi-val">${derived.totalAnswered}</span>
                <span class="kpi-lbl">${isHinglish ? 'Questions' : 'Questions'}</span>
              </div>
            </div>
            <div class="kpi-pill" title="Lessons Read in Safety Hub">
              <span class="kpi-icon amber">${getIcon('book-open')}</span>
              <div class="kpi-info">
                <span class="kpi-val">${derived.completedLessonsCount} / 7</span>
                <span class="kpi-lbl">${isHinglish ? 'Lessons' : 'Lessons'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ⚡ CENTERPIECE: FAST SHOWCASE SECURITY SCANNER (Problem & Solution) -->
        <div class="card showcase-scanner-card" id="showcase-scanner-section">
          <!-- 1-Click Accessible Example Chips -->
          <div class="showcase-presets-bar" aria-label="1-Click Security Examples">
            <div class="preset-label">
              ${getIcon('zap', 'icon-inline')}
              <span>${isHinglish ? '1-Click Scenarios:' : '1-Click Scenarios:'}</span>
            </div>
            <div class="preset-chips-scroll">
              ${showcaseExamples.map((ex, idx) => `
                <button 
                  type="button" 
                  class="showcase-chip ${idx === 0 ? 'active' : ''}" 
                  data-example-id="${ex.id}"
                  title="${ex.text}"
                >
                  <span class="chip-badge ${ex.type}">${ex.badge}</span>
                  <span class="chip-text">${ex.title}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Universal Fast Input Box -->
          <div class="showcase-input-container">
            <div class="showcase-input-box">
              <textarea 
                id="showcase-scanner-input" 
                class="showcase-textarea" 
                rows="2" 
                placeholder="${isHinglish ? 'Yahan koi bhi suspicious link, fake SMS, WhatsApp job offer ya phone call scenario paste karein...' : 'Type or paste anything related to cybersecurity here (a link, SMS, WhatsApp message, caller transcript, or fraud scenario)...'}"
                aria-label="Universal security scanner input"
              >${showcaseExamples[0] ? showcaseExamples[0].text : ''}</textarea>
            </div>

            <div class="showcase-actions-bar">
              <div class="showcase-actions-left">
                <button type="button" class="btn btn-primary btn-md" id="btn-showcase-scan">
                  ${getIcon('search')}
                  <span>${isHinglish ? '⚡ Fast Scan (Problem & Solution)' : '⚡ Fast Scan (Problem & Solution)'}</span>
                </button>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-showcase-random">
                  ${getIcon('refresh-cw')}
                  <span>${isHinglish ? '🎲 Random Scam' : '🎲 Try Random Example'}</span>
                </button>
                <button type="button" class="btn btn-quiet btn-sm" id="btn-showcase-clear">
                  ${isHinglish ? 'Clear' : 'Clear'}
                </button>
              </div>
              <div class="showcase-engine-indicator">
                <span class="engine-dot"></span>
                <span>Deterministic Local Heuristics</span>
              </div>
            </div>
          </div>

          <!-- Live Problem & Solution Output Container -->
          <div id="showcase-result-container" class="showcase-result-wrapper" aria-live="polite">
            <!-- Dynamically populated by runShowcaseScan() -->
          </div>
        </div>

        <!-- 3 Clean Primary Action Cards (Explore Dedicated Tools) -->
        <div class="clean-section-header">
          <span class="clean-section-title">${isHinglish ? 'Primary Security Tools' : 'Primary Security Tools'}</span>
        </div>

        <div class="clean-tools-grid">
          <!-- Tool 1: Link Inspector -->
          <div class="clean-tool-card" id="card-launch-link">
            <div class="clean-tool-icon-row">
              <div class="clean-tool-icon blue">${getIcon('link')}</div>
              <span class="clean-tool-badge">Forensics Lab</span>
            </div>
            <h3 class="clean-tool-title">${isHinglish ? 'Link Inspector' : 'Link Inspector'}</h3>
            <p class="clean-tool-desc">
              ${isHinglish 
                ? 'URLs, short links, subdomains aur QR codes ko transparent local rules se inspect karein.' 
                : 'Deconstruct suspicious URLs, domain spoofs & QR codes safely without visiting them.'}
            </p>
            <div class="clean-tool-cta blue">
              <span>${isHinglish ? 'Inspect Link' : 'Inspect Link'}</span>
              ${getIcon('arrow-right', 'icon-inline')}
            </div>
          </div>

          <!-- Tool 2: Message Analyzer -->
          <div class="clean-tool-card" id="card-launch-message">
            <div class="clean-tool-icon-row">
              <div class="clean-tool-icon amber">${getIcon('message-square')}</div>
              <span class="clean-tool-badge">Pattern Rules</span>
            </div>
            <h3 class="clean-tool-title">${isHinglish ? 'Message Analyzer' : 'Message Analyzer'}</h3>
            <p class="clean-tool-desc">
              ${isHinglish 
                ? 'SMS, emails aur WhatsApp texts me fake OTP demands, urgency aur extortion pakdein.' 
                : 'Scan SMS, emails or WhatsApp texts to detect social-engineering traps & fake OTPs.'}
            </p>
            <div class="clean-tool-cta amber">
              <span>${isHinglish ? 'Analyze Text' : 'Analyze Message'}</span>
              ${getIcon('arrow-right', 'icon-inline')}
            </div>
          </div>

          <!-- Tool 3: Awareness Arena -->
          <div class="clean-tool-card" id="card-launch-arena">
            <div class="clean-tool-icon-row">
              <div class="clean-tool-icon green">${getIcon('gamepad')}</div>
              <span class="clean-tool-badge">Interactive Quiz</span>
            </div>
            <h3 class="clean-tool-title">${isHinglish ? 'Awareness Arena' : 'Awareness Arena'}</h3>
            <p class="clean-tool-desc">
              ${isHinglish 
                ? '3 difficulty tiers me interactive challenge rounds khel kar fraud detection seekhein.' 
                : 'Sharpen your scam-detection reflexes across 3 realistic difficulty tiers.'}
            </p>
            <div class="clean-tool-cta green">
              <span>${isHinglish ? 'Start Quiz' : 'Launch Arena'}</span>
              ${getIcon('arrow-right', 'icon-inline')}
            </div>
          </div>
        </div>
      `;

      this.attachEvents(container);

      // Auto-populate initial example so visitor immediately sees live output
      if (showcaseExamples.length > 0) {
        this.runShowcaseScan(container, showcaseExamples[0].text);
      }
    },

    runShowcaseScan: function(container, rawText) {
      const getIcon = global.CyberShield.getIcon;
      const resultContainer = container.querySelector('#showcase-result-container');
      if (!resultContainer) return;

      if (!rawText || !rawText.trim()) {
        resultContainer.innerHTML = `
          <div class="alert alert-warning" style="margin: 0;">
            <div class="alert-title">Input Empty</div>
            <div class="alert-message">Please select an example chip above or type any link, message, or cyber scenario to scan.</div>
          </div>
        `;
        return;
      }

      if (!global.CyberShield.FastShowcaseScanner) {
        resultContainer.innerHTML = `<div class="alert alert-danger">FastShowcaseScanner engine not loaded.</div>`;
        return;
      }

      let res;
      try {
        res = global.CyberShield.FastShowcaseScanner.analyze(rawText);
      } catch (err) {
        resultContainer.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
        return;
      }

      const isThreat = res.verdict === 'HIGH_RISK';
      const isSuspicious = res.verdict === 'SUSPICIOUS';
      const verdictThemeClass = isThreat ? 'threat-mode' : (isSuspicious ? 'suspicious-mode' : 'safe-mode');

      // Check for embedded link
      const urlRegex = /\bhttps?:\/\/[^\s<>"'{}|\\^`]+[^\s<>"'{}|\\^`.,;:?!()\[\]]/gi;
      const extractedUrls = rawText.match(urlRegex) || [];
      const hasUrl = extractedUrls.length > 0;
      const firstUrl = hasUrl ? extractedUrls[0] : '';

      resultContainer.innerHTML = `
        <div class="showcase-result-card ${verdictThemeClass}">
          <!-- Result Top Verdict Header -->
          <div class="result-top-banner">
            <div class="result-top-left">
              <div class="result-verdict-pill ${verdictThemeClass}">
                ${isThreat ? getIcon('alert-triangle') : (isSuspicious ? getIcon('info') : getIcon('check-circle'))}
                <span>${res.verdictLabel}</span>
              </div>
              <div class="result-category-pill">
                <span>Category: <strong>${res.category}</strong></span>
              </div>
            </div>
            <div class="result-risk-meter">
              <span class="meter-label">Threat Severity:</span>
              <span class="meter-score ${verdictThemeClass}">${res.riskScore} / 100</span>
            </div>
          </div>

          <!-- Dual Wing Section: The Problem vs The Solution -->
          <div class="problem-solution-dual-grid">
            <!-- Wing 1: 🚨 THE PROBLEM -->
            <div class="problem-wing-box">
              <div class="wing-header problem-header">
                <div class="wing-icon-title">
                  <span class="wing-badge-icon red">${getIcon('alert-circle')}</span>
                  <h3>1. 🚨 The Problem (Threat Diagnosis)</h3>
                </div>
                <span class="wing-tag red">What is Dangerous</span>
              </div>
              
              <div class="wing-body">
                <p class="problem-summary-text">${res.problem.summary}</p>
                
                <div class="red-flags-section">
                  <span class="section-micro-label red">Spotted Red Flags:</span>
                  <ul class="red-flags-list">
                    ${res.problem.redFlags.map(rf => `
                      <li>
                        <span class="rf-dot red"></span>
                        <span>${rf}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>

                <div class="mechanism-box">
                  <span class="mechanism-label">Scammer's Exact Mechanism:</span>
                  <p class="mechanism-text">${res.problem.mechanism}</p>
                </div>
              </div>
            </div>

            <!-- Wing 2: 🛡️ THE SOLUTION -->
            <div class="solution-wing-box">
              <div class="wing-header solution-header">
                <div class="wing-icon-title">
                  <span class="wing-badge-icon green">${getIcon('shield-check')}</span>
                  <h3>2. 🛡️ The Solution (Exact Action Plan)</h3>
                </div>
                <span class="wing-tag green">What to Do Right Now</span>
              </div>

              <div class="wing-body">
                <div class="action-checklist-section">
                  <span class="section-micro-label green">Immediate Action Checklist:</span>
                  <ol class="action-steps-list">
                    ${res.solution.immediateSteps.map(step => `
                      <li>
                        <span class="step-num-badge">✓</span>
                        <span>${step}</span>
                      </li>
                    `).join('')}
                  </ol>
                </div>

                <div class="verification-box">
                  <span class="verification-label">How to Officially Verify:</span>
                  <p class="verification-text">${res.solution.officialVerification}</p>
                </div>

                <!-- Emergency 1930 & Reporting Banner -->
                <div class="showcase-helpline-box">
                  <div class="helpline-left">
                    <span class="helpline-badge">1930 SOS</span>
                    <span class="helpline-text">National Cyber Crime Helpline: <strong>1930</strong> (Free 24x7)</span>
                  </div>
                  <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" class="helpline-portal-link">
                    cybercrime.gov.in ↗
                  </a>
                </div>

                <!-- Direct 1-Click Deep Dive Tools -->
                <div class="showcase-deep-dive-bar">
                  <span class="deep-dive-label">Deep Dive in Dedicated Tools:</span>
                  <div class="deep-dive-btns">
                    ${hasUrl ? `
                      <button type="button" class="btn btn-primary btn-sm btn-deep-link" data-url="${encodeURIComponent(firstUrl)}">
                        ${getIcon('link')}
                        <span>Inspect in Link Inspector</span>
                      </button>
                    ` : ''}
                    <button type="button" class="btn btn-secondary btn-sm btn-deep-msg">
                      ${getIcon('message-square')}
                      <span>Message Analyzer</span>
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm btn-deep-chat">
                      ${getIcon('message-square')}
                      <span>Ask AI Helper</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Wire deep dive buttons
      const router = global.CyberShield.Router;
      const deepLinkBtn = resultContainer.querySelector('.btn-deep-link');
      if (deepLinkBtn) {
        deepLinkBtn.addEventListener('click', () => {
          const u = decodeURIComponent(deepLinkBtn.dataset.url || '');
          router.navigate('link-inspector');
          setTimeout(() => {
            if (global.CyberShield.LinkInspectorModule && typeof global.CyberShield.LinkInspectorModule.inspectUrl === 'function') {
              global.CyberShield.LinkInspectorModule.inspectUrl(u);
            }
          }, 120);
        });
      }

      const deepMsgBtn = resultContainer.querySelector('.btn-deep-msg');
      if (deepMsgBtn) {
        deepMsgBtn.addEventListener('click', () => {
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

      const deepChatBtn = resultContainer.querySelector('.btn-deep-chat');
      if (deepChatBtn) {
        deepChatBtn.addEventListener('click', () => {
          router.navigate('chat');
          setTimeout(() => {
            const chatInput = document.querySelector('#chat-user-input');
            if (chatInput) {
              chatInput.value = `I received this message/scenario, can you explain the risks and what I should do? "${rawText}"`;
              chatInput.focus();
            }
          }, 120);
        });
      }
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

      // Showcase Scanner Elements
      const showcaseInput = container.querySelector('#showcase-scanner-input');
      const scanBtn = container.querySelector('#btn-showcase-scan');
      const randomBtn = container.querySelector('#btn-showcase-random');
      const clearBtn = container.querySelector('#btn-showcase-clear');
      const chipButtons = container.querySelectorAll('.showcase-chip');
      const examples = global.CyberShield.FastShowcaseScanner 
        ? global.CyberShield.FastShowcaseScanner.getExamples() 
        : [];

      // Click on chip preset
      chipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          chipButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const exId = btn.dataset.exampleId;
          const found = examples.find(e => e.id === exId);
          if (found && showcaseInput) {
            showcaseInput.value = found.text;
            this.runShowcaseScan(container, found.text);
          }
        });
      });

      // Scan Button Click
      if (scanBtn && showcaseInput) {
        scanBtn.addEventListener('click', () => {
          this.runShowcaseScan(container, showcaseInput.value);
        });
      }

      // Random Example Button
      if (randomBtn && showcaseInput && examples.length > 0) {
        randomBtn.addEventListener('click', () => {
          const randIdx = Math.floor(Math.random() * examples.length);
          const chosen = examples[randIdx];
          showcaseInput.value = chosen.text;

          chipButtons.forEach(b => {
            if (b.dataset.exampleId === chosen.id) b.classList.add('active');
            else b.classList.remove('active');
          });

          this.runShowcaseScan(container, chosen.text);
        });
      }

      // Clear Button
      if (clearBtn && showcaseInput) {
        clearBtn.addEventListener('click', () => {
          showcaseInput.value = '';
          showcaseInput.focus();
          chipButtons.forEach(b => b.classList.remove('active'));
          const resCont = container.querySelector('#showcase-result-container');
          if (resCont) resCont.innerHTML = '';
        });
      }
    }
  };

  global.CyberShield.OverviewModule = OverviewModule;
})(window);
