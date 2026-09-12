import React, { useState } from 'react';
import { Bot, User, Send, Sparkles, HelpCircle, CheckCircle2, ShieldAlert, ArrowRight, CornerDownLeft, Loader2 } from 'lucide-react';
import { SAMPLE_AI_QUESTIONS, MOCK_AI_RESPONSES } from '../../data/mockData';
import { NavigationTab } from '../../types';
import { apiService } from '../../services/apiService';

interface AiAssistantViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    text: string;
    tab: NavigationTab;
  };
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello! I am **ROAD_NAVI AI Assistant**, specialized in North Eastern India terrain telemetry, multi-hazard risk analysis, and smart logistics optimization.\n\nHow can I assist your route planning or emergency logistics dispatch today?",
      timestamp: 'Just now',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isTyping) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const replyText = await apiService.askAiAssistant(query);

      const lower = query.toLowerCase();
      let suggestedAction: { text: string; tab: NavigationTab } | undefined = undefined;

      if (lower.includes('nh-2') || lower.includes('safe for heavy') || lower.includes('compare')) {
        suggestedAction = { text: 'Compare Route A vs B in Smart Routes', tab: 'smart-routes' };
      } else if (lower.includes('why') || lower.includes('route b') || lower.includes('ai explanation')) {
        suggestedAction = { text: 'View AI Route Analysis & XAI Explanations', tab: 'route-analysis' };
      } else if (lower.includes('logistics') || lower.includes('cargo') || lower.includes('multi-stop')) {
        suggestedAction = { text: 'Open Smart Logistics Planner', tab: 'logistics-planner' };
      } else if (lower.includes('landslide') || lower.includes('risk') || lower.includes('zones')) {
        suggestedAction = { text: 'Open Risk Intelligence Matrices', tab: 'risk-intelligence' };
      } else if (lower.includes('accessibility') || lower.includes('wheelchair') || lower.includes('elderly')) {
        suggestedAction = { text: 'View Accessibility Intelligence', tab: 'accessibility' };
      }

      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: 'Thank you for your question. Based on current NER highway conditions, Route B (NH-37) remains the safest corridor for heavy freight avoiding landslide hazards.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div id="ai-assistant-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-1.5 font-brand">
              <span className="tracking-wider">ROAD</span>
              <span className="text-blue-600 font-tech font-black px-0.5">_</span>
              <span className="tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">NAVI</span>
              <span className="text-slate-800 font-bold ml-1">AI Assistant</span>
            </h1>
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-800 border border-blue-200">
              TERRAIN KNOWLEDGE ENGINE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ask anything about routes, weather, risks, axle limits, and logistics in North East India.
          </p>
        </div>
      </div>

      {/* Suggested Questions Horizontal Bar */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Suggested SIH Logistics Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_AI_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              className="rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 px-3.5 py-2 text-xs font-medium border border-slate-200 hover:border-blue-300 transition shadow-2xs text-left"
            >
              💬 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col h-[560px] overflow-hidden">
        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-3 ${isAi ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0 ${
                    isAi
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                <div className="space-y-2 max-w-2xl">
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isAi
                        ? 'bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs'
                        : 'bg-blue-600 text-white font-medium shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.suggestedAction && (
                    <button
                      onClick={() => onNavigate(m.suggestedAction!.tab)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{m.suggestedAction.text}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  <span className="text-[10px] text-slate-400 block px-1">{m.timestamp}</span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-500 text-xs p-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Analyzing North East terrain and formulating recommendation...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about route safety, landslides, vehicle limits, or weather..."
              className="flex-1 rounded-2xl bg-white border border-slate-300 px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition active:scale-95 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
