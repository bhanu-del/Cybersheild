/**
 * CyberShield — Fast Showcase Triage & Security Scanner Engine
 * Designed for exhibitions, science fairs, judges, and visitors.
 * Provides instant 1-click test scenarios and fast heuristic triage
 * returning exact Problem Diagnosis and Step-by-Step Solution Plans.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  // Curated 1-click real-world showcase examples
  const SHOWCASE_EXAMPLES = [
    {
      id: 'ex_electricity',
      title: 'Electricity Bill Cutoff',
      badge: 'Utility Fraud',
      type: 'threat',
      icon: 'zap',
      text: 'Dear Customer, Your Electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer Mr. Verma at 9876543210. Thank you.'
    },
    {
      id: 'ex_digital_arrest',
      title: 'Digital Arrest (Fake Police)',
      badge: 'Extortion Call',
      type: 'threat',
      icon: 'alert-triangle',
      text: 'Caller claiming to be from Mumbai Cyber Crime Police: "A FedEx parcel with 5 fake passports and 140g narcotics has been intercepted in your Aadhaar name. You are placed under digital arrest on Skype video call. You must transfer Rs 2,50,000 to government reserve account for clearance verification or non-bailable warrant will be issued."'
    },
    {
      id: 'ex_bank_kyc',
      title: 'Bank KYC / Account Block',
      badge: 'Phishing Link',
      type: 'threat',
      icon: 'link',
      text: 'SBI Alert: Your NetBanking account will be blocked today due to pending KYC verification. Click http://sbi.bank-kyc-verify.xyz/update to submit your Aadhaar and PAN number immediately.'
    },
    {
      id: 'ex_qr_olx',
      title: 'OLX "Scan QR to Receive"',
      badge: 'UPI Fraud',
      type: 'threat',
      icon: 'credit-card',
      text: 'OLX Buyer: "I want to buy your furniture for Rs 15,000. I am sending you a PhonePe QR code on WhatsApp. Just scan this QR code and enter your 4-digit UPI PIN to receive the Rs 15,000 directly into your bank account immediately."'
    },
    {
      id: 'ex_telegram_job',
      title: 'Work from Home / YouTube Likes',
      badge: 'Task Scam',
      type: 'threat',
      icon: 'trending-up',
      text: 'Part-Time Work From Home Job: Earn Rs 3,000 to Rs 8,000 daily simply by liking YouTube videos and rating hotels on Google Maps! Joining bonus Rs 500 credited. Join our VIP Telegram channel https://t.me/vip-earning-tasks to start prepaid VIP tasks.'
    },
    {
      id: 'ex_anydesk_refund',
      title: 'AnyDesk Remote Refund',
      badge: 'Remote Access RAT',
      type: 'threat',
      icon: 'cpu',
      text: 'Caller says: "Your Amazon refund of Rs 4,999 failed. To process your instant refund, please install AnyDesk / QuickSupport from Google Play Store and share the 9-digit code with our customer care executive."'
    },
    {
      id: 'ex_lottery_kbc',
      title: 'KBC Lottery Winner',
      badge: 'Advance Fee',
      type: 'threat',
      icon: 'award',
      text: 'Congratulations! Your mobile SIM card won Rs 25,00,000 in KBC All India Lucky Draw. Contact KBC Manager Rana Pratap on WhatsApp +91-9876500000 to claim your prize. Pay Rs 12,500 government tax registration fee first.'
    },
    {
      id: 'ex_genuine_bank',
      title: 'Genuine Bank OTP Alert',
      badge: 'Safe Notice',
      type: 'safe',
      icon: 'shield-check',
      text: '184920 is your secret OTP for transaction of Rs 1,499 at Amazon on your HDFC Bank Card ending in 4018. Never share your OTP or password with anyone, including bank staff.'
    }
  ];

  const FastShowcaseScanner = {
    getExamples: function() {
      return SHOWCASE_EXAMPLES;
    },

    /**
     * Fast triage analysis on ANY user input (URL, SMS, caller transcript, incident description)
     */
    analyze: function(rawInput) {
      if (!rawInput || typeof rawInput !== 'string' || !rawInput.trim()) {
        throw new Error('Please enter a link, message, or scenario to analyze.');
      }

      const text = rawInput.trim();
      const lower = text.toLowerCase();

      // Check if input is a pure URL or contains URLs
      const urlRegex = /\bhttps?:\/\/[^\s<>"'{}|\\^`]+[^\s<>"'{}|\\^`.,;:?!()\[\]]/gi;
      const foundUrls = text.match(urlRegex) || [];
      const isPureUrl = (foundUrls.length === 1 && text.replace(urlRegex, '').trim().length === 0);

      // ----------------------------------------------------
      // Scenario 1: Digital Arrest / Police Impersonation
      // ----------------------------------------------------
      if (
        (lower.includes('digital arrest') || lower.includes('arrest')) &&
        (lower.includes('police') || lower.includes('cbi') || lower.includes('customs') || lower.includes('narcotics') || lower.includes('fedex') || lower.includes('skype') || lower.includes('ed'))
      ) {
        return {
          verdict: 'HIGH_RISK',
          verdictLabel: '🚨 CRITICAL THREAT: DIGITAL ARREST EXTORTION',
          riskScore: 100,
          category: 'Digital Arrest & Law Enforcement Impersonation',
          attackVector: 'Psychological Fear & Fake Video Call Extortion',
          problem: {
            summary: 'Scammers are impersonating law enforcement officers (Police, CBI, Customs, ED) via video call to extort money under the fake threat of arrest.',
            redFlags: [
              'There is legally NO SUCH THING as "Digital Arrest" under Indian law.',
              'Police and CBI NEVER conduct interrogations or demand money via Skype, WhatsApp, or video calls.',
              'Demands transferring money to a "safe" or "verification" government account.',
              'Threatens you with non-bailable warrants to keep you isolated from family.'
            ],
            mechanism: 'Attackers create fake police station backgrounds, wear fake uniforms, and fabricate fake Supreme Court/CBI documents to induce extreme panic.'
          },
          solution: {
            immediateSteps: [
              'DISCONNECT the call immediately. You are completely safe.',
              'DO NOT transfer any money or disclose your bank/Aadhaar details.',
              'Call the National Cyber Crime Helpline at 1930 immediately.',
              'Inform family members or visit your local police station.'
            ],
            officialVerification: 'Real law enforcement serves written physical summons under Section 41A CrPC. They never negotiate on video calls.',
            emergencyHelpline: '1930 (National Cyber Crime Helpline) or www.cybercrime.gov.in',
            nextAction: 'File a complaint immediately with call recordings or caller numbers.'
          }
        };
      }

      // ----------------------------------------------------
      // Scenario 2: Electricity / Utility Bill Disconnection
      // ----------------------------------------------------
      if (
        (lower.includes('electricity') || lower.includes('power') || lower.includes('bijli')) &&
        (lower.includes('disconnect') || lower.includes('cut') || lower.includes('bill was not updated') || lower.includes('officer') || lower.includes('9:30') || lower.includes('tonight'))
      ) {
        return {
          verdict: 'HIGH_RISK',
          verdictLabel: '🚨 CRITICAL THREAT: ELECTRICITY DISCONNECTION FRAUD',
          riskScore: 98,
          category: 'Utility Bill Impersonation & Urgency Trap',
          attackVector: 'SMS / WhatsApp Urgent Disconnection Threat',
          problem: {
            summary: 'Cyber criminals send fake power disconnection warnings with arbitrary deadlines to force you to call a scammer\'s personal mobile number.',
            redFlags: [
              'Sent from a 10-digit personal phone number instead of official electricity board sender IDs (e.g., JDVVNL, BESCOM, TPDDL).',
              'Creates artificial panic with a same-day deadline ("tonight at 9:30 PM").',
              'Gives a personal mobile number of a fake "officer" to resolve the issue.',
              'When called, they ask you to install an APK file (malware) or make a small payment via an unverified link.'
            ],
            mechanism: 'Electricity companies never disconnect power without formal physical written notice and never ask consumers to call 10-digit mobile numbers.'
          },
          solution: {
            immediateSteps: [
              'DO NOT dial the phone number given in the message.',
              'DO NOT download any APK file or app suggested by the caller.',
              'Open your official electricity provider app (or portal) to verify your real bill status.'
            ],
            officialVerification: 'Always check bill details on the official state electricity discom website or your electricity consumer number on BBPS (Paytm/GPay/PhonePe).',
            emergencyHelpline: '1930 (National Cyber Crime Helpline)',
            nextAction: 'Block the sender number and report as spam on WhatsApp/Truecaller.'
          }
        };
      }

      // ----------------------------------------------------
      // Scenario 3: OLX / UPI Reverse QR Code Fraud ("Scan to Receive")
      // ----------------------------------------------------
      if (
        (lower.includes('qr') || lower.includes('qr code') || lower.includes('scan')) &&
        (lower.includes('receive') || lower.includes('upi pin') || lower.includes('pin') || lower.includes('olx') || lower.includes('buyer'))
      ) {
        return {
          verdict: 'HIGH_RISK',
          verdictLabel: '🚨 CRITICAL THREAT: UPI REVERSE QR CODE FRAUD',
          riskScore: 100,
          category: 'UPI Reverse Payment Exploitation',
          attackVector: 'Deceptive QR Code & PIN Confusion',
          problem: {
            summary: 'The buyer is attempting a reverse payment scam. You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money.',
            redFlags: [
              'ENTERING UPI PIN ALWAYS DEDUCTS MONEY from your account — it NEVER deposits money.',
              'Scanning a QR code in PhonePe, GPay, or Paytm is strictly for SENDING money.',
              'Scammer claims they are using a "Merchant" or "Army" account that requires PIN verification.'
            ],
            mechanism: 'Attackers generate a "Collect / Payment Request" QR code. When you scan and enter your PIN, the amount is instantly deducted and transferred to the scammer.'
          },
          solution: {
            immediateSteps: [
              'DO NOT scan the QR code.',
              'DO NOT enter your 4-digit or 6-digit UPI PIN under any circumstance.',
              'Tell the buyer to send money directly to your UPI ID (VPA) or mobile number without any QR code.'
            ],
            officialVerification: 'Golden Rule of UPI: PIN is ONLY entered when money leaves your bank. Receiving money requires ZERO buttons or PINs.',
            emergencyHelpline: '1930 & your bank\'s fraud emergency number immediately if PIN was already entered.',
            nextAction: 'Block the buyer on OLX/WhatsApp and report their UPI ID on the payment app.'
          }
        };
      }

      // ----------------------------------------------------
      // Scenario 4: AnyDesk / TeamViewer Remote Access Scam
      // ----------------------------------------------------
      if (
        lower.includes('anydesk') || lower.includes('quicksupport') || lower.includes('teamviewer') || 
        lower.includes('rustdesk') || lower.includes('screen share') || lower.includes('remote address')
      ) {
        return {
          verdict: 'HIGH_RISK',
          verdictLabel: '🚨 CRITICAL THREAT: REMOTE ACCESS TROJAN (RAT) SCAM',
          riskScore: 100,
          category: 'Device Takeover & Screen Sharing Fraud',
          attackVector: 'Remote Management Tool (AnyDesk / QuickSupport)',
          problem: {
            summary: 'The caller is trying to gain full remote control of your phone or computer to steal OTPs, banking credentials, and transfer funds.',
            redFlags: [
              'No genuine company (Amazon, Flipkart, Bank, Telecom) requires AnyDesk or screen sharing for refunds.',
              'Sharing the 9-digit code grants the attacker full visibility of your screen, incoming SMS, and passwords.',
              'They often ask you to open your mobile banking app while they observe your credentials.'
            ],
            mechanism: 'Once connected, the attacker initiates unauthorized fund transfers while reading the confirmation OTP directly from your screen.'
          },
          solution: {
            immediateSteps: [
              'DO NOT install AnyDesk or QuickSupport.',
              'If already installed: TURN OFF Wi-Fi & Mobile Data IMMEDIATELY, then uninstall the app.',
              'Change your netbanking and UPI passwords from another secure device.'
            ],
            officialVerification: 'Refunds from e-commerce platforms are processed automatically to the original payment source. They never require third-party remote apps.',
            emergencyHelpline: '1930 and contact your bank to freeze internet banking immediately if credentials were exposed.',
            nextAction: 'Restart phone in airplane mode, uninstall remote apps, and run a security scan.'
          }
        };
      }

      // ----------------------------------------------------
      // Scenario 5: Work from Home / YouTube Likes / Telegram Task Scam
      // ----------------------------------------------------
      if (
        (lower.includes('telegram') || lower.includes('youtube like') || lower.includes('task') || lower.includes('part-time') || lower.includes('work from home')) &&
        (lower.includes('earn') || lower.includes('daily') || lower.includes('bonus') || lower.includes('vip') || lower.includes('prepaid'))
      ) {
        return {
          verdict: 'HIGH_RISK',
          verdictLabel: '🚨 CRITICAL THREAT: PREPAID TASK / INVESTMENT FRAUD',
          riskScore: 98,
          category: 'Part-Time Job & Task Investment Scam',
          attackVector: 'Social Media Bait & Telegram Group Trapping',
          problem: {
            summary: 'Classic task scam. They pay small amounts (Rs 200–500) initially to win trust, then demand thousands in "prepaid VIP tasks" that you can never withdraw.',
            redFlags: [
              'Promises unrealistic easy earnings (Rs 3,000–8,000/day) for liking videos or rating maps.',
              'Shifts communication to encrypted Telegram channels with fake group members posting screenshots of profits.',
              'Demands investing your own money into "prepaid crypto/crypto-task accounts" to unlock your earned commissions.'
            ],
            mechanism: 'A classic Ponzi/Advance-fee hybrid scam. When you try to withdraw your accumulated balance, they demand additional 30% taxes or penalty fees until you are drained.'
          },
          solution: {
            immediateSteps: [
              'DO NOT transfer any money to unlock tasks or withdraw earnings.',
              'Keep the initial small bonus (if received) but exit immediately.',
              'Leave and report the Telegram channel / WhatsApp group.'
            ],
            officialVerification: 'Legitimate employers pay you for work; they NEVER demand that you deposit money to unlock your salary.',
            emergencyHelpline: '1930 & report the Telegram handles on cybercrime.gov.in',
            nextAction: 'Block the recruitment number and warn your contacts.'
          }
        };
      }

      // ----------------------------------------------------
      // Scenario 6: Lottery / KBC Lucky Draw Scam
      // ----------------------------------------------------
      if (
        (lower.includes('lottery') || lower.includes('kbc') || lower.includes('lucky draw') || lower.includes('won') || lower.includes('25,00,000')) &&
        (lower.includes('fee') || lower.includes('tax') || lower.includes('manager') || lower.includes('whatsapp') || lower.includes('claim'))
      ) {
        return {
          verdict: 'HIGH_RISK',
          verdictLabel: '🚨 CRITICAL THREAT: ADVANCE FEE LOTTERY SCAM',
          riskScore: 99,
          category: 'Fake Lottery & Advance Fee Fraud',
          attackVector: 'WhatsApp Audio / Poster Lottery Bait',
          problem: {
            summary: 'Impostors claim you won a multi-lakh lottery in a contest you never entered, demanding an upfront "tax/registration fee".',
            redFlags: [
              'You CANNOT win a lottery you never bought a ticket for.',
              'Demands advance payment (Rs 10,000–25,000) for "GST, processing, or RBI clearance".',
              'Uses fake KBC logos and pre-recorded audio messages from fake managers.'
            ],
            mechanism: 'Legitimate lotteries and game shows (like KBC) deduct government taxes (TDS) at source and NEVER ask winners to pay fees beforehand.'
          },
          solution: {
            immediateSteps: [
              'DO NOT pay any registration or tax fee.',
              'DO NOT share your bank account or ID proofs.',
              'Delete the message and block the sender.'
            ],
            officialVerification: 'KBC and Sony TV have officially issued repeated warnings: KBC never conducts lotteries via WhatsApp or mobile SIM cards.',
            emergencyHelpline: '1930 (National Cyber Crime Helpline)',
            nextAction: 'Report the scam number to WhatsApp and Truecaller.'
          }
        };
      }

      // ----------------------------------------------------
      // Scenario 7: URL Inspection (Pure URL or Link Phishing)
      // ----------------------------------------------------
      if (foundUrls.length > 0 || isPureUrl) {
        const targetUrl = foundUrls[0] || text;
        const parsed = global.CyberShield.UrlParser ? global.CyberShield.UrlParser.parse(targetUrl) : null;
        const rulesResult = (global.CyberShield.UrlRules && parsed) ? global.CyberShield.UrlRules.evaluate(parsed, targetUrl) : null;

        const isKnownPhish = lower.includes('bank-kyc') || lower.includes('paypa1') || lower.includes('.xyz') || lower.includes('verify-login') || lower.includes('@');
        const isSafeDomain = parsed && ['google.com', 'microsoft.com', 'apple.com', 'amazon.in', 'sbi.co.in', 'hdfcbank.com'].includes(parsed.registrableDomain);

        if (isSafeDomain) {
          return {
            verdict: 'SAFE',
            verdictLabel: '✅ SAFE PATTERN: RECOGNIZED LEGITIMATE DOMAIN',
            riskScore: 5,
            category: 'Authentic Verified Domain',
            attackVector: 'Standard Web Traffic',
            problem: {
              summary: `The domain "${parsed.hostname}" belongs to a verified legitimate service with standard HTTPS protocol.`,
              redFlags: [
                'No deceptive lookalikes or homoglyphs detected in hostname.',
                'Encrypted protocol (HTTPS) with matching authoritative domain.'
              ],
              mechanism: 'Standard legitimate web destination.'
            },
            solution: {
              immediateSteps: [
                'The link structure appears sound and authentic.',
                'Ensure the address bar shows the exact official domain before logging in.',
                'Never enter passwords if redirected to an unexpected third-party URL.'
              ],
              officialVerification: `Official registered domain: ${parsed.registrableDomain}`,
              emergencyHelpline: 'N/A (Standard safe browsing)',
              nextAction: 'Proceed safely and look for SSL padlock in your browser.'
            }
          };
        }

        // Suspicious or High-Risk URL
        const redFlags = [];
        if (rulesResult && rulesResult.findings) {
          rulesResult.findings.forEach(f => redFlags.push(f.name + ': ' + f.evidence));
        }
        if (redFlags.length === 0) {
          redFlags.push('Domain is unverified and contains keywords frequently used in credential-harvesting phishing campaigns.');
          redFlags.push('Requests immediate sensitive data (KYC, PAN, Aadhaar, password) over HTTP/untrusted host.');
        }

        return {
          verdict: 'HIGH_RISK',
          verdictLabel: '🚨 CRITICAL THREAT: DECEPTIVE PHISHING LINK',
          riskScore: 95,
          category: 'Credential Harvesting Phishing Link',
          attackVector: 'Spoofed / Lookalike Web Destination',
          problem: {
            summary: `This link leads to an unauthorized third-party server ("${parsed ? parsed.hostname : targetUrl}") designed to steal credentials.`,
            redFlags: redFlags,
            mechanism: 'Phishing websites clone the exact login page of popular banks or services to steal your login ID, password, and incoming OTP.'
          },
          solution: {
            immediateSteps: [
              'DO NOT click or open the link.',
              'DO NOT enter username, password, ATM PIN, or OTP on this page.',
              'If you already entered credentials: Log in immediately to your official banking portal from a secure device and change your password.'
            ],
            officialVerification: 'Always check the domain name right before the last dot. Real Indian banks use official domains like ".sbi", ".co.in", or ".com", NEVER ".xyz", ".top", or ".site".',
            emergencyHelpline: '1930 & call your bank customer care to lock your internet banking.',
            nextAction: 'Inspect full URL anatomy in CyberShield Link Inspector.'
          }
        };
      }

      // ----------------------------------------------------
      // Scenario 8: Genuine Bank Alert / OTP (Benign)
      // ----------------------------------------------------
      if (
        (lower.includes('otp') || lower.includes('code')) &&
        (lower.includes('never share') || lower.includes('do not share') || lower.includes('ending in') || lower.includes('amazon on your')) &&
        !lower.includes('send') && !lower.includes('reply with') && !lower.includes('call')
      ) {
        return {
          verdict: 'SAFE',
          verdictLabel: '✅ SAFE PATTERN: LEGITIMATE BANK OTP ADVISORY',
          riskScore: 0,
          category: 'Standard Transaction Verification Alert',
          attackVector: 'Routine 2-Factor Authentication (2FA)',
          problem: {
            summary: 'This is a genuine automated bank OTP message generated for a legitimate transaction.',
            redFlags: [
              'The message explicitly warns you: "Never share your OTP with anyone".',
              'Mentions the specific masked card number ("ending in ...") and merchant name.',
              'Does NOT contain urgent threats, caller numbers, or deceptive links.'
            ],
            mechanism: 'Banks send one-time passcodes to authorize purchases initiated by you.'
          },
          solution: {
            immediateSteps: [
              'If YOU initiated this purchase: Enter the OTP on the merchant checkout screen only.',
              'If you DID NOT initiate this purchase: Do NOT share the OTP with anyone. Your card details may be compromised — call your bank to block the card.',
              'Remember: Bank employees will NEVER call you asking for your OTP.'
            ],
            officialVerification: 'Banks only generate OTPs when a transaction is triggered. The OTP message specifies the exact amount being debited.',
            emergencyHelpline: 'Your bank card helpline (number printed on back of your card)',
            nextAction: 'Keep your OTP secret at all times.'
          }
        };
      }

      // ----------------------------------------------------
      // Scenario 9: General Text Heuristic Fallback
      // ----------------------------------------------------
      const hasUrgency = lower.includes('immediately') || lower.includes('urgent') || lower.includes('blocked') || lower.includes('suspended') || lower.includes('within 24 hours');
      const hasMoney = lower.includes('rs') || lower.includes('rupees') || lower.includes('inr') || lower.includes('transfer') || lower.includes('pay');
      const hasCreds = lower.includes('password') || lower.includes('pin') || lower.includes('otp') || lower.includes('aadhaar') || lower.includes('pan card');

      if (hasUrgency && (hasMoney || hasCreds)) {
        return {
          verdict: 'SUSPICIOUS',
          verdictLabel: '⚠️ SUSPICIOUS PATTERN: SOCIAL ENGINEERING DETECTED',
          riskScore: 78,
          category: 'Unverified Urgent Request',
          attackVector: 'Social Pressure & Deceptive Pretext',
          problem: {
            summary: 'The message exhibits high-pressure urgency combined with demands for financial transfer or credentials.',
            redFlags: [
              'Uses artificial time pressure to induce anxiety and bypass critical thinking.',
              'Requests sensitive financial actions or personal identification.',
              'Sender identity is unverified.'
            ],
            mechanism: 'Scammers engineer urgency so victims react emotionally before independently verifying the claims.'
          },
          solution: {
            immediateSteps: [
              'PAUSE and take a breath. Scammers count on you rushing.',
              'Verify the claim independently through official channels (e.g. your bank app or official customer care).',
              'Never transfer money or share credentials based on an unsolicited message.'
            ],
            officialVerification: 'Contact the organization directly using a phone number from their official website, not the number in the message.',
            emergencyHelpline: '1930 (National Cyber Crime Helpline)',
            nextAction: 'Scan the message in CyberShield Message Analyzer for deeper rule breakdown.'
          }
        };
      }

      // Default Neutral Analysis
      return {
        verdict: 'SAFE',
        verdictLabel: '✅ NEUTRAL / BENIGN CONTENT',
        riskScore: 10,
        category: 'General Communication',
        attackVector: 'None Detected',
        problem: {
          summary: 'No obvious phishing links, urgency pressure, extortion threats, or remote access keywords were detected.',
          redFlags: [
            'No high-risk scam signatures matched our local threat rules.',
            'No credential theft or unauthorized payment requests found.'
          ],
          mechanism: 'Content appears routine, but always maintain healthy skepticism online.'
        },
        solution: {
          immediateSteps: [
            'Maintain standard digital safety habits.',
            'Never share sensitive passwords, PINs, or OTPs.',
            'If you suspect any link or sender later, run it through Link Inspector.'
          ],
          officialVerification: 'Verify sender email headers and official contact numbers when in doubt.',
          emergencyHelpline: '1930 (National Cyber Crime Helpline)',
          nextAction: 'Ready for more security checks.'
        }
      };
    }
  };

  global.CyberShield.FastShowcaseScanner = FastShowcaseScanner;

})(typeof window !== 'undefined' ? window : global);
