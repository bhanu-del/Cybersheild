/**
 * CyberShield - In-Memory Sliding-Window Rate Limiter
 * Protects Gemini API backend against abuse and denial of service.
 */

function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000;
  const max = options.max || parseInt(process.env.RATE_LIMIT_MAX, 10) || 60;
  const hits = new Map();

  // Periodically clean expired buckets every 60 seconds
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of hits.entries()) {
      if (now - record.resetTime > windowMs) {
        hits.delete(ip);
      }
    }
  }, 60000).unref();

  return function rateLimiter(req, res, next) {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    let record = hits.get(ip);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      hits.set(ip, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please wait before submitting another security analysis.',
          retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000)
        }
      });
    }

    next();
  };
}

module.exports = { createRateLimiter };
