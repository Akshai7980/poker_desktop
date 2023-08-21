export interface InitiatePurchaseRequest {
  amount: number;
  bonusCode: string;
  purchaseFrom: string;
  redirectUrl: string;
  userId: number;
}
