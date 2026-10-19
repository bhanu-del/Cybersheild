/**
 * CyberShield — Curated Training Scenarios Dataset (v1.0.0)
 * 36 Rich, testable, balanced scenarios spanning 6 categories and 3 difficulty levels.
 * Contains clear suspicious, legitimate/benign, and ambiguous/verification cases with Hinglish support.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  const SCENARIOS = [
    // ----------------------------------------------------
    // Category 1: URL & Link Phishing (url_phishing)
    // ----------------------------------------------------
    {
      id: 'scen_url_01',
      category: 'url_phishing',
      categoryName: 'URL & Link Phishing',
      difficulty: 'beginner',
      sender: 'PayFast Online Security <alerts@payfast-support.invalid>',
      message: 'Urgent: Your payment account has been temporarily restricted due to unauthorized login attempts. Click below immediately to verify your identity and restore access.',
      url: 'http://payfast.com.account-update.invalid/login',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Click the link immediately so your account does not get locked.', textHinglish: 'Turant link par click karein taaki account lock na ho.' },
        { id: 'B', text: 'Suspicious: The real domain is "account-update.invalid", not "payfast.com".', textHinglish: 'Suspicious: Asli domain "account-update.invalid" hai, na ki "payfast.com".' },
        { id: 'C', text: 'It has the word "payfast" in the URL, so it is safe to proceed.', textHinglish: 'URL mein "payfast" likha hai, isliye yeh safe hai.' },
        { id: 'D', text: 'Forward the message to your coworkers to ask if they received it.', textHinglish: 'Message coworkers ko forward karein puchne ke liye.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'The authoritative domain directly before the TLD is "account-update.invalid", NOT "payfast.com".',
        'Uses artificial urgency ("urgent", "temporarily restricted") to rush decision-making.',
        'Uses unencrypted "http://" protocol for an account login page.'
      ],
      explanation: 'Scammers frequently place the name of a trusted brand inside a subdomain (e.g. payfast.com.something-else.invalid). Always read the domain name right before the last dot to know who actually controls the server.',
      explanationHinglish: 'Scammers trusted brand ka naam subdomain mein daal dete hain. Asli domain hamesha aakhri dot ke pehle wala part hota hai. Yeh link "account-update.invalid" par ja raha hai, PayFast par nahi.',
      safeNextStep: 'Close the email. If you want to check your PayFast account, open a new browser tab and type the official URL yourself.'
    },
    {
      id: 'scen_url_02',
      category: 'url_phishing',
      categoryName: 'URL & Link Phishing',
      difficulty: 'intermediate',
      sender: 'Global Parcel Express <tracking@updates.example.com>',
      message: 'Delivery Exception: Your package #GP-88319 could not be delivered due to an incomplete street address. Please confirm your delivery details.',
      url: 'https://tinyurl.com/parcel-gp88319',
      isVerifyOptimal: true,
      choices: [
        { id: 'A', text: 'Open the shortened link and type your home address.', textHinglish: 'Short link open karein aur apna address bharein.' },
        { id: 'B', text: 'Call the driver immediately on any number in the SMS.', textHinglish: 'SMS ke number par turant driver ko call karein.' },
        { id: 'C', text: 'Caution: The shortener hides the true destination; verify through the official courier app or tracking page.', textHinglish: 'Caution: Short link asli website chupata hai; official courier app ya website se verify karein.' },
        { id: 'D', text: 'Shortened links are always malicious and can never be used by real couriers.', textHinglish: 'Short links hamesha malicious hote hain aur koi real courier use nahi karta.' }
      ],
      correctChoiceId: 'C',
      evidence: [
        'URL shorteners like tinyurl.com mask the final destination server.',
        'Unexpected parcel messages often lead to fake postal fee phishing pages.',
        'Independent verification is the safe standard.'
      ],
      explanation: 'Shortened links hide where they will take you. While legitimate services sometimes use them for brevity, attackers use them to bypass basic inspections. The safest action is to visit the courier\'s official website and enter the tracking number there.',
      explanationHinglish: 'TinyURL jaise short links asli address ko chhupa dete hain. Hamesha courier ki official website ya app par jakar tracking ID enter karke check karein.',
      safeNextStep: 'Do not click the short link. Check your original order confirmation email to find your real carrier tracking number.'
    },
    {
      id: 'scen_url_03',
      category: 'url_phishing',
      categoryName: 'URL & Link Phishing',
      difficulty: 'advanced',
      sender: 'CloudDrive Workspace <notification@clouddrive.example.com>',
      message: 'Project Blueprint shared with you by Elena Rostova. Click to open document in web viewer.',
      url: 'https://clouddrive.example.com/shared/doc?id=99281&auth=sso',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Legitimate structure: Official domain, HTTPS, standard query parameters, no urgency pressure.', textHinglish: 'Legitimate structure: Official domain hai, HTTPS hai, koi artificial urgency nahi hai.' },
        { id: 'B', text: 'Any email with a link is automatically a scam; delete it.', textHinglish: 'Kisi bhi link wala email scam hota hai; use delete kar dein.' },
        { id: 'C', text: 'The URL has a query parameter "?id=" which means it is stealing your browser session.', textHinglish: 'Query parameter "?id=" ka matlab browser session chori ho raha hai.' },
        { id: 'D', text: 'Click the link and immediately turn off your computer.', textHinglish: 'Link par click karke turant computer band kar dein.' }
      ],
      correctChoiceId: 'A',
      evidence: [
        'The hostname is genuine "clouddrive.example.com".',
        'Valid encrypted HTTPS connection.',
        'Standard document sharing URL pattern with ordinary parameter structure.',
        'No artificial panic or countdown threats.'
      ],
      explanation: 'Not all links are malicious! Learning digital safety requires knowing what benign, legitimate notifications look like. This address uses the legitimate domain, proper HTTPS, and standard document sharing parameters.',
      explanationHinglish: 'Har message scam nahi hota. Yeh email official domain se hai, HTTPS use kar raha hai, aur standard sharing link hai.',
      safeNextStep: 'If you are collaborating with Elena on this project, the link appears structurally sound.'
    },
    {
      id: 'scen_url_04',
      category: 'url_phishing',
      categoryName: 'URL & Link Phishing',
      difficulty: 'intermediate',
      sender: 'System Admin <admin@secure-gateway.invalid>',
      message: 'Urgent security patch required for all remote staff. Download workstation agent update.',
      url: 'https://mycompany.com@attacker-controlled.invalid/agent.exe',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Download it because "mycompany.com" is written at the start.', textHinglish: 'Download karein kyunki shuru mein "mycompany.com" likha hai.' },
        { id: 'B', text: 'Dangerous: The "@" symbol tricks the browser into visiting "attacker-controlled.invalid".', textHinglish: 'Dangerous: "@" symbol browser ko fool karke "attacker-controlled.invalid" par bhej deta hai.' },
        { id: 'C', text: 'Because it ends in .exe, it must be an approved Microsoft Windows update.', textHinglish: 'Kyunki yeh .exe file hai, yeh Microsoft approved update hai.' },
        { id: 'D', text: 'Run the file inside an incognito tab to stay safe.', textHinglish: 'Incognito tab mein chalane se safe rahega.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'The "@" symbol in the URL authority treats "mycompany.com" as userinfo credentials.',
        'The actual network connection will connect to "attacker-controlled.invalid".',
        'Direct executable download link (.exe) from an untrusted source.'
      ],
      explanation: 'In URLs, anything before an "@" symbol is interpreted as username credentials, and the browser navigates to the hostname AFTER the "@". Scammers use this trick to disguise dangerous links.',
      explanationHinglish: 'URL mein "@" ke pehle ka hissa username mana jata hai aur browser "@" ke baad wale domain par jata hai. Is trick se attackers dhokha dete hain.',
      safeNextStep: 'Never open links with user-info "@" tricks or download executable files from unexpected emails.'
    },
    {
      id: 'scen_url_05',
      category: 'url_phishing',
      categoryName: 'URL & Link Phishing',
      difficulty: 'advanced',
      sender: 'National Bank Alerts <alerts@bank.example.invalid>',
      message: 'Security Notice: New device logged into your online banking portal from Singapore.',
      url: 'https://www.bank.example.invalid.customer-session.top/auth',
      isVerifyOptimal: true,
      choices: [
        { id: 'A', text: 'Click and enter your login details to block the device.', textHinglish: 'Click karke login details daalein taaki device block ho sake.' },
        { id: 'B', text: 'High risk: The actual domain is "customer-session.top", not the bank.', textHinglish: 'High risk: Asli domain "customer-session.top" hai, bank ka nahi.' },
        { id: 'C', text: 'Because it starts with "https://www.bank", it is guaranteed genuine.', textHinglish: 'Kyunki "https://www.bank" se start ho raha hai, yeh genuine hai.' },
        { id: 'D', text: 'Change your Wi-Fi password immediately.', textHinglish: 'Apna Wi-Fi password turant badal dein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Domain ends in ".top", and the actual registrable domain is "customer-session.top".',
        'The bank brand is placed in a nested subdomain string.',
        'High-concern phishing technique mimicking security notifications.'
      ],
      explanation: 'The string "www.bank.example.invalid" is merely a long subdomain created on "customer-session.top". Any domain owner can create subdomains named after famous banks.',
      explanationHinglish: 'Yeh pura naam sirf ek subdomain hai jo "customer-session.top" par banaya gaya hai. Koi bhi attacker apne domain par bank ke naam ka subdomain bana sakta hai.',
      safeNextStep: 'Open your bank\'s official mobile app or visit their known bookmark to verify if any new device was actually logged in.'
    },
    {
      id: 'scen_url_06',
      category: 'url_phishing',
      categoryName: 'URL & Link Phishing',
      difficulty: 'beginner',
      sender: 'Campus Library Network <library@campus.example.edu>',
      message: 'Reminder: The library catalog server is undergoing scheduled maintenance this Sunday 02:00 AM - 04:00 AM. Access may be intermittent.',
      url: 'https://library.campus.example.edu/maintenance-schedule',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Legitimate: Official educational domain, no credential requests, simple informational notice.', textHinglish: 'Legitimate: Official university domain hai, koi password nahi maanga, sirf notice hai.' },
        { id: 'B', text: 'Scam: Any message about maintenance is an attack.', textHinglish: 'Scam: Maintenance ka koi bhi message attack hota hai.' },
        { id: 'C', text: 'Phishing: The URL uses a hyphen in "maintenance-schedule".', textHinglish: 'Phishing: URL ke path mein hyphen use hua hai.' },
        { id: 'D', text: 'Unsafe because it mentions Sunday.', textHinglish: 'Unsafe kyunki isme Sunday ka zikr hai.' }
      ],
      correctChoiceId: 'A',
      evidence: [
        'Domain is the authentic university subdomain "library.campus.example.edu".',
        'No urgent action, threat of penalty, or login demand.',
        'Routine IT notification informing users of scheduled downtime.'
      ],
      explanation: 'Routine operational updates with informational links to official domains are normal. Recognizing safe, non-manipulative notices is just as important as identifying phishing.',
      explanationHinglish: 'Yeh university ka official notification hai. Isme na koi password maanga hai aur na hi koi daraane wali baat hai.',
      safeNextStep: 'No action required; take note of the scheduled downtime.'
    },

    // ----------------------------------------------------
    // Category 2: Passwords, OTP & Credentials (otp_credentials)
    // ----------------------------------------------------
    {
      id: 'scen_otp_01',
      category: 'otp_credentials',
      categoryName: 'Passwords & OTP Safety',
      difficulty: 'beginner',
      sender: 'SMS from +1-555-0192',
      message: 'BANK ALERT: A transaction of $480.00 to Merchant-XYZ is pending. If this was NOT you, reply immediately with the 6-digit OTP code sent to your mobile to cancel.',
      url: null,
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Reply with the OTP quickly so the $480 charge is canceled.', textHinglish: 'Turant OTP reply karein taaki $480 ka transaction cancel ho jaye.' },
        { id: 'B', text: 'Scam: Banks never ask you to send your OTP to cancel a charge; the scammer is trying to authorize a transaction.', textHinglish: 'Scam: Bank kabhi cancel karne ke liye OTP nahi maangte; scammer transaction complete karne ke liye OTP maang raha hai.' },
        { id: 'C', text: 'Send only the last 3 digits of the OTP.', textHinglish: 'Sirf aakhri 3 digits share karein.' },
        { id: 'D', text: 'Call the mobile number that sent the SMS and tell them your card number.', textHinglish: 'SMS wale number par call karke card details de dein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Direct request to reply with a 6-digit OTP.',
        'The scammer triggered an actual transaction and needs YOUR OTP to approve it.',
        'Sent from an informal mobile number instead of an authorized banking shortcode.'
      ],
      explanation: 'One-Time Passwords (OTPs) are authorization keys used to APPROVE money moving out of your account or account takeovers. A bank never needs your OTP to cancel an unauthorized charge.',
      explanationHinglish: 'OTP ka use transaction ko APPROVE karne ke liye hota hai, cancel karne ke liye nahi. Jab scammer koi transaction karta hai, toh woh bank bankar aapse OTP maangta hai.',
      safeNextStep: 'Do NOT share the OTP. Contact your bank immediately using the phone number printed on the back of your debit/credit card.'
    },
    {
      id: 'scen_otp_02',
      category: 'otp_credentials',
      categoryName: 'Passwords & OTP Safety',
      difficulty: 'intermediate',
      sender: 'TechSupport Helpdesk <support@it-desk.internal-ticket.invalid>',
      message: 'Ticket #4920: Routine password audit detected your corporate password will expire in 4 hours. Please send your current password and username to prevent workstation lockout.',
      url: null,
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Send your password to avoid getting locked out of your computer.', textHinglish: 'Apna password bhej dein taaki computer lock na ho.' },
        { id: 'B', text: 'Scam: Legitimate IT departments never ask for your plain-text password via email or ticket.', textHinglish: 'Scam: Real IT department kabhi email ya message par password nahi maangta.' },
        { id: 'C', text: 'Send a reversed version of your password.', textHinglish: 'Apna password ulta karke bhej dein.' },
        { id: 'D', text: 'Post the request on your social media to ask what it means.', textHinglish: 'Social media par post karke puchen.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Direct solicitation of current secret password.',
        'Uses IT authority impersonation and threat of workstation lockout.',
        'Legitimate identity systems never store or request plain-text user passwords.'
      ],
      explanation: 'Authentic IT departments have administrative tools to reset accounts if needed. They NEVER need you to email your password to them. Any request for your plain-text password is credential harvesting.',
      explanationHinglish: 'Company ka IT department kabhi aapse email par password nahi maangta. Unke paas already system access hota hai. Kisi ko bhi apna password na dein.',
      safeNextStep: 'Report this message to your company\'s official security operations or IT manager.'
    },
    {
      id: 'scen_otp_03',
      category: 'otp_credentials',
      categoryName: 'Passwords & OTP Safety',
      difficulty: 'advanced',
      sender: 'StreamMovie Verification <no-reply@streammovie.example.com>',
      message: 'Your one-time security code is 739-104 for login verification. If you did not request this code, someone may be attempting to access your account. Check your account settings.',
      url: 'https://streammovie.example.com/account/security',
      isVerifyOptimal: true,
      choices: [
        { id: 'A', text: 'Legitimate security alert: It provides an OTP you requested (or someone attempted), without asking you to send it to anyone.', textHinglish: 'Legitimate alert: Yeh normal OTP alert hai jo kisi ko bhejne ko nahi keh raha.' },
        { id: 'B', text: 'Phishing: Any message mentioning an OTP is dangerous and must be deleted.', textHinglish: 'Phishing: Har OTP message dangerous hota hai.' },
        { id: 'C', text: 'Reply to the email and tell them they made a mistake.', textHinglish: 'Email par reply karke bolein ki galti ho gayi.' },
        { id: 'D', text: 'Forward the OTP code to your friends.', textHinglish: 'OTP dosto ko forward kar dein.' }
      ],
      correctChoiceId: 'A',
      evidence: [
        'Originates from genuine brand domain "streammovie.example.com".',
        'Does NOT ask you to share, reply, or enter the OTP on an unverified link.',
        'Properly instructs you to independently check account settings if unsolicited.'
      ],
      explanation: 'Automated 2FA notification messages are legitimate. The critical difference: legitimate services display your code for you to use in the official app, and warn you NEVER to share it with anyone else.',
      explanationHinglish: 'Yeh genuine 2FA alert hai. Isme notice diya gaya hai par kisi ko OTP bhejne ko nahi bola gaya. Agar aapne login nahi kiya tha toh official site par jakar password badlein.',
      safeNextStep: 'If you did not initiate this login, someone knows your password! Go to the official website and change your account password immediately.'
    },
    {
      id: 'scen_otp_04',
      category: 'otp_credentials',
      categoryName: 'Passwords & OTP Safety',
      difficulty: 'intermediate',
      sender: 'WhatsApp message from "+91 98765 43210"',
      message: 'Hi Uncle! My phone fell in water and I am trying to login to my WhatsApp on my spare phone. By mistake my 6-digit verification code was sent to your phone! Please send it to me quickly so I can call mom.',
      url: null,
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Forward the 6-digit code immediately because family needs help.', textHinglish: 'Turant code bhej dein kyunki family member ko zaroorat hai.' },
        { id: 'B', text: 'High danger: The attacker is trying to register YOUR WhatsApp account on their phone using your phone number.', textHinglish: 'Bada khatra: Attacker aapse aake aapka apna WhatsApp account hack karne ki koshish kar raha hai.' },
        { id: 'C', text: 'Send the code, but delete the message right away.', textHinglish: 'Code bhej dein aur message delete kar dein.' },
        { id: 'D', text: 'Send your credit card PIN instead.', textHinglish: 'Apna ATM PIN bhej dein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Classic WhatsApp takeover social engineering attack.',
        'WhatsApp verification codes for YOUR number only arrive on YOUR phone when someone enters YOUR number.',
        'Emotional urgency ("call mom") used to bypass critical thinking.'
      ],
      explanation: 'WhatsApp codes are NEVER sent to someone else by mistake. If you received a code, someone entered YOUR phone number on their device. If you give them the code, they take over your entire WhatsApp account and message all your contacts.',
      explanationHinglish: 'Yeh classic WhatsApp hack trick hai! WhatsApp ka code kabhi galti se kisi aur ke phone par nahi jata. Agar aapne code de diya toh aapka WhatsApp hacker ke phone mein chalne lagega.',
      safeNextStep: 'Do NOT share the code. Call that relative on their regular phone line or meet them in person to verify.'
    },
    {
      id: 'scen_otp_05',
      category: 'otp_credentials',
      categoryName: 'Passwords & OTP Safety',
      difficulty: 'beginner',
      sender: 'Caller claiming to be "Electricity Board Officer"',
      message: 'Your power connection will be disconnected tonight at 9:30 PM due to unpaid bill of $14. Download QuickSupport app or share OTP to update bill status.',
      url: null,
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Download the app and read the numbers on the screen to the caller.', textHinglish: 'App download karein aur screen par aane wale numbers bol dein.' },
        { id: 'B', text: 'Scam: Power companies do not cut electricity at night via SMS, and remote-support apps allow total phone control.', textHinglish: 'Scam: Bijli vibhag raat ko SMS se line nahi kaatta, aur remote app se phone pura hack ho jata hai.' },
        { id: 'C', text: 'Offer to pay $50 in cash immediately.', textHinglish: 'Cash offer karein.' },
        { id: 'D', text: 'Share your bank card CVV to clear the bill.', textHinglish: 'Bill clear karne ke liye CVV share karein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Manufactured panic deadline ("power disconnected tonight at 9:30 PM").',
        'Request to install remote-desktop software (QuickSupport/AnyDesk) or share OTP.',
        'Trivial alleged unpaid amount ($14) designed to make the victim pay without thinking.'
      ],
      explanation: 'Scammers frequently pretend to be utility departments. If you install remote desktop apps like QuickSupport, the scammer can see your screen, view incoming SMS codes, and drain your bank account.',
      explanationHinglish: 'Yeh bijli bill scam hai. Remote app (AnyDesk, QuickSupport) download karwake scammer aapki screen dekh leta hai aur OTP padh kar account khaali kar deta hai.',
      safeNextStep: 'Hang up and block the number. Check your electricity bill status on the official utility website or municipal office.'
    },
    {
      id: 'scen_otp_06',
      category: 'otp_credentials',
      categoryName: 'Passwords & OTP Safety',
      difficulty: 'advanced',
      sender: 'HR Operations <hr@corporate.example.com>',
      message: 'Annual Benefits Enrollment: All employees must review their health coverage choices by Friday 5:00 PM on the HR portal.',
      url: 'https://benefits.corporate.example.com/enrollment',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Legitimate internal communication: Proper company domain, standard corporate deadline, directs to internal portal.', textHinglish: 'Legitimate internal notice: Company ka official domain hai, normal deadline hai, portal par redirect kar raha hai.' },
        { id: 'B', text: 'Phishing because it has a deadline (Friday 5:00 PM).', textHinglish: 'Phishing kyunki isme deadline hai.' },
        { id: 'C', text: 'Scam because HR is not allowed to send emails.', textHinglish: 'Scam kyunki HR email nahi bhej sakta.' },
        { id: 'D', text: 'Delete the email and ignore your benefits.', textHinglish: 'Email delete kar dein.' }
      ],
      correctChoiceId: 'A',
      evidence: [
        'Authentic company domain "benefits.corporate.example.com".',
        'Reasonable administrative timeline (annual benefits period).',
        'Does not ask for passwords in email or phone; directs to official SSO system.'
      ],
      explanation: 'Legitimate workplace emails often have deadlines (like tax forms or benefits enrollment). The key distinction is that legitimate notices direct you to standard authenticated enterprise systems on official domains.',
      explanationHinglish: 'Office mein routine notices aate rehte hain jinki deadline hoti hai. Yeh official company domain par hai aur standard procedure follow kar raha hai.',
      safeNextStep: 'Review your benefits through your standard company single sign-on (SSO) bookmarks.'
    },

    // ----------------------------------------------------
    // Category 3: Fake Offers, Prizes & Refunds (fake_offers)
    // ----------------------------------------------------
    {
      id: 'scen_off_01',
      category: 'fake_offers',
      categoryName: 'Fake Offers & Prizes',
      difficulty: 'beginner',
      sender: 'Global Lottery Sweepstakes <winner@mega-draw-jackpot.invalid>',
      message: 'CONGRATULATIONS! Your email was randomly selected as the 1st prize winner of $2,500,000 in our international sweepstakes. Pay a $150 processing fee to release funds.',
      url: null,
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Pay the $150 fee immediately to claim the $2.5 million.', textHinglish: '$150 fee pay karke $2.5 million claim karein.' },
        { id: 'B', text: 'Advance-fee scam: You cannot win a lottery you never entered, and legitimate prizes never require upfront fees.', textHinglish: 'Advance-fee scam: Jis lottery ka ticket nahi khareeda use jeet nahi sakte, aur asli prize ke liye pehle paise nahi dene padte.' },
        { id: 'C', text: 'Ask if they can deduct the $150 from the $2.5 million instead.', textHinglish: 'Puchein ki prize money se $150 deduct kar lein.' },
        { id: 'D', text: 'Send your passport and bank statements to prove who you are.', textHinglish: 'Passport aur bank details send karein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Advance-fee fraud pattern: Requires upfront payment to receive a fictional larger sum.',
        'Unsolicited claim of winning a contest never entered.',
        'Unrealistic monetary reward designed to trigger greed and impulsiveness.'
      ],
      explanation: 'This is the textbook "advance-fee" fraud (also known as the 419 scam). No genuine lottery asks winners to pay fees via gift cards, wire transfer, or crypto. Once you pay the $150, the scammer asks for more "taxes" or disappears.',
      explanationHinglish: 'Yeh classic lottery scam hai. Jab aapne koi lottery ticket hi nahi li toh jeet kaise sakte hain? Asli prize lene ke liye kabhi pehle advance paise nahi dene hote.',
      safeNextStep: 'Delete and mark as spam. Never send money to claim prize funds.'
    },
    {
      id: 'scen_off_02',
      category: 'fake_offers',
      categoryName: 'Fake Offers & Prizes',
      difficulty: 'intermediate',
      sender: 'Global Talent Recruitment <hr@fast-career-global.invalid>',
      message: 'Exciting Career Opportunity: Earn $300-$800 daily working 1-2 hours remotely rating hotel apps. No interview or experience needed! Message our hiring manager on Telegram @FastJobHR.',
      url: null,
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Message them on Telegram to start working immediately.', textHinglish: 'Telegram par message karke kaam shuru karein.' },
        { id: 'B', text: 'Task scam: Unrealistic pay for trivial work, no formal hiring process, and attempts to move to unmonitored Telegram.', textHinglish: 'Task scam: Thode se kaam ke liye itne zyada paise ka jhootha vaada, aur Telegram par bulana classic scam hai.' },
        { id: 'C', text: 'Quit your existing job right away.', textHinglish: 'Apni job chhod dein.' },
        { id: 'D', text: 'Send them your bank account credentials for direct deposit.', textHinglish: 'Bank account details bhej dein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Task/Work-from-home scam pattern with absurdly high pay ($500/day for 1 hour).',
        'No job interview, resume review, or formal employment contract.',
        'Shifts conversation to Telegram where scammers operate anonymously.'
      ],
      explanation: 'Known as the "task scam". Victims are given fake tasks like clicking ratings on a fake website, then asked to deposit their own money into a cryptocurrency wallet to "unlock higher tier earnings".',
      explanationHinglish: 'Isko "task scam" kehte hain. 1 ghante mein hazaron rupaye kamane ka lalach dekar pehle aapse fake task karwayenge, phir aapse deposits maangenge.',
      safeNextStep: 'Block the sender. Legitimate corporate employers conduct formal interviews and do not hire via anonymous Telegram handles.'
    },
    {
      id: 'scen_off_03',
      category: 'fake_offers',
      categoryName: 'Fake Offers & Prizes',
      difficulty: 'intermediate',
      sender: 'Tax Authority Refund Center <tax-refunds@gov-claims.invalid>',
      message: 'Notice of Tax Assessment: An overpayment of $642.10 was identified on your last filing. Click to claim your direct deposit refund.',
      url: 'https://tax-refund.claim-status.invalid/portal',
      isVerifyOptimal: true,
      choices: [
        { id: 'A', text: 'Enter your bank card number to receive the refund.', textHinglish: 'Refund lene ke liye debit card details bharein.' },
        { id: 'B', text: 'Phishing: Tax revenue agencies notify citizens by physical mail or secure government tax portals, not unsolicited links.', textHinglish: 'Phishing: Tax department aamtaur par physical notice ya official portal se contact karta hai, aise links se nahi.' },
        { id: 'C', text: 'Ask for the refund in Bitcoin.', textHinglish: 'Bitcoin mein refund maangein.' },
        { id: 'D', text: 'Click the link from your phone since phones cannot get viruses.', textHinglish: 'Phone se click karein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Domain is "gov-claims.invalid" rather than an official government top-level domain (.gov, .gov.in, .gov.uk).',
        'Tax authorities never send direct clickable refund deposit links asking for payment card numbers.',
        'High-volume seasonal phishing tactic.'
      ],
      explanation: 'Scammers frequently exploit tax season by promising refunds. Government agencies deposit refunds into the bank account on your tax return, or mail a physical check. They never ask you to claim funds by typing your credit card number.',
      explanationHinglish: 'Government tax department kabhi aapse credit/debit card number maang kar refund nahi deta. Yeh link fake website par le jaakar aapke card details chura lega.',
      safeNextStep: 'Log in directly to your official government revenue portal by typing the known official web address.'
    },
    {
      id: 'scen_off_04',
      category: 'fake_offers',
      categoryName: 'Fake Offers & Prizes',
      difficulty: 'advanced',
      sender: 'MegaMart Rewards <newsletter@megamart.example.com>',
      message: 'Weekly Members Bulletin: 15% off organic produce this Tuesday with your in-store membership card. Show barcode at checkout.',
      url: 'https://www.megamart.example.com/weekly-specials',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Legitimate marketing: Official grocery store domain, realistic promotional discount (15%), no sensitive info requested.', textHinglish: 'Legitimate marketing: Supermarket ka official domain hai, normal 15% discount hai, koi password nahi maanga.' },
        { id: 'B', text: 'Scam because it offers a discount.', textHinglish: 'Scam kyunki discount offer kiya hai.' },
        { id: 'C', text: 'Phishing: The barcode will steal your contacts.', textHinglish: 'Barcode contacts chura lega.' },
        { id: 'D', text: 'Call the police to report the coupon.', textHinglish: 'Police ko report karein.' }
      ],
      correctChoiceId: 'A',
      evidence: [
        'Authentic domain "megamart.example.com".',
        'Realistic business discount (15% off produce) with existing in-store card.',
        'No credential requests, no money transfer demands, no urgency threats.'
      ],
      explanation: 'Legitimate commercial emails contain discounts and weekly circulars. A discount is not inherently suspicious when it comes from an authentic merchant you subscribed to and requires no sensitive disclosures.',
      explanationHinglish: 'Yeh aam grocery store ka newsletter hai. 15% discount realistic hai aur isme na koi paisa maanga hai na koi sensitive data.',
      safeNextStep: 'Enjoy the discount if you shop at MegaMart.'
    },
    {
      id: 'scen_off_05',
      category: 'fake_offers',
      categoryName: 'Fake Offers & Prizes',
      difficulty: 'beginner',
      sender: 'Instant Loans <quick-cash@fastloan.invalid>',
      message: 'Pre-Approved! Get $25,000 personal loan instantly with 0% interest and no credit score check. Pay $200 processing fee via Gift Card to disburse loan.',
      url: null,
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Buy a $200 gift card to get the $25,000 loan.', textHinglish: '$200 ka gift card khareed kar loan lein.' },
        { id: 'B', text: 'Advance loan fee scam: No genuine financial institution offers 0% loans with zero checks and demands fee payment in gift cards.', textHinglish: 'Fake loan scam: Koi bhi real bank gift card mein fee nahi maangta aur bina credit check 0% loan nahi deta.' },
        { id: 'C', text: 'Ask for a $50,000 loan instead.', textHinglish: 'Double loan maangein.' },
        { id: 'D', text: 'Give them your parent\'s retirement account details.', textHinglish: 'Parents ke account details de dein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Absurd loan terms (0% interest, no credit check).',
        'Demand for payment in gift cards (untraceable and non-refundable).',
        'Targeting financially vulnerable individuals with advance fee fraud.'
      ],
      explanation: 'Gift cards are for gifts, NOT business payments. Any entity demanding payment via Apple, Google Play, or Steam cards is 100% running a scam. Real lenders deduct administrative fees from the disbursed loan amount, never upfront in retail cards.',
      explanationHinglish: 'Gift card sirf shopping ya gifts ke liye hote hain, loan fee ke liye nahi. Jo bhi gift card mein paise maange woh 100% fraud hai.',
      safeNextStep: 'Block the sender. If you need a loan, consult an accredited local bank or credit union.'
    },
    {
      id: 'scen_off_06',
      category: 'fake_offers',
      categoryName: 'Fake Offers & Prizes',
      difficulty: 'advanced',
      sender: 'FlightBooking Portal <reservations@fly-sky.example.com>',
      message: 'Your electronic ticket itinerary for flight FS-402 is confirmed. Departure: Oct 24, 08:30 AM. View full itinerary on portal.',
      url: 'https://reservations.fly-sky.example.com/itinerary?code=XY92P',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Legitimate booking confirmation: Official airline subdomain, valid booking code format, standard itinerary details.', textHinglish: 'Legitimate confirmation: Airline ka official domain hai, booking reference code hai, normal itinerary hai.' },
        { id: 'B', text: 'Scam: Airlines only communicate via handwritten letters.', textHinglish: 'Scam kyunki airline letter bhejti hai.' },
        { id: 'C', text: 'Phishing because it contains a date and time.', textHinglish: 'Phishing kyunki date aur time likha hai.' },
        { id: 'D', text: 'Delete your passport immediately.', textHinglish: 'Passport delete karein.' }
      ],
      correctChoiceId: 'A',
      evidence: [
        'Domain matches legitimate carrier "fly-sky.example.com".',
        'Corresponds to a flight booking made by the traveler.',
        'Proper informational structure without panic or payment redirection.'
      ],
      explanation: 'E-ticket confirmations from recognized airlines with matching reservation codes on their official domains are standard travel communications.',
      explanationHinglish: 'Flight ticket ka genuine confirmation email hai. Iska domain airline ka official portal hai.',
      safeNextStep: 'Open the airline\'s app and check your upcoming trips.'
    },

    // ----------------------------------------------------
    // Category 4: Impersonation & Authority (impersonation)
    // ----------------------------------------------------
    {
      id: 'scen_imp_01',
      category: 'impersonation',
      categoryName: 'Impersonation & Authority Scams',
      difficulty: 'beginner',
      sender: 'Caller / SMS claiming to be "Federal Police / Cyber Crime Bureau"',
      message: 'FINAL WARNING: An arrest warrant has been issued against your national ID number for money laundering. Call this number immediately or police will arrive at your address within 2 hours.',
      url: null,
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Call back in panic and offer to pay a fine to avoid arrest.', textHinglish: 'Ghabra kar call karein aur fine bharne ko bolein.' },
        { id: 'B', text: 'Impersonation extortion scam: Law enforcement agencies do not send arrest warnings via SMS or demand payment over the phone.', textHinglish: 'Digital arrest fraud: Police kabhi SMS par arrest warrant bhej kar phone par paise nahi maangti.' },
        { id: 'C', text: 'Pack your bags and run away.', textHinglish: 'Ghar chhod kar bhaag jayein.' },
        { id: 'D', text: 'Send them your bank login so they can verify you are innocent.', textHinglish: 'Bank login bhej kar khud ko innocent prove karein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Impersonation of law enforcement ("Cyber Crime Bureau / Federal Police").',
        'Extreme intimidation tactic ("arrest warrant", "police at your door in 2 hours").',
        'Designed to cause acute terror so the victim transfers money into a scammer\'s "safe account".'
      ],
      explanation: 'This is the infamous "digital arrest" / police extortion scam. Criminals impersonate police or customs officers, using forged letters and threats to intimidate innocent people into transferring their life savings.',
      explanationHinglish: 'Isko "digital arrest" scam kehte hain. Scammers police ya court ke naam par daraate hain taaki dar ke maare log unke account mein paise transfer kar dein. Asli police kabhi phone par paise nahi maangti.',
      safeNextStep: 'Hang up and ignore the SMS. Report the extortion attempt to your local police station or national cybercrime portal.'
    },
    {
      id: 'scen_imp_02',
      category: 'impersonation',
      categoryName: 'Impersonation & Authority Scams',
      difficulty: 'intermediate',
      sender: 'Email from "CEO David Vance" <ceo-office@company-exec-mail.invalid>',
      message: 'Are you at your desk right now? I am stuck in an urgent board meeting and need you to purchase ten $100 Apple gift cards for a client presentation. Keep this confidential and email the codes to me.',
      url: null,
      isVerifyOptimal: true,
      choices: [
        { id: 'A', text: 'Rush out to buy the gift cards with your own money to impress the CEO.', textHinglish: 'Turant jaakar apne paise se gift card khareedein.' },
        { id: 'B', text: 'Business Email Compromise (BEC): Verify the CEO\'s request through an independent internal channel (phone call or in person) before spending money.', textHinglish: 'CEO fraud (BEC): Kisi bhi aisi request par paise kharch karne se pehle CEO ko direct call karke ya milkar verify karein.' },
        { id: 'C', text: 'Reply asking what games the CEO wants to buy with Apple cards.', textHinglish: 'Reply karke puchein kaunsi game khareedni hai.' },
        { id: 'D', text: 'Send the company credit card PIN in an email.', textHinglish: 'Company credit card PIN email kar dein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Executive impersonation / Business Email Compromise (BEC).',
        'The sender email domain "company-exec-mail.invalid" is NOT the real company domain.',
        'Request for secrecy ("keep this confidential") to prevent you from asking colleagues.',
        'Payment in gift cards.'
      ],
      explanation: 'Executive gift-card fraud is one of the most common workplace scams. Attackers create fake email addresses displaying the CEO\'s name and pressure subordinate employees into buying gift cards before they have time to verify.',
      explanationHinglish: 'Yeh CEO impersonation scam hai. Scammer boss ke naam se fake email bhejta hai aur urgent gift cards maangta hai taaki aap dar ke maare bina check kiye paise de dein.',
      safeNextStep: 'Do NOT purchase gift cards. Verify directly with your manager or call the executive through verified internal phone directories.'
    },
    {
      id: 'scen_imp_03',
      category: 'impersonation',
      categoryName: 'Impersonation & Authority Scams',
      difficulty: 'advanced',
      sender: 'Audit Committee <internal-audit@enterprise.example.com>',
      message: 'Quarterly Vendor Compliance Review: Please review the attached quarterly summary spreadsheet for your department before the committee sync.',
      url: 'https://enterprise.example.com/intranet/audit/q3-summary',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Legitimate internal process: Official corporate intranet address, standard quarterly routine, no unusual pressure.', textHinglish: 'Legitimate corporate communication: Company ka official intranet link hai, standard process hai.' },
        { id: 'B', text: 'Fraudulent because audits are always illegal.', textHinglish: 'Audit hamesha illegal hota hai.' },
        { id: 'C', text: 'Malicious because it uses the word "review".', textHinglish: '"Review" word use hua hai isliye scam hai.' },
        { id: 'D', text: 'Forward the spreadsheet to the public internet.', textHinglish: 'Internet par share kar dein.' }
      ],
      correctChoiceId: 'A',
      evidence: [
        'Sender address uses the legitimate domain "enterprise.example.com".',
        'Standard operational business task.',
        'Links directly into authenticated internal company intranet.'
      ],
      explanation: 'Internal audit and compliance reviews are routine corporate activities. Because it uses the authentic domain and internal portal without suspicious anomalies, it represents normal business operations.',
      explanationHinglish: 'Office mein audit aur compliance emails normal hote hain. Yeh email company ke real domain se hai aur internal portal par ja raha hai.',
      safeNextStep: 'Access the review document through your company portal.'
    },
    {
      id: 'scen_imp_04',
      category: 'impersonation',
      categoryName: 'Impersonation & Authority Scams',
      difficulty: 'intermediate',
      sender: 'Tech Helpdesk Popup on Web Page',
      message: 'CRITICAL ALERT! Your Windows PC is infected with Trojan.Spyware.32. Call Microsoft Certified Technician toll-free at 1-800-555-0199 immediately. Do not shut down your computer!',
      url: null,
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Call the number right away and allow remote access to fix the virus.', textHinglish: 'Turant number par call karke computer ka remote access de dein.' },
        { id: 'B', text: 'Tech support browser scam: Browser web pages cannot scan your computer files, and Microsoft never puts phone numbers in virus popups.', textHinglish: 'Tech support scam: Koi web page aapka computer scan nahi kar sakta, aur Microsoft kabhi popup mein phone number nahi deta.' },
        { id: 'C', text: 'Throw your monitor out the window.', textHinglish: 'Monitor fek dein.' },
        { id: 'D', text: 'Pay them $400 for a lifetime antivirus subscription.', textHinglish: '$400 dekar subscription lein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Browser full-screen locker popup pretending to be Windows system software.',
        'Websites do not have permission or ability to scan your local hard drive for viruses.',
        'Microsoft, Apple, and Google NEVER display phone numbers to call in security alerts.'
      ],
      explanation: 'This is the classic "tech support scam". Rogue web pages use JavaScript to trap the cursor, play loud siren sounds, and display fake virus warnings to frighten users into calling call centers that charge hundreds of dollars for free utilities.',
      explanationHinglish: 'Yeh fake tech support popup hai. Browser ke kisi web page ke paas aapka computer scan karne ki power nahi hoti. Yeh sirf aapko dara kar call karwane ki koshish hai.',
      safeNextStep: 'Close the browser tab or press Alt+F4 / Ctrl+Shift+Esc to close the browser. Run a real scan using your computer\'s built-in Windows Security.'
    },
    {
      id: 'scen_imp_05',
      category: 'impersonation',
      categoryName: 'Impersonation & Authority Scams',
      difficulty: 'advanced',
      sender: 'School Administration <principal@academics-notice.invalid>',
      message: 'Urgent fee revision notice: Please transfer the semester lab fee directly to the new bank account number listed in the attachment within 24 hours.',
      url: null,
      isVerifyOptimal: true,
      choices: [
        { id: 'A', text: 'Transfer the fee right away to avoid school penalties.', textHinglish: 'Turant fees transfer kar dein.' },
        { id: 'B', text: 'High risk: Bank account change notices from spoofed or unfamiliar domains must be verified in person or via official school telephone numbers.', textHinglish: 'High risk: Bank account change ka notice aane par hamesha school office mein jakar ya official phone par verify karein.' },
        { id: 'C', text: 'Reply asking for a student discount.', textHinglish: 'Discount maangein.' },
        { id: 'D', text: 'Transfer double the amount to be safe.', textHinglish: 'Double fees bhar dein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Sudden change of bank account details for fee payments.',
        'Sent from an unfamiliar domain "academics-notice.invalid" instead of official school domain.',
        'Artificial 24-hour urgency deadline.'
      ],
      explanation: 'Account change fraud (mandate fraud) occurs when attackers impersonate educational institutions or contractors and claim that "bank details have changed". Always verify bank detail changes independently.',
      explanationHinglish: 'Bank account change hone ka koi bhi email aaye toh kabhi seedhe paise transfer na karein. School ya institute ke office jakar confirm karein.',
      safeNextStep: 'Contact the school administration office directly using the known phone number from your admission receipt.'
    },
    {
      id: 'scen_imp_06',
      category: 'impersonation',
      categoryName: 'Impersonation & Authority Scams',
      difficulty: 'beginner',
      sender: 'Social Media Direct Message from a friend\'s profile',
      message: 'Hey!! I am voting in an ambassador contest and need 2 more votes to win. Can I send you a 6-digit link code to vote for me?',
      url: null,
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Say yes and give them the code when it arrives on your phone.', textHinglish: 'Haa bolein aur code aane par de dein.' },
        { id: 'B', text: 'Scam: Your friend\'s account was hacked, and the attacker is trying to steal your account using SMS password reset.', textHinglish: 'Scam: Aapke dost ka account hack ho chuka hai aur ab woh aapka account hack karne ke liye reset code maang raha hai.' },
        { id: 'C', text: 'Ask the friend to vote for you in return.', textHinglish: 'Dost ko bolo woh bhi aapko vote kare.' },
        { id: 'D', text: 'Send them your Instagram password directly.', textHinglish: 'Instagram password bhej dein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Compromised friend account social engineering pattern.',
        'The "voting code" sent to your SMS is actually your own account password recovery code.',
        'Exploits friendship trust to bypass security verification.'
      ],
      explanation: 'When scammers compromise an account, they message all the person\'s friends asking for help in a "contest" or "voting". The code you receive is actually your own 2-factor recovery key.',
      explanationHinglish: 'Aapke dost ka account hack ho gaya hai. Scammer aapke number par "Forgot Password" dabayega aur bolega ki vote karne ka code aaya hai. Code dete hi aapka account chala jayega.',
      safeNextStep: 'Do NOT share the code. Call your friend on their mobile phone to let them know their social media profile has been compromised.'
    },

    // ----------------------------------------------------
    // Category 5: Social Pressure & Urgency (social_pressure)
    // ----------------------------------------------------
    {
      id: 'scen_soc_01',
      category: 'social_pressure',
      categoryName: 'Social Pressure & Urgency',
      difficulty: 'beginner',
      sender: 'Courier SMS from +1-555-0812',
      message: 'FINAL NOTICE: Your package will be RETURNED TO SENDER and a $35 restocking fee charged within 30 MINUTES unless you confirm redelivery now.',
      url: 'https://parcel-redeliver-fee.invalid/now',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Click quickly because 30 minutes is almost over.', textHinglish: 'Jaldi click karein kyunki 30 minute khatam hone wale hain.' },
        { id: 'B', text: 'Manufactured panic: Extreme artificial deadlines (30 minutes) are designed to stop you from inspecting the fake link.', textHinglish: 'Manufactured panic: 30 minute jaisi fake deadline isliye di jati hai taaki aap sochne ka time na le sakein.' },
        { id: 'C', text: 'Pay the $35 immediately.', textHinglish: '$35 pay kar dein.' },
        { id: 'D', text: 'Wait 29 minutes and then click.', textHinglish: '29 minute wait karke click karein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Absurd countdown timer ("30 MINUTES") designed to trigger emotional distress.',
        'Punitive financial threat ("$35 restocking fee").',
        'Suspicious throwaway domain "parcel-redeliver-fee.invalid".'
      ],
      explanation: 'Urgency is the primary psychological weapon of online scammers. Real delivery companies do not return packages within 30 minutes of sending a text message.',
      explanationHinglish: 'Scammers ki sabse badi taakat hoti hai "Darr aur Jaldbazi". Asli delivery company 30 minute mein parcel wapas nahi bhejti.',
      safeNextStep: 'Take a breath. Check your actual order history on the retailer where you made your purchase.'
    },
    {
      id: 'scen_soc_02',
      category: 'social_pressure',
      categoryName: 'Social Pressure & Urgency',
      difficulty: 'intermediate',
      sender: 'Crypto Community Admin on Discord',
      message: 'EXCLUSIVE MINT LIVE NOW! Only 47 tokens left! Anyone who connects their wallet in the next 10 minutes gets 5x guaranteed returns. Do not miss this once-in-a-lifetime opportunity!',
      url: 'https://free-crypto-airdrop-5x.invalid',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Connect your crypto wallet immediately to get the 5x return.', textHinglish: 'Turant wallet connect karke 5x profit lein.' },
        { id: 'B', text: 'FOMO drainer scam: The countdown exploits fear of missing out, and connecting your wallet executes a smart contract that empties it.', textHinglish: 'FOMO wallet drainer: Jaldi ka lalach dekar wallet connect karwayenge aur pura wallet khaali ho jayega.' },
        { id: 'C', text: 'Send your wallet seed phrase to the Discord admin.', textHinglish: 'Admin ko secret recovery seed phrase bhej dein.' },
        { id: 'D', text: 'Ask for 10x return instead of 5x.', textHinglish: '10x profit maangein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Severe FOMO (Fear Of Missing Out) psychological manipulation.',
        'Unrealistic financial guarantee ("5x guaranteed returns").',
        'Wallet drainer phishing page designed to steal cryptocurrency tokens.'
      ],
      explanation: 'Wallet drainers use manufactured scarcity ("only 47 left!", "next 10 minutes") so victims approve malicious wallet contract permissions without reading what functions they are signing.',
      explanationHinglish: 'Yeh wallet drainer scam hai. "Sirf 47 bache hain" bolkar aapko jaldbazi mein approval sign karwa liya jata hai aur saara crypto chori ho jata hai.',
      safeNextStep: 'Never connect your digital wallet to unverified links posted in social media chats.'
    },
    {
      id: 'scen_soc_03',
      category: 'social_pressure',
      categoryName: 'Social Pressure & Urgency',
      difficulty: 'advanced',
      sender: 'IT Operations Team <noreply@enterprise.example.com>',
      message: 'Reminder: Operating System Security Update is scheduled for deployment on Wednesday at 11:00 PM. Please leave your laptop powered on and connected to charger.',
      url: 'https://it-support.enterprise.example.com/kb/patch-notes',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Legitimate workplace maintenance: Clear scheduled window, official company subdomain, no login or financial demands.', textHinglish: 'Legitimate IT update: Company ka official domain hai, normal schedule hai, koi login ya paise nahi maange.' },
        { id: 'B', text: 'Dangerous attack because it mentions an update.', textHinglish: 'Attack kyunki update ki baat ho rahi hai.' },
        { id: 'C', text: 'Phishing: You must immediately unplug your computer.', textHinglish: 'Computer unplug kar dein.' },
        { id: 'D', text: 'Send an email demanding the CEO cancel the update.', textHinglish: 'CEO ko email karein.' }
      ],
      correctChoiceId: 'A',
      evidence: [
        'Originates from authentic corporate domain "enterprise.example.com".',
        'Provides advance notice (days ahead) rather than panic countdowns.',
        'Links to an internal knowledge base article without collecting credentials.'
      ],
      explanation: 'System updates with scheduled maintenance windows are routine enterprise hygiene. The presence of a date or schedule does not automatically make a message malicious.',
      explanationHinglish: 'Office ke IT updates pehle se scheduled hote hain. Isme koi urgent panic nahi hai aur link company ke official knowledge base par hai.',
      safeNextStep: 'Leave your laptop plugged in as requested for the scheduled patch.'
    },
    {
      id: 'scen_soc_04',
      category: 'social_pressure',
      categoryName: 'Social Pressure & Urgency',
      difficulty: 'intermediate',
      sender: 'Family Member on SMS from unknown number',
      message: 'Hi mom/dad, my phone was stolen at the airport and this is my friend\'s phone. I urgently need $350 for the taxi and hotel right now. Please transfer via UPI/Zelle to this number immediately! I will explain later.',
      url: null,
      isVerifyOptimal: true,
      choices: [
        { id: 'A', text: 'Transfer the money immediately because your child is stranded.', textHinglish: 'Turant paise bhej dein kyunki bacha musibat mein hai.' },
        { id: 'B', text: '"Hi Mom / Grandparent" scam: High emotional distress trick; verify by calling the family member\'s original phone number or another family member first.', textHinglish: '"Hi Mom" impersonation scam: Pehle apne bache ke purane number par call karein ya kisi aur family member se baat karke verify karein.' },
        { id: 'C', text: 'Block your child\'s real phone number.', textHinglish: 'Real number block karein.' },
        { id: 'D', text: 'Send $1,000 instead of $350.', textHinglish: '$1000 bhej dein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Classic "Hi Mom" / stranded relative impersonation scam.',
        'Exploits parental love and panic so money is sent before checking facts.',
        'Uses excuses ("phone stolen", "will explain later") to prevent voice verification.'
      ],
      explanation: 'Scammers text random numbers claiming to be a son or daughter in trouble with a broken or stolen phone. Always attempt to call the family member on their original number or reach out to friends before sending money.',
      explanationHinglish: 'Yeh "Hi Mom" scam hai. Scammers random numbers par message karke bacha bankar emergency ka natak karte hain. Hamesha pehle unke asli number par call karke confirm karein.',
      safeNextStep: 'Call your family member on their known cell phone number. You will often find they are sitting safely at home or work!'
    },
    {
      id: 'scen_soc_05',
      category: 'social_pressure',
      categoryName: 'Social Pressure & Urgency',
      difficulty: 'advanced',
      sender: 'Customer Service <support@retailer.example.com>',
      message: 'Your monthly statement for period ending Sep 30 is now available. Log in to your account dashboard to view transactions.',
      url: 'https://secure.retailer.example.com/statements/2026-09',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Legitimate service notification: Official domain, standard monthly billing cycle, HTTPS, no pressure.', textHinglish: 'Legitimate statement notification: Official domain hai, normal monthly statement hai, koi darr ya dhamki nahi hai.' },
        { id: 'B', text: 'Scam: Monthly statements are illegal.', textHinglish: 'Scam kyunki monthly statement illegal hota hai.' },
        { id: 'C', text: 'Phishing because the link contains numbers.', textHinglish: 'Phishing kyunki link mein numbers hain.' },
        { id: 'D', text: 'Throw away your credit card.', textHinglish: 'Card fek dein.' }
      ],
      correctChoiceId: 'A',
      evidence: [
        'Domain matches genuine merchant "retailer.example.com".',
        'Standard periodic statement notification.',
        'Uses secure HTTPS without sensationalist claims.'
      ],
      explanation: 'Routine monthly statements sent on predictable billing dates from verified domains are ordinary communications.',
      explanationHinglish: 'Har mahine aane wala regular bill ya statement email hai. Isme na koi emergency hai aur na koi fake link.',
      safeNextStep: 'Log into your account directly or through the provided official link to review your statement.'
    },
    {
      id: 'scen_soc_06',
      category: 'social_pressure',
      categoryName: 'Social Pressure & Urgency',
      difficulty: 'beginner',
      sender: 'Social Media Alert <security-team@instagram-verify.invalid>',
      message: 'Copyright Infringement Notice: Your account violates our trademark terms. Your profile will be PERMANENTLY DELETED in 24 hours. Fill the objection form here.',
      url: 'http://instagram.com.copyright-appeal.invalid/form',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Fill the form quickly to save your social media account.', textHinglish: 'Form jaldi bharein taaki account delete na ho.' },
        { id: 'B', text: 'Phishing: Uses trademark fear to trick you into entering credentials on "copyright-appeal.invalid".', textHinglish: 'Phishing: Trademark ka darr dikha kar fake domain "copyright-appeal.invalid" par login details maang rahe hain.' },
        { id: 'C', text: 'Apologize to the email sender and delete all your photos.', textHinglish: 'Maafi maangein aur photos delete karein.' },
        { id: 'D', text: 'Pay a copyright lawyer $1,000.', textHinglish: 'Lawyer ko paise dein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Fake copyright violation threat with account deletion countdown.',
        'Misleading subdomain placing "instagram.com" on the fraudulent domain "copyright-appeal.invalid".',
        'Uses unencrypted HTTP for a supposed credential appeal form.'
      ],
      explanation: 'Social media copyright phishing targets creators by threatening account deletion. Social media platforms handle copyright disputes inside their official app settings, not through unencrypted third-party links.',
      explanationHinglish: 'Instagram copyright scam mein creators ko account delete hone ka darr dikhaya jata hai. Official appeals hamesha app ke andar se hoti hain, kisi bahar ke link se nahi.',
      safeNextStep: 'Check the "Support Requests" or "Account Status" section directly inside your official social media app.'
    },

    // ----------------------------------------------------
    // Category 6: Technical Scams & Browser Warnings (technical_scams)
    // ----------------------------------------------------
    {
      id: 'scen_tech_01',
      category: 'technical_scams',
      categoryName: 'Technical & Browser Security',
      difficulty: 'beginner',
      sender: 'Website visiting experience',
      message: 'You clicked a link from an email and your browser shows a red warning screen: "Deceptive site ahead. Attackers on this site may trick you into doing something dangerous like installing software or revealing personal information."',
      url: 'https://bad-site.invalid/login',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Click "Advanced" and proceed anyway because the browser is probably being too cautious.', textHinglish: '"Proceed anyway" par click karke aage badhein.' },
        { id: 'B', text: 'Heed the warning: Close the tab immediately. Built-in browser security warnings are backed by global threat intelligence.', textHinglish: 'Browser ki warning maanein: Tab turant band karein. Browser ka red warning screen real threat detect hone par aata hai.' },
        { id: 'C', text: 'Turn off your antivirus software to make the red screen go away.', textHinglish: 'Antivirus band kar dein taaki red screen chali jaye.' },
        { id: 'D', text: 'Refresh the page 10 times.', textHinglish: '10 baar refresh karein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Browser Safe Browsing reputation engines flag active phishing sites.',
        'The site has been reported and verified as distributing malware or credential harvesting.',
        'Bypassing browser warnings puts your credentials at immediate risk.'
      ],
      explanation: 'Modern browsers (Chrome, Edge, Firefox, Safari) maintain verified lists of known malicious websites. When a full-page red deceptive site warning appears, you should never bypass it unless you are a security researcher in an isolated lab.',
      explanationHinglish: 'Jab browser red warning screen dikhata hai toh iska matlab yeh site already phishing ya malware ke liye verify ho chuki hai. Kabhi bhi "Proceed anyway" par click na karein.',
      safeNextStep: 'Close the browser tab immediately. Do not attempt to load the address again.'
    },
    {
      id: 'scen_tech_02',
      category: 'technical_scams',
      categoryName: 'Technical & Browser Security',
      difficulty: 'intermediate',
      sender: 'Online Shopping Portal',
      message: 'A seller on an online classifieds site offers a brand new laptop at 70% discount. The website URL displays a green padlock icon (HTTPS) with the address "https://185.220.101.5/checkout".',
      url: 'https://185.220.101.5/checkout',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'The padlock proves the website is 100% genuine and safe to buy from.', textHinglish: 'Padlock icon ka matlab website 100% safe aur genuine hai.' },
        { id: 'B', text: 'HTTPS only means the connection is encrypted; it does NOT mean the owner is honest. Hosting a checkout on a raw IP address is highly suspicious.', textHinglish: 'HTTPS ka matlab sirf encryption hai, honesty ki guarantee nahi. Raw IP address par checkout hona suspicious hai.' },
        { id: 'C', text: 'Raw IP addresses are faster, so this is a premium shopping site.', textHinglish: 'IP address fast hota hai isliye yeh premium site hai.' },
        { id: 'D', text: 'Pay with your debit card immediately.', textHinglish: 'Debit card se payment karein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'HTTPS padlock myth: HTTPS encrypts traffic between you and the server, but anyone (including scammers) can get free SSL certificates.',
        'Checkout page hosted directly on a numerical IP address (185.220.101.5).',
        'Unrealistic 70% discount on luxury electronics.'
      ],
      explanation: 'One of the most important cybersecurity lessons: HTTPS and the padlock icon do NOT mean a site is safe or legitimate! HTTPS simply means your communication is encrypted. If you send your credit card to a scammer over HTTPS, they will steal it securely!',
      explanationHinglish: 'Sabse bada myth: "HTTPS ya lock icon hai toh site safe hai". Bilkul nahi! HTTPS ka matlab sirf itna hai ki aapka data raste mein koi aur nahi padh sakta, par agar saamne scammer baitha hai toh woh aapka data chura lega.',
      safeNextStep: 'Leave the website. Never make purchases on sites hosted on raw numerical IP addresses.'
    },
    {
      id: 'scen_tech_03',
      category: 'technical_scams',
      categoryName: 'Technical & Browser Security',
      difficulty: 'advanced',
      sender: 'Software Repository <releases@tools.example.org>',
      message: 'Version 2.4.0 is now available. Download official binaries and verify SHA-256 checksums listed on the release notes.',
      url: 'https://tools.example.org/downloads/v2.4.0',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Legitimate open-source distribution: Authentic domain, provides cryptographic hash checksums for integrity verification.', textHinglish: 'Legitimate software release: Official domain hai, integrity verify karne ke liye checksum hash diya gaya hai.' },
        { id: 'B', text: 'Dangerous because it contains the word "hash".', textHinglish: 'Scam kyunki "hash" word likha hai.' },
        { id: 'C', text: 'Malware because official software is never updated.', textHinglish: 'Software update malware hota hai.' },
        { id: 'D', text: 'Run the file without checking anything.', textHinglish: 'Bina check kiye run karein.' }
      ],
      correctChoiceId: 'A',
      evidence: [
        'Authentic distribution domain "tools.example.org".',
        'Follows industry best practice of publishing cryptographic SHA-256 hashes.',
        'Standard developer release announcement.'
      ],
      explanation: 'Publishing cryptographic hashes allows users to verify that downloaded files have not been modified or corrupted in transit. This is standard software engineering practice.',
      explanationHinglish: 'Software release ke sath SHA-256 hash checksum dena industry standard security practice hai taaki pata chal sake file corrupt ya tamper nahi hui hai.',
      safeNextStep: 'Download from the official portal and verify the file checksum before running.'
    },
    {
      id: 'scen_tech_04',
      category: 'technical_scams',
      categoryName: 'Technical & Browser Security',
      difficulty: 'intermediate',
      sender: 'Browser notification prompt on a movie streaming site',
      message: 'Website "freemovies-online.invalid" wants to: Show notifications. "Click Allow to verify that you are not a robot!"',
      url: null,
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Click "Allow" so you can prove you are human and watch the movie.', textHinglish: '"Allow" par click karein taaki movie chal sake.' },
        { id: 'B', text: 'Notification abuse scam: The site is tricking you into granting permission to push spam, fake antivirus popups, and malicious ads directly to your desktop.', textHinglish: 'Notification scam: Yeh fake CAPTCHA dikha kar notification permission le lete hain aur desktop par gande ads aur fake virus popups bhejte hain.' },
        { id: 'C', text: 'Allow notifications and then give them your credit card.', textHinglish: 'Allow karke card details dein.' },
        { id: 'D', text: 'Click Allow on 5 different websites.', textHinglish: '5 sites par allow karein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Deceptive CAPTCHA: Legitimate CAPTCHAs never require granting browser notification permissions.',
        'Spam delivery mechanism that pushes rogue popups directly to Windows notification center.',
        'Common tactic on pirate streaming and file-sharing sites.'
      ],
      explanation: 'Scammers disguise browser notification permissions as fake "robot verification" buttons. Once allowed, they bombard your Windows notification tray with fake virus alerts and adult ads even when the browser is closed.',
      explanationHinglish: 'Yeh fake robot test hota hai. Asli CAPTCHA kabhi browser notification permission nahi maangta. Agar aapne Allow kar diya toh aapke Windows screen par lagataar fake virus ads aane lagenge.',
      safeNextStep: 'Click "Block" or close the website tab. Never grant notification permissions to unfamiliar websites.'
    },
    {
      id: 'scen_tech_05',
      category: 'technical_scams',
      categoryName: 'Technical & Browser Security',
      difficulty: 'advanced',
      sender: 'Domain registrar warning email',
      message: 'Notice: Renewal required for your domain name. Click to renew on: https://xn--pple-43d.com',
      url: 'https://xn--pple-43d.com',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'It looks like "apple.com" in the browser address bar, so it must be Apple.', textHinglish: 'Browser mein "apple.com" jaisa dikhta hai isliye safe hai.' },
        { id: 'B', text: 'IDN Homograph attack: The "xn--" prefix indicates Punycode; an attacker used Cyrillic "а" to imitate Latin "a".', textHinglish: 'Homograph attack: "xn--" ka matlab Punycode hai; attacker ne dusri language ka letter use karke duplicate domain banaya hai.' },
        { id: 'C', text: 'Punycode means the domain has military-grade encryption.', textHinglish: 'Punycode military encryption hota hai.' },
        { id: 'D', text: 'Renew for 10 years immediately.', textHinglish: '10 saal ke liye renew karein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Punycode representation "xn--pple-43d.com".',
        'Homograph spoofing: Cyrillic letter "а" (U+0430) looks identical to Latin "a" (U+0061) to the human eye.',
        'Classic advanced impersonation technique.'
      ],
      explanation: 'An Internationalized Domain Name (IDN) homograph attack uses characters from foreign alphabets that look identical to regular letters. Browsers display the raw "xn--" Punycode precisely to alert users to potential spoofing.',
      explanationHinglish: 'Isko "homograph attack" kehte hain. Attacker doosri bhasha ka letter use karta hai jo aankhon se bilkul same dikhta hai par computer ke liye alag hota hai. "xn--" dekh kar savdhaan ho jayein.',
      safeNextStep: 'Do not click or enter credentials on Punycode lookalike domains.'
    },
    {
      id: 'scen_tech_06',
      category: 'technical_scams',
      categoryName: 'Technical & Browser Security',
      difficulty: 'intermediate',
      sender: 'Shopping Cart Checkout',
      message: 'You are buying a gift on a store website. The checkout page URL is "http://boutique-shop.example.invalid/payment". There is no padlock icon and the browser displays "Not Secure".',
      url: 'http://boutique-shop.example.invalid/payment',
      isVerifyOptimal: false,
      choices: [
        { id: 'A', text: 'Enter your credit card number because small shops cannot afford HTTPS.', textHinglish: 'Card details daal dein kyunki choti shop HTTPS afford nahi kar sakti.' },
        { id: 'B', text: 'Unsafe: "http://" is completely unencrypted. Anyone on your local Wi-Fi or internet path can intercept your card details in plain text.', textHinglish: 'Unsafe: "http://" unencrypted hota hai. Wi-Fi par koi bhi aapka card number aur password chura sakta hai.' },
        { id: 'C', text: 'Type your card number in capital letters so it is encrypted.', textHinglish: 'Capital letters mein likhein.' },
        { id: 'D', text: 'Only pay if they offer free delivery.', textHinglish: 'Free delivery ho toh pay karein.' }
      ],
      correctChoiceId: 'B',
      evidence: [
        'Unencrypted HTTP protocol on a sensitive payment checkout page.',
        'Browser "Not Secure" warning indicator.',
        'Data transmitted across the network can be read or modified in plain text (Man-in-the-Middle).'
      ],
      explanation: 'Never enter payment information, passwords, or personal details on websites without HTTPS. Today, HTTPS is free for all website owners. An unencrypted payment page means your financial details travel as readable text across the internet.',
      explanationHinglish: 'Kabhi bhi kisi aise page par card details na daalein jisme "Not Secure" ya "http://" ho. Bina HTTPS ke aapka card number internet par khule aam transmit hota hai.',
      safeNextStep: 'Do not enter any payment details. Leave the unencrypted checkout page.'
    }
  ];

  global.CyberShield.SCENARIOS = SCENARIOS;
})(window);
