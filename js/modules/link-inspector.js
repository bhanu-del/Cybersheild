/**
 * CyberShield — Link & QR Inspector Module
 * Dual-Engine Architecture:
 * 1. Google Gemini AI Deep Link Inspector (Context-Aware Scam & Phishing Engine)
 * 2. On-Device Local Anatomy Deconstructor & Offline QR Scanner (100% Offline)
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

    cleanup: function() {},

    render: function(container) {
      const getIcon = global.CyberShield.getIcon;
      const transient = global.CyberShield.State.getTransient();

      container.innerHTML = `
        <div class="card" style="margin-bottom: var(--space-xl);">
          <div class="card-header">
            <div class="card-title-group">
              <h1 class="card-title" style="font-size: var(--font-size-lg);">Link & QR Inspector</h1>
              <span class="card-subtitle">Examine web addresses, deceptive subdomains, and QR codes safely without opening or visiting them</span>
            </div>
            <div class="badge badge-brand" id="active-link-engine-badge">
              ${getIcon('cpu')} CyberShield Helper Connected
            </div>
          </div>

          <!-- Engine Selector Toggle -->
          <div style="padding: var(--space-sm) var(--space-xl) 0;">
            <div class="ai-engine-selector" role="tablist" aria-label="Select Link Analysis Engine">
              <button type="button" class="ai-engine-tab ${currentEngine === 'gemini' ? 'active' : ''}" id="tab-link-engine-gemini" role="tab" aria-selected="${currentEngine === 'gemini'}">
                ${getIcon('zap')}
                <span>CyberShield Helper Link Inspector</span>
              </button>
              <button type="button" class="ai-engine-tab ${currentEngine === 'local' ? 'active' : ''}" id="tab-link-engine-local" role="tab" aria-selected="${currentEngine === 'local'}">
                ${getIcon('lock')}
                <span>Local Anatomy & Rules Engine (Offline)</span>
              </button>
            </div>
          </div>

          <!-- Mode Tabs (URL vs QR) -->
          <div style="display: flex; gap: var(--space-xs); padding: var(--space-xs) var(--space-xl) 0; border-bottom: 1px solid var(--color-border-subtle); background-color: var(--color-bg-subtle);">
            <button class="chip-btn ${activeTab === 'url' ? 'active' : ''}" id="tab-mode-url">
              ${getIcon('link', 'icon-inline')} URL Address Inspector
            </button>
            <button class="chip-btn ${activeTab === 'qr' ? 'active' : ''}" id="tab-mode-qr">
              ${getIcon('maximize', 'icon-inline')} QR Code Scanner (Quishing)
            </button>
          </div>

          <div class="card-body">
            <!-- URL Tab Content -->
            <div id="panel-tab-url" style="${activeTab === 'url' ? 'display: block;' : 'display: none;'}">
              <!-- QR Decoded Notification Banner -->
              <div id="url-inspector-notice" class="alert alert-success" style="display: none; margin-bottom: var(--space-md);"></div>

              <div class="form-group inspector-input-box">
                <label class="form-label" for="url-inspector-input">
                  <span>Enter or Paste HTTP / HTTPS Address</span>
                  <span class="form-hint">Max 4 KB (4,096 characters)</span>
                </label>
                <div class="url-input-wrapper">
                  <span class="url-input-icon">${getIcon('search')}</span>
                  <input 
                    type="text" 
                    id="url-inspector-input" 
                    class="form-control url-input-field" 
                    placeholder="https://example.com/path?param=value (or paste naked domain like google.com)" 
                    spellcheck="false"
                    autocomplete="off"
                  />
                </div>

                <!-- Sample Buttons -->
                <div class="sample-pills">
                  <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); font-weight: var(--font-weight-medium);">
                    Load Fictional Sample:
                  </span>
                  ${SAMPLE_URLS.map((sample, idx) => `
                    <button type="button" class="sample-pill-btn" data-sample-idx="${idx}">
                      ${sample.label}
                    </button>
                  `).join('')}
                </div>

                <!-- Validation Error Alert with Smart Auto-Fix -->
                <div id="url-inspector-error" class="alert alert-warning" style="display: none; margin-top: var(--space-md);"></div>
              </div>

              <!-- Action Controls -->
              <div style="display: flex; gap: var(--space-sm); align-items: center; flex-wrap: wrap;">
                <button class="btn btn-primary btn-lg" id="btn-inspect-url">
                  ${getIcon('search')}
                  <span id="btn-inspect-url-text">Inspect URL with ${currentEngine === 'gemini' ? 'CyberShield Helper' : 'Local Engine'}</span>
                </button>
                <button class="btn btn-secondary" id="btn-clear-url">Clear</button>
              </div>
            </div>

            <!-- QR Code Tab Content -->
            <div id="panel-tab-qr" style="${activeTab === 'qr' ? 'display: block;' : 'display: none;'}">
              <div style="border: 2px dashed var(--color-border); border-radius: var(--radius-lg); padding: var(--space-2xl); text-align: center; background-color: var(--color-bg-subtle); cursor: pointer; transition: all var(--transition-fast);" id="qr-dropzone">
                <div class="empty-icon-box" style="margin: 0 auto var(--space-md);">
                  ${getIcon('maximize')}
                </div>
                <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: 4px;">
                  Drag & Drop a QR Code Image Here
                </h3>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-md);">
                  Supports PNG, JPG, WebP images. Analyzed entirely client-side on HTML5 Canvas without network uploads.
                </p>
                <input type="file" id="qr-file-input" accept="image/*" style="display: none;">
                <button type="button" class="btn btn-secondary btn-sm" id="btn-choose-qr-file">
                  Browse Image File
                </button>
              </div>

              <!-- Preloaded QR Code Samples -->
              <div class="sample-pills" style="margin-top: var(--space-md);">
                <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); font-weight: var(--font-weight-medium);">
                  Load Fictional QR Sample:
                </span>
                ${SAMPLE_QRS.map((sq, idx) => `
                  <button type="button" class="sample-pill-btn qr-sample-pill" data-qr-idx="${idx}">
                    ${sq.label}
                  </button>
                `).join('')}
              </div>

              <!-- QR Processing Status & Results -->
              <div id="qr-decode-status" style="margin-top: var(--space-lg); display: none;"></div>
            </div>
          </div>
        </div>

        <!-- Result Container -->
        <div id="url-inspection-result">
          ${transient.geminiUrlAnalysis 
            ? this.renderGeminiUrlResultMarkup(transient.geminiUrlAnalysis, transient.lastInspectedUrl || '') 
            : transient.linkInspection 
              ? this.renderLocalResultMarkup(transient.linkInspection) 
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
      const sampleBtns = container.querySelectorAll('.sample-pill-btn:not(.qr-sample-pill)');

      // Tab switcher
      tabUrl.addEventListener('click', () => this.switchToUrlTab());
      tabQr.addEventListener('click', () => this.switchToQrTab());

      // Engine switcher
      const switchEngine = (newEngine) => {
        currentEngine = newEngine;
        tabGemini.classList.toggle('active', currentEngine === 'gemini');
        tabLocal.classList.toggle('active', currentEngine === 'local');
        tabGemini.setAttribute('aria-selected', currentEngine === 'gemini');
        tabLocal.setAttribute('aria-selected', currentEngine === 'local');

        if (currentEngine === 'gemini') {
          engineBadge.className = 'badge badge-brand';
          engineBadge.innerHTML = `${global.CyberShield.getIcon('cpu')} CyberShield Helper Connected`;
          inspectBtnText.textContent = 'Inspect URL with CyberShield Helper';
        } else {
          engineBadge.className = 'badge badge-brand';
          engineBadge.innerHTML = `${global.CyberShield.getIcon('lock')} 100% Local & Offline`;
          inspectBtnText.textContent = 'Inspect URL with Local Engine';
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

      // Inspect click
      inspectBtn.addEventListener('click', () => {
        this.runInspection(input.value, resultContainer, errorAlert);
      });

      // Enter key in input
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.runInspection(input.value, resultContainer, errorAlert);
        }
      });

      // Attach QR scanning events
      this.attachQrEvents(container);
    },

    attachQrEvents: function(container) {
      const dropzone = container.querySelector('#qr-dropzone');
      const fileInput = container.querySelector('#qr-file-input');
      const chooseBtn = container.querySelector('#btn-choose-qr-file');
      const statusBox = container.querySelector('#qr-decode-status');
      const qrSampleBtns = container.querySelectorAll('.qr-sample-pill');

      chooseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });

      dropzone.addEventListener('click', () => {
        fileInput.click();
      });

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--color-primary)';
        dropzone.style.backgroundColor = 'var(--color-primary-surface)';
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'var(--color-border)';
        dropzone.style.backgroundColor = 'var(--color-bg-subtle)';
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--color-border)';
        dropzone.style.backgroundColor = 'var(--color-bg-subtle)';
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.processQrFile(e.dataTransfer.files[0], statusBox);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
          this.processQrFile(fileInput.files[0], statusBox);
        }
      });

      // Preloaded QR Samples
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
      reader.onload = (e) => {
        this.decodeQrImageSrc(e.target.result, statusBox);
      };
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
      script.onload = () => {
        if (onReady) onReady();
      };
      script.onerror = () => {
        if (onError) onError();
      };
      document.head.appendChild(script);
    },

    decodeQrImageSrc: function(src, statusBox) {
      const getIcon = global.CyberShield.getIcon;
      statusBox.style.display = 'block';
      statusBox.innerHTML = `
        <div class="alert alert-info">
          <div class="alert-icon">${getIcon('search')}</div>
          <div class="alert-content">
            <div class="alert-title">Decoding QR Code...</div>
            <div class="alert-message">Processing canvas pixel data locally with jsQR.</div>
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
            if (typeof window.jsQR !== 'function') {
              throw new Error('QR decoder engine not available');
            }

            const code = window.jsQR(imageData.data, imageData.width, imageData.height);
            if (code && code.data) {
              this.handleDecodedQr(code.data, statusBox);
            } else {
              statusBox.innerHTML = `
                <div class="alert alert-warning">
                  <div class="alert-icon">${getIcon('alert-circle')}</div>
                  <div class="alert-content">
                    <div class="alert-title">No Valid QR Code Detected</div>
                    <div class="alert-message">The image could not be decoded. Ensure the image is in focus, well-lit, and not corrupted.</div>
                  </div>
                </div>
              `;
              if (global.CyberShield.Sound) global.CyberShield.Sound.playWarning();
            }
          } catch (err) {
            statusBox.innerHTML = `
              <div class="alert alert-warning">
                <div class="alert-icon">${getIcon('alert-triangle')}</div>
                <div class="alert-content">
                  <div class="alert-title">Decoding Failed</div>
                  <div class="alert-message">${global.CyberShield.SafeRender.escapeHtml(err.message)}</div>
                </div>
              </div>
            `;
            if (global.CyberShield.Sound) global.CyberShield.Sound.playWarning();
          }
        }, () => {
          statusBox.innerHTML = `
            <div class="alert alert-warning">
              <div class="alert-icon">${getIcon('alert-triangle')}</div>
              <div class="alert-content">
                <div class="alert-title">Decoder Unavailable</div>
                <div class="alert-message">Failed to load the local QR decoder engine (jsQR.js).</div>
              </div>
            </div>
          `;
          if (global.CyberShield.Sound) global.CyberShield.Sound.playWarning();
        });
      };

      img.onerror = () => {
        statusBox.innerHTML = `
          <div class="alert alert-warning">
            <div class="alert-content">Could not load image file.</div>
          </div>
        `;
      };

      img.src = src;
    },

    handleDecodedQr: function(rawPayload, statusBox) {
      const getIcon = global.CyberShield.getIcon;
      const isUrl = /^https?:\/\//i.test(rawPayload) || (!rawPayload.includes(' ') && rawPayload.includes('.'));
      const isUpi = /^upi:\/\//i.test(rawPayload);

      if (isUpi) {
        statusBox.innerHTML = `
          <div class="alert alert-warning">
            <div class="alert-icon">${getIcon('alert-triangle')}</div>
            <div class="alert-content">
              <div class="alert-title">UPI Payment Intent Decoded</div>
              <div class="alert-message" style="word-break: break-all; font-family: var(--font-family-mono); margin: 6px 0;">
                ${global.CyberShield.SafeRender.escapeHtml(rawPayload)}
              </div>
              <div style="font-size: var(--font-size-xs); color: var(--color-warning); font-weight: var(--font-weight-medium);">
                Scam Alert: Scammers frequently print fake QR codes claiming you will "Receive a Refund". Scanning an intent QR opens your payment app to PAY/DEBIT money, never to receive money!
              </div>
            </div>
          </div>
        `;
        if (global.CyberShield.Sound) global.CyberShield.Sound.playWarning();
        return;
      }

      if (isUrl) {
        let normalizedUrl = rawPayload;
        if (!/^https?:\/\//i.test(normalizedUrl)) {
          normalizedUrl = 'https://' + normalizedUrl;
        }

        statusBox.innerHTML = `
          <div class="alert alert-success">
            <div class="alert-icon">${getIcon('check-circle')}</div>
            <div class="alert-content">
              <div class="alert-title">QR Code Decoded: Web URL Destination</div>
              <div class="alert-message" style="word-break: break-all; font-family: var(--font-family-mono); margin: 4px 0;">
                ${global.CyberShield.SafeRender.escapeHtml(normalizedUrl)}
              </div>
              <div style="font-size: var(--font-size-xs);">
                Passing decoded URL to the active inspector...
              </div>
            </div>
          </div>
        `;
        if (global.CyberShield.Sound) global.CyberShield.Sound.playSuccess();

        this.switchToUrlTab();

        const input = document.querySelector('#url-inspector-input');
        const errorAlert = document.querySelector('#url-inspector-error');
        const resultContainer = document.querySelector('#url-inspection-result');
        if (input) {
          input.value = normalizedUrl;
          this.runInspection(normalizedUrl, resultContainer, errorAlert);
        }
      } else {
        statusBox.innerHTML = `
          <div class="alert alert-info">
            <div class="alert-icon">${getIcon('info')}</div>
            <div class="alert-content">
              <div class="alert-title">Decoded Plain Text Payload</div>
              <div class="alert-message" style="word-break: break-all; font-family: var(--font-family-mono); margin: 4px 0;">
                ${global.CyberShield.SafeRender.escapeHtml(rawPayload)}
              </div>
            </div>
          </div>
        `;
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
                Fix: Add https:// & Inspect
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

      if (currentEngine === 'gemini') {
        this.runGeminiUrlInspection(trimmedUrl, resultContainer, errorAlert);
      } else {
        this.runLocalUrlInspection(trimmedUrl, resultContainer, errorAlert);
      }
    },

    /**
     * Run Gemini AI Deep Link Inspection via Backend Proxy
     */
    runGeminiUrlInspection: async function(url, resultContainer, errorAlert) {
      const getIcon = global.CyberShield.getIcon;

      resultContainer.innerHTML = `
        <div class="ai-loading-container" role="status" aria-live="polite">
          <div class="ai-radar-scanner">
            ${getIcon('search')}
          </div>
          <h2 style="font-size: var(--font-size-base); font-weight: var(--font-weight-bold); margin-bottom: 6px;">
            Analyzing URL with CyberShield Helper...
          </h2>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); max-width: 440px; margin: 0 auto;">
            Checking registrable domain anatomy, deceptive subdomains, typosquatting homoglyphs, and observable risk vectors.
          </p>
        </div>
      `;

      try {
        const analysisData = await global.CyberShield.GeminiAPI.analyzeUrl(url);

        global.CyberShield.State.getTransient().geminiUrlAnalysis = analysisData;
        global.CyberShield.State.recordUrlInspection();

        resultContainer.innerHTML = this.renderGeminiUrlResultMarkup(analysisData, url);
        this.attachGeminiUrlActions(resultContainer, analysisData, url);

        if (global.CyberShield.Sound) {
          if (analysisData.verdict === 'HIGH_RISK') {
            global.CyberShield.Sound.playWarning();
          } else {
            global.CyberShield.Sound.playSuccess();
          }
        }

        global.CyberShield.Accessibility.announce(`CyberShield Helper URL analysis completed: Verdict ${analysisData.verdict}, Risk score ${analysisData.riskScore}`);

      } catch (err) {
        console.error('CyberShield Helper URL Inspection Failed:', err);
        resultContainer.innerHTML = '';

        const isConfigMissing = err.code === 'CONFIG_MISSING' || (err.message && err.message.includes('API_KEY'));
        const errorMessage = isConfigMissing
          ? 'CyberShield Helper backend service is not configured. Please verify your GEMINI_API_KEY environment variable.'
          : `Link inspection failed: ${err.message || 'Unknown network error'}.`;

        errorAlert.innerHTML = `
          <div style="margin-bottom: var(--space-xs); font-weight: var(--font-weight-semibold);">${errorMessage}</div>
          <button class="btn btn-secondary btn-sm" id="btn-link-fallback-local" style="margin-top: 6px;">
            ${getIcon('lock')} Run with Local Anatomy Engine Instead
          </button>
        `;
        errorAlert.style.display = 'block';

        const fallbackBtn = errorAlert.querySelector('#btn-link-fallback-local');
        if (fallbackBtn) {
          fallbackBtn.addEventListener('click', () => {
            errorAlert.style.display = 'none';
            this.runLocalUrlInspection(url, resultContainer, errorAlert);
          });
        }
      }
    },

    /**
     * Run Local URL Inspection (100% Offline Engine)
     */
    runLocalUrlInspection: function(trimmedUrl, resultContainer, errorAlert) {
      try {
        const parsed = global.CyberShield.UrlParser.parse(trimmedUrl);
        const evaluation = global.CyberShield.UrlRules.evaluate(parsed);
        const result = global.CyberShield.EvidenceAggregator.aggregateUrlResult(evaluation);

        global.CyberShield.State.getTransient().linkInspection = result;
        global.CyberShield.State.recordUrlInspection();

        if (global.CyberShield.Sound) {
          if (result.overallConcern === 'HIGH_CONCERN') {
            global.CyberShield.Sound.playWarning();
          } else {
            global.CyberShield.Sound.playSuccess();
          }
        }

        resultContainer.innerHTML = this.renderLocalResultMarkup(result);
        this.attachResultActions(resultContainer, result);

        global.CyberShield.Accessibility.announce(`URL Inspection completed: ${result.overallLabel}`);
      } catch (err) {
        console.error('Inspection error:', err);
        errorAlert.textContent = `Analysis error: ${err.message}`;
        errorAlert.style.display = 'block';
      }
    },

    /**
     * Render Gemini AI URL Inspection Result
     */
    renderGeminiUrlResultMarkup: function(data, url) {
      const getIcon = global.CyberShield.getIcon;
      const escape = global.CyberShield.SafeRender.escapeHtml;

      let verdictClass = 'low-risk';
      let verdictTitle = 'LOW RISK';
      let verdictIcon = 'shield-check';

      if (data.verdict === 'HIGH_RISK') {
        verdictClass = 'high-risk';
        verdictTitle = 'HIGH RISK: PHISHING / DECEPTIVE LINK';
        verdictIcon = 'alert-triangle';
      } else if (data.verdict === 'SUSPICIOUS') {
        verdictClass = 'suspicious';
        verdictTitle = 'SUSPICIOUS: OBSERVABLE WARNING SIGNS';
        verdictIcon = 'alert-circle';
      } else if (data.verdict === 'UNCERTAIN') {
        verdictClass = 'uncertain';
        verdictTitle = 'UNCERTAIN: MISSING DOMAIN CONTEXT';
        verdictIcon = 'help-circle';
      } else {
        verdictClass = 'low-risk';
        verdictTitle = 'LOW RISK: NO OBVIOUS ANOMALIES';
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
            <!-- Inspected URL Display -->
            <div style="background: var(--color-bg-subtle); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-md); margin-bottom: var(--space-lg); display: flex; align-items: center; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap;">
              <div style="word-break: break-all; font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-primary);">
                <strong>Inspected Link:</strong> ${escape(url)}
              </div>
              <button class="btn btn-secondary btn-sm" id="btn-copy-url-link" data-url="${escape(url)}">
                ${getIcon('copy')} Copy Link
              </button>
            </div>

            <!-- Risk Score Gauge -->
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
                ${score > 74 ? 'High probability of phishing, credential harvesting, or lookalike domain.' : score > 39 ? 'Suspicious structure or parameters detected. Caution advised.' : 'No observable deception detected in URL string.'}
              </div>
            </div>

            <!-- Plain English Summary -->
            <div class="ai-summary-callout">
              <strong>Analyst Assessment:</strong> ${escape(data.summary)}
            </div>

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
                Observable Structural Evidence
              </h3>
              <ul style="padding-left: var(--space-lg); font-size: var(--font-size-sm); margin-bottom: var(--space-md);">
                ${data.evidence.map(ev => `<li>${escape(ev)}</li>`).join('')}
              </ul>
            ` : ''}

            <!-- Recommended Actions -->
            <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin: var(--space-lg) 0 var(--space-xs);">
              Recommended Safe Next Steps
            </h3>
            <ul style="padding-left: var(--space-lg); font-size: var(--font-size-sm); margin-bottom: var(--space-lg);">
              ${(data.recommendedActions || []).map(action => `<li>${escape(action)}</li>`).join('')}
            </ul>

            <!-- Transparency: Checks Performed -->
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

            <!-- Transparency: Limitations & Honest Boundaries -->
            <div class="ai-limitations-notice">
              <div class="ai-limitations-title">
                ${getIcon('shield-alert', 'icon-inline')}
                <span>Limitations & Advisory Disclaimer</span>
              </div>
              <ul class="ai-limitations-list">
                ${(data.limitations || []).map(lim => `<li>${escape(lim)}</li>`).join('')}
                <li><strong>No Auto-Execution:</strong> CyberShield never opens or fetches untrusted remote web pages directly in your browser.</li>
                <li><strong>HTTPS Caveat:</strong> The presence of HTTPS or a green lock only encrypts transit; it does NOT prove the website is safe or owned by the legitimate brand.</li>
              </ul>
            </div>
          </div>

          <!-- Card Footer Actions -->
          <div class="card-footer">
            <button class="btn btn-secondary" id="btn-copy-ai-url-summary">
              ${getIcon('copy')}
              <span>Copy Link Summary</span>
            </button>
            <button class="btn btn-primary" id="btn-ai-inspect-another-url">
              ${getIcon('rotate-ccw')}
              <span>Inspect Another URL</span>
            </button>
          </div>
        </div>
      `;
    },

    attachGeminiUrlActions: function(container, data, url) {
      // Copy URL link button
      const copyUrlBtn = container.querySelector('#btn-copy-url-link');
      if (copyUrlBtn) {
        copyUrlBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(url).then(() => {
            const original = copyUrlBtn.innerHTML;
            copyUrlBtn.innerHTML = `${global.CyberShield.getIcon('check')} Copied!`;
            setTimeout(() => {
              copyUrlBtn.innerHTML = original;
            }, 2000);
          }).catch(e => console.warn('Clipboard copy error:', e));
        });
      }

      // Copy summary to clipboard
      const copySummaryBtn = container.querySelector('#btn-copy-ai-url-summary');
      if (copySummaryBtn) {
        copySummaryBtn.addEventListener('click', () => {
          const text = [
            `CyberShield Link Security Inspection:`,
            `Target: ${url}`,
            `Verdict: ${data.verdict} (Risk Score: ${data.riskScore}/100, Confidence: ${data.confidence})`,
            `Summary: ${data.summary}`,
            `Red Flags: ${(data.redFlags || []).join('; ') || 'None observed'}`,
            `Recommended Actions: ${(data.recommendedActions || []).join('; ')}`
          ].join('\n');

          navigator.clipboard.writeText(text).then(() => {
            const original = copySummaryBtn.innerHTML;
            copySummaryBtn.innerHTML = `${global.CyberShield.getIcon('check')} Copied!`;
            setTimeout(() => {
              copySummaryBtn.innerHTML = original;
            }, 2000);
          }).catch(e => console.warn('Clipboard copy error:', e));
        });
      }

      // Inspect another URL
      const anotherBtn = container.querySelector('#btn-ai-inspect-another-url');
      if (anotherBtn) {
        anotherBtn.addEventListener('click', () => {
          const input = document.querySelector('#url-inspector-input');
          if (input) {
            input.value = '';
            input.focus();
          }
          container.innerHTML = '';
          global.CyberShield.State.getTransient().geminiUrlAnalysis = null;
        });
      }
    },

    /**
     * Render Local Heuristic Result Markup (Original Offline Engine)
     */
    renderLocalResultMarkup: function(result) {
      const getIcon = global.CyberShield.getIcon;
      const escape = global.CyberShield.SafeRender.escapeHtml;
      const parsed = result.parsed;

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
              <span class="card-title">Inspection Results</span>
              <span class="card-subtitle">Local heuristic evaluation</span>
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

            <!-- Parsed URL Anatomy Breakdown -->
            <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin-bottom: var(--space-sm);">
              Factual URL Anatomy
            </h3>
            <div class="url-anatomy-grid">
              <div class="anatomy-item">
                <span class="anatomy-label">Scheme / Protocol</span>
                <span class="anatomy-value">${escape(parsed.scheme)}</span>
              </div>
              <div class="anatomy-item">
                <span class="anatomy-label">Authoritative Domain</span>
                <span class="anatomy-value" style="color: var(--color-primary);">${escape(parsed.registrableDomain)}</span>
              </div>
              <div class="anatomy-item">
                <span class="anatomy-label">Subdomain</span>
                <span class="anatomy-value">${escape(parsed.subdomain)}</span>
              </div>
              <div class="anatomy-item">
                <span class="anatomy-label">Port</span>
                <span class="anatomy-value">${escape(parsed.port)}</span>
              </div>
              <div class="anatomy-item">
                <span class="anatomy-label">Path</span>
                <span class="anatomy-value">${escape(parsed.pathname)}</span>
              </div>
              <div class="anatomy-item">
                <span class="anatomy-label">Query / Parameters</span>
                <span class="anatomy-value">${parsed.search ? escape(parsed.search) : '(none)'}</span>
              </div>
            </div>

            <!-- Matched Evidence Rules -->
            <h3 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin: var(--space-lg) 0 var(--space-sm);">
              Evidence & Findings (${result.matches.length})
            </h3>

            ${result.matches.length > 0 ? `
              <div class="evidence-list">
                ${result.matches.map(m => `
                  <div class="evidence-card ${m.concern === 'HIGH_CONCERN' ? 'danger' : m.concern === 'REVIEW_ADVISED' ? 'warning' : 'info'}">
                    <div class="evidence-card-header">
                      <span class="evidence-rule-name">${escape(m.name)}</span>
                      <span class="badge ${m.concern === 'HIGH_CONCERN' ? 'badge-danger' : 'badge-warning'}">
                        ${m.concern === 'HIGH_CONCERN' ? 'High Concern' : 'Review Advised'}
                      </span>
                    </div>
                    <div class="evidence-snippet">${escape(m.evidence)}</div>
                    <div class="evidence-explanation">${escape(m.explanation)}</div>
                    <div class="evidence-recommendation">${getIcon('shield-check', 'icon-inline')} ${escape(m.recommendation)}</div>
                    <div class="evidence-limitation">Limitation: ${escape(m.limitations)}</div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="alert alert-info" style="margin-bottom: var(--space-lg);">
                <div class="alert-icon">${getIcon('info')}</div>
                <div class="alert-content">
                  <div class="alert-title">No heuristic flags triggered</div>
                  <div class="alert-message">None of CyberShield's 10 common phishing/impersonation rules matched this address. However, always exercise care with unsolicited messages.</div>
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
                Transparency: What Was Not Checked
              </span>
              <ul style="padding-left: var(--space-lg); font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
                ${result.whatWasNotChecked.map(item => `<li>${escape(item)}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn btn-secondary" id="btn-copy-url-summary">
              ${getIcon('copy')}
              <span>Copy Analysis Summary</span>
            </button>
            <button class="btn btn-primary" id="btn-analyze-another-url">
              ${getIcon('rotate-ccw')}
              <span>Analyze Another URL</span>
            </button>
          </div>
        </div>
      `;
    },

    attachResultActions: function(container, result) {
      const copyBtn = container.querySelector('#btn-copy-url-summary');
      const anotherBtn = container.querySelector('#btn-analyze-another-url');

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const text = [
            `CyberShield Link Inspection Summary:`,
            `Target: ${result.parsed.rawUrl}`,
            `Authoritative Domain: ${result.parsed.registrableDomain}`,
            `Concern Level: ${result.overallLabel}`,
            `Matched Rules: ${result.matches.map(m => m.name).join(', ') || 'None'}`,
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

      if (anotherBtn) {
        anotherBtn.addEventListener('click', () => {
          const input = document.querySelector('#url-inspector-input');
          if (input) {
            input.value = '';
            input.focus();
          }
          container.innerHTML = '';
          global.CyberShield.State.getTransient().linkInspection = null;
        });
      }
    }
  };

  global.CyberShield.LinkInspectorModule = LinkInspectorModule;
})(window);
