# CyberShield — Test Plan & Quality Assurance Strategy

## 1. Overview
CyberShield is a client-side, offline-first web application designed to run on ordinary Windows laptops. Because it serves as both an educational simulator and a transparent heuristic URL/message inspector, thorough verification of logic, mathematical calculations, security boundaries, and accessibility is mandatory.

## 2. Test Architecture
The test strategy is organized into three tiers:

### Tier 1: Automated Unit & Rule Verification (`tests/test-suite.js`)
- **Execution**: Can be run headless in CLI via Node.js (`node tests/test-suite.js`) or visually in any web browser via `tests/test-runner.html`.
- **Scope**:
  - Scenario corpus integrity (36 scenarios, 4 choices, valid answer keys, evidence, explanations).
  - Lesson corpus integrity (7 guides with interactive knowledge checks).
  - URL Parser RFC compliance, subdomain vs registrable domain splitting, userinfo `@` delimiter, multi-part TLD parsing (`.co.uk`, `.edu.in`).
  - URL heuristic rule triggers (`URL_MISLEADING_DOMAIN`, `URL_USERINFO_DELIMITER`, `URL_IP_ADDRESS_HOST`, `URL_SHORTENER`, `URL_PUNYCODE_IDN`, `URL_HTTP_UNENCRYPTED`).
  - Message social engineering rules (OTP theft, artificial urgency threats, task scams, off-platform move to Telegram/WhatsApp, embedded URL extraction).
  - Benign text verification to prevent false-positive over-alerting.
  - Safe rendering & HTML entity escaping against XSS injection.
  - Weighted accuracy mathematical calculations (safeguard against simple averaging of uneven sessions, zero-division, and skipped question handling).
  - Storage schema validation and graceful error recovery.

### Tier 2: Interactive In-Browser Runner (`tests/test-runner.html`)
- Provides immediate visual status pills (green/red), microsecond execution timers, and assertion descriptions directly inside Google Chrome, Microsoft Edge, or Firefox.

### Tier 3: Manual Acceptance Checklist (`tests/manual-test-checklist.md`)
- Covers keyboard tab navigation, screen reader announcements (`aria-live`), window resizing down to 1280x720, and 200% browser zoom accommodations.

## 3. Quality Gate Thresholds
- **Zero Release Blockers**:
  - No uncaught exceptions on startup or module navigation.
  - No text-to-HTML injection (XSS vulnerability).
  - Double-clicking submission controls must never duplicate scores.
  - "No obvious warning signs" must never claim "verified safe".
  - Core functionality must run 100% locally without external internet requests.
