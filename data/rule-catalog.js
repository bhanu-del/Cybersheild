/**
 * CyberShield — Rule Catalogue (v1.0.0)
 * Centralized, deterministic definitions for URL and Message social-engineering detection rules.
 * Strictly local, explainable, transparent, and accompanied by practical recommendations.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const RULE_VERSION = '1.0.0';

  // Well-known high-value brand names often targeted by phishing impostors
  const POPULAR_BRANDS = [
    'paypal', 'google', 'microsoft', 'apple', 'amazon', 'netflix', 'facebook', 'instagram',
    'whatsapp', 'chase', 'wellsfargo', 'bankofamerica', 'citibank', 'sbi', 'hdfc', 'icici',
    'paytm', 'phonepe', 'gpay', 'binance', 'coinbase', 'fedex', 'dhl', 'ups', 'usps'
  ];
  const POPULAR_BRANDS_SET = new Set(POPULAR_BRANDS);

  // Common URL shortening domains
  const SHORTENER_DOMAINS = [
    'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'cutt.ly', 'rb.gy', 'goo.gl', 'ow.ly',
    'buff.ly', 'rebrand.ly', 'shorte.st', 'linktr.ee', 'v.gd'
  ];
  const SHORTENER_DOMAINS_SET = new Set(SHORTENER_DOMAINS);

  // TLDs frequently associated with disposable phishing campaigns
  const SUSPICIOUS_TLDS = [
    'xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'work', 'click', 'loan', 'men', 'country', 'stream', 'download'
  ];
  const SUSPICIOUS_TLDS_SET = new Set(SUSPICIOUS_TLDS);

  // Pre-compiled regular expressions (hoisted for zero-allocation reuse)
  const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;

  const URL_RULES = [
    {
      id: 'URL_USERINFO_DELIMITER',
      name: 'User-Info Delimiter Trick (@)',
      concern: 'HIGH_CONCERN',
      explanation: 'The URL uses an "@" symbol in the authority component. Browsers treat everything before "@" as login user-info and will connect to the hostname that appears AFTER the "@". Attackers use this to make a link look like a trusted site.',
      recommendation: 'Do NOT open this link. The real destination is whatever follows the "@" symbol.',
      limitations: 'Rarely used legitimately in public HTTP web links; modern browsers often warn or strip this.',
      check: function(urlObj, rawUrl) {
        if (rawUrl.includes('@') && rawUrl.indexOf('@') < (rawUrl.indexOf('/', 8) === -1 ? rawUrl.length : rawUrl.indexOf('/', 8))) {
          return {
            matched: true,
            evidence: `Found "@" delimiter in the URL authority: "${rawUrl.substring(0, rawUrl.indexOf('@') + 1)}"`
          };
        }
        return { matched: false };
      }
    },
    {
      id: 'URL_IP_ADDRESS_HOST',
      name: 'Raw IP-Address Hostname',
      concern: 'HIGH_CONCERN',
      explanation: 'The link connects directly to a numerical IP address instead of a registered domain name. Legitimate consumer services virtually always use brand domain names.',
      recommendation: 'Avoid entering credentials or personal data on links hosted directly on raw IP addresses.',
      limitations: 'Local development, routers, and internal private networks (192.168.x.x, 10.x.x.x) use IP addresses legitimately.',
      check: function(urlObj) {
        const host = urlObj.hostname;
        const isIpv6 = host.startsWith('[') && host.endsWith(']');
        if (IPV4_REGEX.test(host) || isIpv6) {
          return {
            matched: true,
            evidence: `Hostname is a raw IP address: "${host}"`
          };
        }
        return { matched: false };
      }
    },
    {
      id: 'URL_MISLEADING_DOMAIN',
      name: 'Misleading Brand in Subdomain/Path',
      concern: 'HIGH_CONCERN',
      explanation: 'A trusted brand name appears in a subdomain or URL path, but the actual registrable domain (the part right before the top-level domain) is different.',
      recommendation: 'Check the real domain right before the final dot (TLD). Do not trust a website just because a brand name appears elsewhere in the link.',
      limitations: 'Heuristic check using curated list of frequent impersonation targets.',
      check: function(urlObj) {
        const host = urlObj.hostname.toLowerCase();
        const parts = host.split('.');
        if (parts.length < 2) return { matched: false };

        // Identify registrable domain (e.g. evil-site.com or login-test.co.uk)
        let regDomain = parts.slice(-2).join('.');
        if (parts.length >= 3 && ['co.uk', 'com.au', 'edu.in', 'gov.in', 'ac.in', 'net.in', 'org.in'].includes(parts.slice(-2).join('.'))) {
          regDomain = parts.slice(-3).join('.');
        }

        for (const brand of POPULAR_BRANDS) {
          // If the brand is mentioned in the full hostname, but the registrable domain is NOT brand.com/brand.org
          if (host.includes(brand)) {
            const isGenuineBrand = regDomain.startsWith(brand + '.') || regDomain === brand;
            if (!isGenuineBrand) {
              return {
                matched: true,
                evidence: `Brand "${brand}" appears in hostname "${host}", but the authoritative domain is "${regDomain}".`
              };
            }
          }
        }
        return { matched: false };
      }
    },
    {
      id: 'URL_PUNYCODE_IDN',
      name: 'Punycode / Internationalized Domain (IDN)',
      concern: 'REVIEW_ADVISED',
      explanation: 'The hostname uses Punycode ("xn--"), which allows non-Latin characters. Attackers use visually identical Cyrillic or Greek letters (e.g. "а" vs "a") to imitate trusted brands.',
      recommendation: 'Inspect the decoded domain name carefully for lookalike replacement characters.',
      limitations: 'Many international and localized websites legitimately use non-Latin alphabets and IDN.',
      check: function(urlObj) {
        const host = urlObj.hostname.toLowerCase();
        if (host.includes('xn--')) {
          return {
            matched: true,
            evidence: `Punycode representation detected: "${host}"`
          };
        }
        return { matched: false };
      }
    },
    {
      id: 'URL_SHORTENER',
      name: 'Hidden Destination (URL Shortener)',
      concern: 'REVIEW_ADVISED',
      explanation: 'This address is a link-shortening service. The true destination URL is hidden and cannot be evaluated locally without navigating to the server.',
      recommendation: 'Use a link-unshortener tool or verify the sender before opening short links from unexpected messages.',
      limitations: 'URL shorteners are widely used for clean sharing on SMS, Twitter/X, and social media.',
      check: function(urlObj) {
        const host = urlObj.hostname.toLowerCase();
        if (SHORTENER_DOMAINS_SET.has(host) || SHORTENER_DOMAINS.some(sd => host.endsWith('.' + sd))) {
          return {
            matched: true,
            evidence: `Shortener domain identified: "${host}"`
          };
        }
        return { matched: false };
      }
    },
    {
      id: 'URL_HTTP_UNENCRYPTED',
      name: 'Unencrypted Connection (HTTP)',
      concern: 'REVIEW_ADVISED',
      explanation: 'The link uses plain HTTP rather than encrypted HTTPS. Data sent over HTTP can be intercepted or altered by anyone on the local Wi-Fi or network.',
      recommendation: 'Never type passwords, debit/credit cards, or sensitive data on unencrypted HTTP websites. Note: HTTPS alone does not prove a site is harmless.',
      limitations: 'Older legacy blogs, local IoT devices, or archived educational resources may still use HTTP legitimately.',
      check: function(urlObj) {
        if (urlObj.protocol === 'http:') {
          return {
            matched: true,
            evidence: `Protocol is unencrypted "${urlObj.protocol}"`
          };
        }
        return { matched: false };
      }
    },
    {
      id: 'URL_UNUSUAL_PORT',
      name: 'Non-Standard Web Port',
      concern: 'REVIEW_ADVISED',
      explanation: 'The URL specifies an unusual network port (e.g. :8080, :8888, :1337) instead of standard web ports (80 for HTTP, 443 for HTTPS).',
      recommendation: 'Confirm why the service is hosted on an unconventional port before submitting any information.',
      limitations: 'Developers and enterprise intranets routinely use non-standard ports for testing environments.',
      check: function(urlObj) {
        if (urlObj.port && urlObj.port !== '80' && urlObj.port !== '443') {
          return {
            matched: true,
            evidence: `Specified port is :${urlObj.port}`
          };
        }
        return { matched: false };
      }
    },
    {
      id: 'URL_UNUSUAL_STRUCTURE',
      name: 'Unusual Hostname Complexity / Hyphens',
      concern: 'REVIEW_ADVISED',
      explanation: 'The hostname contains more than 3 subdomains or multiple consecutive hyphens, which is a common tactic to construct convincing lookalike hostnames.',
      recommendation: 'Look closely at the authoritative domain name right before the TLD.',
      limitations: 'Large cloud infrastructures (e.g. AWS S3 buckets or CDN nodes) often use multi-part subdomains.',
      check: function(urlObj) {
        const host = urlObj.hostname;
        const subdomains = host.split('.');
        const hyphenCount = (host.match(/-/g) || []).length;
        if (subdomains.length > 4 || hyphenCount >= 3) {
          return {
            matched: true,
            evidence: `Hostname has ${subdomains.length} dot segments and ${hyphenCount} hyphens: "${host}"`
          };
        }
        return { matched: false };
      }
    },
    {
      id: 'URL_SUSPICIOUS_PATH_QUERY',
      name: 'Sensitive Credential / Verification Terms in Path',
      concern: 'REVIEW_ADVISED',
      explanation: 'The URL path or query parameters contain terms commonly found in phishing forms (e.g. "verify_account", "update-billing", "secure-login").',
      recommendation: 'Never log into an account through a link received in an unexpected email or message. Navigate directly through the official website or app.',
      limitations: 'Legitimate web applications also use login, auth, and verify in their endpoints.',
      check: function(urlObj) {
        const fullPath = (urlObj.pathname + urlObj.search).toLowerCase();
        const sensitiveTerms = ['verify-account', 'update-billing', 'secure-login', 'account-blocked', 'kyc-update', 'wallet-connect', 'session-expired'];
        for (const term of sensitiveTerms) {
          if (fullPath.includes(term)) {
            return {
              matched: true,
              evidence: `Path/query contains sensitive term "${term}"`
            };
          }
        }
        return { matched: false };
      }
    },
    {
      id: 'URL_SUSPICIOUS_TLD',
      name: 'Uncommon or High-Risk Generic TLD',
      concern: 'REVIEW_ADVISED',
      explanation: 'The domain uses a top-level domain frequently used for spam and bulk phishing registrations due to low registration costs.',
      recommendation: 'Exercise extra caution if you were directed here from an unsolicited message.',
      limitations: 'Legitimate small businesses and tech projects also register these domains.',
      check: function(urlObj) {
        const parts = urlObj.hostname.toLowerCase().split('.');
        const tld = parts[parts.length - 1];
        if (SUSPICIOUS_TLDS_SET.has(tld)) {
          return {
            matched: true,
            evidence: `Domain ends in high-risk TLD ".${tld}"`
          };
        }
        return { matched: false };
      }
    }
  ];

  const MESSAGE_RULES = [
    {
      id: 'MSG_CREDENTIAL_OTP',
      name: 'Direct Credential or OTP Request',
      concern: 'HIGH_CONCERN',
      explanation: 'The message requests a one-time password (OTP), PIN, password, CVV, or security code. Legitimate institutions (banks, tech support, government bodies) NEVER ask for your OTP or password via SMS, chat, or phone.',
      recommendation: 'NEVER share your OTP, PIN, or password with anyone, regardless of who they claim to be.',
      patterns: [
        /\b(?:share|send|enter|give|provide)\b.*\b(?:otp|one[- ]time password|pin|cvv|password|passcode|secret code)\b/i,
        /\b(?:6[- ]digit|4[- ]digit)\s*(?:otp|code|pin)\b/i,
        /\b(?:otp|pin)\s*(?:bhejo|share karo|dalo|batao)\b/i // Hinglish support
      ]
    },
    {
      id: 'MSG_URGENCY_THREAT',
      name: 'Artificial Urgency & Account Threat',
      concern: 'HIGH_CONCERN',
      explanation: 'Scammers manufacture extreme urgency ("within 24 hours", "account will be blocked", "suspended immediately") to trigger panic so victims act before thinking critically.',
      recommendation: 'Pause and take a breath. High-pressure deadlines are the #1 hallmark of social-engineering attacks.',
      patterns: [
        /\b(?:within\s*\d+\s*(?:hours?|minutes?|mins?|days?)|immediately|right now|urgent action|final notice|account\s*(?:blocked|suspended|deactivated|terminated))\b/i,
        /\b(?:band ho jayega|turant|24 ghante|block ho gaya)\b/i // Hinglish
      ]
    },
    {
      id: 'MSG_UNUSUAL_PAYMENT',
      name: 'Unusual Payment / Transfer / Advance Fee',
      concern: 'HIGH_CONCERN',
      explanation: 'Demands for payment via unusual or irreversible methods such as gift cards, cryptocurrency, or upfront "processing fees" to release a larger sum.',
      recommendation: 'Never pay upfront fees to claim a prize, job, or loan. No legitimate company requests payment in gift cards or crypto.',
      patterns: [
        /\b(?:gift cards?|apple cards?|steam cards?|bitcoin|usdt|crypto|wire transfer|processing fee|advance fee)\b/i,
        /\b(?:pehle pay karo|advance payment|processing charges)\b/i // Hinglish
      ]
    },
    {
      id: 'MSG_FAKE_PRIZE_OFFER',
      name: 'Unsolicited Prize, Refund, or Grant',
      concern: 'HIGH_CONCERN',
      explanation: 'Claims that you have won a lottery, jackpot, government grant, tax refund, or high-paying remote job that you never applied for.',
      recommendation: 'If you did not enter a contest or apply for a grant, you did not win. You cannot win a lottery you never bought a ticket for.',
      patterns: [
        /\b(?:congratulations|you have won|lottery winner|jackpot|cash prize|unclaimed refund|tax refund pending|selected for work from home job)\b/i,
        /\b(?:inaam jeeta|lottery lagi|refund mila|crore rupaye)\b/i // Hinglish
      ]
    },
    {
      id: 'MSG_AUTHORITY_IMPERSONATION',
      name: 'Impersonation of Official Authority',
      concern: 'REVIEW_ADVISED',
      explanation: 'The sender claims to represent a bank security team, tax department, law enforcement, or tech support to intimidate you into compliance.',
      recommendation: 'Verify independently. Hang up or exit the chat, then contact the organization directly using a phone number or website you know is authentic.',
      patterns: [
        /\b(?:income tax department|rbi|reserve bank|police department|cyber crime cell|cbi|fbi|irs|bank security team|it helpdesk admin)\b/i,
        /\b(?:police ki taraf se|bank manager|income tax notice)\b/i // Hinglish
      ]
    },
    {
      id: 'MSG_OFF_PLATFORM_MOVE',
      name: 'Pressure to Move to Unmonitored Channel',
      concern: 'REVIEW_ADVISED',
      explanation: 'Requests to move off an official platform (like eBay, Upwork, OLX, Amazon) onto private WhatsApp or Telegram where buyer protection does not apply.',
      recommendation: 'Keep all communications and transactions strictly inside the official platform.',
      patterns: [
        /\b(?:(?:chat|message|contact|ping|reach out).{0,35}(?:whatsapp|telegram|signal|viber))\b/i,
        /\b(?:whatsapp pe message karo|telegram pe baat karo)\b/i
      ]
    },
    {
      id: 'MSG_SECRECY_ISOLATION',
      name: 'Secrecy & Isolation Demands',
      concern: 'REVIEW_ADVISED',
      explanation: 'Instructing you not to tell anyone, family members, or bank staff. Isolation prevents victims from getting a second opinion from someone who would recognize the scam.',
      recommendation: 'Always discuss unusual urgent financial or account requests with a trusted friend, family member, or colleague.',
      patterns: [
        /\b(?:keep this confidential|do not disclose|do not tell anyone|strictly secret|do not inform bank staff|kisi ko mat batana)\b/i
      ]
    },
    {
      id: 'MSG_BYPASS_VERIFICATION',
      name: 'Advice to Ignore Official Warnings',
      concern: 'HIGH_CONCERN',
      explanation: 'Instructing you to ignore security alerts from your bank or browser, or disable antivirus/two-factor protections.',
      recommendation: 'Never ignore automated security warnings sent by your bank or device operating system.',
      patterns: [
        /\b(?:ignore bank sms|ignore security alert|bypass verification|disable antivirus|turn off protection)\b/i
      ]
    },
    {
      id: 'MSG_THREAT_FEAR',
      name: 'Intimidation, Arrest Threat, or Extortion',
      concern: 'HIGH_CONCERN',
      explanation: 'Threats of immediate arrest, police warrant, or blackmail claims (e.g. claiming they recorded your webcam).',
      recommendation: 'Do not panic. Scammers blast automated extortion scripts to thousands of random people. Law enforcement does not contact you via WhatsApp to demand money.',
      patterns: [
        /\b(?:arrest warrant|police will arrive|legal case registered|court summon|recorded your video|hacked your webcam)\b/i,
        /\b(?:police bhej rahe|arrest ho jaoge)\b/i // Hinglish
      ]
    }
  ];

  global.CyberShield.RULE_VERSION = RULE_VERSION;
  global.CyberShield.POPULAR_BRANDS = POPULAR_BRANDS;
  global.CyberShield.URL_RULES = URL_RULES;
  global.CyberShield.MESSAGE_RULES = MESSAGE_RULES;

})(window);
