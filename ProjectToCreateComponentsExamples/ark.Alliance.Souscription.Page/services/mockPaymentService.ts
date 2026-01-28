// A service that mocks external API calls

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockPaymentService = {
  // Simulate PayPal SDK initialization and approval
  processPayPalOrder: async (amount: number, currency: string): Promise<{ success: boolean; transactionId?: string }> => {
    await sleep(2000); // Simulate network latency
    
    // Random failure simulation (5% chance)
    if (Math.random() < 0.05) {
      return { success: false };
    }

    return { 
      success: true, 
      transactionId: `PAYPAL_${Math.random().toString(36).substr(2, 9).toUpperCase()}` 
    };
  },

  // Simulate checking a blockchain for a transaction
  verifyCryptoPayment: async (address: string, network: string): Promise<{ confirmed: boolean; txHash?: string }> => {
    await sleep(3000); // Blockchain takes longer
    
    // In prototype, we just approve it for UX demonstration
    return { 
      confirmed: true, 
      txHash: `0x${Math.random().toString(16).substr(2, 40)}` 
    };
  }
};
