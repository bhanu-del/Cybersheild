/**
 * CyberShield — Validation Engine
 * Enforces input constraints, limits, URL schemes, and training configurations.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const LIMITS = {
    URL_MAX_CHARS: 4096,      // 4 KB
    MESSAGE_MAX_CHARS: 20480, // 20 KB
  };

  const Validation = {
    LIMITS: LIMITS,

    /**
     * Validate raw URL string before inspection.
     * Returns: { isValid: boolean, error?: string, trimmedUrl?: string }
     */
    validateUrlInput: function(rawInput) {
      if (!rawInput || typeof rawInput !== 'string') {
        return { isValid: false, error: 'URL input cannot be empty or whitespace.' };
      }

      const trimmed = rawInput.trim();
      if (!trimmed) {
        return { isValid: false, error: 'URL input cannot be empty or whitespace.' };
      }

      if (trimmed.length > LIMITS.URL_MAX_CHARS) {
        return {
          isValid: false,
          error: `URL is too long (${trimmed.length} characters). Maximum allowed limit is ${LIMITS.URL_MAX_CHARS} characters (4 KB).`
        };
      }

      // Check scheme
      const schemeMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
      if (!schemeMatch) {
        // Detect if it looks like a naked domain (e.g. example.com or bit.ly/test)
        const looksLikeDomain = !trimmed.includes(' ') && (trimmed.includes('.') || trimmed.includes(':'));
        return {
          isValid: false,
          canAutoFix: looksLikeDomain,
          suggestedUrl: looksLikeDomain ? `https://${trimmed}` : null,
          error: looksLikeDomain 
            ? `Missing scheme. Link Inspector requires http:// or https:// (e.g. https://${trimmed}).`
            : 'Missing scheme. The URL must start with http:// or https:// (e.g. https://example.com).'
        };
      }

      const scheme = schemeMatch[1].toLowerCase();
      if (scheme !== 'http' && scheme !== 'https') {
        return {
          isValid: false,
          error: `Unsupported scheme "${scheme}:". For safety reasons, Link Inspector only analyzes http:// and https:// web addresses.`
        };
      }

      // Try browser standard URL parser
      try {
        const parsed = new URL(trimmed);
        if (!parsed.hostname) {
          return { isValid: false, error: 'Invalid URL: No valid hostname found in the address.' };
        }
        return { isValid: true, trimmedUrl: trimmed, parsed: parsed };
      } catch (err) {
        return {
          isValid: false,
          error: `URL syntax error: The address could not be parsed by the browser (${err.message}).`
        };
      }
    },

    /**
     * Validate raw message text before analysis.
     * Returns: { isValid: boolean, error?: string, trimmedText?: string }
     */
    validateMessageInput: function(rawInput) {
      if (!rawInput || typeof rawInput !== 'string') {
        return { isValid: false, error: 'Please paste or type a message to analyze.' };
      }

      const trimmed = rawInput.trim();
      if (!trimmed) {
        return { isValid: false, error: 'Message input cannot be empty or whitespace.' };
      }

      if (trimmed.length > LIMITS.MESSAGE_MAX_CHARS) {
        return {
          isValid: false,
          error: `Message exceeds the size limit (${trimmed.length} characters). Maximum allowed size is ${LIMITS.MESSAGE_MAX_CHARS} characters (20 KB).`
        };
      }

      return { isValid: true, trimmedText: trimmed };
    },

    /**
     * Validate Arena round setup
     */
    validateArenaSetup: function(allScenarios, category, difficulty, requestedCount) {
      if (!Array.isArray(allScenarios) || allScenarios.length === 0) {
        return { isValid: false, error: 'Scenario database is empty or not loaded.' };
      }

      let eligible = allScenarios.filter(s => {
        const matchCat = category === 'all' || s.category === category;
        const matchDiff = difficulty === 'all' || s.difficulty === difficulty;
        return matchCat && matchDiff;
      });

      if (eligible.length === 0) {
        return {
          isValid: false,
          error: `No scenarios available for category "${category}" at difficulty "${difficulty}". Please choose "All Categories" or another difficulty.`
        };
      }

      const count = requestedCount === 'all' ? eligible.length : Math.min(Number(requestedCount) || 5, eligible.length);

      return { isValid: true, eligibleScenarios: eligible, questionCount: count };
    }
  };

  global.CyberShield.Validation = Validation;
})(window);
