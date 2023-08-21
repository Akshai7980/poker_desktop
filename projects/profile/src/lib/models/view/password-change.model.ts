import { PasswordChangeRequestModel } from '../request/password-change-request.model';

export class PasswordChangeModel {
  currentPassword: string;

  newPassword: string;

  confirmPassword: string;

  constructor(currentPassword: string, newPassword: string, confirmPassword: string) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
  }

  getRequestModel(): PasswordChangeRequestModel {
    const requestModel: PasswordChangeRequestModel = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    return requestModel;
  }
}
