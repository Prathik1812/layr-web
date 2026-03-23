
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/Sidebar';

const GeneralSettings = () => {
    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-sans selection:bg-white/20 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header />
                <main className="flex-1 p-8 max-w-4xl">
                    <h1 className="text-3xl font-bold uppercase tracking-tighter mb-8">General Settings</h1>

                    <div className="space-y-6">
                        <section className="bg-[#111] border border-white/10 p-6 rounded-xl">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">Appearance</h3>
                            <div className="flex items-center justify-between py-4 border-b border-white/5">
                                <div>
                                    <div className="text-sm font-medium">Theme</div>
                                    <div className="text-xs text-gray-500">Customize your interface theme</div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-white text-black text-xs font-bold rounded uppercase">Dark</button>
                                    <button className="px-3 py-1 bg-white/5 text-gray-400 text-xs font-bold rounded uppercase hover:bg-white/10">Light</button>
                                </div>
                            </div>
                        </section>

                        <section className="bg-[#111] border border-white/10 p-6 rounded-xl">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">Language & Region</h3>
                            <div className="flex items-center justify-between py-4">
                                <div>
                                    <div className="text-sm font-medium">Language</div>
                                    <div className="text-xs text-gray-500">Select your preferred language</div>
                                </div>
                                <select className="bg-black border border-white/20 text-xs text-white p-2 rounded uppercase font-mono">
                                    <option>English (US)</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                </select>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default GeneralSettings;
