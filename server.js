/**
 * CyberShield - Dedicated AI Scam & Fraud Analyzer Backend Server
 * Secure Node.js / Express proxy integrating Google Gemini API via @google/genai SDK.
 */

require('dotenv').config();

const express = require('express');
const path = require('path');
const { GeminiService } = require('./server/services/gemini-service');
const { validateAndParseUrl } = require('./server/security/url-security');
const { createRateLimiter } = require('./server/middleware/rate-limiter');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 8080;

// Initialize Gemini Service using server-side environment variables only
const geminiService = new GeminiService(
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_MODEL || 'gemini-flash-latest'
);

// Security & Header hardening
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// JSON body parsing with strict size limits
app.use(express.json({ limit: '64kb' }));

// Rate limiter middleware for API routes
const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60
});
app.use('/api/', apiLimiter);

/**
 * Health & Configuration Status Check
 * NOTE: Never expose GEMINI_API_KEY in the response!
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CyberShield AI Fraud Analyzer',
    geminiConfigured: geminiService.isConfigured(),
    model: geminiService.getModelName(),
    timestamp: Date.now()
  });
});

/**
 * POST /api/analyze-message
 * Analyzes untrusted SMS, email, WhatsApp, or notification text for fraud/scam indicators
 */
app.post('/api/analyze-message', async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'The "message" field is required and must be a non-empty string.'
        }
      });
    }

    if (message.length > 25000) {
      return res.status(413).json({
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Message exceeds the maximum allowable limit of 25,000 characters.'
        }
      });
    }

    // Execute analysis via server-side Gemini client
    const analysis = await geminiService.analyzeMessage(message);

    return res.json({
      success: true,
      data: analysis,
      modelUsed: geminiService.getModelName(),
      analyzedAt: new Date().toISOString()
    });

  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      error: {
        code: err.code || 'ANALYSIS_FAILED',
        message: err.message || 'An unexpected error occurred during security analysis.'
      }
    });
  }
});

/**
 * POST /api/analyze-url
 * Analyzes untrusted URL strings for phishing, deceptive subdomains, and risk signals
 */
app.post('/api/analyze-url', async (req, res) => {
  try {
    const { url } = req.body || {};

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'The "url" field is required and must be a non-empty string.'
        }
      });
    }

    // SSRF protection and observable anatomy extraction
    const parsedResult = validateAndParseUrl(url);
    if (!parsedResult.isValid) {
      return res.status(400).json({
        error: {
          code: 'INVALID_URL',
          message: parsedResult.error
        }
      });
    }

    // Execute link inspection via server-side Gemini client
    const analysis = await geminiService.analyzeUrl(parsedResult.url, parsedResult.features);

    return res.json({
      success: true,
      data: analysis,
      parsedFeatures: parsedResult.features,
      modelUsed: geminiService.getModelName(),
      analyzedAt: new Date().toISOString()
    });

  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      error: {
        code: err.code || 'ANALYSIS_FAILED',
        message: err.message || 'An unexpected error occurred during link analysis.'
      }
    });
  }
});

/**
 * POST /api/chat
 * Interactive Cyber Crime & Scam Defense AI Chatbot endpoint
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, messages, options } = req.body || {};
    const chatInput = messages || message;

    if (!chatInput) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'Either "message" (string) or "messages" (array) is required.'
        }
      });
    }

    const result = await geminiService.chat(chatInput, options);

    return res.json({
      success: true,
      reply: result.reply,
      modelUsed: result.model,
      timestamp: result.timestamp
    });

  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      error: {
        code: err.code || 'CHAT_FAILED',
        message: err.message || 'An error occurred while generating the AI response.'
      }
    });
  }
});

// Serve frontend static assets
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for SPA hash routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start listening if run directly
let serverInstance = null;
if (require.main === module) {
  serverInstance = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` CyberShield AI Security Server running on port ${PORT}`);
    console.log(` AI Model: ${geminiService.getModelName()}`);
    console.log(` Gemini API Configured: ${geminiService.isConfigured() ? 'YES' : 'NO'}`);
    console.log(` Web Portal: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
  serverInstance.on('error', (err) => {
    console.error('Server failed to start:', err.message);
  });
}

module.exports = { app, server: serverInstance, geminiService };
