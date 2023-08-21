import { SendConfirmationOtpRequest } from '../request/send-confirmation-otp.request.model';

export class SendConfirmationOtpModel {
  resend: boolean;

  clear() {
    this.resend = false;
  }

  getRequestModel(): SendConfirmationOtpRequest {
    const sendConfirmationOtpRequest: SendConfirmationOtpRequest = {
      resend: this.resend
    };
    return sendConfirmationOtpRequest;
  }
}
