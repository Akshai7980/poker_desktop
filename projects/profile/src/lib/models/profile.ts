export type Progress = {
  stepperValue: number;
  stepValue: number;
  nextState: string;
};
export enum PanStatus {
  INITIAL = 'INITIAL',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED'
}
export interface Profiles {
  title: string;
  icon: string;
  component: any;
}
export interface BankCard {
  bankName: string;
  bankLogo: string;
  accountNo: string;
}
export interface Gender {
  name: string;
  code: string;
}
export interface Document {
  name: string;
  code: string;
}
