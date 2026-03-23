import { useState } from 'react';
import { useLayrStore } from '../../store/useLayrStore';
import { IdeaInput } from './IdeaInput';
import { ChatInterface } from './ChatInterface';
import { StoryReview } from './StoryReview';
import { PhaseIndicator } from './PhaseIndicator';
import { ChatSidebar } from './ChatSidebar';
import { cn } from '../../lib/utils';
import { PanelLeftClose, PanelLeft } from 'lucide-react';

export const StoryModule = () => {
    const { storyPhase } = useLayrStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const renderContent = () => {
        if (storyPhase === 'idealization') {
            return <IdeaInput />;
        }

        if (storyPhase === 'interrogation') {
            return (
                <div className="h-full w-full flex items-center justify-center p-6">
                    <ChatInterface />
                </div>
            );
        }

        if (storyPhase === 'generation') {
            return (
                <div className="h-full w-full flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-primary/20 animate-pulse flex items-center justify-center border border-primary/20">
                            <span className="text-4xl">✨</span>
                        </div>
                        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Generating Your Blueprint</h2>
                    <p className="text-muted-foreground animate-pulse text-center max-w-sm">
                        Analyzing requirements, defining personas, and structuring your product vision...
                    </p>
                </div>
            );
        }

        if (storyPhase === 'review') {
            return (
                <div className="h-full w-full p-6">
                    <StoryReview />
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full w-full flex overflow-hidden bg-[#0d0d0d]">
            {/* ChatGPT-style Sidebar */}
            <div className={cn(
                "h-full transition-all duration-300 ease-in-out border-r border-white/5 bg-[#050505] flex flex-col relative z-30",
                isSidebarOpen ? "w-72" : "w-0"
            )}>
                <div className={cn(
                    "h-full w-72 flex flex-col",
                    !isSidebarOpen && "invisible opacity-0"
                )}>
                    <ChatSidebar />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Sidebar Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={cn(
                        "absolute top-8 left-6 z-40 p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white",
                        isSidebarOpen && "left-[20px]" // Adjust if needed
                    )}
                >
                    {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
                </button>

                <div className={cn(
                    "flex-1 flex flex-col pt-8 transition-all duration-300 min-h-0",
                    isSidebarOpen ? "pl-4" : "pl-16"
                )}>
                    <PhaseIndicator />
                    <div className="flex-1 overflow-y-auto relative px-8 pb-32 min-h-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <div className="max-w-6xl mx-auto w-full">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
