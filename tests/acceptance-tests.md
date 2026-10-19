# CyberShield — Acceptance Tests Matrix

This document maps all required acceptance criteria from the product specification to test implementations and real execution results.

| Requirement ID | Module / Feature | Acceptance Criterion | Test Method | Status |
| :--- | :--- | :--- | :--- | :--- |
| **AC-01** | Navigation | All 6 modules + Overview + Settings render predictably | Router test & Manual verification | **PASSED** |
| **AC-02** | URL Inspector | Empty URL strings and whitespace are rejected helpfully | `test-suite.js` (Suite 3) | **PASSED** |
| **AC-03** | URL Inspector | Non-HTTP schemes (`javascript:`, `data:`, `file:`) rejected | `test-suite.js` (Suite 3) | **PASSED** |
| **AC-04** | URL Inspector | Relative URLs without scheme rejected with clear instructions | `test-suite.js` (Suite 3) | **PASSED** |
| **AC-05** | URL Inspector | URLs over 4,096 characters (4 KB) rejected | `test-suite.js` (Suite 3) | **PASSED** |
| **AC-06** | URL Inspector | Deconstructs authoritative domain vs deceptive subdomain | `test-suite.js` (Suite 3 & 4) | **PASSED** |
| **AC-07** | URL Inspector | Detects userinfo `@` delimiter trick | `test-suite.js` (Suite 4) | **PASSED** |
| **AC-08** | URL Inspector | Detects raw IP address hostnames | `test-suite.js` (Suite 4) | **PASSED** |
| **AC-09** | URL Inspector | Detects known URL shorteners without navigating | `test-suite.js` (Suite 4) | **PASSED** |
| **AC-10** | URL Inspector | Detects Punycode IDN (`xn--`) domains | `test-suite.js` (Suite 4) | **PASSED** |
| **AC-11** | URL Inspector | Unflagged benign URLs do NOT claim "guaranteed safe" | `test-suite.js` (Suite 4) | **PASSED** |
| **AC-12** | Message Analyzer | Rejects empty text and text exceeding 20 KB (20,480 chars) | `test-suite.js` (Suite 5) | **PASSED** |
| **AC-13** | Message Analyzer | Detects direct OTP, PIN, password requests | `test-suite.js` (Suite 5) | **PASSED** |
| **AC-14** | Message Analyzer | Detects artificial urgency & account threats | `test-suite.js` (Suite 5) | **PASSED** |
| **AC-15** | Message Analyzer | Detects fake lottery, prize, and task scams | `test-suite.js` (Suite 5) | **PASSED** |
| **AC-16** | Message Analyzer | Detects off-platform communication pressure (WhatsApp/Telegram)| `test-suite.js` (Suite 5) | **PASSED** |
| **AC-17** | Message Analyzer | Benign messages do not produce false positive scam verdicts | `test-suite.js` (Suite 5) | **PASSED** |
| **AC-18** | Message Analyzer | Extracts embedded URLs safely without auto-opening | `test-suite.js` (Suite 5) | **PASSED** |
| **AC-19** | Awareness Arena | Double-clicking answer submission locked against double score | Unit & UI logic | **PASSED** |
| **AC-20** | Awareness Arena | Skipped questions recorded separately and excluded from accuracy | Unit & State calculations | **PASSED** |
| **AC-21** | Progress Center | Weighted overall accuracy calculation (`total_c / total_a * 100`) | `test-suite.js` (Suite 7) | **PASSED** |
| **AC-22** | Progress Center | Zero answers handled without division-by-zero crashes | `test-suite.js` (Suite 7) | **PASSED** |
| **AC-23** | Progress Center | Clear history modal genuinely clears stored records | UI Modal & Storage clear | **PASSED** |
| **AC-24** | Storage | Malformed or corrupt storage records recovered safely | `test-suite.js` (Suite 8) | **PASSED** |
| **AC-25** | Learning Hub | All 7 interactive lessons accessible offline with valid quizzes | `test-suite.js` (Suite 2) | **PASSED** |
| **AC-26** | Demo Mode | Kiosk session resets transient visitor inputs without losing user records | `demo-mode.js` state isolation | **PASSED** |
| **AC-27** | Security & XSS | Untrusted input escaped; no script execution via textContent | `test-suite.js` (Suite 6) | **PASSED** |
| **AC-28** | Offline Readiness | Service worker caches all assets; zero remote runtime deps | Manifest, SW, Local SVG | **PASSED** |
