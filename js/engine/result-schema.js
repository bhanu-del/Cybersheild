/**
 * CyberShield — Standard Result Schema
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const ResultSchema = {
    create: function(type, payload) {
      return {
        id: 'res_' + Date.now().toString(36),
        inputType: type, // 'URL' or 'MESSAGE'
        timestamp: Date.now(),
        version: global.CyberShield.RULE_VERSION || '1.0.0',
        overallConcern: payload.overallConcern,
        overallLabel: payload.overallLabel,
        overallClass: payload.overallClass,
        matches: payload.matches || [],
        parsed: payload.parsed || null,
        extractedUrls: payload.extractedUrls || [],
        highlightRanges: payload.highlightRanges || [],
        whatWasNotChecked: payload.whatWasNotChecked || [],
        safeNextSteps: payload.safeNextSteps || [],
        disclaimer: payload.disclaimer || ''
      };
    }
  };

  global.CyberShield.ResultSchema = ResultSchema;
})(window);
