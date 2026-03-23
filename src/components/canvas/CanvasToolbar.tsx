
import type { ReactNode } from 'react';

interface CanvasToolbarProps {
    children: ReactNode;
}

export const CanvasToolbar = ({ children }: CanvasToolbarProps) => {
    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl ring-1 ring-white/5">
            {children}
        </div>
    );
};

interface ToolbarButtonProps {
    icon: any;
    label: string;
    active?: boolean;
    onClick: () => void;
    disabled?: boolean; // Added disabled prop
}

export const ToolbarButton = ({ icon: Icon, label, active, onClick, disabled }: ToolbarButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group relative
                ${active
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'active:scale-90'}
            `}
            title={label}
        >
            <Icon className="w-5 h-5" />

            {/* Tooltip - Now Above */}
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 border border-white/10 pointer-events-none z-50 whitespace-nowrap shadow-2xl">
                {label}
            </div>
        </button>
    );
};

export const ToolbarSeparator = () => (
    <div className="w-px h-6 bg-white/10 mx-2" />
);
