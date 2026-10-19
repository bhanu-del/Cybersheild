/**
 * CyberShield — Formatting Utilities
 * Robust formatting for percentages, dates, byte sizes, and text truncation.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const Formatting = {
    /**
     * Format a weighted accuracy percentage.
     * Safely handles zero-division and missing values.
     * Returns: e.g. "85%", or "No answers recorded" / "—"
     */
    formatAccuracy: function(correct, total, emptyFallback = '—') {
      const c = Number(correct) || 0;
      const t = Number(total) || 0;
      if (t <= 0) return emptyFallback;
      const pct = Math.round((c / t) * 100);
      return `${pct}%`;
    },

    /**
     * Format timestamp to readable local date/time string
     */
    formatDate: function(timestamp) {
      if (!timestamp) return '—';
      try {
        const d = new Date(timestamp);
        return d.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return '—';
      }
    },

    /**
     * Format byte sizes (e.g. "1.2 KB", "18.4 KB")
     */
    formatBytes: function(bytes) {
      const b = Number(bytes) || 0;
      if (b < 1024) return `${b} B`;
      const kb = (b / 1024).toFixed(1);
      return `${kb} KB`;
    },

    /**
     * Truncate string with ellipsis if it exceeds max length
     */
    truncate: function(str, maxLen = 60) {
      if (!str) return '';
      if (str.length <= maxLen) return str;
      return str.slice(0, maxLen - 3) + '...';
    }
  };

  global.CyberShield.Formatting = Formatting;
})(window);
