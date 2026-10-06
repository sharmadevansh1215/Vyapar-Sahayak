import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';

interface VoiceReadoutControlProps {
  currentLanguage: Language;
  title: string;
  summaryText: string;
  categoryName: string;
  district: string;
}

export const VoiceReadoutControl: React.FC<VoiceReadoutControlProps> = ({
  currentLanguage,
  title,
  summaryText,
  categoryName,
  district,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
      const updateVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getLanguageTag = (lang: Language): string => {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'mr':
        return 'mr-IN';
      case 'ta':
        return 'ta-IN';
      case 'te':
        return 'te-IN';
      case 'kn':
        return 'kn-IN';
      default:
        return 'en-IN';
    }
  };

  const getSpeechScript = (): string => {
    if (summaryText && summaryText.length > 20) {
      return summaryText.replace(/[*_#`]/g, '');
    }
    return `${categoryName} Enterprise Feasibility Report for ${district}. MoSJE provides up to ninety percent concessional loan with ten percent self-margin contribution. Project feasibility and Debt Service Coverage Ratio are strong.`;
  };

  const handlePlay = () => {
    if (!speechSupported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = getSpeechScript();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const langTag = getLanguageTag(currentLanguage);
    utterance.lang = langTag;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    // Pick best matching voice
    const matchedVoice = voices.find(
      (v) => v.lang.toLowerCase() === langTag.toLowerCase() || v.lang.startsWith(langTag.slice(0, 2))
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis playback event:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (!speechSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!speechSupported) return null;

  return (
    <div className="flex items-center gap-2 bg-[#f0f4f9] border border-[#c3c6d5] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#003c90] shadow-2xs">
      <span className="material-symbols-outlined text-base">volume_up</span>
      <span className="hidden sm:inline">
        {currentLanguage === 'hi' ? 'रिपोर्ट आवाज सुनें:' : 'Voice Readout:'}
      </span>

      {!isPlaying && !isPaused && (
        <button
          type="button"
          onClick={handlePlay}
          className="flex items-center gap-1 px-2.5 py-1 bg-[#003c90] hover:bg-[#002d6c] text-white rounded-lg transition-colors cursor-pointer text-xs font-bold"
          title="Play voice readout"
        >
          <span className="material-symbols-outlined text-sm">play_arrow</span>
          <span>Play</span>
        </button>
      )}

      {isPlaying && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePause}
            className="flex items-center gap-1 px-2 py-1 bg-[#fe9832] hover:bg-[#e6831d] text-[#683700] rounded-lg transition-colors cursor-pointer text-xs font-bold"
            title="Pause voice"
          >
            <span className="material-symbols-outlined text-sm">pause</span>
            <span>Pause</span>
          </button>
          <button
            type="button"
            onClick={handleStop}
            className="w-7 h-7 flex items-center justify-center bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-lg transition-colors cursor-pointer"
            title="Stop voice"
          >
            <span className="material-symbols-outlined text-xs">stop</span>
          </button>
          <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-ping ml-1" />
        </div>
      )}

      {isPaused && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePlay}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#003c90] text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            <span>Resume</span>
          </button>
          <button
            type="button"
            onClick={handleStop}
            className="w-7 h-7 flex items-center justify-center bg-[#ba1a1a] text-white rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">stop</span>
          </button>
        </div>
      )}
    </div>
  );
};
