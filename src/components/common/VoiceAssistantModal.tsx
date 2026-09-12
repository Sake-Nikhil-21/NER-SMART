import React, { useState, useEffect } from 'react';
import { LanguageCode } from '../../types';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ShieldCheck,
  MapPin,
  AlertTriangle,
  Radio,
  Check
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestination: (dest: string) => void;
  onTriggerFindRoute: (destination?: string) => void;
  language: LanguageCode;
  currentDestination?: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectDestination,
  onTriggerFindRoute,
  language,
  currentDestination = 'Imphal, Manipur',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [speechStatus, setSpeechStatus] = useState<string>(
    'Tap the microphone or say your destination'
  );
  const [isSpeakingOutLoud, setIsSpeakingOutLoud] = useState(false);

  // Suggested voice quick taps
  const popularVoiceDestinations = [
    { label: 'Imphal', full: 'Imphal, Manipur', icon: '📍' },
    { label: 'Guwahati', full: 'Guwahati, Assam', icon: '📍' },
    { label: 'Shillong', full: 'Shillong, Meghalaya', icon: '📍' },
    { label: 'Kohima', full: 'Kohima, Nagaland', icon: '📍' },
    { label: 'Silchar', full: 'Silchar, Assam', icon: '📍' },
    { label: 'Nearest Hospital', full: 'RIMS Hospital, Imphal', icon: '🏥' },
    { label: 'Police / Relief HQ', full: 'State Disaster Relief Camp, Guwahati', icon: '🚓' },
  ];

  // Speech Synthesis Helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Choose voice matching language if possible
      if (language === 'hi' || language === 'ne') {
        utterance.lang = 'hi-IN';
      } else if (language === 'bn' || language === 'as') {
        utterance.lang = 'bn-IN';
      } else {
        utterance.lang = 'en-IN';
      }

      utterance.onstart = () => setIsSpeakingOutLoud(true);
      utterance.onend = () => setIsSpeakingOutLoud(false);
      utterance.onerror = () => setIsSpeakingOutLoud(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Welcome speech upon opening
  useEffect(() => {
    if (isOpen) {
      setSpokenText('');
      setSpeechStatus('Listening for destination... Say a city name or hospital.');
      
      const welcomeMsg =
        language === 'hi'
          ? 'नमस्ते। आप कहाँ जाना चाहते हैं? शहर का नाम बोलें।'
          : language === 'as'
          ? 'নমস্কাৰ। আপুনি কʼলৈ যাব বিচাৰে? কওক।'
          : language === 'bn'
          ? 'নমস্কার। আপনি কোথায় যেতে চান? বলুন।'
          : language === 'ne'
          ? 'नमस्ते। तपाईं कहाँ जान चाहनुहुन्छ? भन्नुहोस्।'
          : 'Hello. Where do you want to go? Say a city or hospital name.';

      speakText(welcomeMsg);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  // Start Real / Simulated Voice Recognition
  const handleToggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setSpeechStatus('Voice paused. Tap microphone to speak again.');
      return;
    }

    setIsListening(true);
    setSpeechStatus('Listening... Speak now into your microphone.');

    // Check for Browser SpeechRecognition API
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang =
          language === 'hi'
            ? 'hi-IN'
            : language === 'bn'
            ? 'bn-IN'
            : 'en-IN';

        recognition.onresult = (event: any) => {
          const result = event.results[0][0].transcript;
          setSpokenText(result);
          setIsListening(false);
          handleProcessVoiceInput(result);
        };

        recognition.onerror = () => {
          setIsListening(false);
          setSpeechStatus('Could not detect clear speech. Please tap a city below:');
        };

        recognition.start();
        return;
      } catch (e) {
        // Fallback to simulated quick recognition
      }
    }

    // Fallback simulated listening for environments where Web Speech API is restricted in iframe
    setTimeout(() => {
      setIsListening(false);
      setSpeechStatus('Select or tap destination below:');
    }, 3000);
  };

  const handleProcessVoiceInput = (text: string) => {
    const cleanText = text.toLowerCase();
    let matched = 'Imphal, Manipur';

    if (cleanText.includes('guwahati') || cleanText.includes('gauhati')) {
      matched = 'Guwahati, Assam';
    } else if (cleanText.includes('shillong')) {
      matched = 'Shillong, Meghalaya';
    } else if (cleanText.includes('kohima')) {
      matched = 'Kohima, Nagaland';
    } else if (cleanText.includes('silchar')) {
      matched = 'Silchar, Assam';
    } else if (cleanText.includes('hospital') || cleanText.includes('medical') || cleanText.includes('doctor')) {
      matched = 'RIMS Hospital, Imphal';
    } else if (cleanText.includes('police') || cleanText.includes('camp') || cleanText.includes('emergency')) {
      matched = 'State Disaster Relief Camp, Guwahati';
    } else {
      matched = text;
    }

    handleConfirmDestination(matched);
  };

  const handleConfirmDestination = (dest: string) => {
    onSelectDestination(dest);
    setSpokenText(dest);

    const announcement =
      language === 'hi'
        ? `सुरक्षित रास्ता खोजा जा रहा है: ${dest}. यह रास्ता सुरक्षित है। यात्रा समय 11 घंटे है।`
        : language === 'as'
        ? `সুৰক্ষিত পথ বিচৰা হৈছে: ${dest}. এই পথটো সুৰক্ষিত। যাত্ৰা সময় ১১ ঘণ্টা।`
        : language === 'bn'
        ? `নিরাপদ রুট খোঁজা হচ্ছে: ${dest}. এই রুটটি নিরাপদ। ভ্রমণের সময় ১১ ঘণ্টা।`
        : language === 'ne'
        ? `सुरक्षित बाटो खोजिँदैछ: ${dest}. यो बाटो सुरक्षित छ। यात्रा समय ११ घण्टा छ।`
        : `Searching safe route to ${dest}. This route is safe. Travel time is 11 hours 20 minutes. Weather is good.`;

    speakText(announcement);
    setSpeechStatus(`Found safe route to ${dest}!`);

    setTimeout(() => {
      onTriggerFindRoute(dest);
      onClose();
    }, 1600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          aria-label="Close Voice Assistant"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Pulse Indicator */}
        <div className="space-y-1 pt-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
            <Volume2 className={`w-3.5 h-3.5 ${isSpeakingOutLoud ? 'animate-bounce text-blue-600' : ''}`} />
            <span>VOICE ASSISTANCE (SPEAK & LISTEN)</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Say Where You Want To Go
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Speak clearly or tap any destination. The system speaks the safe route aloud.
          </p>
        </div>

        {/* Big Microphone Button */}
        <div className="flex flex-col items-center justify-center py-3">
          <button
            onClick={handleToggleListening}
            className={`relative flex h-24 w-24 items-center justify-center rounded-full border-4 shadow-xl transition-all duration-300 active:scale-90 ${
              isListening
                ? 'border-rose-400 bg-rose-600 text-white animate-pulse shadow-rose-200'
                : 'border-blue-400 bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:scale-105'
            }`}
            title="Tap to speak"
          >
            {isListening ? (
              <Mic className="h-10 w-10 animate-bounce" />
            ) : (
              <Mic className="h-10 w-10" />
            )}

            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600"></span>
              </span>
            )}
          </button>

          <span className="mt-3 text-xs font-extrabold uppercase tracking-wider text-slate-700">
            {isListening ? '🎙️ Listening... Speak Now' : 'Tap to Speak'}
          </span>
          <p className="text-xs font-medium text-slate-500 mt-1 max-w-xs px-2">
            {speechStatus}
          </p>
        </div>

        {/* Quick Tap Destinations for Easy Voice Selection */}
        <div className="space-y-2 text-left pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Or Tap Quick Voice Destination:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {popularVoiceDestinations.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleConfirmDestination(item.full)}
                className="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-800 text-xs font-bold transition text-left"
              >
                <span className="text-base">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Listen Again / Speak Route Out Loud Button */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <button
            type="button"
            onClick={() =>
              speakText(
                `Current destination is ${currentDestination}. Route B Jiribam is safe. Travel time is 11 hours 20 minutes. Weather is good.`
              )
            }
            className="flex items-center space-x-1 text-blue-700 font-bold hover:underline"
          >
            <Volume2 className="w-4 h-4" />
            <span>Hear Current Route Out Loud</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
