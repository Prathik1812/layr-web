
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/Sidebar';
import { useAuth } from '../../context/AuthContext';

const AccountSettings = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-sans selection:bg-white/20 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header />
                <main className="flex-1 p-8 max-w-4xl">
                    <h1 className="text-3xl font-bold uppercase tracking-tighter mb-8">My Account</h1>

                    <div className="space-y-6">
                        <section className="bg-[#111] border border-white/10 p-6 rounded-xl flex items-start gap-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shrink-0">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold text-white">{user?.email?.[0].toUpperCase()}</span>
                                )}
                            </div>

                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-white mb-1">{user?.displayName || 'Layr User'}</h2>
                                <p className="text-gray-500 font-mono text-xs mb-4">{user?.email}</p>
                                <button className="px-4 py-2 border border-white/20 hover:bg-white hover:text-black transition-colors rounded text-xs font-bold uppercase tracking-wider">
                                    Edit Profile
                                </button>
                            </div>
                        </section>

                        <section className="bg-[#111] border border-white/10 p-6 rounded-xl">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">Subscription Plan</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-white uppercase mb-1">{user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}</div>
                                    <div className="text-xs text-gray-500">
                                        {user?.plan === 'pro'
                                            ? 'You have unlimited access to all features.'
                                            : 'You are on the free tier. Upgrade for more projects.'}
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-white text-black rounded text-xs font-bold uppercase tracking-wider hover:scale-105 transition-transform">
                                    {user?.plan === 'pro' ? 'Manage Billing' : 'Upgrade to Pro'}
                                </button>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountSettings;
