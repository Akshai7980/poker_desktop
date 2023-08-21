export interface OffersResponse {
  offerId: number;
  offerName: string;
  startDate: string;
  endDate: string;
  originalPrice: number;
  offerPrice: number;
  percentOff: number;
  desktopBanner: string;
  tktId: number;
  status: string;
  purchaseStatus: string;
  paymentType: string;
  urgencyMaxUsage: number;
  maxUsage: number;
  adminId: number;
  totalUsage: number;
}
