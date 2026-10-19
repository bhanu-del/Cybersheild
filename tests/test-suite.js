/**
 * CyberShield — Automated Test Suite & Acceptance Verifier
 * Can be run in Node.js (CLI) or inside the browser via tests/test-runner.html.
 */
(function(global) {
  'use strict';

  // Support both Node.js environment and browser global
  let isNode = typeof module !== 'undefined' && module.exports;
  let CS = global.CyberShield;

  if (isNode) {
    global.window = global;
    // Load dependencies in Node
    require('../js/utils/icons.js');
    require('../js/utils/safe-rendering.js');
    require('../js/utils/formatting.js');
    require('../js/validation.js');
    require('../js/storage.js');
    require('../js/state.js');
    require('../data/rule-catalog.js');
    require('../data/scenarios.js');
    require('../data/lessons.js');
    require('../data/case-studies.js');
    require('../js/engine/url-parser.js');
    require('../js/engine/url-rules.js');
    require('../js/engine/message-rules.js');
    require('../js/engine/result-schema.js');
    require('../js/engine/evidence-aggregator.js');
    CS = global.CyberShield;
  }

  const testResults = [];

  function assert(testName, condition, detail = '') {
    if (condition) {
      testResults.push({ name: testName, passed: true, detail: detail });
    } else {
      testResults.push({ name: testName, passed: false, detail: detail });
      console.error(`FAILED: ${testName} - ${detail}`);
    }
  }

  const TestSuite = {
    runAll: function() {
      testResults.length = 0;
      const startTime = Date.now();

      // ==========================================
      // Suite 1: Scenario Dataset Integrity
      // ==========================================
      const scenarios = CS.SCENARIOS;
      assert('Scenarios dataset exists and has at least 30 items', Array.isArray(scenarios) && scenarios.length >= 30, `Count: ${scenarios.length}`);

      const scenIds = new Set();
      let allScenariosValid = true;
      let scenarioError = '';

      for (const s of scenarios) {
        if (!s.id || scenIds.has(s.id)) {
          allScenariosValid = false;
          scenarioError = `Duplicate or missing ID: ${s.id}`;
          break;
        }
        scenIds.add(s.id);

        if (!s.category || !s.difficulty || !s.sender || !s.message || !Array.isArray(s.choices)) {
          allScenariosValid = false;
          scenarioError = `Scenario ${s.id} is missing core fields`;
          break;
        }

        if (s.choices.length !== 4) {
          allScenariosValid = false;
          scenarioError = `Scenario ${s.id} does not have exactly 4 choices (has ${s.choices.length})`;
          break;
        }

        const choiceIds = s.choices.map(c => c.id);
        if (!choiceIds.includes(s.correctChoiceId)) {
          allScenariosValid = false;
          scenarioError = `Scenario ${s.id} correctChoiceId "${s.correctChoiceId}" not in choices: ${choiceIds.join(', ')}`;
          break;
        }

        if (!s.evidence || !Array.isArray(s.evidence) || s.evidence.length === 0) {
          allScenariosValid = false;
          scenarioError = `Scenario ${s.id} is missing evidence bullets`;
          break;
        }

        if (!s.explanation) {
          allScenariosValid = false;
          scenarioError = `Scenario ${s.id} missing explanation`;
          break;
        }
      }
      assert('All scenarios have unique IDs, 4 valid choices, correct keys & explanations', allScenariosValid, scenarioError || 'All 36 scenarios verified');

      // ==========================================
      // Suite 2: Lessons Dataset Integrity & Multi-MCQ Expansion
      // ==========================================
      const lessons = CS.LESSONS;
      assert('Lessons dataset contains 7 complete guides', Array.isArray(lessons) && lessons.length === 7, `Count: ${lessons.length}`);

      let allLessonsValid = true;
      let allHaveMultiMcqs = true;
      let totalMcqCount = 0;
      let lessonError = '';
      for (const l of lessons) {
        if (!l.id || !l.title || !l.objective || !l.content || !l.knowledgeCheck) {
          allLessonsValid = false;
          lessonError = `Lesson ${l.id} missing core sections`;
          break;
        }

        // Verify multi-MCQs (each lesson must have 5-10 curated MCQs)
        if (!Array.isArray(l.knowledgeChecks) || l.knowledgeChecks.length < 5 || l.knowledgeChecks.length > 10) {
          allHaveMultiMcqs = false;
          lessonError = `Lesson ${l.id} has ${l.knowledgeChecks ? l.knowledgeChecks.length : 0} MCQs (expected 5-10)`;
          break;
        }
        totalMcqCount += l.knowledgeChecks.length;

        // Verify every MCQ has valid choices & correctId
        for (const q of l.knowledgeChecks) {
          const choiceIds = q.choices.map(c => c.id);
          if (!choiceIds.includes(q.correctId)) {
            allLessonsValid = false;
            lessonError = `Lesson ${l.id} question "${q.question.substring(0, 30)}..." correctId "${q.correctId}" not in choices`;
            break;
          }
        }
      }
      assert('All lessons have valid knowledge checks with matching answer keys', allLessonsValid, lessonError || 'All 7 lessons verified');
      assert('All 7 lessons have between 5 and 10 MCQs each (multi-question pool)', allHaveMultiMcqs, `Total MCQs across categories: ${totalMcqCount}`);

      // ==========================================
      // Suite 2B: Real Indian Case Studies (2021-2024)
      // ==========================================
      const caseStudies = CS.CASE_STUDIES;
      assert('Case studies dataset contains 8 curated Indian cases (2021-2024)', Array.isArray(caseStudies) && caseStudies.length === 8, `Count: ${caseStudies ? caseStudies.length : 0}`);

      let allCasesValid = true;
      let caseError = '';
      if (Array.isArray(caseStudies)) {
        for (const cs of caseStudies) {
          if (!cs.id || !cs.title || !cs.category || !cs.year || !cs.impact || !cs.excerpt) {
            allCasesValid = false;
            caseError = `Case ${cs.id} missing top-level metadata`;
            break;
          }
          if (!cs.realIncident || !cs.realIncident.location || !cs.realIncident.overview) {
            allCasesValid = false;
            caseError = `Case ${cs.id} missing real police report overview`;
            break;
          }
          if (!Array.isArray(cs.scamAnatomy) || cs.scamAnatomy.length !== 4) {
            allCasesValid = false;
            caseError = `Case ${cs.id} scamAnatomy must have 4 stages (has ${cs.scamAnatomy ? cs.scamAnatomy.length : 0})`;
            break;
          }
          if (!Array.isArray(cs.legalRealityCheck) || cs.legalRealityCheck.length === 0) {
            allCasesValid = false;
            caseError = `Case ${cs.id} missing legal reality check bullets`;
            break;
          }
          if (!Array.isArray(cs.redFlags) || cs.redFlags.length === 0) {
            allCasesValid = false;
            caseError = `Case ${cs.id} missing red flag indicators`;
            break;
          }
          if (!Array.isArray(cs.defensePlaybook) || cs.defensePlaybook.length === 0) {
            allCasesValid = false;
            caseError = `Case ${cs.id} missing defense playbook steps`;
            break;
          }
        }
      }
      assert('All Indian case studies have 4-stage timelines, legal checks, and response playbooks', allCasesValid, caseError || 'All 8 cases verified');

      // ==========================================
      // Suite 3: URL Validation & Parsing
      // ==========================================
      // Empty input
      const emptyUrlRes = CS.Validation.validateUrlInput('');
      assert('Rejects empty URL string', !emptyUrlRes.isValid && emptyUrlRes.error.includes('empty'));

      // Non-HTTP scheme
      const jsSchemeRes = CS.Validation.validateUrlInput('javascript:alert(1)');
      assert('Rejects javascript: scheme', !jsSchemeRes.isValid && jsSchemeRes.error.includes('Unsupported scheme'));

      // Data scheme
      const dataSchemeRes = CS.Validation.validateUrlInput('data:text/html,<h1>evil</h1>');
      assert('Rejects data: scheme', !dataSchemeRes.isValid && dataSchemeRes.error.includes('Unsupported scheme'));

      // Relative URL
      const relativeUrlRes = CS.Validation.validateUrlInput('/index.html');
      assert('Rejects relative URL missing scheme', !relativeUrlRes.isValid && relativeUrlRes.error.includes('Missing scheme'));

      // Oversized URL (> 4096 chars)
      const oversizedUrl = 'https://example.com/' + 'a'.repeat(4100);
      const oversizeRes = CS.Validation.validateUrlInput(oversizedUrl);
      assert('Rejects oversized URL exceeding 4 KB', !oversizeRes.isValid && oversizeRes.error.includes('too long'));

      // Valid URL Parsing Anatomy
      const sampleUrl = 'https://sub.portal.example.com:8443/auth/login?token=abc#section1';
      const parsed = CS.UrlParser.parse(sampleUrl);
      assert('Parses protocol correctly', parsed.protocol === 'https:');
      assert('Parses hostname correctly', parsed.hostname === 'sub.portal.example.com');
      assert('Identifies registrable domain', parsed.registrableDomain === 'example.com');
      assert('Identifies subdomains', parsed.subdomain === 'sub.portal');
      assert('Parses port correctly', parsed.port === '8443');
      assert('Parses pathname correctly', parsed.pathname === '/auth/login');
      assert('Parses search query correctly', parsed.search === '?token=abc');

      // Multi-part TLD parsing (e.g. .co.uk, .edu.in)
      const multiTldUrl = 'https://login.secure.bank.co.uk/portal';
      const multiParsed = CS.UrlParser.parse(multiTldUrl);
      assert('Identifies multi-part TLD registrable domain (bank.co.uk)', multiParsed.registrableDomain === 'bank.co.uk');
      assert('Identifies subdomains on multi-part TLD (login.secure)', multiParsed.subdomain === 'login.secure');

      // ==========================================
      // Suite 4: URL Heuristic Rules
      // ==========================================
      // Misleading domain in subdomain
      const deceptiveSubdomainUrl = 'http://paypal.com.account-update.invalid/login';
      const p1 = CS.UrlParser.parse(deceptiveSubdomainUrl);
      const eval1 = CS.UrlRules.evaluate(p1);
      const misleadingRule = eval1.matches.find(m => m.ruleId === 'URL_MISLEADING_DOMAIN');
      assert('Flags misleading brand in subdomain', !!misleadingRule);
      assert('Assigns High Concern to deceptive brand subdomain', eval1.overallConcern === 'HIGH_CONCERN');

      // Userinfo @ trick
      const userinfoUrl = 'https://google.com@attacker-controlled.invalid/agent.exe';
      const p2 = CS.UrlParser.parse(userinfoUrl);
      const eval2 = CS.UrlRules.evaluate(p2);
      const userinfoRule = eval2.matches.find(m => m.ruleId === 'URL_USERINFO_DELIMITER');
      assert('Flags user-info @ delimiter trick', !!userinfoRule);
      assert('Assigns High Concern to user-info trick', eval2.overallConcern === 'HIGH_CONCERN');

      // Raw IP Hostname
      const ipUrl = 'http://185.220.101.5/checkout';
      const p3 = CS.UrlParser.parse(ipUrl);
      const eval3 = CS.UrlRules.evaluate(p3);
      const ipRule = eval3.matches.find(m => m.ruleId === 'URL_IP_ADDRESS_HOST');
      assert('Flags raw IP address host', !!ipRule);

      // Shortener domain
      const shortUrl = 'https://tinyurl.com/sample-path';
      const p4 = CS.UrlParser.parse(shortUrl);
      const eval4 = CS.UrlRules.evaluate(p4);
      const shortRule = eval4.matches.find(m => m.ruleId === 'URL_SHORTENER');
      assert('Flags URL shortener domain', !!shortRule);
      assert('Assigns Review Advised to shortener', eval4.overallConcern === 'REVIEW_ADVISED');

      // Punycode IDN
      const punyUrl = 'https://xn--pple-43d.com/store';
      const p5 = CS.UrlParser.parse(punyUrl);
      const eval5 = CS.UrlRules.evaluate(p5);
      const punyRule = eval5.matches.find(m => m.ruleId === 'URL_PUNYCODE_IDN');
      assert('Flags Punycode IDN representation', !!punyRule);

      // Benign URL
      const benignUrl = 'https://clouddrive.example.com/shared/doc?id=99281';
      const p6 = CS.UrlParser.parse(benignUrl);
      const eval6 = CS.UrlRules.evaluate(p6);
      assert('Benign URL triggers zero warning rules', eval6.matches.length === 0);
      assert('Benign URL labeled "No obvious warning signs"', eval6.overallConcern === 'NO_OBVIOUS_WARNINGS');

      // Transparency: "No obvious warning signs" must NOT claim "verified safe"
      const aggBenign = CS.EvidenceAggregator.aggregateUrlResult(eval6);
      assert('Disclaimer explicitly clarifies no warning does NOT equal confirmed safe', 
        aggBenign.disclaimer.includes('does NOT mean this address is guaranteed safe'));
      assert('Explicitly lists what was not checked', aggBenign.whatWasNotChecked.length >= 3);

      // ==========================================
      // Suite 5: Message Analyzer Rules
      // ==========================================
      // Empty message
      const emptyMsgRes = CS.Validation.validateMessageInput('');
      assert('Rejects empty message input', !emptyMsgRes.isValid);

      // Oversized message (> 20 KB)
      const oversizedMsg = 'a'.repeat(20485);
      const oversizeMsgRes = CS.Validation.validateMessageInput(oversizedMsg);
      assert('Rejects message exceeding 20 KB limit', !oversizeMsgRes.isValid);

      // OTP theft SMS
      const otpMsg = 'BANK ALERT: A charge of $480 is pending. Reply with your 6-digit OTP code to cancel within 10 minutes.';
      const msgEval1 = CS.MessageRules.evaluate(otpMsg);
      const otpRuleMatch = msgEval1.matches.find(m => m.ruleId === 'MSG_CREDENTIAL_OTP');
      const urgencyRuleMatch = msgEval1.matches.find(m => m.ruleId === 'MSG_URGENCY_THREAT');
      assert('Flags direct credential/OTP request', !!otpRuleMatch);
      assert('Flags artificial urgency in same message', !!urgencyRuleMatch);
      assert('Assigns High Concern to OTP request', msgEval1.overallConcern === 'HIGH_CONCERN');

      // Fake Task Scam with Telegram move
      const taskMsg = 'Congratulations! You have been selected for work from home job. Earn $500 daily. Message our hiring manager on Telegram @FastHR';
      const msgEval2 = CS.MessageRules.evaluate(taskMsg);
      const prizeMatch = msgEval2.matches.find(m => m.ruleId === 'MSG_FAKE_PRIZE_OFFER');
      const offPlatformMatch = msgEval2.matches.find(m => m.ruleId === 'MSG_OFF_PLATFORM_MOVE');
      assert('Flags fake job / prize claim', !!prizeMatch);
      assert('Flags off-platform move to Telegram', !!offPlatformMatch);

      // Embedded URL extraction
      const msgWithLink = 'Your parcel is delayed. Click here to update address: https://parcel-track.invalid/order?id=123';
      const extracted = CS.MessageRules.extractUrls(msgWithLink);
      assert('Safely extracts embedded URL', extracted.length === 1 && extracted[0] === 'https://parcel-track.invalid/order?id=123');

      // Benign message test (No false positives on generic urgent meeting)
      const benignMeetingMsg = 'Hi team, reminder: Team meeting is scheduled for tomorrow at 10:00 AM.';
      const msgEval3 = CS.MessageRules.evaluate(benignMeetingMsg);
      assert('Benign scheduling message triggers zero flags', msgEval3.matches.length === 0);
      assert('Benign message labeled "No obvious warning signs"', msgEval3.overallConcern === 'NO_OBVIOUS_WARNINGS');

      // ==========================================
      // Suite 6: Security, XSS & Safe Rendering
      // ==========================================
      const maliciousHtml = '<script>alert("XSS")</script><img src="x" onerror="alert(1)">';
      const escaped = CS.SafeRender.escapeHtml(maliciousHtml);
      assert('Escapes script tags safely', !escaped.includes('<script>') && escaped.includes('&lt;script&gt;'));
      assert('Escapes onerror handler quotes', !escaped.includes('"onerror=') && escaped.includes('&quot;'));

      // ==========================================
      // Suite 7: Math & Weighted Accuracy
      // ==========================================
      // formatAccuracy tests
      assert('Handles zero answers without dividing by zero', CS.Formatting.formatAccuracy(0, 0) === '—');
      assert('Calculates accurate 100%', CS.Formatting.formatAccuracy(10, 10) === '100%');
      assert('Calculates accurate rounded 67%', CS.Formatting.formatAccuracy(2, 3) === '67%');

      // State Authoritative Derived Stats calculation
      // Mock sessions of varying sizes:
      // Session 1: 5 questions (5 answered, 4 correct) -> 80%
      // Session 2: 10 questions (10 answered, 6 correct) -> 60%
      // Simple average of percentages would be (80 + 60) / 2 = 70%
      // Weighted accuracy must be (4 + 6) / (5 + 10) = 10 / 15 = 66.67% -> 67%
      const stateObj = CS.State;
      const testSummary1 = {
        id: 'test_1',
        totalQuestions: 5,
        correctCount: 4,
        incorrectCount: 1,
        skippedCount: 0,
        categoryBreakdown: { 'url_phishing': { correct: 4, total: 5 } }
      };
      const testSummary2 = {
        id: 'test_2',
        totalQuestions: 10,
        correctCount: 6,
        incorrectCount: 4,
        skippedCount: 0,
        categoryBreakdown: { 'otp_credentials': { correct: 6, total: 10 } }
      };

      stateObj.getData().sessions = [testSummary1, testSummary2];
      const stats = stateObj.getDerivedStats();
      assert('Calculates weighted overall accuracy correctly (67% instead of 70%)', stats.overallAccuracyPct === 67, `Computed: ${stats.overallAccuracyPct}%`);
      assert('Computes total answered correctly (15)', stats.totalAnswered === 15);
      assert('Computes total correct correctly (10)', stats.totalCorrect === 10);

      // Clean up mock sessions
      stateObj.getData().sessions = [];

      // ==========================================
      // Suite 8: Storage Schema Validation & Recovery
      // ==========================================
      const validStorageData = {
        schemaVersion: 1,
        preferences: { theme: 'light' },
        sessions: []
      };
      assert('Validates conforming storage schema', CS.Storage.validateSchema(validStorageData));

      const corruptStorageData = { invalid: true };
      assert('Rejects malformed storage schema', !CS.Storage.validateSchema(corruptStorageData));

      // ==========================================
      // Suite 9: Smart URL Auto-Fix & User Preferences
      // ==========================================
      const nakedDomainTest = CS.Validation.validateUrlInput('amazon-prime-renewal.com');
      assert('Detects naked domain without protocol', !nakedDomainTest.isValid && nakedDomainTest.canAutoFix);
      assert('Proposes correct HTTPS prefix for naked domain', nakedDomainTest.suggestedUrl === 'https://amazon-prime-renewal.com');

      const nakedDomainWithPath = CS.Validation.validateUrlInput('sbi-card.co.in/update?user=test');
      assert('Detects naked domain with path and query', !nakedDomainWithPath.isValid && nakedDomainWithPath.canAutoFix);
      assert('Proposes correct HTTPS URL with path preserved', nakedDomainWithPath.suggestedUrl === 'https://sbi-card.co.in/update?user=test');

      const invalidGibberish = CS.Validation.validateUrlInput('not a link at all');
      assert('Refuses auto-fix on arbitrary non-domain text', !invalidGibberish.isValid && !invalidGibberish.canAutoFix);

      // Sound preference testing
      stateObj.setPreference('soundEnabled', false);
      assert('Can toggle sound preference off', stateObj.getData().preferences.soundEnabled === false);
      stateObj.setPreference('soundEnabled', true);
      assert('Can toggle sound preference on', stateObj.getData().preferences.soundEnabled === true);

      // Icon system normalization testing
      const testIconHtml = CS.getIcon('shield');
      assert('Icon generator includes explicit width and height 18px', testIconHtml.includes('width="18"') && testIconHtml.includes('height="18"'));
      assert('Icon generator includes cs-icon class name', testIconHtml.includes('class="cs-icon"'));

      const testCustomClassIcon = CS.getIcon('alert-triangle', 'custom-test-cls');
      assert('Icon generator preserves custom classes alongside cs-icon', testCustomClassIcon.includes('cs-icon custom-test-cls'));

      // ==========================================
      // Suite 10: Performance & Ring-Buffer History Optimization
      // ==========================================
      for (let i = 0; i < 65; i++) {
        stateObj.recordSession({
          id: 'bench_sess_' + i,
          totalQuestions: 5,
          correctCount: 4,
          incorrectCount: 1,
          skippedCount: 0,
          categoryBreakdown: {}
        });
      }
      assert('Ring-buffer caps stored sessions to 50 items', stateObj.getData().sessions.length === 50, `Length: ${stateObj.getData().sessions.length}`);
      assert('Latest recorded session is preserved at head of ring buffer', stateObj.getData().sessions[0].id === 'bench_sess_64');
      // Clean up mock benchmark sessions
      stateObj.getData().sessions = [];

      // ==========================================
      // Suite 11: Dynamic Lesson Recommendations & Adaptive Guidance
      // ==========================================
      // Test 1: Default for new users without history
      assert('Recommends foundational lesson for new users with no history', stateObj.getSuggestedNextLesson() === 'lesson-phishing-fundamentals');

      // Test 2: User struggles with OTP credentials (0/3 correct)
      stateObj.getData().sessions = [{
        id: 'otp_struggle_sess',
        totalQuestions: 6,
        correctCount: 3,
        incorrectCount: 3,
        skippedCount: 0,
        categoryBreakdown: {
          'url_phishing': { correct: 3, total: 3 }, // 100%
          'otp_credentials': { correct: 0, total: 3 } // 0% (weakest)
        }
      }];
      assert('Recommends Passwords & OTP guide when user struggles with credentials', stateObj.getSuggestedNextLesson() === 'lesson-passwords-otp');

      // Test 3: User struggles with URL phishing
      stateObj.getData().sessions = [{
        id: 'url_struggle_sess',
        totalQuestions: 6,
        correctCount: 3,
        incorrectCount: 3,
        skippedCount: 0,
        categoryBreakdown: {
          'url_phishing': { correct: 1, total: 4 }, // 25% (weakest)
          'otp_credentials': { correct: 2, total: 2 } // 100%
        }
      }];
      assert('Recommends URL Inspection guide when user struggles with links', stateObj.getSuggestedNextLesson() === 'lesson-url-inspection');

      // Test 4: Lesson progress tracking
      const initialCompleted = stateObj.getDerivedStats().completedLessonsCount;
      stateObj.recordLessonCompleted('lesson-url-inspection');
      assert('Records lesson completion in persistent state', stateObj.getDerivedStats().completedLessonsCount === initialCompleted + 1);

      // Clean up
      stateObj.getData().sessions = [];
      delete stateObj.getData().lessonProgress['lesson-url-inspection'];

      const durationMs = Date.now() - startTime;
      const passedCount = testResults.filter(r => r.passed).length;
      const failedCount = testResults.filter(r => !r.passed).length;

      return {
        total: testResults.length,
        passed: passedCount,
        failed: failedCount,
        durationMs: durationMs,
        results: testResults
      };
    }
  };

  global.CyberShield.TestSuite = TestSuite;

  // Auto-run if executed in Node CLI
  if (isNode) {
    const report = TestSuite.runAll();
    console.log(`\n==============================================`);
    console.log(`CyberShield Acceptance Test Results`);
    console.log(`Passed: ${report.passed} / ${report.total} assertions (${report.durationMs}ms)`);
    console.log(`Failed: ${report.failed}`);
    console.log(`==============================================\n`);
    if (report.failed > 0) {
      process.exit(1);
    }
  }

})(typeof window !== 'undefined' ? window : global);
