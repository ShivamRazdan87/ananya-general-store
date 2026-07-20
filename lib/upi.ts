// Builds a standard UPI deep link ("upi://pay?...") that opens the
// customer's UPI app (GPay, PhonePe, Paytm, BHIM, etc.) with the store's
// UPI ID and the exact order amount pre-filled. This is direct
// peer-to-peer UPI — money goes straight from the customer's bank to the
// store owner's bank account, with no gateway and no fees.
//
// Tradeoff: because there's no gateway in the middle, the website has no
// automatic way to confirm the payment actually succeeded. The store
// owner needs to check their own UPI app before fulfilling an order paid
// this way (see the "Direct UPI" flow in PaymentModal.tsx and the
// paymentMethod label used in checkout).

export const STORE_UPI_ID = "9910428488@ptsbi";
export const STORE_UPI_NAME = "Ananya General Store";

export function buildUpiLink(amount: number, orderNote: string): string {
  const params = new URLSearchParams({
    pa: STORE_UPI_ID,
    pn: STORE_UPI_NAME,
    am: amount.toFixed(2),
    cu: "INR",
    tn: orderNote,
  });
  return `upi://pay?${params.toString()}`;
}
