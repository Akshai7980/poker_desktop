export interface ValidateSavedDataResponseModel {
  code: number;
  prop: string;
  propValues: string | null;
  status: boolean;
  validTill: string | null;
  validityPeriod: number;
  value: string;
}
