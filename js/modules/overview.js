/**
 * CyberShield — Overview Dashboard Module
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
        ? `${derived.totalCorrect} of ${derived.totalAnswered} answered correctly`
        : 'Complete a round to see accuracy';

      const recentSessions = (state.getData().sessions || []).slice(0, 4);

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
        <!-- Hero Welcome Banner -->
        <div class="hero-banner">
          <div class="hero-content">
            <div class="hero-badge">
              ${getIcon('shield-check', 'hero-badge-icon')}
              <span>${isHinglish ? 'Digital Safety Portal' : 'Offline-First Security Lab'}</span>
            </div>
            <h1 class="hero-title">
              ${isHinglish ? 'Aapka Security Learning Space' : 'Your Security Learning Space.'}
            </h1>
            <p class="hero-subtitle">
              ${isHinglish 
                ? 'Phishing links, fake messages aur online scams ko pehchanein. Transparent local rules ke saath bina kisi privacy risk ke seekhein.'
                : 'Learn to recognize deceptive messages, manipulative links, and impersonation scams through interactive simulations and transparent local rule inspections.'}
            </p>
            <div class="hero-actions">
              <button class="btn btn-primary btn-lg" id="btn-hero-arena">
                ${getIcon('gamepad')}
                <span>${isHinglish ? 'Training Round Shuru Karein' : 'Start Training Round'}</span>
              </button>
              <button class="btn btn-secondary btn-lg" id="btn-hero-link">
                ${getIcon('link')}
                <span>${isHinglish ? 'Link Inspect Karein' : 'Inspect a Link'}</span>
              </button>
            </div>
          </div>
          <div class="hero-illustration">
            <svg class="shield-graphic-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="shieldGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2563EB"/>
                  <stop offset="1" stop-color="#1D4ED8"/>
                </linearGradient>
                <linearGradient id="glowGrad" x1="100" y1="30" x2="100" y2="170" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#60A5FA" stop-opacity="0.8"/>
                  <stop offset="1" stop-color="#2563EB" stop-opacity="0.2"/>
                </linearGradient>
              </defs>
              <path d="M100 24L168 54V102C168 144 139 174 100 186C61 174 32 144 32 102V54L100 24Z" fill="url(#shieldGrad)"/>
              <path d="M100 36L156 61V102C156 137 132 162 100 172C68 162 44 137 44 102V61L100 36Z" fill="url(#glowGrad)"/>
              <path d="M84 102L96 114L124 84" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="metric-grid">
          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">${isHinglish ? 'Completed Rounds' : 'Training Rounds'}</span>
              <div class="metric-icon-box blue">${getIcon('gamepad')}</div>
            </div>
            <div class="metric-value">${derived.totalRounds}</div>
            <div class="metric-subtext">${derived.totalRounds > 0 ? 'Recorded sessions' : 'No sessions completed yet'}</div>
          </div>

          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">${isHinglish ? 'Questions Answered' : 'Questions Answered'}</span>
              <div class="metric-icon-box purple">${getIcon('check')}</div>
            </div>
            <div class="metric-value">${derived.totalAnswered}</div>
            <div class="metric-subtext">${derived.totalCorrect} answered correctly</div>
          </div>

          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">${isHinglish ? 'Overall Accuracy' : 'Overall Accuracy'}</span>
              <div class="metric-icon-box green">${getIcon('trending-up')}</div>
            </div>
            <div class="metric-value">${accuracyDisplay}</div>
            <div class="metric-subtext">${accuracySubtext}</div>
          </div>

          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">${isHinglish ? 'Lessons Read' : 'Lessons Completed'}</span>
              <div class="metric-icon-box amber">${getIcon('book-open')}</div>
            </div>
            <div class="metric-value">${derived.completedLessonsCount} / 7</div>
            <div class="metric-subtext">Cyber Safety Hub</div>
          </div>
        </div>

        <!-- Quick Launch Module Cards -->
        <h2 class="section-heading">
          ${isHinglish ? 'Primary Tools & Simulators' : 'Primary Tools & Simulators'}
        </h2>
        <div class="quick-tools-grid">
          <div class="quick-tool-card" id="card-launch-arena">
            <div class="tool-card-icon" style="background-color: var(--color-primary-surface); color: var(--color-primary);">
              ${getIcon('gamepad')}
            </div>
            <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold);">Awareness Arena</h3>
            <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin: 0;">
              Interactive training rounds testing your ability to spot deceptive messages and link tricks across 3 difficulty tiers.
            </p>
            <span class="tool-card-action blue">
              Launch Arena ${getIcon('arrow-right', 'icon-inline')}
            </span>
          </div>

          <div class="quick-tool-card" id="card-launch-link">
            <div class="tool-card-icon" style="background-color: var(--color-purple-surface); color: var(--color-purple);">
              ${getIcon('link')}
            </div>
            <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold);">Link Inspector</h3>
            <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin: 0;">
              Deconstruct suspicious URLs locally without visiting the destination. Check subdomains, IP addresses, and user-info tricks.
            </p>
            <span class="tool-card-action purple">
              Inspect Link ${getIcon('arrow-right', 'icon-inline')}
            </span>
          </div>

          <div class="quick-tool-card" id="card-launch-message">
            <div class="tool-card-icon" style="background-color: var(--color-caution-surface); color: var(--color-caution);">
              ${getIcon('message-square')}
            </div>
            <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold);">Message Red-Flag Analyzer</h3>
            <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin: 0;">
              Paste suspicious messages, SMS, or emails. Transparent local rules highlight urgency, fake OTP demands, and extortion.
            </p>
            <span class="tool-card-action amber">
              Analyze Message ${getIcon('arrow-right', 'icon-inline')}
            </span>
          </div>
        </div>

        <!-- Two Column Section: Recent Activities & Suggested Lesson -->
        <div class="overview-two-col">
          <!-- Recent Activities Panel -->
          <div class="card">
            <div class="card-header">
              <div class="card-title-group">
                <span class="card-title">${isHinglish ? 'Recent Training Sessions' : 'Recent Training Activity'}</span>
                <span class="card-subtitle">Real records from your local browser storage</span>
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
                            ${fmt.formatDate(sess.timestamp)} • ${sess.correctCount} of ${sess.totalQuestions} correct
                          </div>
                        </div>
                      </div>
                      <span class="badge badge-neutral" style="text-transform: capitalize;">${sess.difficulty}</span>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="empty-state" style="padding: var(--space-lg) 0;">
                  <div class="empty-icon-box">${getIcon('gamepad')}</div>
                  <div class="empty-title">${isHinglish ? 'Abhi koi session record nahi hai' : 'No training sessions recorded yet'}</div>
                  <div class="empty-desc">${isHinglish ? 'Pehla round khel kar apni security accuracy track karein.' : 'Complete your first practice round in the Awareness Arena to begin tracking your defense score.'}</div>
                  <button class="btn btn-primary btn-sm" id="btn-empty-start-arena">Start Practice Round</button>
                </div>
              `}
            </div>
          </div>

          <!-- Suggested Lesson / Education Callout -->
          <div class="card">
            <div class="card-header">
              <div class="card-title-group">
                <span class="card-title">${isHinglish ? 'Suggested Learning' : 'Suggested Learning'}</span>
                <span class="card-subtitle">Recommended safety module tailored to your weaknesses</span>
              </div>
            </div>
            <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div class="badge badge-brand" style="margin-bottom: var(--space-sm);">Recommended Topic</div>
                <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-xs);">
                  ${lessonTitle}
                </h3>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); line-height: 1.5; margin-bottom: var(--space-md);">
                  ${lessonObjective}
                </p>
                <div class="lesson-meta-hint">
                  ${getIcon('book-open', 'icon-inline')} ${lessonReadTime} • Includes interactive knowledge check
                </div>
              </div>
              <button class="btn btn-secondary btn-sm btn-block" id="btn-open-suggested-lesson" style="margin-top: var(--space-lg);">
                Read Lesson & Take Quiz
              </button>
            </div>
          </div>
        </div>
      `;

      // Wire interactive event listeners
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
      bindClick('btn-hero-demo', 'demo-mode');
      bindClick('card-launch-arena', 'arena');
      bindClick('card-launch-link', 'link-inspector');
      bindClick('card-launch-message', 'message-analyzer');
      bindClick('btn-view-all-progress', 'progress');
      bindClick('btn-empty-start-arena', 'arena');

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
