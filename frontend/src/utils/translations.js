// Comprehensive Multilingual Localization Dictionary for CyberGuard AI
// Specially tailored for Indian Citizens, Law Enforcement, and Rural/Urban Complainants in English, Telugu, and Hindi

export const instructionTranslations = {
  en: {
    langCode: 'en',
    langName: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    title: 'CHECK LIST FOR COMPLAINANT',
    subtitle: 'Please keep this information ready before filing your complaint:',
    selectLang: 'Select Language:',
    readAloud: 'Read Aloud',
    stopAudio: 'Stop Audio',
    copyChecklist: 'Copy Checklist',
    copiedText: 'Copied to Clipboard!',
    downloadChecklist: 'Download Guide',
    printChecklist: 'Print Guide',
    helplineText: 'National Cyber Crime Helpline:',
    urgentCallText: 'Golden Hour Fraud Helpline (Dial 1930)',
    mandatoryHeader: 'Mandatory Information',
    requiredBadge: 'Required',
    mandatoryItems: [
      {
        id: 1,
        title: 'Incident Date and Time.',
        desc: 'Accurate timestamp and date when the cyber incident occurred.',
      },
      {
        id: 2,
        title: 'Incident details',
        desc: 'Minimum 20 characters describing the event chronologically',
        suffix: '.',
      },
      {
        id: 3,
        title: 'Soft copy of any National ID',
        desc: 'Voter ID, Driving License, Passport, PAN Card, or Aadhaar Card in',
        formats: '.jpeg, .jpg, .png',
        maxSize: '5 MB',
      },
      {
        id: 4,
        isFinancial: true,
        title: 'In case of financial fraud, please keep following information ready:',
        financialItems: [
          { label: 'Name of the Bank / Wallet / Merchant', hint: '(e.g., SBI, PhonePe, Paytm, Amazon Pay)' },
          { label: '12-digit Transaction ID / UTR No.', hint: '(Required to freeze stolen money)' },
          { label: 'Date and exact time of transaction', hint: '' },
          { label: 'Total fraud amount lost (in ₹)', hint: '' },
        ],
      },
      {
        id: 5,
        title: 'Soft copy of all relevant evidences',
        desc: 'Screenshots, call logs, audio recordings, emails, or PDF receipts related to the cyber crime (not more than',
        maxSize: '10 MB each',
        suffix: ').',
      },
    ],
    optionalHeader: 'Optional / Desirable Information',
    optionalBadge: 'Helpful for Investigation',
    optionalItems: [
      {
        id: 1,
        title: 'Suspected website URLs / Social Media handles',
        desc: '(wherever applicable: phishing links, fake profile usernames, or malicious app links).',
      },
      {
        id: 2,
        isSuspectDetails: true,
        title: 'Suspect Details (if available):',
        suspectFields: [
          'Mobile / WhatsApp No.',
          'Email ID',
          'Bank Account No. & IFSC',
          'Address / Physical Location',
          'Soft copy of photograph of suspect (.jpeg, .jpg, .png <= 5 MB)',
          'Any other document / chat backup through which suspect can be identified.',
        ],
      },
    ],
    summaryText: `CHECK LIST FOR COMPLAINANT
Please keep this information ready before filing your complaint:

Mandatory Information:
1. Incident Date and Time.
2. Incident details (minimum 20 characters) describing the event chronologically.
3. Soft copy of any national ID (Voter ID, Driving license, Passport, PAN Card, Aadhaar Card) in .jpeg, .jpg, .png format (file size <= 5 MB).
4. In case of financial fraud:
   i) Name of Bank / Wallet / Merchant
   ii) 12-digit Transaction ID / UTR No.
   iii) Date of transaction
   iv) Fraud amount (₹)
5. Soft copy of all relevant evidences related to cyber crime (<= 10 MB each).

Optional/Desirable Information:
1. Suspected website URLs / Social Media handles (wherever applicable)
2. Suspect Details (if available):
   i) Mobile No
   ii) Email ID
   iii) Bank Account No
   iv) Address
   v) Soft copy of photograph of suspect (.jpeg, .jpg, .png <= 5 MB)
   vi) Any other document through which suspect can be identified.

National Cyber Crime Helpline: 1930`,
  },

  te: {
    langCode: 'te',
    langName: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    title: 'ఫిర్యాదుదారునికి సూచనలు & చెక్‌లిస్ట్',
    subtitle: 'ఫిర్యాదు నమోదు చేసే ముందు దయచేసి క్రింది సమాచారాన్ని సిద్ధంగా ఉంచుకోండి:',
    selectLang: 'భాషను ఎంచుకోండి:',
    readAloud: 'వినండి (చదవండి)',
    stopAudio: 'ఆపండి',
    copyChecklist: 'చెక్‌లిస్ట్ కాపీ చేయండి',
    copiedText: 'క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది!',
    downloadChecklist: 'గైడ్ డౌన్‌లోడ్',
    printChecklist: 'గైడ్ ప్రింట్ చేయండి',
    helplineText: 'జాతీయ సైబర్ క్రైమ్ హెల్ప్‌లైన్:',
    urgentCallText: 'గోల్డెన్ అవర్ ఫ్రాడ్ హెల్ప్‌లైన్ (1930 కి కాల్ చేయండి)',
    mandatoryHeader: 'తప్పనిసరి సమాచారం (Mandatory Info)',
    requiredBadge: 'తప్పనిసరి',
    mandatoryItems: [
      {
        id: 1,
        title: 'నేరం జరిగిన తేదీ మరియు సమయం.',
        desc: 'సైబర్ మోసం ఎప్పుడు జరిగిందో ఖచ్చితమైన తేదీ మరియు సమయం నమోదు చేయాలి.',
      },
      {
        id: 2,
        title: 'సంఘటన పూర్తి వివరాలు',
        desc: 'కనీసం 20 అక్షరాలలో వివరంగా రాయండి. ప్రత్యేక చిహ్నాలు ఉపయోగించరాదు',
        code: '(#$@^*~|!)',
        suffix: '.',
      },
      {
        id: 3,
        title: 'జాతీయ గుర్తింపు కార్డు కాపీ (National ID)',
        desc: 'ఓటర్ ఐడీ, డ్రైవింగ్ లైసెన్స్, పాస్‌పోర్ట్, పాన్ కార్డ్, ఆధార్ కార్డ్ కాపీ',
        formats: '.jpeg, .jpg, .png',
        maxSize: '5 MB లోపు',
      },
      {
        id: 4,
        isFinancial: true,
        title: 'ఆర్థిక మోసం (డబ్బు పోయినప్పుడు) సిద్ధంగా ఉంచుకోవాల్సినవి:',
        financialItems: [
          { label: 'బ్యాంక్ / వాలెట్ / మర్చంట్ పేరు', hint: '(ఉదా: SBI, PhonePe, Google Pay, Paytm)' },
          { label: '12 అంకెల ట్రాన్సాక్షన్ ఐడీ / UTR నంబర్', hint: '(డబ్బు రికవరీకి అత్యవసరం)' },
          { label: 'లావాదేవీ జరిగిన తేదీ & సమయం', hint: '' },
          { label: 'మోసపోయిన మొత్తం మొత్తం (రూపాయలలో ₹)', hint: '' },
        ],
      },
      {
        id: 5,
        title: 'సైబర్ నేరానికి సంబంధించిన సాక్ష్యాధారాలు',
        desc: 'స్క్రీన్‌షాట్లు, కాల్ రికార్డింగులు, ఆడియో, ఈమెయిల్స్ లేదా PDF రసీదులు (ఒక్కో ఫైల్ గరిష్టంగా',
        maxSize: '10 MB లోపు',
        suffix: ').',
      },
    ],
    optionalHeader: 'ఐచ్ఛికం / దర్యాప్తుకు ఉపయోగపడే అదనపు సమాచారం',
    optionalBadge: 'పోలీస్ విచారణకు సులభం',
    optionalItems: [
      {
        id: 1,
        title: 'అనుమానిత వెబ్‌సైట్ లింకులు / సోషల్ మీడియా ప్రొఫైల్స్',
        desc: '(నకిలీ లింకులు, ఫేస్‌బుక్/ఇన్‌స్టాగ్రామ్ ఐడీలు లేదా అనుమానిత యాప్ లింకులు).',
      },
      {
        id: 2,
        isSuspectDetails: true,
        title: 'నిందితుడి వివరాలు (లభ్యమైతే):',
        suspectFields: [
          'మొబైల్ / వాట్సాప్ నంబర్',
          'ఈమెయిల్ చిరునామా (Email ID)',
          'బ్యాంక్ ఖాతా సంఖ్య & IFSC కోడ్',
          'చిరునామా / లొకేషన్ వివరాలు',
          'నిందితుడి ఫోటో (.jpeg, .jpg, .png 5 MB లోపు)',
          'చాట్ హిస్టరీ / ఇతర గుర్తింపు పత్రాలు.',
        ],
      },
    ],
    summaryText: `ఫిర్యాదుదారునికి సూచనలు & చెక్‌లిస్ట్
ఫిర్యాదు నమోదు చేసే ముందు దయచేసి క్రింది సమాచారాన్ని సిద్ధంగా ఉంచుకోండి:

తప్పనిసరి సమాచారం:
1. నేరం జరిగిన తేదీ మరియు సమయం.
2. సంఘటన పూర్తి వివరాలు (కనీసం 20 అక్షరాలు) ప్రత్యేక చిహ్నాలు (#$@^*~|!) లేకుండా.
3. జాతీయ గుర్తింపు కార్డు కాపీ (ఓటర్ ఐడీ, డ్రైవింగ్ లైసెన్స్, పాస్‌పోర్ట్, పాన్ కార్డ్, ఆధార్ కార్డ్) - .jpeg, .jpg, .png (5 MB లోపు).
4. ఆర్థిక మోసం జరిగినప్పుడు:
   i) బ్యాంక్ / వాలెట్ / మర్చంట్ పేరు
   ii) 12 అంకెల ట్రాన్సాక్షన్ ఐడీ / UTR నంబర్
   iii) లావాదేవీ జరిగిన తేదీ & సమయం
   iv) మోసపోయిన మొత్తం మొత్తం (₹)
5. సైబర్ నేరానికి సంబంధించిన అన్ని సాక్ష్యాధారాల సాఫ్ట్ కాపీలు (ఒక్కోటి 10 MB లోపు).

ఐచ్ఛికం / దర్యాప్తుకు ఉపయోగపడే అదనపు సమాచారం:
1. అనుమానిత వెబ్‌సైట్ లింకులు / సోషల్ మీడియా ప్రొఫైల్స్ (వర్తించే చోట)
2. నిందితుడి వివరాలు (లభ్యమైతే):
   i) మొబైల్ నంబర్
   ii) ఈమెయిల్ ఐడీ
   iii) బ్యాంక్ ఖాతా సంఖ్య
   iv) చిరునామా
   v) నిందితుడి ఫోటో (.jpeg, .jpg, .png <= 5 MB)
   vi) నిందితుడిని గుర్తించడానికి ఉపయోగపడే ఇతర పత్రాలు.

జాతీయ సైబర్ క్రైమ్ హెల్ప్‌లైన్ నంబర్: 1930`,
  },

  hi: {
    langCode: 'hi',
    langName: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    title: 'शिकायतकर्ता के लिए निर्देश एवं चेकलिस्ट',
    subtitle: 'शिकायत दर्ज करने से पहले कृपया निम्नलिखित जानकारी तैयार रखें:',
    selectLang: 'भाषा चुनें:',
    readAloud: 'सुनें (बोलकर पढ़ें)',
    stopAudio: 'रोकें',
    copyChecklist: 'चेकलिस्ट कॉपी करें',
    copiedText: 'क्लिपबोर्ड पर कॉपी हो गया!',
    downloadChecklist: 'गाइड डाउनलोड करें',
    printChecklist: 'गाइड प्रिंट करें',
    helplineText: 'राष्ट्रीय साइबर अपराध हेल्पलाइन:',
    urgentCallText: 'गोल्डन ऑवर वित्तीय धोखाधड़ी हेल्पलाइन (1930 पर कॉल करें)',
    mandatoryHeader: 'अनिवार्य जानकारी (Mandatory Info)',
    requiredBadge: 'अनिवार्य',
    mandatoryItems: [
      {
        id: 1,
        title: 'घटना की तिथि एवं समय।',
        desc: 'साइबर अपराध कब हुआ, उसकी सटीक तिथि और समय।',
      },
      {
        id: 2,
        title: 'घटना का विस्तृत विवरण',
        desc: 'कम से कम 20 अक्षरों में घटना का स्पष्ट विवरण, बिना किसी विशेष वर्ण',
        code: '(#$@^*~|!)',
        suffix: ' के।',
      },
      {
        id: 3,
        title: 'राष्ट्रीय पहचान पत्र की सॉफ्ट कॉपी',
        desc: 'मतदाता पहचान पत्र, ड्राइविंग लाइसेंस, पासपोर्ट, पैन कार्ड या आधार कार्ड',
        formats: '.jpeg, .jpg, .png',
        maxSize: '5 MB से कम',
      },
      {
        id: 4,
        isFinancial: true,
        title: 'वित्तीय धोखाधड़ी (पैसों के नुकसान) के मामले में जरूरी जानकारी:',
        financialItems: [
          { label: 'बैंक / वॉलेट / मर्चेंट का नाम', hint: '(जैसे: SBI, PhonePe, Google Pay, Paytm)' },
          { label: '12 अंकों का ट्रांजैक्शन आईडी / UTR नंबर', hint: '(पैसों का ट्रांसफर रोकने हेतु अनिवार्य)' },
          { label: 'लेनदेन की तिथि एवं सटीक समय', hint: '' },
          { label: 'धोखाधड़ी में गंवाई गई कुल राशि (₹ में)', hint: '' },
        ],
      },
      {
        id: 5,
        title: 'अपराध से जुड़े सभी प्रासंगिक साक्ष्य',
        desc: 'स्क्रीनशॉट, कॉल रिकॉर्डिंग, ऑडियो, ईमेल या पीडीएफ रसीदें (प्रत्येक फाइल',
        maxSize: '10 MB से कम',
        suffix: ')।',
      },
    ],
    optionalHeader: 'वैकल्पिक / जांच हेतु उपयोगी जानकारी',
    optionalBadge: 'जांच में सहायक',
    optionalItems: [
      {
        id: 1,
        title: 'संदिग्ध वेबसाइट लिंक / सोशल मीडिया हैंडल',
        desc: '(संदिग्ध वेबसाइट यूआरएल, फर्जी सोशल मीडिया प्रोफाइल या संदेहास्पद एपीके फाइल लिंक)।',
      },
      {
        id: 2,
        isSuspectDetails: true,
        title: 'संदिग्ध व्यक्ति का विवरण (यदि उपलब्ध हो):',
        suspectFields: [
          'मोबाइल / व्हाट्सएप नंबर',
          'ईमेल आईडी (Email ID)',
          'बैंक खाता संख्या एवं IFSC कोड',
          'पता / निवास स्थान',
          'संदिग्ध की तस्वीर (.jpeg, .jpg, .png 5 MB से कम)',
          'चैट बैकअप या अन्य पहचान दस्तावेज।',
        ],
      },
    ],
    summaryText: `शिकायतकर्ता के लिए निर्देश एवं चेकलिस्ट
शिकायत दर्ज करने से पहले कृपया निम्नलिखित जानकारी तैयार रखें:

अनिवार्य जानकारी:
1. घटना की तिथि एवं समय।
2. घटना का पूरा विवरण (कम से कम 20 अक्षर) बिना किसी विशेष वर्ण (#$@^*~|!) के।
3. किसी भी राष्ट्रीय पहचान पत्र की प्रति (मतदाता पहचान पत्र, ड्राइविंग लाइसेंस, पासपोर्ट, पैन कार्ड, आधार कार्ड) - .jpeg, .jpg, .png (5 MB से कम)।
4. वित्तीय धोखाधड़ी के मामले में:
   i) बैंक / वॉलेट / मर्चेंट का नाम
   ii) 12 अंकों का ट्रांजैक्शन आईडी / UTR नंबर
   iii) लेनदेन की तिथि एवं समय
   iv) धोखाधड़ी की राशि (₹)
5. साइबर अपराध से संबंधित सभी साक्ष्यों की सॉफ्ट कॉपी (प्रत्येक 10 MB से कम)।

वैकल्पिक / जांच में सहायक जानकारी:
1. संदिग्ध वेबसाइट लिंक / सोशल मीडिया हैंडल
2. संदिग्ध का विवरण (यदि उपलब्ध हो):
   i) मोबाइल नंबर
   ii) ईमेल आईडी
   iii) बैंक खाता संख्या
   iv) पता
   v) संदिग्ध की फोटो (.jpeg, .jpg, .png <= 5 MB)
   vi) कोई अन्य दस्तावेज जिससे संदिग्ध की पहचान हो सके।

राष्ट्रीय साइबर अपराध हेल्पलाइन नंबर: 1930`,
  },
};

