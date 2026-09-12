import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, NavigationTab } from '../../types';
import { AI_KNOWLEDGE_RESPONSES } from '../../data/mockData';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface AiAssistantFloatingProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const AiAssistantFloating: React.FC<AiAssistantFloatingProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Hello! I am your **road_navi Travel & Intelligence Assistant**. Ask me anything about regional mountain road accessibility, live weather risks, vehicle tonnage feasibility, or optimal route recommendations across North East India.',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Why is Route B safer?',
    'Can I send a 10-ton truck from Guwahati to Kohima tomorrow?',
    'Find the safest route to Imphal',
    'Show current high-risk areas',
    'Optimize my delivery',
    'What roads are blocked?',
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI thinking and lookup
    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply = '';

      if (lower.includes('why is route b') || lower.includes('route b safer') || lower.includes('why route b')) {
        reply = AI_KNOWLEDGE_RESPONSES['why is route b safer'];
      } else if (lower.includes('10-ton') || lower.includes('10 ton') || lower.includes('heavy truck')) {
        reply = AI_KNOWLEDGE_RESPONSES['can a 10-ton truck use this route'];
      } else if (lower.includes('safest route to imphal') || (lower.includes('guwahati') && lower.includes('imphal'))) {
        reply = AI_KNOWLEDGE_RESPONSES['find the safest route to imphal'];
      } else if (lower.includes('high-risk') || lower.includes('high risk') || lower.includes('danger')) {
        reply = AI_KNOWLEDGE_RESPONSES['show current high-risk areas'];
      } else if (lower.includes('optimize') || lower.includes('multi-stop') || lower.includes('delivery sequence')) {
        reply = AI_KNOWLEDGE_RESPONSES['optimize my delivery'];
      } else if (lower.includes('blocked') || lower.includes('closure') || lower.includes('landslide')) {
        reply = AI_KNOWLEDGE_RESPONSES['what roads are blocked'];
      } else {
        reply = `**road_navi Intelligence Analysis for: "${query}"**

Based on real-time simulated telemetry across the 8 North Eastern states:
- **Corridor Accessibility:** Average regional corridor health is **82%**.
- **Active Weather Hazards:** Monsoon convergence zone over Kohima-Senapati (NH-2).
- **Recommendation:** Always prioritize low-risk engineered corridors (such as NH-37 Jiribam) for high-tonnage cargo rather than purely looking at shortest geographic mileage.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 650);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="btn-floating-ai-assistant"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-3.5 sm:px-5 sm:py-3 text-white shadow-2xl shadow-cyan-900/60 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 border border-cyan-400/40"
          aria-label="Open AI Assistant"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            <Sparkles className="h-4 w-4 text-cyan-200 animate-spin" />
          </div>
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            Ask road_navi AI
          </span>
        </button>
      )}

      {/* Expandable Chat Drawer */}
      {isOpen && (
        <div
          id="floating-ai-chat-window"
          className="flex h-[520px] w-[90vw] max-w-[390px] sm:w-[410px] flex-col overflow-hidden rounded-2xl border border-cyan-500/50 bg-slate-950/95 shadow-2xl shadow-cyan-950/90 backdrop-blur-2xl animate-in zoom-in-95 duration-200"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 flex items-center space-x-1.5 font-brand">
                  <span>road<span className="text-cyan-400 font-tech">_</span><span className="italic text-cyan-300">navi</span> AI</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                </h4>
                <p className="text-[10px] text-slate-400">Smart Logistics & Route Advisor</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('ai-assistant');
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                title="Open Fullscreen AI Console"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="border-b border-slate-800/80 bg-slate-900/40 p-2 overflow-x-auto whitespace-nowrap scrollbar-none flex space-x-1.5">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="rounded-full bg-slate-800/90 px-2.5 py-1 text-[11px] font-medium text-cyan-300 border border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-950/40 transition shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="mt-1 block text-[9px] opacity-60 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 rounded-xl bg-slate-900 border border-slate-800 p-2.5 max-w-[120px]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span className="text-[11px] text-slate-400">Analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-slate-800 bg-slate-900/90 p-2.5 flex items-center space-x-2"
          >
            <input
              id="input-floating-ai-query"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about routes, weather or tonnage..."
              className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            <button
              id="btn-floating-send-ai-query"
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40 transition"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
