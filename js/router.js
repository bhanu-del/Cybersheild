/**
 * CyberShield — Client-Side Hash Router
 * Handles predictable navigation, active link indicators,
 * view transitions, accessible focus management, and browser history.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const ROUTES = {
    'overview': {
      title: 'Overview Dashboard',
      subtitle: 'Command center & progress monitoring',
      module: 'OverviewModule'
    },
    'chat': {
      title: 'CyberShield Helper',
      subtitle: 'Context-aware scam, fraud & cyber crime defense assistant',
      module: 'ChatModule'
    },
    'arena': {
      title: 'Awareness Arena',
      subtitle: 'Interactive phishing & scam simulation',
      module: 'ArenaModule'
    },
    'link-inspector': {
      title: 'Link Inspector',
      subtitle: 'Local URL anatomy & heuristic evaluation',
      module: 'LinkInspectorModule'
    },
    'message-analyzer': {
      title: 'Message Red-Flag Analyzer',
      subtitle: 'Social-engineering phrase & clue detection',
      module: 'MessageAnalyzerModule'
    },
    'progress': {
      title: 'Score & Progress Center',
      subtitle: 'Authoritative performance metrics & achievements',
      module: 'ProgressModule'
    },
    'learning-hub': {
      title: 'Cyber Safety Learning Hub',
      subtitle: 'Interactive core security lessons & knowledge checks',
      module: 'LearningHubModule'
    },
    'academy': {
      title: 'Cyber Threat Academy',
      subtitle: 'Real Indian case studies (2021–2024) & tactical defense playbook',
      module: 'AcademyModule'
    },
    'demo-mode': {
      title: 'Exhibition Demo Mode',
      subtitle: 'Kiosk showcase & isolated visitor challenge',
      module: 'DemoModeModule'
    },
    'settings': {
      title: 'Settings & Privacy',
      subtitle: 'Preferences, diagnostics & data control',
      module: 'SettingsModule'
    }
  };

  const Router = {
    currentRoute: 'overview',

    init: function() {
      // Listen to hash changes for browser back/forward buttons
      window.addEventListener('hashchange', () => {
        this.handleHashChange();
      });

      // Handle initial route
      this.handleHashChange();
    },

    handleHashChange: function() {
      let hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (!hash || !ROUTES[hash]) {
        hash = 'overview';
      }
      this.navigate(hash, false);
    },

    navigate: function(routeKey, updateHash = true) {
      if (!ROUTES[routeKey]) {
        routeKey = 'overview';
      }

      this.currentRoute = routeKey;
      global.CyberShield.State.getTransient().currentRoute = routeKey;

      // Broadcast active route to document attributes and CyberHUD engine
      document.documentElement.setAttribute('data-route', routeKey);
      if (document.body) {
        document.body.setAttribute('data-route', routeKey);
      }
      if (global.CyberShield.CyberHUD && typeof global.CyberShield.CyberHUD.setRoute === 'function') {
        global.CyberShield.CyberHUD.setRoute(routeKey);
      }

      if (updateHash && window.location.hash !== `#/${routeKey}`) {
        window.location.hash = `#/${routeKey}`;
      }

      // Update sidebar nav link active states
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        const dest = link.dataset.route;
        if (dest === routeKey) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });

      // Update mobile bottom nav active states
      const mobileNavLinks = document.querySelectorAll('.mobile-nav-item[data-route]');
      mobileNavLinks.forEach(item => {
        const dest = item.dataset.route;
        if (dest === routeKey) {
          item.classList.add('active');
          item.setAttribute('aria-current', 'page');
        } else {
          item.classList.remove('active');
          item.removeAttribute('aria-current');
        }
      });

      // Update topbar titles
      const pageTitleEl = document.querySelector('#current-page-title');
      const pageSubtitleEl = document.querySelector('#current-page-subtitle');
      if (pageTitleEl) pageTitleEl.textContent = ROUTES[routeKey].title;
      if (pageSubtitleEl) pageSubtitleEl.textContent = ROUTES[routeKey].subtitle;

      // Close mobile drawer if open
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.sidebar-overlay');
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
      if (overlay && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
      }

      // Render module content
      const contentContainer = document.querySelector('#main-content-view');
      if (contentContainer) {
        // Clean up previous module lifecycle resources (e.g. timers, workers)
        if (this.activeModule && typeof this.activeModule.cleanup === 'function') {
          try {
            this.activeModule.cleanup();
          } catch (e) {
            console.warn('Module cleanup error:', e);
          }
        }

        const modName = ROUTES[routeKey].module;
        const mod = global.CyberShield[modName];
        this.activeModule = mod;

        // Smooth fade transition
        contentContainer.style.opacity = '0';
        contentContainer.style.transform = 'translateY(4px)';

        setTimeout(() => {
          try {
            if (mod && typeof mod.render === 'function') {
              mod.render(contentContainer);
            } else {
              contentContainer.innerHTML = `<div class="card"><div class="alert alert-warning"><div class="alert-title">Module Unavailable</div><div class="alert-message">Module "${modName}" was not found or failed to load.</div></div></div>`;
            }
          } catch (err) {
            console.error(`Error rendering module ${modName}:`, err);
            contentContainer.innerHTML = `
              <div class="card" style="padding: var(--space-xl);">
                <div class="alert alert-danger">
                  <div class="alert-title">Rendering Error in ${modName}</div>
                  <div class="alert-message">${global.CyberShield.SafeRender.escapeHtml(err.message || 'Unknown error')}</div>
                </div>
              </div>
            `;
          } finally {
            contentContainer.style.opacity = '1';
            contentContainer.style.transform = 'translateY(0)';
          }

          // Accessible focus transfer to main view
          contentContainer.setAttribute('tabindex', '-1');
          contentContainer.focus();
          window.scrollTo(0, 0);

          global.CyberShield.Accessibility.announce(`Loaded ${ROUTES[routeKey].title}`);
        }, 80);
      }
    }
  };

  global.CyberShield.Router = Router;
})(window);
