import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard } from 'lucide-react';

// Initialize Stripe with your Publishable Key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentButton = () => {
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;

      // Call your backend to create a checkout session
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include auth token here if using Clerk/JWT
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
    >
      <CreditCard size={20} />
      Upgrade to Pro
    </button>
  );
};

export default PaymentButton;