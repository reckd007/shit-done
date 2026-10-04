import { AppLanguage, FoodInstruction, MedicineForm } from '../types/medicine';

export interface Translations {
  // Navigation
  today: string;
  cabinet: string;
  reminders: string;
  history: string;

  // Header & Brand
  brandName: string;
  tagline: string;
  streakBadge: string;

  // Actions
  take: string;
  taken: string;
  ofTaken: string;
  undo: string;
  skip: string;
  skipped: string;
  snooze: string;
  snooze15: string;
  skipThisDose: string;
  editPrescription: string;
  viewPhoto: string;
  takePhoto: string;
  retakePhoto: string;
  removePhoto: string;
  uploadPhoto: string;
  addMed: string;
  save: string;
  saveChanges: string;
  cancel: string;
  delete: string;
  close: string;
  refill: string;
  refillStock: string;
  addQuantity: string;
  updateStock: string;
  currentStock: string;

  // Time of Day
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
  morningTime: string;
  afternoonTime: string;
  eveningTime: string;
  nightTime: string;

  // Food Instructions
  with_food: string;
  before_food: string;
  after_food: string;
  empty_stomach: string;
  anytime: string;

  // Forms
  tablet: string;
  capsule: string;
  liquid: string;
  drops: string;
  inhaler: string;
  injection: string;
  cream: string;
  powder: string;
  allTypes: string;

  // Today Summary
  dailyIntake: string;
  allTakenMessage: string;
  dosesRemaining: string;
  refillAlert: string;
  runningLow: string;
  leftUnit: string;
  todayLabel: string;
  noMedsToday: string;
  addFirstMed: string;

  // Cabinet
  cabinetTitle: string;
  prescriptionsRegistered: string;
  searchPlaceholder: string;
  paused: string;
  pauseSchedule: string;
  resumeSchedule: string;
  activeTriggers: string;
  noScheduledDoses: string;
  lowStockLabel: string;

  // Settings & Theme
  settingsTitle: string;
  settingsSubtitle: string;
  languageTitle: string;
  languageDesc: string;
  themeTitle: string;
  autoTheme: string;
  lightTheme: string;
  darkTheme: string;
  themeAutoExpl: string;
  pushNotifications: string;
  status: string;
  enable: string;
  active: string;
  audioChime: string;
  audioChimeDesc: string;
  tactileVibration: string;
  tactileVibrationDesc: string;
  snoozeDuration: string;
  snoozeDurationDesc: string;
  testRemindersNow: string;
  testRemindersDesc: string;
  sendTest: string;
  testing: string;

  // History & Report
  historyTitle: string;
  historySubtitle: string;
  doctorReport: string;
  streak: string;
  adherence: string;
  allTimeTaken: string;
  sevenDayTrend: string;
  recentActivity: string;
  printReport: string;
  copyText: string;
  copiedToClipboard: string;
  patientReport: string;
  reportSubtitle: string;

  // In-App Alert
  doseDueNow: string;
  markAsTaken: string;
  snooze15m: string;

  // Camera & Photo Modal
  captureMedicinePhoto: string;
  positionPillPrompt: string;
  centerPillGuide: string;
  useThisPhoto: string;
  photoAttached: string;
  willBeDisplayed: string;
  changeFile: string;
  noPhotoAvailable: string;
  scheduleTimes: string;
  instructionsLabel: string;
  doctorNotes: string;
  editRetakePhoto: string;
  medicinePhotoLabel: string;

  // Form Fields
  medNameLabel: string;
  medNamePlaceholder: string;
  dosageLabel: string;
  dosagePlaceholder: string;
  formLabel: string;
  colorTagLabel: string;
  scheduledTimesLabel: string;
  addDoseTime: string;
  foodInstructionsLabel: string;
  inventoryAlertsLabel: string;
  lowAlertAtLabel: string;
  unitLabel: string;
  doctorNameLabel: string;
  rxNumberLabel: string;
  notesLabel: string;
  notesPlaceholder: string;
  quickSuggestions: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    today: 'Today',
    cabinet: 'Cabinet',
    reminders: 'Reminders',
    history: 'History',

