/**
 * CyberShield — Cyber Threat Academy & Real Indian Case Studies (2021-2024)
 * Comprehensive theory, psychological tactic breakdowns, legal reality checks,
 * and step-by-step incident response playbooks for major Indian cyber scams.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  let activeCategory = 'all';
  let searchQuery = '';
  let activeCaseId = null;

  const AcademyModule = {
    render: function(container) {
      const getIcon = global.CyberShield.getIcon;
      const cases = global.CyberShield.CASE_STUDIES || [];
      const prefs = global.CyberShield.State ? global.CyberShield.State.getData().preferences || {} : {};
      const isHinglish = prefs.language === 'hinglish';

      // Filter cases
      const filtered = cases.filter(c => {
        const matchesCat = activeCategory === 'all' || c.category === activeCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          c.title.toLowerCase().includes(q) ||
          (c.titleHinglish && c.titleHinglish.toLowerCase().includes(q)) ||
          c.excerpt.toLowerCase().includes(q) ||
          c.realIncident.overview.toLowerCase().includes(q) ||
          c.keyTakeaway.toLowerCase().includes(q);
        return matchesCat && matchesSearch;
      });

      const categories = [
        { id: 'all', label: 'All Vectors (8)' },
        { id: 'impersonation', label: 'Impersonation & Digital Arrest' },
        { id: 'social_pressure', label: 'Utility & Panic SMS' },
        { id: 'fake_offers', label: 'Task & Job Traps' },
        { id: 'financial_traps', label: 'UPI & Payment Scams' },
        { id: 'technical_scams', label: 'Biometric & Technical' }
      ];

      container.innerHTML = `
        <div class="card" style="margin-bottom: var(--space-xl);">
          <!-- Header -->
          <div class="card-header">
            <div class="card-title-group">
              <h1 class="card-title" style="font-size: var(--font-size-lg);">
                ${getIcon('book-open')}
                <span>Cyber Threat Academy & Real Indian Cases (2021–2024)</span>
              </h1>
              <span class="card-subtitle">
                Learn how real Indian cybercrimes unfold, psychological traps to avoid, and step-by-step defense playbooks
              </span>
            </div>
            <div class="badge badge-brand">
              ${getIcon('award')} Ground Reality Curriculum
            </div>
          </div>

          <div class="card-body">
            <!-- Statutory National Helpline Alert -->
            <div class="alert alert-info" style="margin-bottom: var(--space-xl); border-left: 4px solid var(--color-primary); background: var(--color-bg-subtle);">
              <div class="alert-icon" style="color: var(--color-primary);">${getIcon('shield-check')}</div>
              <div class="alert-content">
                <div class="alert-title" style="font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-primary);">
                  National Cyber Crime Reporting Helpline: Dial 1930 & Visit cybercrime.gov.in
                </div>
                <div class="alert-message" style="font-size: var(--font-size-xs); color: var(--color-text-secondary); line-height: 1.5; margin-top: 4px;">
                  If you or someone you know has been targeted by financial fraud, report within the <strong>"Golden First Hour"</strong> to helpline <strong>1930</strong>. This immediately freezes funds across beneficiary bank accounts before cash can be withdrawn.
                </div>
              </div>
            </div>

            <!-- Search and Filter Bar -->
            <div style="display: flex; gap: var(--space-md); flex-wrap: wrap; align-items: center; justify-content: space-between; margin-bottom: var(--space-lg);">
              <div class="url-input-wrapper" style="flex: 1; min-width: 260px; max-width: 440px;">
                <span class="url-input-icon">${getIcon('search')}</span>
                <input 
                  type="text" 
                  id="academy-search-input" 
                  class="form-control url-input-field" 
                  placeholder="Search real scams (e.g. digital arrest, electricity, fedex, aeps, telegram)..." 
                  value="${global.CyberShield.SafeRender.escapeHtml(searchQuery)}"
                  autocomplete="off"
                />
              </div>

              <!-- Category Filter Chips -->
              <div class="chips-group" id="academy-category-chips">
                ${categories.map(cat => `
                  <button type="button" class="chip-btn ${activeCategory === cat.id ? 'active' : ''}" data-cat-id="${cat.id}">
                    ${cat.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Case Studies Grid -->
            ${filtered.length > 0 ? `
              <div class="case-studies-grid">
                ${filtered.map(cs => {
                  const title = isHinglish && cs.titleHinglish ? cs.titleHinglish : cs.title;
                  return `
                    <div class="case-card" data-case-id="${cs.id}">
                      <div class="case-card-top">
                        <div class="case-card-header">
                          <span class="badge badge-primary">
                            ${cs.categoryLabel}
                          </span>
                          <span class="badge badge-neutral">
                            ${cs.year}
                          </span>
                        </div>

                        <div class="case-impact-tag">
                          ${getIcon('alert-triangle', 'icon-inline')} ${cs.impact}
                        </div>

                        <h2 class="case-title">
                          ${title}
                        </h2>

                        <p class="case-excerpt">
                          ${cs.excerpt}
                        </p>
                      </div>

                      <div class="case-card-bottom">
                        <div class="case-takeaway-preview">
                          <strong>Key Reality Check:</strong> ${cs.keyTakeaway}
                        </div>
                        <button type="button" class="btn btn-secondary btn-sm btn-block btn-open-case" data-case-id="${cs.id}">
                          <span>Read Full Case & Defense Plan</span>
                          ${getIcon('arrow-right')}
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : `
              <div class="empty-state" style="padding: var(--space-3xl) var(--space-md);">
                <div class="empty-icon-box" style="margin: 0 auto var(--space-md);">
                  ${getIcon('search')}
                </div>
                <h3 style="font-size: var(--font-size-base); font-weight: 600;">No Case Studies Found</h3>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">
                  No case studies matched your search query "${global.CyberShield.SafeRender.escapeHtml(searchQuery)}". Try resetting your filter.
                </p>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-reset-academy-search" style="margin-top: var(--space-md);">
                  Reset Filters
                </button>
              </div>
            `}
          </div>
        </div>

        <!-- Case Study Reader Modal -->
        <div class="modal-backdrop" id="case-study-modal" role="dialog" aria-modal="true" aria-labelledby="case-modal-title">
          <div class="modal-dialog" style="max-width: 800px;">
            <div class="modal-header">
              <span class="modal-title" id="case-modal-title">Case Study Analysis</span>
              <button class="btn-icon" data-close-modal data-close-case-modal aria-label="Close case study">${getIcon('x')}</button>
            </div>
            <div class="modal-body" id="case-modal-content">
              <!-- Dynamically rendered -->
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-close-modal data-close-case-modal>Close Case Study</button>
            </div>
          </div>
        </div>
      `;

      this.attachEvents(container);
    },

    attachEvents: function(container) {
      const searchInput = container.querySelector('#academy-search-input');
      const categoryChips = container.querySelectorAll('#academy-category-chips .chip-btn');
      const caseButtons = container.querySelectorAll('.btn-open-case');
      const caseCards = container.querySelectorAll('.case-card');
      const modal = container.querySelector('#case-study-modal');
      const closeBtns = container.querySelectorAll('[data-close-case-modal]');
      const resetSearchBtn = container.querySelector('#btn-reset-academy-search');

      if (searchInput) {
        searchInput.addEventListener('input', () => {
          searchQuery = searchInput.value;
          this.render(container);
          const inputAfter = container.querySelector('#academy-search-input');
          if (inputAfter) {
            inputAfter.focus();
            inputAfter.setSelectionRange(inputAfter.value.length, inputAfter.value.length);
          }
        });
      }

      categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
          activeCategory = chip.dataset.catId;
          this.render(container);
        });
      });

      const handleOpen = (caseId) => {
        this.openCaseStudy(caseId, modal);
      };

      caseButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          handleOpen(btn.dataset.caseId);
        });
      });

      caseCards.forEach(card => {
        card.addEventListener('click', () => {
          handleOpen(card.dataset.caseId);
        });
      });

      closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          modal.classList.remove('open');
          global.CyberShield.Accessibility.releaseFocus(modal);
        });
      });

      if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', () => {
          searchQuery = '';
          activeCategory = 'all';
          this.render(container);
        });
      }
    },

    openCaseStudy: function(caseId, modalEl) {
      const modal = modalEl || document.querySelector('#case-study-modal');
      if (!modal) return;

      const cases = global.CyberShield.CASE_STUDIES || [];
      const cs = cases.find(c => c.id === caseId);
      if (!cs) return;

      activeCaseId = caseId;
      const getIcon = global.CyberShield.getIcon;
      const prefs = global.CyberShield.State ? global.CyberShield.State.getData().preferences || {} : {};
      const isHinglish = prefs.language === 'hinglish';

      const title = isHinglish && cs.titleHinglish ? cs.titleHinglish : cs.title;
      const titleEl = modal.querySelector('#case-modal-title');
      const contentEl = modal.querySelector('#case-modal-content');

      titleEl.textContent = title;

      contentEl.innerHTML = `
        <div class="case-study-detail">
          <!-- Meta Banner -->
          <div class="case-detail-meta">
            <span class="badge badge-primary">${cs.categoryLabel}</span>
            <span class="badge badge-neutral">${cs.year}</span>
            <span class="badge badge-warning">
              ${cs.impact}
            </span>
          </div>

          <!-- Section 1: The Real Incident -->
          <div class="case-detail-section">
            <h3 class="case-section-heading">
              ${getIcon('file-text')} Real Police Report & Case Background
            </h3>
            <div class="case-incident-box">
              <div class="incident-meta-row">
                <span><strong>Location:</strong> ${cs.realIncident.location}</span>
                <span><strong>Reported:</strong> ${cs.realIncident.dateReported}</span>
                <span><strong>Victim Profile:</strong> ${cs.realIncident.victimProfile}</span>
              </div>
              <p class="case-incident-desc">
                ${cs.realIncident.overview}
              </p>
            </div>
          </div>

          <!-- Section 2: 4-Stage Attack Timeline -->
          <div class="case-detail-section">
            <h3 class="case-section-heading">
              ${getIcon('layers')} Anatomy of the Attack: 4-Stage Progression
            </h3>
            <div class="case-timeline">
              ${cs.scamAnatomy.map(stage => `
                <div class="timeline-step">
                  <div class="timeline-step-badge">${stage.stage}</div>
                  <div class="timeline-step-body">
                    <div class="timeline-step-name">${stage.name}</div>
                    <div class="timeline-step-desc">${stage.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Section 3: Legal & Regulatory Reality Check -->
          <div class="case-detail-section">
            <h3 class="case-section-heading">
              ${getIcon('award')} Legal & Regulatory Reality Check
            </h3>
            <div class="legal-reality-box">
              <ul class="case-list-clean">
                ${cs.legalRealityCheck.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- Section 4: Red Flags Checklist -->
          <div class="case-detail-section">
            <h3 class="case-section-heading">
              ${getIcon('alert-triangle')} Warning Signs & Cognitive Red Flags
            </h3>
            <ul class="case-list-secondary">
              ${cs.redFlags.map(rf => `<li>${rf}</li>`).join('')}
            </ul>
          </div>

          <!-- Section 5: Step-by-Step Incident Response Playbook -->
          <div class="case-detail-section">
            <h3 class="case-section-heading">
              ${getIcon('shield-check')} Defense Playbook: What To Do If Targeted
            </h3>
            <div class="playbook-steps-box">
              ${cs.defensePlaybook.map((step, idx) => `
                <div class="playbook-step-row">
                  <span class="playbook-step-num">${idx + 1}</span>
                  <span class="playbook-step-text">${step.replace(/^\d+\.\s*/, '')}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Key Golden Rule Box -->
          <div class="case-golden-rule">
            <div class="case-golden-rule-title">
              Golden Rule of Defense
            </div>
            <div class="case-golden-rule-text">
              ${cs.keyTakeaway}
            </div>
          </div>
        </div>
      `;

      modal.classList.add('open');
      global.CyberShield.Accessibility.trapFocus(modal);
    },

    cleanup: function() {
      const modal = document.querySelector('#case-study-modal');
      if (modal && modal.classList.contains('open')) {
        modal.classList.remove('open');
        global.CyberShield.Accessibility.releaseFocus(modal);
      }
    }
  };

  global.CyberShield.AcademyModule = AcademyModule;
})(window);
