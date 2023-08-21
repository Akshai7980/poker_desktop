export interface VerifyEnteredOtpRequest {
  otp: string;
  saveData: { tab: string; settings: { values: string[]; prop: string }[] };
  tab: string;
}
