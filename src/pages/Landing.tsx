import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Globe, Layers, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-white/20 selection:text-white overflow-x-hidden relative font-sans">

            {/* Grid Overlay - Matching reference image lines */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Horizontal Center Line */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/10" />
                {/* Vertical Lines - Thirds */}
                <div className="absolute top-0 left-[25%] w-px h-full bg-white/5" />
                <div className="absolute top-0 right-[25%] w-px h-full bg-white/5" />
            </div>

            {/* Top Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-8 bg-[#0d0d0d]/50 backdrop-blur-sm border-b border-white/5">
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    LAYR // PLATFORM
                </div>

                {/* Center Icon */}
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                    <div className="w-1 h-1 bg-white rounded-full mb-1" />
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">AI POWERED</div>
                    <div className="w-1 h-1 bg-white rounded-full mt-1" />
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
                        <span>Search</span>
                        <Search className="w-3 h-3" />
                    </div>
                </div>
            </nav>

            {/* Left Side Icons - Matching Image */}
            <div className="fixed left-12 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-6">
                {['Story', 'Flow', 'UI'].map((label, i) => (
                    <div key={i} className="group relative w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center grayscale opacity-80 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all cursor-pointer bg-black/20 backdrop-blur-sm">
                        <div className="w-1 h-1 bg-white rounded-full group-hover:bg-white" />
                        <span className="absolute left-full ml-4 text-[9px] uppercase tracking-widest text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{label}</span>
                    </div>
                ))}
                <div className="h-20 w-px bg-white/10 mx-auto my-2" />
            </div>


            {/* Main Content Area */}
            <section className="relative h-screen flex items-center relative overflow-hidden">

                {/* Big Typography Behind - Abstract Theme - Kept as Texture */}
                <div className="absolute inset-0 flex items-center justify-center z-0 select-none pointer-events-none">
                    <h1 className="text-[12vw] leading-none font-bold text-white/5 tracking-tighter uppercase opacity-30 mix-blend-overlay">
                        DESIGN SYSTEMS
                    </h1>
                </div>

                {/* Crosshair Grid Overlay - The "Pattern" */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none">
                    {/* Horizontal Line */}
                    <div className="absolute w-full h-px bg-white/10" />
                    {/* Vertical Line */}
                    <div className="absolute h-full w-px bg-white/10" />

                    {/* Center Reticle */}
                    <div className="absolute w-4 h-4 border border-white/30" />
                    <div className="absolute w-[200px] h-[200px] border border-white/5 rounded-full" />

                    {/* Quadrant Markers */}
                    <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col gap-1">
                        <div className="w-1 h-1 bg-white/20" />
                        <div className="w-1 h-1 bg-white/20" />
                        <div className="w-1 h-1 bg-white/20" />
                    </div>
                    <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-1">
                        <div className="w-1 h-1 bg-white/20" />
                        <div className="w-1 h-1 bg-white/20" />
                        <div className="w-1 h-1 bg-white/20" />
                    </div>
                </div>

                <div className="relative z-20 flex flex-col items-center justify-center h-screen overflow-hidden w-full max-w-7xl mx-auto px-6 py-20">

                    {/* Top: Title & Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center text-center relative z-20 mb-8"
                    >

                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-white tracking-tighter uppercase mb-6 leading-none">
                            Design Smarter <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">With Layr</span>
                        </h1>

                        <p className="text-sm md:text-base text-gray-400 uppercase tracking-widest max-w-[700px] mx-auto leading-relaxed font-mono">
                            Turn ideas into structured stories, information architecture, and user flows.
                        </p>
                    </motion.div>

                    {/* Middle: Character Area Placeholder (Visual Only) */}
                    <div className="relative z-10 h-16 w-full flex items-center justify-center pointer-events-none select-none">
                        {/* Abstract Center Glow - Purely Decorative */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[1px] h-[1px] bg-blue-500/20 blur-[120px] rounded-full scale-[150]" />
                        </div>
                    </div>

                    {/* Bottom: CTA Buttons - High Z-Index & Interactive */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="relative z-[100] mt-8 flex items-center gap-6 pointer-events-auto"
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate('/signup'); }}
                            className="group relative px-10 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider text-xs hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
                        >
                            Get Started
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); navigate('/login'); }}
                            className="px-10 py-4 border border-white/20 text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-white/10 transition-colors flex items-center gap-2 backdrop-blur-sm cursor-pointer"
                        >
                            <Play className="w-3 h-3 fill-current" />
                            Sign In
                        </button>
                    </motion.div>

                </div>


                {/* Floating Status Pill - Moved to bottom right */}
                <div className="absolute right-8 bottom-32 hidden md:block">
                    <div className="relative group text-right">
                        <div className="text-[10px] font-mono text-gray-500 mb-1">CURRENT VERSION</div>
                        <div className="px-4 py-2 border border-white/10 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-mono uppercase tracking-widest text-white inline-block">
                            v2.0 Stable
                        </div>
                    </div>
                </div>

            </section>

            {/* Bottom Footer - Minimalist */}
            <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-between items-end z-40 bg-gradient-to-t from-black to-transparent">
                <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-500" /> Story
                    </span>
                    <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-500" /> Architecture
                    </span>
                    <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-500" /> Flows
                    </span>
                </div>

                <div className="flex flex-col items-end gap-2 text-gray-500">
                    <Globe className="w-4 h-4 mb-2" />
                    <span className="text-[10px] font-bold">PROD. TEAM</span>
                </div>
            </div>

        </div>
    );
};

export default Landing;
