/**
 * CyberShield — Main Application Bootstrapper
 * Coordinates initialization, theme/motion restoration,
 * global event delegation, achievement toasts, and service worker registration.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const App = {
    init: function() {
      // 1. Initialize accessibility
      global.CyberShield.Accessibility.init();

      // 2. Apply saved preferences
      const state = global.CyberShield.State;
      const prefs = state.getData().preferences || {};

      if (prefs.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }

      if (prefs.reduceMotion) {
        document.body.classList.add('reduce-motion');
      }

      // 3. Setup toast container
      this.initToastContainer();

      // 4. Setup global UI event bindings
      this.bindGlobalEvents();
      this.updateTopbarControls();

      // 5. Subscribe to state notifications
      state.subscribe((type, payload) => {
        if (type === 'achievement_unlocked') {
          this.showToast(`Achievement Unlocked: ${payload.name}!`, 'award');
          if (global.CyberShield.Sound) {
            global.CyberShield.Sound.playSuccess();
          }
        } else if (type === 'preference_changed') {
          this.updateTopbarControls();
        }
      });

      // 6. Initialize router
      global.CyberShield.Router.init();

      // 7. Register Service Worker if running under secure context (https / localhost)
      this.registerServiceWorker();

      // 8. Initialize persistent Gemini AI Chatbot Widget
      if (global.CyberShield.ChatWidget && typeof global.CyberShield.ChatWidget.init === 'function') {
        global.CyberShield.ChatWidget.init();
      }

      console.log('CyberShield: Core engine initialized successfully.');
    },

    initToastContainer: function() {
      let tc = document.querySelector('.toast-container');
      if (!tc) {
        tc = document.createElement('div');
        tc.className = 'toast-container';
        tc.setAttribute('aria-live', 'polite');
        document.body.appendChild(tc);
      }
    },

    showToast: function(message, iconName = 'info') {
      const tc = document.querySelector('.toast-container');
      if (!tc) return;

      const getIcon = global.CyberShield.getIcon;
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `
        <span style="color: var(--color-primary);">${getIcon(iconName, 'icon-inline')}</span>
        <span style="font-weight: var(--font-weight-medium);">${global.CyberShield.SafeRender.escapeHtml(message)}</span>
      `;

      tc.appendChild(toast);
      global.CyberShield.Accessibility.announce(message);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 250);
      }, 4000);
    },

    bindGlobalEvents: function() {
      const router = global.CyberShield.Router;
      const state = global.CyberShield.State;

      // Sidebar navigation links
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const route = link.dataset.route;
          router.navigate(route);
        });
      });

      // Mobile drawer toggle
      const mobileBtn = document.querySelector('#btn-mobile-menu');
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.sidebar-overlay');

      if (mobileBtn && sidebar && overlay) {
        mobileBtn.addEventListener('click', () => {
          sidebar.classList.toggle('open');
          overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
          sidebar.classList.remove('open');
          overlay.classList.remove('active');
        });
      }

      // Quick Theme Toggle button in topbar
      const themeBtn = document.querySelector('#btn-topbar-theme');
      if (themeBtn) {
        themeBtn.addEventListener('click', () => {
          const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
          const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', nextTheme);
          state.setPreference('theme', nextTheme);
          this.updateTopbarControls();
        });
      }

      // Quick Language Toggle pill in topbar
      const langBtn = document.querySelector('#btn-topbar-lang');
      if (langBtn) {
        langBtn.addEventListener('click', () => {
          const curLang = state.getData().preferences.language || 'en';
          const nextLang = curLang === 'en' ? 'hinglish' : 'en';
          state.setPreference('language', nextLang);
          this.updateTopbarControls();
          // Re-render current view with new language
          router.navigate(router.currentRoute, false);
        });
      }

      // Settings icon button in topbar
      const settingsBtn = document.querySelector('#btn-topbar-settings');
      if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
          router.navigate('settings');
        });
      }

      // Sound toggle button in topbar
      const soundBtn = document.querySelector('#btn-topbar-sound');
      if (soundBtn) {
        soundBtn.addEventListener('click', () => {
          const current = state.getData().preferences.soundEnabled !== false;
          const next = !current;
          state.setPreference('soundEnabled', next);
          this.updateTopbarControls();
          if (next && global.CyberShield.Sound) {
            global.CyberShield.Sound.playTap();
          }
        });
      }

      // 1930 Cyber SOS button in topbar
      const sosBtn = document.querySelector('#btn-topbar-sos');
      if (sosBtn) {
        sosBtn.addEventListener('click', () => {
          this.openSosModal();
        });
      }
    },

    updateTopbarControls: function() {
      const prefs = global.CyberShield.State.getData().preferences || {};
      const langBtn = document.querySelector('#btn-topbar-lang');
      const themeBtn = document.querySelector('#btn-topbar-theme');
      const soundBtn = document.querySelector('#btn-topbar-sound');
      const getIcon = global.CyberShield.getIcon;

      if (langBtn) {
        langBtn.textContent = prefs.language === 'hinglish' ? 'Hinglish' : 'English';
      }

      if (themeBtn) {
        themeBtn.innerHTML = prefs.theme === 'dark' ? getIcon('sun') : getIcon('moon');
        themeBtn.setAttribute('title', `Switch to ${prefs.theme === 'dark' ? 'light' : 'dark'} mode`);
      }

      if (soundBtn) {
        const soundEnabled = prefs.soundEnabled !== false;
        soundBtn.innerHTML = soundEnabled ? getIcon('volume-2') : getIcon('volume-x');
        soundBtn.setAttribute('title', soundEnabled ? 'Mute sound effects' : 'Unmute sound effects');
        soundBtn.setAttribute('aria-label', soundEnabled ? 'Mute sound effects' : 'Unmute sound effects');
      }

      // Synchronize Settings view controls if currently mounted in DOM
      const settingDark = document.querySelector('#setting-dark-theme');
      if (settingDark) {
        settingDark.checked = prefs.theme === 'dark';
      }
      const settingSound = document.querySelector('#setting-sound-enabled');
      if (settingSound) {
        settingSound.checked = prefs.soundEnabled !== false;
      }
      const settingLang = document.querySelector('#setting-language');
      if (settingLang) {
        settingLang.value = prefs.language === 'hinglish' ? 'hinglish' : 'en';
      }
      const settingMotion = document.querySelector('#setting-reduce-motion');
      if (settingMotion) {
        settingMotion.checked = !!prefs.reduceMotion;
      }
    },

    registerServiceWorker: function() {
      // Safe progressive registration only under secure contexts
      if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js')
            .then(reg => {
              console.log('CyberShield: Service Worker registered with scope:', reg.scope);
            })
            .catch(err => {
              console.log('CyberShield: Service Worker registration bypassed (normal for file://):', err.message);
            });
        });
      }
    },

    openSosModal: function() {
      const getIcon = global.CyberShield.getIcon;
      const bankDir = [
        { name: 'State Bank of India (SBI)', phone: '1800 11 1109', alternate: '1800 425 3800', smsLock: 'BLOCK <Account No> to 567676' },
        { name: 'HDFC Bank', phone: '1800 1600', alternate: '1800 266 4060', portal: 'netbanking.hdfcbank.com' },
        { name: 'ICICI Bank', phone: '1800 2662', alternate: '1800 102 4242', portal: 'icicibank.com' },
        { name: 'Axis Bank', phone: '1800 419 5959', alternate: '1860 419 5555', portal: 'axisbank.com' },
        { name: 'Punjab National Bank (PNB)', phone: '1800 180 2222', alternate: '1800 103 2222', portal: 'pnbindia.in' },
        { name: 'Bank of Baroda', phone: '1800 258 4455', alternate: '1800 102 4455', portal: 'bankofbaroda.in' },
        { name: 'PhonePe Emergency', phone: '080-68727374', alternate: '022-68727374', portal: 'support.phonepe.com' },
        { name: 'Paytm Payments Bank', phone: '0120 4456 456', alternate: '0120 3888 388', portal: 'paytm.com/care' },
        { name: 'Google Pay India', phone: '1800-419-0157', portal: 'support.google.com/pay/india' }
      ];

      let modal = document.querySelector('#cybershield-sos-modal');
      if (modal) modal.remove();

      modal = document.createElement('div');
      modal.id = 'cybershield-sos-modal';
      modal.className = 'modal-backdrop active';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', '1930 Cyber SOS Emergency Hub');

      modal.innerHTML = `
        <div class="modal-dialog modal-dialog-lg sos-modal-shell">
          <div class="modal-header sos-modal-header">
            <div class="modal-title-group">
              <span class="badge badge-danger">${getIcon('alert-triangle')} INDIAN EMERGENCY COMMAND</span>
              <h2 class="modal-title" style="margin-top: 4px;">National Cybercrime Emergency 1930 & Golden Hour Hub</h2>
            </div>
            <button class="btn-icon" id="btn-close-sos-modal" aria-label="Close emergency modal">${getIcon('x')}</button>
          </div>

          <div class="modal-body">
            <!-- 1930 Instant Dial Banner -->
            <div class="sos-banner-hero">
              <div class="sos-hero-text">
                <h3 class="sos-call-num">DIAL 1930</h3>
                <span class="sos-call-sub">National Cyber Crime Reporting Portal (MHA / I4C)</span>
                <p class="sos-call-p">Immediate freezing of fraudulent transaction tokens across all Indian banks & payment gateways within 120 minutes of incident.</p>
              </div>
              <div class="sos-hero-action">
                <a href="tel:1930" class="btn btn-danger btn-lg sos-dial-btn">
                  ${getIcon('phone-call')} Direct Call 1930
                </a>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="margin-top: 6px;">
                  Visit cybercrime.gov.in ${getIcon('external-link')}
                </a>
              </div>
            </div>

            <!-- Golden Hour Checklist -->
            <div class="sos-golden-hour-grid">
              <div class="golden-step-card">
                <span class="step-num-badge">STEP 1</span>
                <h4 class="step-heading">Freeze NetBanking & Cards</h4>
                <p class="step-desc">Call bank hotline or send SMS freeze code immediately to prevent subsequent unauthorized transactions.</p>
              </div>
              <div class="golden-step-card">
                <span class="step-num-badge">STEP 2</span>
                <h4 class="step-heading">Dial 1930 (Within 2 Hours)</h4>
                <p class="step-desc">Provide your 12-digit transaction UTR / Reference ID so police nodal officers place a lien on the recipient mule wallet.</p>
              </div>
              <div class="golden-step-card">
                <span class="step-num-badge">STEP 3</span>
                <h4 class="step-heading">Capture Digital Evidence</h4>
                <p class="step-desc">Save screenshots of WhatsApp chat, call logs, phishing URLs, fake caller ID, and bank debit SMS.</p>
              </div>
            </div>

            <!-- 1-Click Bank Freeze Directory -->
            <h3 class="sos-sub-section-title" style="margin-top: var(--space-xl);">${getIcon('shield')} Indian Bank Fraud Helplines & Lock Codes</h3>
            <div class="bank-directory-table-wrapper">
              <table class="bank-directory-table">
                <thead>
                  <tr>
                    <th>Bank / Provider</th>
                    <th>24/7 Fraud Hotline</th>
                    <th>Alternate / SMS Freeze Code</th>
                  </tr>
                </thead>
                <tbody>
                  ${bankDir.map(b => `
                    <tr>
                      <td class="bank-name-cell"><strong>${b.name}</strong></td>
                      <td><a href="tel:${b.phone.replace(/\\s+/g, '')}" class="bank-call-link">${getIcon('phone')} ${b.phone}</a></td>
                      <td class="bank-alt-cell">${b.smsLock ? `<code class="sms-code">${b.smsLock}</code>` : (b.alternate ? b.alternate : '—')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Automated FIR Complaint Drafter -->
            <h3 class="sos-sub-section-title" style="margin-top: var(--space-xl);">${getIcon('file-text')} Instant Police / Bank FIR Complaint Drafter</h3>
            <div class="fir-generator-box">
              <div class="fir-form-grid">
                <div class="form-group">
                  <label class="form-label">Victim Name:</label>
                  <input type="text" id="fir-victim-name" class="form-control" placeholder="e.g. Ramesh Kumar">
                </div>
                <div class="form-group">
                  <label class="form-label">Scam Category:</label>
                  <select id="fir-scam-type" class="form-select">
                    <option value="Digital Arrest / Extortion Video Call">Digital Arrest / Extortion Video Call</option>
                    <option value="SIM Swap & NetBanking Hijack">SIM Swap & NetBanking Hijack</option>
                    <option value="UPI / QR Code Fraud">UPI / QR Code Fraud</option>
                    <option value="Fake Electricity Bill APK Trojan">Fake Electricity Bill APK Trojan</option>
                    <option value="Part-time Job / Telegram Task Scam">Part-time Job / Telegram Task Scam</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Amount Lost (₹):</label>
                  <input type="text" id="fir-amount" class="form-control" placeholder="e.g. ₹50,000">
                </div>
                <div class="form-group">
                  <label class="form-label">Transaction ID / UTR:</label>
                  <input type="text" id="fir-utr" class="form-control" placeholder="e.g. UPI/429188291029">
                </div>
              </div>

              <button class="btn btn-primary" id="btn-generate-fir" style="margin-top: var(--space-sm);">
                ${getIcon('zap')} Generate Legal Complaint Letter
              </button>

              <div id="fir-output-container" style="display: none; margin-top: var(--space-md);">
                <textarea id="fir-output-text" class="form-textarea" rows="8" readonly></textarea>
                <div style="margin-top: var(--space-xs); display: flex; gap: var(--space-xs);">
                  <button class="btn btn-secondary btn-sm" id="btn-copy-fir">${getIcon('copy')} Copy Complaint Text</button>
                  <span id="fir-copy-toast" style="font-size: var(--font-size-xs); color: var(--color-success); display: none; align-items: center;">✓ Copied to clipboard!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const closeModal = () => modal.remove();
      modal.querySelector('#btn-close-sos-modal').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      const genBtn = modal.querySelector('#btn-generate-fir');
      const copyBtn = modal.querySelector('#btn-copy-fir');
      const outContainer = modal.querySelector('#fir-output-container');
      const outText = modal.querySelector('#fir-output-text');
      const copyToast = modal.querySelector('#fir-copy-toast');

      genBtn.addEventListener('click', () => {
        const name = modal.querySelector('#fir-victim-name').value.trim() || '[Your Name]';
        const type = modal.querySelector('#fir-scam-type').value;
        const amt = modal.querySelector('#fir-amount').value.trim() || '[Disputed Amount]';
        const utr = modal.querySelector('#fir-utr').value.trim() || '[Transaction UTR / Ref]';
        const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

        const draft = `To,
The Station House Officer / Cyber Crime Police Station & Nodal Officer,
State Police Cyber Division / National Cyber Crime Reporting Portal (1930)

Subject: Formal Complaint regarding Cyber Financial Fraud (${type}) — Urgently Freeze Beneficiary Account

Respected Officer,

I, ${name}, wish to lodge an immediate formal complaint regarding financial cyber fraud perpetrated against me on ${dateStr}.

INCIDENT DETAILS:
1. Incident Category: ${type}
2. Disputed Amount: ${amt}
3. Transaction UTR / Ref No: ${utr}
4. Immediate Action Taken: Registered on National Cyber Crime Helpline 1930 / cybercrime.gov.in.

FACTS:
The perpetrator fraudulently extracted funds through deception and computer impersonation, constituting cognizable offenses under Section 66D of the IT Act 2000 and relevant provisions of the Bharatiya Nyaya Sanhita (BNS).

PRAYER:
1. Kindly register this complaint and trace the destination beneficiary mule account to place an immediate lien.
2. Direct the concerned payment intermediary / bank to reverse the unauthorized disputed transaction under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18.

Yours Sincerely,
${name}
Date: ${dateStr}`;

        outText.value = draft;
        outContainer.style.display = 'block';
      });

      copyBtn.addEventListener('click', () => {
        outText.select();
        navigator.clipboard.writeText(outText.value).then(() => {
          copyToast.style.display = 'inline-flex';
          setTimeout(() => { copyToast.style.display = 'none'; }, 2500);
        });
      });
    }
  };

  global.CyberShield.App = App;

  // Boot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }

})(window);
