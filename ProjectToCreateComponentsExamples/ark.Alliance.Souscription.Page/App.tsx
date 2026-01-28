import React from 'react';
import { useAppConfig } from './hooks/useAppConfig';
import { usePricingVM } from './hooks/usePricing';
import { usePaymentVM } from './hooks/usePayment';
import { PricingPage } from './components/PricingPage';
import { PaymentModal } from './components/PaymentModal';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  // 1. Initialize Global Config VM
  const { 
    config, 
    updateConfig, 
    resetConfig, 
    isConfigPanelOpen, 
    setIsConfigPanelOpen 
  } = useAppConfig();

  // 2. Initialize Page specific VMs
  const pricingVM = usePricingVM(config);
  const paymentVM = usePaymentVM();

  // 3. Handlers bridging logic
  const handleSelectTier = (tier: any) => {
    paymentVM.openPayment(tier, pricingVM.cycle);
  };

  return (
    <div className="min-h-screen font-sans text-gray-100 bg-background transition-colors duration-700">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10">
        <PricingPage 
          config={config} 
          currentCycle={pricingVM.cycle}
          onToggleCycle={pricingVM.toggleCycle}
          onSelectTier={handleSelectTier}
        />
      </div>

      <PaymentModal 
        isOpen={paymentVM.isOpen}
        onClose={paymentVM.closePayment}
        tier={paymentVM.selectedTier}
        cycle={paymentVM.selectedCycle}
        methods={config.paymentMethods}
        selectedMethod={paymentVM.selectedMethod}
        onSelectMethod={paymentVM.selectMethod}
        onProcessPayment={paymentVM.processPayment}
        status={paymentVM.status}
        transactionId={paymentVM.transactionId}
      />

      <AdminPanel 
        config={config}
        isOpen={isConfigPanelOpen}
        setIsOpen={setIsConfigPanelOpen}
        onSave={updateConfig}
        onReset={resetConfig}
      />
    </div>
  );
}
