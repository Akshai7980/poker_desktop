export interface ValidateSaveDataCashModelRequest {
  tab: string;
  settings: Setting[];
}

export interface Setting {
  prop: string;
  values: string[];
  duration: string[];
}
