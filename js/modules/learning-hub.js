/**
 * CyberShield — Cyber Safety Learning Hub Module
 * Interactive curriculum covering 7 essential security topics with
 * bilingual support, practical checklists, and interactive knowledge checks.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  let activeLessonId = null;

  const LearningHubModule = {
    render: function(container) {
      const lessons = global.CyberShield.LESSONS || [];
      const getIcon = global.CyberShield.getIcon;
      const state = global.CyberShield.State;
      const progress = state.getData().lessonProgress || {};
      const prefs = state.getData().preferences || {};
      const isHinglish = prefs.language === 'hinglish';

      container.innerHTML = `
        <div class="card" style="margin-bottom: var(--space-xl);">
          <div class="card-header">
            <div class="card-title-group">
              <h1 class="card-title" style="font-size: var(--font-size-lg);">Cyber Safety Learning Hub</h1>
              <span class="card-subtitle">Foundational cybersecurity topics explained in plain English and Hinglish</span>
            </div>
            <div class="badge badge-brand">
              ${getIcon('book-open')} 7 Essential Guides
            </div>
          </div>
          <div class="card-body">
            <!-- Lessons Grid -->
            <div class="lessons-grid">
              ${lessons.map(lesson => {
                const isCompleted = progress[lesson.id]?.completed;
                const title = isHinglish && lesson.titleHinglish ? lesson.titleHinglish : lesson.title;
                const objective = isHinglish && lesson.objectiveHinglish ? lesson.objectiveHinglish : lesson.objective;

                return `
                  <div class="lesson-card" data-lesson-id="${lesson.id}">
                    <div class="lesson-card-top">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-xs);">
                        <div class="tool-card-icon" style="background-color: var(--color-primary-surface); color: var(--color-primary);">
                          ${getIcon(lesson.icon)}
                        </div>
                        <span class="badge ${isCompleted ? 'badge-success' : 'badge-neutral'}">
                          ${isCompleted ? `${getIcon('check')} Completed` : lesson.category}
                        </span>
                      </div>
                      <h2 class="lesson-title">${title}</h2>
                      <p class="lesson-desc">${objective}</p>
                    </div>

                    <div class="lesson-footer-meta">
                      <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                        ${lesson.readTime}
                      </span>
                      <span style="font-size: var(--font-size-xs); color: var(--color-primary); font-weight: var(--font-weight-medium); display: flex; align-items: center; gap: 4px;">
                        Read & Quiz ${getIcon('arrow-right', 'icon-inline')}
                      </span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Full Lesson Reader Modal -->
        <div class="modal-backdrop" id="lesson-reader-modal" role="dialog" aria-modal="true" aria-labelledby="lesson-modal-title">
          <div class="modal-dialog" style="max-width: 720px;">
            <div class="modal-header">
              <span class="modal-title" id="lesson-modal-title">Lesson Reader</span>
              <button class="btn-icon" data-close-modal data-close-lesson-modal aria-label="Close lesson reader">${getIcon('x')}</button>
            </div>
            <div class="modal-body" id="lesson-modal-content">
              <!-- Dynamically injected lesson content -->
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-close-modal data-close-lesson-modal>Close Lesson</button>
            </div>
          </div>
        </div>
      `;

      this.attachEvents(container);
    },

    attachEvents: function(container) {
      const cards = container.querySelectorAll('.lesson-card');
      const modal = container.querySelector('#lesson-reader-modal');
      const closeBtns = container.querySelectorAll('[data-close-lesson-modal]');

      cards.forEach(card => {
        card.addEventListener('click', () => {
          const lessonId = card.dataset.lessonId;
          this.openLesson(lessonId, modal);
        });
      });

      closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          modal.classList.remove('open');
          global.CyberShield.Accessibility.releaseFocus(modal);
          this.render(container); // Re-render to update checkmarks
        });
      });
    },

    openLesson: function(lessonId, modalElement) {
      const modal = modalElement || document.querySelector('#lesson-reader-modal');
      if (!modal) return;

      const lessons = global.CyberShield.LESSONS || [];
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) return;

      activeLessonId = lessonId;
      const getIcon = global.CyberShield.getIcon;
      const prefs = global.CyberShield.State.getData().preferences || {};
      const isHinglish = prefs.language === 'hinglish';

      const title = isHinglish && lesson.titleHinglish ? lesson.titleHinglish : lesson.title;
      const objective = isHinglish && lesson.objectiveHinglish ? lesson.objectiveHinglish : lesson.objective;
      const intro = isHinglish && lesson.content.introHinglish ? lesson.content.introHinglish : lesson.content.intro;
      const keyConcept = isHinglish && lesson.content.keyConceptHinglish ? lesson.content.keyConceptHinglish : lesson.content.keyConcept;

      const titleEl = modal.querySelector('#lesson-modal-title');
      const contentEl = modal.querySelector('#lesson-modal-content');

      titleEl.textContent = title;

      contentEl.innerHTML = `
        <div class="lesson-reader-header">
          <div class="lesson-objective-box">
            <strong>${getIcon('book-open', 'icon-inline')} Learning Objective:</strong> ${objective}
          </div>

          <div class="lesson-section">
            <h3 class="lesson-section-title">Core Principle</h3>
            <p class="case-incident-desc">${intro}</p>
            <div class="lesson-callout">
              <strong>Key Takeaway:</strong> ${keyConcept}
            </div>
          </div>

          <div class="lesson-section">
            <h3 class="lesson-section-title">Fictional Scenario Example</h3>
            <div class="scenario-box">
              <div class="scenario-message-bubble">
                ${global.CyberShield.SafeRender.escapeHtml(lesson.content.fictionalExample)}
              </div>
            </div>
          </div>

          <div class="lesson-section">
            <h3 class="lesson-section-title">Warning Signs & Clues Checklist</h3>
            <ul class="case-list-secondary">
              ${lesson.content.clues.map(c => `<li>${global.CyberShield.SafeRender.escapeHtml(c)}</li>`).join('')}
            </ul>
          </div>

          <div class="lesson-section">
            <h3 class="lesson-section-title">Recommended Practical Next Steps</h3>
            <ul class="case-list-clean">
              ${lesson.content.safeSteps.map(s => `<li>${global.CyberShield.SafeRender.escapeHtml(s)}</li>`).join('')}
            </ul>
          </div>

          <!-- Interactive Multi-Question Knowledge Check Widget -->
          <div class="knowledge-check-card" id="lesson-quiz-container">
            <!-- Rendered dynamically by renderQuizRunner -->
          </div>
        </div>
      `;

      modal.classList.add('open');
      global.CyberShield.Accessibility.trapFocus(modal);

      // Attach multi-question quiz runner
      this.renderQuizRunner(contentEl, lesson);
    },

    renderQuizRunner: function(contentEl, lesson) {
      const questions = Array.isArray(lesson.knowledgeChecks) && lesson.knowledgeChecks.length > 0 
        ? lesson.knowledgeChecks 
        : [lesson.knowledgeCheck];
      let currentIdx = 0;
      let correctCount = 0;
      let answered = false;
      const getIcon = global.CyberShield.getIcon;

      const quizBox = contentEl.querySelector('#lesson-quiz-container');
      if (!quizBox) return;

      const renderCurrentQuestion = () => {
        answered = false;
        const q = questions[currentIdx];
        const progressPct = Math.round(((currentIdx + 1) / questions.length) * 100);

        quizBox.innerHTML = `
          <div class="lesson-quiz-topbar">
            <div class="lesson-quiz-topbar-left">
              <span class="badge badge-brand">${getIcon('zap')} Knowledge Check</span>
              <span class="lesson-quiz-q-counter">
                Question ${currentIdx + 1} of ${questions.length}
              </span>
            </div>
            <span class="badge badge-neutral">
              Current Score: ${correctCount} / ${currentIdx}
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="lesson-quiz-progress-track">
            <div class="lesson-quiz-progress-fill" style="width: ${progressPct}%;"></div>
          </div>

          <h4 class="lesson-quiz-question-text">
            ${q.question}
          </h4>

          <div class="choices-list" style="margin-bottom: var(--space-md);">
            ${q.choices.map(c => `
              <button type="button" class="choice-card lesson-quiz-choice" data-choice-id="${c.id}">
                <span class="choice-key">${c.id}</span>
                <span class="choice-text">${c.text}</span>
              </button>
            `).join('')}
          </div>

          <div id="lesson-quiz-feedback" style="display: none;"></div>
        `;

        const choices = quizBox.querySelectorAll('.lesson-quiz-choice');
        const feedback = quizBox.querySelector('#lesson-quiz-feedback');

        choices.forEach(btn => {
          btn.addEventListener('click', () => {
            if (answered) return;
            answered = true;
            const selectedId = btn.dataset.choiceId;
            const isCorrect = selectedId === q.correctId;
            if (isCorrect) correctCount++;

            choices.forEach(c => {
              c.disabled = true;
              if (c.dataset.choiceId === q.correctId) {
                c.classList.add('correct');
              } else if (c.dataset.choiceId === selectedId) {
                c.classList.add('incorrect');
              }
            });

            if (isCorrect && global.CyberShield.Sound) global.CyberShield.Sound.playSuccess();
            else if (global.CyberShield.Sound) global.CyberShield.Sound.playWarning();

            const isLast = currentIdx === questions.length - 1;

            feedback.innerHTML = `
              <div class="alert ${isCorrect ? 'alert-success' : 'alert-caution'}" style="margin-top: var(--space-sm);">
                <div class="alert-icon">${isCorrect ? getIcon('check-circle') : getIcon('alert-triangle')}</div>
                <div class="alert-content">
                  <div class="alert-title">${isCorrect ? 'Correct!' : 'Incorrect'}</div>
                  <div class="alert-message">${q.explanation}</div>
                </div>
              </div>
              <div style="margin-top: var(--space-md); text-align: right;">
                <button type="button" class="btn btn-primary btn-sm" id="btn-next-quiz-q">
                  <span>${isLast ? 'View Results & Complete' : 'Next Question'}</span>
                  ${getIcon('arrow-right')}
                </button>
              </div>
            `;
            feedback.style.display = 'block';

            const nextBtn = feedback.querySelector('#btn-next-quiz-q');
            if (nextBtn) {
              nextBtn.addEventListener('click', () => {
                if (isLast) {
                  renderResults();
                } else {
                  currentIdx++;
                  renderCurrentQuestion();
                }
              });
            }
          });
        });
      };

      const renderResults = () => {
        const pct = Math.round((correctCount / questions.length) * 100);
        const passed = pct >= 60;

        // Mark lesson completed in persistent state
        global.CyberShield.State.recordLessonCompleted(lesson.id);

        // Map lesson to threat category key for progress charts
        const catMap = {
          'lesson-url-inspection': 'url_phishing',
          'lesson-passwords-otp': 'otp_credentials',
          'lesson-fake-offers': 'fake_offers',
          'lesson-impersonation': 'impersonation',
          'lesson-phishing-fundamentals': 'social_pressure',
          'lesson-safe-browsing': 'technical_scams',
          'lesson-after-scam': 'technical_scams'
        };
        const catKey = catMap[lesson.id] || 'url_phishing';

        // Record as a training session to drive line graph, donut, radar, and readiness progression
        global.CyberShield.State.recordSession({
          id: `hub-${lesson.id}-${Date.now()}`,
          timestamp: Date.now(),
          category: catKey,
          difficulty: 'intermediate',
          totalQuestions: questions.length,
          correctCount: correctCount,
          incorrectCount: questions.length - correctCount,
          skippedCount: 0,
          accuracy: pct,
          categoryBreakdown: {
            [catKey]: { correct: correctCount, total: questions.length }
          },
          carefulVerifierCount: 0
        });

        // Update underlying lesson card badge in real time
        const underBadge = document.querySelector(`.lesson-card[data-lesson-id="${lesson.id}"] .badge`);
        if (underBadge) {
          underBadge.className = 'badge badge-success';
          underBadge.innerHTML = `${getIcon('check')} Completed (${pct}%)`;
        }

        quizBox.innerHTML = `
          <div class="lesson-quiz-result">
            <div class="lesson-quiz-result-icon ${passed ? 'passed' : 'retry'}">
              ${getIcon(passed ? 'award' : 'check-circle')}
            </div>
            <h4 class="lesson-quiz-result-title">
              ${passed ? 'Category Knowledge Mastered!' : 'Quiz Completed!'}
            </h4>
            <p class="lesson-quiz-result-desc">
              You scored <strong>${correctCount} out of ${questions.length}</strong> (${pct}% accuracy).
            </p>
            <div style="display: flex; gap: var(--space-sm); justify-content: center; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-retake-quiz">
                ${getIcon('rotate-ccw')} Retake Quiz
              </button>
              <button type="button" class="btn btn-primary btn-sm" id="btn-finish-lesson">
                ${getIcon('check')} Done & Back to Guides
              </button>
            </div>
          </div>
        `;

        const retakeBtn = quizBox.querySelector('#btn-retake-quiz');
        if (retakeBtn) {
          retakeBtn.addEventListener('click', () => {
            currentIdx = 0;
            correctCount = 0;
            renderCurrentQuestion();
          });
        }

        const finishBtn = quizBox.querySelector('#btn-finish-lesson');
        if (finishBtn) {
          finishBtn.addEventListener('click', () => {
            const modal = document.querySelector('#lesson-reader-modal');
            if (modal) {
              modal.classList.remove('open');
              global.CyberShield.Accessibility.releaseFocus(modal);
            }
          });
        }

        global.CyberShield.Accessibility.announce(`Knowledge check completed. Score: ${correctCount} of ${questions.length}`);
      };

      renderCurrentQuestion();
    },

    cleanup: function() {
      // Clean up any open modal or focus traps if navigated away
      const modal = document.querySelector('#lesson-reader-modal');
      if (modal && modal.classList.contains('open')) {
        modal.classList.remove('open');
        global.CyberShield.Accessibility.releaseFocus(modal);
      }
    }
  };

  global.CyberShield.LearningHubModule = LearningHubModule;
})(window);