    brandName: 'DoseTrack',
    tagline: 'Pill & Health Companion',
    streakBadge: 'd',

    take: 'Take',
    taken: 'Taken',
    ofTaken: 'taken',
    undo: 'Undo',
    skip: 'Skip',
    skipped: 'Skipped',
    snooze: 'Snooze 15m',
    snooze15: 'Snooze 15 minutes',
    skipThisDose: 'Skip this dose',
    editPrescription: 'Edit Prescription',
    viewPhoto: 'View Medicine Photo',
    takePhoto: 'Take Photo of Medicine',
    retakePhoto: 'Retake Photo',
    removePhoto: 'Remove Photo',
    uploadPhoto: 'Upload',
    addMed: 'Add Med',
    save: 'Save',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    close: 'Close',
    refill: 'Refill',
    refillStock: 'Refill Stock',
    addQuantity: 'Add Quantity',
    updateStock: 'Update Stock',
    currentStock: 'Current Stock',

    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night / Bedtime',
    morningTime: '06:00 – 11:59',
    afternoonTime: '12:00 – 16:59',
    eveningTime: '17:00 – 20:59',
    nightTime: '21:00+',

    with_food: 'With food',
    before_food: 'Before food',
    after_food: 'After food',
    empty_stomach: 'Empty stomach',
    anytime: 'Anytime',

    tablet: 'Tablet',
    capsule: 'Capsule',
    liquid: 'Liquid',
    drops: 'Drops',
    inhaler: 'Inhaler',
    injection: 'Injection',
    cream: 'Cream',
    powder: 'Powder',
    allTypes: 'All Types',

    dailyIntake: 'Daily Intake',
    allTakenMessage: '🎉 All medications accounted for today!',
    dosesRemaining: 'dose(s) remaining',
    refillAlert: 'Refill Alert',
    runningLow: 'is running low',
    leftUnit: 'left',
    todayLabel: 'TODAY',
    noMedsToday: 'No medication scheduled for this day',
    addFirstMed: 'Tap the button below to add your first medicine prescription.',

    cabinetTitle: 'Medicine Cabinet',
    prescriptionsRegistered: 'prescription(s) registered',
    searchPlaceholder: 'Search medications, dosages, notes...',
    paused: 'Paused',
    pauseSchedule: 'Pause Schedule',
    resumeSchedule: 'Resume Schedule',
    activeTriggers: 'Active Daily Triggers',
    noScheduledDoses: 'No scheduled doses active',
    lowStockLabel: 'Low stock',

    settingsTitle: 'Settings & Alerts',
    settingsSubtitle: 'Language, appearance, reminders, and alerts',
    languageTitle: 'Language / زبان / भाषा',
    languageDesc: 'Choose your preferred language for the interface',
    themeTitle: 'Appearance Theme',
    autoTheme: 'Auto',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    themeAutoExpl: 'When set to Auto, the app instantly mirrors your device daylight and dark theme preferences.',
    pushNotifications: 'Push Notifications',
    status: 'Status',
    enable: 'Enable',
    active: 'Active',
    audioChime: 'Audio Chime',
    audioChimeDesc: 'Play melodic chime when dose is due',
    tactileVibration: 'Tactile Vibration',
    tactileVibrationDesc: 'Vibrate device during alert',
    snoozeDuration: 'Snooze Duration',
    snoozeDurationDesc: 'Minutes until repeated reminder',
    testRemindersNow: 'Test Reminders Now',
    testRemindersDesc: 'Triggers a sample reminder chime, banner, and device vibration.',
    sendTest: 'Send Test',
    testing: 'Testing...',

