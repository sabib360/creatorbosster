import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Download, Trash2, Sparkles, Lightbulb } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message { role: 'user' | 'assistant'; content: string; timestamp: string; }

const suggestions = [
  { icon: '💡', title: 'Brainstorm ideas', prompt: 'Help me brainstorm 10 content ideas for my tech YouTube channel' },
  { icon: '📝', title: 'Write a script', prompt: 'Write a YouTube video script about the future of AI in 5 minutes' },
  { icon: '🎯', title: 'SEO advice', prompt: 'Give me 5 SEO tips to rank my blog posts higher on Google' },
  { icon: '📊', title: 'Marketing strategy', prompt: 'Create a 30-day social media marketing plan for a fitness brand' },
];

export default function AIChatbotAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = { role: 'user', content: msg, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput(''); setIsProcessing(true); setError(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a helpful AI assistant for content creators, bloggers, and digital marketers. 
        Answer questions concisely and provide actionable advice. 
        User message: ${msg}`,
      });
      const assistantMsg: Message = { role: 'assistant', content: response.text || 'I could not generate a response.', timestamp: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch { setError('Failed to get response. Please check your API key.'); } finally { setIsProcessing(false); }
  };

  const exportChat = () => {
    const text = messages.map(m => `[${m.timestamp}] ${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'chat_export.txt'; a.click(); URL.revokeObjectURL(url);
  };

  const clearChat = () => { setMessages([]); setError(null); };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto"><Bot className="w-8 h-8 text-tertiary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">AI Chatbot Assistant</h1>
        <p className="text-ink/60">Conversational AI for content creators and marketers</p>
      </div>

      {/* Chat Area */}
      <div className="bg-slate-800/30 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-4 py-8">
              <p className="text-center text-ink/40 text-sm">Ask me anything about content creation, marketing, or productivity</p>
              <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s.prompt)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left transition-colors group">
                    <span className="text-lg">{s.icon}</span>
                    <p className="text-xs text-ink/60 mt-1 group-hover:text-ink transition-colors">{s.title}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && <div className="w-8 h-8 bg-tertiary/20 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-tertiary" /></div>}
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-black' : 'bg-slate-800 text-ink'}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className="text-[10px] mt-1 opacity-50">{msg.timestamp}</p>
              </div>
              {msg.role === 'user' && <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0"><User className="w-4 h-4 text-primary" /></div>}
            </div>
          ))}

          {isProcessing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-tertiary/20 rounded-full flex items-center justify-center"><Bot className="w-4 h-4 text-tertiary" /></div>
              <div className="bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1"><span className="w-2 h-2 bg-tertiary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} /><span className="w-2 h-2 bg-tertiary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-2 h-2 bg-tertiary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {error && <div className="px-4 py-2 bg-red-500/10 text-red-400 text-xs">{error}</div>}

        <div className="p-4 border-t border-slate-700 flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !isProcessing && sendMessage()} placeholder="Type your message..." className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm focus:outline-none focus:border-tertiary" disabled={isProcessing} />
          <button onClick={() => sendMessage()} disabled={isProcessing || !input.trim()} className="px-4 py-3 bg-tertiary text-black rounded-xl hover:bg-tertiary/90 transition-colors disabled:opacity-50"><Send className="w-5 h-5" /></button>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="flex gap-2">
          <button onClick={exportChat} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-ink transition-colors flex items-center gap-1"><Download className="w-3 h-3" /> Export Chat</button>
          <button onClick={clearChat} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-ink transition-colors flex items-center gap-1"><Trash2 className="w-3 h-3" /> Clear</button>
        </div>
      )}
    </div>
  );
}
