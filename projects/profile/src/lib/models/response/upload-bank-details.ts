export interface UploadBankDetailsResponse {
  userBankId: number;
  userId: number;
  accountName: string;
  accountNumber: string;
  accountType: string;
  ifscId: number;
  isVerified: number;
  isDefault: number;
  isDeleted: number;
  status: string;
  uploadByAdmin: number;
  approvedByAdmin: string;
  adminReason: string;
  isIdfyFailure: number;
  reason: string;
  approvedMode: string;
  verificationLevel: string;
}
