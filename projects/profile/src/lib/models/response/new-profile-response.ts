export interface NewProfileResponseModel {
  // userInfo
  userInfo: {
    email: string;
    userName: string;
    mobile: string;
    alternateNumber: string;
    preferredNumber: string;
    isEmailVerified: number;
    isMobileVerified: number;
    isAltMobileVerified: number;
    dnc: string;
    sourceName: string;
    isUsernameEditable: boolean;
    isPanVerified: boolean;
    isKycVerified: boolean;
    isSelfieMandatory: boolean;
    isBankVerified: boolean;
    isSelfieVerified: boolean;
    name: string;
    dob: string;
    gender: string;
    address: string;
  };
}
