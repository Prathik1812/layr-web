import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLayrStore } from '../../store/useLayrStore';
import { aiService } from '../../services/aiService';

export const IdeaInput = () => {
    const { setStoryPhase, addMessage, setStructuredStory } = useLayrStore();

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        setIsLoading(true);

        try {
            // Save user message
            addMessage({ role: 'user', content: input });

            // 🔥 SINGLE AI CALL
            const story = await aiService.generateStory([
                { role: 'user', content: input } as any
            ]);

            // Store structured result
            setStructuredStory(story);

            // Move to review phase directly
            setStoryPhase('review');
        } catch (error) {
            console.error('Story generation failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center border border-white/10 mx-auto shadow-2xl shadow-primary/10">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>

                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    What are you building?
                </h2>

                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Describe your idea and we’ll instantly generate the full product structure.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full relative group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. A marketplace for vintage watches..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-8 pr-20 text-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-300 shadow-xl"
                    autoFocus
                />

                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-3 top-3 bottom-3 aspect-square bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <ArrowRight className="w-6 h-6" />
                    )}
                </button>
            </form>
        </div>
    );
};