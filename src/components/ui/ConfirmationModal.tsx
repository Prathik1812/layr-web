import { AlertCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
}

export const ConfirmationModal = ({
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary'
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <button 
                    onClick={onCancel}
                    className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center mt-4">
                    <div className={cn(
                        "w-16 h-16 rounded-3xl flex items-center justify-center mb-6",
                        variant === 'danger' ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                    )}>
                        <AlertCircle className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        {description}
                    </p>

                    <div className="flex items-center gap-3 w-full">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onCancel();
                            }}
                            className={cn(
                                "flex-1 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-lg",
                                variant === 'danger' 
                                    ? "bg-red-500 hover:bg-red-600 text-white" 
                                    : "bg-white hover:bg-gray-200 text-black"
                            )}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
