/**
 * CyberShield — Unique ID Generators & Accessible Name Utilities
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  let counter = 0;

  const Ids = {
    /**
     * Generate an accessible unique DOM id with prefix
     */
    generateId: function(prefix = 'cs') {
      counter += 1;
      return `${prefix}-${Date.now().toString(36)}-${counter}`;
    },

    /**
     * Generate a session ID
     */
    generateSessionId: function() {
      return 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    }
  };

  global.CyberShield.Ids = Ids;
})(window);
