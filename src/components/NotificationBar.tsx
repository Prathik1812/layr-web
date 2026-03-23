import React, { useEffect } from 'react';
import { useLayrStore } from '../store/useLayrStore';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export const NotificationBar: React.FC = () => {
    const { notifications } = useLayrStore();
    const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());

    const visibleNotifs = notifications.filter(n => !dismissed.has(n.id));

    useEffect(() => {
        if (visibleNotifs.length > 0) {
            const timer = setTimeout(() => {
                setDismissed(prev => new Set([...prev, ...visibleNotifs.map(n => n.id)]));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [visibleNotifs]);

    if (visibleNotifs.length === 0) return null;

    // We only show the latest notification for now, or stack them potentially.
    // Let's show the most recent one to keep it clean, or a stack of max 3.

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
        error: <AlertTriangle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-400" />
    };

    const bgColors = {
        success: 'bg-green-500/10 border-green-500/20',
        warning: 'bg-yellow-500/10 border-yellow-500/20',
        error: 'bg-red-500/10 border-red-500/20',
        info: 'bg-blue-500/10 border-blue-500/20'
    };

    return (
        <div className="fixed top-10 right-10 z-[100] flex flex-col gap-3">
            {visibleNotifs.slice(-3).map((notif) => (
                <div
                    key={notif.id}
                    className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300",
                        bgColors[notif.type] || bgColors.info,
                        "min-w-[300px] max-w-md"
                    )}
                >
                    {icons[notif.type]}
                    <p className="text-sm font-medium text-white/90 flex-1">
                        {notif.message}
                    </p>
                    <button
                        onClick={() => setDismissed(prev => new Set([...prev, notif.id]))}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-white/50" />
                    </button>
                </div>
            ))}
        </div>
    );
};
