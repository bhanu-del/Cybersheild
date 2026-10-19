/**
 * CyberShield — Safe Rendering Utilities
 * Strictly enforces untrusted text escaping, prevents XSS, and safely manipulates DOM.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const SafeRender = {
    /**
     * Escape special HTML characters to prevent XSS injection.
     */
    escapeHtml: function(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },

    /**
     * Set safe text content directly onto a DOM element.
     */
    setText: function(element, text) {
      if (!element) return;
      element.textContent = text === null || text === undefined ? '' : String(text);
    },

    /**
     * Safely create a DOM element with attributes and text/children
     */
    createElement: function(tag, attrs = {}, children = []) {
      const el = document.createElement(tag);
      for (const [key, value] of Object.entries(attrs)) {
        if (key === 'className') {
          el.className = value;
        } else if (key === 'textContent') {
          el.textContent = value;
        } else if (key.startsWith('on') && typeof value === 'function') {
          const eventName = key.slice(2).toLowerCase();
          el.addEventListener(eventName, value);
        } else if (value !== null && value !== undefined && value !== false) {
          el.setAttribute(key, value === true ? '' : String(value));
        }
      }

      if (Array.isArray(children)) {
        for (const child of children) {
          if (typeof child === 'string' || typeof child === 'number') {
            el.appendChild(document.createTextNode(String(child)));
          } else if (child instanceof Node) {
            el.appendChild(child);
          }
        }
      }
      return el;
    },

    /**
     * Safely clear an element's children
     */
    clearElement: function(element) {
      if (!element) return;
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  };

  global.CyberShield.SafeRender = SafeRender;
})(window);
