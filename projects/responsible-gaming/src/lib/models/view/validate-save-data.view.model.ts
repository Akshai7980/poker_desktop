import { ValidateSaveDataModelRequest } from '../request/validate-save-data.request.model';

export class ValidateSaveDataModel {
  clientTab: string | null;

  tab: string;

  settings: { values: string[]; prop: string }[];

  clear() {
    this.clientTab = '';
    this.tab = '';
    this.settings = [];
  }

  getRequestModel(): ValidateSaveDataModelRequest {
    const validateSaveDataModelRequest: ValidateSaveDataModelRequest = {
      clientTab: this.clientTab,
      tab: this.tab,
      settings: this.settings
    };
    return validateSaveDataModelRequest;
  }
}
