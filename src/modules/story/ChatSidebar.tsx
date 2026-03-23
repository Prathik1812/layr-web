import { MessageSquarePlus, History, LayoutDashboard } from 'lucide-react';
import { useLayrStore } from '../../store/useLayrStore';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

export const ChatSidebar = () => {
    const { chatHistory, resetStory, projectTitle } = useLayrStore();

    const [showNewChatConfirm, setShowNewChatConfirm] = useState(false);

    const handleNewChat = () => {
        resetStory();
    };

    return (
        <div className="h-full flex flex-col p-4 bg-[#050505]">
            {/* New Chat Button */}
            <button
                onClick={() => setShowNewChatConfirm(true)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-white/5 hover:bg-white/5 bg-white/[0.02] text-sm font-medium text-white transition-all duration-200 group mb-6"
            >
                <MessageSquarePlus className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                <span>New Chat</span>
            </button>

            {/* Dashboard / History List */}
            <div className="flex-1 overflow-y-auto space-y-1">
                <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <History className="w-3 h-3" />
                    History
                </div>

                {/* Current Chat Item (Active) */}
                <button className={cn(
                    "w-full flex flex-col gap-1 px-3 py-3 rounded-lg text-left transition-all duration-200 border",
                    "bg-white/5 border-white/10 shadow-lg"
                )}>
                    <div className="text-sm font-bold text-white truncate">{projectTitle || "Current Session"}</div>
                    <div className="text-[10px] text-gray-500 truncate">
                        {chatHistory.length > 0 
                            ? chatHistory[chatHistory.length - 1].content 
                            : "Start a new project concept..."
                        }
                    </div>
                </button>

                {/* Mock Past Chats for UI feel */}
                <div className="pt-4 space-y-1 opacity-40 pointer-events-none">
                    <button className="w-full px-3 py-3 rounded-lg text-left hover:bg-white/5 text-sm text-gray-400 truncate">
                        SaaS Inventory System
                    </button>
                    <button className="w-full px-3 py-3 rounded-lg text-left hover:bg-white/5 text-sm text-gray-400 truncate">
                        Web3 Portfolio Tracker
                    </button>
                </div>
            </div>

            {/* Bottom: Settings / Credits Sidebar Footer */}
            <div className="pt-4 border-t border-white/5 mt-auto">
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 text-sm text-gray-400 hover:text-white transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                </button>
                <div className="px-3 py-4 mt-2 rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/5">
                    <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">PRO PLAN</div>
                    <div className="text-xs text-gray-400">Unlimited generations and export modes.</div>
                </div>
            </div>
            <ConfirmationModal 
                isOpen={showNewChatConfirm}
                title="New Blueprint?"
                description="This will clear your current conversation and reset all progress. Are you sure?"
                confirmLabel="New Chat"
                variant="danger"
                onConfirm={handleNewChat}
                onCancel={() => setShowNewChatConfirm(false)}
            />
        </div>
    );
};
