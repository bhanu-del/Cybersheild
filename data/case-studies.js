/**
 * CyberShield — Cyber Threat Academy & Real Indian Case Studies (2021-2024)
 * Authoritative, comprehensive repository of major cybercrime vectors in India,
 * detailed attack anatomy, psychological manipulation tactics, legal reality checks,
 * and step-by-step defense playbooks.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const CASE_STUDIES = [
    {
      id: 'case-digital-arrest',
      category: 'impersonation',
      categoryLabel: 'Impersonation & Authority',
      year: '2023 – 2024',
      impact: '₹3.5 Crore Extorted • Over 1,200 FIRs Nationwide',
      title: 'Digital Arrest: Supreme Court & CBI Skype Extortion',
      titleHinglish: 'Digital Arrest: Fake CBI aur Mumbai Police Skype Scam',
      excerpt: 'Scammers impersonating CBI, ED, and Mumbai Police place victims under days-long "video detention" on Skype, accusing them of money laundering via forged Supreme Court arrest warrants.',
      realIncident: {
        location: 'Bengaluru & South Delhi',
        dateReported: 'November 2023 – March 2024',
        victimProfile: 'Senior citizen retirees, tech consultants, and doctors living alone',
        overview: 'A 68-year-old retired corporate executive in Bengaluru received an IVR call stating a FedEx parcel addressed to Taiwan containing illegal passports and MDMA was seized. The call was transferred to fake "CBI and Mumbai Cyber Police officers" on Skype. The scammer wore a realistic uniform, sat against a backdrop with state emblems, and presented forged Supreme Court arrest warrants bearing fake judicial seals. Over an 8-day period of continuous video confinement ("Digital Arrest"), the victim was coerced into transferring ₹3.5 Crore to multiple "RBI Secret Verification Accounts" to prove the funds were legal. The money was instantly layered into mule accounts across multiple states.'
      },
      scamAnatomy: [
        {
          stage: 1,
          name: 'The Fabricated Accusation',
          desc: 'Automated robocall claiming courier parcel or mobile SIM linked to money laundering, drug trafficking, or national security crimes.'
        },
        {
          stage: 2,
          name: 'Escalation to Fake Authority',
          desc: 'Call transferred seamlessly to fake police officers. Video call initiated on Skype/WhatsApp with police station backdrops, uniforms, and walkie-talkie audio effects.'
        },
        {
          stage: 3,
          name: 'Psychological Confinement',
          desc: 'Victim told they are under "Digital Arrest" under the Official Secrets Act. Forced to keep cameras on 24/7, forbidden from telling family, spouses, or lawyers under threat of immediate physical arrest.'
        },
        {
          stage: 4,
          name: 'Verification Fund Drain',
          desc: 'Ordered to liquidate mutual funds, fixed deposits, and bank balances into "Govt Safe Holding Accounts" for verification. Funds are siphoned to mule networks within minutes.'
        }
      ],
      legalRealityCheck: [
        'There is NO provision for "Digital Arrest" in Indian law (Bharatiya Nagarik Suraksha Sanhita / CrPC). Law enforcement cannot arrest, detain, or try anyone over a video call.',
        'Neither the Supreme Court, CBI, ED, nor State Police departments ever conduct interrogations on WhatsApp or Skype.',
        'No government agency or the Reserve Bank of India (RBI) operates "Verification Accounts" that demand citizen fund transfers for clearance.',
        'Police officers are legally mandated to serve formal physical notices (Section 41A / Section 91) before summoning or questioning citizens.'
      ],
      redFlags: [
        'Caller initiates or transfers you to a video call (Skype, WhatsApp) for official police questioning.',
        'Insistence on absolute secrecy ("National Security case, do not consult anyone").',
        'Forged documents with mismatched stamps (e.g. "CBI Court of India" or "Reserve Bank Arrest Order").',
        'Demand to transfer money to "clear your name" or for "forensic account verification".'
      ],
      defensePlaybook: [
        '1. Disconnect immediately: You are under no legal obligation to stay on a video call with anyone claiming to be police.',
        '2. Dial 1930 immediately or visit cybercrime.gov.in within the Golden First Hour to freeze beneficiary mule accounts.',
        '3. Contact your local police station in person or call 112 to verify if any complaint or FIR exists against your identity.',
        '4. Never liquidate or transfer savings to any account provided over the phone, regardless of the letterhead shown.'
      ],
      keyTakeaway: 'No Indian law enforcement agency ever conducts interrogations over video calls or demands money for verification. Hang up immediately.'
    },
    {
      id: 'case-electricity-disconnection',
      category: 'social_pressure',
      categoryLabel: 'Social Pressure & Panic',
      year: '2022 – 2024',
      impact: '₹50 Lakhs+ Drained Monthly across Maharashtra, Delhi & UP',
      title: 'Electricity Bill Disconnection Panic SMS Scam',
      titleHinglish: 'Bijli Bill Disconnection: Fake DISCOM SMS aur AnyDesk Fraud',
      excerpt: 'Mass SMS blast claiming power will be cut tonight at 9:30 PM due to unpaid bills. Urges users to call an electricity officer who installs remote desktop software to drain bank accounts.',
      realIncident: {
        location: 'Mumbai (Mahavitaran), Delhi (BSES, Tata Power), Lucknow (UPPCL)',
        dateReported: 'Continuous campaigns (2022 – 2024)',
        victimProfile: 'Household heads, small business owners, and shopkeepers afraid of power loss',
        overview: 'Victims receive an SMS: "Dear Customer, Your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210." In panic, the victim calls the number. The "officer" claims the server has a glitch and asks the victim to pay a ₹10 recharge fee via a link or install "QuickSupport" or "AnyDesk" so they can assist. Once the app is installed, the scammer views the victim entering their net banking password or UPI PIN on screen and drains their account.'
      },
      scamAnatomy: [
        {
          stage: 1,
          name: 'The Nighttime Panic Trigger',
          desc: 'SMS timed between 6:00 PM and 9:00 PM claiming imminent disconnection within hours, leaving no time to visit the utility office.'
        },
        {
          stage: 2,
          name: 'Direct Contact via Mobile',
          desc: 'Message directs victim to a personal 10-digit mobile number rather than the official electricity board customer care line.'
        },
        {
          stage: 3,
          name: 'Remote Access Infiltration',
          desc: 'Scammer instructs victim to install AnyDesk, TeamViewer, or a malicious utility APK to "verify bill payment".'
        },
        {
          stage: 4,
          name: 'Screen Spy & OTP Theft',
          desc: 'While remote screen-sharing is active, the scammer watches the victim type their MPIN or captures incoming SMS OTPs to drain funds.'
        }
      ],
      legalRealityCheck: [
        'Under the Electricity Act, power distribution companies (DISCOMs) CANNOT disconnect electricity without a formal 15-day written notice.',
        'State utility companies (BSES, Tata Power, Mahavitaran, UPPCL) never send SMS alerts from personal 10-digit mobile numbers; they use registered sender headers (e.g. VM-BSESDL, VK-MSEB).',
        'Official DISCOMs always specify your unique Consumer Account (CA) number in payment reminders.',
        'DISCOM employees never demand remote screen-sharing app installations (AnyDesk, TeamViewer).'
      ],
      redFlags: [
        'SMS originates from a regular 10-digit phone number (+91 9xxxx xxxxx) instead of an approved 6-character alphabetic header.',
        'Message omits your Consumer Account (CA) or Consumer ID number.',
        'Demands installation of remote support apps (AnyDesk, TeamViewer QuickSupport) to update bills.',
        'Extreme urgency threatening disconnection within hours on the same evening.'
      ],
      defensePlaybook: [
        '1. Check bill status on the official utility website or trusted BBPS payment apps (Google Pay, PhonePe, Paytm, BHIM).',
        '2. Never call personal numbers given in disconnection SMS messages.',
        '3. Never install AnyDesk, TeamViewer, or unknown APK files on your phone under any instruction.',
        '4. If remote access was granted, immediately disconnect Wi-Fi/Mobile Data, uninstall the app, and contact your bank to block cards.'
      ],
      keyTakeaway: 'Electricity boards never disconnect power without 15 days written notice and never send SMS from personal 10-digit mobile numbers.'
    },
    {
      id: 'case-telegram-task-scam',
      category: 'fake_offers',
      categoryLabel: 'Fake Offers & Task Scams',
      year: '2023 – 2024',
      impact: '₹840 Crore Multi-State Chinese Syndicate Busted',
      title: 'Part-Time "YouTube Like & Rating" Task Scam',
      titleHinglish: 'Part-Time Job Trap: Telegram YouTube Like aur Crypto Task Fraud',
      excerpt: 'Victims are hired for easy work-from-home tasks (liking YouTube videos, rating Google Maps). Small early payouts lure them into VIP Telegram groups where they lose lakhs in "pre-paid investment tasks".',
      realIncident: {
        location: 'Hyderabad, Ahmedabad, Mumbai, Gurgaon',
        dateReported: 'July 2023 – September 2024',
        victimProfile: 'College students, homemakers, and young IT employees seeking side income',
        overview: 'Victims receive a WhatsApp/Telegram message offering ₹3,000 to ₹8,000 daily for "rating hotel apps" or "liking YouTube videos". The victim is given 3 trial tasks and immediately receives ₹150 directly in their UPI account to establish trust. The victim is then moved to a Telegram VIP group filled with fake bot members posting forged screenshots of massive earnings. The tasks evolve into "Pre-paid Crypto Tasks": the victim must deposit ₹5,000 to unlock ₹7,500. As amounts escalate to ₹50,000 and ₹5 Lakhs, withdrawals are blocked due to "credit score issues" or "tax clearance", demanding more deposits until the victim is financially ruined.'
      },
      scamAnatomy: [
        {
          stage: 1,
          name: 'The Micro-Dopamine Bait',
          desc: 'Victim completes 3 trivial video likes and actually receives real money (₹150–₹500) directly in their bank account.'
        },
        {
          stage: 2,
          name: 'Social Proof via Telegram',
          desc: 'Added to a large Telegram group where dozens of fake participant accounts post celebrations of huge daily profits.'
        },
        {
          stage: 3,
          name: 'The Pre-paid Investment Shift',
          desc: 'Free tasks end. Scammer introduces "Merchant Investment Tasks" requiring advance capital with promises of 30%–50% instant profit.'
        },
        {
          stage: 4,
          name: 'The Sunk-Cost Extortion Trap',
          desc: 'Website dashboard shows millions in fake profits, but withdrawal is disabled. Victim is forced to deposit more money to "unlock" previous funds.'
        }
      ],
      legalRealityCheck: [
        'No legitimate multinational marketing or technology company pays ₹5,000/day for liking YouTube videos or clicking review stars.',
        'These syndicates operate illegal offshore crypto laundering operations (often based in Southeast Asian scam compounds).',
        'Funds transferred to "merchant accounts" are actually sent to compromised Indian mule accounts and converted into USDT cryptocurrency within minutes.',
        'Demanding an upfront payment to withdraw your own earned money is a textbook hallmark of advance-fee Ponzi fraud.'
      ],
      redFlags: [
        'Unsolicited WhatsApp or SMS job offers promising thousands of rupees per day for zero qualifications.',
        'Communication insisted strictly via Telegram.',
        'Requirement to transfer your own money to "upgrade VIP tier" or "unlock pre-paid task sets".',
        'Inability to withdraw funds without paying arbitrary "tax deposits" or "credit rectification fees".'
      ],
      defensePlaybook: [
        '1. Recognize that paying money to work is ALWAYS a scam. Legitimate employers pay you, never the reverse.',
        '2. If you received initial bait payouts (₹150–₹500), STOP immediately. Do NOT send any money forward.',
        '3. Never send money to unlock trapped funds—every additional rupee sent will be permanently lost.',
        '4. Report the Telegram group and beneficiary UPI IDs immediately to 1930 / cybercrime.gov.in.'
      ],
      keyTakeaway: 'You should never pay money to earn money. The moment an employer asks for an upfront deposit, it is 100% a scam.'
    },
    {
      id: 'case-aeps-biometric-theft',
      category: 'technical_scams',
      categoryLabel: 'Technical & Biometric Security',
      year: '2022 – 2024',
      impact: 'Thousands of Bank Accounts Drained Without OTP or PIN',
      title: 'Aadhaar AePS Biometric Cloning & Land Deed Theft',
      titleHinglish: 'AePS Biometric Fraud: Registry Office Thumbprint Cloning',
      excerpt: 'Cybercriminals download public land sale deeds from state registry portals, extract thumbprint impressions onto silicone rubber sheets, and siphon cash via AePS micro-ATMs without needing OTPs.',
      realIncident: {
        location: 'Bihar, Haryana, Delhi, Uttar Pradesh',
        dateReported: '2022 – 2024 (Busted by State Cyber Cells)',
        victimProfile: 'Property buyers, rural and urban bank account holders with AePS enabled',
        overview: 'Victims began noticing unexplained ₹10,000 cash withdrawals (the maximum daily AePS limit) debited in the middle of the night without receiving any OTP or clicking any link. Police investigations revealed that cyber gangs were downloading public land deed PDFs from state land registration websites (where buyers leave physical thumb impressions on sales deeds). Gangs extracted the high-resolution thumbprint images, etched them onto polymer or silicone molds, and used micro-ATM POS devices registered to fake Business Correspondents (mules) to authenticate AePS cash debits.'
      },
      scamAnatomy: [
        {
          stage: 1,
          name: 'Public Document Scraping',
          desc: 'Scammers scrape public government land registry websites containing unmasked Aadhaar numbers and thumb impressions.'
        },
        {
          stage: 2,
          name: 'Silicone Biometric Fabrication',
          desc: 'Thumbprint images are inverted, printed on transparent film, and etched onto silicone or rubber pads using UV curing chemicals.'
        },
        {
          stage: 3,
          name: 'Mule Micro-ATM POS Setup',
          desc: 'Scammers purchase biometric micro-ATM POS terminals through compromised banking correspondent credentials.'
        },
        {
          stage: 4,
          name: 'Silent Fund Siphoning',
          desc: 'Artificial silicone thumb is pressed on the sensor along with the Aadhaar number, withdrawing cash without sending an OTP to the victim.'
        }
      ],
      legalRealityCheck: [
        'AePS (Aadhaar-enabled Payment System) was designed for financial inclusion in rural areas without debit cards, requiring only Aadhaar + fingerprint.',
        'Because AePS is a cardless, PINless biometric system, NO OTP is generated on the user\'s phone during withdrawal.',
        'UIDAI provides a free, instant feature in the mAadhaar app and website to LOCK your biometric data permanently until you need it.',
        'Locking biometrics takes 10 seconds and completely disables AePS authentication attempts, rendering cloned thumbprints useless.'
      ],
      redFlags: [
        'SMS debit alerts mentioning "AePS CW" (Cash Withdrawal) that you never initiated.',
        'Unexplained balance deductions on bank accounts linked to your Aadhaar card.',
        'Property registry documents or sale agreements containing your unmasked Aadhaar and thumbprint.'
      ],
      defensePlaybook: [
        '1. Lock Aadhaar biometrics immediately: Open the official mAadhaar app or resident.uidai.gov.in and click "Lock Biometrics".',
        '2. When you need biometrics (e.g. passport renewal or SIM purchase), temporarily unlock in app for 10 minutes; it auto-locks afterwards.',
        '3. Request your primary bank to disable AePS on your savings accounts if you do not use micro-ATM cash services.',
        '4. Regularly inspect Aadhaar authentication history on the UIDAI portal to check for unauthorized verification attempts.'
      ],
      keyTakeaway: 'Lock your Aadhaar biometrics in the mAadhaar app right now. It takes 10 seconds and prevents all unauthorized AePS withdrawals.'
    },
    {
      id: 'case-fedex-narcotics-courier',
      category: 'impersonation',
      categoryLabel: 'Impersonation & Coercion',
      year: '2023 – 2024',
      impact: '₹1.9 Crore Extorted in Single Case • Bengaluru Tech Hub',
      title: 'FedEx / DHL Narcotics Parcel Seizure Scam',
      titleHinglish: 'Courier Drugs Scam: Fake NCB aur Customs Seizure Trap',
      excerpt: 'Automated call claims an international parcel sent in your name containing passports and MDMA drugs has been detained by Customs, transferring you to fake Narcotics Control Bureau officers.',
      realIncident: {
        location: 'Bengaluru, Hyderabad, Pune, Mumbai',
        dateReported: '2023 – 2024',
        victimProfile: 'Corporate professionals with overseas connections or active online shopping history',
        overview: 'A 42-year-old software architect in Bengaluru received an IVR call: "This is FedEx customer care. Your parcel #7712 to Taiwan has been stopped by Mumbai Customs as it contains 5 illegal passports and 140 grams of MDMA drugs. Press 1 to connect to customer executive." When the victim insisted they sent no parcel, the executive claimed their Aadhaar card was identity-stolen by international drug cartels and offered to patch the call directly to the "Crime Branch / NCB Headquarters". The fake officer presented forged letterheads and threatened detention under the NDPS Act unless the victim transferred ₹1.9 Crore to a "Clearance Escrow Account" for financial auditing.'
      },
      scamAnatomy: [
        {
          stage: 1,
          name: 'The Contraband Shock Trap',
          desc: 'Unexpected notification of severe criminal activity (narcotics trafficking, forged passports) sent in the victim\'s name.'
        },
        {
          stage: 2,
          name: 'The "Helpful" Courier Transfer',
          desc: 'Courier claims to act in the victim\'s interest by transferring the call directly to "Police Headquarters" to lodge a denial.'
        },
        {
          stage: 3,
          name: 'Forged Federal Documentation',
          desc: 'Scammer sends WhatsApp PDFs with forged seals of the Narcotics Control Bureau (NCB), CBI, and Ministry of Finance.'
        },
        {
          stage: 4,
          name: 'Asset Audit Extortion',
          desc: 'Victim told to transfer assets to "Reserve Bank Audit Accounts" to prove money was not generated from illegal drug profits.'
        }
      ],
      legalRealityCheck: [
        'Courier companies (FedEx, DHL, Blue Dart) CANNOT transfer phone calls to police departments or customs officers.',
        'Customs and the Narcotics Control Bureau (NCB) do not operate over Skype or WhatsApp calls.',
        'If illegal goods are found in cargo, law enforcement issues formal Section 67 NDPS summons in writing; they never demand financial deposits.',
        'Legitimate investigative agencies never ask citizens to transfer money to "audit accounts" or "escrow accounts".'
      ],
      redFlags: [
        'IVR call claiming a parcel sent by you contains illegal substances or fake passports.',
        'The courier company offers to "connect you directly to the police".',
        'Official documents sent to your WhatsApp with grammatical errors and colorful logos.',
        'Demand for money transfer to verify that your funds are legal.'
      ],
      defensePlaybook: [
        '1. Hang up immediately: Courier companies do not investigate crimes, nor can they patch calls to law enforcement.',
        '2. If you are concerned, call FedEx/DHL official customer care directly using the number on their official website (not the incoming caller).',
        '3. Remember that no government agency asks for money transfers to prove innocence.',
        '4. Report caller numbers and WhatsApp profiles to 1930 / cybercrime.gov.in.'
      ],
      keyTakeaway: 'Courier companies cannot transfer calls to police. Real police never interrogate citizens on WhatsApp or ask for bank transfers.'
    },
    {
      id: 'case-loan-app-extortion',
      category: 'technical_scams',
      categoryLabel: 'Malicious APKs & Extortion',
      year: '2021 – 2024',
      impact: 'Hundreds of Apps Banned by MeitY • Severe Harassment',
      title: 'Rogue Instant Loan Apps & Contact Gallery Extortion',
      titleHinglish: 'Fake Loan App Trap: APK Sideloading aur Photo Morphing Fraud',
      excerpt: 'Malicious loan APKs promise instant collateral-free loans in 5 minutes, but scrape contacts and private photos to launch vicious extortion campaigns against victims and their families.',
      realIncident: {
        location: 'Pan-India (Targeting Tier 1, 2, and 3 cities)',
        dateReported: '2021 – 2024 (Crackdown by RBI, ED, and Google)',
        victimProfile: 'Individuals needing urgent emergency micro-loans (students, wage workers, gig economy drivers)',
        overview: 'Victims download loan apps (e.g. CashBean, RupeeGo, FastLoan) via social media ads or third-party APK links. During installation, the app demands access to Contacts, Photos, SMS, and Camera. The victim requests ₹5,000; the app deducts ₹2,200 as "processing fee" and disburses only ₹2,800. Within 6 days (instead of the advertised 90 days), recovery agents demand ₹8,000. When the victim disputes the charge, the gang accesses the scraped phone contacts, morphs the victim\'s personal photos into obscene images, and broadcasts them to family members, colleagues, and parents on WhatsApp with abusive extortion messages.'
      },
      scamAnatomy: [
        {
          stage: 1,
          name: 'The Frictionless Bait',
          desc: 'Advertisements on Instagram/Facebook promising instant ₹50,000 loan with zero paperwork and no credit score check.'
        },
        {
          stage: 2,
          name: 'The Permission Trojan',
          desc: 'App requires mandatory permissions to read your entire phonebook, camera roll, and SMS inbox before continuing.'
        },
        {
          stage: 3,
          name: 'The Predatory Squeeze',
          desc: 'Disburses half the requested loan while charging 100%+ weekly interest. Demands full repayment within 5 to 7 days.'
        },
        {
          stage: 4,
          name: 'The Contact Blackmail Campaign',
          desc: 'Recovery agents WhatsApp abusive messages and morphed photos to the victim\'s parents, boss, and friends to compel payment.'
        }
      ],
      legalRealityCheck: [
        'Only Non-Banking Financial Companies (NBFCs) and Banks registered with the Reserve Bank of India (RBI) are legally permitted to lend money.',
        'Under RBI digital lending guidelines, lending apps are strictly prohibited from accessing a user\'s contacts, call logs, or photo gallery.',
        'Morphing photographs and issuing threats over messaging apps is a cognizable criminal offense under IPC 384/385 (Extortion), IPC 509, and IT Act Section 66E/67.',
        'Check the RBI Sachet portal (sachet.rbi.org.in) to verify if a lending company is legally licensed.'
      ],
      redFlags: [
        'App is not on Google Play Store or is distributed via a WhatsApp link / third-party APK download.',
        'App demands access to your phone Contacts, Media/Photos, and Call Logs.',
        'Loan tenure is 7 days with massive upfront processing fee deductions.',
        'Recovery calls originate from private numbers with abusive, threatening language.'
      ],
      defensePlaybook: [
        '1. Never install financial or loan apps from outside the official Google Play Store or Apple App Store.',
        '2. Verify that the lender is partnered with an RBI-registered NBFC on the RBI website.',
        '3. If trapped: Do NOT pay repeated blackmail demands—paying once guarantees they will extort you again.',
        '4. Take screenshots of all threatening messages, block the numbers, and lodge an immediate cyber extortion complaint at cybercrime.gov.in.'
      ],
      keyTakeaway: 'Never give any app permission to read your contacts or photos for a loan. Real RBI-registered banks never demand photo gallery access.'
    },
    {
      id: 'case-olx-qr-code-scam',
      category: 'financial_traps',
      categoryLabel: 'UPI & Payment Traps',
      year: '2021 – 2024',
      impact: 'Thousands of Online Classified Sellers Scammed Daily',
      title: 'OLX "Army Officer" QR Code Payment Reversal Scam',
      titleHinglish: 'OLX Army Officer Fraud: QR Code Scan Karke Paise Katna',
      excerpt: 'Scammers posing as Army or CISF officers agree to buy your used furniture on OLX without bargaining, but send a "Pay" QR code claiming you must scan it to "receive" the payment.',
      realIncident: {
        location: 'Delhi-NCR, Pune, Bengaluru, Jaipur, Chandigarh',
        dateReported: '2021 – 2024',
        victimProfile: 'Individuals listing used furniture, smartphones, electronics, or vehicles on OLX/Quikr',
        overview: 'A citizen lists a dining table on OLX for ₹18,000. Within 20 minutes, a buyer calls, introduces himself as a CISF/Army officer posted at the local airport base, and agrees to the price immediately without bargaining. The "officer" sends a photo of a fake military ID card to establish trust. To pay an advance deposit, the scammer sends a UPI QR code on WhatsApp: "Sir, this is our military account QR. Scan this in Google Pay / PhonePe and enter your PIN, and ₹18,000 will be credited directly to your bank." When the victim scans and enters their UPI PIN, ₹18,000 is debited FROM their bank account instead of credited.'
      },
      scamAnatomy: [
        {
          stage: 1,
          name: 'The Patriotic Trust Hook',
          desc: 'Scammer presents a fake Indian Army, CISF, or Police identity card to disarm suspicion and exploit respect for armed forces.'
        },
        {
          stage: 2,
          name: 'No-Bargain Rush',
          desc: 'Agrees to full asking price immediately and insists on paying right away to reserve the item.'
        },
        {
          stage: 3,
          name: 'The Inverted QR Code Lie',
          desc: 'Sends a standard merchant payment QR code on WhatsApp with the claim that scanning it "credits money to your bank account".'
        },
        {
          stage: 4,
          name: 'The PIN Trap & "Error" Double-Dip',
          desc: 'Victim enters UPI PIN, debiting their funds. Scammer claims "It was a server error, scan this ₹36,000 refund QR code to reverse it", debiting them again.'
        }
      ],
      legalRealityCheck: [
        'The fundamental rule of Unified Payments Interface (UPI): You NEVER need to enter your UPI PIN to receive money.',
        'Entering your UPI PIN ALWAYS authorizes a DEBIT (deduction) of money from your account.',
        'Scanning a QR code in PhonePe, Google Pay, or Paytm is strictly used to MAKE a payment, NEVER to receive one.',
        'To receive money on UPI, the sender only needs your mobile number or UPI ID (VPA); no interaction or QR scanning is required by the receiver.'
      ],
      redFlags: [
        'Buyer claims to be an Army, Air Force, or CISF officer and sends photos of their canteen card or uniform.',
        'Buyer agrees to purchase the item without inspecting it or bargaining.',
        'Buyer asks you to scan a QR code or enter your UPI PIN to "receive payment".',
        'Buyer asks you to send ₹1 or ₹5 first "to test the payment gateway link".'
      ],
      defensePlaybook: [
        '1. Remember the Golden Rule: UPI PIN is only for SENDING money. If a prompt asks for your PIN, money will LEAVE your account.',
        '2. Never scan a QR code sent by a buyer on WhatsApp.',
        '3. Insist on in-person physical handover and cash/direct bank transfer for online classified transactions.',
        '4. If defrauded, immediately report the transaction UTR number to 1930 within the Golden Hour.'
      ],
      keyTakeaway: 'You NEVER enter your UPI PIN to receive money. Entering your PIN always debits money from your account.'
    },
    {
      id: 'case-esim-swap-hijack',
      category: 'technical_scams',
      categoryLabel: 'Telecom & Account Takeover',
      year: '2022 – 2024',
      impact: 'High-Value Net Banking & Demat Account Draining',
      title: 'eSIM Remote Profile Transfer & SIM Swap Takeover',
      titleHinglish: 'eSIM Remote Swap: Midnight Account Hijacking Scam',
      excerpt: 'Scammers pose as telecom executives offering an urgent 5G SIM upgrade, tricking the victim into forwarding an eSIM activation code that transfers their mobile number to the attacker\'s phone.',
      realIncident: {
        location: 'Delhi, Mumbai, Kolkata, Bengaluru',
        dateReported: '2022 – 2024',
        victimProfile: 'High-net-worth individuals, business owners, and active digital banking users',
        overview: 'A businessman received a call from an executive claiming to be from his telecom service provider (Airtel/Jio) offering a free "4G to 5G SIM upgrade" to prevent service disruption. The executive instructed the victim to send an SMS: "ESIM <attacker-email>" to 121. The telecom system automatically generated an eSIM QR activation email and sent a confirmation SMS to the victim. The scammer asked for the 19-digit eSIM verification code or confirmation reply "1". Within 2 hours, the victim\'s physical SIM card stopped working ("No Service"). During the midnight outage, the scammers used the victim\'s phone number to reset net banking and Demat account passwords, siphoning ₹45 Lakhs via IMPS.'
      },
      scamAnatomy: [
        {
          stage: 1,
          name: 'The 5G Telecom Upgrade Pitch',
          desc: 'Caller poses as telecom representative offering faster network speeds or warning that current SIM will expire.'
        },
        {
          stage: 2,
          name: 'The Initiated Self-Destruct SMS',
          desc: 'Victim is coached to send the official telecom activation command ("ESIM <email>") to official telco shortcodes (121 / 199).'
        },
        {
          stage: 3,
          name: 'The Silent Dead Zone',
          desc: 'Physical SIM becomes inactive. Scammer scans the activation QR code on their own smartphone, seizing complete control of the number.'
        },
        {
          stage: 4,
          name: 'Midnight Banking Harvest',
          desc: 'With control of SMS OTPs, scammers trigger password resets on bank portals, UPI accounts, and email accounts in the dead of night.'
        }
      ],
      legalRealityCheck: [
        'TRAI and Department of Telecommunications (DoT) mandates a 24-hour cooling period on SMS services after a SIM swap, but scammers bypass this using registered net-banking passwords.',
        'Telecom operators NEVER call customers asking them to send an eSIM request SMS to an unverified email address.',
        'If your mobile phone suddenly loses signal ("No Service") for an extended period without explanation, suspect an unauthorized SIM swap.',
        'Banks are required to send duplicate security alerts to your registered email address as well as SMS.'
      ],
      redFlags: [
        'Phone call instructing you to send an SMS with the word "ESIM" and an unknown email address to 121 or 199.',
        'Warning SMS from your telecom operator stating an eSIM change request has been initiated that you did not request.',
        'Sudden, unexplained loss of cellular network ("No Service" or "Emergency Calls Only") in an area with normally good coverage.'
      ],
      defensePlaybook: [
        '1. If your phone suddenly shows "No Service" unexpectedly, immediately call your telecom operator from another phone to check if a SIM swap was requested.',
        '2. If an unauthorized eSIM SMS arrives, reply immediately with the cancellation code or call telecom customer support.',
        '3. Log in to your primary bank and freeze net banking access temporarily if your mobile number is compromised.',
        '4. Use hardware keys (YubiKey) or app-based 2FA (Google Authenticator) instead of SMS OTPs for high-value financial accounts.'
      ],
      keyTakeaway: 'Never send an SMS containing "ESIM" and someone else\'s email address to 121. If your phone suddenly loses network, verify immediately.'
    }
  ];

  global.CyberShield.CASE_STUDIES = CASE_STUDIES;
})(window);
