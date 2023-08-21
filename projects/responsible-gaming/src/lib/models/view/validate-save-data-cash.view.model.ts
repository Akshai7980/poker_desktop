import { ValidateSaveDataCashModelRequest } from '../request/validate-save-data-cash.request.model';

export class ValidateSaveDataCashModel {
  tab: string;

  settings: { values: string[]; prop: string; duration: string[] }[];

  clear() {
    this.tab = '';
    this.settings = [];
  }

  getRequestModel(): ValidateSaveDataCashModelRequest {
    const validateSaveDataModelRequest: ValidateSaveDataCashModelRequest = {
      tab: this.tab,
      settings: this.settings
    };
    return validateSaveDataModelRequest;
  }
}
