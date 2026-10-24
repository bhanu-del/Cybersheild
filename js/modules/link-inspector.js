/**
 * CyberShield — Cyber Intelligence Center & Digital Forensics Lab
 * 
 * Re-architected with 7 Core Intelligence Pillars:
 * 1. 🛡️ Cyber Intelligence Center (Threat Intelligence Platform Shell)
 * 2. 🔬 Digital Forensics Lab (5-Stage Technical Deep Dive & Evidence Meaning)
 * 3. ⚡ Live Investigation Animation (Smooth Visual Progress Pipeline)
 * 4. 🎯 Threat Evidence Cards (Modular Expandable Forensic Findings)
 * 5. 🧠 Explainable Risk Assessment (Transparent Indicator Scorecard & Uncertainty)
 * 6. 🗺️ Interactive URL Anatomy Explorer (Clickable Token Inspection)
 * 7. 🧬 Investigation Timeline & Exportable Forensic Report (Downloadable Dossier)
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const SAMPLE_URLS = [
    { label: 'Subdomain Trick', url: 'http://paypal.com.account-update.invalid/login' },
    { label: 'Lookalike Domain', url: 'http://secure-login.paypa1-security.com/verify' },
    { label: 'User-Info (@) Delimiter', url: 'https://google.com@attacker-controlled.invalid/agent.exe' },
    { label: 'Raw IP Hostname', url: 'http://185.220.101.5/checkout' },
    { label: 'URL Shortener', url: 'https://tinyurl.com/parcel-gp88319' },
    { label: 'Punycode IDN', url: 'https://xn--pple-43d.com' },
    { label: 'Benign Doc Link', url: 'https://clouddrive.example.com/shared/doc?id=99281&auth=sso' }
  ];

  const SAMPLE_QRS = [
    { label: 'Phishing URL QR', file: 'assets/samples/sample-suspicious-url.png' },
    { label: 'Legitimate URL QR', file: 'assets/samples/sample-url.png' },
    { label: 'Fake UPI Payment QR', file: 'assets/samples/sample-upi.png' },
    { label: 'Script Injection QR', file: 'assets/samples/sample-script.png' },
    { label: 'Corrupt / Invalid QR', file: 'assets/samples/sample-corrupt.png' }
  ];

  let activeTab = 'url'; // 'url' or 'qr'
  let currentEngine = 'gemini'; // 'gemini' or 'local'
  let activeAnatomyToken = 'domain'; // 'scheme', 'subdomain', 'domain', 'port', 'path', 'query'
  let currentAnimationTimer = null;

  function generateInvestigationId() {
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `CS-INV-2026-${rand}`;
  }

  function getFormattedTimestamp() {
    const d = new Date();
    return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  }

  const LinkInspectorModule = {
    switchToUrlTab: function() {
      activeTab = 'url';
      const tabUrl = document.querySelector('#tab-mode-url');
      const tabQr = document.querySelector('#tab-mode-qr');
      const panelUrl = document.querySelector('#panel-tab-url');
      const panelQr = document.querySelector('#panel-tab-qr');
      if (tabUrl && tabQr && panelUrl && panelQr) {
        tabUrl.classList.add('active');
        tabQr.classList.remove('active');
        panelUrl.style.display = 'block';
        panelQr.style.display = 'none';
      }
    },

    switchToQrTab: function() {
      activeTab = 'qr';
      const tabUrl = document.querySelector('#tab-mode-url');
      const tabQr = document.querySelector('#tab-mode-qr');
      const panelUrl = document.querySelector('#panel-tab-url');
      const panelQr = document.querySelector('#panel-tab-qr');
      if (tabUrl && tabQr && panelUrl && panelQr) {
        tabQr.classList.add('active');
        tabUrl.classList.remove('active');
        panelQr.style.display = 'block';
        panelUrl.style.display = 'none';
        this.loadQrEngine();
      }
    },

    inspectUrl: function(url) {
      this.switchToUrlTab();
      const input = document.querySelector('#url-inspector-input');
      const errorAlert = document.querySelector('#url-inspector-error');
      const resultContainer = document.querySelector('#url-inspection-result');
      if (input) {
        input.value = url;
        this.runInspection(url, resultContainer, errorAlert);
      }
    },

    cleanup: function() {
      if (currentAnimationTimer) {
        clearTimeout(currentAnimationTimer);
        currentAnimationTimer = null;
      }
    },

    render: function(container) {
      const getIcon = global.CyberShield.getIcon;
      const transient = global.CyberShield.State.getTransient();
      const recentList = transient.recentInvestigations || [];

      container.innerHTML = `
        <!-- 1. 🛡️ CYBER INTELLIGENCE CENTER HERO & WORKSPACE -->
        <div class="intel-hero-card">
          <div class="intel-hero-header">
            <div>
              <div class="intel-node-pill">
                <span class="intel-pulse-dot"></span>
                <span>Cyber Intelligence Center • Forensic Lab</span>
              </div>
              <h1 class="intel-hero-title">
                ${getIcon('shield', 'icon-inline')} Link & URL Forensic Inspector
              </h1>
              <p class="intel-hero-subtitle">
                Deconstruct web addresses into factual anatomy, inspect suspicious deceptive indicators, and generate explainable forensic dossiers without visiting the destination.
              </p>
            </div>
            <div>
              <div class="badge badge-brand" id="active-link-engine-badge">
                ${getIcon('cpu')} CyberShield AI Intel Active
              </div>
            </div>
          </div>

          <!-- Engine Mode & Input Type Navigation Bar -->
          <div class="intel-nav-bar">
            <!-- Inspection Engine Toggle -->
            <div class="intel-tab-group" role="tablist" aria-label="Analysis Engine">
              <button type="button" class="intel-tab-btn ${currentEngine === 'gemini' ? 'active' : ''}" id="tab-link-engine-gemini" role="tab" aria-selected="${currentEngine === 'gemini'}">
                ${getIcon('zap')}
                <span>CyberShield Helper (AI Intel)</span>
              </button>
              <button type="button" class="intel-tab-btn ${currentEngine === 'local' ? 'active' : ''}" id="tab-link-engine-local" role="tab" aria-selected="${currentEngine === 'local'}">
                ${getIcon('lock')}
                <span>Local Forensics Engine (100% Offline)</span>
              </button>
            </div>

            <!-- Target Type Tabs (URL vs QR Quishing) -->
            <div class="intel-tab-group" role="tablist" aria-label="Input Mode">
              <button type="button" class="intel-tab-btn ${activeTab === 'url' ? 'active' : ''}" id="tab-mode-url" role="tab">
                ${getIcon('link')}
                <span>URL Address</span>
              </button>
              <button type="button" class="intel-tab-btn ${activeTab === 'qr' ? 'active' : ''}" id="tab-mode-qr" role="tab">
                ${getIcon('maximize')}
                <span>QR Code (Quishing)</span>
              </button>
            </div>
          </div>

          <!-- URL Analysis Workspace Panel -->
          <div id="panel-tab-url" style="${activeTab === 'url' ? 'display: block;' : 'display: none;'}">
            <!-- QR Decoded Notification Banner -->
            <div id="url-inspector-notice" class="alert alert-success" style="display: none; margin-bottom: var(--space-md);"></div>

            <!-- Large Center Investigation Input -->
            <div class="intel-input-wrapper">
              <span class="intel-input-icon">${getIcon('search')}</span>
              <input 
                type="text" 
                id="url-inspector-input" 
                class="intel-input-box" 
                placeholder="Enter or paste suspicious link (e.g. https://secure-login.paypal.com.verify-user.invalid/login)..." 
                spellcheck="false"
                autocomplete="off"
                aria-label="Target URL Address"
              />
            </div>

            <!-- Action Controls Row -->
            <div class="intel-actions-row">
              <button type="button" class="btn-analyze-intel" id="btn-inspect-url">
                ${getIcon('shield-check')}
                <span id="btn-inspect-url-text">INVESTIGATE LINK DOSSIER</span>
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-url">
                ${getIcon('trash-2')} Clear Input
              </button>
            </div>

            <!-- Sample Fictional Investigation Chips -->
            <div class="intel-samples-container">
              <span class="intel-samples-label">Load Fictional Investigation Sample:</span>
              <div class="intel-samples-pills">
                ${SAMPLE_URLS.map((sample, idx) => `
                  <button type="button" class="intel-sample-pill" data-sample-idx="${idx}">
                    ${sample.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Recent Investigations Quick Drawer -->
            <div class="intel-recent-drawer" id="intel-recent-drawer" style="${recentList.length > 0 ? 'display: block;' : 'display: none;'}">
              <div class="intel-recent-header">
                <span class="intel-recent-title">
                  ${getIcon('clock')} Recent Investigations (${recentList.length})
                </span>
                <span style="font-size: 0.7rem; color: #64748B;">Click to re-examine</span>
              </div>
              <div class="intel-recent-chips-list" id="intel-recent-chips-list">
                ${recentList.map(item => `
                  <button type="button" class="intel-recent-chip" data-recent-url="${global.CyberShield.SafeRender.escapeHtml(item.url)}">
                    <span class="intel-recent-verdict-dot ${item.verdictClass}"></span>
                    <span>${global.CyberShield.SafeRender.escapeHtml(item.hostname)}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Validation Error Alert with Auto-Fix -->
            <div id="url-inspector-error" class="alert alert-warning" style="display: none; margin-top: var(--space-md);"></div>
          </div>

          <!-- QR Code Quishing Lab Panel -->
          <div id="panel-tab-qr" style="${activeTab === 'qr' ? 'display: block;' : 'display: none;'}">
            <div style="border: 2px dashed rgba(99, 102, 241, 0.4); border-radius: var(--radius-lg); padding: var(--space-2xl); text-align: center; background-color: rgba(6, 12, 26, 0.5); cursor: pointer; transition: all var(--transition-fast);" id="qr-dropzone">
              <div class="empty-icon-box" style="margin: 0 auto var(--space-md); color: #818cf8;">
                ${getIcon('maximize')}
              </div>
              <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: 4px; color: #F8FAFC;">
                Drag & Drop a QR Code Image for Quishing Analysis
              </h3>
              <p style="font-size: var(--font-size-xs); color: #94A3B8; margin-bottom: var(--space-md); max-width: 480px; margin-left: auto; margin-right: auto;">
                Decodes payload locally using in-browser canvas heuristics. Never uploads pixel data to remote cloud servers.
              </p>
              <input type="file" id="qr-file-input" accept="image/*" style="display: none;">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-choose-qr-file">
                Browse Image File
              </button>
            </div>

            <!-- Preloaded QR Code Samples -->
            <div class="intel-samples-container" style="margin-top: var(--space-md);">
              <span class="intel-samples-label">Load Fictional QR Test Samples:</span>
              <div class="intel-samples-pills">
                ${SAMPLE_QRS.map((sq, idx) => `
                  <button type="button" class="intel-sample-pill qr-sample-pill" data-qr-idx="${idx}">
                    ${sq.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <div id="qr-decode-status" style="margin-top: var(--space-lg); display: none;"></div>
          </div>
        </div>

        <!-- 2. LIVE INVESTIGATION ANIMATION HUD & RESULT CONTAINER -->
        <div id="url-inspection-result">
          ${transient.geminiUrlAnalysis 
            ? this.renderIntelligenceDossier(transient.geminiUrlAnalysis, transient.lastInspectedUrl || '', 'gemini')
            : transient.linkInspection 
              ? this.renderIntelligenceDossier(transient.linkInspection, transient.lastInspectedUrl || '', 'local')
              : ''}
        </div>
      `;

      this.attachEvents(container);
    },

    attachEvents: function(container) {
      const tabUrl = container.querySelector('#tab-mode-url');
      const tabQr = container.querySelector('#tab-mode-qr');
      const tabGemini = container.querySelector('#tab-link-engine-gemini');
      const tabLocal = container.querySelector('#tab-link-engine-local');
      const engineBadge = container.querySelector('#active-link-engine-badge');
      const inspectBtnText = container.querySelector('#btn-inspect-url-text');

      const input = container.querySelector('#url-inspector-input');
      const inspectBtn = container.querySelector('#btn-inspect-url');
      const clearBtn = container.querySelector('#btn-clear-url');
      const errorAlert = container.querySelector('#url-inspector-error');
      const resultContainer = container.querySelector('#url-inspection-result');
      const sampleBtns = container.querySelectorAll('.intel-sample-pill:not(.qr-sample-pill)');
      const recentChips = container.querySelectorAll('.intel-recent-chip');

      tabUrl.addEventListener('click', () => this.switchToUrlTab());
      tabQr.addEventListener('click', () => this.switchToQrTab());

      const switchEngine = (newEngine) => {
        currentEngine = newEngine;
        tabGemini.classList.toggle('active', currentEngine === 'gemini');
        tabLocal.classList.toggle('active', currentEngine === 'local');
        tabGemini.setAttribute('aria-selected', currentEngine === 'gemini');
        tabLocal.setAttribute('aria-selected', currentEngine === 'local');

        if (currentEngine === 'gemini') {
          engineBadge.className = 'badge badge-brand';
          engineBadge.innerHTML = `${global.CyberShield.getIcon('cpu')} CyberShield AI Intel Active`;
          inspectBtnText.textContent = 'INVESTIGATE LINK DOSSIER (AI)';
        } else {
          engineBadge.className = 'badge badge-brand';
          engineBadge.innerHTML = `${global.CyberShield.getIcon('lock')} 100% Local Offline Forensics`;
          inspectBtnText.textContent = 'INVESTIGATE LINK DOSSIER (LOCAL)';
        }
      };

      tabGemini.addEventListener('click', () => switchEngine('gemini'));
      tabLocal.addEventListener('click', () => switchEngine('local'));

      // Sample click
      sampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.sampleIdx, 10);
          input.value = SAMPLE_URLS[idx].url;
          errorAlert.style.display = 'none';
          this.runInspection(input.value, resultContainer, errorAlert);
        });
      });

      // Recent click
      recentChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const url = chip.dataset.recentUrl;
          if (url) {
            input.value = url;
            errorAlert.style.display = 'none';
            this.runInspection(url, resultContainer, errorAlert);
          }
        });
      });

      // Clear click
      clearBtn.addEventListener('click', () => {
        input.value = '';
        errorAlert.style.display = 'none';
        resultContainer.innerHTML = '';
        global.CyberShield.State.getTransient().linkInspection = null;
        global.CyberShield.State.getTransient().geminiUrlAnalysis = null;
      });

      input.addEventListener('input', () => {
        const notice = container.querySelector('#url-inspector-notice');
        if (notice) notice.style.display = 'none';
      });

      inspectBtn.addEventListener('click', () => {
        this.runInspection(input.value, resultContainer, errorAlert);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.runInspection(input.value, resultContainer, errorAlert);
        }
      });

      this.attachQrEvents(container);
    },

    attachQrEvents: function(container) {
      const dropzone = container.querySelector('#qr-dropzone');
      const fileInput = container.querySelector('#qr-file-input');
      const chooseBtn = container.querySelector('#btn-choose-qr-file');
      const statusBox = container.querySelector('#qr-decode-status');
      const qrSampleBtns = container.querySelectorAll('.qr-sample-pill');

      if (!dropzone || !fileInput) return;

      chooseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });

      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#38BDF8';
        dropzone.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        dropzone.style.backgroundColor = 'rgba(6, 12, 26, 0.5)';
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        dropzone.style.backgroundColor = 'rgba(6, 12, 26, 0.5)';
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.processQrFile(e.dataTransfer.files[0], statusBox);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
          this.processQrFile(fileInput.files[0], statusBox);
        }
      });

      qrSampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.qrIdx, 10);
          const sample = SAMPLE_QRS[idx];
          this.processQrImageUrl(sample.file, statusBox);
        });
      });
    },

    processQrFile: function(file, statusBox) {
      const reader = new FileReader();
      reader.onload = (e) => this.decodeQrImageSrc(e.target.result, statusBox);
      reader.readAsDataURL(file);
    },

    processQrImageUrl: function(url, statusBox) {
      this.decodeQrImageSrc(url, statusBox);
    },

    loadQrEngine: function(onReady, onError) {
      if (typeof window.jsQR === 'function') {
        if (onReady) onReady();
        return;
      }
      const existing = document.querySelector('script[data-lib="jsqr"]');
      if (existing) {
        if (onReady) existing.addEventListener('load', onReady);
        if (onError) existing.addEventListener('error', onError);
        return;
      }
      const script = document.createElement('script');
      script.src = 'js/utils/jsQR.js';
      script.setAttribute('data-lib', 'jsqr');
      script.onload = () => { if (onReady) onReady(); };
      script.onerror = () => { if (onError) onError(); };
      document.head.appendChild(script);
    },

    decodeQrImageSrc: function(src, statusBox) {
      const getIcon = global.CyberShield.getIcon;
      statusBox.style.display = 'block';
      statusBox.innerHTML = `
        <div class="alert alert-info">
          <div class="alert-icon">${getIcon('search')}</div>
          <div class="alert-content">
            <div class="alert-title">Decoding QR Code Locally...</div>
            <div class="alert-message">Evaluating matrix byte structure without external network transmission.</div>
          </div>
        </div>
      `;

      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        this.loadQrEngine(() => {
          try {
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const code = window.jsQR(imageData.data, imageData.width, imageData.height);
            if (code && code.data) {
              this.handleDecodedQr(code.data, statusBox);
            } else {
              statusBox.innerHTML = `
                <div class="alert alert-warning">
                  <div class="alert-icon">${getIcon('alert-circle')}</div>
                  <div class="alert-content">
                    <div class="alert-title">No Valid QR Matrix Detected</div>
                    <div class="alert-message">Image could not be parsed. Ensure the QR code is in focus and well-lit.</div>
                  </div>
                </div>
              `;
            }
          } catch (err) {
            statusBox.innerHTML = `
              <div class="alert alert-warning">
                <div class="alert-content">QR Decoding Error: ${global.CyberShield.SafeRender.escapeHtml(err.message)}</div>
              </div>
            `;
          }
        });
      };
      img.src = src;
    },

    handleDecodedQr: function(rawPayload, statusBox) {
      const getIcon = global.CyberShield.getIcon;
      const isUpi = /^upi:\/\//i.test(rawPayload);
      const isUrl = /^https?:\/\//i.test(rawPayload) || (!rawPayload.includes(' ') && rawPayload.includes('.'));

      if (isUpi) {
        statusBox.innerHTML = `
          <div class="alert alert-warning">
            <div class="alert-icon">${getIcon('alert-triangle')}</div>
            <div class="alert-content">
              <div class="alert-title">UPI Intent Code Decoded</div>
              <div class="alert-message" style="word-break: break-all; font-family: var(--font-family-mono); margin: 6px 0;">
                ${global.CyberShield.SafeRender.escapeHtml(rawPayload)}
              </div>
              <div style="font-size: var(--font-size-xs); color: #F59E0B; font-weight: 600;">
                ⚠️ Warning: Scanning this QR in GPay/PhonePe/Paytm DEBITS money from your bank account. Scammers print these claiming "Receive Prize/Refund". You NEVER scan to receive money!
              </div>
            </div>
          </div>
        `;
        return;
      }

      if (isUrl) {
        let normalized = rawPayload;
        if (!/^https?:\/\//i.test(normalized)) normalized = 'https://' + normalized;

        statusBox.innerHTML = `
          <div class="alert alert-success">
            <div class="alert-icon">${getIcon('check-circle')}</div>
            <div class="alert-content">
              <div class="alert-title">QR Code Decoded Destination Link</div>
              <div class="alert-message" style="word-break: break-all; font-family: var(--font-family-mono); margin: 4px 0;">
                ${global.CyberShield.SafeRender.escapeHtml(normalized)}
              </div>
              <div style="font-size: var(--font-size-xs);">Transferring to Forensic Investigation Lab...</div>
            </div>
          </div>
        `;
        this.switchToUrlTab();
        const input = document.querySelector('#url-inspector-input');
        const errorAlert = document.querySelector('#url-inspector-error');
        const resultContainer = document.querySelector('#url-inspection-result');
        if (input) {
          input.value = normalized;
          this.runInspection(normalized, resultContainer, errorAlert);
        }
      }
    },

    runInspection: function(rawUrl, resultContainer, errorAlert) {
      const validation = global.CyberShield.Validation.validateUrlInput(rawUrl);
      if (!validation.isValid) {
        if (validation.canAutoFix && validation.suggestedUrl) {
          errorAlert.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
              <span>${global.CyberShield.SafeRender.escapeHtml(validation.error)}</span>
              <button class="btn btn-primary btn-sm" id="btn-autofix-url">
                Auto-Fix: Add https:// & Inspect
              </button>
            </div>
          `;
          errorAlert.style.display = 'block';

          const autoFixBtn = errorAlert.querySelector('#btn-autofix-url');
          if (autoFixBtn) {
            autoFixBtn.addEventListener('click', () => {
              const input = document.querySelector('#url-inspector-input');
              if (input) input.value = validation.suggestedUrl;
              this.runInspection(validation.suggestedUrl, resultContainer, errorAlert);
            });
          }
        } else {
          errorAlert.textContent = validation.error;
          errorAlert.style.display = 'block';
        }
        resultContainer.innerHTML = '';
        return;
      }

      errorAlert.style.display = 'none';
      const trimmedUrl = validation.trimmedUrl;
      global.CyberShield.State.getTransient().lastInspectedUrl = trimmedUrl;

      // 3. ⚡ LIVE INVESTIGATION ANIMATION (Unfolds visually before revealing Dossier)
      this.playLiveInvestigationAnimation(trimmedUrl, resultContainer, () => {
        if (currentEngine === 'gemini') {
          this.executeGeminiInspection(trimmedUrl, resultContainer, errorAlert);
        } else {
          this.executeLocalInspection(trimmedUrl, resultContainer, errorAlert);
        }
      });
    },

    /**
     * 3. ⚡ Live Investigation Animation Runner
     */
    playLiveInvestigationAnimation: function(url, resultContainer, onComplete) {
      const getIcon = global.CyberShield.getIcon;
      const escape = global.CyberShield.SafeRender.escapeHtml;

      resultContainer.innerHTML = `
        <div class="live-investigation-hud" role="status" aria-live="polite">
          <div class="live-radar-scanner">
            ${getIcon('search')}
          </div>
          <div class="live-hud-title">LIVE DIGITAL FORENSIC INVESTIGATION</div>
          <div class="live-hud-target">${escape(url)}</div>

          <!-- Staged Investigation Pipeline -->
          <div class="live-stages-container">
            <div class="live-stage-item active" id="live-stage-1">
              <span class="live-stage-icon">${getIcon('cpu')}</span>
              <span>STAGE 1: INITIALIZING INVESTIGATION (Input Normalization)</span>
            </div>
            <div class="live-stage-item" id="live-stage-2">
              <span class="live-stage-icon">${getIcon('file-text')}</span>
              <span>STAGE 2: PARSING URL STRUCTURE (RFC 3986 Lexical Tokenization)</span>
            </div>
            <div class="live-stage-item" id="live-stage-3">
              <span class="live-stage-icon">${getIcon('eye')}</span>
              <span>STAGE 3: CHECKING FORENSIC INDICATORS (Subdomains, Homoglyphs, Ports)</span>
            </div>
            <div class="live-stage-item" id="live-stage-4">
              <span class="live-stage-icon">${getIcon('alert-triangle')}</span>
              <span>STAGE 4: EVALUATING RISK SIGNALS (Heuristic & AI Weighting)</span>
            </div>
            <div class="live-stage-item" id="live-stage-5">
              <span class="live-stage-icon">${getIcon('shield-check')}</span>
              <span>STAGE 5: GENERATING INVESTIGATION DOSSIER</span>
            </div>
          </div>

          <!-- Live Progress Bar -->
          <div class="live-progress-track">
            <div class="live-progress-bar" id="live-progress-bar" style="width: 20%;"></div>
          </div>

          <div style="margin-top: var(--space-md);">
            <button type="button" class="btn btn-quiet btn-sm" id="btn-skip-anim" style="color: #64748B; font-size: 0.72rem;">
              Skip Animation ➔ Instant Results
            </button>
          </div>
        </div>
      `;

      let stage = 1;
      const progressBar = resultContainer.querySelector('#live-progress-bar');
      const skipBtn = resultContainer.querySelector('#btn-skip-anim');

      let hasCompleted = false;
      const finish = () => {
        if (hasCompleted) return;
        hasCompleted = true;
        if (currentAnimationTimer) clearTimeout(currentAnimationTimer);
        onComplete();
      };

      if (skipBtn) {
        skipBtn.addEventListener('click', finish);
      }

      const advanceStage = () => {
        stage++;
        if (stage <= 5) {
          const prev = resultContainer.querySelector(`#live-stage-${stage - 1}`);
          const curr = resultContainer.querySelector(`#live-stage-${stage}`);
          if (prev) {
            prev.classList.remove('active');
            prev.classList.add('completed');
            prev.querySelector('.live-stage-icon').innerHTML = getIcon('check');
          }
          if (curr) curr.classList.add('active');
          if (progressBar) progressBar.style.width = `${stage * 20}%`;

          currentAnimationTimer = setTimeout(advanceStage, 320);
        } else {
          currentAnimationTimer = setTimeout(finish, 220);
        }
      };

      currentAnimationTimer = setTimeout(advanceStage, 300);
    },

    executeGeminiInspection: async function(url, resultContainer, errorAlert) {
      try {
        const analysisData = await global.CyberShield.GeminiAPI.analyzeUrl(url);
        global.CyberShield.State.getTransient().geminiUrlAnalysis = analysisData;
        global.CyberShield.State.recordUrlInspection();

        this.recordRecentInvestigation(url, analysisData.verdict);

        resultContainer.innerHTML = this.renderIntelligenceDossier(analysisData, url, 'gemini');
        this.attachDossierInteractions(resultContainer, analysisData, url, 'gemini');

        if (global.CyberShield.Sound) {
          if (analysisData.verdict === 'HIGH_RISK') global.CyberShield.Sound.playWarning();
          else global.CyberShield.Sound.playSuccess();
        }

      } catch (err) {
        console.error('Cyber Intelligence AI Inspection Failed:', err);
        this.executeLocalInspection(url, resultContainer, errorAlert);
      }
    },

    executeLocalInspection: function(url, resultContainer, errorAlert) {
      try {
        const parsed = global.CyberShield.UrlParser.parse(url);
        const evaluation = global.CyberShield.UrlRules.evaluate(parsed);
        const result = global.CyberShield.EvidenceAggregator.aggregateUrlResult(evaluation);

        global.CyberShield.State.getTransient().linkInspection = result;
        global.CyberShield.State.recordUrlInspection();

        const verdict = result.overallConcern === 'HIGH_CONCERN' ? 'HIGH_RISK' : result.overallConcern === 'REVIEW_ADVISED' ? 'SUSPICIOUS' : 'LOW_RISK';
        this.recordRecentInvestigation(url, verdict);

        resultContainer.innerHTML = this.renderIntelligenceDossier(result, url, 'local');
        this.attachDossierInteractions(resultContainer, result, url, 'local');

        if (global.CyberShield.Sound) {
          if (result.overallConcern === 'HIGH_CONCERN') global.CyberShield.Sound.playWarning();
          else global.CyberShield.Sound.playSuccess();
        }

      } catch (err) {
        console.error('Local Forensics Inspection Error:', err);
        errorAlert.textContent = `Forensic analysis error: ${err.message}`;
        errorAlert.style.display = 'block';
        resultContainer.innerHTML = '';
      }
    },

    recordRecentInvestigation: function(url, verdict) {
      const transient = global.CyberShield.State.getTransient();
      transient.recentInvestigations = transient.recentInvestigations || [];

      let hostname = url;
      try {
        const u = new URL(url);
        hostname = u.hostname;
      } catch (e) {
        hostname = url.substring(0, 30);
      }

      let verdictClass = 'low-risk';
      if (verdict === 'HIGH_RISK' || verdict === 'HIGH_CONCERN') verdictClass = 'high-risk';
      else if (verdict === 'SUSPICIOUS' || verdict === 'REVIEW_ADVISED') verdictClass = 'suspicious';
      else if (verdict === 'UNCERTAIN') verdictClass = 'uncertain';

      // Avoid duplicates
      transient.recentInvestigations = transient.recentInvestigations.filter(item => item.url !== url);
      transient.recentInvestigations.unshift({
        url: url,
        hostname: hostname,
        verdictClass: verdictClass
      });

      if (transient.recentInvestigations.length > 5) {
        transient.recentInvestigations.pop();
      }
    },

    /**
     * Component Educational Knowledge for Interactive Anatomy Explorer (Idea 6)
     */
    getAnatomyExplanation: function(tokenType, parsed) {
      switch (tokenType) {
        case 'scheme':
          return {
            title: 'Protocol Scheme',
            value: parsed.scheme || 'https:',
            meaning: 'Defines how the browser negotiates network transport encryption (HTTPS vs unencrypted HTTP).',
            control: 'Defined by the web server configuration.',
            scamTactic: 'Crucial Truth: HTTPS only encrypts communication against eavesdropping on public Wi-Fi. Scammers frequently obtain free SSL certificates; the presence of a green lock does NOT certify the website is legitimate or harmless!'
          };
        case 'subdomain':
          return {
            title: 'Subdomain Prefix Hierarchy',
            value: parsed.subdomain || '(none)',
            meaning: 'Arbitrary name segments prepended to the authoritative domain for routing.',
            control: '100% controlled by whoever owns the authoritative root domain.',
            scamTactic: 'Top Deception Trick: Scammers register random domains like "security-alert.invalid" and add "paypal.com." as a subdomain ("http://paypal.com.security-alert.invalid"). Casual victims only read the beginning and mistakenly believe they are on PayPal!'
          };
        case 'domain':
          return {
            title: 'Authoritative Registrable Domain',
            value: parsed.registrableDomain || parsed.hostname || 'Unknown',
            meaning: 'The true root organization registered with an official ICANN domain registrar.',
            control: 'The legal owner / registrant of the domain.',
            scamTactic: 'Domain Squatting & Typosquatting: Scammers register visual lookalikes using character substitutions (paypa1.com, netfIix.com) or Punycode IDN homographs (xn--pple-43d.com) to mimic genuine organizations.'
          };
        case 'port':
          return {
            title: 'Network Port',
            value: parsed.port || '(default 443 / 80)',
            meaning: 'The specific network communication socket on the destination server.',
            control: 'Server administrator network configuration.',
            scamTactic: 'Unusual ports (e.g. :8080, :8443, :8888) can bypass corporate filters or point to unauthorized local staging environments.'
          };
        case 'path':
          return {
            title: 'Resource Path',
            value: parsed.pathname || '/',
            meaning: 'The specific folder or internal route requested on the destination server.',
            control: 'Host server file system and routing application.',
            scamTactic: 'Social Engineering Keywords: Fraudsters craft paths like "/verify-otp", "/claim-reward-9921", or "/account-blocked" to heighten panic and urgency once the victim lands on the page.'
          };
        case 'query':
          return {
            title: 'Query String Parameters',
            value: parsed.search || '(none)',
            meaning: 'Key-value data payload passed to the server after the "?" delimiter.',
            control: 'Client application or tracking link generator.',
            scamTactic: 'Phishing kits use query parameters like "?email=victim@target.com" or "?token=xyz" to pre-fill victim details and make fake login portals look eerily personalized and authentic.'
          };
        default:
          return {
            title: 'URL Component',
            value: 'Select any token above',
            meaning: 'Click on any part of the URL above to inspect its forensic role.',
            control: 'Web Architecture',
            scamTactic: 'Explore subdomains, registrable root domains, protocols, and query parameters to understand how deceptive links are assembled.'
          };
      }
    },

    /**
     * 🏆 SUGGESTED FINAL LAYOUT:
     * Combines Cyber Intelligence Center + Digital Forensics Lab + 
     * Threat Evidence Cards + URL Anatomy Explorer + Explainable Risk Matrix + Exportable Report
     */
    renderIntelligenceDossier: function(data, url, engine) {
      const getIcon = global.CyberShield.getIcon;
      const escape = global.CyberShield.SafeRender.escapeHtml;

      const invId = generateInvestigationId();
      const timestamp = getFormattedTimestamp();

      // Normalize fields across Gemini AI or Local Engine
      let parsed = {};
      try {
        parsed = global.CyberShield.UrlParser.parse(url);
      } catch (e) {
        parsed = { scheme: 'https:', hostname: 'unknown', registrableDomain: 'unknown', subdomain: '', pathname: '/', search: '' };
      }

      let verdict = 'LOW_RISK';
      let verdictTitle = 'LOW RISK: NO OBVIOUS ANOMALIES';
      let verdictBannerClass = 'low-risk';
      let riskScore = 0;
      let summaryText = '';
      let evidenceList = [];
      let redFlags = [];
      let checksPerformed = [];
      let limitations = [];
      let recommendedActions = [];

      if (engine === 'gemini') {
        verdict = data.verdict || 'LOW_RISK';
        riskScore = Math.max(0, Math.min(100, data.riskScore || 0));
        summaryText = data.summary || 'URL string evaluated against deceptive structural patterns.';
        redFlags = data.redFlags || [];
        evidenceList = data.evidence || [];
        checksPerformed = data.checksPerformed || [
          'RFC 3986 Lexical Tokenization',
          'Authoritative Registrable Domain Hierarchy',
          'Deceptive Subdomain Impersonation Matching',
          'Punycode / Homograph IDN Inspection',
          'Known URL Shortener Cloaking Detection'
        ];
        limitations = data.limitations || [
          'No Automated Page Fetch: CyberShield never executes untrusted remote JavaScript.',
          'HTTPS Caveat: Transport encryption does not verify brand ownership.',
          'Domain Age & Zero-Days: Brand-new unflagged domains require sender verification.'
        ];
        recommendedActions = data.recommendedActions || [
          'Verify sender authenticity through an independent official channel.',
          'Never enter banking credentials or OTPs on unverified domains.'
        ];
      } else {
        // Local engine result normalization
        const r = data;
        if (r.overallConcern === 'HIGH_CONCERN') verdict = 'HIGH_RISK';
        else if (r.overallConcern === 'REVIEW_ADVISED') verdict = 'SUSPICIOUS';
        else verdict = 'LOW_RISK';

        riskScore = r.overallConcern === 'HIGH_CONCERN' ? 90 : r.overallConcern === 'REVIEW_ADVISED' ? 55 : 10;
        summaryText = r.disclaimer || 'URL evaluated locally using 10 RFC-compliant heuristic rules.';
        redFlags = (r.matches || []).map(m => `${m.name}: ${m.explanation}`);
        evidenceList = (r.matches || []).map(m => `Matched: ${m.name} (${m.evidence})`);
        checksPerformed = [
          'Local RFC URL Anatomy Tokenizer',
          'Authoritative Multi-Part TLD Parser (.co.uk, .com.au, etc.)',
          'Raw IPv4/IPv6 Hostname Detection',
          'User-Info Delimiter (@) Redirection Detector',
          'Deceptive Brand Subdomain Rule Catalog'
        ];
        limitations = r.whatWasNotChecked || [
          'Real-time DNS blocklists and threat intelligence feeds not queried.',
          'Destination website content not downloaded or crawled.'
        ];
        recommendedActions = r.safeNextSteps || [
          'Examine the authoritative domain carefully before entering sensitive data.',
          'If in doubt, use a verified bookmark or official mobile application.'
        ];
      }

      if (verdict === 'HIGH_RISK') {
        verdictBannerClass = 'high-risk';
        verdictTitle = 'HIGH RISK: PHISHING / DECEPTIVE INDICATORS';
      } else if (verdict === 'SUSPICIOUS') {
        verdictBannerClass = 'suspicious';
        verdictTitle = 'SUSPICIOUS: OBSERVABLE WARNING SIGNS';
      } else if (verdict === 'UNCERTAIN') {
        verdictBannerClass = 'uncertain';
        verdictTitle = 'UNCERTAIN: UNVERIFIED DOMAIN CONTEXT';
      } else {
        verdictBannerClass = 'low-risk';
        verdictTitle = 'LOW RISK: NO OBVIOUS HEURISTIC RED FLAGS';
      }

      // Default active anatomy info
      const defaultAnatomy = this.getAnatomyExplanation('domain', parsed);

      return `
        <div class="intel-dossier-wrapper" id="intel-dossier-wrapper">
          <!-- 1. Dossier Top Bar (Investigation Metadata) -->
          <div class="intel-dossier-topbar">
            <div class="intel-id-group">
              <span class="intel-id-tag">${escape(invId)}</span>
              <span style="font-size: var(--font-size-xs); color: #94A3B8;">${escape(timestamp)}</span>
              <span class="intel-dossier-target" title="${escape(url)}">
                Target: <strong>${escape(url.length > 55 ? url.substring(0, 52) + '...' : url)}</strong>
              </span>
            </div>
            <div>
              <div class="intel-verdict-banner ${verdictBannerClass}">
                ${getIcon(verdict === 'HIGH_RISK' ? 'alert-triangle' : verdict === 'SUSPICIOUS' ? 'alert-circle' : 'shield-check')}
                <span>${escape(verdictTitle)}</span>
              </div>
            </div>
          </div>

          <!-- 2. Two-Column Tactical Layout Grid -->
          <div class="intel-layout-grid">
            
            <!-- LEFT PANEL: URL Structure & Digital Forensics Lab -->
            <div class="intel-left-column">
              
              <!-- 6. 🗺️ URL ANATOMY EXPLORER -->
              <div class="intel-panel-card">
                <div class="intel-card-header">
                  <div class="intel-card-title">
                    ${getIcon('map-pin')} 6. URL Anatomy Explorer (Interactive Tokens)
                  </div>
                  <span style="font-size: 0.72rem; color: #818cf8;">Click component to inspect</span>
                </div>

                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 8px;">
                  Click any color-coded component below to examine who controls it and how deceptive links manipulate it:
                </p>

                <!-- Interactive Token Strip -->
                <div class="anatomy-token-strip" id="anatomy-token-strip">
                  <button type="button" class="anatomy-token-btn token-scheme" data-token-type="scheme">
                    ${escape(parsed.scheme)}//
                  </button>
                  ${parsed.subdomain ? `
                    <button type="button" class="anatomy-token-btn token-subdomain" data-token-type="subdomain">
                      ${escape(parsed.subdomain)}.
                    </button>
                  ` : ''}
                  <button type="button" class="anatomy-token-btn token-domain active" data-token-type="domain">
                    ${escape(parsed.registrableDomain || parsed.hostname)}
                  </button>
                  ${parsed.port ? `
                    <button type="button" class="anatomy-token-btn token-path" data-token-type="port">
                      :${escape(parsed.port)}
                    </button>
                  ` : ''}
                  <button type="button" class="anatomy-token-btn token-path" data-token-type="path">
                    ${escape(parsed.pathname || '/')}
                  </button>
                  ${parsed.search ? `
                    <button type="button" class="anatomy-token-btn token-query" data-token-type="query">
                      ${escape(parsed.search)}
                    </button>
                  ` : ''}
                </div>

                <!-- Dynamic Anatomy Detail Card -->
                <div class="anatomy-detail-box" id="anatomy-detail-box">
                  <div class="anatomy-detail-tag" id="anatomy-detail-tag">
                    ${getIcon('info')} <span>${escape(defaultAnatomy.title)}</span>
                  </div>
                  <div class="anatomy-detail-value" id="anatomy-detail-value">
                    ${escape(defaultAnatomy.value)}
                  </div>
                  <p class="anatomy-detail-text" id="anatomy-detail-text">
                    <strong>Architectural Role:</strong> ${escape(defaultAnatomy.meaning)}<br>
                    <strong>Administrative Control:</strong> ${escape(defaultAnatomy.control)}<br>
                    <strong>Forensic Warning:</strong> ${escape(defaultAnatomy.scamTactic)}
                  </p>
                </div>
              </div>

              <!-- 2. 🔬 DIGITAL FORENSICS LAB (5 Investigation Stages) -->
              <div class="intel-panel-card">
                <div class="intel-card-header">
                  <div class="intel-card-title">
                    ${getIcon('activity')} 2. Digital Forensics Lab (5-Stage Breakdown)
                  </div>
                  <span class="badge badge-brand">Forensic Depth</span>
                </div>

                <!-- Stage 1 -->
                <div class="forensics-stage-item">
                  <div class="forensics-stage-head">
                    <span class="forensics-stage-name">Stage 1: URL Structure Verification</span>
                    <span class="matrix-status-pill pass">Parsed RFC 3986</span>
                  </div>
                  <p class="forensics-stage-desc">
                    Verified strict URI syntax. Extracted protocol scheme (${escape(parsed.scheme)}), hostname, path, and parameters without executing remote resources.
                  </p>
                </div>

                <!-- Stage 2 -->
                <div class="forensics-stage-item">
                  <div class="forensics-stage-head">
                    <span class="forensics-stage-name">Stage 2: Domain Hierarchy & Root Inspection</span>
                    <span class="matrix-status-pill ${parsed.subdomain && parsed.subdomain.includes('paypal') ? 'alert' : 'pass'}">
                      Authoritative Root: ${escape(parsed.registrableDomain || parsed.hostname)}
                    </span>
                  </div>
                  <p class="forensics-stage-desc">
                    Distinguished authoritative registrable root domain from user-controlled prefix subdomains. The destination legal owner is strictly <strong>${escape(parsed.registrableDomain || parsed.hostname)}</strong>.
                  </p>
                </div>

                <!-- Stage 3 -->
                <div class="forensics-stage-item">
                  <div class="forensics-stage-head">
                    <span class="forensics-stage-name">Stage 3: Suspicious Deception Indicators</span>
                    <span class="matrix-status-pill ${redFlags.length > 0 ? 'alert' : 'pass'}">
                      ${redFlags.length > 0 ? `${redFlags.length} Indicators Flagged` : 'No Deceptive Triggers'}
                    </span>
                  </div>
                  <p class="forensics-stage-desc">
                    Scanned for lookalike homoglyphs, brand keyword stuffing in subdomains, raw IP host addresses, user-info (@) delimiters, and known URL shortener redirects.
                  </p>
                </div>

                <!-- Stage 4 -->
                <div class="forensics-stage-item">
                  <div class="forensics-stage-head">
                    <span class="forensics-stage-name">Stage 4: Reputation & External Connectivity</span>
                    <span class="matrix-status-pill neutral">Local Heuristics Only</span>
                  </div>
                  <p class="forensics-stage-desc">
                    Transparent limitation note: No live commercial threat intelligence feeds or real-time zero-day DNS reputation services queried.
                  </p>
                </div>

                <!-- Stage 5 -->
                <div class="forensics-stage-item">
                  <div class="forensics-stage-head">
                    <span class="forensics-stage-name">Stage 5: Final Forensic Assessment</span>
                    <span class="matrix-status-pill ${verdictBannerClass}">${escape(verdict)}</span>
                  </div>
                  <p class="forensics-stage-desc">
                    ${escape(summaryText)}
                  </p>
                </div>
              </div>
            </div>

            <!-- RIGHT PANEL: Risk Assessment & Threat Evidence Cards -->
            <div class="intel-right-column">
              
              <!-- 5. 🧠 EXPLAINABLE RISK ASSESSMENT SCORECARD -->
              <div class="intel-panel-card">
                <div class="intel-card-header">
                  <div class="intel-card-title">
                    ${getIcon('help-circle')} 5. Explainable Risk Assessment
                  </div>
                  <span style="font-size: 0.72rem; color: #94A3B8;">Transparent indicator scoring</span>
                </div>

                <!-- Risk Score Bar -->
                <div class="explainable-score-row">
                  <div>
                    <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: #94A3B8; letter-spacing: 0.05em;">
                      Heuristic Risk Score
                    </span>
                    <div style="font-size: 1.5rem; font-weight: 800; font-family: var(--font-family-mono); color: ${riskScore > 70 ? '#EF4444' : riskScore > 35 ? '#F59E0B' : '#10B981'};">
                      ${riskScore} <span style="font-size: 0.9rem; color: #64748B;">/ 100</span>
                    </div>
                  </div>
                  <div style="text-align: right; max-width: 220px;">
                    <span style="font-size: 0.72rem; color: var(--color-text-secondary); line-height: 1.4; display: block;">
                      ${riskScore > 70 ? 'High probability of credential harvesting or brand spoofing.' : riskScore > 35 ? 'Observable structural anomalies detected. Exercise caution.' : 'No observable deception detected in link format.'}
                    </span>
                  </div>
                </div>

                <!-- Indicator Scorecard Table -->
                <table class="explainable-matrix-table" aria-label="Forensic Indicator Scorecard">
                  <thead>
                    <tr>
                      <th>Forensic Indicator</th>
                      <th>Finding</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>URL Format</strong></td>
                      <td>Parsed successfully via RFC 3986</td>
                      <td><span class="matrix-status-pill pass">Valid</span></td>
                    </tr>
                    <tr>
                      <td><strong>Protocol Encryption</strong></td>
                      <td>${escape(parsed.scheme || 'http:')} scheme</td>
                      <td><span class="matrix-status-pill ${parsed.scheme === 'https:' ? 'pass' : 'warn'}">${parsed.scheme === 'https:' ? 'Encrypted' : 'Insecure'}</span></td>
                    </tr>
                    <tr>
                      <td><strong>Authoritative Root</strong></td>
                      <td>${escape(parsed.registrableDomain || parsed.hostname)}</td>
                      <td><span class="matrix-status-pill pass">Documented</span></td>
                    </tr>
                    <tr>
                      <td><strong>Subdomain Deception</strong></td>
                      <td>${parsed.subdomain ? escape(parsed.subdomain) : 'No subdomain'}</td>
                      <td><span class="matrix-status-pill ${parsed.subdomain && (parsed.subdomain.includes('paypal') || parsed.subdomain.includes('login') || parsed.subdomain.includes('secure')) ? 'alert' : 'pass'}">${parsed.subdomain && (parsed.subdomain.includes('paypal') || parsed.subdomain.includes('login') || parsed.subdomain.includes('secure')) ? 'Deceptive' : 'Normal'}</span></td>
                    </tr>
                    <tr>
                      <td><strong>External Threat Feed</strong></td>
                      <td>Client-side local heuristics</td>
                      <td><span class="matrix-status-pill neutral">Not Checked</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 4. 🎯 THREAT EVIDENCE CARDS (Modular & Expandable) -->
              <div class="intel-panel-card">
                <div class="intel-card-header">
                  <div class="intel-card-title">
                    ${getIcon('alert-triangle')} 4. Threat Evidence Cards
                  </div>
                  <span style="font-size: 0.72rem; color: #818cf8;">Click to expand evidence</span>
                </div>

                <div class="threat-evidence-stack">
                  <!-- Evidence Card 01: Domain Hierarchy -->
                  <div class="threat-evidence-item ${parsed.subdomain && parsed.subdomain.includes('paypal') ? 'flagged' : 'clean'}">
                    <div class="threat-card-top" data-drawer-target="drawer-ev-01">
                      <div class="threat-card-num-title">
                        <span class="threat-card-num">01</span>
                        <span class="threat-card-title">DOMAIN & REGISTRABLE ROOT</span>
                      </div>
                      <span class="badge ${parsed.subdomain && parsed.subdomain.includes('paypal') ? 'badge-danger' : 'badge-success'}">
                        ${parsed.subdomain && parsed.subdomain.includes('paypal') ? 'Deceptive Subdomain' : 'Consistent Root'}
                      </span>
                    </div>
                    <div class="threat-card-snippet ${parsed.subdomain && parsed.subdomain.includes('paypal') ? '' : 'clean'}">
                      Target Root: ${escape(parsed.registrableDomain || parsed.hostname)}
                    </div>
                    <div class="threat-card-drawer" id="drawer-ev-01">
                      <div class="threat-drawer-section">
                        <span class="threat-drawer-label">Forensic Finding:</span>
                        ${parsed.subdomain && parsed.subdomain.includes('paypal') 
                          ? 'The hostname places a reputable brand name ("paypal") in the prefix subdomain, while delegating actual authority to an unrelated root domain.' 
                          : 'The authoritative registrable domain matches the apparent destination without obvious prefix spoofing.'}
                      </div>
                      <div class="threat-drawer-section">
                        <span class="threat-drawer-label">Technical Limitation:</span>
                        Domain registration age and WHOIS ownership details are not checked in offline mode.
                      </div>
                    </div>
                  </div>

                  <!-- Evidence Card 02: URL Pattern & Path -->
                  <div class="threat-evidence-item ${parsed.pathname && (parsed.pathname.includes('login') || parsed.pathname.includes('verify') || parsed.pathname.includes('checkout')) ? 'caution-flagged' : 'clean'}">
                    <div class="threat-card-top" data-drawer-target="drawer-ev-02">
                      <div class="threat-card-num-title">
                        <span class="threat-card-num">02</span>
                        <span class="threat-card-title">URL PATH & ACTION TARGET</span>
                      </div>
                      <span class="badge ${parsed.pathname && (parsed.pathname.includes('login') || parsed.pathname.includes('verify') || parsed.pathname.includes('checkout')) ? 'badge-warning' : 'badge-success'}">
                        ${parsed.pathname && (parsed.pathname.includes('login') || parsed.pathname.includes('verify')) ? 'Action Trigger' : 'Standard Path'}
                      </span>
                    </div>
                    <div class="threat-card-snippet ${parsed.pathname && (parsed.pathname.includes('login') || parsed.pathname.includes('verify')) ? '' : 'clean'}">
                      Resource: ${escape(parsed.pathname || '/')}
                    </div>
                    <div class="threat-card-drawer" id="drawer-ev-02">
                      <div class="threat-drawer-section">
                        <span class="threat-drawer-label">Forensic Finding:</span>
                        ${parsed.pathname && (parsed.pathname.includes('login') || parsed.pathname.includes('verify')) 
                          ? 'The path contains account-action keywords ("login/verify"). When combined with an unfamiliar root domain, this strongly suggests credential harvesting.' 
                          : 'No urgent or manipulative keywords observed in the resource path.'}
                      </div>
                      <div class="threat-drawer-section">
                        <span class="threat-drawer-label">Technical Limitation:</span>
                        Legitimate services also use "/login" paths; this indicator must be evaluated alongside the authoritative domain.
                      </div>
                    </div>
                  </div>

                  <!-- Evidence Card 03: Transport Protocol -->
                  <div class="threat-evidence-item ${parsed.scheme === 'http:' ? 'flagged' : 'clean'}">
                    <div class="threat-card-top" data-drawer-target="drawer-ev-03">
                      <div class="threat-card-num-title">
                        <span class="threat-card-num">03</span>
                        <span class="threat-card-title">TRANSPORT SECURITY PROTOCOL</span>
                      </div>
                      <span class="badge ${parsed.scheme === 'http:' ? 'badge-danger' : 'badge-success'}">
                        ${parsed.scheme === 'http:' ? 'Unencrypted HTTP' : 'HTTPS Transit'}
                      </span>
                    </div>
                    <div class="threat-card-snippet ${parsed.scheme === 'http:' ? '' : 'clean'}">
                      Protocol: ${escape(parsed.scheme)}
                    </div>
                    <div class="threat-card-drawer" id="drawer-ev-03">
                      <div class="threat-drawer-section">
                        <span class="threat-drawer-label">Forensic Finding:</span>
                        ${parsed.scheme === 'http:' 
                          ? 'Unencrypted plain HTTP link. Passwords and personal data can be intercepted by anyone on the local network or Wi-Fi.' 
                          : 'HTTPS protocol is enabled. Traffic is encrypted in transit between your browser and the remote server.'}
                      </div>
                      <div class="threat-drawer-section">
                        <span class="threat-drawer-label">Crucial Caveat:</span>
                        HTTPS provides wire encryption, NOT proof of honesty. Over 80% of modern phishing websites use valid HTTPS certificates.
                      </div>
                    </div>
                  </div>

                  <!-- Evidence Card 04: Observable Red Flags -->
                  ${redFlags.length > 0 ? `
                    <div class="threat-evidence-item flagged">
                      <div class="threat-card-top" data-drawer-target="drawer-ev-04">
                        <div class="threat-card-num-title">
                          <span class="threat-card-num">04</span>
                          <span class="threat-card-title">HEURISTIC FLAGS (${redFlags.length})</span>
                        </div>
                        <span class="badge badge-danger">Attention Required</span>
                      </div>
                      <div class="threat-card-snippet">
                        ${escape(redFlags[0])}
                      </div>
                      <div class="threat-card-drawer" id="drawer-ev-04">
                        <ul style="padding-left: 18px; margin: 4px 0 0 0;">
                          ${redFlags.map(rf => `<li>${escape(rf)}</li>`).join('')}
                        </ul>
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>

          <!-- 3. BOTTOM SECTION: Recommended Safe Next Steps & Investigation Report Export Toolbar -->
          <div class="intel-bottom-card">
            <div class="intel-card-header">
              <div class="intel-card-title">
                ${getIcon('shield-check')} 7. Recommended Safe Actions & Investigation Timeline
              </div>
              <span class="intel-id-tag">Case: ${escape(invId)}</span>
            </div>

            <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-sm);">
              Based on the digital forensic indicators identified above, the following tactical safe steps are advised:
            </p>

            <ul class="containment-list">
              ${recommendedActions.map(action => `<li>${escape(action)}</li>`).join('')}
              <li><strong>Emergency Financial Cyber Helpline:</strong> If you have already entered banking credentials, UPI PIN, or sent money, dial <strong>1930</strong> immediately to freeze cyber fraud transactions.</li>
            </ul>

            <!-- Report Export Toolbar (Idea 7) -->
            <div class="intel-export-toolbar">
              <button type="button" class="btn btn-primary" id="btn-export-dossier-file">
                ${getIcon('download')}
                <span>Download Forensic Report (.txt)</span>
              </button>
              <button type="button" class="btn btn-secondary" id="btn-copy-dossier-clipboard">
                ${getIcon('copy')}
                <span>Copy Full Dossier</span>
              </button>
              <button type="button" class="btn btn-secondary" id="btn-print-dossier">
                ${getIcon('file-text')}
                <span>Print / Save as PDF</span>
              </button>
              <button type="button" class="btn btn-secondary" id="btn-investigate-another-url" style="margin-left: auto;">
                ${getIcon('rotate-ccw')}
                <span>Investigate Another Link</span>
              </button>
            </div>
          </div>
        </div>
      `;
    },

    attachDossierInteractions: function(container, data, url, engine) {
      const parsed = global.CyberShield.UrlParser.parse(url);
      const invId = container.querySelector('.intel-id-tag')?.textContent || 'CS-INV';

      // 1. Interactive URL Anatomy Explorer (Idea 6)
      const tokenBtns = container.querySelectorAll('.anatomy-token-btn');
      const detailTag = container.querySelector('#anatomy-detail-tag');
      const detailValue = container.querySelector('#anatomy-detail-value');
      const detailText = container.querySelector('#anatomy-detail-text');

      tokenBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tokenBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const tokenType = btn.dataset.tokenType;
          const info = this.getAnatomyExplanation(tokenType, parsed);

          if (detailTag && detailValue && detailText) {
            detailTag.innerHTML = `${global.CyberShield.getIcon('info')} <span>${global.CyberShield.SafeRender.escapeHtml(info.title)}</span>`;
            detailValue.textContent = info.value;
            detailText.innerHTML = `
              <strong>Architectural Role:</strong> ${global.CyberShield.SafeRender.escapeHtml(info.meaning)}<br>
              <strong>Administrative Control:</strong> ${global.CyberShield.SafeRender.escapeHtml(info.control)}<br>
              <strong>Forensic Warning:</strong> ${global.CyberShield.SafeRender.escapeHtml(info.scamTactic)}
            `;
          }
        });
      });

      // 2. Expand/Collapse Threat Evidence Cards (Idea 4)
      const cardTops = container.querySelectorAll('.threat-card-top');
      cardTops.forEach(top => {
        top.addEventListener('click', () => {
          const targetId = top.dataset.drawerTarget;
          const drawer = container.querySelector(`#${targetId}`);
          if (drawer) {
            const isHidden = drawer.style.display === 'none';
            drawer.style.display = isHidden ? 'block' : 'none';
          }
        });
      });

      // 3. Download Investigation Report File (Idea 7)
      const downloadBtn = container.querySelector('#btn-export-dossier-file');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          this.downloadReportText(data, url, parsed, invId, engine);
        });
      }

      // 4. Copy Full Dossier
      const copyBtn = container.querySelector('#btn-copy-dossier-clipboard');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const reportText = this.buildReportString(data, url, parsed, invId, engine);
          navigator.clipboard.writeText(reportText).then(() => {
            const original = copyBtn.innerHTML;
            copyBtn.innerHTML = `${global.CyberShield.getIcon('check')} Copied!`;
            setTimeout(() => { copyBtn.innerHTML = original; }, 2000);
          }).catch(e => console.warn('Clipboard copy error:', e));
        });
      }

      // 5. Print Dossier
      const printBtn = container.querySelector('#btn-print-dossier');
      if (printBtn) {
        printBtn.addEventListener('click', () => window.print());
      }

      // 6. Investigate Another Link
      const anotherBtn = container.querySelector('#btn-investigate-another-url');
      if (anotherBtn) {
        anotherBtn.addEventListener('click', () => {
          const input = document.querySelector('#url-inspector-input');
          if (input) {
            input.value = '';
            input.focus();
          }
          container.innerHTML = '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    },

    buildReportString: function(data, url, parsed, invId, engine) {
      const isGemini = engine === 'gemini';
      const verdict = isGemini ? (data.verdict || 'LOW_RISK') : (data.overallConcern || 'LOW_CONCERN');
      const score = isGemini ? (data.riskScore || 0) : (verdict.includes('HIGH') ? 90 : 10);
      const summary = isGemini ? (data.summary || '') : (data.disclaimer || '');
      const redFlags = isGemini ? (data.redFlags || []) : (data.matches || []).map(m => m.name);
      const actions = isGemini ? (data.recommendedActions || []) : (data.safeNextSteps || []);

      return [
        '=================================================================',
        ' CYBERSHIELD — DIGITAL FORENSIC LINK INVESTIGATION DOSSIER',
        '=================================================================',
        `Investigation ID : ${invId}`,
        `Analysis Time    : ${getFormattedTimestamp()}`,
        `Analysis Engine  : ${isGemini ? 'CyberShield Helper AI (Gemini Flash)' : 'Local Forensics Engine'}`,
        '-----------------------------------------------------------------',
        `Target URL       : ${url}`,
        `Protocol Scheme  : ${parsed.scheme}`,
        `Authoritative Root: ${parsed.registrableDomain || parsed.hostname}`,
        `Subdomain Prefix : ${parsed.subdomain || '(none)'}`,
        `Resource Path    : ${parsed.pathname || '/'}`,
        '-----------------------------------------------------------------',
        `FORENSIC VERDICT : ${verdict}`,
        `RISK SCORE       : ${score} / 100`,
        `ANALYST SUMMARY  : ${summary}`,
        '-----------------------------------------------------------------',
        'OBSERVED RED FLAGS & WARNING INDICATORS:',
        redFlags.length > 0 ? redFlags.map((rf, i) => `  ${i + 1}. ${rf}`).join('\n') : '  None observed.',
        '-----------------------------------------------------------------',
        'RECOMMENDED SAFE MITIGATION ACTIONS:',
        actions.map((act, i) => `  ${i + 1}. ${act}`).join('\n'),
        '-----------------------------------------------------------------',
        'TRANSPARENCY & LIMITATIONS DISCLAIMER:',
        '  * CyberShield evaluates observable lexical heuristics without fetching remote code.',
        '  * HTTPS encryption guarantees wire privacy, NOT author authenticity.',
        '  * For emergency financial cyber fraud reporting in India, dial 1930.',
        '================================================================='
      ].join('\n');
    },

    downloadReportText: function(data, url, parsed, invId, engine) {
      const text = this.buildReportString(data, url, parsed, invId, engine);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `CyberShield_Investigation_${invId}.txt`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      }, 200);
    }
  };

  global.CyberShield.LinkInspectorModule = LinkInspectorModule;
})(window);
