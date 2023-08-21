export interface CommonFilterModel {
  label: string;
  name: string;
  operator: string;
  value: string | number;
}

export interface CommonFilterOptionalModel {
  label: string;
  name: string;
  operator?: string;
  value: string | number;
}
