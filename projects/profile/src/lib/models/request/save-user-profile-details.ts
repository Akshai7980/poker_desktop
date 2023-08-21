export interface SaveUserProfileReq {
  userId?: number | null;
  gender?: string;
  email?: string;
  mobile?: string;
  preferredNumber?: string;
  alternateNumber?: string;
}
