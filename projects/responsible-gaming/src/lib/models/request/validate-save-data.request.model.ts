export interface ValidateSaveDataModelRequest {
  clientTab: string | null;
  tab: string;
  settings: { values: string[]; prop: string }[];
}
