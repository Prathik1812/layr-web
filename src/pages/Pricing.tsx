import { useState } from 'react';
import { Check, X, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentsService } from '../services/paymentsService';
import { PLAN_LIMITS } from '../services/userService';

const Pricing = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!user) return; // Should likely prompt login
        setLoading(true);
        try {
            // In a real app, this redirects to Dodo Checkout
            // const url = await paymentsService.startCheckout(user.uid, 'pro');
            // window.location.href = url;

            // SIMULATION FLOW for demo:
            await paymentsService.simulateSuccessfulPayment(user.uid);
            await refreshUser();
            alert("Upgrade Successful! You are now a Pro member.");
            navigate('/');
        } catch (error) {
            console.error("Payment failed", error);
            alert("Upgrade failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDowngrade = async () => {
        if (!user) return;
        if (confirm("Are you sure you want to cancel your Pro plan? You will lose access to Pro features.")) {
            setLoading(true);
            try {
                await paymentsService.simulateSubscriptionCancel(user.uid);
                await refreshUser();
                alert("Plan cancelled. You are now on the Free plan.");
            } catch (error) {
                console.error("Cancel failed", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const isPro = user?.plan === 'pro';

    return (
        <div className="min-h-screen bg-background text-foreground py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Unlock the full power of Layr with unlimited projects and advanced AI.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* Free Plan */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col relative overflow-hidden">
                        <h3 className="text-2xl font-bold mb-2">Free</h3>
                        <div className="text-3xl font-bold mb-6">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-primary" />
                                <span>{PLAN_LIMITS.free.maxProjects} Projects</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-primary" />
                                <span>Basic AI Suggestions</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <X className="w-5 h-5" />
                                <span>No Data Export</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <X className="w-5 h-5" />
                                <span>Priority Support</span>
                            </li>
                        </ul>

                        {isPro ? (
                            <button
                                onClick={handleDowngrade}
                                disabled={loading}
                                className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors font-medium"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Downgrade to Free"}
                            </button>
                        ) : (
                            <div className="w-full py-3 rounded-xl border border-white/10 bg-white/5 text-center text-muted-foreground font-medium cursor-default">
                                Current Plan
                            </div>
                        )}
                    </div>

                    {/* Pro Plan */}
                    <div className={`rounded-2xl border p-8 flex flex-col relative overflow-hidden transition-all ${isPro ? 'border-primary/50 bg-primary/5' : 'border-primary/20 bg-black/40 hover:border-primary/50'}`}>
                        {isPro && (
                            <div className="absolute top-4 right-4 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Active
                            </div>
                        )}
                        <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
                        <div className="text-3xl font-bold mb-6 text-white">$19<span className="text-lg text-muted-foreground font-normal">/mo</span></div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-primary/20 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <span>Unlimited Projects</span>
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-primary/20 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <span>Advanced AI Suggestions</span>
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-primary/20 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <span>One-click Export</span>
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-primary/20 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <span>Priority Support</span>
                            </li>
                        </ul>

                        {!isPro ? (
                            <button
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Upgrade User"}
                            </button>
                        ) : (
                            <div className="w-full py-3 rounded-xl bg-primary/20 text-primary text-center font-bold cursor-default">
                                Plan Active
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
