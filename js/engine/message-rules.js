/**
 * CyberShield — Message Red-Flag Evaluator
 * Detects social-engineering patterns, urgency threats, OTP requests, and extracts embedded URLs safely.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const MessageRules = {
    /**
     * Extract any HTTP/HTTPS URLs embedded in the message text.
     * Returns an array of clean URL strings (never visits or fetches them).
     */
    extractUrls: function(text) {
      if (!text || typeof text !== 'string') return [];
      const urlRegex = /\bhttps?:\/\/[^\s<>"'{}|\\^`]+[^\s<>"'{}|\\^`.,;:?!()\[\]]/gi;
      const found = text.match(urlRegex) || [];
      // Deduplicate
      return Array.from(new Set(found));
    },

    /**
     * Evaluate message text against the rule catalogue.
     */
    evaluate: function(text) {
      if (!text || typeof text !== 'string') {
        throw new Error('Message text is required');
      }

      const rules = global.CyberShield.MESSAGE_RULES || [];
      const matches = [];
      const highlightRanges = []; // { start: number, end: number, text: string, ruleName: string }

      for (const rule of rules) {
        let ruleMatched = false;
        let matchedEvidence = [];

        for (const pattern of rule.patterns) {
          // Find all occurrences with global regex
          const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g';
          const globalPattern = new RegExp(pattern.source, flags);
          let match;

          while ((match = globalPattern.exec(text)) !== null) {
            ruleMatched = true;
            matchedEvidence.push(match[0]);
            highlightRanges.push({
              start: match.index,
              end: match.index + match[0].length,
              matchedText: match[0],
              ruleName: rule.name
            });
          }
        }

        if (ruleMatched) {
          const uniqueEvidence = Array.from(new Set(matchedEvidence));
          matches.push({
            ruleId: rule.id,
            name: rule.name,
            concern: rule.concern,
            evidence: `Found pattern: "${uniqueEvidence.join('", "')}"`,
            explanation: rule.explanation,
            recommendation: rule.recommendation,
            limitations: 'Heuristic keyword and pattern match. Genuine urgent communications can also use similar phrasing.'
          });
        }
      }

      const extractedUrls = this.extractUrls(text);
      if (extractedUrls.length > 0) {
        matches.push({
          ruleId: 'MSG_CONTAINS_URL',
          name: 'Contains Embedded Web Link(s)',
          concern: 'REVIEW_ADVISED',
          evidence: `Extracted ${extractedUrls.length} link(s) from message text.`,
          explanation: 'Phishing messages frequently contain links leading to fraudulent credential-harvesting forms or malware.',
          recommendation: 'Inspect the link in CyberShield\'s Link Inspector before opening it.',
          limitations: 'Legitimate service notifications also contain links.'
        });
      }

      // Merge overlapping highlight ranges for clean display
      const mergedRanges = this.mergeRanges(highlightRanges);

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
        rawText: text,
        extractedUrls: extractedUrls,
        matches: matches,
        highlightRanges: mergedRanges,
        highConcernCount: highConcernCount,
        reviewAdvisedCount: reviewAdvisedCount,
        overallConcern: overallConcern,
        overallLabel: overallLabel,
        overallClass: overallClass
      };
    },

    /**
     * Merge overlapping or adjacent highlight index ranges
     */
    mergeRanges: function(ranges) {
      if (!ranges || ranges.length === 0) return [];
      const sorted = ranges.slice().sort((a, b) => a.start - b.start);
      const merged = [sorted[0]];

      for (let i = 1; i < sorted.length; i++) {
        const prev = merged[merged.length - 1];
        const current = sorted[i];

        if (current.start <= prev.end) {
          prev.end = Math.max(prev.end, current.end);
          prev.ruleName = prev.ruleName + ', ' + current.ruleName;
        } else {
          merged.push(current);
        }
      }
      return merged;
    }
  };

  global.CyberShield.MessageRules = MessageRules;
})(window);
