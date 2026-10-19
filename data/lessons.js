/**
 * CyberShield — Cyber Safety Learning Hub Lessons (v2.0.0)
 * 7 Interactive, comprehensive lessons with clear objectives, checklists,
 * realistic examples, Hinglish versions, and expanded multi-MCQ knowledge checks (6-8 questions per topic).
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const LESSONS = [
    {
      id: 'lesson-phishing-fundamentals',
      title: 'Phishing Fundamentals: How Scams Work',
      titleHinglish: 'Phishing Basics: Scams Kaise Kaam Karte Hain',
      readTime: '4 min read',
      icon: 'shield-alert',
      category: 'Fundamentals',
      objective: 'Understand how social engineering manipulates emotions and recognize the primary stages of a phishing attack.',
      objectiveHinglish: 'Samjhein ki kaise social engineering darr aur lalach ka use karke logo ko phasati hai.',
      summary: 'Learn why psychological pressure is more dangerous than technical bugs, and how to spot manufactured urgency.',
      content: {
        intro: 'Phishing is the attempt to deceive you into revealing sensitive information, passwords, or money by pretending to be a trustworthy person, brand, or institution.',
        introHinglish: 'Phishing ek aisi trick hai jisme scammers kisi bharosemand company ya insaan ka roop dhar kar aapka password, OTP ya paise churate hain.',
        keyConcept: 'Social Engineering is the art of manipulating human behavior rather than breaking computer code. Attackers rarely "hack" systems when they can simply trick a human into handing over the keys.',
        keyConceptHinglish: 'Hacker system hack karne se pehle insaan ko fool banane ki koshish karte hain, kyunki insaan se galti karwana aasan hota hai.',
        fictionalExample: 'You receive an urgent text: "Your bank account has been locked. Click here within 15 minutes to unlock it." The fear of losing account access makes you act before checking if the sender is real.',
        clues: [
          'High emotional pressure: Panic, extreme urgency, or artificial countdown timers.',
          'Unsolicited contact: You did not initiate the conversation or request the service.',
          'Call to action: Demanding that you click a link, download an attachment, or send money.',
          'Mismatched sender address: The display name says "Bank", but the email address is completely different.'
        ],
        safeSteps: [
          'Pause immediately whenever a message makes you feel rushed, terrified, or greedy.',
          'Never use contact details provided inside the suspicious message itself.',
          'Verify the message independently through an official app or known bookmark.'
        ]
      },
      knowledgeChecks: [
        {
          id: 'q1',
          question: 'Why do scammers frequently include extreme deadlines like "within 30 minutes" in their messages?',
          choices: [
            { id: 'A', text: 'Because bank servers automatically shut down after 30 minutes.' },
            { id: 'B', text: 'To induce panic and prevent you from pausing to think or verify the claims.' },
            { id: 'C', text: 'Because internet regulations require all security alerts to be fast.' },
            { id: 'D', text: 'To help you save time in your daily schedule.' }
          ],
          correctId: 'B',
          explanation: 'Scammers manufacture artificial urgency precisely so emotional panic overrides rational critical thinking. Pausing is your greatest defense.'
        },
        {
          id: 'q2',
          question: 'What distinguishes "Spear Phishing" from generic mass phishing campaigns?',
          choices: [
            { id: 'A', text: 'Spear phishing is sent only on mobile SMS text messages.' },
            { id: 'B', text: 'Spear phishing uses personalized details about your workplace, name, or role to seem credible.' },
            { id: 'C', text: 'Spear phishing is conducted strictly by foreign governments.' },
            { id: 'D', text: 'Spear phishing never uses email links.' }
          ],
          correctId: 'B',
          explanation: 'Spear phishing targets specific individuals using researched personal or professional details (job title, colleagues, recent projects) to construct a convincing pretext.'
        },
        {
          id: 'q3',
          question: 'If an email claiming to be from your primary bank addresses you as "Dear Customer" instead of your actual registered name, what does this suggest?',
          choices: [
            { id: 'A', text: 'The bank is protecting your privacy by omitting your name.' },
            { id: 'B', text: 'The email is likely an automated mass broadcast blast sent by scammers who do not know your identity.' },
            { id: 'C', text: 'The email was typed by a junior teller.' },
            { id: 'D', text: 'Your bank account has been elevated to VIP status.' }
          ],
          correctId: 'B',
          explanation: 'Legitimate banks address customers by their real registered names in formal security alerts. Generic salutations are a hallmark of bulk phishing spam.'
        },
        {
          id: 'q4',
          question: 'What is the underlying principle behind "Social Engineering"?',
          choices: [
            { id: 'A', text: 'Writing software code to brute-force encrypted databases.' },
            { id: 'B', text: 'Manipulating human psychology, fear, trust, or greed to bypass security measures.' },
            { id: 'C', text: 'Installing hardware cables inside telecommunications towers.' },
            { id: 'D', text: 'Studying social science in universities.' }
          ],
          correctId: 'B',
          explanation: 'Social engineering targets the human element. It is often far easier to trick an authorized user into revealing credentials than to break complex mathematical cryptography.'
        },
        {
          id: 'q5',
          question: 'What does the term "Smishing" specifically refer to?',
          choices: [
            { id: 'A', text: 'Phishing attacks delivered through Short Message Service (SMS) text messages.' },
            { id: 'B', text: 'Phishing attacks conducted over satellite radio.' },
            { id: 'C', text: 'Phishing attacks targeting smartphone cameras.' },
            { id: 'D', text: 'Spamming on multiplayer gaming servers.' }
          ],
          correctId: 'A',
          explanation: 'Smishing is the combination of "SMS" and "phishing", where attackers use deceptive text messages containing malicious links or phone numbers.'
        },
        {
          id: 'q6',
          question: 'Why can clicking the "Unsubscribe" button in an unsolicited scam email be risky?',
          choices: [
            { id: 'A', text: 'It automatically reformats your hard drive.' },
            { id: 'B', text: 'It confirms to the scammer that your email address is active and regularly monitored by a real person.' },
            { id: 'C', text: 'It deletes your browser history.' },
            { id: 'D', text: 'It disconnects your Wi-Fi router permanently.' }
          ],
          correctId: 'B',
          explanation: 'In illegitimate scam emails, the "unsubscribe" link often leads to a tracking beacon or credential-harvesting page, signaling to the attacker that your inbox is active and receptive.'
        },
        {
          id: 'q7',
          question: 'What is the most effective immediate action when receiving a message that makes you feel extreme panic or anxiety?',
          choices: [
            { id: 'A', text: 'Click the link immediately to resolve the issue as fast as possible.' },
            { id: 'B', text: 'Take a deliberate 60-second pause to breathe and analyze the message structure critically.' },
            { id: 'C', text: 'Forward the message to all your contacts to see if they got it.' },
            { id: 'D', text: 'Transfer a small amount of money to test if the account is real.' }
          ],
          correctId: 'B',
          explanation: 'The "Pause on Panic" rule disrupts the attacker\'s psychological manipulation. Pausing allows your rational executive brain to evaluate red flags.'
        }
      ]
    },
    {
      id: 'lesson-url-inspection',
      title: 'Inspecting URLs: Hostnames, Subdomains & Schemes',
      titleHinglish: 'URL Inspection: Asli Domain aur Fake Link Kaise Pehchane',
      readTime: '4 min read',
      icon: 'link',
      category: 'Technical',
      objective: 'Learn how to dissect any web address and identify the true authoritative domain before clicking.',
      objectiveHinglish: 'Sikhein ki kisi bhi link ko tod kar asli website aur fake subdomain ka farak kaise dekha jata hai.',
      summary: 'Master the anatomy of URLs: scheme, subdomain, registrable domain, path, and deceptive user-info tricks.',
      content: {
        intro: 'A URL (Uniform Resource Locator) is the street address of the internet. To inspect a URL, you must look at its structure from right to left in the hostname.',
        introHinglish: 'URL internet ka address hota hai. Kisi bhi link ko samajhne ke liye uske hostname ko dhyan se dekhna zaroori hota hai.',
        keyConcept: 'In "https://paypal.com.account-update.xyz/login", the domain is NOT PayPal! The real authoritative domain is "account-update.xyz". "paypal.com" is just a deceitful subdomain created by the attacker.',
        keyConceptHinglish: '"paypal.com.account-update.xyz" mein asli domain "account-update.xyz" hai, PayPal nahi! Scammer ne sirf dhokha dene ke liye aage paypal ka naam joda hai.',
        fictionalExample: 'An attacker buys "login-secure-portal.click" and creates a subdomain "chase.com.login-secure-portal.click". Victims glance quickly, see "chase.com", and enter their credentials.',
        clues: [
          'Read from the first single "/" backwards to the final dot to find the true domain.',
          'Beware of the "@" symbol: in "google.com@evil.com", you are connecting to "evil.com".',
          'Check for raw IP addresses like "http://192.168.1.1/login" instead of brand names.',
          'Watch for lookalike characters or Punycode (e.g. "xn--pple-43d.com").'
        ],
        safeSteps: [
          'Use CyberShield\'s local Link Inspector to examine unfamiliar links before opening them.',
          'Bookmark your most important websites (banking, email, government) and always use your bookmarks.',
          'Type the core domain manually in the browser address bar rather than clicking links in messages.'
        ]
      },
      knowledgeChecks: [
        {
          id: 'q1',
          question: 'Where will your browser connect if you click: "https://secure.mybank.com.verify-login.invalid/auth"?',
          choices: [
            { id: 'A', text: 'To "mybank.com" because it appears first in the address.' },
            { id: 'B', text: 'To "verify-login.invalid" because that is the authoritative registrable domain.' },
            { id: 'C', text: 'To both websites at the same time.' },
            { id: 'D', text: 'To Google search.' }
          ],
          correctId: 'B',
          explanation: 'The browser connects to the domain directly preceding the final TLD (".invalid"). Here, "secure.mybank.com" is merely an attacker-created subdomain on "verify-login.invalid".'
        },
        {
          id: 'q2',
          question: 'What does the presence of "https://" primarily signify about a website?',
          choices: [
            { id: 'A', text: 'The website owner is an honest, verified legal business.' },
            { id: 'B', text: 'The data transmission between your browser and the web server is encrypted.' },
            { id: 'C', text: 'The website has zero viruses or scam pages.' },
            { id: 'D', text: 'The website is officially approved by the government.' }
          ],
          correctId: 'B',
          explanation: 'HTTPS encrypts data in transit. It does NOT guarantee that the server owner is honest. Attackers routinely secure free SSL certificates for phishing sites.'
        },
        {
          id: 'q3',
          question: 'In the address "https://google.com@attacker-site.com/login", where will the browser actually navigate?',
          choices: [
            { id: 'A', text: 'To "google.com".' },
            { id: 'B', text: 'To "attacker-site.com" because text before "@" is treated as user-info credentials.' },
            { id: 'C', text: 'It will open both sites in split-screen.' },
            { id: 'D', text: 'It will open your local email client.' }
          ],
          correctId: 'B',
          explanation: 'According to URL standards (RFC 3986), any text before the "@" symbol is interpreted as authentication user-info. The actual destination host is whatever follows the "@".'
        },
        {
          id: 'q4',
          question: 'What is a "Punycode" or Internationalized Domain Name (IDN) homograph attack?',
          choices: [
            { id: 'A', text: 'Using lookalike Cyrillic or Greek characters (e.g. Cyrillic "а" instead of Latin "a") to spoof brand domains.' },
            { id: 'B', text: 'Attacking punch-card mainframe computers.' },
            { id: 'C', text: 'Sending phishing messages written in poetry.' },
            { id: 'D', text: 'Using very short 3-letter domain names.' }
          ],
          correctId: 'A',
          explanation: 'Homograph attacks substitute visually identical glyphs from other alphabets. In the browser, "xn--pple-43d.com" may render as "apple.com", tricking unsuspecting visitors.'
        },
        {
          id: 'q5',
          question: 'If a link in an SMS uses a raw IP address like "http://192.0.2.14/sbi/login", what should you deduce?',
          choices: [
            { id: 'A', text: 'It is a legitimate high-speed direct server bypass link.' },
            { id: 'B', text: 'It is almost certainly malicious, as reputable commercial banks never use naked IP addresses for public portals.' },
            { id: 'C', text: 'It means your local Wi-Fi router is updating.' },
            { id: 'D', text: 'It is an internal testing link that is safe to use.' }
          ],
          correctId: 'B',
          explanation: 'Real banks and organizations always operate on branded, registered domain names with enterprise SSL certificates. Naked IP links in messages are virtually always malicious.'
        },
        {
          id: 'q6',
          question: 'Why do scammers frequently shorten URLs using services like bit.ly or tinyurl in SMS alerts?',
          choices: [
            { id: 'A', text: 'To conceal the real suspicious destination domain and bypass simple spam keyword filters.' },
            { id: 'B', text: 'Because long links break the internet.' },
            { id: 'C', text: 'Because phone carriers charge by the character length of links.' },
            { id: 'D', text: 'To make the links download faster on 4G networks.' }
          ],
          correctId: 'A',
          explanation: 'URL shorteners hide the final destination hostname, making it impossible for a user to inspect the true domain without expanding the link or using an inspection tool.'
        },
        {
          id: 'q7',
          question: 'In the domain "login.amazon.co.uk.secure-service.click", what is the true authoritative domain?',
          choices: [
            { id: 'A', text: 'amazon.co.uk' },
            { id: 'B', text: 'secure-service.click' },
            { id: 'C', text: 'login.amazon' },
            { id: 'D', text: 'co.uk' }
          ],
          correctId: 'B',
          explanation: 'Reading right-to-left from the TLD (".click"), the root domain is "secure-service.click". All preceding labels (including "login.amazon.co.uk") are arbitrary subdomains controlled by the owner of "secure-service.click".'
        }
      ]
    },
    {
      id: 'lesson-passwords-otp',
      title: 'Passwords, PINs & One-Time Passwords (OTP)',
      titleHinglish: 'Password, PIN aur OTP Ki Suraksha',
      readTime: '3 min read',
      icon: 'lock',
      category: 'Credentials',
      objective: 'Understand why OTPs are authorization keys and recognize classic social engineering tricks used to steal them.',
      objectiveHinglish: 'Samjhein ki OTP transaction approve karne ki chaabi hai aur ise kabhi share nahi karna chahiye.',
      summary: 'Why legitimate banks never ask for your OTP over phone or chat, and how two-factor takeover attacks operate.',
      content: {
        intro: 'A One-Time Password (OTP) or verification code is a temporary key sent to your mobile or authenticator app to authorize a specific transaction or login.',
        introHinglish: 'OTP ek temporary code hota hai jo transaction ya login ko approve karne ke liye aapke phone par aata hai.',
        keyConcept: 'OTPs are for AUTHORIZING transactions, not canceling them! When a scammer says "share the OTP so I can cancel a fraud charge", they are actually using your OTP to approve the fraud charge.',
        keyConceptHinglish: 'OTP ka matlab "Approve" hota hai. Agar koi bole ki "OTP do taaki galat payment cancel kar saku", toh woh jhooth bol raha hai. OTP dete hi paise kat jayenge.',
        fictionalExample: 'A caller claiming to be your bank manager says: "Someone tried to withdraw $500. I have blocked it, but to confirm cancellation, read me the 6-digit code on your SMS."',
        clues: [
          'Anyone asking you to read, forward, or type an OTP into an unverified form.',
          'Callers claiming to be bank security who already "know" your name and card number.',
          'Requests to install screen-sharing apps (AnyDesk, TeamViewer, QuickSupport) to "help" you.'
        ],
        safeSteps: [
          'NEVER share an OTP, PIN, password, or card CVV with ANYONE over phone, SMS, or chat.',
          'If you receive an unexpected OTP, someone has your password! Change your password immediately.',
          'Enable app-based 2FA (like Google Authenticator) instead of SMS where possible.'
        ]
      },
      knowledgeChecks: [
        {
          id: 'q1',
          question: 'A customer support representative asks you to read the 6-digit OTP code sent to your phone. What should you do?',
          choices: [
            { id: 'A', text: 'Read the code if they sound polite and professional.' },
            { id: 'B', text: 'Refuse to share the code and hang up. Legitimate support staff will never ask for your OTP.' },
            { id: 'C', text: 'Give them the code, but change your PIN afterwards.' },
            { id: 'D', text: 'Send the code via email instead of speaking it.' }
          ],
          correctId: 'B',
          explanation: 'No authentic bank or technology company will ever ask you to disclose your OTP. It is strictly for your personal entry into verified systems.'
        },
        {
          id: 'q2',
          question: 'A caller claims an unauthorized debit of ₹15,000 is pending on your card and says: "Tell me the cancellation code on your SMS to reverse it." What is happening?',
          choices: [
            { id: 'A', text: 'The caller is genuinely reversing your charge.' },
            { id: 'B', text: 'The caller has your card details and needs your OTP to complete and authorize the fraudulent charge.' },
            { id: 'C', text: 'The bank\'s automated firewall requires spoken verification.' },
            { id: 'D', text: 'It is a routine security check mandated by the RBI.' }
          ],
          correctId: 'B',
          explanation: 'OTPs only APPROVE transactions, they never cancel them. Giving the code authorizes the scammer to complete their fraudulent purchase.'
        },
        {
          id: 'q3',
          question: 'What is "Credential Stuffing"?',
          choices: [
            { id: 'A', text: 'Hiding passwords inside text files.' },
            { id: 'B', text: 'Automated attacks where leaked passwords from one breached website are tested across hundreds of other sites.' },
            { id: 'C', text: 'Writing passwords on sticky notes attached to monitors.' },
            { id: 'D', text: 'Guessing passwords based on family birthdays.' }
          ],
          correctId: 'B',
          explanation: 'Credential stuffing works because millions reuse identical passwords across services. If a gaming site leaks your password, bots immediately test it on Amazon, PayPal, and Gmail.'
        },
        {
          id: 'q4',
          question: 'You receive an unexpected SMS OTP for your Google or banking account without doing anything. What does this mean?',
          choices: [
            { id: 'A', text: 'It is a routine network test by your telecom operator.' },
            { id: 'B', text: 'Someone has your correct password and attempted to log in, but was stopped by 2-Factor Authentication.' },
            { id: 'C', text: 'Your phone has a virus that needs battery replacement.' },
            { id: 'D', text: 'You won a lottery.' }
          ],
          correctId: 'B',
          explanation: 'An unsolicited OTP means the attacker successfully entered your username and password, triggering the second factor. You should change that password immediately.'
        },
        {
          id: 'q5',
          question: 'Why are authenticator apps (e.g. Google Authenticator) or hardware keys (FIDO) safer than SMS-based OTPs?',
          choices: [
            { id: 'A', text: 'They work without cellular network and are immune to SIM swap and SMS interception attacks.' },
            { id: 'B', text: 'They automatically pay your monthly phone bill.' },
            { id: 'C', text: 'They make your smartphone battery charge faster.' },
            { id: 'D', text: 'They are legally required by the United Nations.' }
          ],
          correctId: 'A',
          explanation: 'SMS OTPs can be intercepted via SIM swapping or SS7 cellular vulnerabilities. Authenticator apps generate codes locally on your device without cellular transmission.'
        },
        {
          id: 'q6',
          question: 'A "bank official" instructs you to install "AnyDesk" or "TeamViewer QuickSupport" on your phone to fix an OTP delivery glitch. What is their real goal?',
          choices: [
            { id: 'A', text: 'To update your phone\'s 5G modem firmware.' },
            { id: 'B', text: 'To view your screen remotely and steal your passwords, banking credentials, and OTPs as they appear.' },
            { id: 'C', text: 'To save your mobile data consumption.' },
            { id: 'D', text: 'To run a diagnostic speed test.' }
          ],
          correctId: 'B',
          explanation: 'Remote access software allows the attacker to view everything displayed on your screen, including incoming private SMS messages and credentials.'
        },
        {
          id: 'q7',
          question: 'What is the most secure strategy for managing passwords across your dozens of online accounts?',
          choices: [
            { id: 'A', text: 'Use one single complex password with your name and @123 across all accounts.' },
            { id: 'B', text: 'Use a trusted password manager to generate and store long, unique, random passwords for every website.' },
            { id: 'C', text: 'Store passwords in a draft email in your mailbox.' },
            { id: 'D', text: 'Change your password every 3 days to sequential numbers.' }
          ],
          correctId: 'B',
          explanation: 'A password manager ensures that a data breach at one company never compromises any of your other online accounts, because every single password is completely unique.'
        }
      ]
    },
    {
      id: 'lesson-fake-offers',
      title: 'Fake Offers, Lotteries, Jobs & Unusual Payments',
      titleHinglish: 'Fake Offers, Lottery, Job Scams aur UPI Frauds',
      readTime: '3 min read',
      icon: 'award',
      category: 'Financial',
      objective: 'Identify advance-fee fraud, task scams, remote job traps, and payment manipulation.',
      objectiveHinglish: 'Advance-fee scams aur task/job fraud ke patterns ko pehchanein.',
      summary: 'Why you cannot win a lottery you never entered, and why genuine employers never demand payments in gift cards.',
      content: {
        intro: 'Scammers exploit hope, financial ambition, and curiosity by advertising unrealistic windfalls, effortless remote jobs, or unexpected government grants.',
        introHinglish: 'Scammers aamtaur par aasan paise, fake lottery ya bina interview wali jobs ka lalach dekar logo ko phasate hain.',
        keyConcept: 'The golden rule of online safety: If an offer looks too good to be true, it is almost certainly a scam. You cannot win a competition you never entered.',
        keyConceptHinglish: 'Internet ka golden rule: Jo cheez zarurat se zyada achi lage, woh 99% fraud hoti hai. Jis lottery ki ticket nahi li, use jeet nahi sakte.',
        fictionalExample: 'A message offers $400/day for "liking YouTube videos" or "rating hotel apps", but asks for a $50 "deposit to activate your VIP worker account".',
        clues: [
          'Unrealistic earnings for trivial tasks (e.g. $500/day for 1 hour of tapping buttons).',
          'Demands for upfront "registration fees", "taxes", or "customs clearances".',
          'Payment requests via non-reversible methods: Gift cards (Apple/Steam), Crypto, or wire transfer.',
          'Moving you immediately to unmonitored messaging apps like Telegram or WhatsApp.'
        ],
        safeSteps: [
          'Never pay money in order to receive money or get a job.',
          'Research job offers on the official career page of the hiring company.',
          'Report unsolicited lottery and prize notifications as spam.'
        ]
      },
      knowledgeChecks: [
        {
          id: 'q1',
          question: 'You receive a text stating you won a ₹1,00,000 lottery from Kaun Banega Crorepati (KBC), but need to pay ₹2,500 registration tax. What is this?',
          choices: [
            { id: 'A', text: 'A great opportunity because ₹1,00,000 is much more than ₹2,500.' },
            { id: 'B', text: 'A classic advance-fee scam designed to steal your ₹2,500 and banking details.' },
            { id: 'C', text: 'A genuine tax mandate under the Income Tax Act.' },
            { id: 'D', text: 'An official broadcast approved by Sony Entertainment.' }
          ],
          correctId: 'B',
          explanation: 'This is textbook advance-fee fraud. Legitimate lotteries deduct tax at source (TDS) from winnings; they NEVER ask winners to pay upfront fees.'
        },
        {
          id: 'q2',
          question: 'In the classic OLX QR Code scam, what actually happens when you scan a QR code and enter your UPI PIN to "receive payment"?',
          choices: [
            { id: 'A', text: 'Money is deposited into your bank account immediately.' },
            { id: 'B', text: 'Money is debited from your bank account and sent to the scammer.' },
            { id: 'C', text: 'The UPI server cancels the payment request.' },
            { id: 'D', text: 'Your phone updates its banking credentials.' }
          ],
          correctId: 'B',
          explanation: 'Entering your UPI PIN ALWAYS authorizes a debit (payment out) of your account. You NEVER enter a PIN to receive money on UPI.'
        },
        {
          id: 'q3',
          question: 'A Telegram work-from-home job offers ₹5,000 daily for liking 10 YouTube videos, but requires a ₹3,000 "merchant task deposit". What should you do?',
          choices: [
            { id: 'A', text: 'Deposit the money immediately to unlock the higher payout tier.' },
            { id: 'B', text: 'Refuse and block the contact; legitimate companies never charge employees to work.' },
            { id: 'C', text: 'Ask if you can pay with cryptocurrency.' },
            { id: 'D', text: 'Invite all your friends to join for referral bonuses.' }
          ],
          correctId: 'B',
          explanation: 'This is the multi-crore "pre-paid task scam" operated by international syndicates. Any job that requires paying upfront to work is 100% fraudulent.'
        },
        {
          id: 'q4',
          question: 'Why do scammers insist on non-reversible payment methods like Apple/Google Play gift cards, cryptocurrency, or wire transfers?',
          choices: [
            { id: 'A', text: 'Because these payment methods offer the best cashback rewards.' },
            { id: 'B', text: 'Because transactions cannot be recalled, disputed, or charged back once sent.' },
            { id: 'C', text: 'Because bank servers do not work on weekends.' },
            { id: 'D', text: 'Because gift cards are legally exempt from taxes.' }
          ],
          correctId: 'B',
          explanation: 'Gift cards and cryptocurrencies provide near-instant anonymity and have zero consumer protection or chargeback mechanisms.'
        },
        {
          id: 'q5',
          question: 'A viral WhatsApp forward claims: "Government is giving free ₹10,000 and laptops to all students. Register on: http://pm-laptop-scheme.free-grant.xyz". How can you verify this?',
          choices: [
            { id: 'A', text: 'Click the link and fill out the Aadhaar and bank details quickly.' },
            { id: 'B', text: 'Check official government portals (.gov.in or .nic.in) or PIB Fact Check; ignore third-party domains.' },
            { id: 'C', text: 'Forward to 10 WhatsApp groups as requested to unlock the grant.' },
            { id: 'D', text: 'Assume it is true because it has the Prime Minister\'s photo.' }
          ],
          correctId: 'B',
          explanation: 'All authentic Central and State government schemes are hosted exclusively on official government domains ending in .gov.in or .nic.in. PIB Fact Check regularly debunks fake grant links.'
        },
        {
          id: 'q6',
          question: 'What is a "mule account" in financial cybercrime syndicates?',
          choices: [
            { id: 'A', text: 'An account owned by an agricultural cooperative.' },
            { id: 'B', text: 'A bank account belonging to a third party (often rented or compromised) used to receive and launder stolen funds.' },
            { id: 'C', text: 'A crypto wallet that stores animal NFTs.' },
            { id: 'D', text: 'An account with a very high interest rate.' }
          ],
          correctId: 'B',
          explanation: 'Scammers route stolen money through dozens of "mule" accounts belonging to unsuspecting citizens or paid collaborators to break the audit trail before police can freeze the funds.'
        },
        {
          id: 'q7',
          question: 'You find a website advertising a brand new ₹1,20,000 iPhone 15 Pro for only ₹12,999 with "only 3 left in stock" and payment only by UPI. What is this?',
          choices: [
            { id: 'A', text: 'An incredible clearance sale by Apple.' },
            { id: 'B', text: 'A fraudulent cloned e-commerce trap designed to take your money without ever shipping anything.' },
            { id: 'C', text: 'A government subsidized electronics initiative.' },
            { id: 'D', text: 'A lucky draw promotion.' }
          ],
          correctId: 'B',
          explanation: 'Unbelievably low prices on luxury items combined with artificial urgency and non-refundable payment methods are classic signs of fake storefronts.'
        }
      ]
    },
    {
      id: 'lesson-impersonation',
      title: 'Impersonation & Independent Verification',
      titleHinglish: 'Impersonation aur Independent Verification',
      readTime: '4 min read',
      icon: 'shield-check',
      category: 'Social Engineering',
      objective: 'Master the technique of independent verification to defeat executive impersonation, police scams, and family emergencies.',
      objectiveHinglish: 'Seekhein ki kisi bhi shaqi message ko doosre raste se verify kaise kiya jata hai.',
      summary: 'Learn how to step outside the communication channel chosen by the attacker and verify facts safely.',
      content: {
        intro: 'Attackers frequently steal or fake the identities of people you respect: company CEOs, university deans, tax officers, police, or close relatives in distress.',
        introHinglish: 'Scammers aksar boss, police officer, ya musibat mein phanse kisi dost ya rishtedaar ka roop bana kar aate hain.',
        keyConcept: 'Independent Verification means breaking out of the channel chosen by the sender and contacting them through a known, trusted, pre-existing method.',
        keyConceptHinglish: 'Independent verification ka matlab hai scammer ke bataye raste se bahar nikal kar, apne purane contact number ya official website se sachayi pata karna.',
        fictionalExample: 'Your "boss" emails from a personal Gmail asking you to wire $2,000 for a client. Instead of replying, you walk into their office or call their direct desk extension.',
        clues: [
          'Requests for secrecy: "Do not mention this to other team members or bank staff."',
          'Claims that normal verification channels cannot be used ("I am in a meeting and cannot answer calls").',
          'Sudden changes to supplier bank account routing numbers.',
          'Intimidation and threats of legal action or arrest.'
        ],
        safeSteps: [
          'Never use the phone number, email, or link sent inside the suspicious message.',
          'Find the authentic contact information from a physical bill, official website, or saved phonebook.',
          'Always talk to a trusted friend or colleague before sending large sums or confidential records.'
        ]
      },
      knowledgeChecks: [
        {
          id: 'q1',
          question: 'What is the correct way to "independently verify" an urgent email from your bank claiming your card is frozen?',
          choices: [
            { id: 'A', text: 'Reply to the email and ask if it is really them.' },
            { id: 'B', text: 'Call the phone number written at the bottom of the email.' },
            { id: 'C', text: 'Dial the customer service number printed on the back of your physical plastic bank card.' },
            { id: 'D', text: 'Search online forums to see if anyone else had their card frozen.' }
          ],
          correctId: 'C',
          explanation: 'Calling the phone number printed directly on your physical debit/credit card guarantees you are speaking with your real bank, not a scammer.'
        },
        {
          id: 'q2',
          question: 'A video caller wearing a police uniform claims you are under "Digital Arrest" on Skype for money laundering. What is the legal truth in India?',
          choices: [
            { id: 'A', text: 'Digital Arrest is a new legal procedure under the Bharatiya Nagarik Suraksha Sanhita.' },
            { id: 'B', text: 'Digital Arrest is completely fictional; Indian police NEVER arrest, detain, or interrogate anyone over a video call.' },
            { id: 'C', text: 'It is real if they show an official Supreme Court letterhead.' },
            { id: 'D', text: 'It applies only to citizens with bank accounts over ₹5 Lakhs.' }
          ],
          correctId: 'B',
          explanation: 'There is zero legal concept of "Digital Arrest" in Indian jurisprudence. Police cannot detain or question you via WhatsApp or Skype. Hang up immediately.'
        },
        {
          id: 'q3',
          question: 'What is "Caller ID Spoofing"?',
          choices: [
            { id: 'A', text: 'When your mobile carrier renames your contact.' },
            { id: 'B', text: 'A technology allowing scammers to display any fake phone number (including official police or bank lines) on your incoming call screen.' },
            { id: 'C', text: 'Changing your phone wallpaper.' },
            { id: 'D', text: 'Recording phone calls without permission.' }
          ],
          correctId: 'B',
          explanation: 'VoIP technology allows attackers to forge the caller identity displayed on your screen. Never assume an incoming call is genuine solely based on the caller ID shown.'
        },
        {
          id: 'q4',
          question: 'An automated voice call from "FedEx" claims illegal narcotics were found in a courier parcel sent in your name to Taiwan. What should you do?',
          choices: [
            { id: 'A', text: 'Transfer to the "Cyber Cell officer" they offer to connect you with.' },
            { id: 'B', text: 'Hang up immediately. Courier companies cannot transfer calls to police, nor do police interrogate over the phone.' },
            { id: 'C', text: 'Provide your Aadhaar number to prove you did not send it.' },
            { id: 'D', text: 'Pay the customs clearance fee requested.' }
          ],
          correctId: 'B',
          explanation: 'This is the notorious FedEx/Customs parcel scam. Couriers do not transfer calls to police, and law enforcement never conducts criminal proceedings over voice calls.'
        },
        {
          id: 'q5',
          question: 'Why do impersonation scammers insist on strict secrecy ("Do not tell your family or lawyer")?',
          choices: [
            { id: 'A', text: 'Because secrecy is required by the Official Secrets Act.' },
            { id: 'B', text: 'To isolate you so that level-headed friends or family cannot expose the fraud and stop you from paying.' },
            { id: 'C', text: 'To protect your personal privacy.' },
            { id: 'D', text: 'Because bank servers cannot handle multiple calls.' }
          ],
          correctId: 'B',
          explanation: 'Isolation is a critical psychological manipulation technique. Scammers know that talking to a single rational friend, family member, or lawyer will immediately expose the scam.'
        },
        {
          id: 'q6',
          question: 'Your "CEO" emails you from a personal Gmail address asking you to immediately buy ₹50,000 in Apple gift cards for an urgent client meeting. What should you do?',
          choices: [
            { id: 'A', text: 'Buy the gift cards quickly to impress your boss.' },
            { id: 'B', text: 'Contact your CEO directly in person or via the verified internal company Slack/phone before taking any action.' },
            { id: 'C', text: 'Reply to the Gmail asking for the receipt.' },
            { id: 'D', text: 'Pay with your personal credit card.' }
          ],
          correctId: 'B',
          explanation: 'This is Business Email Compromise (BEC) / CEO Fraud. Real executives do not ask subordinates to purchase retail gift cards via personal email accounts.'
        },
        {
          id: 'q7',
          question: 'What is the official National Cyber Crime Reporting helpline phone number in India?',
          choices: [
            { id: 'A', text: '100' },
            { id: 'B', text: '1930' },
            { id: 'C', text: '108' },
            { id: 'D', text: '1800-11-2233' }
          ],
          correctId: 'B',
          explanation: '1930 is India\'s dedicated National Cyber Crime Helpline managed by the Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs.'
        }
      ]
    },
    {
      id: 'lesson-safe-browsing',
      title: 'Safe Browsing: The Truth About HTTPS & Browser Warnings',
      titleHinglish: 'Safe Browsing: HTTPS aur Padlock Icon Ka Sach',
      readTime: '3 min read',
      icon: 'globe',
      category: 'Technical',
      objective: 'Debunk the myth that HTTPS guarantees a site is safe, and understand how modern browser protections operate.',
      objectiveHinglish: 'Padlock icon aur HTTPS ke baare mein faili galatfehmiyon ko door karein.',
      summary: 'Why HTTPS only protects data in transit, and why cybercriminals also use SSL certificates on phishing sites.',
      content: {
        intro: 'For years, users were told: "Look for the padlock icon before entering information." Today, this advice is outdated and dangerous when misunderstood.',
        introHinglish: 'Pehle log sochte the ki agar website par taala (padlock) bana hai toh site 100% safe hai. Par aaj yeh sochna khatarnak ho sakta hai.',
        keyConcept: 'HTTPS provides ENCRYPTION, not INTEGRITY of character. It means nobody can eavesdrop on data traveling between your device and the server. However, if the server belongs to a scammer, they receive your encrypted password perfectly!',
        keyConceptHinglish: 'HTTPS ka matlab sirf encryption hai. Agar saamne wali website hi fake hai, toh aapka password safely hacker ke paas pahunch jayega!',
        fictionalExample: 'A phishing site "https://login-apple-support.invalid" has a valid free SSL certificate and a green padlock icon. Users assume it is safe and enter their Apple ID.',
        clues: [
          'Over 80% of active phishing sites now use HTTPS.',
          'A padlock only tells you the connection is private, NOT that the business is honest.',
          'Full-screen red browser warnings mean the browser\'s reputation engine has confirmed active malicious behavior.'
        ],
        safeSteps: [
          'Never treat the padlock icon as proof that a website is trustworthy or authentic.',
          'Always inspect the actual hostname and domain name carefully.',
          'Never click "Ignore Warning" or "Proceed anyway" on red browser security screens.'
        ]
      },
      knowledgeChecks: [
        {
          id: 'q1',
          question: 'Does the padlock icon (HTTPS) mean that a website is genuine, legitimate, and safe to enter your credit card on?',
          choices: [
            { id: 'A', text: 'Yes, HTTPS certificates are only issued to verified legal companies.' },
            { id: 'B', text: 'No. HTTPS only encrypts the connection; attackers can easily obtain free certificates for phishing sites.' },
            { id: 'C', text: 'Yes, because Google manually inspects every HTTPS site.' },
            { id: 'D', text: 'Only if the website is loaded on a laptop.' }
          ],
          correctId: 'B',
          explanation: 'Anyone can obtain a free SSL certificate for any domain in seconds. HTTPS proves encryption, not trustworthiness.'
        },
        {
          id: 'q2',
          question: 'What is the risk of downloading and sideloading unknown Android applications (.apk files) from WhatsApp or Telegram?',
          choices: [
            { id: 'A', text: 'They might drain your battery 5% faster.' },
            { id: 'B', text: 'They bypass Google Play Protect and can contain spyware, banking Trojans, or SMS forwarders that steal OTPs.' },
            { id: 'C', text: 'They change your phone ringtone.' },
            { id: 'D', text: 'None, APKs are always completely safe.' }
          ],
          correctId: 'B',
          explanation: 'Sideloaded APKs bypass official app store verification and frequently contain malware capable of silently recording screen activity, reading SMS OTPs, and draining bank accounts.'
        },
        {
          id: 'q3',
          question: 'What permissions do rogue instant loan apps abuse to blackmail borrowers and their families?',
          choices: [
            { id: 'A', text: 'Calculator and Flashlight permissions.' },
            { id: 'B', text: 'Contacts, Media/Gallery, and SMS permissions to scrape personal photos and contact lists.' },
            { id: 'C', text: 'Screen brightness permissions.' },
            { id: 'D', text: 'NFC permissions.' }
          ],
          correctId: 'B',
          explanation: 'Predatory loan apps harvest the borrower\'s contact book and photo gallery, then morph personal pictures and threaten family members on WhatsApp to extort illegal fees.'
        },
        {
          id: 'q4',
          question: 'What is "Quishing"?',
          choices: [
            { id: 'A', text: 'Phishing conducted using deceptive QR codes that disguise malicious links or fake payment gateways.' },
            { id: 'B', text: 'Quick fishing on a boat.' },
            { id: 'C', text: 'Compressing large video files.' },
            { id: 'D', text: 'Scanning barcodes at a grocery store checkout.' }
          ],
          correctId: 'A',
          explanation: 'Quishing (QR Phishing) hides malicious URLs inside QR codes, preventing victims and email security filters from easily inspecting the destination before scanning.'
        },
        {
          id: 'q5',
          question: 'Why should you avoid conducting net banking or UPI payments over free public Wi-Fi networks (e.g. at railway stations or cafes)?',
          choices: [
            { id: 'A', text: 'Because public Wi-Fi is slower than 5G.' },
            { id: 'B', text: 'Unsecured public networks are susceptible to Man-in-the-Middle (MitM) attacks, rogue access points, and packet snooping.' },
            { id: 'C', text: 'Because public Wi-Fi deletes your mobile bookmarks.' },
            { id: 'D', text: 'Because banks block all public IP addresses.' }
          ],
          correctId: 'B',
          explanation: 'Unencrypted public Wi-Fi allows attackers on the same network to intercept unencrypted traffic or redirect users to malicious rogue login portals.'
        },
        {
          id: 'q6',
          question: 'A loud browser pop-up freezes your screen claiming: "Your Windows computer has 5 Trojan viruses! Call Microsoft toll-free at 1800-xxx-xxxx". What is this?',
          choices: [
            { id: 'A', text: 'A genuine Microsoft diagnostic alert.' },
            { id: 'B', text: 'A classic Tech Support Scam browser locker designed to panic you into paying thousands for fake software.' },
            { id: 'C', text: 'A routine Windows Update notification.' },
            { id: 'D', text: 'A notification from your internet service provider.' }
          ],
          correctId: 'B',
          explanation: 'Microsoft never sends browser pop-ups displaying phone numbers for virus removal. Simply close the browser tab or terminate the process in Task Manager.'
        },
        {
          id: 'q7',
          question: 'How can you protect your bank account from unauthorized biometric AePS (Aadhaar Enabled Payment System) withdrawals?',
          choices: [
            { id: 'A', text: 'Change your debit card PIN every week.' },
            { id: 'B', text: 'Use the official UIDAI mAadhaar app or website to permanently lock your biometric authentication.' },
            { id: 'C', text: 'Never check your bank balance.' },
            { id: 'D', text: 'Throw away your Aadhaar card.' }
          ],
          correctId: 'B',
          explanation: 'Locking biometrics in the mAadhaar app disables all fingerprint authentication across all micro-ATMs and banks until you temporarily unlock it yourself.'
        }
      ]
    },
    {
      id: 'lesson-after-scam',
      title: 'Post-Incident Guide: What To Do After a Suspected Scam',
      titleHinglish: 'Incident Response: Dhokha Hone Par Kya Karein',
      readTime: '4 min read',
      icon: 'rotate-ccw',
      category: 'Incident Response',
      objective: 'Know the exact calm, immediate steps to contain damage if you clicked a bad link or shared credentials.',
      objectiveHinglish: 'Galti se link click hone ya password share hone par turant kya kadam uthane chahiye.',
      summary: 'Damage containment: disconnect, freeze accounts, reset passwords, report to authorities, and avoid recovery scams.',
      content: {
        intro: 'Mistakes happen to everyone, including cybersecurity professionals. If you realize you clicked a suspicious link, entered a password, or transferred money, swift calm action minimizes harm.',
        introHinglish: 'Galti kisi se bhi ho sakti hai. Agar aapse koi link click ho gaya hai ya password share ho gaya hai, toh ghabraane ke bajaye turant sahi steps lein.',
        keyConcept: 'Speed and calm containment are key. The faster you lock affected accounts, the less chance an attacker has to exploit stolen data.',
        keyConceptHinglish: 'Darr ke maare chup rehne ke bajaye turant action lein taaki nuksaan kam se kam ho sake.',
        fictionalExample: 'You typed your email password into a fake login page. Within 2 minutes, you go to the real email provider, change the password, and click "Log out of all other sessions".',
        clues: [
          'Immediate warning signs: Unexpected 2FA prompts, password reset emails, or unrecognized login sessions.',
          'Beware of "Recovery Scammers" who claim they can "hack back your stolen money for a fee" — they are secondary predators.'
        ],
        safeSteps: [
          'Step 1: If you shared banking or card info, call your bank\'s fraud department immediately to freeze the card/account.',
          'Step 2: If you shared account passwords, log in to the real service right away, change the password, and terminate all active sessions.',
          'Step 3: If you downloaded a suspicious file, disconnect from Wi-Fi/Internet and run a full scan with Windows Security / antivirus.',
          'Step 4: Report the incident to your national cybercrime reporting portal (e.g. cybercrime.gov.in in India, ic3.gov in USA).'
        ]
      },
      knowledgeChecks: [
        {
          id: 'q1',
          question: 'What is the "Golden First Hour" in financial cyber fraud reporting in India?',
          choices: [
            { id: 'A', text: 'The hour between 12 PM and 1 PM when bank servers process transactions.' },
            { id: 'B', text: 'The initial 1 to 2 hours immediately after money was stolen, during which calling 1930 can freeze funds in the banking channel before cash is withdrawn.' },
            { id: 'C', text: 'The time it takes to install an antivirus software.' },
            { id: 'D', text: 'The period required to receive a police FIR copy.' }
          ],
          correctId: 'B',
          explanation: 'The Golden Hour is critical because stolen money is routed through mule accounts. Reporting to 1930 immediately triggers automated inter-bank holds that stop scammers from withdrawing cash at ATMs.'
        },
        {
          id: 'q2',
          question: 'If you accidentally entered your debit card CVV and PIN into an unverified link, what is your most urgent first step?',
          choices: [
            { id: 'A', text: 'Wait 3 days to see if any unrecognized charges appear.' },
            { id: 'B', text: 'Immediately use your bank\'s official mobile app or toll-free hotline to permanently block and freeze the card.' },
            { id: 'C', text: 'Email customer care and wait for a ticket number.' },
            { id: 'D', text: 'Delete your browser cookies.' }
          ],
          correctId: 'B',
          explanation: 'Instantly freezing the card in your mobile app prevents any impending unauthorized transactions from being approved by the bank payment gateway.'
        },
        {
          id: 'q3',
          question: 'What critical financial detail must you provide when reporting fraudulent UPI or IMPS transfers to helpline 1930 or your bank?',
          choices: [
            { id: 'A', text: 'Your phone battery percentage.' },
            { id: 'B', text: 'The 12-digit Unique Transaction Reference (UTR) or Transaction ID number found in your bank SMS / receipt.' },
            { id: 'C', text: 'Your childhood nickname.' },
            { id: 'D', text: 'The color of your payment debit card.' }
          ],
          correctId: 'B',
          explanation: 'The 12-digit UTR number allows the National Cyber Crime Reporting Portal and beneficiary banks to instantly trace and freeze the exact destination account.'
        },
        {
          id: 'q4',
          question: 'After losing money in a scam, an account on Telegram / Instagram contacts you claiming: "I am an ethical hacker, pay me ₹5,000 and I will recover your lost ₹2 Lakhs in 2 hours." What is this?',
          choices: [
            { id: 'A', text: 'A certified cybersecurity professional helping victims.' },
            { id: 'B', text: 'A "Recovery Scam" where secondary predators exploit desperate victims to steal even more money.' },
            { id: 'C', text: 'An official service endorsed by the police.' },
            { id: 'D', text: 'A government cyber investigator.' }
          ],
          correctId: 'B',
          explanation: 'Recovery scammers prey specifically on cyber fraud victims. No private third party can magically "hack into bank accounts" to retrieve funds. Only police and banks through 1930 can legally freeze and refund money.'
        },
        {
          id: 'q5',
          question: 'If you accidentally gave remote access to a scammer via AnyDesk or TeamViewer, what technical actions must you perform immediately?',
          choices: [
            { id: 'A', text: 'Disconnect from the internet immediately, uninstall the remote desktop app, and reboot your device.' },
            { id: 'B', text: 'Turn up the speaker volume.' },
            { id: 'C', text: 'Leave the phone on the table and walk away.' },
            { id: 'D', text: 'Take a selfie.' }
          ],
          correctId: 'A',
          explanation: 'Severing internet connectivity immediately breaks the attacker\'s live control over your device. Uninstalling the app removes their persistent access backdoor.'
        },
        {
          id: 'q6',
          question: 'What evidence should you carefully preserve before deleting scam messages or blocking scam numbers?',
          choices: [
            { id: 'A', text: 'None, everything should be deleted instantly.' },
            { id: 'B', text: 'Full screenshots showing the sender phone number/email, full message text, links, payment receipts, and bank transaction SMS with UTR numbers.' },
            { id: 'C', text: 'Only the profile picture of the scammer.' },
            { id: 'D', text: 'Your browser bookmark list.' }
          ],
          correctId: 'B',
          explanation: 'Police cyber cells and bank dispute teams require verifiable evidence including sender headers, timestamps, screenshots, and exact UTR numbers to register FIRs and substantiate claims.'
        },
        {
          id: 'q7',
          question: 'According to Reserve Bank of India (RBI) circulars, what is a customer\'s liability if unauthorized third-party electronic fraud is notified to the bank within 3 working days?',
          choices: [
            { id: 'A', text: 'The customer is 100% liable for all losses.' },
            { id: 'B', text: 'Zero liability; the bank is required to credit the shadow amount back to the customer within 10 working days.' },
            { id: 'C', text: 'The customer must pay a 20% penalty fee.' },
            { id: 'D', text: 'The account is permanently closed.' }
          ],
          correctId: 'B',
          explanation: 'Under RBI Customer Protection guidelines, if a customer reports unauthorized electronic banking fraud due to third-party breach within 3 working days, customer liability is ZERO.'
        }
      ]
    }
  ];

  // Provide backward compatibility: knowledgeCheck points to knowledgeChecks[0]
  LESSONS.forEach(lesson => {
    if (Array.isArray(lesson.knowledgeChecks) && lesson.knowledgeChecks.length > 0) {
      lesson.knowledgeCheck = lesson.knowledgeChecks[0];
    }
  });

  global.CyberShield.LESSONS = LESSONS;
})(window);
