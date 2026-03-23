import { userService } from './userService';

// Mock configuration for Dodo Payments
// In a real app, these would be API calls to your backend or Dodo's checkout endpoints
const DODO_PAYMENT_LINK = "https://checkout.dodopayments.com/buy"; // Mock link example

export const paymentsService = {
    // Simulate creating a checkout session
    // In a real app with a backend, we'd call our API to get a session ID
    async startCheckout(uid: string, plan: 'pro'): Promise<string> {
        console.log(`Starting checkout for user ${uid} on plan ${plan}`);

        // Return a mock URL or a real link if we had one
        // For this demo, we can just return a success signal or similar.
        // But the UI expects a URL to redirect to usually.

        return `${DODO_PAYMENT_LINK}/${plan}_plan?client_reference_id=${uid}`;
    },

    // A development-only helper to "upgrade" a user immediately
    // effectively simulating a successful webhook callback
    async simulateSuccessfulPayment(uid: string): Promise<void> {
        console.log(`[DEV] Simulating successful payment for ${uid}`);
        await userService.subscribeUser(uid, 'pro', 'active');
    },

    // A development-only helper to "downgrade" a user
    async simulateSubscriptionCancel(uid: string): Promise<void> {
        console.log(`[DEV] Simulating cancel for ${uid}`);
        await userService.subscribeUser(uid, 'free', 'cancelled');
    }
};
