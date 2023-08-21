export interface UploadPanDetailsRes {
  addedOn: string;
  adminReason: string;
  approvedByAdmin: any;
  approvedMode: string;
  dob: string;
  isDeleted: boolean;
  isIdfyFailure: number;
  modifiedOn: string;
  panDocument: string;
  panName: string;
  panNumber: string;
  reason: string;
  s3Key: string;
  status: string;
  uploadByAdmin: string;
  userId: number;
  userPanId: number;
  verificationLevel: string;
}
