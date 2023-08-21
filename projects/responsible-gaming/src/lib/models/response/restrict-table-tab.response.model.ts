export interface Root {
  respCode: number;
  message: string;
  respData: RestrictTableTabResponseModel;
}

export interface RestrictTableTabResponseModel {
  id: string;
  tab: string;
  settings: Setting[];
  tabNames: TabNames;
}

export interface Setting {
  prop: string;
  values: string[];
  validityPeriod: number;
  selectedData: string;
  lastModified: string;
  duration: string[];
}

export interface TabNames {
  dl: Dl;
  se: Se;
  bil: Bil;
  tl: Tl;
}

export interface Dl {
  tabName: string;
  subTabs: SubTabs;
}

export interface SubTabs {
  pertxnlimit: string;
  dailylimit: string;
  weeklylimit: string;
}

export interface Se {
  tabName: string;
  subTabs: null;
}

export interface Bil {
  tabName: string;
  subTabs: SubTabs2;
}

export interface SubTabs2 {
  tbl: string;
  sbl: string;
}

export interface Tl {
  tabName: string;
  subTabs: null;
}
