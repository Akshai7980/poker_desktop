export interface UserDepositHistoryResponseModel {
  purchaseData: {
    currentDayAmount: number;
    currentDayCount: number;
    weekDayAmount: number;
    weekDayCount: number;
  };
}
