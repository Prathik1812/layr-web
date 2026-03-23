import { useNavigate } from 'react-router-dom';
import { Layers, ChevronLeft, Lightbulb, Download, FileText, FileCode, Image, Files, LogOut } from 'lucide-react';
import { Tabs } from './Tabs';
import { useLayrStore } from '../store/useLayrStore';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { SuggestionsPanel } from './SuggestionsPanel';
import { exportService } from '../services/exportService';
import { cn } from '../lib/utils'; // Keep this import!

export const Header = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { projectTitle, setProjectTitle, suggestions, userPlan, structuredStory } = useLayrStore();
    const [titleInput, setTitleInput] = useState(projectTitle);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showExport, setShowExport] = useState(false);

    // Sync input with external changes (e.g. loading)
    useEffect(() => {
        setTitleInput(projectTitle);
    }, [projectTitle]);

    const activeSuggestionsCount = suggestions.filter(s => !s.isDismissed).length;


    const handleBlur = () => {
        if (titleInput.trim() !== projectTitle) {
            setProjectTitle(titleInput);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    return (
        <>
            <header className="h-[60px] border-b border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all font-sans">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors group"
                    >
                        <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <div className="h-4 w-px bg-white/10" />

                    <div className="flex items-center gap-2">
                        <div className="bg-white/10 p-1 rounded-sm">
                            <Layers className="w-3 h-3" />
                        </div>
                        <input
                            type="text"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none font-bold text-xs uppercase tracking-wider text-white w-[200px] focus:bg-white/5 px-1 transition-colors"
                        />
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2">
                    <Tabs />
                </div>

                <div className="flex items-center gap-6">
                    {/* Export */}
                    <div className="relative">
                        <button
                            onClick={() => setShowExport(!showExport)}
                            className={cn(
                                "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                                showExport ? "text-white" : "text-gray-500 hover:text-white"
                            )}
                        >
                            Export
                            <Download className="w-3 h-3" />
                        </button>

                        {showExport && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowExport(false)} />
                                <div className="absolute right-0 top-8 w-48 bg-[#111] border border-white/20 p-1 flex flex-col shadow-2xl z-50">
                                    <div className="text-[9px] uppercase tracking-widest text-gray-600 px-3 py-1 mb-1 border-b border-white/10">Format</div>
                                    {[
                                        { icon: FileText, label: 'Story PDF', action: () => structuredStory && exportService.exportStoryAsPDF(structuredStory, projectTitle) },
                                        { icon: FileCode, label: 'Story MD', action: () => structuredStory && exportService.exportStoryAsMarkdown(structuredStory, projectTitle) },
                                        { icon: Image, label: 'Canvas PNG', action: () => exportService.exportElementAsImage('ia-canvas', `${projectTitle}_IA`) },
                                        { icon: Files, label: 'Full Report', action: () => structuredStory && exportService.exportFullReport(structuredStory, projectTitle, 'ia-canvas', 'userflow-canvas') }
                                    ].map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { if (item.action) item.action(); setShowExport(false); }}
                                            className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:bg-white hover:text-black transition-colors text-left"
                                        >
                                            <item.icon className="w-3 h-3" /> {item.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Suggestions */}
                    <button
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className={cn(
                            "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors relative",
                            showSuggestions ? "text-white" : "text-gray-500 hover:text-white"
                        )}
                    >
                        AI Analysis
                        <Lightbulb className="w-3 h-3" />
                        {activeSuggestionsCount > 0 && (
                            <div className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        )}
                    </button>

                    {/* Status */}
                    <div className="flex items-center gap-2 text-[9px] font-mono text-gray-600 uppercase tracking-widest border border-white/10 px-2 py-1">
                        <span className="text-white">SYS: ACTIVE</span>
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    {userPlan !== 'pro' && (
                        <button onClick={() => navigate('/pricing')} className="px-2 py-1 bg-amber-500/10 border border-amber-500/50 text-amber-500 text-[9px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-colors">
                            Upgrade
                        </button>
                    )}

                    <button onClick={async () => { await logout(); navigate('/'); }} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors">
                        Logout
                        <LogOut className="w-3 h-3" />
                    </button>
                </div>
            </header>

            <SuggestionsPanel isOpen={showSuggestions} onClose={() => setShowSuggestions(false)} />
        </>
    );
};
