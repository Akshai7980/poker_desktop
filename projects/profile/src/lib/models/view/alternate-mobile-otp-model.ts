import { AlternateMobileOtpRequestModel } from '../request/alternate-mobile-otp-send';

export class AlternateMobileOtpModel {
  mobileNumber: string;

  isAlternate: boolean;

  clear() {
    this.mobileNumber = '';
    this.isAlternate = false;
  }

  getRequestModel(): AlternateMobileOtpRequestModel {
    const alternateMobileOtpRequestModel: AlternateMobileOtpRequestModel = {
      mobile: this.mobileNumber,
      alternate: this.isAlternate
    };

    return alternateMobileOtpRequestModel;
  }
}
