export interface ProfileDetailsResponseModel {
  userInfo: Data;
}

export interface Data {
  email: string;
  userName: string;
  mobile: string;
  alternateNumber: string;
  preferredNumber: string;
  isEmailVerified: number;
  isMobileVerified: number;
  isAltMobileVerified: number;
  dnc: number;
  sourceName: string;
  isUsernameEditable: boolean;
  name: string;
  dob: string;
  gender: string;
  address: string;
}
