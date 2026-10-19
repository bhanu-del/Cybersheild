/**
 * CyberShield — Safe Persistence Layer
 * Versioned schema, error recovery, quota protection, minimal safe summaries only.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const STORAGE_KEY = 'cybershield_storage_v1';
  const CURRENT_SCHEMA_VERSION = 1;

  // Initial clean state structure
  const DEFAULT_STATE = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    preferences: {
      theme: 'light',
      language: 'en',
      reduceMotion: false,
      persistProgress: true
    },
    sessions: [], // Minimal completed session summaries only
    lessonProgress: {}, // { lessonId: { completed: true, timestamp: number } }
    achievements: {
      'scam-spotter': { unlocked: false, unlockedAt: null },
      'careful-verifier': { unlocked: false, unlockedAt: null, count: 0 },
      'link-detective': { unlocked: false, unlockedAt: null, count: 0 },
      'message-guardian': { unlocked: false, unlockedAt: null, count: 0 },
      'consistent-learner': { unlocked: false, unlockedAt: null },
      'knowledge-champion': { unlocked: false, unlockedAt: null }
    },
    stats: {
      inspectedUrlsCount: 0,
      analyzedMessagesCount: 0
    }
  };

  let inMemoryStorage = JSON.parse(JSON.stringify(DEFAULT_STATE));
  let isLocalStorageAvailable = true;

  // Test localStorage availability safely
  try {
    const testKey = '__cs_test_storage__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    isLocalStorageAvailable = true;
  } catch (e) {
    isLocalStorageAvailable = false;
    console.warn('CyberShield: LocalStorage is unavailable or restricted. Operating in session memory mode.');
  }

  const Storage = {
    isAvailable: function() {
      return isLocalStorageAvailable;
    },

    /**
     * Validate stored schema to prevent corruption crashes
     */
    validateSchema: function(data) {
      if (!data || typeof data !== 'object') return false;
      if (typeof data.schemaVersion !== 'number') return false;
      if (!data.preferences || typeof data.preferences !== 'object') return false;
      if (!Array.isArray(data.sessions)) return false;
      return true;
    },

    /**
     * Load state from storage or fall back to defaults
     */
    load: function() {
      if (!isLocalStorageAvailable) {
        return inMemoryStorage;
      }

      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          inMemoryStorage = JSON.parse(JSON.stringify(DEFAULT_STATE));
          return inMemoryStorage;
        }

        const parsed = JSON.parse(raw);
        if (this.validateSchema(parsed)) {
          // Merge with defaults to guarantee all fields exist
          inMemoryStorage = {
            ...DEFAULT_STATE,
            ...parsed,
            preferences: { ...DEFAULT_STATE.preferences, ...parsed.preferences },
            achievements: { ...DEFAULT_STATE.achievements, ...parsed.achievements },
            stats: { ...DEFAULT_STATE.stats, ...parsed.stats }
          };
          return inMemoryStorage;
        } else {
          console.warn('CyberShield: Invalid or corrupt storage record detected. Resetting to safe defaults.');
          inMemoryStorage = JSON.parse(JSON.stringify(DEFAULT_STATE));
          return inMemoryStorage;
        }
      } catch (err) {
        console.error('CyberShield: Storage load error:', err);
        inMemoryStorage = JSON.parse(JSON.stringify(DEFAULT_STATE));
        return inMemoryStorage;
      }
    },

    /**
     * Save current state to storage
     */
    save: function(state) {
      inMemoryStorage = state;
      if (!isLocalStorageAvailable) return false;
      if (state.preferences && state.preferences.persistProgress === false) {
        // User opted out of persistent storage
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
        return true;
      }

      try {
        const json = JSON.stringify(state);
        window.localStorage.setItem(STORAGE_KEY, json);
        return true;
      } catch (err) {
        console.warn('CyberShield: Storage save error (quota or permission):', err);
        return false;
      }
    },

    /**
     * Genuine clear / reset operation
     */
    clearAll: function() {
      inMemoryStorage = JSON.parse(JSON.stringify(DEFAULT_STATE));
      if (isLocalStorageAvailable) {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
          return true;
        } catch (e) {
          console.error('CyberShield: Storage clear error:', e);
          return false;
        }
      }
      return true;
    }
  };

  global.CyberShield.Storage = Storage;
})(window);
