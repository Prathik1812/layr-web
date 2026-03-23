
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const navigate = useNavigate();
    const { loginWithGoogle, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const from = '/dashboard';

    if (user) {
        navigate(from, { replace: true });
        return null;
    }

    const handleGoogleSignup = async () => {
        try {
            setLoading(true);
            setError('');
            await loginWithGoogle(); // Firebase handles signup/login seamlessly with Google
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error(err);
            setError('Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-sans flex items-center justify-center relative overflow-hidden">
            {/* Technical Grid Overlay */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/10" />
                <div className="absolute left-1/2 top-0 w-px h-full bg-white/10" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md p-1 border border-white/20 bg-black/40 backdrop-blur-md"
            >
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-white" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-white" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white" />

                <div className="p-8 md:p-12 relative overflow-hidden">
                    {/* "Scanner" line effect */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-px bg-white/5 blur-[1px]"
                    />

                    <div className="text-center mb-10">
                        <div className="text-[10px] items-center justify-center flex gap-2 font-mono text-gray-400 mb-4 tracking-widest uppercase">
                            <span>Sys.Reg.v1</span>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        </div>
                        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-2">Initialize</h1>
                        <p className="text-xs text-gray-500 font-mono tracking-wider">Create a new profile to access the network.</p>
                    </div>

                    {error && (
                        <div className="mb-6 py-2 px-3 border-l-2 border-red-500 bg-red-500/10 text-red-500 text-xs font-mono uppercase">
                            Warning: {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleSignup}
                            disabled={loading}
                            className="group relative w-full h-14 flex items-center justify-center gap-3 px-6 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-100 transition-all disabled:opacity-50 overflow-hidden shadow-xl shadow-white/5 active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                            )}
                            <span className="z-10 tracking-widest">Create Account with Google</span>
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        <button disabled className="w-full h-14 flex items-center justify-between px-6 border border-white/20 text-gray-500 font-bold uppercase tracking-wider hover:border-white hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <span>Email Registration</span>
                            <span className="text-[10px] bg-white/10 px-1 py-0.5 rounded">LOCKED</span>
                        </button>
                    </div>

                    <div className="mt-12 flex justify-between items-center text-[10px] text-gray-600 font-mono uppercase">
                        <span onClick={() => navigate('/')} className="hover:text-white cursor-pointer flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Abort
                        </span>
                        <span onClick={() => navigate('/login')} className="hover:text-white cursor-pointer">
                            Already Initialized? <span className="underline">Login</span>
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
