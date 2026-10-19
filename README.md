# CyberShield — Phishing & Scam Awareness Simulator

> **Digital safety, made understandable.**  
> A premium, beginner-friendly, offline-first web application designed to teach people how to identify deceptive messages, phishing links, fake job offers, and manipulative digital requests through interactive training and transparent local heuristics.

---

## 1. What CyberShield Does & Does Not Do

### What CyberShield Does:
- **Interactive Awareness Training**: 36 curated, realistic, fictional scenarios across 6 threat categories and 3 difficulty levels with immediate evidence-based feedback and Hinglish support.
- **Local URL Anatomy Deconstruction**: Dissects web addresses locally into schemes, subdomains, authoritative registrable domains, ports, and paths without ever visiting the destination.
- **Transparent Heuristic Rules**: Evaluates deceptive subdomains, raw IP addresses, user-info (`@`) delimiter tricks, Punycode IDN homographs, unencrypted HTTP, and URL shorteners.
- **Message Red-Flag Analysis**: Scans pasted text for social engineering patterns (OTP requests, artificial panic, fake lotteries/grants, executive impersonation, and unmonitored Telegram/WhatsApp shifts).
- **Authoritative Progress Metrics**: Calculates accurately weighted overall accuracy (`total_correct / total_answered * 100`), category-level mastery bars, and unlocks achievements.
- **Cyber Safety Learning Hub**: 7 core guides with interactive knowledge check quizzes and actionable checklists.
- **Exhibition Demo Mode**: High-contrast kiosk flow for school exhibitions with visitor session isolation and fullscreen presentation.
- **100% Offline & Private**: Zero external network tracking, zero third-party font/icon dependencies, and zero credentials collected.

### What CyberShield Does NOT Do:
- **Not an Antivirus or Security Suite**: CyberShield does not scan your computer hard drive, intercept operating system traffic, or replace Windows Security.
- **Not a Live Threat Intelligence Feed**: It does not query commercial zero-day reputation feeds or DNS blocklists.
- **No Automatic Link Visiting**: CyberShield **NEVER** opens, fetches, or crawls submitted URLs.
- **"No Obvious Warning Signs" != "Confirmed Safe"**: CyberShield is honest: if an address doesn't trigger common heuristic warning rules, it explicitly warns the user that sophisticated scammers frequently register brand new, clean-looking domains.

---

## 2. Project Directory Structure

```text
CyberShield/
├── index.html                  # Main application shell & entry point
├── manifest.json               # Progressive Web App manifest
├── sw.js                       # Offline caching Service Worker
├── README.md                   # Beginner guide & documentation
├── css/
│   ├── tokens.css              # Color tokens, typography, dark mode variables
│   ├── base.css                # CSS reset, accessibility focus rings, reduced-motion
│   ├── layout.css              # Fixed sidebar, sticky topbar, responsive containers
│   ├── components.css          # Metric cards, buttons, badges, modals, alerts, forms
│   ├── modules.css             # Module-specific styling (Arena, Link Inspector, Hub)
│   └── responsive.css          # Responsive rules for 1366x768, 1280x720, tablets & mobile
├── js/
│   ├── app.js                  # Central application bootstrapper & global event coordinator
│   ├── router.js               # Predictable hash-based client router with focus management
│   ├── state.js                # State management, derived metrics math, and pub/sub engine
│   ├── storage.js              # Versioned localStorage with validation & in-memory fallback
│   ├── validation.js           # Strict URL (4 KB) and Message (20 KB) input validators
│   ├── accessibility.js        # Screen reader announcements and modal focus trap
│   ├── modules/
│   │   ├── overview.js         # Command center dashboard with real user KPIs
│   │   ├── arena.js            # Awareness Arena gameplay, feedback, and scoring
│   │   ├── link-inspector.js   # Local URL deconstruction and rule evaluation
│   │   ├── message-analyzer.js # Message text highlighter and clue detector
│   │   ├── progress.js         # Progress Center, category breakdowns & achievements
│   │   ├── learning-hub.js     # 7 interactive guides with embedded quizzes
│   │   ├── demo-mode.js        # School exhibition kiosk with visitor session isolation
│   │   └── settings.js         # Theme toggle, language switch, diagnostics & reset
│   ├── engine/
│   │   ├── url-parser.js       # RFC-compliant URL anatomy parser with multi-part TLD logic
│   │   ├── url-rules.js        # Deterministic evaluator for URL heuristic catalog
│   │   ├── message-rules.js    # Regex pattern matcher for social engineering red flags
│   │   ├── result-schema.js    # Structured standard result schema
│   │   └── evidence-aggregator.js # Formulates findings, safe next steps, and limitations
│   └── utils/
│       ├── icons.js            # Crisp Lucide-style outline SVG icon library
│       ├── ids.js              # Accessible DOM & session ID generators
│       ├── formatting.js       # Weighted percentage, date, byte size & truncation helpers
│       └── safe-rendering.js   # HTML character entity escaping & DOM sanitization
├── data/
│   ├── scenarios.js            # 36 Curated training scenarios (EN + Hinglish)
│   ├── lessons.js              # 7 Complete interactive safety lessons with quizzes
│   └── rule-catalog.js         # Central rule catalog with explanations & limitations
├── assets/
│   └── icons/
│       ├── icon-192.svg        # PWA application icon (192px)
│       └── icon-512.svg        # PWA application icon (512px)
└── tests/
    ├── test-suite.js           # 50 Automated unit & integration assertions
    ├── test-runner.html        # Interactive in-browser visual test runner
    ├── test-plan.md            # Test architecture & quality gates
    ├── acceptance-tests.md     # Acceptance criteria verification table
    └── manual-test-checklist.md # Step-by-step review checklist for judges/teachers
```

