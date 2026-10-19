/**
 * CyberShield — Context-Aware Scam & Fraud Message Analyzer Module
 * Dual-Engine Architecture:
 * 1. Google Gemini AI Fraud Analyst (Dedicated Context-Aware Security Engine)
 * 2. On-Device Local Social-Engineering Heuristics (100% Offline Fallback)
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const SAMPLE_MESSAGES = [
    {
      label: 'Bank OTP Stealing Alert',
      text: 'BANK ALERT: An unauthorized debit of $850.00 to Merchant-Global is pending. If this was NOT you, reply immediately with your 6-digit OTP to block your account immediately.'
    },
    {
      label: 'Benign Bank OTP Warning',
      text: 'Dear Customer, your OTP for transaction is 482910. Never share your OTP with anyone, including bank officers. If you did not initiate this, open your official mobile banking app or call 1800-000-000.'
    },
    {
      label: 'Telegram Task Scam',
      text: 'Congratulations! You have been selected for work from home job. Earn $500 daily rating apps! No interview needed. Message our hiring manager on Telegram @FastHR to claim your $50 bonus.'
    },
    {
      label: 'Digital Arrest Threat',
      text: 'FINAL WARNING from Police Cyber Crime Bureau: An arrest warrant has been issued against your ID. Police will arrive at your address within 2 hours. Keep this confidential and do not inform anyone.'
    },
    {
      label: 'Benign Meeting Notice',
      text: 'Hi team, urgent reminder: The project retrospective starts in 15 minutes in Conference Room B. Please review the shared slides before joining.'
    }
  ];

  let currentEngine = 'gemini'; // 'gemini' or 'local'

  const MessageAnalyzerModule = {
    render: function(container) {
      const getIcon = global.CyberShield.getIcon;
      const transient = global.CyberShield.State.getTransient();

      container.innerHTML = `
        <div class="card" style="margin-bottom: var(--space-xl);">
          <div class="card-header">
            <div class="card-title-group">
              <h1 class="card-title" style="font-size: var(--font-size-lg);">Scam & Fraud Message Analyzer</h1>
              <span class="card-subtitle">Context-aware threat evaluation for SMS, WhatsApp, emails, job offers, and bank alerts</span>
            </div>
            <div class="badge badge-brand" id="active-engine-badge">
              ${getIcon('cpu')} CyberShield Helper Connected
            </div>
          </div>

          <div class="card-body">
            <!-- Engine Selector Toggle -->
            <div class="ai-engine-selector" role="tablist" aria-label="Select Analysis Engine">
              <button type="button" class="ai-engine-tab ${currentEngine === 'gemini' ? 'active' : ''}" id="tab-engine-gemini" role="tab" aria-selected="${currentEngine === 'gemini'}">
                ${getIcon('zap')}
                <span>CyberShield Helper (Context-Aware AI)</span>
              </button>
              <button type="button" class="ai-engine-tab ${currentEngine === 'local' ? 'active' : ''}" id="tab-engine-local" role="tab" aria-selected="${currentEngine === 'local'}">
                ${getIcon('lock')}
                <span>Local Offline Heuristics (100% On-Device)</span>
              </button>
            </div>

            <!-- Engine Notice Banner -->
            <div id="engine-notice-banner" class="alert alert-info" style="margin-bottom: var(--space-md);">
              <div class="alert-icon">${getIcon('info')}</div>
              <div class="alert-content">
                <div class="alert-title" id="engine-notice-title">
                  ${currentEngine === 'gemini' ? 'Context-Aware AI Security Inspection' : 'Local Heuristics Engine'}
                </div>
                <div class="alert-message" id="engine-notice-text">
                  ${currentEngine === 'gemini' 
                    ? 'Evaluates intent, contradictions, coercive urgency, and credential-theft tactics through our secure server proxy. Your API key remains private on the server.'
                    : 'Evaluates known keyword patterns and regular expressions completely inside your browser memory without network calls.'}
                </div>
              </div>
            </div>

            <!-- Input Form -->
            <div class="form-group">
              <label class="form-label" for="message-input-area">
                <span>Paste Suspicious Message Body</span>
                <span class="form-hint">Do not paste real passwords or personal identity numbers</span>
              </label>
              <textarea 
                id="message-input-area" 
                class="form-textarea" 
                placeholder="Paste an SMS, email notification, bank alert, or chat here to inspect..."
                rows="6"
              ></textarea>
              <div class="char-counter" id="message-char-counter">0 / 25,000 characters</div>

              <!-- Sample Buttons -->
              <div class="sample-pills" style="margin-top: var(--space-xs);">
                <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); font-weight: var(--font-weight-medium);">
                  Load Fictional Sample:
                </span>
                ${SAMPLE_MESSAGES.map((sample, idx) => `
                  <button type="button" class="sample-pill-btn" data-msg-sample-idx="${idx}">
                    ${sample.label}
                  </button>
                `).join('')}
              </div>

              <!-- Validation Error -->
              <div id="message-analyzer-error" class="alert alert-warning" style="display: none; margin-top: var(--space-md);"></div>
            </div>

            <!-- Action Controls -->
            <div style="display: flex; gap: var(--space-sm); align-items: center; flex-wrap: wrap;">
              <button class="btn btn-primary btn-lg" id="btn-analyze-message">
                ${getIcon('search')}
                <span id="btn-analyze-text">Analyze Message with ${currentEngine === 'gemini' ? 'CyberShield Helper' : 'Local Engine'}</span>
              </button>
              <button class="btn btn-secondary" id="btn-clear-message">Clear</button>
            </div>
          </div>
        </div>

        <!-- Result Container -->
        <div id="message-analysis-result">
          ${transient.geminiMessageAnalysis 
            ? this.renderGeminiResultMarkup(transient.geminiMessageAnalysis, transient.lastMessageText || '') 
            : transient.messageAnalysis 
              ? this.renderLocalResultMarkup(transient.messageAnalysis) 
              : ''}
        </div>
      `;

      this.attachEvents(container);
    },

    attachEvents: function(container) {
      const textarea = container.querySelector('#message-input-area');
      const counter = container.querySelector('#message-char-counter');
      const analyzeBtn = container.querySelector('#btn-analyze-message');
      const analyzeBtnText = container.querySelector('#btn-analyze-text');
      const clearBtn = container.querySelector('#btn-clear-message');
      const errorAlert = container.querySelector('#message-analyzer-error');
      const resultContainer = container.querySelector('#message-analysis-result');
      const sampleBtns = container.querySelectorAll('.sample-pill-btn');
      const tabGemini = container.querySelector('#tab-engine-gemini');
      const tabLocal = container.querySelector('#tab-engine-local');
      const engineBadge = container.querySelector('#active-engine-badge');
      const noticeTitle = container.querySelector('#engine-notice-title');
      const noticeText = container.querySelector('#engine-notice-text');

      // Engine switching
      const switchEngine = (newEngine) => {
        currentEngine = newEngine;
        tabGemini.classList.toggle('active', currentEngine === 'gemini');
        tabLocal.classList.toggle('active', currentEngine === 'local');
        tabGemini.setAttribute('aria-selected', currentEngine === 'gemini');
        tabLocal.setAttribute('aria-selected', currentEngine === 'local');

        if (currentEngine === 'gemini') {
          engineBadge.className = 'badge badge-brand';
          engineBadge.innerHTML = `${global.CyberShield.getIcon('cpu')} CyberShield Helper Connected`;
          noticeTitle.textContent = 'Context-Aware AI Security Inspection';
          noticeText.textContent = 'Evaluates intent, contradictions, coercive urgency, and credential-theft tactics through our secure server proxy. Your API key remains private on the server.';
          analyzeBtnText.textContent = 'Analyze Message with CyberShield Helper';
        } else {
          engineBadge.className = 'badge badge-brand';
          engineBadge.innerHTML = `${global.CyberShield.getIcon('lock')} 100% On-Device`;
          noticeTitle.textContent = 'Local Heuristics Engine';
          noticeText.textContent = 'Evaluates known keyword patterns and regular expressions completely inside your browser memory without network calls.';
          analyzeBtnText.textContent = 'Analyze Message with Local Engine';
        }
      };

      tabGemini.addEventListener('click', () => switchEngine('gemini'));
      tabLocal.addEventListener('click', () => switchEngine('local'));

      // Character counter updater
      textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        counter.textContent = `${len.toLocaleString()} / 25,000 characters`;
        if (len > 25000) {
          counter.classList.add('limit-exceeded');
        } else if (len > 22000) {
          counter.classList.add('limit-near');
          counter.classList.remove('limit-exceeded');
        } else {
          counter.classList.remove('limit-near', 'limit-exceeded');
        }
      });

      // Sample click
      sampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.msgSampleIdx, 10);
          textarea.value = SAMPLE_MESSAGES[idx].text;
          textarea.dispatchEvent(new Event('input'));
          errorAlert.style.display = 'none';
          this.runAnalysis(textarea.value, resultContainer, errorAlert);
        });
      });

      // Clear click
      clearBtn.addEventListener('click', () => {
        textarea.value = '';
        textarea.dispatchEvent(new Event('input'));
        errorAlert.style.display = 'none';
        resultContainer.innerHTML = '';
        global.CyberShield.State.getTransient().messageAnalysis = null;
        global.CyberShield.State.getTransient().geminiMessageAnalysis = null;
      });

      // Analyze click
      analyzeBtn.addEventListener('click', () => {
        this.runAnalysis(textarea.value, resultContainer, errorAlert);
      });
    },

    runAnalysis: function(rawText, resultContainer, errorAlert) {
      const validation = global.CyberShield.Validation.validateMessageInput(rawText);
      if (!validation.isValid) {
        errorAlert.textContent = validation.error;
        errorAlert.style.display = 'block';
        resultContainer.innerHTML = '';
        return;
      }

      errorAlert.style.display = 'none';
      const trimmedText = validation.trimmedText;
      global.CyberShield.State.getTransient().lastMessageText = trimmedText;

      if (currentEngine === 'gemini') {
        this.runGeminiAnalysis(trimmedText, resultContainer, errorAlert);
      } else {
        this.runLocalAnalysis(trimmedText, resultContainer, errorAlert);
      }
    },

    /**
     * Run Context-Aware Gemini AI Analysis via Backend Proxy
     */
    runGeminiAnalysis: async function(rawText, resultContainer, errorAlert) {
      const getIcon = global.CyberShield.getIcon;

      // Render animated scanning state
      resultContainer.innerHTML = `
        <div class="ai-loading-container" role="status" aria-live="polite">
          <div class="ai-radar-scanner">
            ${getIcon('search')}
          </div>
          <h2 style="font-size: var(--font-size-base); font-weight: var(--font-weight-bold); margin-bottom: 6px;">
            Consulting CyberShield Helper Engine...
          </h2>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); max-width: 440px; margin: 0 auto;">
            Inspecting intent, contradictions, credential-harvesting indicators, and social-engineering tactics.
          </p>
        </div>
      `;

      try {
        const analysisData = await global.CyberShield.GeminiAPI.analyzeMessage(rawText);

        // Save in transient memory & record activity
        global.CyberShield.State.getTransient().geminiMessageAnalysis = analysisData;
        global.CyberShield.State.recordMessageAnalysis();

        // Render structured findings
        resultContainer.innerHTML = this.renderGeminiResultMarkup(analysisData, rawText);
        this.attachGeminiResultActions(resultContainer, analysisData, rawText);

        // Accessibility announcement
        global.CyberShield.Accessibility.announce(`CyberShield Helper analysis completed: Verdict ${analysisData.verdict}, Risk score ${analysisData.riskScore}`);

      } catch (err) {
        console.error('Gemini Analysis Failed:', err);
        resultContainer.innerHTML = '';

        const isConfigMissing = err.code === 'CONFIG_MISSING' || (err.message && err.message.includes('API_KEY'));
        const errorMessage = isConfigMissing
          ? 'CyberShield Helper backend service is not configured. Please verify your GEMINI_API_KEY environment variable.'
          : `AI Analysis request failed: ${err.message || 'Unknown network error'}.`;

        errorAlert.innerHTML = `
          <div style="margin-bottom: var(--space-xs); font-weight: var(--font-weight-semibold);">${errorMessage}</div>
          <button class="btn btn-secondary btn-sm" id="btn-fallback-local" style="margin-top: 6px;">
            ${getIcon('lock')} Run with Local Heuristic Rules Instead
          </button>
        `;
        errorAlert.style.display = 'block';

        const fallbackBtn = errorAlert.querySelector('#btn-fallback-local');
        if (fallbackBtn) {
          fallbackBtn.addEventListener('click', () => {
            errorAlert.style.display = 'none';
            this.runLocalAnalysis(rawText, resultContainer, errorAlert);
          });
        }
      }
    },

    /**
     * Run Local Heuristic Analysis (100% Offline Engine)
     */
    runLocalAnalysis: function(rawText, resultContainer, errorAlert) {
      try {
        const evaluation = global.CyberShield.MessageRules.evaluate(rawText);
        const result = global.CyberShield.EvidenceAggregator.aggregateMessageResult(evaluation);

        global.CyberShield.State.getTransient().messageAnalysis = result;
        global.CyberShield.State.recordMessageAnalysis();

        resultContainer.innerHTML = this.renderLocalResultMarkup(result);
        this.attachLocalResultActions(resultContainer, result);

        global.CyberShield.Accessibility.announce(`Local message analysis completed: ${result.overallLabel}`);
      } catch (err) {
        console.error('Local analysis error:', err);
        errorAlert.textContent = `Analysis error: ${err.message}`;
        errorAlert.style.display = 'block';
      }
    },

    /**
     * Render Structured Gemini AI Security Findings
     */
    renderGeminiResultMarkup: function(data, rawText) {
      const getIcon = global.CyberShield.getIcon;
      const escape = global.CyberShield.SafeRender.escapeHtml;

      // Extract any web links from the text for pivot to Link Inspector
      const urlRegex = /(https?:\/\/[^\s<>"'{}|\\^`]+)/gi;
      const extractedUrls = [];
      let match;
      while ((match = urlRegex.exec(rawText)) !== null) {
        extractedUrls.push(match[1]);
      }

      // Map verdict to badge styles
      let verdictClass = 'low-risk';
      let verdictTitle = 'LOW RISK';
      let verdictIcon = 'shield-check';

      if (data.verdict === 'HIGH_RISK') {
        verdictClass = 'high-risk';
        verdictTitle = 'HIGH RISK: SEVERE FRAUD INDICATORS';
        verdictIcon = 'alert-triangle';
      } else if (data.verdict === 'SUSPICIOUS') {
        verdictClass = 'suspicious';
        verdictTitle = 'SUSPICIOUS: WARNING SIGNS DETECTED';
        verdictIcon = 'alert-circle';
      } else if (data.verdict === 'UNCERTAIN') {
        verdictClass = 'uncertain';
        verdictTitle = 'UNCERTAIN: INCOMPLETE EVIDENCE';
        verdictIcon = 'help-circle';
      } else {
        verdictClass = 'low-risk';
        verdictTitle = 'LOW RISK: NO CRITICAL THREATS FOUND';
        verdictIcon = 'shield-check';
      }

      const score = Math.max(0, Math.min(100, data.riskScore || 0));

      return `
        <div class="ai-verdict-card">
          <!-- Card Header -->
          <div class="ai-verdict-header">
            <div>
              <div class="ai-verdict-badge ${verdictClass}">
                ${getIcon(verdictIcon)}
                <span>${verdictTitle}</span>
              </div>
            </div>
            <div style="display: flex; gap: var(--space-xs); align-items: center;">
              <span class="ai-status-pill online">
                ${getIcon('cpu')} CyberShield Helper Verified
              </span>
              <span class="ai-check-tag">
                Confidence: ${escape(data.confidence || 'MEDIUM')}
              </span>
            </div>
          </div>

          <div class="card-body">
            <!-- Risk Meter -->
            <div class="ai-risk-score-bar-wrapper">
              <div class="ai-score-label-col">
                <span style="font-size: var(--font-size-xs); font-weight: var(--font-weight-bold); text-transform: uppercase; color: var(--color-text-muted); letter-spacing: 0.05em;">
                  Heuristic Risk Meter
                </span>
                <div class="ai-score-display">
                  <span class="ai-score-num" style="color: ${score > 74 ? 'var(--color-danger)' : score > 39 ? 'var(--color-warning)' : 'var(--color-success)'};">
                    ${score}
                  </span>
                  <span class="ai-score-total">/ 100</span>
                </div>
              </div>
              <div class="ai-meter-track" role="progressbar" aria-valuenow="${score}" aria-valuemin="0" aria-valuemax="100">
                <div class="ai-meter-fill ${verdictClass}" style="width: ${score}%;"></div>
              </div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); max-width: 220px; line-height: 1.4;">
                ${score > 74 ? 'High potential of credential theft or extortion.' : score > 39 ? 'Suspicious cues detected. Verification strongly recommended.' : 'Minimal indicators detected in inspected text.'}
              </div>
            </div>

            <!-- Plain English Advisory Summary -->
            <div class="ai-summary-callout">
              <strong>Analyst Assessment:</strong> ${escape(data.summary)}
            </div>

            <!-- Extracted URLs Pivot (if any) -->
            ${extractedUrls.length > 0 ? `
              <div class="extracted-urls-section">
                <span style="font-size: var(--font-size-xs); font-weight: var(--font-weight-bold); text-transform: uppercase; color: var(--color-primary); display: block; margin-bottom: 6px;">
                  ${getIcon('link', 'icon-inline')} Embedded Web Links Found (${extractedUrls.length})
                </span>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-xs);">
                  CyberShield never opens untrusted links. You can safely inspect these destinations in the Link Inspector:
                </p>
                ${extractedUrls.map(url => `
                  <div class="extracted-url-item">
                    <span class="url-plain-text">${escape(url)}</span>
                    <button class="btn btn-secondary btn-sm btn-inspect-extracted-url" data-url="${escape(url)}">
                      Inspect in Link Inspector
                    </button>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Red Flags (if any) -->
            ${data.redFlags && data.redFlags.length > 0 ? `
              <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-danger); margin: var(--space-lg) 0 var(--space-xs);">
                Observed Red Flags & Warning Indicators (${data.redFlags.length})
              </h3>
              <div>
                ${data.redFlags.map(rf => `
                  <div class="ai-finding-card danger">
                    ${getIcon('alert-triangle')}
                    <span>${escape(rf)}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Reassuring Signals (if any) -->
            ${data.reassuringSignals && data.reassuringSignals.length > 0 ? `
              <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-success); margin: var(--space-lg) 0 var(--space-xs);">
                Contextual Reassuring Signals (${data.reassuringSignals.length})
              </h3>
              <div>
                ${data.reassuringSignals.map(rs => `
                  <div class="ai-finding-card success">
                    ${getIcon('shield-check')}
                    <span>${escape(rs)}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Observable Evidence -->
            ${data.evidence && data.evidence.length > 0 ? `
              <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin: var(--space-lg) 0 var(--space-xs);">
                Observable Content Evidence
              </h3>
              <ul style="padding-left: var(--space-lg); font-size: var(--font-size-sm); margin-bottom: var(--space-md);">
                ${data.evidence.map(ev => `<li>${escape(ev)}</li>`).join('')}
              </ul>
            ` : ''}

            <!-- Recommended Next Actions -->
            <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin: var(--space-lg) 0 var(--space-xs);">
              Recommended Safe Next Steps
            </h3>
            <ul style="padding-left: var(--space-lg); font-size: var(--font-size-sm); margin-bottom: var(--space-lg);">
              ${(data.recommendedActions || []).map(action => `<li>${escape(action)}</li>`).join('')}
            </ul>

            <!-- Transparency: Checks Actually Performed -->
            <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin: var(--space-lg) 0 var(--space-xs);">
              Transparency: Checks Actually Performed
            </h3>
            <div class="ai-checks-tag-cloud">
              ${(data.checksPerformed || []).map(cp => `
                <span class="ai-check-tag">
                  ${getIcon('check')} ${escape(cp)}
                </span>
              `).join('')}
            </div>

            <!-- Transparency: Limitations & Advisory Disclaimer -->
            <div class="ai-limitations-notice">
              <div class="ai-limitations-title">
                ${getIcon('shield-alert', 'icon-inline')}
                <span>Limitations & Advisory Disclaimer</span>
              </div>
              <ul class="ai-limitations-list">
                ${(data.limitations || []).map(lim => `<li>${escape(lim)}</li>`).join('')}
                <li><strong>Advisory Notice:</strong> AI analysis is an advisory tool and cannot authenticate sender headers or guarantee complete safety. When in doubt, verify independently through known official channels.</li>
              </ul>
            </div>
          </div>

          <!-- Card Footer Actions -->
          <div class="card-footer">
            <button class="btn btn-secondary" id="btn-copy-ai-summary">
              ${getIcon('copy')}
              <span>Copy Security Summary</span>
            </button>
            <button class="btn btn-primary" id="btn-ai-analyze-another">
              ${getIcon('rotate-ccw')}
              <span>Analyze Another Message</span>
            </button>
          </div>
        </div>
      `;
    },

    attachGeminiResultActions: function(container, data, rawText) {
      // Extracted URL inspection navigation
      const sendUrlBtns = container.querySelectorAll('.btn-inspect-extracted-url');
      sendUrlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetUrl = btn.dataset.url;
          global.CyberShield.Router.navigate('link-inspector');
          setTimeout(() => {
            const linkInput = document.querySelector('#url-inspector-input');
            const inspectBtn = document.querySelector('#btn-inspect-url');
            if (linkInput && inspectBtn) {
              linkInput.value = targetUrl;
              inspectBtn.click();
            }
          }, 120);
        });
      });

      // Copy summary to clipboard
      const copyBtn = container.querySelector('#btn-copy-ai-summary');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const text = [
            `CyberShield Scam & Fraud Analysis:`,
            `Verdict: ${data.verdict} (Risk Score: ${data.riskScore}/100, Confidence: ${data.confidence})`,
            `Summary: ${data.summary}`,
            `Red Flags: ${(data.redFlags || []).join('; ') || 'None observed'}`,
            `Recommended Actions: ${(data.recommendedActions || []).join('; ')}`
          ].join('\n');

          navigator.clipboard.writeText(text).then(() => {
            const original = copyBtn.innerHTML;
            copyBtn.innerHTML = `${global.CyberShield.getIcon('check')} Copied!`;
            setTimeout(() => {
              copyBtn.innerHTML = original;
            }, 2000);
          }).catch(e => console.warn('Clipboard copy error:', e));
        });
      }

      // Analyze another
      const anotherBtn = container.querySelector('#btn-ai-analyze-another');
      if (anotherBtn) {
        anotherBtn.addEventListener('click', () => {
          const textarea = document.querySelector('#message-input-area');
          if (textarea) {
            textarea.value = '';
            textarea.dispatchEvent(new Event('input'));
            textarea.focus();
          }
          container.innerHTML = '';
          global.CyberShield.State.getTransient().geminiMessageAnalysis = null;
        });
      }
    },

    /**
     * Render Local Heuristic Result Markup (Original Offline Engine)
     */
    renderLocalResultMarkup: function(result) {
      const getIcon = global.CyberShield.getIcon;
      const escape = global.CyberShield.SafeRender.escapeHtml;

      const highlightedMarkup = this.generateHighlightedHtml(result.rawText || '', result.highlightRanges || []);

      let concernBadge = '';
      if (result.overallConcern === 'HIGH_CONCERN') {
        concernBadge = `<div class="badge badge-danger" style="font-size: var(--font-size-sm); padding: 6px 14px;">${getIcon('alert-triangle')} High Concern</div>`;
      } else if (result.overallConcern === 'REVIEW_ADVISED') {
        concernBadge = `<div class="badge badge-warning" style="font-size: var(--font-size-sm); padding: 6px 14px;">${getIcon('alert-circle')} Review Advised</div>`;
      } else {
        concernBadge = `<div class="badge badge-success" style="font-size: var(--font-size-sm); padding: 6px 14px;">${getIcon('check-circle')} No Obvious Warning Signs</div>`;
      }

      return `
        <div class="card" style="margin-bottom: var(--space-xl); animation: fadeIn 0.2s ease;">
          <div class="card-header">
            <div class="card-title-group">
              <span class="card-title">Local Heuristic Findings</span>
              <span class="card-subtitle">Pattern detection and social-engineering keyword filters</span>
            </div>
            ${concernBadge}
          </div>

          <div class="card-body">
            <div class="alert alert-${result.overallClass}" style="margin-bottom: var(--space-lg);">
              <div class="alert-icon">
                ${result.overallClass === 'warning' ? getIcon('alert-triangle') : result.overallClass === 'caution' ? getIcon('alert-circle') : getIcon('info')}
              </div>
              <div class="alert-content">
                <div class="alert-title">${escape(result.overallLabel)}</div>
                <div class="alert-message">${escape(result.disclaimer)}</div>
              </div>
            </div>

            <!-- Extracted URLs section -->
            ${result.extractedUrls && result.extractedUrls.length > 0 ? `
              <div class="extracted-urls-section">
                <span style="font-size: var(--font-size-xs); font-weight: var(--font-weight-bold); text-transform: uppercase; color: var(--color-primary); display: block; margin-bottom: 6px;">
                  ${getIcon('link', 'icon-inline')} Extracted Web Link(s) in Message
                </span>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-xs);">
                  CyberShield does not open links. You can safely inspect these destinations locally in the Link Inspector:
                </p>
                ${result.extractedUrls.map(url => `
                  <div class="extracted-url-item">
                    <span class="url-plain-text">${escape(url)}</span>
                    <button class="btn btn-secondary btn-sm btn-inspect-extracted-url" data-url="${escape(url)}">
                      Inspect in Link Inspector
                    </button>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Highlighted Text Display -->
            <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin-bottom: var(--space-xs);">
              Flagged Clues Highlight
            </h3>
            <div class="highlighted-text-box">${highlightedMarkup}</div>

            <!-- Matched Rules Evidence List -->
            <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin: var(--space-lg) 0 var(--space-sm);">
              Detected Red Flags (${result.matches.length})
            </h3>

            ${result.matches.length > 0 ? `
              <div class="evidence-list">
                ${result.matches.map(m => `
                  <div class="evidence-card ${m.concern === 'HIGH_CONCERN' ? 'danger' : 'warning'}">
                    <div class="evidence-card-header">
                      <span class="evidence-rule-name">${escape(m.name)}</span>
                      <span class="badge ${m.concern === 'HIGH_CONCERN' ? 'badge-danger' : 'badge-warning'}">
                        ${m.concern === 'HIGH_CONCERN' ? 'High Concern' : 'Review Advised'}
                      </span>
                    </div>
                    <div class="evidence-snippet">${escape(m.evidence)}</div>
                    <div class="evidence-explanation">${escape(m.explanation)}</div>
                    <div class="evidence-recommendation">${getIcon('shield-check', 'icon-inline')} ${escape(m.recommendation)}</div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="alert alert-info" style="margin-bottom: var(--space-lg);">
                <div class="alert-icon">${getIcon('info')}</div>
                <div class="alert-content">
                  <div class="alert-title">No explicit red-flag keywords found</div>
                  <div class="alert-message">This message did not trigger our rule-based urgency, OTP, or extortion filters. Be cautious if the message is unexpected.</div>
                </div>
              </div>
            `}

            <!-- Safe Next Steps -->
            <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin-bottom: var(--space-xs);">
              Recommended Safe Next Steps
            </h3>
            <ul style="padding-left: var(--space-lg); font-size: var(--font-size-sm); margin-bottom: var(--space-lg);">
              ${result.safeNextSteps.map(step => `<li>${escape(step)}</li>`).join('')}
            </ul>

            <!-- What Was Not Checked -->
            <div style="background-color: var(--color-bg-subtle); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); padding: var(--space-md);">
              <span style="font-size: var(--font-size-xs); font-weight: var(--font-weight-bold); text-transform: uppercase; letter-spacing: 0.04em; color: var(--color-text-muted); display: block; margin-bottom: 4px;">
                Transparency: What This Tool Cannot Determine
              </span>
              <ul style="padding-left: var(--space-lg); font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
                ${result.whatWasNotChecked.map(item => `<li>${escape(item)}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn btn-secondary" id="btn-copy-msg-summary">
              ${getIcon('copy')}
              <span>Copy Analysis Summary</span>
            </button>
            <button class="btn btn-primary" id="btn-analyze-another-msg">
              ${getIcon('rotate-ccw')}
              <span>Analyze Another Message</span>
            </button>
          </div>
        </div>
      `;
    },

    generateHighlightedHtml: function(text, ranges) {
      const escape = global.CyberShield.SafeRender.escapeHtml;
      if (!ranges || ranges.length === 0) {
        return escape(text);
      }

      let html = '';
      let lastIndex = 0;

      for (const range of ranges) {
        html += escape(text.substring(lastIndex, range.start));
        const matchSnippet = text.substring(range.start, range.end);
        html += `<mark class="flagged-highlight" title="${escape(range.ruleName)}">${escape(matchSnippet)}</mark>`;
        lastIndex = range.end;
      }

      html += escape(text.substring(lastIndex));
      return html;
    },

    attachLocalResultActions: function(container, result) {
      const sendUrlBtns = container.querySelectorAll('.btn-inspect-extracted-url');
      sendUrlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetUrl = btn.dataset.url;
          global.CyberShield.Router.navigate('link-inspector');
          setTimeout(() => {
            const linkInput = document.querySelector('#url-inspector-input');
            const inspectBtn = document.querySelector('#btn-inspect-url');
            if (linkInput && inspectBtn) {
              linkInput.value = targetUrl;
              inspectBtn.click();
            }
          }, 120);
        });
      });

      const copyBtn = container.querySelector('#btn-copy-msg-summary');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const text = [
            `CyberShield Message Red-Flag Summary:`,
            `Concern Level: ${result.overallLabel}`,
            `Matched Clues: ${result.matches.map(m => m.name).join(', ') || 'None'}`,
            `Recommendations: ${result.safeNextSteps.join('; ')}`
          ].join('\n');

          navigator.clipboard.writeText(text).then(() => {
            const original = copyBtn.innerHTML;
            copyBtn.innerHTML = `${global.CyberShield.getIcon('check')} Copied!`;
            setTimeout(() => {
              copyBtn.innerHTML = original;
            }, 2000);
          }).catch(e => console.warn('Clipboard copy error:', e));
        });
      }

      const anotherBtn = container.querySelector('#btn-analyze-another-msg');
      if (anotherBtn) {
        anotherBtn.addEventListener('click', () => {
          const textarea = document.querySelector('#message-input-area');
          if (textarea) {
            textarea.value = '';
            textarea.dispatchEvent(new Event('input'));
            textarea.focus();
          }
          container.innerHTML = '';
          global.CyberShield.State.getTransient().messageAnalysis = null;
        });
      }
    }
  };

  global.CyberShield.MessageAnalyzerModule = MessageAnalyzerModule;
})(window);
