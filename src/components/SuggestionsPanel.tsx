import { useState } from 'react';
import { X, Lightbulb, AlertTriangle, Info, Check, ArrowRight, Lock, Zap } from 'lucide-react';
import { useLayrStore, type Tab } from '../store/useLayrStore';
import { cn } from '../lib/utils';

interface SuggestionsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SuggestionsPanel = ({ isOpen, onClose }: SuggestionsPanelProps) => {
    const { suggestions, currentTab, setCurrentTab, userPlan } = useLayrStore();
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    const activeSuggestions = suggestions.filter(s => !dismissed.has(s.id));

    // Sort: Warning first
    const relevantSuggestions = activeSuggestions.sort((a, b) => {
        if (a.severity === 'warning' && b.severity !== 'warning') return -1;
        if (a.severity !== 'warning' && b.severity === 'warning') return 1;
        return 0;
    });

    const handleNavigate = (targetTab: Tab) => {
        setCurrentTab(targetTab);
        // Note: relatedId could be used here to highlight the node in the future
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                onClick={onClose}
                className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
            />

            <div
                className={cn(
                    "fixed right-0 top-16 bottom-0 w-80 lg:w-96 bg-background/80 backdrop-blur-xl border-l border-white/10 z-50 shadow-2xl flex flex-col",
                    "animate-in slide-in-from-right duration-300 ease-out"
                )}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary">
                        <Lightbulb className="w-5 h-5" />
                        <h2 className="font-bold">AI Suggestions</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5 opacity-70" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {relevantSuggestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 opacity-60">
                            <Check className="w-12 h-12 mb-4 text-green-500" />
                            <p className="font-medium">All clear!</p>
                            <p className="text-sm mt-2">No issues found. Great job!</p>
                        </div>
                    ) : (
                        relevantSuggestions.map((suggestion) => {
                            const isLocked = suggestion.tier === 'pro' && userPlan !== 'pro';

                            return (
                                <div
                                    key={suggestion.id}
                                    className={cn(
                                        "relative p-4 rounded-xl border backdrop-blur-md transition-all group animate-in slide-in-from-right-2 duration-500",
                                        isLocked
                                            ? "bg-black/20 border-white/5 opacity-80"
                                            : suggestion.severity === 'warning'
                                                ? "bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40"
                                                : "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "mt-0.5 p-1.5 rounded-full flex-shrink-0",
                                            isLocked
                                                ? "bg-white/10 text-muted-foreground"
                                                : suggestion.severity === 'warning' ? "bg-yellow-500/20 text-yellow-500" : "bg-blue-500/20 text-blue-500"
                                        )}>
                                            {isLocked ? <Lock className="w-4 h-4" /> : suggestion.severity === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                                                        {suggestion.source.toUpperCase()}
                                                    </span>
                                                    {isLocked && <span className="text-[10px] font-bold text-amber-500 border border-amber-500/30 px-1.5 rounded bg-amber-500/10">PRO</span>}
                                                </div>

                                                {!isLocked && (
                                                    <button
                                                        onClick={() => setDismissed(prev => new Set([...prev, suggestion.id]))}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:underline text-muted-foreground"
                                                    >
                                                        Dismiss
                                                    </button>
                                                )}
                                            </div>

                                            <div className={cn("text-sm leading-relaxed text-foreground/90 mb-3", isLocked && "blur-[3px] select-none")}>
                                                {isLocked ? "Hidden Pro Insight:Upgrade to view" : suggestion.message}
                                            </div>

                                            {isLocked ? (
                                                <button
                                                    onClick={() => window.open('/pricing', '_self')} // Simple nav
                                                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    <Zap className="w-3 h-3" />
                                                    Unlock with Pro
                                                </button>
                                            ) : (
                                                suggestion.tab !== currentTab && (
                                                    <button
                                                        onClick={() => handleNavigate(suggestion.tab)}
                                                        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                                    >
                                                        View in {suggestion.tab.charAt(0).toUpperCase() + suggestion.tab.slice(1)}
                                                        <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
};
