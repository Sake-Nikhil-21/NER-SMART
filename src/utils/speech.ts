import { LanguageCode } from '../types';

export const isSpeechSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

export const stopSpeaking = (): void => {
  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
};

export const speakText = (
  text: string,
  language: LanguageCode = 'hi',
  options?: {
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }
): boolean => {
  if (!isSpeechSupported()) {
    options?.onError?.(new Error('Speech not supported'));
    return false;
  }

  try {
    // Cancel any active utterance first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || 0.92; // slightly gentle pace for elders and rural listeners
    utterance.pitch = options?.pitch || 1.0;

    // Pick voice language
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'bn') {
      utterance.lang = 'bn-IN';
    } else if (language === 'as') {
      // If Assamese voice is available in browser, use as-IN, else Bengali/Hindi
      utterance.lang = 'as-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    // Try finding specific regional voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(v => {
        if (language === 'hi') return v.lang.startsWith('hi');
        if (language === 'bn') return v.lang.startsWith('bn');
        if (language === 'as') return v.lang.startsWith('as') || v.lang.startsWith('bn');
        return v.lang.startsWith('en-IN') || v.lang.startsWith('en');
      });
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      options?.onError?.(e);
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    options?.onError?.(err);
    return false;
  }
};
