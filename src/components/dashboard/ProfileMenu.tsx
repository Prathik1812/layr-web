
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Settings, CreditCard, LogOut } from 'lucide-react';

interface ProfileMenuProps {
    onClose: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onClose }) => {
    const navigate = useNavigate(); // Hook for navigation
    const { logout } = useAuth(); // Auth context for logout

    const menuItems = [
        {
            label: 'My Account',
            icon: User,
            action: () => navigate('/settings/account')
        },
        {
            label: 'General Settings',
            icon: Settings,
            action: () => navigate('/settings/general')
        },
        {
            label: 'Billing',
            icon: CreditCard,
            action: () => navigate('/pricing')
        },
        {
            label: 'Logout',
            icon: LogOut,
            action: async () => {
                await logout();
                navigate('/');
            },
            danger: true
        }
    ];

    return (
        <>
            {/* Backdrop to close menu when clicking outside */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* Menu Dropdown */}
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute bottom-full left-0 w-64 mb-4 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
                <div className="p-1">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                item.action();
                                onClose();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors rounded-lg group
                                ${item.danger
                                    ? 'text-red-500 hover:bg-red-500/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>
            </motion.div>
        </>
    );
};

export default ProfileMenu;
