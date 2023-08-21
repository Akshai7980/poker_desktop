export interface UserKycDocsRes {
  list: List[];
  s3URL: string;
}

export interface List {
  userId: number;
  reason: string;
  docNumber: string;
  approvedByAdmin: any;
  adminReason: any;
  approvedMode: string;
  uploadByAdmin: string;
  userDocId: number;
  status: string;
  isDeleted: string;
  name: string;
  file1: string;
  file2: string;
  docType: string;
}
