export interface UploadKycDetailsReq {
  userId: number | null;
  docNumber: string;
  docType: string;
  file1: object;
  file2: object;
}
