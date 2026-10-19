/**
 * CyberShield — Gemini AI Client Interface
 * Communicates with the secure server-side Gemini API endpoints.
 * Never stores or requests the API key in client code.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const GeminiAPI = {
    /**
     * Check backend server health and Gemini configuration status
     */
    checkStatus: async function() {
      try {
        const response = await fetch('/api/health', {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) {
          return { available: false, error: `Backend responded with HTTP ${response.status}` };
        }
        const data = await response.json();
        return {
          available: true,
          configured: data.geminiConfigured,
          model: data.model
        };
      } catch (err) {
        return {
          available: false,
          error: 'Backend API server is not reachable. Operating in local mode.'
        };
      }
    },

    /**
     * Analyze message text via Gemini AI backend
     */
    analyzeMessage: async function(messageText) {
      const response = await fetch('/api/analyze-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: messageText })
      });

      const body = await response.json();

      if (!response.ok) {
        const error = new Error(body?.error?.message || `Analysis request failed (HTTP ${response.status})`);
        error.code = body?.error?.code || 'SERVER_ERROR';
        error.status = response.status;
        throw error;
      }

      return body.data;
    },

    /**
     * Analyze URL via Gemini AI backend
     */
    analyzeUrl: async function(url) {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ url: url })
      });

      const body = await response.json();

      if (!response.ok) {
        const error = new Error(body?.error?.message || `Link inspection failed (HTTP ${response.status})`);
        error.code = body?.error?.code || 'SERVER_ERROR';
        error.status = response.status;
        throw error;
      }

      return body.data;
    },

    /**
     * Send conversation messages to CyberShield Gemini AI Chatbot
     * @param {Array<{role: string, content: string}>|string} messages
     * @param {Object} options
     */
    chat: async function(messages, options = {}) {
      const payload = typeof messages === 'string'
        ? { message: messages, options }
        : { messages: messages, options };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const body = await response.json();

      if (!response.ok) {
        const error = new Error(body?.error?.message || `Chat request failed (HTTP ${response.status})`);
        error.code = body?.error?.code || 'SERVER_ERROR';
        error.status = response.status;
        throw error;
      }

      return body;
    }
  };

  global.CyberShield.GeminiAPI = GeminiAPI;
})(window);
