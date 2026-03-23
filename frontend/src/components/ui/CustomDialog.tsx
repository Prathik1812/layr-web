import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CustomDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    onConfirm?: () => void;
    confirmText?: string;
    type?: 'info' | 'warning' | 'error' | 'success';
    variant?: 'alert' | 'confirm';
}

export const CustomDialog = ({
    isOpen,
    onClose,
    title,
    description,
    onConfirm,
    confirmText = 'Confirm',
    type = 'info',
    variant = 'alert'
}: CustomDialogProps) => {
    
    const iconMap = {
        info: <Info className="w-5 h-5 text-blue-400" />,
        warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        success: <CheckCircle2 className="w-5 h-5 text-green-500" />
    };

    const typeColors = {
        info: 'border-blue-400/20 bg-blue-400/5',
        warning: 'border-yellow-400/20 bg-yellow-400/5',
        error: 'border-red-500/20 bg-red-500/5',
        success: 'border-green-500/20 bg-green-500/5'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={cn(
                            "relative w-full max-w-sm border-2 backdrop-blur-xl shadow-2xl p-6 overflow-hidden",
                            typeColors[type]
                        )}
                    >
                        {/* Technical corner accents */}
                        <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none">
                            <div className="absolute top-0 left-0 w-2 h-0.5 bg-white/40" />
                            <div className="absolute top-0 left-0 w-0.5 h-2 bg-white/40" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
                            <div className="absolute bottom-0 right-0 w-2 h-0.5 bg-white/40" />
                            <div className="absolute bottom-0 right-0 w-0.5 h-2 bg-white/40" />
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="mt-1 p-2 rounded-lg bg-black/40 border border-white/5 shadow-inner">
                                {iconMap[type]}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2 flex items-center justify-between">
                                    {title}
                                    <button 
                                        onClick={onClose}
                                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            {variant === 'confirm' && (
                                <button
                                    onClick={() => {
                                        onConfirm?.();
                                        onClose();
                                    }}
                                    className={cn(
                                        "px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl",
                                        type === 'error' 
                                            ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600" 
                                            : "bg-white text-black shadow-white/20 hover:scale-105 active:scale-95"
                                    )}
                                >
                                    {confirmText}
                                </button>
                            )}
                            {variant === 'alert' && (
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-white text-black rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-white/20 hover:scale-105 transition-all"
                                >
                                    Acknowledge
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
