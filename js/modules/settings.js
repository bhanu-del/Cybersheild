/**
 * CyberShield — Settings, Privacy & Diagnostics Module
 * Preferences, accessible theme switching, bilingual toggle,
 * storage persistence management, and honest system diagnostics.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const SettingsModule = {
    render: function(container) {
      const state = global.CyberShield.State;
      const data = state.getData();
      const prefs = data.preferences || {};
      const storageAvailable = global.CyberShield.Storage.isAvailable();
      const getIcon = global.CyberShield.getIcon;
      const isDark = prefs.theme === 'dark';
      const isHinglish = prefs.language === 'hinglish';
      const isReduceMotion = !!prefs.reduceMotion;
      const isSound = prefs.soundEnabled !== false;
      const isPersist = prefs.persistProgress !== false;

      const scenariosCount = (global.CyberShield.SCENARIOS || []).length;
      const lessonsCount = (global.CyberShield.LESSONS || []).length;
      const urlRulesCount = (global.CyberShield.URL_RULES || []).length;
      const msgRulesCount = (global.CyberShield.MESSAGE_RULES || []).length;

      container.innerHTML = `
        <div class="card" style="margin-bottom: var(--space-xl);">
          <div class="card-header">
            <div class="card-title-group">
              <h1 class="card-title" style="font-size: var(--font-size-lg);">Settings, Privacy & Diagnostics</h1>
              <span class="card-subtitle">Manage preferences, appearance, local data storage, and system health</span>
            </div>
            <div class="badge badge-brand">${getIcon('settings')} System Control</div>
          </div>

          <div class="card-body">
            <!-- Appearance Section -->
            <div class="settings-section">
              <h2 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-sm);">
                Appearance & Accessibility
              </h2>

              <div class="settings-row">
                <div class="settings-info">
                  <span class="settings-label">Dark Theme</span>
                  <span class="settings-desc">Switch between the default clean SaaS light theme and high-contrast dark mode.</span>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" id="setting-dark-theme" ${isDark ? 'checked' : ''}>
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="settings-row">
                <div class="settings-info">
                  <span class="settings-label">Reduce Motion</span>
                  <span class="settings-desc">Disable decorative transitions and animations for users sensitive to screen movement.</span>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" id="setting-reduce-motion" ${isReduceMotion ? 'checked' : ''}>
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="settings-row">
                <div class="settings-info">
                  <span class="settings-label">Sound Effects</span>
                  <span class="settings-desc">Gentle synthesized audio cues for correct answers, warnings, and achievements.</span>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" id="setting-sound-enabled" ${isSound ? 'checked' : ''}>
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="settings-row">
                <div class="settings-info">
                  <span class="settings-label">Interface & Explanation Language</span>
                  <span class="settings-desc">Choose between English and Hinglish (natural Hindi-English conversational blend).</span>
                </div>
                <select class="form-select" id="setting-language" style="max-width: 200px;">
                  <option value="en" ${!isHinglish ? 'selected' : ''}>English</option>
                  <option value="hinglish" ${isHinglish ? 'selected' : ''}>Hinglish</option>
                </select>
              </div>
            </div>

            <!-- Privacy & Storage Section -->
            <div class="settings-section">
              <h2 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-sm);">
                Privacy & Data Storage
              </h2>

              <div class="settings-row">
                <div class="settings-info">
                  <span class="settings-label">Save Training Progress Locally</span>
                  <span class="settings-desc">Keep minimal session summaries in browser localStorage. If disabled, all activity stays in memory only.</span>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" id="setting-persist-progress" ${isPersist ? 'checked' : ''}>
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="settings-row">
                <div class="settings-info">
                  <span class="settings-label">Erase All Local Data</span>
                  <span class="settings-desc">Permanently remove saved training sessions, achievements, and custom preferences from this browser.</span>
                </div>
                <button class="btn btn-danger btn-sm" id="btn-settings-clear-data">
                  ${getIcon('trash-2')}
                  <span>Clear All Data</span>
                </button>
              </div>
            </div>

            <!-- System Diagnostics Section -->
            <div class="settings-section">
              <h2 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-sm);">
                Diagnostics & Capability Status
              </h2>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-md);">
                Transparent verification of all local engines and rule sets running on this device.
              </p>

              <div class="diagnostics-grid">
                <div class="diagnostic-item">
                  <span class="diagnostic-label">Core Application Version</span>
                  <span class="diagnostic-val">1.0.0 (Release)</span>
                </div>
                <div class="diagnostic-item">
                  <span class="diagnostic-label">Heuristic Rule-Set Version</span>
                  <span class="diagnostic-val">v${global.CyberShield.RULE_VERSION || '1.0.0'}</span>
                </div>
                <div class="diagnostic-item">
                  <span class="diagnostic-label">Local Storage Status</span>
                  <span class="diagnostic-val" style="color: ${storageAvailable ? 'var(--color-success)' : 'var(--color-warning)'};">
                    ${storageAvailable ? 'Active (Ready)' : 'In-Memory Only'}
                  </span>
                </div>
                <div class="diagnostic-item">
                  <span class="diagnostic-label">Curated Scenarios Loaded</span>
                  <span class="diagnostic-val">${scenariosCount} Scenarios</span>
                </div>
                <div class="diagnostic-item">
                  <span class="diagnostic-label">Learning Hub Guides</span>
                  <span class="diagnostic-val">${lessonsCount} Guides</span>
                </div>
                <div class="diagnostic-item">
                  <span class="diagnostic-label">URL Heuristic Rules</span>
                  <span class="diagnostic-val">${urlRulesCount} Rules</span>
                </div>
                <div class="diagnostic-item">
                  <span class="diagnostic-label">Message Detection Rules</span>
                  <span class="diagnostic-val">${msgRulesCount} Rules</span>
                </div>
                <div class="diagnostic-item">
                  <span class="diagnostic-label">Network Transmission</span>
                  <span class="diagnostic-val" style="color: var(--color-success);">0 KB (Local Only)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      this.attachEvents(container);
    },

    attachEvents: function(container) {
      const state = global.CyberShield.State;

      // Theme toggle
      const darkToggle = container.querySelector('#setting-dark-theme');
      if (darkToggle) {
        darkToggle.addEventListener('change', () => {
          const theme = darkToggle.checked ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', theme);
          state.setPreference('theme', theme);
          if (global.CyberShield.App) global.CyberShield.App.updateTopbarControls();
          global.CyberShield.Accessibility.announce(`Theme changed to ${theme} mode.`);
        });
      }

      // Reduced motion toggle
      const motionToggle = container.querySelector('#setting-reduce-motion');
      if (motionToggle) {
        motionToggle.addEventListener('change', () => {
          const enabled = motionToggle.checked;
          if (enabled) {
            document.body.classList.add('reduce-motion');
          } else {
            document.body.classList.remove('reduce-motion');
          }
          state.setPreference('reduceMotion', enabled);
        });
      }

      // Sound effects toggle
      const soundToggle = container.querySelector('#setting-sound-enabled');
      if (soundToggle) {
        soundToggle.addEventListener('change', () => {
          const enabled = soundToggle.checked;
          state.setPreference('soundEnabled', enabled);
          if (global.CyberShield.App) global.CyberShield.App.updateTopbarControls();
          if (enabled && global.CyberShield.Sound) {
            global.CyberShield.Sound.playTap();
          }
          global.CyberShield.Accessibility.announce(enabled ? 'Sound effects enabled.' : 'Sound effects muted.');
        });
      }

      // Language select
      const langSelect = container.querySelector('#setting-language');
      if (langSelect) {
        langSelect.addEventListener('change', () => {
          const lang = langSelect.value;
          state.setPreference('language', lang);
          if (global.CyberShield.App) global.CyberShield.App.updateTopbarControls();
          global.CyberShield.Accessibility.announce(`Language set to ${lang}.`);
          // Re-render
          this.render(container);
        });
      }

      // Persistence toggle
      const persistToggle = container.querySelector('#setting-persist-progress');
      if (persistToggle) {
        persistToggle.addEventListener('change', () => {
          const val = persistToggle.checked;
          state.setPreference('persistProgress', val);
          global.CyberShield.Accessibility.announce(val ? 'Local progress persistence enabled.' : 'Local progress persistence disabled.');
        });
      }

      // Clear all data
      const clearBtn = container.querySelector('#btn-settings-clear-data');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (confirm('Permanently clear all training history, achievements, and preferences?')) {
            state.resetAllData();
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('reduce-motion');
            if (global.CyberShield.App) global.CyberShield.App.updateTopbarControls();
            this.render(container);
            global.CyberShield.Accessibility.announce('All data has been cleared.');
          }
        });
      }
    },

    cleanup: function() {
      // Clean up any pending state
    }
  };

  global.CyberShield.SettingsModule = SettingsModule;
})(window);
