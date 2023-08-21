export class UploadPanDetailsModel {
  userId: number | null;

  panNumber: string;

  document: File | null;

  clear() {
    this.userId = null;
    this.panNumber = '';
    this.document = null;
  }
}
