export interface UploadKycDetailsResp {
  addedOn: string;
  adminReason: string | null;
  approvedByAdmin: string | null;
  approvedMode: string | null;
  dob: string | null;
  docId: number;
  docNumber: string;
  file1: string;
  file2: string;
  gender: string | null;
  isDeleted: boolean;
  isIdfyFailure: boolean;
  modifiedOn: string;
  name: string;
  reason: string;
  status: string;
  uploadByAdmin: string;
  userDocId: number;
  userId: number;
  verificationLevel: string;
}