export const translations = {
  en: {
    // General Brand & Navigation
    brandTitle: 'CyberGuard AI',
    brandCitizenSub: 'Citizen Portal',
    brandAdminSub: 'Law Enforcement Desk',
    navDashboard: 'Dashboard',
    navInstructions: 'Instructions',
    navGuidelines: 'Guidelines (EN/తె/हि)',
    navReportCrime: 'Report Incident',
    navTrackStatus: 'Track Status',
    navMyComplaints: 'My Complaints',
    navNotifications: 'Notifications',
    navSettings: 'Settings',
    navProfile: 'Profile',
    navLogout: 'Logout',
    navSignIn: 'Sign In / Register',
    navAdminDashboard: 'Admin Dashboard',
    navAdminComplaints: 'Complaint Management',
    navAdminStatus: 'Update Status',
    navAdminAnalytics: 'Reports & Analytics',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',

    // Status Values
    statusSubmitted: 'Submitted',
    statusUnderReview: 'Under Review',
    statusInvestigating: 'Investigating',
    statusResolved: 'Resolved',
    statusAll: 'All Statuses',

    // Priority Values
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    priorityAll: 'All Priorities',

    // Crime Categories
    catPhishing: 'Phishing',
    catOnlineFraud: 'Online Fraud',
    catIdentityTheft: 'Identity Theft',
    catSocialMediaScam: 'Social Media Scam',
    catCyberbullying: 'Cyberbullying',
    catMalware: 'Malware / Ransomware',
    catJobScam: 'Job & Employment Scam',
    catMatrimonial: 'Matrimonial Scam',
    catLoanScam: 'Illegal Loan App Fraud',

    // User Dashboard Module
    dashWelcome: 'Welcome',
    dashSubtitle: 'Report cyber crimes and track the investigation status of your complaints in real-time.',
    dashBannerTitle: 'Checklist & Basic Requirements for Filing New Complaints',
    dashBannerDesc: 'Keep your National ID, 20+ char incident details, Bank UTR No., and evidence files ready.',
    dashViewInstructions: 'View Instructions',
    dashStatTotal: 'Total Complaints',
    dashStatPending: 'Under Review / Submitted',
    dashStatInvestigating: 'Investigating',
    dashStatResolved: 'Resolved',
    dashRecentTitle: 'Your Recent Complaints',
    dashViewAll: 'View All',
    dashNoComplaints: 'No complaints registered yet under your account.',
    dashStatusOverview: 'Complaint Status Overview',
    dashReportIncidentBtn: '+ Report Incident',
    dashTrackStatusBtn: 'Track Status',
    dashBackToDashboard: 'Back to Dashboard',

    // Submit Complaint Module
    submitTitle: 'File New Cyber Crime Complaint',
    submitSubtitle: 'Follow the complainant instructions checklist and provide necessary evidences for rapid police action.',
    submitStep1: 'Complainant Info',
    submitStep2: 'Incident Details',
    submitStep3: 'Financial & Suspect Info',
    submitStep4: 'Evidence & AI Triage',
    submitFullName: 'Full Name',
    submitEmail: 'Email Address',
    submitPhone: 'Mobile Number (10 Digits)',
    submitIdType: 'National ID Type',
    submitUploadId: 'Upload National ID Soft Copy',
    submitIdMaxSize: '(Voter ID, Aadhaar, PAN, Passport <= 5 MB)',
    submitCategoryLabel: 'Cyber Crime Category',
    submitCategorySelect: 'Select Crime Category',
    submitIncidentDate: 'Date & Time of Incident',
    submitIncidentDetails: 'Incident Description (Minimum 20 characters)',
    submitIncidentDetailsHint: 'Chronologically explain how you were contacted, what happened, and damages caused in detail (minimum 20 characters).',
    submitSuspectUrl: 'Suspected Website URL / Profile Link',
    submitBankName: 'Bank / Wallet / Merchant Name',
    submitUtrNo: '12-Digit Transaction ID / UTR No.',
    submitFraudAmount: 'Fraud Amount Lost (₹)',
    submitSuspectName: 'Suspect Name (if known)',
    submitSuspectPhone: 'Suspect Mobile / WhatsApp No.',
    submitSuspectEmail: 'Suspect Email Address',
    submitSuspectBank: 'Suspect Bank Account & IFSC',
    submitSuspectAddress: 'Suspect Address / Location',
    submitUploadEvidence: 'Upload Evidence Files',
    submitEvidenceHint: 'Upload screenshots, audio logs, PDF receipts, or video proof (Max 10 MB per file)',
    submitTakePhoto: 'Take Photo via Camera',
    submitAiPreviewTitle: 'Live AI Crime Classifier & Triage',
    submitAiCategory: 'Predicted Category',
    submitAiPriority: 'Predicted Urgency',
    submitAiConfidence: 'Neural Confidence',
    submitDeclaration: 'I hereby declare that all information and evidence submitted are true and accurate to the best of my knowledge.',
    submitBtn: 'Submit Complaint',
    submittingBtn: 'Submitting & Analyzing with AI...',
    submitSuccessTitle: 'Complaint Submitted Successfully!',
    submitSuccessDesc: 'Your complaint has been assigned a unique Tracking Reference ID. Officers have been notified.',
    submitAckRef: 'Acknowledgement Number',
    submitDownloadAck: 'Download Official PDF Acknowledgement',
    submitTrackNow: 'Track This Complaint Now',

    // Track Complaint Module
    trackTitle: 'Track Cyber Crime Complaint',
    trackSubtitle: 'Enter your Complaint ID / Acknowledgement Number to see live investigation progress and assigned officer logs.',
    trackSearchPlaceholder: 'Enter Complaint ID (e.g., CC-2026-89241)',
    trackBtn: 'Track Complaint',
    trackTimelineTitle: 'Investigation Lifecycle Timeline',
    trackStageSubmitted: 'Complaint Registered',
    trackStageUnderReview: 'Under Officer Review',
    trackStageInvestigating: 'Investigation & Bank Lien',
    trackStageResolved: 'Case Solved / Closed',
    trackOfficerTitle: 'Assigned Cyber Crime Officer',
    trackOfficerName: 'Investigating Officer',
    trackOfficerStation: 'Cyber Crime Police Station',
    trackOfficerBadge: 'Badge Number',
    trackOfficerContact: 'Official Contact / Desk',
    trackFirNumber: 'FIR Number',
    trackFirSection: 'Legal Sections (IT Act 2000)',
    trackEvidenceAttached: 'Verified Evidence Documents',
    trackPrintSlip: 'Print Case Summary',
    trackDownloadPdf: 'Download Tracking Slip',
    trackNotFound: 'No complaint found with the provided ID. Please verify and try again.',

    // My Complaints Module
    myComplaintsTitle: 'My Registered Complaints',
    myComplaintsSubtitle: 'Complete history and real-time investigation logs for all your filed complaints.',
    myFilterSearch: 'Search by ID, title, or category...',
    myFilterStatus: 'Filter by Status',
    myFilterCategory: 'Filter by Category',
    myColId: 'Complaint ID',
    myColDate: 'Filed Date',
    myColTitle: 'Subject / Incident',
    myColCategory: 'Category',
    myColPriority: 'Priority',
    myColStatus: 'Current Status',
    myColActions: 'Actions',
    myActionTrack: 'Track',
    myActionDetails: 'View Details',
    myNoComplaintsFound: 'No complaints found matching your search criteria.',
    myFileNewBtn: '+ File New Complaint',

    // Notifications Module
    notifTitle: 'Notifications & Alerts',
    notifSubtitle: 'Real-time incident updates, police actions, and case resolution alerts.',
    notifMarkAllRead: 'Mark All as Read',
    notifClearAll: 'Clear All',
    notifNoAlerts: 'You have no new notifications.',

    // User Profile Module
    profileTitle: 'User Profile & Identity',
    profileSubtitle: 'Manage your verified citizen profile, contact details, and account security.',
    profileSaveBtn: 'Save Profile Changes',
    profileSaving: 'Saving...',

    // Settings Module
    settingsTitle: 'Settings & Preferences',
    settingsSubtitle: 'Manage your account security, notification alerts, language, and system preferences.',
    adminSettingsTitle: 'Command & System Settings',
    adminSettingsSubtitle: 'Configure AI triage, law enforcement alerts, crime classification parameters, and security policies.',
    tabAccount: 'My Account',
    tabSecurity: 'Password & Security',
    tabNotifications: 'Notifications',
    tabPreferences: 'Language & Theme',
    tabAiSettings: 'AI Settings',
    tabSystem: 'System & Diagnostics',
    tabPrivacy: 'Privacy & Safety',
    tabAbout: 'About & Helpline',
    prefHeading: 'Language & Appearance',
    prefDesc: 'Choose your preferred regional language and visual theme. Changes apply across the entire portal immediately.',
    languageSelection: 'Portal Display Language (అన్ని మాడ్యూల్స్ భాష / सभी मॉड्यूल की भाषा)',
    langEn: 'English',
    langTe: 'తెలుగు (Telugu)',
    langHi: 'हिन्दी (Hindi)',
    themeSelection: 'Appearance Theme',
    themeDark: 'Dark Mode (Cyber Blue)',
    themeLight: 'Light Mode (High Contrast)',
    themeSystem: 'Match System Default',
    
    // Help & Common
    helpline1930Title: 'National Cyber Crime Helpline Number: 1930',
    helpline1930Desc: 'Dial 1930 immediately within the golden hour if you lost money in an online fraud.',
    btnSave: 'Save Changes',
    btnCancel: 'Cancel',
    btnClose: 'Close',
    btnBack: 'Back',
    btnNext: 'Next',
    btnCopy: 'Copy',
    btnCopied: 'Copied!',
    btnDownload: 'Download',
    btnPrint: 'Print',
  },

  te: {
    // General Brand & Navigation
    brandTitle: 'సైబర్‌గార్డ్ AI (CyberGuard)',
    brandCitizenSub: 'పౌరుల పోర్టల్ (Citizen Portal)',
    brandAdminSub: 'పోలీస్ కమాండ్ డెస్క్ (Police Desk)',
    navDashboard: 'డ్యాష్‌బోర్డ్ (Dashboard)',
    navInstructions: 'సూచనలు & గైడ్‌లైన్స్',
    navGuidelines: 'గైడ్‌లైన్స్ (EN/తె/హి)',
    navReportCrime: 'ఫిర్యాదు నమోదు (+ Report)',
    navTrackStatus: 'స్టేటస్ ట్రాకింగ్ (Track)',
    navMyComplaints: 'నా ఫిర్యాదులు (Complaints)',
    navNotifications: 'నోటిఫికేషన్లు (Alerts)',
    navSettings: 'సెట్టింగ్‌లు (Settings)',
    navProfile: 'ప్రొఫైల్ (Profile)',
    navLogout: 'లాగౌట్ (Logout)',
    navSignIn: 'లాగిన్ / రిజిస్ట్రేషన్',
    navAdminDashboard: 'అడ్మిన్ డ్యాష్‌బోర్డ్',
    navAdminComplaints: 'ఫిర్యాదుల నిర్వహణ',
    navAdminStatus: 'స్టేటస్ అప్‌డేట్',
    navAdminAnalytics: 'రిపోర్ట్స్ & అనలిటిక్స్',
    themeLight: 'లైట్ మోడ్ (వెలుగు)',
    themeDark: 'డార్క్ మోడ్ (రాత్రి వేళ)',

    // Status Values
    statusSubmitted: 'నమోదు చేయబడింది (Submitted)',
    statusUnderReview: 'పరిశీలనలో ఉంది (Under Review)',
    statusInvestigating: 'విచారణ జరుగుతోంది (Investigating)',
    statusResolved: 'పరిష్కరించబడింది (Resolved)',
    statusAll: 'అన్ని స్టేటస్‌లు (All)',

    // Priority Values
    priorityHigh: 'అత్యధికం (High)',
    priorityMedium: 'మధ్యస్థం (Medium)',
    priorityLow: 'సాధారణం (Low)',
    priorityAll: 'అన్ని ప్రాధాన్యతలు (All)',

    // Crime Categories
    catPhishing: 'ఫిషింగ్ & నకిలీ లింకులు',
    catOnlineFraud: 'ఆన్‌లైన్ / UPI ఆర్థిక మోసం',
    catIdentityTheft: 'నకిలీ గుర్తింపు & ఫొటోల దుర్వినియోగం',
    catSocialMediaScam: 'సోషల్ మీడియా మోసాలు',
    catCyberbullying: 'సైబర్ వేధింపులు & బెదిరింపులు',
    catMalware: 'వైరస్ & రాన్సమ్‌వేర్ దాడులు',
    catJobScam: 'ఉద్యోగ మోసాలు (Job Scam)',
    catMatrimonial: 'వివాహ బ్రోకర్ మోసాలు',
    catLoanScam: 'నకిలీ లోన్ యాప్ మోసాలు',

    // User Dashboard Module
    dashWelcome: 'స్వాగతం',
    dashSubtitle: 'సైబర్ క్రైమ్ ఫిర్యాదులను నమోదు చేయండి మరియు వాటి విచారణ స్థితిని ఎప్పటికప్పుడు తెలుసుకోండి.',
    dashBannerTitle: 'కొత్త ఫిర్యాదు నమోదు చేయడానికి అవసరమైన వివరాల చెక్‌లిస్ట్',
    dashBannerDesc: 'మీ జాతీయ గుర్తింపు కార్డు, 20+ అక్షరాల సంఘటన వివరాలు, బ్యాంక్ UTR నంబర్ మరియు సాక్ష్యాలను సిద్ధంగా ఉంచుకోండి.',
    dashViewInstructions: 'సూచనలు చూడండి',
    dashStatTotal: 'మొత్తం ఫిర్యాదులు',
    dashStatPending: 'పరిశీలనలో ఉన్నవి / నమోదైనవి',
    dashStatInvestigating: 'విచారణలో ఉన్నవి',
    dashStatResolved: 'పరిష్కారమైనవి',
    dashRecentTitle: 'మీ ఇటీవలి ఫిర్యాదులు',
    dashViewAll: 'అన్నీ చూడండి',
    dashNoComplaints: 'మీ ఖాతాలో ఇప్పటివరకు ఎలాంటి ఫిర్యాదులు నమోదు కాలేదు.',
    dashStatusOverview: 'ఫిర్యాదుల స్థితి చార్ట్ (Status)',
    dashReportIncidentBtn: '+ ఫిర్యాదు నమోదు చేయండి',
    dashTrackStatusBtn: 'స్టేటస్ ట్రాక్ చేయండి',
    dashBackToDashboard: 'డ్యాష్‌బోర్డ్‌కి తిరిగి వెళ్లండి',

    // Submit Complaint Module
    submitTitle: 'కొత్త సైబర్ క్రైమ్ ఫిర్యాదు నమోదు',
    submitSubtitle: 'పోలీసులు వేగంగా చర్యలు తీసుకోవడానికి సూచనల చెక్‌లిస్ట్‌ను పరిశీలించి సరైన ఆధారాలను సమర్పించండి.',
    submitStep1: 'ఫిర్యాదుదారు వివరాలు',
    submitStep2: 'సంఘటన వివరాలు',
    submitStep3: 'ఆర్థిక & నిందితుడి వివరాలు',
    submitStep4: 'సాక్ష్యాలు & AI వర్గీకరణ',
    submitFullName: 'పూర్తి పేరు',
    submitEmail: 'ఈమెయిల్ చిరునామా',
    submitPhone: 'మొబైల్ నంబర్ (10 అంకెలు)',
    submitIdType: 'గుర్తింపు కార్డు రకం (National ID)',
    submitUploadId: 'గుర్తింపు కార్డు కాపీని అప్‌లోడ్ చేయండి',
    submitIdMaxSize: '(ఓటర్ ఐడీ, ఆధార్, పాన్, పాస్‌పోర్ట్ 5 MB లోపు)',
    submitCategoryLabel: 'సైబర్ క్రైమ్ వర్గం (Category)',
    submitCategorySelect: 'నేర కేటగిరీని ఎంచుకోండి',
    submitIncidentDate: 'నేరం జరిగిన తేదీ మరియు సమయం',
    submitIncidentDetails: 'సంఘటన పూర్తి వివరాలు (కనీసం 20 అక్షరాలు)',
    submitIncidentDetailsHint: 'ఎలా సంప్రదించారు, ఏమి జరిగింది, ఎంత నష్టం వాటిల్లిందో వివరంగా రాయండి. ప్రత్యేక చిహ్నాలు (#$@^*~|!) ఉపయోగించరాదు.',
    submitSuspectUrl: 'అనుమానిత వెబ్‌సైట్ లేదా సోషల్ మీడియా లింక్',
    submitBankName: 'బ్యాంక్ / వాలెట్ / మర్చంట్ పేరు',
    submitUtrNo: '12 అంకెల ట్రాన్సాక్షన్ ఐడీ / UTR నంబర్',
    submitFraudAmount: 'మోసపోయిన మొత్తం మొత్తం (₹)',
    submitSuspectName: 'నిందితుడి పేరు (తెలిస్తే)',
    submitSuspectPhone: 'నిందితుడి మొబైల్ / వాట్సాప్ నంబర్',
    submitSuspectEmail: 'నిందితుడి ఈమెయిల్ చిరునామా',
    submitSuspectBank: 'నిందితుడి బ్యాంక్ ఖాతా & IFSC',
    submitSuspectAddress: 'నిందితుడి చిరునామా / లొకేషన్',
    submitUploadEvidence: 'సాక్ష్యాధారాల ఫైళ్లను అప్‌లోడ్ చేయండి',
    submitEvidenceHint: 'స్క్రీన్‌షాట్లు, కాల్ రికార్డులు, ఆడియో, PDF రసీదులు లేదా వీడియోలు (ఒక్కో ఫైల్ 10 MB లోపు)',
    submitTakePhoto: 'కెమెరా ద్వారా ఫోటో తీయండి',
    submitAiPreviewTitle: 'లైవ్ AI నేర వర్గీకరణ & ప్రాధాన్యత విశ్లేషణ',
    submitAiCategory: 'AI గుర్తించిన కేటగిరీ',
    submitAiPriority: 'ప్రాధాన్యత స్థాయి',
    submitAiConfidence: 'AI విశ్వసనీయత',
    submitDeclaration: 'నేను అందించిన వివరాలు మరియు ఆధారాలన్నీ పూర్తిగా నిజమైనవని ధృవీకరిస్తున్నాను.',
    submitBtn: 'ఫిర్యాదు సమర్పించండి',
    submittingBtn: 'సమర్పిస్తోంది & AI విశ్లేషణ జరుగుతోంది...',
    submitSuccessTitle: 'ఫిర్యాదు విజయవంతంగా నమోదైంది!',
    submitSuccessDesc: 'మీ ఫిర్యాదుకు ప్రత్యేక ట్రాకింగ్ రిఫరెన్స్ ఐడీ ఇవ్వబడింది. పోలీస్ అధికారులకు సమాచారం పంపబడింది.',
    submitAckRef: 'రసీదు సంఖ్య (Acknowledgement ID)',
    submitDownloadAck: 'అధికారిక PDF రసీదు డౌన్‌లోడ్ చేసుకోండి',
    submitTrackNow: 'ఇప్పుడే ఈ ఫిర్యాదును ట్రాక్ చేయండి',

    // Track Complaint Module
    trackTitle: 'సైబర్ క్రైమ్ ఫిర్యాదు ట్రాకింగ్',
    trackSubtitle: 'విచారణ పురోగతి మరియు నియమించబడిన పోలీస్ అధికారి సమాచారాన్ని చూడటానికి ఫిర్యాదు ఐడీని నమోదు చేయండి.',
    trackSearchPlaceholder: 'ఫిర్యాదు ఐడీ నమోదు చేయండి (ఉదా: CC-2026-89241)',
    trackBtn: 'ఫిర్యాదును ట్రాక్ చేయండి',
    trackTimelineTitle: 'కేసు విచారణ టైమ్‌లైన్',
    trackStageSubmitted: 'ఫిర్యాదు నమోదు చేయబడింది',
    trackStageUnderReview: 'పోలీస్ అధికారి పరిశీలనలో ఉంది',
    trackStageInvestigating: 'విచారణ & బ్యాంక్ హోల్డ్ ప్రక్రియ',
    trackStageResolved: 'కేసు పరిష్కరించబడింది',
    trackOfficerTitle: 'కేసు విచారణ అధికారి వివరాలు',
    trackOfficerName: 'విచారణ అధికారి (Officer)',
    trackOfficerStation: 'సైబర్ క్రైమ్ పోలీస్ స్టేషన్',
    trackOfficerBadge: 'బ్యాడ్జ్ నంబర్',
    trackOfficerContact: 'అధికారిక సంప్రదింపు డెస్క్',
    trackFirNumber: 'FIR నంబర్',
    trackFirSection: 'చట్టపరమైన సెక్షన్లు (IT Act 2000)',
    trackEvidenceAttached: 'ధృవీకరించబడిన సాక్ష్యాధారాలు',
    trackPrintSlip: 'సారాంశం ప్రింట్ చేయండి',
    trackDownloadPdf: 'ట్రాకింగ్ స్లిప్ డౌన్‌లోడ్ చేయండి',
    trackNotFound: 'ఈ ఐడీతో ఎలాంటి ఫిర్యాదు లభించలేదు. దయచేసి ఐడీని సరిచూసుకోండి.',

    // My Complaints Module
    myComplaintsTitle: 'నా రిజిస్టర్డ్ ఫిర్యాదులు',
    myComplaintsSubtitle: 'మీరు నమోదు చేసిన అన్ని ఫిర్యాదుల పూర్తి చరిత్ర మరియు లైవ్ విచారణ వివరాలు.',
    myFilterSearch: 'ఐడీ, పేరు లేదా కేటగిరీ ద్వారా వెతకండి...',
    myFilterStatus: 'స్టేటస్ ఫిల్టర్',
    myFilterCategory: 'కేటగిరీ ఫిల్టర్',
    myColId: 'ఫిర్యాదు ఐడీ',
    myColDate: 'నమోదు తేదీ',
    myColTitle: 'విషయం / సంఘటన',
    myColCategory: 'కేటగిరీ',
    myColPriority: 'ప్రాధాన్యత',
    myColStatus: 'ప్రస్తుత స్టేటస్',
    myColActions: 'చర్యలు',
    myActionTrack: 'ట్రాక్',
    myActionDetails: 'వివరాలు చూడండి',
    myNoComplaintsFound: 'మీరు వెతికిన వివరాలతో ఎలాంటి ఫిర్యాదులు లభించలేదు.',
    myFileNewBtn: '+ కొత్త ఫిర్యాదు నమోదు చేయండి',

    // Notifications Module
    notifTitle: 'నోటిఫికేషన్లు & హెచ్చరికలు',
    notifSubtitle: 'ఫిర్యాదు పురోగతి, పోలీస్ చర్యలు మరియు కేసు పరిష్కార హెచ్చరికలు.',
    notifMarkAllRead: 'అన్నీ చదివినట్లు గుర్తించండి',
    notifClearAll: 'అన్నీ తొలగించండి',
    notifNoAlerts: 'మీకు ఎలాంటి కొత్త నోటిఫికేషన్లు లేవు.',

    // User Profile Module
    profileTitle: 'యూజర్ ప్రొఫైల్ & వివరాలు',
    profileSubtitle: 'మీ అధికారిక వివరాలు, ఫోన్ నంబర్ మరియు ఖాతా భద్రతను నిర్వహించండి.',
    profileSaveBtn: 'ప్రొఫైల్ సేవ్ చేయండి',
    profileSaving: 'సేవ్ అవుతోంది...',

    // Settings Module
    settingsTitle: 'సెట్టింగ్‌లు & ప్రాధాన్యతలు (Settings)',
    settingsSubtitle: 'మీ ఖాతా భద్రత, నోటిఫికేషన్లు, భాష మరియు సిస్టమ్ సెట్టింగ్‌లను సులభంగా నిర్వహించండి.',
    adminSettingsTitle: 'పోలీస్ కమాండ్ & సిస్టమ్ సెట్టింగ్‌లు',
    adminSettingsSubtitle: 'AI నేర వర్గీకరణ, హెచ్చరికలు మరియు విచారణ ప్రాధాన్యతలను నిర్వహించండి.',
    tabAccount: 'నా ఖాతా (Account)',
    tabSecurity: 'పాస్‌వర్డ్ & భద్రత',
    tabNotifications: 'నోటిఫికేషన్లు (Alerts)',
    tabPreferences: 'భాష & థీమ్ (Language)',
    tabAiSettings: 'AI సెట్టింగ్‌లు',
    tabSystem: 'సిస్టమ్ వివరాలు',
    tabPrivacy: 'గోప్యత & భద్రత (Privacy)',
    tabAbout: 'సహాయం & హెల్ప్‌లైన్',
    prefHeading: 'భాష & రూపం (Language & Theme)',
    prefDesc: 'మీకు అనుకూలమైన భాషను మరియు స్క్రీన్ రంగును ఎంచుకోండి. మార్పులు వెంటనే పోర్టల్ మొత్తం వర్తిస్తాయి.',
    languageSelection: 'పోర్టల్ ప్రదర్శన భాష (Portal Display Language)',
    langEn: 'English (ఆంగ్లం)',
    langTe: 'తెలుగు (Telugu)',
    langHi: 'हिन्दी (Hindi)',
    themeSelection: 'స్క్రీన్ రంగు (Theme)',
    themeDark: 'డార్క్ మోడ్ (Dark Mode - రాత్రి వేళ సులభం)',
    themeLight: 'లైట్ మోడ్ (Light Mode - స్పష్టమైన వెలుగు)',
    themeSystem: 'సిస్టమ్ డిఫాల్ట్',
    
    // Help & Common
    helpline1930Title: 'జాతీయ సైబర్ హెల్ప్‌లైన్ నంబర్: 1930',
    helpline1930Desc: 'ఆర్థిక మోసం జరిగిన వెంటనే మొదటి గంటలో 1930 నంబర్‌కు కాల్ చేయండి.',
    btnSave: 'సేవ్ చేయండి',
    btnCancel: 'రద్దు చేయండి',
    btnClose: 'మూసివేయండి',
    btnBack: 'వెనుకకు',
    btnNext: 'తదుపరి',
    btnCopy: 'కాపీ చేయండి',
    btnCopied: 'కాపీ చేయబడింది!',
    btnDownload: 'డౌన్‌లోడ్',
    btnPrint: 'ప్రింట్',
  },

  hi: {
    // General Brand & Navigation
    brandTitle: 'साइबरगार्ड AI (CyberGuard)',
    brandCitizenSub: 'नागरिक पोर्टल (Citizen Portal)',
    brandAdminSub: 'पुलिस कमांड डेस्क (Police Desk)',
    navDashboard: 'डैशबोर्ड (Dashboard)',
    navInstructions: 'निर्देश एवं गाइडलाइंस',
    navGuidelines: 'गाइडलाइंस (EN/తె/हि)',
    navReportCrime: 'शिकायत दर्ज करें (+ Report)',
    navTrackStatus: 'स्थिति ट्रैक करें (Track)',
    navMyComplaints: 'मेरी शिकायतें (Complaints)',
    navNotifications: 'सूचनाएं (Alerts)',
    navSettings: 'सेटिंग्स (Settings)',
    navProfile: 'प्रोफाइल (Profile)',
    navLogout: 'लॉगआउट (Logout)',
    navSignIn: 'लॉगिन / पंजीकरण',
    navAdminDashboard: 'एडमिन डैशबोर्ड',
    navAdminComplaints: 'शिकायत प्रबंधन',
    navAdminStatus: 'स्थिति अपडेट करें',
    navAdminAnalytics: 'रिपोर्ट्स एवं विश्लेषण',
    themeLight: 'लाइट मोड (दिन)',
    themeDark: 'डार्क मोड (रात)',

    // Status Values
    statusSubmitted: 'दर्ज किया गया (Submitted)',
    statusUnderReview: 'समीक्षाधीन (Under Review)',
    statusInvestigating: 'जांच जारी है (Investigating)',
    statusResolved: 'सुलझा लिया गया (Resolved)',
    statusAll: 'सभी स्थितियां (All)',

    // Priority Values
    priorityHigh: 'उच्च (High)',
    priorityMedium: 'मध्यम (Medium)',
    priorityLow: 'सामान्य (Low)',
    priorityAll: 'सभी प्राथमिकताएं (All)',

    // Crime Categories
    catPhishing: 'फिशिंग एवं फर्जी लिंक',
    catOnlineFraud: 'ऑनलाइन / UPI वित्तीय धोखाधड़ी',
    catIdentityTheft: 'पहचान चोरी और फर्जी प्रोफाइल',
    catSocialMediaScam: 'सोशल मीडिया घोटाले',
    catCyberbullying: 'साइबर धमकी और ऑनलाइन उत्पीड़न',
    catMalware: 'वायरस एवं रैंसमवेयर हमला',
    catJobScam: 'फर्जी नौकरी घोटाला (Job Scam)',
    catMatrimonial: 'वैवाहिक धोखाधड़ी',
    catLoanScam: 'अवैध लोन ऐप घोटाला',

    // User Dashboard Module
    dashWelcome: 'स्वागत है',
    dashSubtitle: 'साइबर अपराधों की शिकायत दर्ज करें और वास्तविक समय में अपनी शिकायतों की जांच स्थिति ट्रैक करें।',
    dashBannerTitle: 'नई शिकायत दर्ज करने हेतु बुनियादी आवश्यकताओं की चेकलिस्ट',
    dashBannerDesc: 'अपना राष्ट्रीय पहचान पत्र, 20+ अक्षरों का घटना विवरण, बैंक UTR नंबर और साक्ष्य तैयार रखें।',
    dashViewInstructions: 'निर्देश देखें',
    dashStatTotal: 'कुल शिकायतें',
    dashStatPending: 'समीक्षाधीन / दर्ज',
    dashStatInvestigating: 'जांच जारी',
    dashStatResolved: 'सुलझाई गई',
    dashRecentTitle: 'आपकी हालिया शिकायतें',
    dashViewAll: 'सभी देखें',
    dashNoComplaints: 'आपके खाते में अभी तक कोई शिकायत दर्ज नहीं है।',
    dashStatusOverview: 'शिकायत स्थिति अवलोकन (Status)',
    dashReportIncidentBtn: '+ शिकायत दर्ज करें',
    dashTrackStatusBtn: 'स्थिति ट्रैक करें',
    dashBackToDashboard: 'डैशबोर्ड पर वापस जाएं',

    // Submit Complaint Module
    submitTitle: 'नई साइबर अपराध शिकायत दर्ज करें',
    submitSubtitle: 'त्वरित पुलिस कार्रवाई हेतु निर्देशों का पालन करें और सभी आवश्यक साक्ष्य प्रदान करें।',
    submitStep1: 'शिकायतकर्ता विवरण',
    submitStep2: 'घटना का विवरण',
    submitStep3: 'वित्तीय एवं संदिग्ध विवरण',
    submitStep4: 'साक्ष्य एवं AI वर्गीकरण',
    submitFullName: 'पूरा नाम',
    submitEmail: 'ईमेल पता',
    submitPhone: 'मोबाइल नंबर (10 अंक)',
    submitIdType: 'राष्ट्रीय पहचान पत्र प्रकार',
    submitUploadId: 'पहचान पत्र की प्रति अपलोड करें',
    submitIdMaxSize: '(वोटर आईडी, आधार, पैन, पासपोर्ट 5 MB से कम)',
    submitCategoryLabel: 'साइबर अपराध श्रेणी (Category)',
    submitCategorySelect: 'अपराध श्रेणी चुनें',
    submitIncidentDate: 'घटना की तिथि एवं समय',
    submitIncidentDetails: 'घटना का पूरा विवरण (कम से कम 20 अक्षर)',
    submitIncidentDetailsHint: 'घटना का स्पष्ट विवरण लिखें बिना किसी विशेष वर्ण (#$@^*~|!) के।',
    submitSuspectUrl: 'संदिग्ध वेबसाइट या सोशल मीडिया लिंक',
    submitBankName: 'बैंक / वॉलेट / मर्चेंट का नाम',
    submitUtrNo: '12 अंकों का ट्रांजैक्शन आईडी / UTR नंबर',
    submitFraudAmount: 'धोखाधड़ी में गंवाई गई राशि (₹)',
    submitSuspectName: 'संदिग्ध का नाम (यदि ज्ञात हो)',
    submitSuspectPhone: 'संदिग्ध का मोबाइल / व्हाट्सएप नंबर',
    submitSuspectEmail: 'संदिग्ध का ईमेल पता',
    submitSuspectBank: 'संदिग्ध का बैंक खाता एवं IFSC',
    submitSuspectAddress: 'संदिग्ध का पता / स्थान',
    submitUploadEvidence: 'साक्ष्य फाइलें अपलोड करें',
    submitEvidenceHint: 'स्क्रीनशॉट, ऑडियो, कॉल रिकॉर्डिंग, पीडीएफ रसीदें या वीडियो (प्रत्येक फाइल 10 MB से कम)',
    submitTakePhoto: 'कैमरे से फोटो लें',
    submitAiPreviewTitle: 'लाइव AI अपराध वर्गीकरण एवं प्राथमिकता',
    submitAiCategory: 'AI द्वारा अनुमानित श्रेणी',
    submitAiPriority: 'प्राथमिकता स्तर',
    submitAiConfidence: 'AI विश्वास स्तर',
    submitDeclaration: 'मैं प्रमाणित करता/करती हूं कि दी गई समस्त जानकारी एवं अपलोड किए गए साक्ष्य पूरी तरह सत्य हैं।',
    submitBtn: 'शिकायत सबमिट करें',
    submittingBtn: 'सबमिट हो रहा है एवं AI विश्लेषण जारी है...',
    submitSuccessTitle: 'शिकायत सफलतापूर्वक दर्ज हो गई!',
    submitSuccessDesc: 'आपकी शिकायत को एक यूनिक ट्रैकिंग आईडी आवंटित की गई है। पुलिस अधिकारियों को सूचित कर दिया गया है।',
    submitAckRef: 'पावती संदर्भ संख्या (Acknowledgement ID)',
    submitDownloadAck: 'आधिकारिक PDF पावती डाउनलोड करें',
    submitTrackNow: 'इस शिकायत को अभी ट्रैक करें',

    // Track Complaint Module
    trackTitle: 'साइबर अपराध शिकायत ट्रैक करें',
    trackSubtitle: 'जांच की प्रगति और नियुक्त पुलिस अधिकारी का विवरण देखने के लिए शिकायत आईडी दर्ज करें।',
    trackSearchPlaceholder: 'शिकायत आईडी दर्ज करें (उदा: CC-2026-89241)',
    trackBtn: 'शिकायत ट्रैक करें',
    trackTimelineTitle: 'जांच प्रगति समयरेखा (Timeline)',
    trackStageSubmitted: 'शिकायत पंजीकृत',
    trackStageUnderReview: 'अधिकारी द्वारा समीक्षाधीन',
    trackStageInvestigating: 'जांच एवं बैंक लीन प्रक्रिया',
    trackStageResolved: 'मामला सुलझा लिया गया',
    trackOfficerTitle: 'नियुक्त साइबर जांच अधिकारी',
    trackOfficerName: 'जांच अधिकारी (Officer)',
    trackOfficerStation: 'साइबर अपराध पुलिस स्टेशन',
    trackOfficerBadge: 'बैज नंबर',
    trackOfficerContact: 'आधिकारिक संपर्क डेस्क',
    trackFirNumber: 'एफआईआर (FIR) संख्या',
    trackFirSection: 'कानूनी धाराएं (IT Act 2000)',
    trackEvidenceAttached: 'सत्यापित साक्ष्य दस्तावेज',
    trackPrintSlip: 'केस सारांश प्रिंट करें',
    trackDownloadPdf: 'ट्रैकिंग स्लिप डाउनलोड करें',
    trackNotFound: 'इस आईडी से कोई शिकायत नहीं मिली। कृपया आईडी जांच कर पुनः प्रयास करें।',

    // My Complaints Module
    myComplaintsTitle: 'मेरी पंजीकृत शिकायतें',
    myComplaintsSubtitle: 'आपकी सभी शिकायतों का पूरा इतिहास और वास्तविक समय की जांच रिपोर्ट।',
    myFilterSearch: 'आईडी, शीर्षक या श्रेणी से खोजें...',
    myFilterStatus: 'स्थिति अनुसार छांटें',
    myFilterCategory: 'श्रेणी अनुसार छांटें',
    myColId: 'शिकायत आईडी',
    myColDate: 'दर्ज तिथि',
    myColTitle: 'विषय / घटना',
    myColCategory: 'श्रेणी',
    myColPriority: 'प्राथमिकता',
    myColStatus: 'वर्तमान स्थिति',
    myColActions: 'कार्रवाई',
    myActionTrack: 'ट्रैक करें',
    myActionDetails: 'विवरण देखें',
    myNoComplaintsFound: 'आपकी खोज के अनुसार कोई शिकायत नहीं मिली।',
    myFileNewBtn: '+ नई शिकायत दर्ज करें',

    // Notifications Module
    notifTitle: 'सूचनाएं एवं अलर्ट',
    notifSubtitle: 'शिकायत की प्रगति, पुलिस कार्रवाई और केस सुलझने के अलर्ट।',
    notifMarkAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
    notifClearAll: 'सभी हटाएं',
    notifNoAlerts: 'आपके पास कोई नई सूचना नहीं है।',

    // User Profile Module
    profileTitle: 'उपयोगकर्ता प्रोफाइल एवं पहचान',
    profileSubtitle: 'अपनी संपर्क जानकारी और खाता सुरक्षा प्रबंधित करें।',
    profileSaveBtn: 'बदलाव सुरक्षित करें',
    profileSaving: 'सुरक्षित हो रहा है...',

    // Settings Module
    settingsTitle: 'सेटिंग्स और प्राथमिकताएं (Settings)',
    settingsSubtitle: 'अपने खाते की सुरक्षा, सूचनाएं, भाषा और सिस्टम सेटिंग्स प्रबंधित करें।',
    adminSettingsTitle: 'पुलिस कमान एवं सिस्टम सेटिंग्स',
    adminSettingsSubtitle: 'AI अपराध वर्गीकरण, अलर्ट और जांच प्राथमिकताओं को नियंत्रित करें।',
    tabAccount: 'मेरा खाता (Account)',
    tabSecurity: 'पासवर्ड और सुरक्षा',
    tabNotifications: 'सूचनाएं (Notifications)',
    tabPreferences: 'भाषा और थीम (Language)',
    tabAiSettings: 'AI सेटिंग्स',
    tabSystem: 'सिस्टम स्थिति',
    tabPrivacy: 'गोपनीयता एवं सुरक्षा',
    tabAbout: 'सहायता एवं हेल्पलाइन',
    prefHeading: 'भाषा और दिखावट (Language & Theme)',
    prefDesc: 'अपनी मनपसंद भाषा और डार्क/लाइट थीम चुनें। बदलाव पूरे पोर्टल पर तुरंत लागू होंगे।',
    languageSelection: 'पोर्टल की भाषा (Portal Display Language)',
    langEn: 'English (अंग्रेजी)',
    langTe: 'తెలుగు (Telugu)',
    langHi: 'हिन्दी (Hindi)',
    themeSelection: 'स्क्रीन थीम (Theme)',
    themeDark: 'डार्क मोड (Dark Mode)',
    themeLight: 'लाइट मोड (Light Mode)',
    themeSystem: 'सिस्टम डिफॉल्ट',
    
    // Help & Common
    helpline1930Title: 'राष्ट्रीय साइबर हेल्पलाइन: 1930',
    helpline1930Desc: 'पैसों की धोखाधड़ी होने पर तुरंत 1 घंटे के अंदर 1930 पर कॉल करें।',
    btnSave: 'बदलाव सुरक्षित करें',
    btnCancel: 'रद्द करें',
    btnClose: 'बंद करें',
    btnBack: 'पीछे',
    btnNext: 'आगे',
    btnCopy: 'कॉपी करें',
    btnCopied: 'कॉपी हो गया!',
    btnDownload: 'डाउनलोड',
    btnPrint: 'प्रिंट',
  },
};

export const getTranslation = (lang = 'en') => {
  return translations[lang] || translations.en;
};

export const getInstructionTranslation = (lang = 'en') => {
  return instructionTranslations[lang] || instructionTranslations.en;
};
