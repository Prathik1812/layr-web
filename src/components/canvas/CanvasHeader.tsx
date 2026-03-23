import { ArrowLeft, Share2, User } from 'lucide-react';
import { useLayrStore, type Tab } from '../../store/useLayrStore';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface CanvasHeaderProps {
    onExport?: () => void;
}

export const CanvasHeader = ({ onExport }: CanvasHeaderProps) => {
    const { currentTab, setCurrentTab, projectTitle } = useLayrStore();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const tabs: { id: Tab; label: string }[] = [
        { id: 'story', label: 'Story' },
        { id: 'ia', label: 'IA' },
        { id: 'userflow', label: 'Userflow' },
    ];

    const handleTabChange = (tabId: Tab) => {
        setCurrentTab(tabId);
        if (id) {
            navigate(`/projects/${id}/${tabId}`);
        }
    };

    return (
        <div className="flex items-center justify-between px-6 h-full w-full bg-[#0d0d0d]">
            {/* Left: Project Branding */}
            <div className="flex items-center gap-6">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center font-black text-black text-sm">L</div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white tracking-tight">{projectTitle || 'Untitled Project'}</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-500 font-mono">DRAFT</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center: Segmented Navigation Toggle */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-md">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={cn(
                            "px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                            currentTab === tab.id
                                ? "bg-white/10 text-white shadow-xl ring-1 ring-white/20"
                                : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        {tab.id === 'ia' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        {tab.id === 'userflow' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Right: User & Credits Restored */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">120 Credits</span>
                </div>
                <button 
                    onClick={onExport}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                    <Share2 className="w-4 h-4" />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-400 flex items-center justify-center border-2 border-white/10 shadow-lg">
                    <User className="w-5 h-5 text-white/50" />
                </div>
            </div>
        </div>
    );
};
