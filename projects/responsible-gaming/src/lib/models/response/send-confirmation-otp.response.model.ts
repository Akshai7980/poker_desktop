export interface SendConfirmationOtpResponse {
  attemptLeft: number;
  otpExpireTime: number;
  userId: number;
  userName: string;
}