---

## 3. How to Open and Run CyberShield on Windows

### Method 1: Using VS Code Live Server (Recommended)
1. Launch **Visual Studio Code**.
2. Go to **File -> Open Folder...** and select the `CyberShield` directory:
   `C:\Users\ASD\.gemini\antigravity\scratch\CyberShield`
3. If you have the popular **Live Server** extension installed in VS Code:
   - Right-click `index.html` in the Explorer sidebar.
   - Click **"Open with Live Server"**.
4. The application will immediately open in your default browser at `http://127.0.0.1:5500/index.html`.

### Method 2: Using Built-in Python Server (Zero Extensions Required)
1. In VS Code, open the integrated terminal (`Ctrl + \`` or **Terminal -> New Terminal**).
2. Run the following command:
   ```powershell
   python -m http.server 8080
   ```
3. Open your browser and navigate to:
   [http://localhost:8080](http://localhost:8080)

### Method 3: Direct Double-Click in Windows Explorer (`file://`)
- You can directly double-click `index.html` in Windows Explorer to open it in Google Chrome, Microsoft Edge, or Firefox.
- **Why CyberShield works seamlessly under `file://`**: All JavaScript is modularly namespaced under `window.CyberShield` with zero external dependencies. While Service Workers require a secure context (`http://localhost` or `https://`), CyberShield automatically detects the environment and operates gracefully without crashing or throwing errors.

---

## 4. How to Use the Modules

### 1. Overview Dashboard
- Visual command center showing your training metrics, quick launch tools, and recent session history.
- The **Suggested Next Lesson** card dynamically analyzes your weakest training category and points you to the recommended guide.

### 2. Awareness Arena
- Choose your **Difficulty** (Beginner, Intermediate, Advanced), **Question Count** (5, 10, or All), and **Category**.
- Face simulated messages with realistic fictional sender contexts and optional links.
- Select your answer and click **Submit Answer**:
  - Double submission is permanently locked to prevent accidental double-scoring.
  - Review the immediate evidence panel explaining why tempting choices are unsafe and what the safe real-world action is.
  - Complete the round to see your weighted score ring.

### 3. Link Inspector
- Type or paste any `http://` or `https://` address, or click one of the fictional sample buttons.
- Click **Inspect URL**:
  - The inspector breaks the address down into Scheme, Hostname, Subdomain, Authoritative Registrable Domain, Port, and Path.
  - Triggered rules are reported with exact evidence snippets and limitations.
  - Click **Copy Analysis Summary** to copy a clean text report.

### 4. Message Red-Flag Analyzer
- Paste an email, SMS, or chat message up to 20 KB (20,480 characters).
- Click **Analyze Message**:
  - Matches social engineering red flags like OTP cancellation tricks, artificial panic deadlines, and fake lottery windfalls.
  - Highlights matched phrases directly in the text display.
  - Automatically extracts any embedded web links as plain text with an **"Inspect in Link Inspector"** shortcut (never auto-opened).

### 5. Score & Progress Center
- View your total training rounds, questions answered, and **Weighted Accuracy**.
- Inspect category-level mastery bars to identify security blind spots.
- Track 6 unlockable milestone achievements (e.g., *Scam Spotter*, *Careful Verifier*, *Link Detective*).
- Click **Clear History** to open an accessible confirmation dialog and wipe stored records.

### 6. Cyber Safety Learning Hub
- 7 comprehensive interactive guides covering foundational security concepts.
- Click any lesson card to open the reader with learning objectives, checklists, and safe steps.
- Complete the embedded **Knowledge Check** quiz to test your comprehension and earn the green completion checkmark.

### 7. Exhibition Demo Mode
- Tailored for school exhibitions, science fairs, and kiosk displays.
- High-contrast, large touch-friendly buttons.
- Features a **3-Question Phishing Sprint**, **Live Link Demo**, and **Message Scanner Demo**.
- **Visitor Session Isolation**: Transient answers and scores are kept isolated in temporary memory. When a visitor finishes, clicking **"Next Visitor / Return to Kiosk"** resets the kiosk cleanly for the next student without losing personal saved history.
- Toggle **Fullscreen** mode for distraction-free exhibition presentations.

### 8. Settings, Privacy & Diagnostics
- Switch between **Light Theme** and high-contrast **Dark Theme**.
- Switch explanations between **English** and **Hinglish**.
- Enable **Reduce Motion** for accessible, reduced-animation navigation.
- Inspect the live **Diagnostics Matrix** verifying engine version, scenario counts, and local-only network transmission.

---

## 5. How to Run the Automated Tests

### In the Terminal (CLI):
In the project directory, run:
```powershell
node tests\test-suite.js
```
You will see all 50 unit and integration assertions execute in under 10 milliseconds:
```text
==============================================
CyberShield Acceptance Test Results
Passed: 50 / 50 assertions (6ms)
Failed: 0
==============================================
```

### In Your Web Browser:
Open `tests/test-runner.html` in your browser to view the interactive test runner with real-time green pass badges and timing benchmarks.

---

## 6. Offline Testing Verification
1. Open CyberShield in your web browser.
2. Open Developer Tools (press `F12` on Windows).
3. Switch to the **Network** tab and check the **"Offline"** checkbox (or disconnect your laptop from Wi-Fi).
4. Navigate through all modules, run Link Inspections, analyze messages, and play training rounds.
5. All assets, icons, logic, rules, and scenarios execute 100% locally.

---

## 7. License & Credits
Built for educational scam awareness, school exhibitions, and cyber defense training. All scenarios, names, and contact details are entirely fictional and simulated.
