/**
 * CyberShield — Accessibility Helper
 * Live region announcements, modal focus trap, and keyboard navigation.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  let liveRegion = null;
  let lastFocusedElement = null;

  const Accessibility = {
    /**
     * Initialize accessibility helpers
     */
    init: function() {
      // Create polite aria-live announcer element
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'cs-live-announcer';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
      }

      // Global ESC handler for open modals
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          const openModal = document.querySelector('.modal-backdrop.open');
          if (openModal) {
            const closeBtn = openModal.querySelector('[data-close-modal], [data-close-lesson-modal], #btn-close-cert, #btn-cert-cancel');
            if (closeBtn) {
              closeBtn.click();
            } else {
              openModal.classList.remove('open');
              Accessibility.releaseFocus(openModal);
            }
          }
        }
      });

      // Global backdrop click-to-close for open modals
      document.addEventListener('click', function(e) {
        if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop') && e.target.classList.contains('open')) {
          const closeBtn = e.target.querySelector('[data-close-modal], [data-close-lesson-modal], #btn-close-cert, #btn-cert-cancel');
          if (closeBtn) {
            closeBtn.click();
          } else {
            e.target.classList.remove('open');
            Accessibility.releaseFocus(e.target);
          }
        }
      });
    },

    /**
     * Announce a message to screen readers
     */
    announce: function(message, assertive = false) {
      if (!liveRegion) return;
      liveRegion.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 50);
    },

    /**
     * Trap keyboard focus inside a modal element
     */
    trapFocus: function(modalElement) {
      if (!modalElement) return;
      lastFocusedElement = document.activeElement;

      const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusables = Array.from(modalElement.querySelectorAll(focusableSelectors)).filter(
        el => !el.hasAttribute('disabled') && el.offsetParent !== null
      );

      if (focusables.length > 0) {
        focusables[0].focus();
      }

      const handleKey = function(e) {
        if (e.key !== 'Tab') return;
        const currentFocusables = Array.from(modalElement.querySelectorAll(focusableSelectors)).filter(
          el => !el.hasAttribute('disabled') && el.offsetParent !== null
        );
        if (currentFocusables.length === 0) return;

        const first = currentFocusables[0];
        const last = currentFocusables[currentFocusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };

      modalElement._trapHandler = handleKey;
      modalElement.addEventListener('keydown', handleKey);
    },

    /**
     * Release focus trap and restore focus
     */
    releaseFocus: function(modalElement) {
      if (modalElement && modalElement._trapHandler) {
        modalElement.removeEventListener('keydown', modalElement._trapHandler);
        delete modalElement._trapHandler;
      }
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }
  };

  global.CyberShield.Accessibility = Accessibility;
})(window);
