export interface AadharRedirectResponse {
  callbackResponse: CallbackResponse;
  id: number;
  userId: number;
  profileId: string;
  captureLink: string;
  type_id: number;
  captureExpiresAt: any;
  status: string;
  addedOn: string;
  isDeleted: boolean;
  modifiedOn: string;
}

export interface CallbackResponse {}
