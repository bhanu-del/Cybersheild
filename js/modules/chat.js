/**
 * CyberShield — Dedicated AI Cyber Security Assistant & Chatbot
 * Direct conversational defense powered by Google Gemini API.
 * Handles user prompts, scam distress ("pareshani"), suspicious texts,
 * and emergency guidance in English, Hindi, and Hinglish.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  let chatHistory = [];
  let isSending = false;

  const DEFAULT_SUGGESTIONS = [
    { label: '🚨 Fake Electricity Bill SMS', prompt: 'Mujhe ek message aaya ki bijli ka bill update nahi hua to light kat jayegi. Kya ye scam hai?' },
    { label: '⚠️ CBI Video Call / Digital Arrest', prompt: 'Someone called claiming to be Mumbai Police/CBI regarding a contraband parcel in my name. What should I do?' },
    { label: '💳 Fraud Transaction / Loss (1930)', prompt: 'Mere bank account se bina meri marzi ke paise kat gaye hain. Abhi immediate kya steps lene chahiye?' },
    { label: '📱 Telegram Part-time Job', prompt: 'I was offered ₹2,000 daily to like YouTube videos on Telegram. Is this legitimate or a trap?' },
    { label: '🔗 Check a Suspicious Link', prompt: 'How do I know if a bank login link sent on WhatsApp is real or phishing?' }
  ];

  /**
   * Safe Markdown parser for AI Chat responses
   */
  function formatMarkdown(text) {
    if (!text) return '';
    const safe = global.CyberShield.SafeRender;
    const escaped = safe ? safe.escapeHtml(text) : String(text)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Code blocks
    let formatted = escaped.replace(/```([a-z0-9_-]*)\n?([\s\S]*?)```/gi, (match, lang, code) => {
      return `<pre class="chat-code-block"><code>${code.trim()}</code></pre>`;
    });

    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');

    // Bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Links (only http/https allowed)
    formatted = formatted.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>');

    // Split paragraphs and lists
    const lines = formatted.split('\n');
    let inList = false;
    let listTag = 'ul';
    const output = [];

    for (let line of lines) {
      const trimmed = line.trim();
      const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/);
      const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);

      if (bulletMatch) {
        if (!inList || listTag !== 'ul') {
          if (inList) output.push(`</${listTag}>`);
          output.push('<ul class="chat-list">');
          inList = true;
          listTag = 'ul';
        }
        output.push(`<li>${bulletMatch[1]}</li>`);
      } else if (numMatch) {
        if (!inList || listTag !== 'ol') {
          if (inList) output.push(`</${listTag}>`);
          output.push('<ol class="chat-list">');
          inList = true;
          listTag = 'ol';
        }
        output.push(`<li>${numMatch[2]}</li>`);
      } else {
        if (inList) {
          output.push(`</${listTag}>`);
          inList = false;
        }
        if (trimmed.length > 0) {
          output.push(`<p class="chat-para">${trimmed}</p>`);
        }
      }
    }

    if (inList) output.push(`</${listTag}>`);
    return output.join('');
  }

  const ChatModule = {
    render: function(container, initialPrompt) {
      const getIcon = global.CyberShield.getIcon;
      const isHinglish = Boolean(global.CyberShield.State && global.CyberShield.State.getData && global.CyberShield.State.getData().preferences && global.CyberShield.State.getData().preferences.language === 'hinglish');

      container.innerHTML = `
        <div class="chat-page-shell">
          <!-- Chat Header Bar -->
          <div class="chat-page-header">
            <div class="chat-header-info">
              <div class="chat-avatar-ai-badge">
                ${getIcon('bot')}
              </div>
              <div>
                <h1 class="chat-header-title">
                  <span>CyberShield Helper</span>
                  <span class="chat-badge-model">
                    <span class="chat-online-dot"></span>
                    <span>AI Active</span>
                  </span>
                </h1>
                <p class="chat-header-subtitle">
                  ${isHinglish 
                    ? 'Scams, fake police calls, fraud messages ya kisi bhi pareshani ke liye CyberShield Helper se live madad lein.' 
                    : 'Real-time context-aware fraud, scam & extortion defense assistant.'}
                </p>
              </div>
            </div>

            <div class="chat-header-actions">
              <button class="btn btn-secondary btn-sm" id="btn-chat-sos" title="National Cyber Crime Emergency 1930">
                ${getIcon('shield')} 1930 SOS
              </button>
              <button class="btn btn-quiet btn-sm" id="btn-clear-chat" title="Clear conversation history">
                ${getIcon('trash-2')} ${isHinglish ? 'Clear Chat' : 'Clear'}
              </button>
            </div>
          </div>

          <!-- Chat Conversation Scroll Stream -->
          <div class="chat-stream-viewport" id="chat-stream-viewport" role="log" aria-live="polite">
            <!-- Initial Welcome Banner -->
            <div class="chat-welcome-banner" id="chat-welcome-banner" style="${chatHistory.length > 0 ? 'display: none;' : ''}">
              <div class="welcome-orb-icon">
                ${getIcon('sparkles')}
              </div>
              <h2 class="welcome-heading">
                ${isHinglish ? 'Aapki Digital Suraksha Me CyberShield Helper' : 'How can CyberShield Helper protect you today?'}
              </h2>
              <p class="welcome-desc">
                ${isHinglish
                  ? 'Kisi bhi suspicious SMS, fake delivery, OTP mangne wale call, job offer ya fraud par seedha prompt likhein. CyberShield Helper aapko turant sahi salah dega.'
                  : 'Describe any suspicious message, urgent demand, unexpected OTP, impersonation threat, or fraudulent payment. Get instant security verification and step-by-step guidance.'}
              </p>

              <!-- Quick Prompt Pills -->
              <div class="chat-suggestions-grid">
                ${DEFAULT_SUGGESTIONS.map((item, idx) => `
                  <button type="button" class="chat-suggestion-chip" data-prompt="${global.CyberShield.SafeRender ? global.CyberShield.SafeRender.escapeHtml(item.prompt) : item.prompt}">
                    <span class="chip-label">${item.label}</span>
                    <span class="chip-arrow">${getIcon('arrow-right')}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Messages Stream Container -->
            <div class="chat-messages-list" id="chat-messages-list"></div>
          </div>

          <!-- Chat Input Footer -->
          <div class="chat-input-bar">
            <div class="chat-input-wrapper">
              <textarea 
                id="chat-user-textarea" 
                class="chat-textarea" 
                rows="1" 
                placeholder="${isHinglish ? 'Apni pareshani ya sawal yahan likhein... (Press Enter to Send)' : 'Ask anything, describe a scam, or paste a message... (Press Enter to Send)'}"
                aria-label="Message prompt for CyberShield Helper"
              ></textarea>
              <button type="button" class="btn btn-primary chat-send-btn" id="btn-chat-send" aria-label="Send message" title="Send message">
                ${getIcon('send')}
              </button>
            </div>
            <div class="chat-disclaimer">
              ${getIcon('info')}
              <span>Advisory Cyber Defense by CyberShield Helper. In active financial fraud, immediately call <strong>1930</strong> (National Cybercrime Helpline) or visit <strong>cybercrime.gov.in</strong>.</span>
            </div>
          </div>
        </div>
      `;

      this.attachEventListeners(container);

      // Replay existing conversation if any
      if (chatHistory.length > 0) {
        this.renderHistory(container);
      }

      // If initial prompt provided (e.g. from hero search), send immediately
      if (initialPrompt && typeof initialPrompt === 'string' && initialPrompt.trim().length > 0) {
        this.sendMessage(initialPrompt.trim(), container);
      }
    },

    renderHistory: function(container) {
      const list = container.querySelector('#chat-messages-list');
      const welcome = container.querySelector('#chat-welcome-banner');
      if (!list) return;

      if (chatHistory.length > 0 && welcome) {
        welcome.style.display = 'none';
      }

      list.innerHTML = '';
      chatHistory.forEach(item => {
        if (item.role === 'user') {
          this.appendUserMessage(item.content, container, false);
        } else {
          this.appendBotMessage(item.content, container, false);
        }
      });
      this.scrollToBottom(container);
    },

    attachEventListeners: function(container) {
      const textarea = container.querySelector('#chat-user-textarea');
      const sendBtn = container.querySelector('#btn-chat-send');
      const clearBtn = container.querySelector('#btn-clear-chat');
      const sosBtn = container.querySelector('#btn-chat-sos');

      // Auto-expand textarea
      if (textarea) {
        textarea.addEventListener('input', () => {
          textarea.style.height = 'auto';
          textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px';
        });

        // Enter key to send (Shift+Enter for newline)
        textarea.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSend(container);
          }
        });
      }

      if (sendBtn) {
        sendBtn.addEventListener('click', () => {
          this.handleSend(container);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          this.clearChat(container);
        });
      }

      if (sosBtn) {
        sosBtn.addEventListener('click', () => {
          if (global.CyberShield.App && global.CyberShield.App.openSosModal) {
            global.CyberShield.App.openSosModal();
          }
        });
      }

      // Quick suggestions click handler
      container.querySelectorAll('.chat-suggestion-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const prompt = btn.getAttribute('data-prompt');
          if (prompt) {
            this.sendMessage(prompt, container);
          }
        });
      });
    },

    handleSend: function(container) {
      const textarea = container.querySelector('#chat-user-textarea');
      if (!textarea || isSending) return;
      const text = textarea.value.trim();
      if (!text) return;

      textarea.value = '';
      textarea.style.height = 'auto';
      this.sendMessage(text, container);
    },

    sendMessage: async function(text, container) {
      if (!text || isSending) return;
      isSending = true;

      const welcome = container.querySelector('#chat-welcome-banner');
      if (welcome) welcome.style.display = 'none';

      const sendBtn = container.querySelector('#btn-chat-send');
      if (sendBtn) sendBtn.disabled = true;

      // Append user bubble to UI and history
      this.appendUserMessage(text, container, true);
      chatHistory.push({ role: 'user', content: text });

      // Play click/tap sound
      if (global.CyberShield.Audio && global.CyberShield.Audio.playTap) {
        global.CyberShield.Audio.playTap();
      }

      // Show typing indicator
      this.showTypingIndicator(container);
      this.scrollToBottom(container);

      try {
        const geminiApi = global.CyberShield.GeminiAPI;
        if (!geminiApi || typeof geminiApi.chat !== 'function') {
          throw new Error('Gemini API client not initialized.');
        }

        const response = await geminiApi.chat(chatHistory);
        this.removeTypingIndicator(container);

        const reply = response.reply || 'No response generated.';
        this.appendBotMessage(reply, container, true);
        chatHistory.push({ role: 'model', content: reply });

        // Play alert sound on response
        if (global.CyberShield.Audio && global.CyberShield.Audio.playSuccess) {
          global.CyberShield.Audio.playSuccess();
        }

      } catch (err) {
        this.removeTypingIndicator(container);
        const errorMsg = `⚠️ **Error connecting to CyberShield Helper:** ${err.message || 'Please check server connection.'}\n\n*If you are facing an active emergency or financial loss, please dial **1930** immediately.*`;
        this.appendBotMessage(errorMsg, container, true);
        chatHistory.push({ role: 'model', content: errorMsg });

        if (global.CyberShield.Audio && global.CyberShield.Audio.playError) {
          global.CyberShield.Audio.playError();
        }
      } finally {
        isSending = false;
        if (sendBtn) sendBtn.disabled = false;
        const textarea = container.querySelector('#chat-user-textarea');
        if (textarea) textarea.focus();
        this.scrollToBottom(container);
      }
    },

    appendUserMessage: function(text, container, animate = true) {
      const list = container.querySelector('#chat-messages-list');
      if (!list) return;

      const row = document.createElement('div');
      row.className = `chat-message-row user-row ${animate ? 'slide-in' : ''}`;
      row.innerHTML = `
        <div class="chat-bubble user-bubble" style="color: #FFFFFF !important;">
          <p class="chat-para" style="color: #FFFFFF !important; margin: 0; font-weight: 500; font-size: var(--font-size-sm); line-height: 1.5; word-break: break-word;">${global.CyberShield.SafeRender ? global.CyberShield.SafeRender.escapeHtml(text) : text}</p>
        </div>
      `;
      list.appendChild(row);
    },

    appendBotMessage: function(text, container, animate = true) {
      const list = container.querySelector('#chat-messages-list');
      if (!list) return;

      const getIcon = global.CyberShield.getIcon;
      const row = document.createElement('div');
      row.className = `chat-message-row ai-row ${animate ? 'slide-in' : ''}`;

      row.innerHTML = `
        <div class="chat-avatar-ai-mini">
          ${getIcon('bot')}
        </div>
        <div class="chat-bubble ai-bubble">
          <div class="chat-ai-content">
            ${formatMarkdown(text)}
          </div>
          <div class="chat-bubble-actions">
            <button type="button" class="btn-copy-bubble" title="Copy response to clipboard">
              ${getIcon('copy')} Copy
            </button>
            <span class="copy-success-tip" style="display: none;">✓ Copied!</span>
          </div>
        </div>
      `;

      // Copy button handler
      const copyBtn = row.querySelector('.btn-copy-bubble');
      const tip = row.querySelector('.copy-success-tip');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(text).then(() => {
            if (tip) {
              tip.style.display = 'inline';
              setTimeout(() => { tip.style.display = 'none'; }, 2000);
            }
          });
        });
      }

      list.appendChild(row);
    },

    showTypingIndicator: function(container) {
      const list = container.querySelector('#chat-messages-list');
      if (!list || list.querySelector('#chat-typing-indicator')) return;

      const getIcon = global.CyberShield.getIcon;
      const indicator = document.createElement('div');
      indicator.id = 'chat-typing-indicator';
      indicator.className = 'chat-message-row ai-row';
      indicator.innerHTML = `
        <div class="chat-avatar-ai-mini">
          ${getIcon('bot')}
        </div>
        <div class="chat-bubble ai-bubble typing-bubble">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-text">CyberShield Helper is thinking...</span>
        </div>
      `;
      list.appendChild(indicator);
    },

    removeTypingIndicator: function(container) {
      const indicator = container.querySelector('#chat-typing-indicator');
      if (indicator) indicator.remove();
    },

    scrollToBottom: function(container) {
      const viewport = container.querySelector('#chat-stream-viewport');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    },

    clearChat: function(container) {
      chatHistory = [];
      const list = container.querySelector('#chat-messages-list');
      if (list) list.innerHTML = '';
      const welcome = container.querySelector('#chat-welcome-banner');
      if (welcome) welcome.style.display = 'flex';
      const textarea = container.querySelector('#chat-user-textarea');
      if (textarea) textarea.focus();
    },

    getHistory: function() {
      return chatHistory;
    },

    cleanup: function() {
      // Retain chat history in memory for user convenience across navigation
    }
  };

  global.CyberShield.ChatModule = ChatModule;
})(typeof window !== 'undefined' ? window : global);
