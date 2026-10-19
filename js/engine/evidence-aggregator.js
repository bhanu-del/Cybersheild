/**
 * CyberShield — Evidence Aggregator
 * Formulates transparent, honest, evidence-based results with clear boundaries.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const EvidenceAggregator = {
    /**
     * Build aggregated URL analysis result
     */
    aggregateUrlResult: function(evaluation) {
      const parsed = evaluation.parsed;
      const whatWasNotChecked = [
        'Live page contents (HTML, scripts, or login fields) — CyberShield never visits links.',
        'Current DNS records, server IP reputation, or registrar WHOIS information.',
        'Multi-hop HTTP redirects (e.g. tracking links or disguised redirectors).',
        'Real-time commercial malware or zero-day phishing threat databases.'
      ];

      const safeNextSteps = [];
      if (evaluation.overallConcern === 'HIGH_CONCERN') {
        safeNextSteps.push('Do NOT click or open this link on your device.');
        safeNextSteps.push('If you need to access this service, type the official brand address into your browser manually.');
        safeNextSteps.push('Never enter passwords, credit cards, or OTP codes on suspicious or mismatched domains.');
      } else if (evaluation.overallConcern === 'REVIEW_ADVISED') {
        safeNextSteps.push('Verify the identity of the sender before clicking.');
        safeNextSteps.push('Look closely at the authoritative domain name directly before the top-level domain.');
        safeNextSteps.push('If it is a shortened link, use a safe unshortener preview tool.');
      } else {
        safeNextSteps.push('No obvious warning patterns matched local heuristic rules.');
        safeNextSteps.push('Remember: Sophisticated scammers register clean-looking domains every day.');
        safeNextSteps.push('Always confirm unexpected links through a known, trusted official channel.');
      }

      let disclaimer = '';
      if (evaluation.overallConcern === 'NO_OBVIOUS_WARNINGS') {
        disclaimer = 'Important: "No obvious warning signs" does NOT mean this address is guaranteed safe or verified. CyberShield runs transparent local heuristic rules; it is not an antivirus or real-time threat feed.';
      } else {
        disclaimer = 'CyberShield local heuristics identified specific structural or naming signals. These findings are educational evidence to help you inspect links critically.';
      }

      return global.CyberShield.ResultSchema.create('URL', {
        overallConcern: evaluation.overallConcern,
        overallLabel: evaluation.overallLabel,
        overallClass: evaluation.overallClass,
        matches: evaluation.matches,
        parsed: parsed,
        whatWasNotChecked: whatWasNotChecked,
        safeNextSteps: safeNextSteps,
        disclaimer: disclaimer
      });
    },

    /**
     * Build aggregated Message analysis result
     */
    aggregateMessageResult: function(evaluation) {
      const whatWasNotChecked = [
        'Sender email headers, SPF/DKIM verification, or true SMS routing origin.',
        'Sender phone number carrier registration or caller-ID spoofing status.',
        'Account history or relationship context between you and the sender.',
        'External spam reporting reputation databases.'
      ];

      const safeNextSteps = [];
      if (evaluation.overallConcern === 'HIGH_CONCERN') {
        safeNextSteps.push('Stop and disconnect. Do not reply, call the provided number, or click any links.');
        safeNextSteps.push('Never disclose OTPs, PINs, or credentials to anyone over chat or SMS.');
        safeNextSteps.push('If this claimed to be your bank or service, open their official mobile app or dial the phone number on the back of your card.');
      } else if (evaluation.overallConcern === 'REVIEW_ADVISED') {
        safeNextSteps.push('Verify independently through a known trusted channel before taking action.');
        safeNextSteps.push('If the message contains a link, inspect it using the Link Inspector below.');
        safeNextSteps.push('Avoid moving off official platforms to private chat channels.');
      } else {
        safeNextSteps.push('No common scam or social-engineering keywords were matched by the rule engine.');
        safeNextSteps.push('Always exercise caution if the message is unexpected or asks for sensitive favors.');
      }

      let disclaimer = '';
      if (evaluation.overallConcern === 'NO_OBVIOUS_WARNINGS') {
        disclaimer = 'Notice: "No obvious warning signs" is NOT proof that the message is harmless. Scammers frequently use polite, grammatically perfect language without obvious urgency phrases.';
      } else {
        disclaimer = 'These findings reflect detected social-engineering indicators. Use this evidence to make a cautious, informed decision.';
      }

      return global.CyberShield.ResultSchema.create('MESSAGE', {
        overallConcern: evaluation.overallConcern,
        overallLabel: evaluation.overallLabel,
        overallClass: evaluation.overallClass,
        matches: evaluation.matches,
        extractedUrls: evaluation.extractedUrls,
        highlightRanges: evaluation.highlightRanges,
        whatWasNotChecked: whatWasNotChecked,
        safeNextSteps: safeNextSteps,
        disclaimer: disclaimer
      });
    }
  };

  global.CyberShield.EvidenceAggregator = EvidenceAggregator;
})(window);
