export interface KycStatusResponse {
  isPanVerified: boolean;
  isKycVerified: boolean;
  isBankVerified: boolean;
  isSelfieMandatory: boolean;
  isSelfieVerified: boolean;
  s3URL: string;
  fullName: string;
}
