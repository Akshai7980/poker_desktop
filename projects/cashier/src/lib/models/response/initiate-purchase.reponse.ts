export interface InitiatePurchaseResponse {
  txnId: number;
  payload: Payload;
}

export interface Payload {
  payment_links: PaymentLinks;
  status: string;
}

export interface PaymentLinks {
  iframe: string;
  web: string;
  mobile: string;
}
