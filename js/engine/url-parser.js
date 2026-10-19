/**
 * CyberShield — Local URL Parser Engine
 * Native browser URL parsing with advanced structural analysis,
 * subdomain/registrable-domain separation, and homograph detection.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const MULTI_PART_TLDS = [
    'co.uk', 'gov.uk', 'ac.uk', 'org.uk',
    'com.au', 'net.au', 'org.au', 'edu.au',
    'co.in', 'edu.in', 'gov.in', 'ac.in', 'org.in', 'net.in',
    'co.nz', 'co.za', 'co.jp', 'com.br', 'com.mx'
  ];

  const UrlParser = {
    /**
     * Parse raw URL string and extract detailed factual structural components.
     */
    parse: function(rawUrl) {
      if (!rawUrl || typeof rawUrl !== 'string') {
        throw new Error('URL string required');
      }

      const trimmed = rawUrl.trim();
      const urlObj = new URL(trimmed);

      // Check for user-info @ trick
      const hasUserInfo = trimmed.includes('@') &&
        trimmed.indexOf('@') < (trimmed.indexOf('/', 8) === -1 ? trimmed.length : trimmed.indexOf('/', 8));
      
      const userInfoStr = hasUserInfo ? trimmed.substring(trimmed.indexOf('://') + 3, trimmed.indexOf('@')) : '';

      // Deconstruct hostname into subdomains and registrable domain
      const host = urlObj.hostname.toLowerCase();
      const hostParts = host.split('.');

      let registrableDomain = host;
      let subdomain = '';
      let tld = '';

      if (hostParts.length >= 2) {
        let isMultiPart = false;
        if (hostParts.length >= 3) {
          const possibleMulti = hostParts.slice(-2).join('.');
          if (MULTI_PART_TLDS.includes(possibleMulti)) {
            isMultiPart = true;
            registrableDomain = hostParts.slice(-3).join('.');
            subdomain = hostParts.slice(0, -3).join('.');
            tld = possibleMulti;
          }
        }

        if (!isMultiPart) {
          registrableDomain = hostParts.slice(-2).join('.');
          subdomain = hostParts.slice(0, -2).join('.');
          tld = hostParts[hostParts.length - 1];
        }
      }

      // Check Punycode
      const isPunycode = host.includes('xn--');

      // Check IP address host
      const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
      const isIpv6 = host.startsWith('[') && host.endsWith(']');

      return {
        rawUrl: trimmed,
        protocol: urlObj.protocol,
        scheme: urlObj.protocol.replace(':', ''),
        hostname: host,
        port: urlObj.port || (urlObj.protocol === 'https:' ? '443 (default)' : '80 (default)'),
        isDefaultPort: !urlObj.port || urlObj.port === '80' || urlObj.port === '443',
        pathname: urlObj.pathname || '/',
        search: urlObj.search || '',
        hash: urlObj.hash || '',
        registrableDomain: registrableDomain,
        subdomain: subdomain || '(none)',
        tld: tld,
        hasUserInfo: hasUserInfo,
        userInfo: userInfoStr,
        isPunycode: isPunycode,
        isIpAddress: isIpv4 || isIpv6,
        urlObj: urlObj
      };
    }
  };

  global.CyberShield.UrlParser = UrlParser;
})(window);
