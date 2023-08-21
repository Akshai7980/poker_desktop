export interface SelfieDetailsResponse {
  userDocId: number;
  docId: number;
  userId: number;
  docNumber: string;
  name: any;
  gender: any;
  file1: string;
  file2: string;
  status: string;
  uploadByAdmin: string;
  approvedByAdmin: any;
  adminReason: any;
  isDeleted: number;
  reason: string;
  approvedMode: string;
  dob: any;
  isIdfyFailure: number;
  verificationLevel: any;
  addedOn: string;
  modifiedOn: string;
  s3URL: string;
}
