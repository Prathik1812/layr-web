import { Check } from 'lucide-react';
import { useLayrStore, type StoryPhase } from '../../store/useLayrStore';
import { cn } from '../../lib/utils';

const PHASES: { id: StoryPhase; label: string; step: number }[] = [
    { id: 'idealization', label: 'Idea', step: 1 },
    { id: 'interrogation', label: 'Refine', step: 2 },
    { id: 'generation', label: 'Generate', step: 3 },
    { id: 'review', label: 'Blueprint', step: 4 },
];

export const PhaseIndicator = () => {
    const { storyPhase } = useLayrStore();

    // Helper to determine status: 'complete' | 'current' | 'upcoming'
    const getStatus = (phaseStep: number) => {
        const currentStep = PHASES.find(p => p.id === storyPhase)?.step || 1;
        if (phaseStep < currentStep) return 'complete';
        if (phaseStep === currentStep) return 'current';
        return 'upcoming';
    };

    return (
        <div className="w-full max-w-3xl mx-auto mb-8 px-4">
            <div className="relative flex items-center justify-between">
                {/* Connecting Line background */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/5 -z-10 rounded-full" />

                {/* Active Line Progress */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary -z-10 transition-all duration-500 rounded-full"
                    style={{
                        width: `${((PHASES.find(p => p.id === storyPhase)?.step || 1) - 1) / (PHASES.length - 1) * 100}%`
                    }}
                />

                {PHASES.map((phase) => {
                    const status = getStatus(phase.step);
                    return (
                        <div key={phase.id} className="flex flex-col items-center gap-2 bg-background px-2">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                    status === 'complete'
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : status === 'current'
                                            ? "bg-background border-primary text-primary shadow-lg shadow-primary/20 scale-110"
                                            : "bg-card border-white/10 text-muted-foreground"
                                )}
                            >
                                {status === 'complete' ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <span className="text-xs font-bold">{phase.step}</span>
                                )}
                            </div>
                            <span className={cn(
                                "text-[10px] uppercase tracking-wider font-bold transition-colors duration-300 mt-2",
                                status === 'current' ? "text-primary" : "text-muted-foreground"
                            )}>
                                {phase.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
