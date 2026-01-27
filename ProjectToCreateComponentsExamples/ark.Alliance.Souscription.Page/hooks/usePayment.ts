import { useState } from 'react';
import { PaymentMethod, Tier, BillingCycle } from '../types';
import { mockPaymentService } from '../services/mockPaymentService';

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export const usePaymentVM = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('monthly');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const openPayment = (tier: Tier, cycle: BillingCycle) => {
    setSelectedTier(tier);
    setSelectedCycle(cycle);
    setIsOpen(true);
    setStatus('idle');
    setTransactionId(null);
    setSelectedMethod(null);
  };

  const closePayment = () => {
    if (status === 'processing') return; // Prevent closing while paying
    setIsOpen(false);
  };

  const selectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStatus('idle');
  };

  const processPayment = async () => {
    if (!selectedTier || !selectedMethod) return;

    setStatus('processing');
    const amount = selectedCycle === 'monthly' ? selectedTier.pricing.monthly : selectedTier.pricing.yearly;

    try {
      if (selectedMethod.type === 'paypal') {
        const result = await mockPaymentService.processPayPalOrder(amount, selectedTier.pricing.currency);
        if (result.success) {
          setTransactionId(result.transactionId || 'N/A');
          setStatus('success');
        } else {
          setStatus('error');
        }
      } else if (selectedMethod.type === 'crypto') {
        // For crypto, "process" usually means "Check Status" button pressed by user
        if (selectedMethod.cryptoConfig) {
            const result = await mockPaymentService.verifyCryptoPayment(selectedMethod.cryptoConfig.address, selectedMethod.cryptoConfig.chain);
            setTransactionId(result.txHash || 'N/A');
            setStatus('success');
        }
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return {
    isOpen,
    selectedTier,
    selectedCycle,
    selectedMethod,
    status,
    transactionId,
    openPayment,
    closePayment,
    selectMethod,
    processPayment
  };
};
