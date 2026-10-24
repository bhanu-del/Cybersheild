/**
 * CyberShield — Overview Dashboard Module with Fast Showcase Scanner
 * Features:
 * 1. Instant Showcase Triage Scanner: 1-click real-world examples & universal input for visitors/judges.
 * 2. Instant Problem & Solution dual-wing output (Threat Diagnosis + Step-by-Step Action Plan).
 * 3. Simplified, non-cluttered executive layout with clean KPI metrics and primary action cards.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const OverviewModule = {
    render: function(container) {
      const state = global.CyberShield.State;
      const derived = state.getDerivedStats();
      const getIcon = global.CyberShield.getIcon;
      const fmt = global.CyberShield.Formatting;
      const prefs = state.getData().preferences || {};
      const isHinglish = prefs.language === 'hinglish';

      const accuracyDisplay = derived.overallAccuracyPct !== null ? `${derived.overallAccuracyPct}%` : '—';
      const accuracySubtext = derived.totalAnswered > 0 
        ? `${derived.totalCorrect} of ${derived.totalAnswered} correct`
        : 'Take a quiz to see score';

      const recentSessions = (state.getData().sessions || []).slice(0, 3);

      const categoryNames = {
        'url_phishing': 'URL & Link Phishing',
        'otp_credentials': 'Passwords & OTP Safety',
        'fake_offers': 'Fake Offers & Prizes',
        'impersonation': 'Impersonation & Authority',
        'social_pressure': 'Social Pressure & Urgency',
        'technical_scams': 'Technical & Browser Safety'
      };

      const suggestedLessonId = (typeof state.getSuggestedNextLesson === 'function') 
        ? state.getSuggestedNextLesson() 
        : 'lesson-phishing-fundamentals';
      const allLessons = global.CyberShield.LESSONS || [];
      const suggestedLesson = allLessons.find(l => l.id === suggestedLessonId) || allLessons[0] || {};
      const lessonTitle = (isHinglish && suggestedLesson.titleHinglish) ? suggestedLesson.titleHinglish : (suggestedLesson.title || 'Phishing Fundamentals');
      const lessonObjective = (isHinglish && suggestedLesson.objectiveHinglish) ? suggestedLesson.objectiveHinglish : (suggestedLesson.objective || 'Master safe online habits');
      const lessonReadTime = suggestedLesson.readTime || '3 min read';

      const showcaseExamples = global.CyberShield.FastShowcaseScanner 
        ? global.CyberShield.FastShowcaseScanner.getExamples() 
        : [];

      container.innerHTML = `
        <!-- Simplified Header Banner -->
        <div class="hero-banner simplified-hero">
          <div class="hero-content" style="max-width: 100%;">
            <div class="hero-badge">
              ${getIcon('shield-check', 'hero-badge-icon')}
              <span>${isHinglish ? 'Digital Defense Portal • Offline Safe' : 'Security Command Center • Offline-First'}</span>
            </div>
            <h1 class="hero-title" style="margin-bottom: 6px; font-size: 1.65rem;">
              ${isHinglish ? 'CyberShield Security Hub' : 'CyberShield Security Hub'}
            </h1>
            <p class="hero-subtitle" style="margin-bottom: var(--space-md); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
              ${isHinglish 
                ? 'Visitors & Evaluators: Niche diye gaye showcase examples click karein ya koi bhi link, SMS ya cyber scenario enter karke turant Problem aur Solution check karein.'
                : 'Interactive Showcase: Select any real-world example chip below or input any link, SMS, or caller scenario to instantly diagnose the Problem & Solution.'}
            </p>

            <div class="hero-actions" style="margin-top: var(--space-xs); gap: var(--space-sm);">
              <button class="btn btn-primary btn-sm" id="btn-hero-arena">
                ${getIcon('gamepad')}
                <span>${isHinglish ? 'Start Arena Quiz' : 'Start Arena Quiz'}</span>
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-hero-link">
                ${getIcon('link')}
                <span>${isHinglish ? 'Link Inspector' : 'Link Inspector'}</span>
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-hero-chat">
                ${getIcon('message-square')}
                <span>${isHinglish ? 'AI Security Helper' : 'AI Helper'}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ⚡ FAST SHOWCASE SECURITY SCANNER (Problem & Solution) -->
        <div class="card showcase-scanner-card" id="showcase-scanner-section">
          <div class="showcase-card-header">
            <div class="showcase-title-wrap">
              <span class="showcase-live-dot"></span>
              <h2 class="showcase-title">
                ${isHinglish ? '⚡ Fast Showcase Scanner (Problem & Solution)' : '⚡ Fast Showcase Security Scanner'}
              </h2>
              <span class="badge badge-brand">Instant Triage</span>
            </div>
            <p class="showcase-subtitle">
              ${isHinglish 
                ? 'Visitor / Judge Demo: Kisi bhi example chip par click karein ya apna koi bhi link, message ya phone call scenario paste karein.'
                : '1-Click Exhibition Mode: Click any example scenario or input your own link, message, or incident to discover the exact Threat & Solution Plan.'}
            </p>
          </div>

          <!-- 1-Click Accessible Example Chips -->
          <div class="showcase-presets-bar" aria-label="Quick Showcase Example Presets">
            <div class="preset-label">
              ${getIcon('zap', 'icon-inline')}
              <span>${isHinglish ? 'Quick Examples:' : '1-Click Scenarios:'}</span>
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

          <!-- Universal Input Box -->
          <div class="showcase-input-container">
            <div class="showcase-input-box">
              <textarea 
                id="showcase-scanner-input" 
                class="showcase-textarea" 
                rows="3" 
                placeholder="${isHinglish ? 'Yahan koi bhi suspicious link, message text, WhatsApp fake job offer ya phone call scenario paste karein...' : 'Type or paste anything related to cybersecurity here (a link, SMS, WhatsApp message, caller transcript, or fraud scenario)...'}"
                aria-label="Showcase input for security analysis"
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
                <span>Deterministic Heuristics & Local Rules</span>
              </div>
            </div>
          </div>

          <!-- Live Problem & Solution Output Container -->
          <div id="showcase-result-container" class="showcase-result-wrapper" aria-live="polite">
            <!-- Dynamically populated by runShowcaseScan() -->
          </div>
        </div>

        <!-- Compact 4-Metric KPI Grid -->
        <div class="metric-grid simplified-metric-grid" style="margin-top: var(--space-xl);">
          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">${isHinglish ? 'Rounds' : 'Training Rounds'}</span>
              <div class="metric-icon-box blue">${getIcon('gamepad')}</div>
            </div>
            <div class="metric-value">${derived.totalRounds}</div>
            <div class="metric-subtext">${derived.totalRounds > 0 ? 'Recorded rounds' : 'No rounds yet'}</div>
          </div>

          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">${isHinglish ? 'Accuracy' : 'Overall Accuracy'}</span>
              <div class="metric-icon-box green">${getIcon('trending-up')}</div>
            </div>
            <div class="metric-value">${accuracyDisplay}</div>
            <div class="metric-subtext">${accuracySubtext}</div>
          </div>

          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">${isHinglish ? 'Questions' : 'Questions Answered'}</span>
              <div class="metric-icon-box purple">${getIcon('check')}</div>
            </div>
            <div class="metric-value">${derived.totalAnswered}</div>
            <div class="metric-subtext">${derived.totalCorrect} correct answers</div>
          </div>

          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">${isHinglish ? 'Lessons' : 'Lessons Completed'}</span>
              <div class="metric-icon-box amber">${getIcon('book-open')}</div>
            </div>
            <div class="metric-value">${derived.completedLessonsCount} / 7</div>
            <div class="metric-subtext">Safety Hub Modules</div>
          </div>
        </div>

        <!-- Streamlined Primary 3 Quick-Action Cards -->
        <div class="quick-tools-grid simplified-tools-grid">
          <!-- Tool 1: Link Inspector -->
          <div class="quick-tool-card simplified-tool-card" id="card-launch-link">
            <div class="tool-card-top-row">
              <div class="tool-card-icon blue">
                ${getIcon('link')}
              </div>
              <span class="badge badge-brand">Instant Analysis</span>
            </div>
            <h3 class="tool-card-title">${isHinglish ? 'Link Inspector' : 'Link Inspector'}</h3>
            <p class="tool-card-desc">
              ${isHinglish 
                ? 'Suspicious URLs, subdomains aur QR codes ko transparent rules se verify karein.' 
                : 'Deconstruct suspicious URLs, misleading hostnames & QR codes safely.'}
            </p>
            <div class="tool-card-footer-action">
              <span>${isHinglish ? 'Open Inspector' : 'Inspect Link'}</span>
              ${getIcon('arrow-right', 'icon-inline')}
            </div>
          </div>

          <!-- Tool 2: Message Analyzer -->
          <div class="quick-tool-card simplified-tool-card" id="card-launch-message">
            <div class="tool-card-top-row">
              <div class="tool-card-icon amber">
                ${getIcon('message-square')}
              </div>
              <span class="badge badge-caution">AI & Patterns</span>
            </div>
            <h3 class="tool-card-title">${isHinglish ? 'Message Analyzer' : 'Message Analyzer'}</h3>
            <p class="tool-card-desc">
              ${isHinglish 
                ? 'SMS, emails aur WhatsApp texts me fake OTP demands aur extortion traps pakdein.' 
                : 'Paste SMS, emails or WhatsApp messages to detect fraud, urgency & extortion.'}
            </p>
            <div class="tool-card-footer-action">
              <span>${isHinglish ? 'Analyze Text' : 'Analyze Message'}</span>
              ${getIcon('arrow-right', 'icon-inline')}
            </div>
          </div>

          <!-- Tool 3: Awareness Arena -->
          <div class="quick-tool-card simplified-tool-card" id="card-launch-arena">
            <div class="tool-card-top-row">
              <div class="tool-card-icon green">
                ${getIcon('gamepad')}
              </div>
              <span class="badge badge-success">Interactive</span>
            </div>
            <h3 class="tool-card-title">${isHinglish ? 'Awareness Arena' : 'Awareness Arena'}</h3>
            <p class="tool-card-desc">
              ${isHinglish 
                ? 'Interactive training quiz khel kar real-world online scams ko spot karna seekhein.' 
                : 'Sharpen your scam-detection reflexes across 3 realistic difficulty tiers.'}
            </p>
            <div class="tool-card-footer-action">
              <span>${isHinglish ? 'Start Round' : 'Launch Arena'}</span>
              ${getIcon('arrow-right', 'icon-inline')}
            </div>
          </div>
        </div>

        <!-- Balanced Two Column Section: Recent Activity & Suggested Topic -->
        <div class="overview-two-col simplified-two-col">
          <!-- Recent Activity -->
          <div class="card">
            <div class="card-header">
              <div class="card-title-group">
                <span class="card-title">${isHinglish ? 'Recent Activity' : 'Recent Activity'}</span>
                <span class="card-subtitle">${isHinglish ? 'Aapke latest training sessions' : 'Latest training records'}</span>
              </div>
              <button class="btn btn-quiet btn-sm" id="btn-view-all-progress">View All</button>
            </div>
            <div class="card-body">
              ${recentSessions.length > 0 ? `
                <div class="activity-list">
                  ${recentSessions.map(sess => `
                    <div class="activity-item">
                      <div class="activity-item-left">
                        <div class="badge ${sess.accuracy >= 70 ? 'badge-success' : 'badge-caution'}">
                          ${sess.accuracy}%
                        </div>
                        <div>
                          <div class="activity-title">
                            ${sess.category === 'all' ? 'All Categories' : (categoryNames[sess.category] || sess.category)}
                          </div>
                          <div class="activity-meta">
                            ${fmt.formatDate(sess.timestamp)} • ${sess.correctCount} / ${sess.totalQuestions} correct
                          </div>
                        </div>
                      </div>
                      <span class="badge badge-neutral" style="text-transform: capitalize;">${sess.difficulty}</span>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="empty-state" style="padding: var(--space-md) 0;">
                  <div class="empty-icon-box" style="width: 42px; height: 42px; margin-bottom: 8px;">${getIcon('gamepad')}</div>
                  <div class="empty-title" style="font-size: var(--font-size-sm);">${isHinglish ? 'No sessions yet' : 'No training rounds recorded yet'}</div>
                  <div class="empty-desc" style="font-size: var(--font-size-xs); margin-bottom: var(--space-sm);">${isHinglish ? 'Arena me pehla round khel kar accuracy check karein.' : 'Complete an interactive quiz in Awareness Arena to see your defense score.'}</div>
                  <button class="btn btn-primary btn-sm" id="btn-empty-start-arena">${isHinglish ? 'Play Quick Round' : 'Start Practice Round'}</button>
                </div>
              `}
            </div>
          </div>

          <!-- Suggested Topic -->
          <div class="card">
            <div class="card-header">
              <div class="card-title-group">
                <span class="card-title">${isHinglish ? 'Recommended Next Step' : 'Recommended Next Step'}</span>
                <span class="card-subtitle">${isHinglish ? 'Safety module recommendation' : 'Targeted security lesson'}</span>
              </div>
            </div>
            <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div class="badge badge-brand" style="margin-bottom: var(--space-xs);">Recommended Lesson</div>
                <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: 4px;">
                  ${lessonTitle}
                </h3>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); line-height: 1.5; margin-bottom: var(--space-sm);">
                  ${lessonObjective}
                </p>
                <div class="lesson-meta-hint" style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                  ${getIcon('book-open', 'icon-inline')} ${lessonReadTime} • Includes quiz
                </div>
              </div>
              <button class="btn btn-secondary btn-sm btn-block" id="btn-open-suggested-lesson" style="margin-top: var(--space-md);">
                ${isHinglish ? 'Lesson Padhein' : 'Read Lesson & Practice'}
              </button>
            </div>
          </div>
        </div>
      `;

      this.attachEvents(container, suggestedLessonId);

      // Auto-run scan on initial example so visitor immediately sees the live output
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

    attachEvents: function(container, suggestedLessonId) {
      const router = global.CyberShield.Router;

      const bindClick = (id, route) => {
        const el = container.querySelector('#' + id);
        if (el) {
          el.addEventListener('click', () => router.navigate(route));
        }
      };

      bindClick('btn-hero-arena', 'arena');
      bindClick('btn-hero-link', 'link-inspector');
      bindClick('btn-hero-chat', 'chat');
      bindClick('card-launch-arena', 'arena');
      bindClick('card-launch-link', 'link-inspector');
      bindClick('card-launch-message', 'message-analyzer');
      bindClick('btn-view-all-progress', 'progress');
      bindClick('btn-empty-start-arena', 'arena');

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

      // Suggested lesson button
      const suggestedBtn = container.querySelector('#btn-open-suggested-lesson');
      if (suggestedBtn) {
        suggestedBtn.addEventListener('click', () => {
          router.navigate('learning-hub');
          setTimeout(() => {
            if (global.CyberShield.LearningHubModule && global.CyberShield.LearningHubModule.openLesson) {
              global.CyberShield.LearningHubModule.openLesson(suggestedLessonId || 'lesson-phishing-fundamentals');
            }
          }, 100);
        });
      }
    }
  };

  global.CyberShield.OverviewModule = OverviewModule;
})(window);
