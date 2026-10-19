# CyberShield — Manual Acceptance & School Exhibition Checklist

Follow this checklist when reviewing CyberShield on a Windows laptop in Visual Studio Code or preparing the kiosk for a school exhibition.

## Step 1: Launch Verification
- [ ] Open the folder `CyberShield` in Visual Studio Code.
- [ ] Start a static server:
  - Option A: Right-click `index.html` and click **"Open with Live Server"**.
  - Option B: In VS Code Terminal run `python -m http.server 8080` and open `http://localhost:8080`.
  - Option C: Double-click `index.html` directly in Windows Explorer.
- [ ] Confirm the application loads within ~1 second with the light-theme SaaS dashboard.
- [ ] Verify there are zero uncaught console errors in Developer Tools (press F12 -> Console).

## Step 2: Overview Dashboard Checks
- [ ] Confirm top KPI metric cards show initial empty state ("0 rounds", "— accuracy") for a new user.
- [ ] Click "Start Training Round" -> Confirm it opens the Awareness Arena setup.
- [ ] Click "Inspect a Link" -> Confirm it opens the Link Inspector.
- [ ] Click "Analyze a Message" -> Confirm it opens the Message Red-Flag Analyzer.

## Step 3: Awareness Arena End-to-End Simulation
- [ ] In Arena Setup, select **Beginner**, **5 Questions**, **All Categories**, and click **Start Training Round**.
- [ ] Verify the scenario display shows sender, message, and URL context (if present).
- [ ] Select an answer choice (A, B, C, or D). Verify the card highlights in blue.
- [ ] Click **Submit Answer**:
  - Verify choices are locked against double submission.
  - Verify immediate feedback appears explaining the evidence, why the choice was safe/unsafe, and the safe next step.
- [ ] Test the **Skip Question** button on a question -> Verify question skips without scoring it as correct.
- [ ] Complete all 5 questions -> Confirm the Round Summary card renders with your calculated percentage accuracy circle.
- [ ] Click **View Full Progress Center** -> Verify the session appears in the session table with date, score, and accuracy.

## Step 4: Link Inspector Heuristics
- [ ] Click the sample button **"Subdomain Trick"** (`http://paypal.com.account-update.invalid/login`):
  - Click **Inspect URL**.
  - Verify Authoritative Domain is identified as `account-update.invalid`.
  - Verify High Concern warning explains that `paypal.com` is just a deceitful subdomain.
- [ ] Click the sample button **"User-Info (@) Delimiter"**:
  - Verify `@` symbol trick is flagged as High Concern with explanation.
- [ ] Paste a non-HTTP address like `javascript:alert(1)`:
  - Verify the inspector rejects the scheme without executing anything.
- [ ] Click **"Benign Doc Link"**:
  - Verify zero warning rules trigger and the banner says *"No obvious warning signs"*.
  - Verify the disclaimer explicitly states this does not guarantee 100% safety.
- [ ] Click **Copy Analysis Summary** -> Verify clipboard receives plain-text summary.

## Step 5: Message Red-Flag Analyzer
- [ ] Click sample **"Bank OTP Cancellation Scam"**:
  - Click **Analyze Message**.
  - Verify phrases like `OTP code`, `cancel`, and `within 10 minutes` are highlighted in the text view.
  - Verify evidence cards explain why banks never ask for OTPs to cancel a charge.
- [ ] Click sample **"Benign Urgent Meeting"**:
  - Verify no warning flags are triggered.
- [ ] Paste a message containing a URL -> Verify the link is extracted as plain text with an *"Inspect in Link Inspector"* button (never auto-opened).

## Step 6: Cyber Safety Learning Hub
- [ ] Browse all 7 guide cards.
- [ ] Click on **"Phishing Fundamentals"**:
  - Confirm reader modal opens with learning objective, explanation, fictional example, and clues.
  - Take the interactive Knowledge Check quiz -> Confirm instant correct/incorrect feedback.
  - Close the modal -> Confirm the lesson card displays a green **"Completed"** checkmark badge.

## Step 7: Exhibition Demo Mode (Kiosk)
- [ ] Navigate to **Demo Mode**:
  - Click **Track 1: 3-Question Phishing Sprint**.
  - Answer all 3 quick scenarios -> Confirm sprint score is presented.
  - Click **"Next Visitor / Return to Kiosk"** -> Confirm all visitor inputs and sprint score are wiped clean for the next person!
- [ ] Click the **Fullscreen** button in the kiosk banner -> Verify fullscreen request activates with fallback.

## Step 8: Settings, Privacy & Reset Verification
- [ ] Toggle **Dark Theme** on and off -> Verify clean, high-contrast palette transition.
- [ ] Toggle **Hinglish** language -> Verify explanations switch to Hindi-English conversational blend.
- [ ] Click **Clear History**:
  - Confirm confirmation modal appears warning that data will be wiped.
  - Click **"Yes, Clear All Data"** -> Confirm session log, KPI accuracy, and unlocked achievements reset to empty defaults.

## Step 9: Offline Operation Test
- [ ] Disconnect laptop Wi-Fi or set Network to **"Offline"** in Browser DevTools.
- [ ] Refresh the page -> Confirm the entire application, modules, lessons, and analysis engines run smoothly offline without errors.
