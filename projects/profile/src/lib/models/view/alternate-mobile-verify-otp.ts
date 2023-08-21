import { AlternateMobileVerifyOtpReq } from '../request/alternate-mobile-verify-otp';

export class AlternateMobileVerifyOtp {
  mobileNumber: string;

  otpNumber: string;

  isAlternate: boolean;

  clear() {
    this.mobileNumber = '';
    this.otpNumber = '';
    this.isAlternate = false;
  }

  getRequestModel(): AlternateMobileVerifyOtpReq {
    const alternateMobileVerifyOtpReq: AlternateMobileVerifyOtpReq = {
      mobile: this.mobileNumber,
      otp: this.otpNumber,
      alternate: this.isAlternate
    };

    return alternateMobileVerifyOtpReq;
  }
}