    historyTitle: 'Intake History',
    historySubtitle: 'Adherence tracking and medical logs',
    doctorReport: 'Doctor Report',
    streak: 'Streak',
    adherence: 'Adherence',
    allTimeTaken: 'All-Time Taken',
    sevenDayTrend: '7-Day Adherence Trend',
    recentActivity: 'Recent Logged Intake',
    printReport: 'Print Report',
    copyText: 'Copy Text',
    copiedToClipboard: 'Copied to Clipboard',
    patientReport: 'Prescription Report',
    reportSubtitle: 'Share with physician or caregiver',

    doseDueNow: 'Dose Due Now',
    markAsTaken: 'Mark as Taken',
    snooze15m: 'Snooze 15m',

    captureMedicinePhoto: 'Capture Medicine Photo',
    positionPillPrompt: 'Position pill or bottle in frame',
    centerPillGuide: 'Center pill or label here',
    useThisPhoto: 'Use This Photo',
    photoAttached: 'Photo Attached',
    willBeDisplayed: 'Will be displayed on dose reminders & cabinet',
    changeFile: 'Change File',
    noPhotoAvailable: 'No photo available for this medication',
    scheduleTimes: 'Schedule Times',
    instructionsLabel: 'Instructions',
    doctorNotes: 'Doctor Notes',
    editRetakePhoto: 'Edit / Retake Photo',
    medicinePhotoLabel: 'Medicine Photo (Pill / Bottle)',

