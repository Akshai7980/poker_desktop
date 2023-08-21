export interface RestrictTableResponseModel {
  id: string;
  tab: string;
  tabNames: TabNames;
  subTabs: SubTabs3;
}

export interface TabNames {
  bil: Bil;
  tl: Tl;
  se: Se;
  dl: Dl;
}

export interface Bil {
  tabName: string;
  subTabs: SubTabs;
}

export interface SubTabs {
  sbl: string;
  tbl: string;
}

export interface Tl {
  tabName: string;
  subTabs: {};
}

export interface Se {
  tabName: string;
  subTabs: {};
}

export interface Dl {
  tabName: string;
  subTabs: SubTabs2;
}

export interface SubTabs2 {
  pertxnlimit: string;
  dailylimit: string;
  weeklylimit: string;
}

export interface SubTabs3 {
  pertxnlimit: Pertxnlimit[];
  dailylimit: Dailylimit[];
  weeklylimit: Weeklylimit[];
}

export interface Pertxnlimit {
  prop: string;
  validityPeriod: number;
  selectedData: string;
}

export interface Dailylimit {
  prop: string;
  validityPeriod: number;
  selectedData: string;
}

export interface Weeklylimit {
  prop: string;
  validityPeriod: number;
  selectedData: string;
  lastModified: string;
}
