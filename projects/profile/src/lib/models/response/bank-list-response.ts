export interface BankListResponse {
  userBankId: number;
  userId: number;
  accountName: string;
  accountNumber: string;
  accountType: string;
  ifscId: number;
  isVerified: boolean;
  isDefault: boolean;
  isDeleted: boolean;
  status: string;
  uploadByAdmin: number;
  approvedByAdmin: number;
  adminReason: string;
  isIdfyFailure: boolean;
  reason: string;
  approvedMode: string;
  verificationLevel: string;
  addedOn: string;
  modifiedOn: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  bankElement: BankElement[];
}
interface BankElement {
  isVerified: boolean;
  userBankId: number;
}
