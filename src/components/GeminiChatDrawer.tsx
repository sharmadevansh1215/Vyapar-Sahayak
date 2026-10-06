import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language, BusinessCategory, LocationState } from '../types';

interface GeminiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  selectedCategory: BusinessCategory;
  location: LocationState;
  marginCapital: number;
}

export const GeminiChatDrawer: React.FC<GeminiChatDrawerProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  selectedCategory,
  location,
  marginCapital,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: currentLanguage === 'hi'
        ? `नमस्ते! मैं आपका "सहयोगी AI" (MoSJE Rural Enterprise Advisor) हूँ। आपने ${location.district} में ${selectedCategory.nameHindi} के लिए ₹${marginCapital.toLocaleString('en-IN')} मार्जिन चुना है। मैं ऋण पात्रता, मंडी दर, मशीनरी चयन और Google Maps द्वारा नजदीकी लीड बैंक खोजने में आपकी कैसे सहायता करूँ?`
        : `Namaste! I am your Sahayogi AI enterprise assistant. For your ${selectedCategory.name} enterprise in ${location.district} with ₹${marginCapital.toLocaleString('en-IN')} self margin, ask me anything about MoSJE 90% concessional credit, APMC Mandi rates, or find nearby banks via Google Maps.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [taskType, setTaskType] = useState<'general' | 'complex_feasibility' | 'fast_query'>('general');
  const [useMaps, setUseMaps] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (!isOpen) return null;

  // 1. Multi-turn send message
  const handleSendMessage = async (customText?: string) => {
    const query = (customText || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          category: selectedCategory,
          location,
          marginCapital,
          taskType,
          language: currentLanguage,
          useMaps,
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'मैं आपकी योजना के संबंध में जानकारी जुटा रहा हूँ।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || 'gemini-3.5-flash',
        groundingSources: data.groundingSources || [],
      };
      setMessages([...newHistory, assistantMsg]);
    } catch (err) {
      console.warn('Chat error fallback:', err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: currentLanguage === 'hi'
          ? `MoSJE योजना के तहत ${selectedCategory.nameHindi} के लिए 90% रियायती ऋण (6.5% - 8.0% ब्याज दर) उपलब्ध है। 3-6 महीने का मोराटोरियम भी मिलेगा।`
          : `Under MoSJE schemes for ${selectedCategory.name}, 90% concessional credit is sanctioned with 3-6 months moratorium.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash (local-resilient)',
      };
      setMessages([...newHistory, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Audio Transcription using gemini-3.5-flash
  const handleStartRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Microphone access is not supported in this environment.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          setIsTranscribing(true);
          try {
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Data,
                mimeType: 'audio/webm',
                language: currentLanguage,
              }),
            });
            const data = await res.json();
            if (data.text) {
              setInputQuery(data.text);
              handleSendMessage(data.text);
            }
          } catch (err) {
            console.error('Transcription error:', err);
          } finally {
            setIsTranscribing(false);
          }
        };
        reader.readAsDataURL(audioBlob);

        // Stop media tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsTranscribing(true);
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Microphone permission needed to transcribe your voice.');
      setIsTranscribing(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  // 3. Quick prompt chips
  const quickPrompts = [
    { label: '📍 Find Nearby Lead Banks (Maps)', query: `Find nearest SBI, Gramin Bank, and Lead Bank branches near ${location.district}` },
    { label: '🌾 APMC Mandi Rates & Buyers', query: `What are current Mandi rates and wholesale buyer linkages for ${selectedCategory.name} in ${location.district}?` },
    { label: '📜 MoSJE 10% Margin vs 90% Loan Rule', query: `Explain the 10% self margin and 90% concessional loan rules for ${selectedCategory.name}` },
    { label: '⚙️ Machinery & Equipment Checklist', query: `What machinery and equipment do I need for ${selectedCategory.name} within ₹${(marginCapital * 10).toLocaleString('en-IN')} project cost?` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-xl h-full flex flex-col shadow-2xl border-l border-[#c3c6d5] relative">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-[#c3c6d5] bg-[#003c90] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl text-[#fe9832]">
                smart_toy
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base md:text-lg">सहयोगी AI (Gemini Chatbot)</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#fe9832] text-[#683700] text-[10px] font-bold">
                  Live MoSJE Advisor
                </span>
              </div>
              <p className="text-[11px] text-[#d9e2ff]">
                Powered by Gemini 3.5 Flash & 3.1 Pro with Google Maps Grounding
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Model Selector & Capabilities Toolbar */}
        <div className="p-3 bg-[#f7f9fc] border-b border-[#c3c6d5] flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#434653]">AI Model:</span>
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value as any)}
              className="bg-white border border-[#c3c6d5] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#003c90] outline-none"
            >
              <option value="general">Gemini 3.5 Flash (General Advisory)</option>
              <option value="complex_feasibility">Gemini 3.1 Pro (Deep Financial Audit)</option>
              <option value="fast_query">Gemini 3.1 Flash Lite (Fast Response)</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#003c90] bg-[#d9e2ff] px-2.5 py-1 rounded-lg">
            <input
              type="checkbox"
              checked={useMaps}
              onChange={(e) => setUseMaps(e.target.checked)}
              className="rounded text-[#003c90]"
            />
            <span className="material-symbols-outlined text-xs text-[#003c90]">pin_drop</span>
            <span>Maps Grounding</span>
          </label>
        </div>

        {/* Scrollable Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fbfcfe]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[88%] p-3.5 md:p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#003c90] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-[#191c1e] border border-[#c3c6d5] rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Grounding Sources (Google Maps / Mandis / Lead Banks) */}
                  {msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#eceef1] space-y-1.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#003c90]">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        <span>Google Maps Grounded Locations:</span>
                      </div>
                      <div className="space-y-1">
                        {msg.groundingSources.map((src, i) => (
                          <div key={i} className="text-[11px] bg-[#f2f4f7] p-2 rounded-lg text-[#191c1e]">
                            <strong>{src.title}</strong>
                            {src.address && <span className="block text-[#737784] text-[10px]">{src.address}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 px-1 text-[10px] text-[#737784]">
                  <span>{msg.timestamp}</span>
                  {msg.modelUsed && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#e0e7ff] text-[#3730a3] font-semibold">
                      <span className="material-symbols-outlined text-[10px]">bolt</span>
                      {msg.modelUsed}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white border border-[#c3c6d5] rounded-2xl max-w-[70%] text-xs text-[#003c90]">
              <div className="w-4 h-4 border-2 border-[#003c90] border-t-transparent rounded-full animate-spin"></div>
              <span>MoSJE सहयोगी AI उत्तर तैयार कर रहा है...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-[#c3c6d5] flex items-center gap-1.5 overflow-x-auto">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.query)}
              className="px-2.5 py-1 bg-[#f2f4f7] hover:bg-[#d9e2ff] text-[#003c90] border border-[#c3c6d5] rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar with Voice Transcription & Live API trigger */}
        <div className="p-3.5 bg-[#f7f9fc] border-t border-[#c3c6d5] space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button (Speech to Text with gemini-3.5-flash transcription) */}
            <button
              type="button"
              onClick={isTranscribing ? handleStopRecording : handleStartRecording}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isTranscribing
                  ? 'bg-[#ba1a1a] text-white animate-pulse'
                  : 'bg-[#fe9832] text-[#683700] hover:bg-[#e08420]'
              }`}
              title="बोलकर प्रश्न पूछें (Transcribe audio using Gemini 3.5 Flash)"
            >
              <span className="material-symbols-outlined text-xl">
                {isTranscribing ? 'stop' : 'mic'}
              </span>
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                isTranscribing
                  ? 'सुन रहा है... बोलें (Recording audio...)'
                  : currentLanguage === 'hi'
                  ? 'पूछें: बैंक ऋण, मंडी भाव, या मशीनरी लागत...'
                  : 'Ask about bank loans, mandis, or equipment...'
              }
              className="flex-1 h-11 px-3.5 bg-white border border-[#c3c6d5] rounded-xl text-xs md:text-sm outline-none focus:border-[#003c90]"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="h-11 px-4 bg-[#003c90] hover:bg-[#002d6c] disabled:opacity-50 text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span className="hidden sm:inline">भेजें</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-[#737784] px-1">
            <span>🔴 Live API Model: gemini-3.1-flash-live-preview supported</span>
            <span>📍 Auto-grounded to {location.district}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
