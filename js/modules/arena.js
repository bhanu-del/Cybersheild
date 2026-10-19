/**
 * CyberShield — Awareness Arena Module
 * Realistic interactive phishing and scam simulation rounds with
 * difficulty levels, immediate evidence feedback, double-submission locks, and scoring.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  let activeRound = null; // { scenarios, currentIndex, userAnswers, score, startTime, config }

  const ArenaModule = {
    resetRound: function() {
      activeRound = null;
    },

    cleanup: function() {
      // Nothing lingering to leak
    },

    render: function(container) {
      if (activeRound && activeRound.isFinished) {
        this.renderSummary(container);
      } else if (activeRound && !activeRound.isFinished) {
        this.renderQuestion(container);
      } else {
        this.renderSetup(container);
      }
    },

    // ----------------------------------------------------
    // 1. SETUP VIEW
    // ----------------------------------------------------
    renderSetup: function(container) {
      const getIcon = global.CyberShield.getIcon;
      const prefs = global.CyberShield.State.getData().preferences || {};
      const isHinglish = prefs.language === 'hinglish';

      container.innerHTML = `
        <div class="arena-setup-card card">
          <div class="card-header">
            <div class="card-title-group">
              <span class="card-title">${isHinglish ? 'Awareness Arena: Training Round Setup' : 'Awareness Arena: Training Setup'}</span>
              <span class="card-subtitle">${isHinglish ? 'Apna difficulty level aur questions select karein' : 'Configure your practice round and test your scam detection skills'}</span>
            </div>
            <div class="badge badge-brand">${getIcon('gamepad')} Simulation Lab</div>
          </div>
          <div class="card-body">
            <div id="arena-setup-error" class="alert alert-warning" style="display: none;"></div>

            <!-- Difficulty Selection -->
            <div class="form-group">
              <label class="form-label">
                <span>Select Difficulty</span>
                <span class="form-hint">Controls clue subtlety and scenario complexity</span>
              </label>
              <div class="chips-group" id="arena-difficulty-chips">
                <button type="button" class="chip-btn active" data-diff="all">All Difficulties</button>
                <button type="button" class="chip-btn" data-diff="beginner">Beginner (Obvious Clues)</button>
                <button type="button" class="chip-btn" data-diff="intermediate">Intermediate (Subtle Tricks)</button>
                <button type="button" class="chip-btn" data-diff="advanced">Advanced (Ambiguous / Legit)</button>
              </div>
            </div>

            <!-- Question Count -->
            <div class="form-group" style="margin-top: var(--space-lg);">
              <label class="form-label">
                <span>Question Count</span>
                <span class="form-hint">Recommended: 5 for a quick drill</span>
              </label>
              <div class="chips-group" id="arena-count-chips">
                <button type="button" class="chip-btn active" data-count="5">5 Questions</button>
                <button type="button" class="chip-btn" data-count="10">10 Questions</button>
                <button type="button" class="chip-btn" data-count="all">All Eligible</button>
              </div>
            </div>

            <!-- Category Filter -->
            <div class="form-group" style="margin-top: var(--space-lg);">
              <label class="form-label" for="arena-category-select">Category Focus</label>
              <select class="form-select" id="arena-category-select">
                <option value="all">All Categories (Balanced Mix)</option>
                <option value="url_phishing">URL & Link Phishing</option>
                <option value="otp_credentials">Passwords & OTP Safety</option>
                <option value="fake_offers">Fake Offers & Prizes</option>
                <option value="impersonation">Impersonation & Authority Scams</option>
                <option value="social_pressure">Social Pressure & Urgency</option>
                <option value="technical_scams">Technical & Browser Security</option>
              </select>
            </div>

            <!-- Language Toggle -->
            <div class="form-group" style="margin-top: var(--space-lg);">
              <label class="form-label" for="arena-lang-select">Explanation Language</label>
              <select class="form-select" id="arena-lang-select">
                <option value="en" ${!isHinglish ? 'selected' : ''}>English</option>
                <option value="hinglish" ${isHinglish ? 'selected' : ''}>Hinglish (Hindi + English blend)</option>
              </select>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-secondary" id="btn-arena-cancel">Back to Overview</button>
            <button class="btn btn-primary btn-lg" id="btn-arena-start">
              ${getIcon('zap')}
              <span>Start Training Round</span>
            </button>
          </div>
        </div>
      `;

      // Attach setup events
      this.attachSetupEvents(container);
    },

    attachSetupEvents: function(container) {
      // Difficulty chips toggle
      const diffChips = container.querySelectorAll('#arena-difficulty-chips .chip-btn');
      diffChips.forEach(chip => {
        chip.addEventListener('click', () => {
          diffChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        });
      });

      // Count chips toggle
      const countChips = container.querySelectorAll('#arena-count-chips .chip-btn');
      countChips.forEach(chip => {
        chip.addEventListener('click', () => {
          countChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        });
      });

      // Cancel button
      const cancelBtn = container.querySelector('#btn-arena-cancel');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          global.CyberShield.Router.navigate('overview');
        });
      }

      // Start button
      const startBtn = container.querySelector('#btn-arena-start');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          const selectedDiff = container.querySelector('#arena-difficulty-chips .chip-btn.active').dataset.diff;
          const selectedCount = container.querySelector('#arena-count-chips .chip-btn.active').dataset.count;
          const selectedCategory = container.querySelector('#arena-category-select').value;
          const selectedLang = container.querySelector('#arena-lang-select').value;

          const allScenarios = global.CyberShield.SCENARIOS || [];
          const validation = global.CyberShield.Validation.validateArenaSetup(
            allScenarios,
            selectedCategory,
            selectedDiff,
            selectedCount
          );

          const errorDiv = container.querySelector('#arena-setup-error');
          if (!validation.isValid) {
            errorDiv.textContent = validation.error;
            errorDiv.style.display = 'block';
            return;
          }

          errorDiv.style.display = 'none';

          // Shuffle eligible scenarios deterministically for variety
          const shuffled = validation.eligibleScenarios.slice().sort(() => 0.5 - Math.random());
          const chosenScenarios = shuffled.slice(0, validation.questionCount);

          // Initialize active round
          activeRound = {
            id: global.CyberShield.Ids.generateSessionId(),
            scenarios: chosenScenarios,
            currentIndex: 0,
            userAnswers: [], // { scenarioId, selectedChoiceId, isCorrect, isSkipped, carefulVerifier }
            score: 0,
            startTime: Date.now(),
            config: {
              category: selectedCategory,
              difficulty: selectedDiff,
              language: selectedLang,
              total: chosenScenarios.length
            },
            isSubmittedCurrent: false,
            isFinished: false
          };

          this.render(container);
        });
      }
    },

    // ----------------------------------------------------
    // 2. ACTIVE QUESTION VIEW
    // ----------------------------------------------------
    renderQuestion: function(container) {
      const getIcon = global.CyberShield.getIcon;
      const scenario = activeRound.scenarios[activeRound.currentIndex];
      const isHinglish = activeRound.config.language === 'hinglish';
      const questionNumber = activeRound.currentIndex + 1;
      const totalQuestions = activeRound.scenarios.length;
      const progressPercent = Math.round((activeRound.currentIndex / totalQuestions) * 100);

      container.innerHTML = `
        <div class="card" style="max-width: 760px; margin: 0 auto;">
          <!-- Round Header -->
          <div class="card-header">
            <div class="arena-meta">
              <span class="badge badge-brand">Question ${questionNumber} of ${totalQuestions}</span>
              <span class="badge badge-neutral" style="text-transform: capitalize;">${scenario.difficulty}</span>
              <span class="badge badge-purple">${scenario.categoryName}</span>
            </div>
            <button class="btn btn-quiet btn-sm" id="btn-arena-abort">Exit Round</button>
          </div>

          <!-- Progress bar -->
          <div class="progress-container" style="border-radius: 0;">
            <div class="progress-bar" style="width: ${progressPercent}%;"></div>
          </div>

          <div class="card-body">
            <!-- Simulated Scenario Box -->
            <div class="scenario-box">
              <div class="scenario-sender">
                <span style="color: var(--color-text-muted); font-size: var(--font-size-xs);">From:</span>
                <span class="sender-badge">${global.CyberShield.SafeRender.escapeHtml(scenario.sender)}</span>
              </div>
              <div class="scenario-message-bubble">
                "${global.CyberShield.SafeRender.escapeHtml(scenario.message)}"
              </div>
              ${scenario.url ? `
                <div style="margin-top: var(--space-xs);">
                  <span class="scenario-url-pill">
                    ${getIcon('link', 'icon-inline')}
                    <span>${global.CyberShield.SafeRender.escapeHtml(scenario.url)}</span>
                  </span>
                </div>
              ` : ''}
            </div>

            <!-- Question Instruction -->
            <h3 class="question-title">
              ${isHinglish 
                ? 'Aap is message ke sath kya karenge? Sahi aur safe option chunein:' 
                : 'How should you respond to this message? Choose the safest action:'}
            </h3>

            <!-- Choice Cards -->
            <div class="choices-list" id="arena-choices-group" role="radiogroup" aria-label="Answer choices">
              ${scenario.choices.map(choice => `
                <button type="button" class="choice-card" role="radio" aria-checked="false" data-choice="${choice.id}">
                  <span class="choice-key">${choice.id}</span>
                  <span class="choice-text">
                    ${isHinglish && choice.textHinglish ? choice.textHinglish : choice.text}
                  </span>
                  <kbd style="font-size: 0.7rem; color: var(--color-text-muted); padding: 1px 5px; border-radius: 4px; border: 1px solid var(--color-border); background: var(--color-bg-elevated); margin-left: var(--space-xs);" title="Keyboard shortcut: Press ${choice.id}">
                    ${choice.id}
                  </kbd>
                </button>
              `).join('')}
            </div>

            <!-- Feedback Area (Initially Hidden) -->
            <div id="arena-feedback-container" style="display: none;"></div>
          </div>

          <!-- Action Footer -->
          <div class="card-footer" id="arena-action-footer">
            <button class="btn btn-quiet" id="btn-arena-skip" title="Hotkey: Press S">Skip (S)</button>
            <button class="btn btn-primary" id="btn-arena-submit" disabled>
              <span>Submit Answer</span>
              <kbd style="font-size: 0.7rem; margin-left: 6px; padding: 1px 5px; background: rgba(255,255,255,0.25); border-radius: 4px;">↵ Enter</kbd>
            </button>
          </div>
        </div>
      `;

      this.attachQuestionEvents(container, scenario);
    },

    attachQuestionEvents: function(container, scenario) {
      let selectedChoice = null;
      const choices = container.querySelectorAll('.choice-card');
      const submitBtn = container.querySelector('#btn-arena-submit');
      const skipBtn = container.querySelector('#btn-arena-skip');
      const abortBtn = container.querySelector('#btn-arena-abort');

      // Abort round
      if (abortBtn) {
        abortBtn.addEventListener('click', () => {
          if (confirm('Exit active round? Current unfinished progress will not be saved.')) {
            if (activeRound._keyHandler) window.removeEventListener('keydown', activeRound._keyHandler);
            activeRound = null;
            this.render(container);
          }
        });
      }

      // Choice selection
      choices.forEach(btn => {
        btn.addEventListener('click', () => {
          if (activeRound.isSubmittedCurrent) return; // Prevent change after submit

          choices.forEach(c => {
            c.classList.remove('selected');
            c.setAttribute('aria-checked', 'false');
          });

          btn.classList.add('selected');
          btn.setAttribute('aria-checked', 'true');
          selectedChoice = btn.dataset.choice;
          submitBtn.disabled = false;
          if (global.CyberShield.Sound) global.CyberShield.Sound.playTap();
        });
      });

      // Submit answer
      submitBtn.addEventListener('click', () => {
        if (!selectedChoice || activeRound.isSubmittedCurrent) return;

        // Double submit protection
        activeRound.isSubmittedCurrent = true;
        submitBtn.disabled = true;
        skipBtn.disabled = true;

        const isCorrect = selectedChoice === scenario.correctChoiceId;
        if (isCorrect) {
          activeRound.score += 1;
          if (global.CyberShield.Sound) global.CyberShield.Sound.playSuccess();
        } else {
          if (global.CyberShield.Sound) global.CyberShield.Sound.playWarning();
        }

        const isCarefulVerifier = isCorrect && scenario.isVerifyOptimal;

        activeRound.userAnswers.push({
          scenarioId: scenario.id,
          selectedChoiceId: selectedChoice,
          isCorrect: isCorrect,
          isSkipped: false,
          carefulVerifier: isCarefulVerifier
        });

        // Mark choices visually
        choices.forEach(btn => {
          btn.disabled = true;
          if (btn.dataset.choice === scenario.correctChoiceId) {
            btn.classList.add('correct');
          } else if (btn.dataset.choice === selectedChoice) {
            btn.classList.add('incorrect');
          }
        });

        // Display rich feedback panel
        this.showQuestionFeedback(container, scenario, isCorrect);
      });

      // Skip question
      skipBtn.addEventListener('click', () => {
        if (activeRound.isSubmittedCurrent) return;

        activeRound.userAnswers.push({
          scenarioId: scenario.id,
          selectedChoiceId: null,
          isCorrect: false,
          isSkipped: true,
          carefulVerifier: false
        });

        this.advanceToNext(container);
      });

      // Keyboard hotkeys
      const handleKey = (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        const key = e.key.toUpperCase();
        const choiceMap = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', 'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D' };

        if (!activeRound.isSubmittedCurrent && choiceMap[key]) {
          const targetChoice = choiceMap[key];
          const choiceBtn = container.querySelector(`.choice-card[data-choice="${targetChoice}"]`);
          if (choiceBtn) choiceBtn.click();
        } else if (e.key === 'Enter') {
          if (!activeRound.isSubmittedCurrent) {
            if (selectedChoice) submitBtn.click();
          } else {
            const nextBtn = container.querySelector('#btn-arena-next');
            if (nextBtn) nextBtn.click();
          }
        } else if ((e.key === 's' || e.key === 'S') && !activeRound.isSubmittedCurrent) {
          skipBtn.click();
        }
      };

      if (activeRound._keyHandler) {
        window.removeEventListener('keydown', activeRound._keyHandler);
      }
      activeRound._keyHandler = handleKey;
      window.addEventListener('keydown', handleKey);
    },

    showQuestionFeedback: function(container, scenario, isCorrect) {
      const getIcon = global.CyberShield.getIcon;
      const isHinglish = activeRound.config.language === 'hinglish';
      const feedbackBox = container.querySelector('#arena-feedback-container');
      const footer = container.querySelector('#arena-action-footer');

      const headlineClass = isCorrect ? 'color: var(--color-success);' : 'color: var(--color-warning);';
      const headlineText = isCorrect 
        ? `${getIcon('check-circle')} Correct Decision!` 
        : `${getIcon('x-circle')} Caution: Unsafe or Incomplete Decision`;

      const explanation = isHinglish && scenario.explanationHinglish ? scenario.explanationHinglish : scenario.explanation;

      feedbackBox.innerHTML = `
        <div class="arena-feedback">
          <div class="feedback-headline" style="${headlineClass}">
            ${headlineText}
          </div>
          <p style="font-size: var(--font-size-sm); margin-bottom: var(--space-xs);">${explanation}</p>
          
          <div style="font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); color: var(--color-text-primary); margin-top: var(--space-sm);">
            Evidence & Indicators:
          </div>
          <ul class="feedback-evidence-list">
            ${scenario.evidence.map(ev => `<li>${global.CyberShield.SafeRender.escapeHtml(ev)}</li>`).join('')}
          </ul>

          <div class="feedback-safe-action">
            <strong>Safe Next Step:</strong> ${global.CyberShield.SafeRender.escapeHtml(scenario.safeNextStep)}
          </div>
        </div>
      `;
      feedbackBox.style.display = 'block';

      // Update footer button to "Next Question" with Enter shortcut hint
      footer.innerHTML = `
        <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
          Answer locked. Press ↵ Enter to continue.
        </span>
        <button class="btn btn-primary btn-lg" id="btn-arena-next">
          <span>${activeRound.currentIndex + 1 < activeRound.scenarios.length ? 'Next Question' : 'View Round Results'}</span>
          <kbd style="font-size: 0.7rem; margin-left: 6px; padding: 1px 5px; background: rgba(255,255,255,0.25); border-radius: 4px;">↵ Enter</kbd>
          ${getIcon('arrow-right')}
        </button>
      `;

      const nextBtn = footer.querySelector('#btn-arena-next');
      nextBtn.addEventListener('click', () => {
        this.advanceToNext(container);
      });
    },

    advanceToNext: function(container) {
      if (activeRound._keyHandler) {
        window.removeEventListener('keydown', activeRound._keyHandler);
        delete activeRound._keyHandler;
      }
      activeRound.isSubmittedCurrent = false;
      activeRound.currentIndex += 1;

      if (activeRound.currentIndex >= activeRound.scenarios.length) {
        // Round Finished!
        activeRound.isFinished = true;
        this.saveCompletedRound();
        this.renderSummary(container);
      } else {
        this.renderQuestion(container);
      }
    },

    saveCompletedRound: function() {
      const state = global.CyberShield.State;
      const total = activeRound.scenarios.length;
      const correct = activeRound.score;
      const skipped = activeRound.userAnswers.filter(a => a.isSkipped).length;
      const incorrect = total - correct - skipped;
      const answered = correct + incorrect;
      const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

      // Calculate category breakdown
      const categoryBreakdown = {};
      let carefulVerifierCount = 0;

      activeRound.userAnswers.forEach((ans, idx) => {
        const scen = activeRound.scenarios[idx];
        if (!categoryBreakdown[scen.category]) {
          categoryBreakdown[scen.category] = { correct: 0, total: 0 };
        }
        if (!ans.isSkipped) {
          categoryBreakdown[scen.category].total += 1;
          if (ans.isCorrect) {
            categoryBreakdown[scen.category].correct += 1;
          }
        }
        if (ans.carefulVerifier) {
          carefulVerifierCount += 1;
        }
      });

      const summary = {
        id: activeRound.id,
        timestamp: Date.now(),
        category: activeRound.config.category,
        difficulty: activeRound.config.difficulty,
        totalQuestions: total,
        correctCount: correct,
        incorrectCount: incorrect,
        skippedCount: skipped,
        accuracy: accuracy,
        categoryBreakdown: categoryBreakdown,
        carefulVerifierCount: carefulVerifierCount
      };

      state.recordSession(summary);
    },

    // ----------------------------------------------------
    // 3. ROUND SUMMARY VIEW
    // ----------------------------------------------------
    renderSummary: function(container) {
      const getIcon = global.CyberShield.getIcon;
      const total = activeRound.scenarios.length;
      const correct = activeRound.score;
      const skipped = activeRound.userAnswers.filter(a => a.isSkipped).length;
      const answered = total - skipped;
      const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

      container.innerHTML = `
        <div class="arena-summary-card card">
          <div class="card-header">
            <div class="card-title-group" style="text-align: left;">
              <span class="card-title">Training Round Complete!</span>
              <span class="card-subtitle">Session recorded in local browser progress</span>
            </div>
            <div class="badge badge-success">${getIcon('check')} Recorded</div>
          </div>
          <div class="card-body">
            <div class="score-circle-display">
              <span class="score-num">${accuracy}%</span>
              <span class="score-label">Accuracy</span>
            </div>

            <h2 style="font-size: var(--font-size-xl); margin-bottom: var(--space-xs);">
              ${accuracy >= 80 ? 'Outstanding Defense!' : accuracy >= 50 ? 'Good Practice Session' : 'Keep Training'}
            </h2>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); max-width: 440px; margin: 0 auto var(--space-lg);">
              You answered <strong>${correct}</strong> of <strong>${answered}</strong> questions correctly (${skipped} skipped).
            </p>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md); margin-bottom: var(--space-xl); text-align: center;">
              <div style="background-color: var(--color-success-surface); padding: var(--space-md); border-radius: var(--radius-md);">
                <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-success);">${correct}</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-success);">Correct</div>
              </div>
              <div style="background-color: var(--color-warning-surface); padding: var(--space-md); border-radius: var(--radius-md);">
                <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-warning);">${total - correct - skipped}</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-warning);">Incorrect</div>
              </div>
              <div style="background-color: var(--color-bg-elevated); padding: var(--space-md); border-radius: var(--radius-md);">
                <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-text-secondary);">${skipped}</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Skipped</div>
              </div>
            </div>

            <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-primary btn-lg" id="btn-summary-restart">
                ${getIcon('rotate-ccw')}
                <span>Play Another Round</span>
              </button>
              <button class="btn btn-secondary btn-lg" id="btn-summary-cert">
                ${getIcon('award')}
                <span>Generate Certificate</span>
              </button>
              <button class="btn btn-secondary btn-lg" id="btn-summary-progress">
                ${getIcon('trending-up')}
                <span>View Full Progress Center</span>
              </button>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-summary-restart').addEventListener('click', () => {
        activeRound = null;
        this.renderSetup(container);
      });

      container.querySelector('#btn-summary-cert').addEventListener('click', () => {
        if (global.CyberShield.Certificate) {
          global.CyberShield.Certificate.openModal({ accuracy: accuracy });
        }
      });

      container.querySelector('#btn-summary-progress').addEventListener('click', () => {
        activeRound = null;
        global.CyberShield.Router.navigate('progress');
      });
    }
  };

  global.CyberShield.ArenaModule = ArenaModule;
})(window);
