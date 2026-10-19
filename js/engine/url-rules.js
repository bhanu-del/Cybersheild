/**
 * CyberShield — URL Rules Evaluator
 * Executes deterministic rules against parsed URL data without network requests.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const UrlRules = {
    /**
     * Analyze a parsed URL object against the rule catalogue.
     * Returns: { matches: Array, stats: Object }
     */
    evaluate: function(parsed) {
      const rules = global.CyberShield.URL_RULES || [];
      const matches = [];

      for (const rule of rules) {
        try {
          const res = rule.check(parsed.urlObj, parsed.rawUrl);
          if (res && res.matched) {
            matches.push({
              ruleId: rule.id,
              name: rule.name,
              concern: rule.concern,
              evidence: res.evidence,
              explanation: rule.explanation,
              recommendation: rule.recommendation,
              limitations: rule.limitations
            });
          }
        } catch (err) {
          console.warn(`Rule evaluation error for ${rule.id}:`, err);
        }
      }

      // Count severities
      const highConcernCount = matches.filter(m => m.concern === 'HIGH_CONCERN').length;
      const reviewAdvisedCount = matches.filter(m => m.concern === 'REVIEW_ADVISED').length;

      let overallConcern = 'NO_OBVIOUS_WARNINGS';
      let overallLabel = 'No obvious warning signs';
      let overallClass = 'success';

      if (highConcernCount > 0 || reviewAdvisedCount >= 2) {
        overallConcern = 'HIGH_CONCERN';
        overallLabel = 'High concern';
        overallClass = 'warning';
      } else if (reviewAdvisedCount === 1) {
        overallConcern = 'REVIEW_ADVISED';
        overallLabel = 'Review advised';
        overallClass = 'caution';
      }

      return {
        parsed: parsed,
        matches: matches,
        highConcernCount: highConcernCount,
        reviewAdvisedCount: reviewAdvisedCount,
        overallConcern: overallConcern,
        overallLabel: overallLabel,
        overallClass: overallClass
      };
    }
  };

  global.CyberShield.UrlRules = UrlRules;
})(window);
