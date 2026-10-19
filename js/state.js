/**
 * CyberShield — Centralized State & Derived Metrics Store
 * Computes authoritative derived statistics without duplicating or corrupting data.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const listeners = [];
  let persistentData = global.CyberShield.Storage.load();

  // Active transient session states (never saved to disk)
  const transient = {
    currentRoute: 'overview',
    arenaSession: null,      // Active Arena round state
    linkInspection: null,    // Last URL inspection result
    messageAnalysis: null,   // Last message analysis result
    activeLessonId: null,    // Lesson currently open in modal
    demoSession: null        // Kiosk visitor isolated state
  };

  const State = {
    // Read persistent data
    getData: function() {
      return persistentData;
    },

    // Read transient state
    getTransient: function() {
      return transient;
    },

    // Subscribe to state mutations
    subscribe: function(callback) {
      if (typeof callback === 'function') {
        listeners.push(callback);
      }
    },

    notify: function(changeType, payload) {
      for (const cb of listeners) {
        try {
          cb(changeType, payload, persistentData);
        } catch (e) {
          console.error('State subscriber error:', e);
        }
      }
    },

    // Preference mutations
    setPreference: function(key, value) {
      if (!persistentData.preferences) persistentData.preferences = {};
      persistentData.preferences[key] = value;
      global.CyberShield.Storage.save(persistentData);
      this.notify('preference_changed', { key, value });
    },

    // Record completed Arena session
    recordSession: function(sessionSummary) {
      if (!sessionSummary) return;
      persistentData.sessions.unshift(sessionSummary);

      // Ring-buffer optimization: Cap session history to 50 most recent sessions
      // to keep localStorage serialization at O(1) constant time and prevent memory bloat
      if (persistentData.sessions.length > 50) {
        persistentData.sessions = persistentData.sessions.slice(0, 50);
      }

      // Check achievements
      this.checkAchievementsAfterSession(sessionSummary);

      global.CyberShield.Storage.save(persistentData);
      this.notify('session_recorded', sessionSummary);
    },

    // Record Link inspection count
    recordUrlInspection: function() {
      persistentData.stats.inspectedUrlsCount = (persistentData.stats.inspectedUrlsCount || 0) + 1;
      
      const count = persistentData.stats.inspectedUrlsCount;
      const ach = persistentData.achievements['link-detective'];
      if (ach && !ach.unlocked && count >= 3) {
        ach.unlocked = true;
        ach.unlockedAt = Date.now();
        this.notify('achievement_unlocked', { id: 'link-detective', name: 'Link Detective' });
      }

      global.CyberShield.Storage.save(persistentData);
      this.notify('stats_updated', persistentData.stats);
    },

    // Record Message analysis count
    recordMessageAnalysis: function() {
      persistentData.stats.analyzedMessagesCount = (persistentData.stats.analyzedMessagesCount || 0) + 1;

      const count = persistentData.stats.analyzedMessagesCount;
      const ach = persistentData.achievements['message-guardian'];
      if (ach && !ach.unlocked && count >= 3) {
        ach.unlocked = true;
        ach.unlockedAt = Date.now();
        this.notify('achievement_unlocked', { id: 'message-guardian', name: 'Message Guardian' });
      }

      global.CyberShield.Storage.save(persistentData);
      this.notify('stats_updated', persistentData.stats);
    },

    // Record Lesson completed
    recordLessonCompleted: function(lessonId) {
      if (!lessonId) return;
      if (!persistentData.lessonProgress) persistentData.lessonProgress = {};
      persistentData.lessonProgress[lessonId] = {
        completed: true,
        timestamp: Date.now()
      };

      // Check Knowledge Champion achievement (all 7 lessons)
      const completedCount = Object.keys(persistentData.lessonProgress).length;
      const ach = persistentData.achievements['knowledge-champion'];
      if (ach && !ach.unlocked && completedCount >= 7) {
        ach.unlocked = true;
        ach.unlockedAt = Date.now();
        this.notify('achievement_unlocked', { id: 'knowledge-champion', name: 'Knowledge Champion' });
      }

      global.CyberShield.Storage.save(persistentData);
      this.notify('lesson_completed', { lessonId });
    },

    // Check session-based achievements
    checkAchievementsAfterSession: function(session) {
      const achs = persistentData.achievements;

      // Scam Spotter: Complete 1 session
      if (achs['scam-spotter'] && !achs['scam-spotter'].unlocked) {
        achs['scam-spotter'].unlocked = true;
        achs['scam-spotter'].unlockedAt = Date.now();
        this.notify('achievement_unlocked', { id: 'scam-spotter', name: 'Scam Spotter' });
      }

      // Consistent Learner: Complete 3 sessions
      if (achs['consistent-learner'] && !achs['consistent-learner'].unlocked) {
        if (persistentData.sessions.length >= 3) {
          achs['consistent-learner'].unlocked = true;
          achs['consistent-learner'].unlockedAt = Date.now();
          this.notify('achievement_unlocked', { id: 'consistent-learner', name: 'Consistent Learner' });
        }
      }

      // Careful Verifier
      if (session.carefulVerifierCount) {
        const cv = achs['careful-verifier'];
        if (cv && !cv.unlocked) {
          cv.count = (cv.count || 0) + session.carefulVerifierCount;
          if (cv.count >= 3) {
            cv.unlocked = true;
            cv.unlockedAt = Date.now();
            this.notify('achievement_unlocked', { id: 'careful-verifier', name: 'Careful Verifier' });
          }
        }
      }
    },

    // Reset all records
    resetAllData: function() {
      global.CyberShield.Storage.clearAll();
      persistentData = global.CyberShield.Storage.load();
      this.notify('data_reset', null);
    },

    // ==========================================
    // AUTHORITATIVE DERIVED METRICS CALCULATIONS
    // ==========================================
    getDerivedStats: function() {
      const sessions = persistentData.sessions || [];
      const totalRounds = sessions.length;

      let totalCorrect = 0;
      let totalIncorrect = 0;
      let totalSkipped = 0;
      let categoryStats = {};

      for (const s of sessions) {
        totalCorrect += (Number(s.correctCount) || 0);
        totalIncorrect += (Number(s.incorrectCount) || 0);
        totalSkipped += (Number(s.skippedCount) || 0);

        if (s.categoryBreakdown && typeof s.categoryBreakdown === 'object') {
          for (const [cat, data] of Object.entries(s.categoryBreakdown)) {
            if (!categoryStats[cat]) {
              categoryStats[cat] = { correct: 0, total: 0 };
            }
            categoryStats[cat].correct += (Number(data.correct) || 0);
            categoryStats[cat].total += (Number(data.total) || 0);
          }
        } else if (s.category && s.category !== 'all') {
          if (!categoryStats[s.category]) {
            categoryStats[s.category] = { correct: 0, total: 0 };
          }
          categoryStats[s.category].correct += (Number(s.correctCount) || 0);
          categoryStats[s.category].total += (Number(s.correctCount) || 0) + (Number(s.incorrectCount) || 0);
        }
      }

      const totalAnswered = totalCorrect + totalIncorrect; // Skipped answers excluded from accuracy denominator per spec
      const overallAccuracyPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : null;

      const completedLessonsCount = Object.keys(persistentData.lessonProgress || {}).length;

      return {
        totalRounds,
        totalAnswered,
        totalCorrect,
        totalIncorrect,
        totalSkipped,
        overallAccuracyPct,
        categoryStats,
        completedLessonsCount
      };
    },

    getSuggestedNextLesson: function() {
      const { categoryStats } = this.getDerivedStats();
      
      // Find category with lowest accuracy
      let lowestCat = null;
      let lowestPct = 101;

      for (const [cat, data] of Object.entries(categoryStats)) {
        if (data.total >= 2) {
          const pct = Math.round((data.correct / data.total) * 100);
          if (pct < lowestPct) {
            lowestPct = pct;
            lowestCat = cat;
          }
        }
      }

      // Map category to lesson
      const catToLessonMap = {
        'url_phishing': 'lesson-url-inspection',
        'otp_credentials': 'lesson-passwords-otp',
        'fake_offers': 'lesson-fake-offers',
        'impersonation': 'lesson-impersonation',
        'social_pressure': 'lesson-phishing-fundamentals',
        'technical_scams': 'lesson-safe-browsing'
      };

      if (lowestCat && catToLessonMap[lowestCat]) {
        return catToLessonMap[lowestCat];
      }

      return 'lesson-phishing-fundamentals'; // Default recommendation for new learners
    }
  };

  global.CyberShield.State = State;
})(window);
