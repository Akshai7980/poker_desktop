import { VerifyEnteredOtpRequest } from '../request/verify-entered-otp.resquest.model';

export class VerifyEnteredOtpModel {
  otp: string;
  saveData: { tab: string; settings: { values: string[]; prop: string; duration?: string[] }[] };
  tab: string;

  clear() {
    this.otp = '';
    this.saveData = {
      tab: '',
      settings: [
        {
          values: [],
          prop: '',
          duration: []
        }
      ] as { values: string[]; prop: string; duration?: string[] }[]
    };
    this.tab = '';
  }

  getRequestModel(): VerifyEnteredOtpRequest {
    const verifyEnteredOtpRequest: VerifyEnteredOtpRequest = {
      otp: this.otp,
      saveData: this.saveData,
      tab: this.tab
    };
    return verifyEnteredOtpRequest;
  }
}
