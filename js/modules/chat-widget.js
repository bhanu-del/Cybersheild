/**
 * CyberShield — Persistent Floating AI Chatbot Widget
 * Always accessible from any view (Overview, Arena, Inspector, Academy).
 * Lets users ask quick questions or paste suspicious alerts from any page.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  let widgetContainer = null;
  let isOpen = false;
  let isSending = false;

  const ChatWidget = {
    init: function() {
      if (document.querySelector('#cybershield-chat-widget-root')) return;

      widgetContainer = document.createElement('div');
      widgetContainer.id = 'cybershield-chat-widget-root';
      widgetContainer.className = 'chat-widget-root';

      const getIcon = global.CyberShield.getIcon;

      widgetContainer.innerHTML = `
        <!-- Floating Action Trigger Pill -->
        <button type="button" class="chat-floating-trigger" id="btn-chat-floating-trigger" aria-label="Open CyberShield Helper" title="Chat with CyberShield Helper">
          <span class="trigger-sparkle-dot"></span>
          <span class="trigger-icon">${getIcon('sparkles')}</span>
          <span class="trigger-label">CyberShield Helper</span>
        </button>

        <!-- Slide-up Floating Chat Window -->
        <div class="chat-widget-panel" id="chat-widget-panel" style="display: none;" role="dialog" aria-modal="true" aria-label="CyberShield Helper Quick Chat">
          <div class="widget-header">
            <div class="widget-header-left">
              <div class="widget-bot-avatar">${getIcon('bot')}</div>
              <div>
                <div class="widget-title">
                  <span>CyberShield Helper</span>
                  <span class="widget-status-dot" title="Active"></span>
                </div>
                <div class="widget-subtitle">AI Defense Assistant • Online</div>
              </div>
            </div>
            <div class="widget-header-actions">
              <button type="button" class="btn-icon-widget" id="btn-widget-expand" title="Open full chat screen">
                ${getIcon('maximize')}
              </button>
              <button type="button" class="btn-icon-widget" id="btn-widget-close" aria-label="Close chat window">
                ${getIcon('x')}
              </button>
            </div>
          </div>

          <!-- Messages Body -->
          <div class="widget-body" id="widget-messages-body">
            <div class="widget-greeting-card" id="widget-greeting">
              <div class="widget-greeting-icon">${getIcon('shield')}</div>
              <p class="widget-greeting-text">
                Kise bhi scam, suspicious message ya fraud ki jaanch ke liye CyberShield Helper se poochhein!
              </p>
              <div class="widget-chips">
                <button type="button" class="widget-chip" data-prompt="Bijli bill katne ka SMS aaya hai, kya ye fake hai?">🚨 Fake Bijli Bill SMS</button>
                <button type="button" class="widget-chip" data-prompt="Someone called claiming to be Police/CBI on video call. What to do?">⚠️ CBI Video Call</button>
                <button type="button" class="widget-chip" data-prompt="Account se unauthorized paise kat gaye, 1930 pe kaise report karein?">💳 Bank Fraud 1930</button>
              </div>
            </div>
            <div class="widget-stream" id="widget-stream-list"></div>
          </div>

          <!-- Input Footer -->
          <div class="widget-footer">
            <div class="widget-input-row">
              <input 
                type="text" 
                id="widget-user-input" 
                class="widget-input" 
                placeholder="Ask or paste problem here..." 
                aria-label="Ask CyberShield Helper"
              />
              <button type="button" class="widget-send-btn" id="btn-widget-send" aria-label="Send">
                ${getIcon('send')}
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(widgetContainer);
      this.attachEventListeners();
    },

    attachEventListeners: function() {
      const trigger = widgetContainer.querySelector('#btn-chat-floating-trigger');
      const panel = widgetContainer.querySelector('#chat-widget-panel');
      const closeBtn = widgetContainer.querySelector('#btn-widget-close');
      const expandBtn = widgetContainer.querySelector('#btn-widget-expand');
      const input = widgetContainer.querySelector('#widget-user-input');
      const sendBtn = widgetContainer.querySelector('#btn-widget-send');

      trigger.addEventListener('click', () => {
        this.toggle();
      });

      closeBtn.addEventListener('click', () => {
        this.close();
      });

      expandBtn.addEventListener('click', () => {
        this.close();
        if (global.CyberShield.Router) {
          global.CyberShield.Router.navigate('chat');
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleSend();
        }
      });

      sendBtn.addEventListener('click', () => {
        this.handleSend();
      });

      widgetContainer.querySelectorAll('.widget-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const prompt = chip.getAttribute('data-prompt');
          if (prompt) {
            this.sendPrompt(prompt);
          }
        });
      });
    },

    toggle: function() {
      if (isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    open: function() {
      const panel = widgetContainer.querySelector('#chat-widget-panel');
      panel.style.display = 'flex';
      isOpen = true;
      const input = widgetContainer.querySelector('#widget-user-input');
      if (input) input.focus();
    },

    close: function() {
      const panel = widgetContainer.querySelector('#chat-widget-panel');
      panel.style.display = 'none';
      isOpen = false;
    },

    handleSend: function() {
      const input = widgetContainer.querySelector('#widget-user-input');
      if (!input || isSending) return;
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      this.sendPrompt(text);
    },

    sendPrompt: async function(text) {
      if (!text || isSending) return;
      isSending = true;

      const greeting = widgetContainer.querySelector('#widget-greeting');
      if (greeting) greeting.style.display = 'none';

      const stream = widgetContainer.querySelector('#widget-stream-list');
      const body = widgetContainer.querySelector('#widget-messages-body');

      // Append user bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'widget-bubble user';
      userBubble.textContent = text;
      stream.appendChild(userBubble);
      body.scrollTop = body.scrollHeight;

      // Append loading bubble
      const loadingBubble = document.createElement('div');
      loadingBubble.className = 'widget-bubble bot typing';
      loadingBubble.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
      stream.appendChild(loadingBubble);
      body.scrollTop = body.scrollHeight;

      try {
        const geminiApi = global.CyberShield.GeminiAPI;
        if (!geminiApi || typeof geminiApi.chat !== 'function') {
          throw new Error('Gemini API client not initialized.');
        }

        const res = await geminiApi.chat(text);
        loadingBubble.remove();

        const botBubble = document.createElement('div');
        botBubble.className = 'widget-bubble bot';
        
        // Use markdown parser from ChatModule if available
        const parser = global.CyberShield.ChatModule && global.CyberShield.ChatModule.formatMarkdown;
        const safe = global.CyberShield.SafeRender;
        botBubble.innerHTML = (typeof parser === 'function') 
          ? parser(res.reply) 
          : `<p>${safe ? safe.escapeHtml(res.reply) : res.reply}</p>`;

        stream.appendChild(botBubble);

      } catch (err) {
        loadingBubble.remove();
        const errBubble = document.createElement('div');
        errBubble.className = 'widget-bubble bot error';
        errBubble.innerHTML = `⚠️ <strong>Error:</strong> ${err.message || 'Failed to reach CyberShield Helper.'}<br>For emergencies, dial <strong>1930</strong>.`;
        stream.appendChild(errBubble);
      } finally {
        isSending = false;
        body.scrollTop = body.scrollHeight;
        const input = widgetContainer.querySelector('#widget-user-input');
        if (input) input.focus();
      }
    }
  };

  global.CyberShield.ChatWidget = ChatWidget;
})(typeof window !== 'undefined' ? window : global);
