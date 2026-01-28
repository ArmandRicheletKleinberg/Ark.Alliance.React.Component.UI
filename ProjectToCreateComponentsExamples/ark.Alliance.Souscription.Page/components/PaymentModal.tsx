import React, { useState } from 'react';
import { Tier, BillingCycle, PaymentMethod, CryptoConfig } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { PaymentStatus } from '../hooks/usePayment';
import { Wallet, Copy, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: Tier | null;
  cycle: BillingCycle;
  methods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (m: PaymentMethod) => void;
  onProcessPayment: () => void;
  status: PaymentStatus;
  transactionId: string | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen, onClose, tier, cycle, methods, selectedMethod, onSelectMethod, onProcessPayment, status, transactionId
}) => {
  const [copied, setCopied] = useState(false);

  if (!tier) return null;

  const price = cycle === 'monthly' ? tier.pricing.monthly : tier.pricing.yearly;
  const priceDisplay = `${tier.pricing.currency}${price}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderCryptoDetails = (config: CryptoConfig) => {
    // Generates a QR Code URL using a public API for the prototype to avoid heavy deps
    // In production, use 'qrcode.react' component.
    const qrData = config.chain.toLowerCase().includes('bitcoin') 
      ? `bitcoin:${config.address}?amount=${price}` 
      : config.address;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&bgcolor=1e293b&color=ffffff`;

    return (
      <div className="mt-6 bg-black/20 p-6 rounded-xl border border-white/5 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="bg-white p-2 rounded-lg flex-shrink-0">
             <img src={qrUrl} alt="QR Code" className="w-32 h-32" />
          </div>
          
          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Network</label>
              <div className="text-white font-medium">{config.chain}</div>
            </div>
            
            <div>
              <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Send To Address</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="bg-black/40 px-3 py-2 rounded text-sm text-primary break-all flex-1 font-mono">
                  {config.address}
                </code>
                <button 
                  onClick={() => copyToClipboard(config.address)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy Address"
                >
                  {copied ? <CheckCircle size={18} className="text-green-400"/> : <Copy size={18} className="text-gray-400"/>}
                </button>
              </div>
            </div>

            {config.confirmationsHint && (
               <div className="flex items-center gap-2 text-xs text-yellow-500/80">
                 <AlertTriangle size={12} />
                 <span>{config.confirmationsHint}</span>
               </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={32} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
      <p className="text-gray-400 mb-6">Your subscription to {tier.name} is now active.</p>
      {transactionId && (
        <div className="bg-black/30 inline-block px-4 py-2 rounded-lg text-sm text-gray-400 mb-6">
          Ref: {transactionId}
        </div>
      )}
      <Button onClick={onClose}>Close</Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={status === 'success' ? 'Confirmation' : 'Secure Checkout'}>
      {status === 'success' ? renderSuccess() : (
        <>
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl mb-6 border border-white/5">
            <div>
              <p className="text-sm text-gray-400">Selected Plan</p>
              <p className="text-lg font-bold text-white">{tier.name} <span className="text-sm font-normal text-gray-500">({cycle})</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-2xl font-bold text-primary">{priceDisplay}</p>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Select Payment Method</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {methods.filter(m => m.enabled).map(method => (
              <button
                key={method.id}
                onClick={() => onSelectMethod(method)}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${
                  selectedMethod?.id === method.id 
                    ? 'bg-primary/10 border-primary shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                    : 'bg-surface border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                {method.icon ? (
                  <img src={method.icon} alt={method.label} className="w-8 h-8 object-contain" />
                ) : method.type === 'crypto' ? (
                  <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400">
                    <Wallet size={16} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400">
                    <span className="font-bold text-xs">P</span>
                  </div>
                )}
                <div>
                  <div className="font-medium text-white">{method.label}</div>
                  <div className="text-xs text-gray-500">{method.type === 'crypto' ? method.cryptoConfig?.symbol : 'Secure'}</div>
                </div>
              </button>
            ))}
          </div>

          {selectedMethod?.type === 'crypto' && selectedMethod.cryptoConfig && renderCryptoDetails(selectedMethod.cryptoConfig)}

          {selectedMethod && (
            <div className="mt-8 border-t border-white/10 pt-6">
               <Button 
                className="w-full h-12 text-lg" 
                onClick={onProcessPayment}
                isLoading={status === 'processing'}
              >
                {selectedMethod.type === 'paypal' 
                  ? `Pay ${priceDisplay} with PayPal` 
                  : `I have sent ${priceDisplay} equivalent`}
               </Button>
               {selectedMethod.type === 'paypal' && (
                 <p className="text-center text-xs text-gray-500 mt-2">
                   * This is a prototype. No real money will be charged.
                 </p>
               )}
            </div>
          )}
        </>
      )}
    </Modal>
  );
};