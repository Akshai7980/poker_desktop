import { SaveUserProfileReq } from '../request/save-user-profile-details';

export class SaveUserProfileModel {
  userId: number | null;

  gender: string;

  email: string;

  mobile: string;

  preferredNumber: string;

  alternateNumber: string;

  clear() {
    this.userId = null;
    this.gender = '';
    this.email = '';
    this.mobile = '';
    this.preferredNumber = '';
    this.alternateNumber = '';
  }

  getRequestModel(): SaveUserProfileReq {
    const SaveUserProfile: SaveUserProfileReq = {
      userId: this.userId,
      gender: this.gender,
      email: this.email,
      mobile: this.mobile,
      preferredNumber: this.preferredNumber,
      alternateNumber: this.alternateNumber
    };

    return SaveUserProfile;
  }
}
