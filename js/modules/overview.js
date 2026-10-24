/**
 * CyberShield — Overview Dashboard Module (Simplified & Streamlined)
 * Command center displaying real user progress, quick action tools,
 * category mastery, recent activities, and dynamic next-lesson recommendations.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const OverviewModule = {
    render: function(container) {
      const state = global.CyberShield.State;
      const derived = state.getDerivedStats();
      const getIcon = global.CyberShield.getIcon;
      const fmt = global.CyberShield.Formatting;
      const prefs = state.getData().preferences || {};
      const isHinglish = prefs.language === 'hinglish';

      const accuracyDisplay = derived.overallAccuracyPct !== null ? `${derived.overallAccuracyPct}%` : '—';
      const accuracySubtext = derived.totalAnswered > 0 
        ? `${derived.totalCorrect} of ${derived.totalAnswered} correct`
        : 'Take a quiz to see score';

      const recentSessions = (state.getData().sessions || []).slice(0, 3);

      const categoryNames = {
        'url_phishing': 'URL & Link Phishing',
        'otp_credentials': 'Passwords & OTP Safety',
        'fake_offers': 'Fake Offers & Prizes',
        'impersonation': 'Impersonation & Authority',
        'social_pressure': 'Social Pressure & Urgency',
        'technical_scams': 'Technical & Browser Safety'
      };

      const suggestedLessonId = (typeof state.getSuggestedNextLesson === 'function') 
        ? state.getSuggestedNextLesson() 
        : 'lesson-phishing-fundamentals';
      const allLessons = global.CyberShield.LESSONS || [];
      const suggestedLesson = allLessons.find(l => l.id === suggestedLessonId) || allLessons[0] || {};
      const lessonTitle = (isHinglish && suggestedLesson.titleHinglish) ? suggestedLesson.titleHinglish : (suggestedLesson.title || 'Phishing Fundamentals');
      const lessonObjective = (isHinglish && suggestedLesson.objectiveHinglish) ? suggestedLesson.objectiveHinglish : (suggestedLesson.objective || 'Master safe online habits');
      const lessonReadTime = suggestedLesson.readTime || '3 min read';

      container.innerHTML = `
        <!-- Simplified Header Banner with Quick URL Scan -->
        <div class="hero-banner simplified-hero">
          <div class="hero-content" style="max-width: 100%;">
            <div class="hero-badge">
              ${getIcon('shield-check', 'hero-badge-icon')}
              <span>${isHinglish ? 'Digital Defense Portal • Offline Safe' : 'Security Command Center • Offline-First'}</span>
            </div>
            <h1 class="hero-title" style="margin-bottom: 6px; font-size: 1.65rem;">
              ${isHinglish ? 'CyberShield Security Space' : 'CyberShield Security Hub'}
            </h1>
            <p class="hero-subtitle" style="margin-bottom: var(--space-md); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
              ${isHinglish 
                ? 'Suspicious links inspect karein, fake messages pehchanein aur fraud awareness test karein.'
                : 'Inspect suspicious links, detect fraudulent messages, and practice fraud awareness with transparent rules.'}
            </p>

            <!-- Quick Link Search Bar -->
            <div class="overview-quick-scan-bar">
              <div class="quick-scan-input-wrapper">
                <span class="quick-scan-icon">${getIcon('search')}</span>
                <input 
                  type="url" 
                  id="overview-quick-url-input" 
                  class="quick-scan-input" 
                  placeholder="${isHinglish ? 'Yahan suspicious URL paste karein (e.g. paypal.com.verify-login.xyz)...' : 'Paste any suspicious link to inspect instantly (e.g. http://secure-bank.login-verify.invalid)...'}"
                  aria-label="Quick link inspection input"
                />
                <button class="btn btn-primary btn-sm" id="btn-overview-quick-inspect">
                  ${getIcon('link')}
                  <span>${isHinglish ? 'Inspect' : 'Inspect Link'}</span>
                </button>
              </div>
            </div>

            <!-- Header Quick Actions -->
            <div class="hero-actions" style="margin-top: var(--space-md); gap: var(--space-sm);">
              <button class="btn btn-primary btn-sm" id="btn-hero-arena">
                ${getIcon('gamepad')}
                <span>${isHinglish ? 'Start Arena Quiz' : 'Start Arena Quiz'}</span>
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-hero-link">
                ${getIcon('link')}
                <span>${isHinglish ? 'Link Inspector' : 'Link Inspector'}</span>
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-hero-chat">
                ${getIcon('message-square')}
                <span>${isHinglish ? 'AI Security Helper' : 'AI Helper'}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Compact 4-Metric KPI Grid -->
        <div class="metric-grid simplified-metric-grid">
          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">${isHinglish ? 'Rounds' : 'Training Rounds'}</span>
              <div class="metric-icon-box blue">${getIcon('gamepad')}</div>
            </div>
            <div class="metric-value">${derived.totalRounds}</div>
            <div class="metric-subtext">${derived.totalRounds > 0 ? 'Recorded rounds' : 'No rounds yet'}</div>
          </div>

          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">${isHinglish ? 'Accuracy' : 'Overall Accuracy'}</span>
              <div class="metric-icon-box green">${getIcon('trending-up')}</div>
            </div>
            <div class="metric-value">${accuracyDisplay}</div>
            <div class="metric-subtext">${accuracySubtext}</div>
          </div>

          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">${isHinglish ? 'Questions' : 'Questions Answered'}</span>
              <div class="metric-icon-box purple">${getIcon('check')}</div>
            </div>
            <div class="metric-value">${derived.totalAnswered}</div>
            <div class="metric-subtext">${derived.totalCorrect} correct answers</div>
          </div>

          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">${isHinglish ? 'Lessons' : 'Lessons Completed'}</span>
              <div class="metric-icon-box amber">${getIcon('book-open')}</div>
            </div>
            <div class="metric-value">${derived.completedLessonsCount} / 7</div>
            <div class="metric-subtext">Safety Hub Modules</div>
          </div>
        </div>

        <!-- Streamlined Primary 3 Quick-Action Cards -->
        <div class="quick-tools-grid simplified-tools-grid">
          <!-- Tool 1: Link Inspector -->
          <div class="quick-tool-card simplified-tool-card" id="card-launch-link">
            <div class="tool-card-top-row">
              <div class="tool-card-icon blue">
                ${getIcon('link')}
              </div>
              <span class="badge badge-brand">Instant Analysis</span>
            </div>
            <h3 class="tool-card-title">${isHinglish ? 'Link Inspector' : 'Link Inspector'}</h3>
            <p class="tool-card-desc">
              ${isHinglish 
                ? 'Suspicious URLs, subdomains aur QR codes ko transparent rules se verify karein.' 
                : 'Deconstruct suspicious URLs, misleading hostnames & QR codes safely.'}
            </p>
            <div class="tool-card-footer-action">
              <span>${isHinglish ? 'Open Inspector' : 'Inspect Link'}</span>
              ${getIcon('arrow-right', 'icon-inline')}
            </div>
          </div>

          <!-- Tool 2: Message Analyzer -->
          <div class="quick-tool-card simplified-tool-card" id="card-launch-message">
            <div class="tool-card-top-row">
              <div class="tool-card-icon amber">
                ${getIcon('message-square')}
              </div>
              <span class="badge badge-caution">AI & Patterns</span>
            </div>
            <h3 class="tool-card-title">${isHinglish ? 'Message Analyzer' : 'Message Analyzer'}</h3>
            <p class="tool-card-desc">
              ${isHinglish 
                ? 'SMS, emails aur WhatsApp texts me fake OTP demands aur extortion traps pakdein.' 
                : 'Paste SMS, emails or WhatsApp messages to detect fraud, urgency & extortion.'}
            </p>
            <div class="tool-card-footer-action">
              <span>${isHinglish ? 'Analyze Text' : 'Analyze Message'}</span>
              ${getIcon('arrow-right', 'icon-inline')}
            </div>
          </div>

          <!-- Tool 3: Awareness Arena -->
          <div class="quick-tool-card simplified-tool-card" id="card-launch-arena">
            <div class="tool-card-top-row">
              <div class="tool-card-icon green">
                ${getIcon('gamepad')}
              </div>
              <span class="badge badge-success">Interactive</span>
            </div>
            <h3 class="tool-card-title">${isHinglish ? 'Awareness Arena' : 'Awareness Arena'}</h3>
            <p class="tool-card-desc">
              ${isHinglish 
                ? 'Interactive training quiz khel kar real-world online scams ko spot karna seekhein.' 
                : 'Sharpen your scam-detection reflexes across 3 realistic difficulty tiers.'}
            </p>
            <div class="tool-card-footer-action">
              <span>${isHinglish ? 'Start Round' : 'Launch Arena'}</span>
              ${getIcon('arrow-right', 'icon-inline')}
            </div>
          </div>
        </div>

        <!-- Balanced Two Column Section: Recent Activity & Suggested Topic -->
        <div class="overview-two-col simplified-two-col">
          <!-- Recent Activity -->
          <div class="card">
            <div class="card-header">
              <div class="card-title-group">
                <span class="card-title">${isHinglish ? 'Recent Activity' : 'Recent Activity'}</span>
                <span class="card-subtitle">${isHinglish ? 'Aapke latest training sessions' : 'Latest training records'}</span>
              </div>
              <button class="btn btn-quiet btn-sm" id="btn-view-all-progress">View All</button>
            </div>
            <div class="card-body">
              ${recentSessions.length > 0 ? `
                <div class="activity-list">
                  ${recentSessions.map(sess => `
                    <div class="activity-item">
                      <div class="activity-item-left">
                        <div class="badge ${sess.accuracy >= 70 ? 'badge-success' : 'badge-caution'}">
                          ${sess.accuracy}%
                        </div>
                        <div>
                          <div class="activity-title">
                            ${sess.category === 'all' ? 'All Categories' : (categoryNames[sess.category] || sess.category)}
                          </div>
                          <div class="activity-meta">
                            ${fmt.formatDate(sess.timestamp)} • ${sess.correctCount} / ${sess.totalQuestions} correct
                          </div>
                        </div>
                      </div>
                      <span class="badge badge-neutral" style="text-transform: capitalize;">${sess.difficulty}</span>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="empty-state" style="padding: var(--space-md) 0;">
                  <div class="empty-icon-box" style="width: 42px; height: 42px; margin-bottom: 8px;">${getIcon('gamepad')}</div>
                  <div class="empty-title" style="font-size: var(--font-size-sm);">${isHinglish ? 'No sessions yet' : 'No training rounds recorded yet'}</div>
                  <div class="empty-desc" style="font-size: var(--font-size-xs); margin-bottom: var(--space-sm);">${isHinglish ? 'Arena me pehla round khel kar accuracy check karein.' : 'Complete an interactive quiz in Awareness Arena to see your defense score.'}</div>
                  <button class="btn btn-primary btn-sm" id="btn-empty-start-arena">${isHinglish ? 'Play Quick Round' : 'Start Practice Round'}</button>
                </div>
              `}
            </div>
          </div>

          <!-- Suggested Topic -->
          <div class="card">
            <div class="card-header">
              <div class="card-title-group">
                <span class="card-title">${isHinglish ? 'Recommended Next Step' : 'Recommended Next Step'}</span>
                <span class="card-subtitle">${isHinglish ? 'Safety module recommendation' : 'Targeted security lesson'}</span>
              </div>
            </div>
            <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div class="badge badge-brand" style="margin-bottom: var(--space-xs);">Recommended Lesson</div>
                <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: 4px;">
                  ${lessonTitle}
                </h3>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); line-height: 1.5; margin-bottom: var(--space-sm);">
                  ${lessonObjective}
                </p>
                <div class="lesson-meta-hint" style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                  ${getIcon('book-open', 'icon-inline')} ${lessonReadTime} • Includes quiz
                </div>
              </div>
              <button class="btn btn-secondary btn-sm btn-block" id="btn-open-suggested-lesson" style="margin-top: var(--space-md);">
                ${isHinglish ? 'Lesson Padhein' : 'Read Lesson & Practice'}
              </button>
            </div>
          </div>
        </div>
      `;

      this.attachEvents(container, suggestedLessonId);
    },

    attachEvents: function(container, suggestedLessonId) {
      const router = global.CyberShield.Router;

      const bindClick = (id, route) => {
        const el = container.querySelector('#' + id);
        if (el) {
          el.addEventListener('click', () => router.navigate(route));
        }
      };

      bindClick('btn-hero-arena', 'arena');
      bindClick('btn-hero-link', 'link-inspector');
      bindClick('btn-hero-chat', 'chat');
      bindClick('card-launch-arena', 'arena');
      bindClick('card-launch-link', 'link-inspector');
      bindClick('card-launch-message', 'message-analyzer');
      bindClick('btn-view-all-progress', 'progress');
      bindClick('btn-empty-start-arena', 'arena');

      // Quick URL scan input event
      const quickInput = container.querySelector('#overview-quick-url-input');
      const quickBtn = container.querySelector('#btn-overview-quick-inspect');

      const triggerQuickInspect = () => {
        if (!quickInput) return;
        const url = quickInput.value.trim();
        if (url) {
          router.navigate('link-inspector');
          setTimeout(() => {
            if (global.CyberShield.LinkInspectorModule && typeof global.CyberShield.LinkInspectorModule.inspectUrl === 'function') {
              global.CyberShield.LinkInspectorModule.inspectUrl(url);
            }
          }, 120);
        } else {
          router.navigate('link-inspector');
        }
      };

      if (quickBtn) {
        quickBtn.addEventListener('click', triggerQuickInspect);
      }

      if (quickInput) {
        quickInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            triggerQuickInspect();
          }
        });
      }

      const suggestedBtn = container.querySelector('#btn-open-suggested-lesson');
      if (suggestedBtn) {
        suggestedBtn.addEventListener('click', () => {
          router.navigate('learning-hub');
          setTimeout(() => {
            if (global.CyberShield.LearningHubModule && global.CyberShield.LearningHubModule.openLesson) {
              global.CyberShield.LearningHubModule.openLesson(suggestedLessonId || 'lesson-phishing-fundamentals');
            }
          }, 100);
        });
      }
    }
  };

  global.CyberShield.OverviewModule = OverviewModule;
})(window);
