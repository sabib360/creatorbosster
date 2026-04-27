import { useState } from 'react';
import { Send, Sparkles, AlertCircle, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    setError(null);

    try {
      // Placeholder implementation - in a real app, this would call a backend API
      setTimeout(() => {
        const assistantMessage: Message = { 
          role: 'assistant', 
          content: "This AI assistant feature requires server-side processing. In a production environment, this would use Google's Gemini API to provide intelligent responses to your questions and tasks."
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);
      }, 1500);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4"><div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto"><Bot className="w-8 h-8 text-tertiary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">AI Assistant</h1><p className="text-ink/60">Chat with AI for any questions or tasks</p></div>
      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}
      <div className="bg-slate-800/50 rounded-2xl p-6 space-y-4 max-h-96 overflow-y-auto">
        {messages.length === 0 && <div className="text-center text-ink/40 py-8"><Bot className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>Start a conversation with the AI assistant</p></div>}
        {messages.map((msg, i) => (<div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary/20' : 'bg-tertiary/20'}`}>
            {msg.role === 'user' ? <User className="w-4 h-4 text-primary" /> : <Bot className="w-4 h-4 text-tertiary" />}
          </div>
          <div className={`max-w-[80%] p-4 rounded-xl ${msg.role === 'user' ? 'bg-primary/20 text-ink' : 'bg-slate-700 text-ink/80'}`}>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        </div>))}
        {isProcessing && <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center"><Bot className="w-4 h-4 text-tertiary" /></div>
          <div className="bg-slate-700 p-4 rounded-xl"><div className="flex gap-2"><div className="w-2 h-2 bg-tertiary rounded-full animate-bounce"></div><div className="w-2 h-2 bg-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div><div className="w-2 h-2 bg-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div></div></div></div>}
      </div>
      <div className="flex gap-4"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." className="flex-1 px-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:border-tertiary" />
        <button onClick={sendMessage} disabled={isProcessing || !input.trim()} className="px-6 py-4 bg-tertiary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-tertiary/90 transition-colors disabled:opacity-50 flex items-center gap-2">{isProcessing ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}</button></div>
    </div>
  );
}