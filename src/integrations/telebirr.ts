export type PaymentStatus =
  | 'created'
  | 'pending_customer_action'
  | 'verification_pending'
  | 'settled'
  | 'failed'
  | 'expired'
  | 'reversed'
  | 'refunded'
  | 'disputed';

export type PaymentIntent = {
  paymentIntentId: string;
  quoteId: string;
  amountEtb: number;
  currency: 'ETB';
  status: PaymentStatus;
  providerReference?: string;
};

export type ProviderHandoff = {
  paymentIntentId: string;
  action: 'provider_handoff';
  url: string;
  expiresAt: string;
};

/**
 * The app only consumes this provider-neutral contract. Merchant credentials,
 * request signing, callbacks, status queries, and reconciliation belong in a
 * server-side adapter after telebirr merchant onboarding. Never put secrets in
 * the Expo bundle.
 */
export interface PaymentProviderAdapter {
  createCustomerHandoff(intent: PaymentIntent): Promise<ProviderHandoff>;
  getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent>;
}

export class DemoPaymentAdapter implements PaymentProviderAdapter {
  async createCustomerHandoff(intent: PaymentIntent): Promise<ProviderHandoff> {
    return {
      paymentIntentId: intent.paymentIntentId,
      action: 'provider_handoff',
      url: `https://payment.forward.et/handoff/${intent.paymentIntentId}`,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };
  }

  async getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent> {
    return {
      paymentIntentId,
      quoteId: 'demo-quote',
      amountEtb: 1600,
      currency: 'ETB',
      status: 'verification_pending',
    };
  }
}
