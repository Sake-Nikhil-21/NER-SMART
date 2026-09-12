import { LanguageCode } from '../types';

export interface TranslationStrings {
  appTitle: string;
  appSubtitle: string;
  citizenMode: string;
  proMode: string;
  citizenModeDesc: string;
  proModeDesc: string;
  checkRoadTitle: string;
  checkRoadSubtitle: string;
  fromLabel: string;
  toLabel: string;
  vehicleLabel: string;
  car: string;
  bike: string;
  bus: string;
  truck: string;
  checkStatusBtn: string;
  popularRoutes: string;
  safeToGo: string;
  driveCarefully: string;
  avoidRoad: string;
  emergencyHelplines: string;
  tollFree: string;
  shareWhatsApp: string;
  printAdvisory: string;
  weatherClear: string;
  roadClear: string;
  noLandslides: string;
  plainEnglishExplanation: string;
  simpleAdvice: string;
  quickQuestions: string;
  pictureMode: string;
  speakRoadStatus: string;
  pictureGuideTitle: string;
  listenToGuide: string;
  findSafeRoute?: string;
  useMyLocation?: string;
  speakBtn?: string;
  whereToGo?: string;
  safestRoute?: string;
  fastestRoute?: string;
  shortestRoute?: string;
  startJourney?: string;
  whyThisRoute?: string;
  takeSaferRoute?: string;
  emergencyBtn?: string;
  findSafestEmergencyRoute?: string;
  roadAccess?: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationStrings> = {
  en: {
    appTitle: 'ROAD_NAVI',
    appSubtitle: 'Smart Mountain Road Navigation & Travel Guide',
    citizenMode: 'Citizen / Simple Mode',
    proMode: 'Logistics Pro Mode',
    citizenModeDesc: 'Easy road status, travel times, car & bus safety for regular travelers and families.',
    proModeDesc: 'Multi-axle commercial freight, geotechnical slope physics, and multi-stop fleet routing.',
    checkRoadTitle: 'Check If Your Road Is Safe Today',
    checkRoadSubtitle: 'Instant live updates for cars, buses, bikes, and daily commuters across North East India.',
    fromLabel: 'Starting From',
    toLabel: 'Going To',
    vehicleLabel: 'I am traveling by',
    car: 'Car / Taxi / SUV',
    bike: 'Bike / Scooter',
    bus: 'Passenger Bus / Sumo',
    truck: 'Truck / Mini Goods',
    checkStatusBtn: 'Check Road Safety Status',
    popularRoutes: 'Popular Daily Routes (Click to Check)',
    safeToGo: 'ROAD IS SAFE & OPEN',
    driveCarefully: 'CAUTION: DRIVE SLOWLY',
    avoidRoad: 'ROAD BLOCKED / DANGEROUS',
    emergencyHelplines: 'Emergency Road & Disaster Helplines (24x7)',
    tollFree: 'Toll Free',
    shareWhatsApp: 'Share Safe Route on WhatsApp',
    printAdvisory: 'Save / Print Travel Card',
    weatherClear: 'Clear Sky / Mild Sunshine',
    roadClear: 'All Bridges & Ghats Open',
    noLandslides: 'Zero Landslide Activity Reported',
    plainEnglishExplanation: 'Explain in Simple Words',
    simpleAdvice: 'Everyday Travel Advice',
    quickQuestions: 'Frequently Asked Questions by Drivers',
    pictureMode: 'Picture & Audio Mode (Easy)',
    speakRoadStatus: 'Listen Out Loud (Voice)',
    pictureGuideTitle: 'Visual Picture Guide for Everyone',
    listenToGuide: 'Tap to Hear Spoken Guidance',
    findSafeRoute: 'FIND SAFE ROUTE',
    useMyLocation: 'USE MY LOCATION',
    speakBtn: 'SPEAK',
    whereToGo: 'Where do you want to go?',
    safestRoute: 'SAFEST ROUTE',
    fastestRoute: 'FASTEST',
    shortestRoute: 'SHORTEST',
    startJourney: 'START JOURNEY',
    whyThisRoute: 'WHY THIS ROUTE?',
    takeSaferRoute: 'TAKE SAFER ROUTE',
    emergencyBtn: 'EMERGENCY',
    findSafestEmergencyRoute: 'FIND SAFEST EMERGENCY ROUTE',
    roadAccess: 'ROAD ACCESS',
  },
  hi: {
    appTitle: 'ROAD_NAVI (रोड_नवी)',
    appSubtitle: 'पूर्वोत्तर भारत में सभी नागरिकों के लिए सुरक्षित सड़क यात्रा व नेविगेशन',
    citizenMode: 'नागरिक / सरल मोड (Citizen)',
    proMode: 'लॉजिस्टिक्स प्रो मोड (Pro)',
    citizenModeDesc: 'कार, बस, बाइक और परिवारों के लिए सरल भाषा में सड़क की जानकारी।',
    proModeDesc: 'भारी ट्रकों, एक्सल लोड और भू-तकनीकी विश्लेषण के लिए पेशेवर मोड।',
    checkRoadTitle: 'जांचें कि आज आपकी सड़क सुरक्षित है या नहीं',
    checkRoadSubtitle: 'कार, बस, बाइक और दैनिक यात्रियों के लिए सीधा लाइव सड़क अपडेट।',
    fromLabel: 'कहाँ से',
    toLabel: 'कहाँ जाना है',
    vehicleLabel: 'आप किससे यात्रा कर रहे हैं',
    car: 'कार / टैक्सी / एसयूवी',
    bike: 'बाइक / स्कूटर',
    bus: 'यात्री बस / सूमो',
    truck: 'ट्रक / छोटा हाथी',
    checkStatusBtn: 'सड़क की सुरक्षा स्थिति जांचें',
    popularRoutes: 'प्रमुख लोकप्रिय मार्ग (तुरंत जांचें)',
    safeToGo: 'सड़क सुरक्षित और खुली है (SAFE)',
    driveCarefully: 'सावधानी: धीमी गति से चलें (CAUTION)',
    avoidRoad: 'सड़क बंद / भूस्खलन खतरा (DANGER)',
    emergencyHelplines: 'आपातकालीन सहायता नंबर (24x7 टोल फ्री)',
    tollFree: 'टोल फ्री',
    shareWhatsApp: 'व्हाट्सएप पर परिवार के साथ साझा करें',
    printAdvisory: 'यात्रा पर्ची सेव करें / प्रिंट करें',
    weatherClear: 'साफ मौसम / धूप',
    roadClear: 'सभी पुल और घाट खुले हैं',
    noLandslides: 'भूस्खलन का कोई खतरा नहीं',
    plainEnglishExplanation: 'सरल शब्दों में समझें',
    simpleAdvice: 'आम नागरिक के लिए सलाह',
    quickQuestions: 'ड्राइवरों द्वारा पूछे जाने वाले सवाल',
    pictureMode: 'चित्र व आवाज़ मोड (सरल)',
    speakRoadStatus: 'बोलकर सुनें (आवाज़ में)',
    pictureGuideTitle: 'चित्र व फ़ोटो आधारित आसान गाइड',
    listenToGuide: 'आवाज़ में सुनने के लिए दबाएं',
    findSafeRoute: 'सुरक्षित रास्ता खोजें',
    useMyLocation: 'मेरा स्थान चुनें',
    speakBtn: 'बोलें',
    whereToGo: 'कहाँ जाना चाहते हैं?',
    safestRoute: 'सबसे सुरक्षित रास्ता',
    fastestRoute: 'सबसे तेज़',
    shortestRoute: 'सबसे छोटा',
    startJourney: 'यात्रा शुरू करें',
    whyThisRoute: 'यही रास्ता क्यों?',
    takeSaferRoute: 'सुरक्षित रास्ता चुनें',
    emergencyBtn: 'आपातकालीन',
    findSafestEmergencyRoute: 'सुरक्षित आपातकालीन रास्ता खोजें',
    roadAccess: 'सड़क पहुंच',
  },
  as: {
    appTitle: 'ROAD_NAVI (ৰʼড_নাভি)',
    appSubtitle: 'উত্তৰ-পূৰ্বাঞ্চলৰ প্ৰতিগৰাকী নাগৰিকৰ বাবে সুৰক্ষিত পথ যাত্ৰা আৰু নেভিগেচন',
    citizenMode: 'নাগৰিক / সহজ মোড (Citizen)',
    proMode: 'লজিষ্টিকছ প্ৰʼ মোড (Pro)',
    citizenModeDesc: 'সাধাৰণ যাত্ৰী আৰু পৰিয়ালৰ বাবে গাড়ী, বাছৰ সহজ পথ সুৰক্ষা আপডেট।',
    proModeDesc: 'গধূৰ ট্ৰাক আৰু বাণিজ্যিক পৰিবহণৰ বাবে কাৰিকৰী বিশ্লেষণ।',
    checkRoadTitle: 'আজি আপোনাৰ যাত্ৰা পথ সুৰক্ষিতনে পৰীক্ষা কৰক',
    checkRoadSubtitle: 'গাড়ী, বাছ, বাইক আৰু দৈনিক যাত্ৰীসকলৰ বাবে সজীৱ পথ তথ্য।',
    fromLabel: 'যাত্ৰাৰ আৰম্ভণি',
    toLabel: 'গন্তব্য স্থান',
    vehicleLabel: 'আপুনি কি বাহনেৰে যাত্ৰা কৰিছে',
    car: 'ব্যক্তিগত গাড়ী / টেক্সি',
    bike: 'বাইক / স্কুটাৰ',
    bus: 'যাত্ৰীবাহী বাছ / চ্যুমʼ',
    truck: 'ট্ৰাক / মালবাহী বাহন',
    checkStatusBtn: 'পথৰ সুৰক্ষা পৰীক্ষা কৰক',
    popularRoutes: 'জনপ্ৰিয় দৈনিক পথসমূহ (এবাৰতে পৰীক্ষা কৰক)',
    safeToGo: 'পথ সম্পূৰ্ণ সুৰক্ষিত আৰু খোলা (SAFE)',
    driveCarefully: 'সাৱধান: লাহে লাহে গাড়ী চলাওক (CAUTION)',
    avoidRoad: 'পথ বন্ধ / ভূমিস্খলনৰ আশংকা (DANGER)',
    emergencyHelplines: 'জৰুৰীকালীন সহায় নম্বৰ (২৪x৭ বিনামূলীয়া)',
    tollFree: 'বিনামূলীয়া (Toll-Free)',
    shareWhatsApp: 'হোৱাটছএপত পৰিয়ালক শ্বেয়াৰ কৰক',
    printAdvisory: 'যাত্ৰা কাৰ্ড সংৰক্ষণ / প্ৰিন্ট কৰক',
    weatherClear: 'ফৰকাল বতৰ / ৰʼদালি',
    roadClear: 'সকলো দলং আৰু ঘাট সুচল',
    noLandslides: 'কোনো ভূমিস্খলনৰ খবৰ নাই',
    plainEnglishExplanation: 'সহজ কথাত বুজি লওক',
    simpleAdvice: 'দৈনন্দিন যাত্ৰীৰ বাবে পৰামৰ্শ',
    quickQuestions: 'যাত্ৰীসকলে সঘনাই সোধা প্ৰশ্ন',
    pictureMode: 'ছবি আৰু মাত মোড (সহজ)',
    speakRoadStatus: 'মাতি শুনক (অডিঅʼ)',
    pictureGuideTitle: 'ছবি আৰু আলোকচিত্ৰৰ সহজ সহায়িকা',
    listenToGuide: 'মাতত শুনিবলৈ টিপক',
    findSafeRoute: 'নিৰাপদ পথ বিচাৰক',
    useMyLocation: 'মোৰ স্থান ব্যৱহাৰ কৰক',
    speakBtn: 'কওক',
    whereToGo: 'আপুনি কʼলৈ যাব বিচাৰে?',
    safestRoute: 'আটাইতকৈ নিৰাপদ পথ',
    fastestRoute: 'আটাইতকৈ দ্ৰুত',
    shortestRoute: 'আটাইতকৈ চুটি',
    startJourney: 'যাত্ৰা আৰম্ভ কৰক',
    whyThisRoute: 'এই পথ কিয়?',
    takeSaferRoute: 'নিৰাপদ পথ লওক',
    emergencyBtn: 'জৰুৰীকালীন',
    findSafestEmergencyRoute: 'নিৰাপদ জৰুৰীকালীন পথ বিচাৰক',
    roadAccess: 'পথৰ সুবিধা',
  },
  bn: {
    appTitle: 'ROAD_NAVI (রোড_নাভি)',
    appSubtitle: 'উত্তর-পূর্ব ভারতের প্রতিটি নাগরিকের নিরাপদ সড়ক যাত্রা ও নেভিগেশন',
    citizenMode: 'নাগরিক / সহজ মোড (Citizen)',
    proMode: 'লজিস্টিকস প্রো মোড (Pro)',
    citizenModeDesc: 'গাড়ি, বাস, বাইক ও সাধারণ পরিবারের জন্য সহজ ভাষায় রাস্তার আপডেট।',
    proModeDesc: 'ভারী ট্রাক ও পরিবহন বিশেষজ্ঞদের জন্য উন্নত বিশ্লেষণ।',
    checkRoadTitle: 'আজ আপনার রাস্তা নিরাপদ কি না জেনে নিন',
    checkRoadSubtitle: 'গাড়ি, বাস ও নিত্যযাত্রীদের জন্য নির্ভরযোগ্য লাইভ রোড তথ্য।',
    fromLabel: 'কোথা থেকে',
    toLabel: 'কোথায় যাবেন',
    vehicleLabel: 'আপনি কিসে ভ্রমণ করছেন',
    car: 'গাড়ি / ট্যাক্সি / এসইউভি',
    bike: 'বাইক / স্কুটার',
    bus: 'যাত্রীবাহী বাস / সুমো',
    truck: 'ট্রাক / মালবাহী গাড়ি',
    checkStatusBtn: 'রাস্তার নিরাপত্তা স্ট্যাটাস দেখুন',
    popularRoutes: 'জনপ্রিয় ভ্রমণের রুট (এক ক্লিকে দেখুন)',
    safeToGo: 'রাস্তা নিরাপদ ও খোলা আছে (SAFE)',
    driveCarefully: 'সতর্কতা: সাবধানে গাড়ি চালান (CAUTION)',
    avoidRoad: 'রাস্তা বন্ধ / ধসের আশঙ্কা (DANGER)',
    emergencyHelplines: 'জরুরি হেল্পলাইন নম্বর (২৪x৭ টোল ফ্রি)',
    tollFree: 'টোল ফ্রি',
    shareWhatsApp: 'হোয়াটসঅ্যাপে পরিবারের সাথে শেয়ার করুন',
    printAdvisory: 'ভ্রমণ কার্ড সংরক্ষণ / প্রিন্ট করুন',
    weatherClear: 'পরিষ্কার আকাশ / রৌদ্রোজ্জ্বল',
    roadClear: 'সমস্ত সেতু ও পাহাড়ি রাস্তা সচল',
    noLandslides: 'কোনো ধসের ঝুঁকি নেই',
    plainEnglishExplanation: 'সহজ ভাষায় ব্যাখ্যা',
    simpleAdvice: 'সাধারণ যাত্রীর জন্য পরামর্শ',
    quickQuestions: 'সাধারণ চালকদের সচরাচর প্রশ্ন',
    pictureMode: 'ছবি ও ভয়েস মোড (সহজ)',
    speakRoadStatus: 'ভয়েসে শুনুন (অডিও)',
    pictureGuideTitle: 'ছবি এবং আলোকচিত্র ভিত্তিক সহজ গাইড',
    listenToGuide: 'শুনতে এখানে স্পর্শ করুন',
    findSafeRoute: 'নিরাপদ রুট খুঁজুন',
    useMyLocation: 'আমার অবস্থান ব্যবহার করুন',
    speakBtn: 'বলুন',
    whereToGo: 'আপনি কোথায় যেতে চান?',
    safestRoute: 'সবচেয়ে নিরাপদ রুট',
    fastestRoute: 'সবচেয়ে দ্রুত',
    shortestRoute: 'সবচেয়ে ছোট',
    startJourney: 'যাত্রা শুরু করুন',
    whyThisRoute: 'এই রুট কেন?',
    takeSaferRoute: 'নিরাপদ রুট নিন',
    emergencyBtn: 'জরুরি',
    findSafestEmergencyRoute: 'সবচেয়ে নিরাপদ জরুরি রুট খুঁজুন',
    roadAccess: 'রাস্তার সুবিধা',
  },
  ne: {
    appTitle: 'ROAD_NAVI (रोड_नवी)',
    appSubtitle: 'उत्तर-पूर्वी भारतमा सबैका लागि सुरक्षित यात्रा र नेभिगेसन',
    citizenMode: 'नागरिक / सरल मोड (Citizen)',
    proMode: 'लजिस्टिक प्रो मोड (Pro)',
    citizenModeDesc: 'गाडी, बस र परिवारका लागि सजिलो सडक सुरक्षा अपडेट।',
    proModeDesc: 'व्यावसायिक ट्रक र भू-प्राविधिक विश्लेषणका लागि मोड।',
    checkRoadTitle: 'आज तपाईंको सडक सुरक्षित छ कि छैन जाँच्नुहोस्',
    checkRoadSubtitle: 'कार, बस र दैनिक यात्रुहरूका लागि प्रत्यक्ष सडक जानकारी।',
    fromLabel: 'कहाँबाट',
    toLabel: 'कहाँ जाने',
    vehicleLabel: 'तपाईं केमा यात्रा गर्दै हुनुहुन्छ',
    car: 'कार / ट्याक्सी / जीप',
    bike: 'बाइक / स्कुटर',
    bus: 'बस / सुमो',
    truck: 'ट्रक / ढुवानी साधन',
    checkStatusBtn: 'सडक सुरक्षा अवस्था जाँच्नुहोस्',
    popularRoutes: 'लोकप्रिय दैनिक मार्गहरू',
    safeToGo: 'सडक सुरक्षित र खुला छ (SAFE)',
    driveCarefully: 'सावधानी: बिस्तारै चलाउनुहोस् (CAUTION)',
    avoidRoad: 'सडक बन्द / पहिरोको जोखिम (DANGER)',
    emergencyHelplines: 'आपतकालीन सहायता नम्बर (२४x७ टोल फ्री)',
    tollFree: 'टोल फ्री',
    shareWhatsApp: 'व्हाट्सएपमा परिवारसँग साझा गर्नुहोस्',
    printAdvisory: 'यात्रा कार्ड सुरक्षित गर्नुहोस्',
    weatherClear: 'सफा मौसम / घाम',
    roadClear: 'सबै पुल र सडक खुला छन्',
    noLandslides: 'पहिरोको कुनै जोखिम छैन',
    plainEnglishExplanation: 'सजिलो भाषामा बुझ्नुहोस्',
    simpleAdvice: 'दैनिक यात्रुका लागि सल्लाह',
    quickQuestions: 'चालकहरूले प्रायः सोध्ने प्रश्नहरू',
    pictureMode: 'चित्र र आवाज मोड (सरल)',
    speakRoadStatus: 'आवाजमा सुन्नुहोस्',
    pictureGuideTitle: 'चित्र आधारित सजिलो निर्देशिका',
    listenToGuide: 'सुन्न यहाँ थिच्नुहोस्',
    findSafeRoute: 'सुरक्षित बाटो खोज्नुहोस्',
    useMyLocation: 'मेरो स्थान प्रयोग गर्नुहोस्',
    speakBtn: 'बोल्नुहोस्',
    whereToGo: 'तपाईं कहाँ जान चाहनुहुन्छ?',
    safestRoute: 'सबैभन्दा सुरक्षित बाटो',
    fastestRoute: 'सबैभन्दा छिटो',
    shortestRoute: 'सबैभन्दा छोटो',
    startJourney: 'यात्रा सुरु गर्नुहोस्',
    whyThisRoute: 'यो बाटो किन?',
    takeSaferRoute: 'सुरक्षित बाटो लिनुहोस्',
    emergencyBtn: 'आपतकालीन',
    findSafestEmergencyRoute: 'सुरक्षित आपतकालीन बाटो खोज्नुहोस्',
    roadAccess: 'सडक पहुँच',
  },
};
