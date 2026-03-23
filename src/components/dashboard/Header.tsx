
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isPro = user?.plan === 'pro';

    return (
        <header className="h-20 border-b border-white/5 bg-[#0d0d0d]/50 backdrop-blur-sm px-8 flex items-center justify-between sticky top-0 z-30">
            {/* Left: Breadcrumbs / Title */}
            <div className="flex flex-col justify-center">
                <span className="text-[10px] font-mono uppercase text-gray-500 tracking-widest leading-none mb-1">Workspace</span>
                <span className="text-sm font-bold uppercase tracking-widest text-white leading-none">Dashboard</span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 focus-within:border-white/20 transition-colors w-64">
                    <Search className="w-3 h-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-xs text-white placeholder:text-gray-600 w-full uppercase tracking-wider"
                    />
                </div>

                {/* Notifications */}
                <button className="relative w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                    <Bell className="w-4 h-4" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </button>

                {/* Upgrade Button (if Free) */}
                {!isPro && (
                    <button
                        onClick={() => navigate('/pricing')}
                        className="px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
                    >
                        Upgrade Plan
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
