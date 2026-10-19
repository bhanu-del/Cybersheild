/**
 * CyberShield - URL Security, SSRF Defense, and Heuristic Anatomy Parser
 * Protects against Server-Side Request Forgery (SSRF) and inspects observable risk signals.
 */

const net = require('net');

// Known private / internal IPv4 blocks
const PRIVATE_IPV4_PATTERNS = [
  /^127\./,                         // Loopback (127.0.0.0/8)
  /^10\./,                          // Private Class A (10.0.0.0/8)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Private Class B (172.16.0.0/12)
  /^192\.168\./,                    // Private Class C (192.168.0.0/16)
  /^169\.254\./,                    // Link-local / Cloud metadata (169.254.0.0/16)
  /^0\./,                           // Current network (0.0.0.0/8)
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./ // Carrier-grade NAT (100.64.0.0/10)
];

const LOCALHOST_NAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'broadcasthost',
  'ip6-localhost',
  'ip6-loopback',
  '0.0.0.0'
]);

const KNOWN_BRANDS = [
  'paypal', 'google', 'apple', 'microsoft', 'amazon', 'netflix', 'facebook',
  'instagram', 'whatsapp', 'telegram', 'sbi', 'hdfc', 'icici', 'axis', 'paytm',
  'phonepe', 'bhim', 'chase', 'wellsfargo', 'bankofamerica', 'citibank'
];

const SUSPICIOUS_EXTENSIONS = [
  '.exe', '.scr', '.bat', '.cmd', '.vbs', '.js', '.ps1', '.apk', '.jar', '.msi', '.iso'
];

const URL_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
  'adf.ly', 'bit.do', 'cutt.ly', 'tiny.cc', 'rb.gy', 'shorturl.at'
]);

/**
 * Check if an IP address or hostname is a private/internal destination (SSRF protection)
 */
function isInternalOrPrivate(host) {
  if (!host) return true;
  const cleanHost = host.trim().toLowerCase().replace(/^\[|\]$/g, '');

  if (LOCALHOST_NAMES.has(cleanHost)) return true;
  if (cleanHost.endsWith('.local') || cleanHost.endsWith('.internal') || cleanHost.endsWith('.localhost')) return true;

  // Check IPv4
  if (net.isIPv4(cleanHost)) {
    for (const pattern of PRIVATE_IPV4_PATTERNS) {
      if (pattern.test(cleanHost)) return true;
    }
    return false;
  }

  // Check IPv6
  if (net.isIPv6(cleanHost)) {
    // ::1 loopback
    if (cleanHost === '::1' || cleanHost === '0:0:0:0:0:0:0:1') return true;
    // Link local fe80::/10
    if (/^fe[89ab]/i.test(cleanHost)) return true;
    // Unique local fc00::/7
    if (/^f[cd]/i.test(cleanHost)) return true;
    // IPv4-mapped IPv6 (::ffff:127.0.0.1)
    if (cleanHost.startsWith('::ffff:')) {
      const v4 = cleanHost.replace('::ffff:', '');
      if (net.isIPv4(v4)) {
        return isInternalOrPrivate(v4);
      }
    }
  }

  return false;
}

/**
 * Validate and safely parse a candidate URL
 */
function validateAndParseUrl(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    return { isValid: false, error: 'URL input must be a non-empty string.' };
  }

  const trimmed = rawInput.trim();
  if (trimmed.length > 4096) {
    return { isValid: false, error: 'URL exceeds maximum safe length of 4,096 characters.' };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch (err) {
    return { isValid: false, error: 'Malformed URL: Unable to parse according to WHATWG URL standards.' };
  }

  // Scheme validation: strictly HTTP or HTTPS
  const protocol = parsed.protocol.toLowerCase();
  if (protocol !== 'http:' && protocol !== 'https:') {
    return {
      isValid: false,
      error: `Unsupported protocol "${parsed.protocol}". Only standard http: and https: web links are permitted for inspection.`
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // SSRF validation
  if (isInternalOrPrivate(hostname)) {
    return {
      isValid: false,
      error: 'Security Policy Violation: Requests to internal network addresses, localhost, or private IP spaces are rejected for SSRF defense.'
    };
  }

  // Inspect observable structural features
  const features = extractUrlFeatures(parsed, trimmed);

  return {
    isValid: true,
    url: parsed.href,
    parsed: {
      href: parsed.href,
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port || (protocol === 'https:' ? '443' : '80'),
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      username: parsed.username,
      password: parsed.password
    },
    features
  };
}

/**
 * Extract observable structural risk indicators
 */
function extractUrlFeatures(urlObj, rawUrl) {
  const hostname = urlObj.hostname.toLowerCase();
  const pathname = urlObj.pathname.toLowerCase();
  const search = urlObj.search.toLowerCase();
  const isHttps = urlObj.protocol === 'https:';

  const isRawIp = net.isIP(hostname) !== 0;
  const isPunycode = hostname.includes('xn--');
  const hasUserInfo = Boolean(urlObj.username || urlObj.password || rawUrl.includes('@'));
  const isShortener = URL_SHORTENERS.has(hostname);

  // Split hostname into labels
  const parts = hostname.split('.');
  const registrableDomain = parts.length >= 2 ? parts.slice(-2).join('.') : hostname;
  const subdomains = parts.length > 2 ? parts.slice(0, -2).join('.') : '';

  // Look for brand impersonation in subdomains or path
  const brandImpersonations = [];
  for (const brand of KNOWN_BRANDS) {
    if (subdomains.includes(brand) && !registrableDomain.includes(brand)) {
      brandImpersonations.push({
        brand,
        location: 'subdomain',
        detail: `The trusted brand name "${brand}" appears in the subdomain (${subdomains}), while the actual root domain is "${registrableDomain}".`
      });
    }
  }

  // Check suspicious extensions in path
  const suspiciousExtensionsFound = [];
  for (const ext of SUSPICIOUS_EXTENSIONS) {
    if (pathname.endsWith(ext) || pathname.includes(`${ext}/`)) {
      suspiciousExtensionsFound.push(ext);
    }
  }

  return {
    isHttps,
    hostname,
    registrableDomain,
    subdomains,
    isRawIp,
    isPunycode,
    hasUserInfo,
    isShortener,
    brandImpersonations,
    suspiciousExtensionsFound,
    hasSuspiciousParams: search.includes('login') || search.includes('password') || search.includes('token') || search.includes('redirect=')
  };
}

module.exports = {
  isInternalOrPrivate,
  validateAndParseUrl,
  extractUrlFeatures
};