    medNameLabel: 'Medicine Name *',
    medNamePlaceholder: 'e.g. Metformin, Lisinopril',
    dosageLabel: 'Dosage / Strength *',
    dosagePlaceholder: 'e.g. 500 mg, 1 tablet, 10 ml',
    formLabel: 'Medication Form',
    colorTagLabel: 'Color Tag',
    scheduledTimesLabel: 'Daily Scheduled Times *',
    addDoseTime: 'Add Dose Time',
    foodInstructionsLabel: 'Food Instructions',
    inventoryAlertsLabel: 'Inventory & Refill Alerts',
    lowAlertAtLabel: 'Low Alert At',
    unitLabel: 'Unit',
    doctorNameLabel: 'Doctor / Prescriber (Optional)',
    rxNumberLabel: 'Prescription / Rx Number (Optional)',
    notesLabel: 'Instructions / Notes (Optional)',
    notesPlaceholder: 'e.g. Drink full glass of water, do not crush',
    quickSuggestions: 'Quick Suggestions',
  },

  hi: {
    today: 'आज',
    cabinet: 'दवाइयां',
    reminders: 'अलर्ट',
    history: 'इतिहास',

    brandName: 'DoseTrack',
    tagline: 'दवा और स्वास्थ्य साथी',
    streakBadge: 'दिन',

    take: 'लें',
    taken: 'ले ली',
    ofTaken: 'ली गईं',
    undo: 'पूर्ववत',
    skip: 'छोड़ें',
    skipped: 'छूटी हुई',
    snooze: '15 मि. स्नूज़',
    snooze15: '15 मिनट बाद याद दिलाएं',
    skipThisDose: 'यह खुराक छोड़ें',
    editPrescription: 'दवा संपादित करें',
    viewPhoto: 'दवा की तस्वीर देखें',
    takePhoto: 'दवा की तस्वीर लें',
    retakePhoto: 'दोबारा तस्वीर लें',
    removePhoto: 'तस्वीर हटाएं',
    uploadPhoto: 'अपलोड',
    addMed: 'दवा जोड़ें',
    save: 'सहेजें',
    saveChanges: 'बदलाव सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    close: 'बंद करें',
    refill: 'रीफिल',
    refillStock: 'स्टॉक भरें',
    addQuantity: 'मात्रा जोड़ें',
    updateStock: 'स्टॉक अपडेट करें',
    currentStock: 'वर्तमान स्टॉक',

    morning: 'सुबह',
    afternoon: 'दोपहर',
    evening: 'शाम',
    night: 'रात / सोने का समय',
    morningTime: '06:00 – 11:59',
    afternoonTime: '12:00 – 16:59',
    eveningTime: '17:00 – 20:59',
    nightTime: '21:00+',

    with_food: 'खाने के साथ',
    before_food: 'खाने से पहले',
    after_food: 'खाने के बाद',
    empty_stomach: 'खाली पेट',
    anytime: 'कभी भी',

    tablet: 'गोली',
    capsule: 'कैप्सूल',
    liquid: 'सिरप / तरल',
    drops: 'बूंदें',
    inhaler: 'इन्हेलर',
    injection: 'इंजेक्शन',
    cream: 'मलहम',
    powder: 'चूर्ण / पाउडर',
    allTypes: 'सभी प्रकार',

    dailyIntake: 'दैनिक खुराक',
    allTakenMessage: '🎉 आज की सभी दवाइयां पूरी हो चुकी हैं!',
    dosesRemaining: 'खुराक बाकी है',
    refillAlert: 'रीफिल चेतावनी',
    runningLow: 'कम हो रही है',
    leftUnit: 'शेष',
    todayLabel: 'आज',
    noMedsToday: 'आज के लिए कोई दवा निर्धारित नहीं है',
    addFirstMed: 'अपनी पहली दवा का पर्चा जोड़ने के लिए नीचे दिए गए बटन पर टैप करें।',

    cabinetTitle: 'दवा कैबिनेट',
    prescriptionsRegistered: 'दवाइयां पंजीकृत हैं',
    searchPlaceholder: 'दवाइयां, खुराक, विवरण खोजें...',
    paused: 'रुका हुआ',
    pauseSchedule: 'समय सारणी रोकें',
    resumeSchedule: 'पुनः चालू करें',
    activeTriggers: 'सक्रिय दैनिक अलार्म',
    noScheduledDoses: 'कोई निर्धारित खुराक सक्रिय नहीं है',
    lowStockLabel: 'कम स्टॉक',

    settingsTitle: 'सेटिंग्स और अलर्ट',
    settingsSubtitle: 'भाषा, थीम, अलार्म और खुराक अलर्ट',
    languageTitle: 'भाषा / Language / زبان',
    languageDesc: 'अपनी पसंदीदा भाषा चुनें',
    themeTitle: 'दिखावट थीम',
    autoTheme: 'ऑटो',
    lightTheme: 'लाइट',
    darkTheme: 'डार्क',
    themeAutoExpl: 'ऑटो पर सेट होने पर, ऐप डिवाइस की लाइट/डार्क थीम के अनुसार बदलता है।',
    pushNotifications: 'पुश नोटिफिकेशन',
    status: 'स्थिति',
    enable: 'सक्षम करें',
    active: 'सक्रिय',
    audioChime: 'ऑडियो चाइम',
    audioChimeDesc: 'खुराक का समय होने पर मधुर घंटी बजाएं',
    tactileVibration: 'वाइब्रेशन',
    tactileVibrationDesc: 'अलर्ट के दौरान फोन को वाइब्रेट करें',
    snoozeDuration: 'स्नूज़ का समय',
    snoozeDurationDesc: 'दोबारा याद दिलाने का अंतराल',
    testRemindersNow: 'अलर्ट का परीक्षण करें',
    testRemindersDesc: 'परीक्षण के लिए घंटी, बैनर और वाइब्रेशन चलाएं।',
    sendTest: 'टेस्ट भेजें',
    testing: 'परीक्षण जारी...',

    historyTitle: 'खुराक का इतिहास',
    historySubtitle: 'दवा लेने का रिकॉर्ड और मेडिकल लॉग',
    doctorReport: 'डॉक्टर रिपोर्ट',
    streak: 'सिलसिला',
    adherence: 'पालन दर',
    allTimeTaken: 'कुल ली गई दवाइयां',
    sevenDayTrend: '7-दिन की खुराक प्रवृत्ति',
    recentActivity: 'हाल ही में ली गई खुराक',
    printReport: 'प्रिंट करें',
    copyText: 'कॉपी करें',
    copiedToClipboard: 'क्लिपबोर्ड में कॉपी हो गया',
    patientReport: 'मरीज़ की दवा रिपोर्ट',
    reportSubtitle: 'डॉक्टर या परिजन के साथ साझा करें',

    doseDueNow: 'दवा का समय हो गया',
    markAsTaken: 'ले ली के रूप में चिह्नित करें',
    snooze15m: '15 मि. स्नूज़',

    captureMedicinePhoto: 'दवा की तस्वीर लें',
    positionPillPrompt: 'गोली या शीशी को फ्रेम में रखें',
    centerPillGuide: 'दवा को बीच में रखें',
    useThisPhoto: 'यह तस्वीर इस्तेमाल करें',
    photoAttached: 'तस्वीर जोड़ी गई',
    willBeDisplayed: 'यह तस्वीर रिमाइंडर और कैबिनेट में दिखाई देगी',
    changeFile: 'फ़ाइल बदलें',
    noPhotoAvailable: 'इस दवा की कोई तस्वीर उपलब्ध नहीं है',
    scheduleTimes: 'निर्धारित समय',
    instructionsLabel: 'निर्देश',
    doctorNotes: 'डॉक्टर की सलाह',
    editRetakePhoto: 'तस्वीर बदलें / संपादित करें',
    medicinePhotoLabel: 'दवा की तस्वीर (गोली / शीशी)',

    medNameLabel: 'दवा का नाम *',
    medNamePlaceholder: 'उदा. मेटफॉर्मिन, पैरासिटामोल',
    dosageLabel: 'खुराक / क्षमता *',
    dosagePlaceholder: 'उदा. 500 मिलीग्राम, 1 गोली, 10 मिली',
    formLabel: 'दवा का रूप',
    colorTagLabel: 'रंग टैग',
    scheduledTimesLabel: 'दैनिक खुराक का समय *',
    addDoseTime: 'समय जोड़ें',
    foodInstructionsLabel: 'भोजन संबंधी निर्देश',
    inventoryAlertsLabel: 'स्टॉक और रीफिल अलर्ट',
    lowAlertAtLabel: 'कम स्टॉक की सीमा',
    unitLabel: 'इकाई',
    doctorNameLabel: 'डॉक्टर का नाम (वैकल्पिक)',
    rxNumberLabel: 'पर्चा संख्या (Rx Number) (वैकल्पिक)',
    notesLabel: 'विशेष निर्देश / नोट्स (वैकल्पिक)',
    notesPlaceholder: 'उदा. पानी के साथ लें, चबाएं नहीं',
    quickSuggestions: 'सुझाव',
  },

  ur: {
    today: 'آج',
    cabinet: 'دوا خانہ',
    reminders: 'یاد دہانیاں',
    history: 'تاریخچہ',

    brandName: 'DoseTrack',
    tagline: 'دوا اور صحت کا ساتھی',
    streakBadge: 'دن',

    take: 'لیں',
    taken: 'لے لی',
    ofTaken: 'لی گئیں',
    undo: 'واپس لیں',
    skip: 'چھوڑیں',
    skipped: 'چھوڑی گئی',
    snooze: '15 منٹ موخر',
    snooze15: '15 منٹ بعد یاد دلائیں',
    skipThisDose: 'یہ خوراک چھوڑیں',
    editPrescription: 'نسخہ تبدیل کریں',
    viewPhoto: 'دوا کی تصویر دیکھیں',
    takePhoto: 'دوا کی تصویر لیں',
    retakePhoto: 'دوبارہ تصویر لیں',
    removePhoto: 'تصویر ہٹائیں',
    uploadPhoto: 'اپلوڈ',
    addMed: 'دوا شامل کریں',
    save: 'محفوظ کریں',
    saveChanges: 'تبدیلیاں محفوظ کریں',
    cancel: 'منسوخ',
    delete: 'حذف کریں',
    close: 'بند کریں',
    refill: 'ریفل',
    refillStock: 'اسٹاک بڑھائیں',
    addQuantity: 'مقدار درج کریں',
    updateStock: 'اسٹاک اپ ڈیٹ کریں',
    currentStock: 'موجودہ اسٹاک',

    morning: 'صبح',
    afternoon: 'دوپہر',
    evening: 'شام',
    night: 'رات / سوتے وقت',
    morningTime: '06:00 – 11:59',
    afternoonTime: '12:00 – 16:59',
    eveningTime: '17:00 – 20:59',
    nightTime: '21:00+',

    with_food: 'کھانے کے ساتھ',
    before_food: 'کھانے سے پہلے',
    after_food: 'کھانے کے بعد',
    empty_stomach: 'نہار منہ',
    anytime: 'کسی بھی وقت',

    tablet: 'گولی',
    capsule: 'کیپسول',
    liquid: 'شربت / مائع',
    drops: 'قطرے',
    inhaler: 'انہیلر',
    injection: 'انجکشن',
    cream: 'مرہم',
    powder: 'پاؤڈر',
    allTypes: 'تمام اقسام',

    dailyIntake: 'روزانہ کی خوراک',
    allTakenMessage: '🎉 آج کی تمام دوائیں وقت پر لے لی گئی ہیں!',
    dosesRemaining: 'خوراک باقی ہے',
    refillAlert: 'اسٹاک الرٹ',
    runningLow: 'ختم ہونے والی ہے',
    leftUnit: 'باقی',
    todayLabel: 'آج',
    noMedsToday: 'آج کے لیے کوئی دوا مقرر نہیں ہے',
    addFirstMed: 'اپنی پہلی دوا کا اندراج کرنے کے لیے نیچے بٹن دبائیں۔',

    cabinetTitle: 'دوا خانہ',
    prescriptionsRegistered: 'ادویات درج ہیں',
    searchPlaceholder: 'دوا کا نام، خوراک یا نوٹس تلاش کریں...',
    paused: 'روکا ہوا',
    pauseSchedule: 'شیڈول روکیں',
    resumeSchedule: 'دوبارہ شروع کریں',
    activeTriggers: 'روزانہ کے فعال الرٹس',
    noScheduledDoses: 'کوئی فعال الرٹ موجود نہیں ہے',
    lowStockLabel: 'کم اسٹاک',

    settingsTitle: 'ترتیبات اور الرٹس',
    settingsSubtitle: 'زبان، تھیم، الارم اور خوراک کے الرٹس',
    languageTitle: 'زبان / Language / भाषा',
    languageDesc: 'اپنی پسندیدہ زبان منتخب کریں',
    themeTitle: 'تھیم کا انتخاب',
    autoTheme: 'خودکار',
    lightTheme: 'روشن',
    darkTheme: 'تاریک',
    themeAutoExpl: 'خودکار پر سیٹ ہونے پر یہ آپ کے موبائل کی ترتیبات سے مطابقت رکھے گا۔',
    pushNotifications: 'پش نوٹیفکیشنز',
    status: 'حیثیت',
    enable: 'فعال کریں',
    active: 'فعال',
    audioChime: 'آواز کی گھنٹی',
    audioChimeDesc: 'دوا کے وقت سریلی گھنٹی بجائیں',
    tactileVibration: 'فون وائبریشن',
    tactileVibrationDesc: 'الرٹ کے دوران موبائل کو وائبریٹ کریں',
    snoozeDuration: 'موخر کرنے کا وقت',
    snoozeDurationDesc: 'دوبارہ یاد دہانی کا وقفہ',
    testRemindersNow: 'الرٹ چیک کریں',
    testRemindersDesc: 'آزمائشی گھنٹی، بینر اور وائبریشن چلا کر چیک کریں۔',
    sendTest: 'ٹیسٹ بھیجیں',
    testing: 'ٹیسٹ جاری ہے...',

    historyTitle: 'خوراک کی تاریخچہ',
    historySubtitle: 'دوا لینے کا ریکارڈ اور طبی معلومات',
    doctorReport: 'ڈاکٹر رپورٹ',
    streak: 'تسلسل',
    adherence: 'پابندی کی شرح',
    allTimeTaken: 'کل لی گئی خوراکیں',
    sevenDayTrend: '7 دن کی پابندی کی شرح',
    recentActivity: 'حالیہ لی گئی خوراکیں',
    printReport: 'پرنٹ کریں',
    copyText: 'کاپی کریں',
    copiedToClipboard: 'کلپ بورڈ پر کاپی ہو گیا',
    patientReport: 'مریض کی ادویاتی رپورٹ',
    reportSubtitle: 'اپنے ڈاکٹر یا معالج سے شیئر کریں',

    doseDueNow: 'دوا کا وقت ہو گیا ہے',
    markAsTaken: 'لے لی کے طور پر نشان زد کریں',
    snooze15m: '15 منٹ موخر',

    captureMedicinePhoto: 'دوا کی تصویر لیں',
    positionPillPrompt: 'گولی یا شیشی کو کیمرے کے سامنے رکھیں',
    centerPillGuide: 'دوا کو دائرے کے اندر رکھیں',
    useThisPhoto: 'یہ تصویر استعمال کریں',
    photoAttached: 'تصویر منسلک ہو گئی',
    willBeDisplayed: 'یہ تصویر یاد دہانی اور کیبنٹ میں نظر آئے گی',
    changeFile: 'فائل تبدیل کریں',
    noPhotoAvailable: 'اس دوا کی کوئی تصویر موجود نہیں ہے',
    scheduleTimes: 'مقررہ اوقات',
    instructionsLabel: 'ہدایات',
    doctorNotes: 'ڈاکٹر کی ہدایات',
    editRetakePhoto: 'تصویر تبدیل / درست کریں',
    medicinePhotoLabel: 'دوا کی تصویر (گولی / شیشی)',

    medNameLabel: 'دوا کا نام *',
    medNamePlaceholder: 'مثلاً پیناڈول، میٹفارمین',
    dosageLabel: 'خوراک / طاقت *',
    dosagePlaceholder: 'مثلاً 500 ملی گرام، 1 گولی، 10 ملی لیٹر',
    formLabel: 'دوا کی قسم',
    colorTagLabel: 'رنگ کا ٹیگ',
    scheduledTimesLabel: 'روزانہ کے اوقات *',
    addDoseTime: 'وقت شامل کریں',
    foodInstructionsLabel: 'کھانے کے متعلق ہدایات',
    inventoryAlertsLabel: 'اسٹاک اور ریفل الرٹ',
    lowAlertAtLabel: 'کم از کم الرٹ حد',
    unitLabel: 'پیمانہ',
    doctorNameLabel: 'ڈاکٹر کا نام (اختیاری)',
    rxNumberLabel: 'نسخہ نمبر (اختیاری)',
    notesLabel: 'خصوصی ہدایات / نوٹس (اختیاری)',
    notesPlaceholder: 'مثلاً پانی کے ساتھ لیں، خالی پیٹ نہ لیں',
    quickSuggestions: 'تجویز کردہ ادویات',
  },
};

export const getTranslation = (lang: AppLanguage = 'en'): Translations => {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
};

export const getFoodInstructionLabel = (inst: FoodInstruction, lang: AppLanguage = 'en'): string => {
  const t = getTranslation(lang);
  return t[inst] || inst.replace('_', ' ');
};

export const getMedicineFormLabel = (form: MedicineForm, lang: AppLanguage = 'en'): string => {
  const t = getTranslation(lang);
  return (t as unknown as Record<string, string>)[form] || form;
};
