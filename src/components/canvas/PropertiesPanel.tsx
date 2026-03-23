
import type { ReactNode } from 'react';

interface PropertiesPanelProps {
    title?: string;
    children?: ReactNode;
    isEmpty?: boolean;
}

export const PropertiesPanel = ({ title, children, isEmpty }: PropertiesPanelProps) => {
    return (
        <div className="flex flex-col h-full w-full">
            {/* Panel Header */}
            <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-4">
                <span className="text-xs font-bold uppercase tracking-widest text-white">
                    {isEmpty ? 'Properties' : title || 'Properties'}
                </span>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {isEmpty ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                            <span className="text-2xl">🖱️</span>
                        </div>
                        <p className="text-sm font-medium">No Selection</p>
                        <p className="text-xs max-w-[150px]">Select an element on the canvas to edit its properties.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

// Reusable Property Row
export const PropertyRow = ({ label, children }: { label: string, children: ReactNode }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</label>
        {children}
    </div>
);

// Reusable Input
export const PropertyInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-white/30 outline-none transition-colors"
    />
);

// Reusable Textarea
export const PropertyTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        {...props}
        className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-white/30 outline-none transition-colors min-h-[80px] resize-none"
    />
);
