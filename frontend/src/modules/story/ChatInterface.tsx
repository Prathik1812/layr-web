import { useRef, useEffect, useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useLayrStore } from '../../store/useLayrStore';
import { aiService } from '../../services/aiService';
import { cn } from '../../lib/utils';

export const ChatInterface = () => {
    const { chatHistory, addMessage, setStoryPhase, setStructuredStory } = useLayrStore();
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = { role: 'user' as const, content: input };
        addMessage(userMsg);
        setInput('');
        setIsTyping(true);

        const userMessageCount = chatHistory.filter(m => m.role === 'user').length + 1;

        if (userMessageCount >= 4) {
            setTimeout(async () => {
                setStoryPhase('generation');
                try {
                    const story = await aiService.generateStory([...chatHistory, userMsg as any]);
                    setStructuredStory(story);
                    setStoryPhase('review');
                } catch (error) {
                    console.error("Generation failed", error);
                }
            }, 1000);
        } else {
            const prompts = [
                "What specific functionalities are a priority for the MVP?",
                "Who is your target audience for this?",
                "Are there any specific constraints (budget, tech stack)?"
            ];
            const question = prompts[userMessageCount - 1] || "Tell me more.";
            setTimeout(() => {
                addMessage({ role: 'system', content: question });
                setIsTyping(false);
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-14rem)] w-full max-w-3xl mx-auto bg-[#0d0d0d] border border-white/5 rounded-3xl overflow-hidden relative shadow-2xl">
            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {/* Assistant Welcome Card */}
                {chatHistory.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center p-12 bg-white/[0.02] border border-white/5 rounded-3xl animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-white/10 mb-6 group hover:scale-110 transition-transform">
                            <Bot className="w-8 h-8 text-blue-400 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Welcome to Layr AI</h3>
                        <p className="text-gray-400 max-w-sm leading-relaxed">
                            I'll help you architect your product. Start by describing your vision, and we'll build the blueprint together.
                        </p>
                    </div>
                )}

                {chatHistory.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500",
                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-inner",
                            msg.role === 'user' ? "bg-white/5 border-white/10" : "bg-blue-500/10 border-blue-500/20"
                        )}>
                            {msg.role === 'user' ? <User className="w-5 h-5 text-gray-400" /> : <Bot className="w-5 h-5 text-blue-400" />}
                        </div>
                        <div className={cn(
                            "flex flex-col gap-2 max-w-[80%]",
                            msg.role === 'user' ? "items-end" : "items-start"
                        )}>
                            <div className={cn(
                                "p-5 rounded-2xl text-base leading-relaxed break-words shadow-lg",
                                msg.role === 'user'
                                    ? "bg-blue-600 text-white rounded-tr-none"
                                    : "bg-white/5 text-gray-100 border border-white/10 rounded-tl-none"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-6 animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                            <Bot className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Floating Style */}
            <div className="p-8 bg-[#0d0d0d]/80 backdrop-blur-md border-t border-white/5">
                <form onSubmit={handleSend} className="relative group max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your vision..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-8 pr-20 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner text-lg"
                        disabled={isTyping}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white hover:bg-blue-400 disabled:opacity-20 disabled:grayscale transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                        AI architecting platform for rapid product generation
                    </p>
                </div>
            </div>
        </div>
    );
};
