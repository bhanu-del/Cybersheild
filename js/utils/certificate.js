/**
 * CyberShield — Defense Certificate Generator
 * Generates official-looking printable/savable completion certificates.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const Certificate = {
    openModal: function(options = {}) {
      const state = global.CyberShield.State;
      const derived = state ? state.getDerivedStats() : { overallAccuracyPct: 85 };
      const accuracy = options.accuracy !== undefined ? options.accuracy : (derived.overallAccuracyPct || 85);
      const defaultName = options.userName || 'Cyber Defender';
      const dateStr = new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const certId = 'CS-CERT-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + new Date().getFullYear();

      let modal = document.querySelector('#certificate-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'certificate-modal';
        modal.className = 'modal-backdrop';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'CyberShield Completion Certificate');
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="modal-dialog" style="max-width: 780px;">
          <div class="modal-header no-print">
            <span class="modal-title">Official Defense Certificate</span>
            <button class="btn-icon" id="btn-close-cert" data-close-modal aria-label="Close certificate">${global.CyberShield.getIcon('x')}</button>
          </div>
          <div class="modal-body" style="padding: var(--space-xl); background: #FAFBFD;">
            <!-- Certificate Canvas Paper -->
            <div class="cert-paper" style="background: #FFFFFF; border: 8px double #174EA6; border-radius: 8px; padding: 40px 32px; text-align: center; position: relative; box-shadow: var(--shadow-md);">
              <div style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div class="brand-icon" style="width: 32px; height: 32px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <span style="font-size: 1.25rem; font-weight: 700; color: #174EA6; letter-spacing: 0.05em; text-transform: uppercase;">
                  CyberShield Academy
                </span>
              </div>

              <h2 style="font-size: 1.75rem; font-weight: 800; color: #171A21; text-transform: uppercase; letter-spacing: 0.08em; margin: 12px 0 6px;">
                Certificate of Cyber Defense
              </h2>
              <p style="font-size: 0.85rem; color: #586376; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">
                Phishing & Social Engineering Awareness Simulation
              </p>

              <p style="font-size: 0.95rem; color: #586376; margin-bottom: 8px;">This is proudly presented to</p>

              <!-- Editable Name Field -->
              <div class="no-print" style="margin-bottom: 8px;">
                <input 
                  type="text" 
                  id="cert-name-input" 
                  value="${global.CyberShield.SafeRender.escapeHtml(defaultName)}" 
                  style="font-size: 1.5rem; font-weight: 700; color: #174EA6; text-align: center; border: none; border-bottom: 2px dashed #2878E5; padding: 4px; width: 80%; background: transparent; outline: none;" 
                  title="Click to edit your name"
                />
                <div style="font-size: 0.72rem; color: var(--color-text-muted); margin-top: 4px;">(Click name above to customize before printing)</div>
              </div>

              <div class="print-only" style="display: none; font-size: 1.75rem; font-weight: 700; color: #174EA6; border-bottom: 2px solid #174EA6; margin: 0 auto 16px; width: 70%;" id="cert-name-print">
                ${global.CyberShield.SafeRender.escapeHtml(defaultName)}
              </div>

              <p style="font-size: 0.92rem; color: #586376; max-width: 540px; margin: 16px auto; line-height: 1.5;">
                For successfully demonstrating practical vigilance in detecting phishing links, credential-harvesting messages, fake offers, and social engineering traps with a verified defense rating of <strong>${accuracy}%</strong>.
              </p>

              <!-- Seal and Verification Details -->
              <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px; padding: 0 24px;">
                <div style="text-align: left; font-size: 0.75rem; color: #8791A2;">
                  <div><strong>Issued Date:</strong> ${dateStr}</div>
                  <div><strong>Verification ID:</strong> ${certId}</div>
                  <div><strong>Method:</strong> 100% On-Device Local Inspection</div>
                </div>

                <div style="width: 72px; height: 72px; border-radius: 50%; border: 3px solid #7257CD; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #F0EDFF; color: #7257CD;">
                  <span style="font-size: 0.55rem; font-weight: 800; text-transform: uppercase;">Verified</span>
                  <span style="font-size: 0.95rem; font-weight: 900;">★ ★ ★</span>
                  <span style="font-size: 0.5rem; font-weight: 700;">SHIELD</span>
                </div>

                <div style="text-align: right; font-size: 0.75rem; color: #8791A2;">
                  <div style="border-bottom: 1px solid #CDD5DF; padding-bottom: 4px; width: 140px; margin-left: auto; font-style: italic; color: #171A21;">
                    CyberShield Engine
                  </div>
                  <div style="margin-top: 2px;">Heuristic Security Lab</div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer no-print">
            <button class="btn btn-secondary" id="btn-cert-cancel" data-close-modal>Close</button>
            <button class="btn btn-primary btn-lg" id="btn-cert-print">
              ${global.CyberShield.getIcon('award')}
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      `;

      modal.classList.add('open');
      global.CyberShield.Accessibility.trapFocus(modal);

      const nameInput = modal.querySelector('#cert-name-input');
      const namePrint = modal.querySelector('#cert-name-print');
      nameInput.addEventListener('input', () => {
        namePrint.textContent = nameInput.value || 'Cyber Defender';
      });

      const closeBtn = modal.querySelector('#btn-close-cert');
      const cancelBtn = modal.querySelector('#btn-cert-cancel');
      const printBtn = modal.querySelector('#btn-cert-print');

      const closeModal = () => {
        modal.classList.remove('open');
        global.CyberShield.Accessibility.releaseFocus(modal);
      };

      closeBtn.addEventListener('click', closeModal);
      cancelBtn.addEventListener('click', closeModal);

      printBtn.addEventListener('click', () => {
        namePrint.textContent = nameInput.value || 'Cyber Defender';
        window.print();
      });
    }
  };

  global.CyberShield.Certificate = Certificate;
})(window);
