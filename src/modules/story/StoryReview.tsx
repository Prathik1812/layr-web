import { RefreshCw, Check, Edit2, User, Target, Zap, AlertTriangle } from 'lucide-react';
import { useLayrStore } from '../../store/useLayrStore';
import { aiService } from '../../services/aiService';
import { useState } from 'react';

export const StoryReview = () => {
    const { structuredStory, chatHistory, setStructuredStory, resetStory } = useLayrStore();
    const [isRegenerating, setIsRegenerating] = useState(false);

    if (!structuredStory) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in">
                <AlertTriangle className="w-12 h-12 text-amber-500" />
                <h2 className="text-xl font-bold text-white">Blueprint Corrupted</h2>
                <p className="text-gray-400">Your generated story data could not be found or failed to load.</p>
                <button
                    onClick={() => resetStory()}
                    className="px-6 py-2 bg-primary text-black font-bold uppercase tracking-wider hover:bg-white transition-colors"
                >
                    Restart Process
                </button>
            </div>
        );
    }

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        try {
            const newStory = await aiService.generateStory(chatHistory);
            setStructuredStory(newStory);
        } catch (e) {
            console.error("Failed to regenerate story:", e);
        }
        setIsRegenerating(false);
    };

    return (
        <div className="h-full w-full max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-10">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        {structuredStory.productName || "Project Blueprint"}
                    </h2>
                    <p className="text-muted-foreground">Generated from your requirements</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRegenerate}
                        disabled={isRegenerating}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-2 transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                        Regenerate
                    </button>
                    <button
                        onClick={() => resetStory()}
                        className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-400/5 hover:bg-red-400/10 border border-red-400/10 rounded-lg flex items-center gap-2 transition-all"
                    >
                        Reset
                    </button>
                    <button className="px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20 transition-all transform hover:scale-105 active:scale-95">
                        <Check className="w-4 h-4" />
                        Approve Blueprint
                    </button>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-12 gap-6 flex-1 pr-2">

                {/* Overview Card */}
                <div className="col-span-12 lg:col-span-8 bg-card/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/10">
                            <Edit2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Product Description</h3>
                    </div>
                    <p className="text-lg leading-relaxed text-foreground/80 font-light">
                        {structuredStory.description}
                    </p>
                </div>

                {/* Target Users Card */}
                <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-card/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/10">
                            <User className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Target Users</h3>
                    </div>
                    <ul className="space-y-3">
                        {structuredStory.targetUsers?.map((user, i) => (
                            <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-purple-400" />
                                <span className="text-foreground/90">{user}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* User Roles Card */}
                <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-card/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/10">
                            <Target className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">User Roles</h3>
                    </div>
                    <ul className="space-y-3">
                        {structuredStory.userRoles?.map((role, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span className="text-foreground/80">{role}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Key Features Card */}
                <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-card/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/10">
                            <Zap className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Key Features</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {structuredStory.keyFeatures?.map((feature, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm font-medium">
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>

                 {/* System Modules Card */}
                <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-card/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/10">
                            <Target className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">System Modules</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {structuredStory.systemModules?.map((mod, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm font-medium">
                                {mod}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Primary Actions Card */}
                <div className="col-span-12 lg:col-span-12 bg-card/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/10">
                            <AlertTriangle className="w-5 h-5 text-rose-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Primary User Actions</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {structuredStory.primaryUserActions?.map((action, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                                <span className="text-sm text-foreground/80">{action}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
