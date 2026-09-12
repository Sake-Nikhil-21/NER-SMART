import React, { useState, useEffect } from 'react';
import { LanguageCode } from '../../types';
import {
  CITIZEN_POPULAR_ROUTES,
  NORTH_EAST_PICTURE_DESTINATIONS,
  ROAD_SIGNAL_PICTURE_GUIDE,
  VEHICLE_PICTURE_OPTIONS,
  COMMON_HAZARDS_PICTURE_GUIDE,
  CITIZEN_HELPLINES
} from '../../data/mockData';
import { TRANSLATIONS } from '../../data/translations';
import { speakText, stopSpeaking, isSpeechSupported } from '../../utils/speech';
import {
  Volume2,
  VolumeX,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Fuel,
  Compass,
  ArrowRight,
  ShieldCheck,
  Eye,
  HeartHandshake,
  Sparkles,
  MapPin
} from 'lucide-react';

interface EasyPictureViewProps {
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  onNavigateToPro?: () => void;
  onStartLiveNav?: () => void;
  onOpenHelplines?: () => void;
}

export const EasyPictureView: React.FC<EasyPictureViewProps> = ({
  language,
  onChangeLanguage,
  onNavigateToPro,
  onStartLiveNav,
  onOpenHelplines
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('cit-1');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('car');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpeechText, setActiveSpeechText] = useState<string>('');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentRoute = CITIZEN_POPULAR_ROUTES.find(r => r.id === selectedRouteId) || CITIZEN_POPULAR_ROUTES[0];

  // Stop speaking when unmounted
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setActiveSpeechText('');
      return;
    }

    setActiveSpeechText(text);
    setIsSpeaking(true);
    speakText(text, language, {
      onEnd: () => {
        setIsSpeaking(false);
        setActiveSpeechText('');
      },
      onError: () => {
        setIsSpeaking(false);
        setActiveSpeechText('');
      }
    });
  };

  const getRouteAudioText = () => {
    if (language === 'hi') {
      return currentRoute.voiceHindi || currentRoute.plainAdvice;
    } else if (language === 'as') {
      return currentRoute.voiceAssamese || currentRoute.voiceHindi || currentRoute.plainAdvice;
    } else if (language === 'bn') {
      return currentRoute.voiceBengali || currentRoute.voiceHindi || currentRoute.plainAdvice;
    }
    return currentRoute.voiceEnglish || currentRoute.plainAdvice;
  };

  const getIntroAudioText = () => {
    if (language === 'hi') {
      return 'नमस्ते! यहाँ आप तस्वीरों को देखकर जान सकते हैं कि आपकी सड़क खुली है या बंद। नीचे किसी भी शहर की तस्वीर पर दबाएं, और आवाज़ सुनने के लिए स्पीकर बटन दबाएं।';
    } else if (language === 'as') {
      return 'নমস্কাৰ! ইয়াত আপুনি ছবি চাই জানিব পাৰিব যে আপোনাৰ পথ মুকলি নে বন্ধ। যিকোনো চহৰৰ ছবিত স্পৰ্শ কৰক আৰু মাতি শুনিবলৈ স্পীকাৰত টিপক।';
    } else if (language === 'bn') {
      return 'নমস্কার! এখানে আপনি ছবি দেখে জানতে পারবেন রাস্তা খোলা নাকি বন্ধ। শহরের ছবিতে স্পর্শ করুন এবং শুনতে স্পিকার বোতাম চাপুন।';
    }
    return 'Welcome to the Picture Guide! Here you can check if your mountain road is open or blocked by tapping on photos. Tap any picture or the speaker button to hear spoken road advice.';
  };

  return (
    <div id="easy-picture-view-root" className="max-w-6xl mx-auto space-y-8 pb-16 pt-2">
      {/* Top Welcome Card with Audio Introduction */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-950 p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 rounded-full bg-cyan-500/20 px-3.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.pictureMode} • সহজ ছবি সহায়িকা</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>🖼️</span>
              <span>{t.pictureGuideTitle}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {language === 'hi'
                ? 'तस्वीरें देखकर समझें सड़क की स्थिति। बिना किसी परेशानी के बोलकर सुनें कि सड़क खुली है या बंद।'
                : language === 'as'
                ? 'ছবি চাই পথৰ অৱস্থা বুজি লওক। আপোনাৰ বাবে সহজ মাত আৰু ছবিৰ ব্যৱস্থা।'
                : language === 'bn'
                ? 'ছবি দেখে সহজেই রাস্তার অবস্থা বুঝে নিন। শুনতে স্পিকার বোতামে চাপুন।'
                : 'Simple picture-based road guide designed for everyone. Tap pictures to check if mountain roads are open, cautious, or closed.'}
            </p>
          </div>

          {/* Voice Help Player Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="btn-picture-voice-intro"
              onClick={() => handleSpeak(getIntroAudioText())}
              className={`flex items-center justify-center space-x-2.5 rounded-2xl px-5 py-3.5 font-bold text-sm shadow-lg transition active:scale-95 ${
                isSpeaking && activeSpeechText === getIntroAudioText()
                  ? 'bg-rose-600 text-white animate-pulse shadow-rose-900/50'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-cyan-900/50'
              }`}
            >
              {isSpeaking && activeSpeechText === getIntroAudioText() ? (
                <>
                  <VolumeX className="w-5 h-5" />
                  <span>{language === 'hi' ? 'आवाज़ रोकें' : 'Stop Audio'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  <span>{language === 'hi' ? '🔊 बोलकर समझाएं' : language === 'as' ? '🔊 মাতি শুনক' : '🔊 Listen Out Loud'}</span>
                </>
              )}
            </button>

            {/* Quick Language Badges */}
            <div className="flex items-center justify-center space-x-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
              {(['hi', 'as', 'bn', 'en'] as LanguageCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => onChangeLanguage(code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    language === code
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {code === 'hi' ? 'हिन्दी' : code === 'as' ? 'অসমীয়া' : code === 'bn' ? 'বাংলা' : 'EN'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: 3 BADA SIGNAL PICTURES (WHAT DO COLORS MEAN?) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>🚦</span>
              <span>
                {language === 'hi'
                  ? 'सड़क के रंग का क्या मतलब है? (रंग गाइड)'
                  : language === 'as'
                  ? 'পথৰ ৰঙৰ অৰ্থ কি? (ৰং নিৰ্দেশনা)'
                  : language === 'bn'
                  ? 'রাস্তার রঙের অর্থ কি? (রং গাইড)'
                  : 'What do the Road Colors Mean? (Signal Guide)'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === 'hi'
                ? 'हरा = जाओ, पीला = संभलकर चलो, लाल = मत जाओ'
                : 'Green = Safe to Go, Yellow = Drive with Caution, Red = Do Not Travel'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROAD_SIGNAL_PICTURE_GUIDE.map((sig) => {
            const isGreen = sig.color === 'green';
            const isYellow = sig.color === 'yellow';
            const isRed = sig.color === 'red';

            const borderColor = isGreen
              ? 'border-emerald-500/70 hover:border-emerald-400'
              : isYellow
              ? 'border-amber-500/70 hover:border-amber-400'
              : 'border-rose-500/70 hover:border-rose-400';

            const bgBadge = isGreen
              ? 'bg-emerald-500 text-slate-950'
              : isYellow
              ? 'bg-amber-500 text-slate-950'
              : 'bg-rose-600 text-white';

            const audioText =
              language === 'hi'
                ? sig.audioHi
                : language === 'as'
                ? sig.audioAs
                : language === 'bn'
                ? sig.audioBn
                : sig.audioEn;

            const meaning =
              language === 'hi'
                ? sig.meaningHi
                : language === 'as'
                ? sig.meaningAs
                : language === 'bn'
                ? sig.meaningBn
                : sig.meaningEn;

            return (
              <div
                key={sig.color}
                className={`overflow-hidden rounded-2xl border-2 ${borderColor} bg-slate-900/90 shadow-xl transition hover:-translate-y-1`}
              >
                {/* Photo */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={sig.photo}
                    alt={sig.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  {/* Status Badge Over Image */}
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-lg uppercase tracking-wide flex items-center gap-1.5 ${bgBadge}`}>
                      <span>{sig.symbol}</span>
                      <span>
                        {isGreen
                          ? (language === 'hi' ? 'खुला है / जाओ' : 'SAFE / GO')
                          : isYellow
                          ? (language === 'hi' ? 'धीमी गति / संभलें' : 'CAUTION')
                          : (language === 'hi' ? 'बंद है / मत जाओ' : 'BLOCKED / STOP')}
                      </span>
                    </span>
                  </div>

                  {/* Speaker Button on Photo */}
                  <button
                    onClick={() => handleSpeak(audioText)}
                    className="absolute top-3 right-3 rounded-full bg-slate-950/80 p-2 text-white hover:bg-cyan-500 hover:text-slate-950 transition border border-slate-700 shadow-md active:scale-90"
                    title="Speak"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="text-base font-extrabold text-white">
                    {sig.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed min-h-[44px]">
                    {meaning}
                  </p>

                  <button
                    onClick={() => handleSpeak(audioText)}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 py-2.5 px-3 text-xs font-bold text-slate-200 border border-slate-700 transition"
                  >
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>
                      {language === 'hi'
                        ? 'आवाज़ में सुनें'
                        : language === 'as'
                        ? 'মাতত শুনক'
                        : language === 'bn'
                        ? 'ভয়েসে শুনুন'
                        : 'Tap to Hear Meaning'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: TAP DESTINATION PHOTO (कहाँ जाना है? तस्वीर छूकर चुनें) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>📍</span>
              <span>
                {language === 'hi'
                  ? 'कहाँ जाना है? तस्वीर देखकर चुनें'
                  : language === 'as'
                  ? 'কʼলৈ যাব? ছবি চাই বাছক'
                  : language === 'bn'
                  ? 'কোথায় যাবেন? ছবি দেখে বেছে নিন'
                  : 'Where are you going? Tap on the Picture'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === 'hi'
                ? 'अपने शहर या पर्यटन स्थल की तस्वीर पर क्लिक करें'
                : 'Click the photo of your destination city to check route safety instantly'}
            </p>
          </div>

          <div className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-800/60 w-fit">
            ✓ {CITIZEN_POPULAR_ROUTES.length} {language === 'hi' ? 'सड़कें उपलब्ध हैं' : 'Live Routes Available'}
          </div>
        </div>

        {/* Destination Photo Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {CITIZEN_POPULAR_ROUTES.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const isSafe = route.status === 'safe';
            const isCaution = route.status === 'caution';
            const isDanger = route.status === 'danger';

            const statusBadge = isSafe
              ? { text: language === 'hi' ? '🟢 सुरक्षित' : '🟢 Safe', color: 'bg-emerald-500/90 text-slate-950' }
              : isCaution
              ? { text: language === 'hi' ? '🟡 संभलकर' : '🟡 Caution', color: 'bg-amber-500/90 text-slate-950' }
              : { text: language === 'hi' ? '🔴 बंद है' : '🔴 Blocked', color: 'bg-rose-600 text-white' };

            return (
              <div
                key={route.id}
                onClick={() => {
                  setSelectedRouteId(route.id);
                  handleSpeak(
                    language === 'hi'
                      ? `${route.to} का रास्ता चुना गया है। ${route.voiceHindi || route.plainAdvice}`
                      : `${route.to} route selected. ${route.voiceEnglish || route.plainAdvice}`
                  );
                }}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-cyan-400 ring-4 ring-cyan-500/30 scale-[1.02] shadow-2xl shadow-cyan-950'
                    : 'border-slate-800 hover:border-slate-600 bg-slate-900/60 opacity-90 hover:opacity-100'
                }`}
              >
                {/* Photo */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-950">
                  <img
                    src={route.imageUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'}
                    alt={route.to}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Status Pill on Picture */}
                  <span className={`absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-md ${statusBadge.color}`}>
                    {statusBadge.text}
                  </span>

                  {/* Speaker Icon */}
                  <div className="absolute top-2 right-2 rounded-full bg-slate-950/80 p-1 text-slate-300 group-hover:text-cyan-400 transition">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* City Name & Tag */}
                <div className="p-3 bg-slate-900/90 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                      {route.from.split(',')[0]} →
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {route.distanceKm} km
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-200 transition truncate">
                    {route.to}
                  </h4>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {route.driveTimeCar}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: VEHICLE PICKER WITH PICTURES (किस गाड़ी से जा रहे हैं?) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>🚗</span>
            <span>
              {language === 'hi'
                ? 'आप किस गाड़ी से जा रहे हैं? (वाहन चुनें)'
                : language === 'as'
                ? 'আপুনি কি গাড়ীৰে যাব? (বাহন বাছক)'
                : language === 'bn'
                ? 'আপনি কোন গাড়িতে যাবেন? (যানবাহন বেছে নিন)'
                : 'Select Your Vehicle (Car, Bike, Bus, or Truck)'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {language === 'hi'
              ? 'अलग-अलग गाड़ियों के लिए सड़क की स्थिति अलग हो सकती है'
              : 'Road safety advice adapts according to vehicle type and ground clearance'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {VEHICLE_PICTURE_OPTIONS.map((v) => {
            const isSelected = selectedVehicle === v.id;
            return (
              <div
                key={v.id}
                onClick={() => {
                  setSelectedVehicle(v.id);
                  handleSpeak(
                    language === 'hi'
                      ? `${v.descHi} चुना गया है।`
                      : `${v.descEn} selected.`
                  );
                }}
                className={`cursor-pointer overflow-hidden rounded-2xl border-2 transition-all p-3 text-center space-y-2.5 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <div className="h-24 w-full rounded-xl overflow-hidden bg-slate-950">
                  <img
                    src={v.photo}
                    alt={v.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white">
                    {v.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'hi' ? v.descHi : v.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: BIG PICTURE ROAD SAFETY REPORT (MAIN RESULT CARD) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>📋</span>
            <span>
              {language === 'hi'
                ? 'आज का सड़क सुरक्षा परिणाम (आवाज़ व चित्र)'
                : language === 'as'
                ? 'আজিৰ পথৰ ফলাফল (মাত আৰু ছবি)'
                : language === 'bn'
                ? 'আজকের রাস্তার ফলাফল (ভয়েস ও ছবি)'
                : 'Today\'s Live Route Safety Report'}
            </span>
          </h2>
        </div>

        <div
          className={`overflow-hidden rounded-3xl border-3 shadow-2xl p-6 sm:p-8 space-y-6 ${
            currentRoute.status === 'safe'
              ? 'border-emerald-500 bg-gradient-to-b from-emerald-950/40 via-slate-950 to-slate-950 shadow-emerald-950/40'
              : currentRoute.status === 'caution'
              ? 'border-amber-500 bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 shadow-amber-950/40'
              : 'border-rose-500 bg-gradient-to-b from-rose-950/50 via-slate-950 to-slate-950 shadow-rose-950/40'
          }`}
        >
          {/* Header Row: Highway name + Giant Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-300 font-bold uppercase">
                  {currentRoute.highway}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentRoute.from} ➔ {currentRoute.to}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                {language === 'hi'
                  ? `दूरी: ${currentRoute.distanceKm} किलोमीटर • कार से समय: ${currentRoute.driveTimeCar} • बस से: ${currentRoute.driveTimeBus}`
                  : `Distance: ${currentRoute.distanceKm} km • Car Time: ${currentRoute.driveTimeCar} • Bus Time: ${currentRoute.driveTimeBus}`}
              </p>
            </div>

            {/* Giant Visual Badge */}
            <div className="flex items-center gap-3">
              {currentRoute.status === 'safe' ? (
                <div className="flex items-center space-x-3 rounded-2xl bg-emerald-500 px-5 py-3 text-slate-950 shadow-xl shadow-emerald-950 font-black text-base sm:text-lg">
                  <CheckCircle2 className="w-7 h-7 text-slate-950 stroke-[2.5]" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-85">
                      {language === 'hi' ? 'सड़क स्थिति' : 'Road Status'}
                    </div>
                    <div>{language === 'hi' ? 'खुला है • सुरक्षित (SAFE)' : 'OPEN & SAFE TO GO'}</div>
                  </div>
                </div>
              ) : currentRoute.status === 'caution' ? (
                <div className="flex items-center space-x-3 rounded-2xl bg-amber-500 px-5 py-3 text-slate-950 shadow-xl shadow-amber-950 font-black text-base sm:text-lg">
                  <AlertTriangle className="w-7 h-7 text-slate-950 stroke-[2.5]" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-85">
                      {language === 'hi' ? 'सड़क स्थिति' : 'Road Status'}
                    </div>
                    <div>{language === 'hi' ? 'संभलकर चलें (CAUTION)' : 'DRIVE WITH CAUTION'}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 rounded-2xl bg-rose-600 px-5 py-3 text-white shadow-xl shadow-rose-950 font-black text-base sm:text-lg animate-pulse">
                  <XCircle className="w-7 h-7 text-white stroke-[2.5]" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-200">
                      {language === 'hi' ? 'सड़क स्थिति' : 'Road Status'}
                    </div>
                    <div>{language === 'hi' ? 'रास्ता बंद है (DANGER)' : 'ROAD BLOCKED / DANGER'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Picture Comparison Side-by-Side: Landmark photo & Road Condition photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Landmark Photo */}
            <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
              <img
                src={currentRoute.imageUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'}
                alt={currentRoute.to}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="bg-slate-950/80 px-2.5 py-1 rounded-lg font-bold border border-slate-700">
                  🏙️ {currentRoute.to}
                </span>
                <span className="bg-slate-950/80 px-2.5 py-1 rounded-lg text-slate-300">
                  {language === 'hi' ? 'मंजिल की तस्वीर' : 'Destination Landmark'}
                </span>
              </div>
            </div>

            {/* Condition Photo */}
            <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
              <img
                src={currentRoute.conditionImageUrl || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'}
                alt="Road Condition"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    currentRoute.status === 'safe'
                      ? 'bg-emerald-500 text-slate-950'
                      : currentRoute.status === 'caution'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  📸 {language === 'hi' ? 'वर्तमान सड़क की स्थिति' : 'Current Road Condition'}
                </span>
                <span className="bg-slate-950/80 px-2.5 py-1 rounded-lg text-slate-300">
                  {currentRoute.status === 'safe'
                    ? (language === 'hi' ? 'साफ सड़क' : 'Clear Tarmac')
                    : currentRoute.status === 'caution'
                    ? (language === 'hi' ? 'बारिश/धुंध' : 'Rain/Mist')
                    : (language === 'hi' ? 'भूस्खलन' : 'Landslide Blockage')}
                </span>
              </div>
            </div>
          </div>

          {/* Giant Audio Playback Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/70 p-4 sm:p-6 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-300 border border-cyan-500/30">
                <Volume2 className="w-7 h-7 animate-bounce" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {language === 'hi' ? 'आवाज़ में जानकारी (Voice Broadcast)' : 'Voice Broadcast'}
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white">
                  {language === 'hi'
                    ? 'पूरा रोड रिपोर्ट बोलकर सुनें'
                    : language === 'as'
                    ? 'সম্পূৰ্ণ পথ ৰিপৰ্ট মাতি শুনক'
                    : language === 'bn'
                    ? 'সম্পূর্ণ রোড রিপোর্ট ভয়েসে শুনুন'
                    : 'Tap to Hear Complete Spoken Road Advice'}
                </div>
                <div className="text-xs text-slate-300 max-w-xl">
                  {getRouteAudioText()}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSpeak(getRouteAudioText())}
                className={`shrink-0 flex items-center space-x-2 rounded-2xl px-5 py-3.5 font-black text-xs sm:text-sm transition active:scale-95 shadow-xl ${
                  isSpeaking && activeSpeechText === getRouteAudioText()
                    ? 'bg-rose-600 text-white animate-pulse shadow-rose-900/50'
                    : 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 hover:brightness-110 shadow-cyan-950'
                }`}
              >
                {isSpeaking && activeSpeechText === getRouteAudioText() ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>{language === 'hi' ? 'आवाज़ बंद करें' : 'Stop Audio'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{language === 'hi' ? '🔊 अभी सुनें' : language === 'as' ? '🔊 শুনক' : '🔊 Listen Now'}</span>
                  </>
                )}
              </button>

              {onStartLiveNav && (
                <button
                  id="btn-easy-picture-live-gps"
                  onClick={onStartLiveNav}
                  className="shrink-0 flex items-center space-x-2 rounded-2xl px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-cyan-500/50 text-cyan-300 font-bold text-xs sm:text-sm shadow-xl transition active:scale-95"
                >
                  <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>{language === 'hi' ? '🧭 बोलकर रास्ता देखें' : '🧭 Live Voice GPS'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Visual Amenities Grid (Petrol, Weather, Food) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${currentRoute.petrolPumpsOpen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                <Fuel className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">
                  {language === 'hi' ? 'पेट्रोल पंप' : 'Petrol Pump'}
                </span>
                <strong className={`text-xs ${currentRoute.petrolPumpsOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {currentRoute.petrolPumpsOpen ? (language === 'hi' ? 'खुले हैं ✓' : 'Open 24x7') : (language === 'hi' ? 'बंद हैं ✕' : 'Closed')}
                </strong>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">
                  {language === 'hi' ? 'मौसम' : 'Weather'}
                </span>
                <strong className="text-xs text-slate-200 truncate block max-w-[130px]">
                  {currentRoute.weatherSummary.split('•')[0]}
                </strong>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${currentRoute.landslideRisk === 'None' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">
                  {language === 'hi' ? 'भूस्खलन' : 'Landslide'}
                </span>
                <strong className="text-xs text-slate-200">
                  {currentRoute.landslideRisk === 'None' ? (language === 'hi' ? 'कोई खतरा नहीं' : 'No Danger') : currentRoute.landslideRisk}
                </strong>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">
                  {language === 'hi' ? 'पुलिस बूथ' : 'Police Support'}
                </span>
                <strong className="text-xs text-blue-300">
                  {language === 'hi' ? 'सक्रिय है ✓' : 'Active On Route'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ONE-TAP EMERGENCY PICTURE CALLS (आपातकाल में तुरंत कॉल करें) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>🚨</span>
            <span>
              {language === 'hi'
                ? 'मदद चाहिए? सीधे नंबर पर दबाएं (एक क्लिक कॉल)'
                : language === 'as'
                ? 'সহায় লাগে? ফোন কৰক (এবাৰতে কল)'
                : language === 'bn'
                ? 'সাহায্য চান? নম্বরে স্পর্শ করুন (এক ক্লিকে কল)'
                : 'Need Immediate Help? One-Tap Emergency Calls'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {language === 'hi'
              ? 'बिना किसी पढ़े-लिखे परेशानी के सीधे एम्बुलेंस, पुलिस और हाईवे सहायता को फोन लगाएं'
              : 'Toll-free emergency help lines with one-touch phone dialing for non-reading commuters'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Ambulance 108 */}
          <a
            href="tel:108"
            id="btn-call-ambulance"
            className="group relative overflow-hidden rounded-2xl border-2 border-rose-500/70 bg-gradient-to-b from-rose-950/80 to-slate-950 p-5 shadow-xl transition hover:-translate-y-1 hover:border-rose-400"
          >
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0 border border-rose-400/50">
                <img
                  src="https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=300&q=80"
                  alt="Ambulance"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wide flex items-center gap-1">
                  <span>🚑</span>
                  <span>{language === 'hi' ? 'एम्बुलेंस / अस्पताल' : 'Ambulance & Hospital'}</span>
                </span>
                <div className="text-3xl font-black text-white font-mono">
                  108
                </div>
                <div className="text-xs text-rose-200 font-semibold">
                  {language === 'hi' ? 'टोल फ्री • डॉक्टर व फर्स्ट एड' : 'Toll Free • Free Dispatch'}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-2 rounded-xl bg-rose-600 group-hover:bg-rose-500 py-2.5 font-black text-white text-xs shadow-lg transition">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>{language === 'hi' ? '108 पर कॉल करें' : 'Call 108 Now'}</span>
            </div>
          </a>

          {/* National SOS 112 */}
          <a
            href="tel:112"
            id="btn-call-police"
            className="group relative overflow-hidden rounded-2xl border-2 border-blue-500/70 bg-gradient-to-b from-blue-950/80 to-slate-950 p-5 shadow-xl transition hover:-translate-y-1 hover:border-blue-400"
          >
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0 border border-blue-400/50">
                <img
                  src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80"
                  alt="Police"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wide flex items-center gap-1">
                  <span>🚓</span>
                  <span>{language === 'hi' ? 'पुलिस व बचाव दल' : 'Police & Hill Rescue'}</span>
                </span>
                <div className="text-3xl font-black text-white font-mono">
                  112
                </div>
                <div className="text-xs text-blue-200 font-semibold">
                  {language === 'hi' ? '24 घंटे तुरंत सुरक्षा' : 'All North East States'}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-2 rounded-xl bg-blue-600 group-hover:bg-blue-500 py-2.5 font-black text-white text-xs shadow-lg transition">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>{language === 'hi' ? '112 पर कॉल करें' : 'Call 112 Now'}</span>
            </div>
          </a>

          {/* Highway Helpline 1033 */}
          <a
            href="tel:1033"
            id="btn-call-highway"
            className="group relative overflow-hidden rounded-2xl border-2 border-emerald-500/70 bg-gradient-to-b from-emerald-950/80 to-slate-950 p-5 shadow-xl transition hover:-translate-y-1 hover:border-emerald-400"
          >
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0 border border-emerald-400/50">
                <img
                  src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=300&q=80"
                  alt="Highway Crane"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1">
                  <span>🏗️</span>
                  <span>{language === 'hi' ? 'क्रेन व सड़क सहायता' : 'Highway Crane & Tow'}</span>
                </span>
                <div className="text-3xl font-black text-white font-mono">
                  1033
                </div>
                <div className="text-xs text-emerald-200 font-semibold">
                  {language === 'hi' ? 'गाड़ी खराब या गड्ढे में' : 'NHAI 24x7 Road Patrol'}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 py-2.5 font-black text-white text-xs shadow-lg transition">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>{language === 'hi' ? '1033 पर कॉल करें' : 'Call 1033 Now'}</span>
            </div>
          </a>
        </div>
      </section>

      {/* SECTION 6: COMMON WEATHER & HAZARDS PICTURE GUIDE */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>🌄</span>
            <span>
              {language === 'hi'
                ? 'सड़क पर क्या-क्या हो सकता है? (मौसम व खतरे के चित्र)'
                : language === 'as'
                ? 'বতৰ আৰু বিপদৰ ছবি নিৰ্দেশনা'
                : language === 'bn'
                ? 'আবহাওয়া ও বিপদের ছবি নির্দেশিকা'
                : 'Common Mountain Road Conditions & Weather Guide'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {language === 'hi'
              ? 'तस्वीरें देखकर समझें कि अलग-अलग मौसम में गाड़ी कैसे चलाना है'
              : 'Visual guide to understand mountain conditions and how to prepare'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMMON_HAZARDS_PICTURE_GUIDE.map((h) => {
            return (
              <div
                key={h.id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-3"
              >
                <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-950">
                  <img
                    src={h.photo}
                    alt={h.titleHi}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-white">
                    {language === 'hi' ? h.titleHi : h.titleEn}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {h.adviceHi}
                  </p>
                </div>
                <button
                  onClick={() => handleSpeak(`${h.titleHi}। ${h.adviceHi}`)}
                  className="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 py-1.5 text-xs text-cyan-300 font-semibold transition"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'सुनें' : 'Listen'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
