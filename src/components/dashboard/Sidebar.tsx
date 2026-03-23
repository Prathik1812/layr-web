
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Folder,
    CreditCard,
    Settings,
    Layers,
    ChevronUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import ProfileMenu from './ProfileMenu';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/projects', label: 'Projects', icon: Folder },
        { path: '/pricing', label: 'Billing', icon: CreditCard },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    const isLinkActive = (path: string) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        return location.pathname.startsWith(path) && path !== '/dashboard';
    };

    return (
        <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#0d0d0d]/50 backdrop-blur-md border-r border-white/5 z-40 flex flex-col">
            {/* Logo Area - Matches Landing Header */}
            <div className="h-20 flex items-center px-8 border-b border-white/5">
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-white flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    LAYR
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium uppercase tracking-wider transition-all
                            ${isActive || isLinkActive(item.path)
                                ? 'bg-white text-black font-bold'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }
                        `}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-white/5 relative">
                <AnimatePresence>
                    {showProfileMenu && (
                        <ProfileMenu onClose={() => setShowProfileMenu(false)} />
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group cursor-pointer text-left"
                >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shrink-0">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="text-xs font-bold text-white">{user?.email?.[0].toUpperCase()}</span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                            {user?.displayName || 'User'}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate font-mono">
                            {user?.email}
                        </div>
                    </div>

                    {/* Plan Badge */}
                    <div className="flex flex-col items-end gap-1">
                        <ChevronUp className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" />
                        <div className={`
                            text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
                            ${user?.plan === 'pro'
                                ? 'bg-white text-black'
                                : 'bg-gray-800 text-gray-400 border border-white/10'
                            }
                        `}>
                            {user?.plan === 'pro' ? 'PRO' : 'FREE'}
                        </div>
                    </div>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
