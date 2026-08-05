declare global {
  interface Window {
    PaystackPop: any;
  }
}

type PaystackMetadata = Record<string, any>;

export function initializePaystackPayment({
  email,
  amount,
  reference,
  metadata,
  onSuccess,
  onClose,
}: {
  email: string;
  amount: number;
  reference: string;
  metadata?: PaystackMetadata; // ✅ ADD THIS
  onSuccess: (ref: any) => void;
  onClose: () => void;
}) {
  if (!window.PaystackPop) {
    throw new Error("Paystack script not loaded");
  }

  const handler = window.PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email,
    amount: amount * 100, // convert to kobo
    ref: reference,

    // ✅ ADD METADATA HERE
    metadata: metadata || {},

    callback: function (response: any) {
      onSuccess(response);
    },

    onClose: function () {
      onClose();
    },
  });

  handler.openIframe();
}