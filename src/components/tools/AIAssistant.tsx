import { useState } from 'react';
import { Send, Sparkles, AlertCircle, Bot, User, Lightbulb, Type, Hash, ImageIcon, BarChart3 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Suggestion {
  icon: any;
  title: string;
  prompt: string;
  color: string;
}

const suggestions: Suggestion[] = [
  {
    icon: Type,
    title: "Generate Titles",
    prompt: "Help me create 5 catchy YouTube titles for my video about [topic]",
    color: "text-primary"
  },
  {
    icon: ImageIcon,
    title: "Thumbnail Ideas",
    prompt: "What are the best practices for creating YouTube thumbnails with high CTR?",
    color: "text-tertiary"
  },
  {
    icon: Hash,
    title: "SEO Tags",
    prompt: "Suggest the best YouTube tags for a video about [topic]",
    color: "text-secondary"
  },
  {
    icon: BarChart3,
    title: "Content Strategy",
    prompt: "What content strategy would help grow a YouTube channel in [niche]?",
    color: "text-quaternary"
  },
];

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

  const handleSuggestion = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4"><div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto"><Bot className="w-8 h-8 text-tertiary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">AI Assistant</h1><p className="text-ink/60">Chat with AI for any questions or tasks</p></div>

      <p className="text-ink/70 leading-relaxed text-center max-w-2xl mx-auto">
        Ask anything about YouTube growth, content strategy, SEO, or thumbnail design. This chatbot is tuned for creator-specific topics and can suggest titles, hook lines, tag sets, and competitive positioning based on your channel niche.
      </p>

      <div className="space-y-4">
        <h2 className="text-xl font-display font-black uppercase tracking-wider text-ink">How to Use the AI Assistant</h2>
        <ol className="space-y-3 text-ink/70 list-decimal list-inside">
          <li>Click one of the suggestion buttons or type your own question in the input field.</li>
          <li>Press Enter or click the send button to submit your message.</li>
          <li>Read the AI's response in the chat window above.</li>
          <li>Follow up with additional questions to refine the suggestions.</li>
          <li>Copy any useful titles, tags, or ideas into your content planning document.</li>
        </ol>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-display font-black uppercase tracking-wider text-ink">Common Use Cases</h2>
        <ul className="space-y-2 text-ink/70">
          <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Brainstorming title variations when you have a video topic but cannot find the right hook.</span></li>
          <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Getting thumbnail composition advice for a specific video concept or niche.</span></li>
          <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Researching YouTube SEO tag combinations that competing channels in your space use.</span></li>
          <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Drafting a weekly content calendar when you are stuck on what to film next.</span></li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-display font-black uppercase tracking-wider text-ink">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-ink mb-2">What topics can I ask about?</h3>
            <p className="text-ink/60 text-sm leading-relaxed">The assistant is optimized for YouTube content creation — titles, thumbnails, SEO tags, channel growth, and competitor analysis. You can also ask general questions, but the strongest responses come from creator-focused prompts.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-ink mb-2">Does it cost credits to chat?</h3>
            <p className="text-ink/60 text-sm leading-relaxed">Each message exchange consumes one AI credit from your daily balance. Free users get 3 credits per day; premium users have higher limits depending on their plan.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-ink mb-2">Is my conversation stored?</h3>
            <p className="text-ink/60 text-sm leading-relaxed">Your chat history is kept in your browser session only. It is not saved to any server and is lost when you close or refresh the page.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-ink mb-2">Can it write full video scripts?</h3>
            <p className="text-ink/60 text-sm leading-relaxed">The assistant can generate outline structures, hook lines, and talking-point bullet lists. For full-length scripts with narration and timing, you would need to expand on its output manually or use a dedicated scriptwriting tool.</p>
          </div>
        </div>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}
      <div className="bg-slate-800/50 rounded-2xl p-6 space-y-4 max-h-96 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center text-ink/40 py-8 space-y-6">
            <div>
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">Start a conversation with the AI assistant</p>
              <p className="text-sm mt-2">Try one of the suggestions below or ask a custom question</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {suggestions.map((suggestion, i) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(suggestion.prompt)}
                    className="p-4 text-left bg-slate-700/50 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all hover:border-primary/50 group"
                  >
                    <Icon className={`w-5 h-5 ${suggestion.color} mb-2 group-hover:scale-110 transition-transform`} />
                    <p className="text-xs font-display font-bold uppercase tracking-tight text-ink group-hover:text-primary transition-colors">{suggestion.title}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
