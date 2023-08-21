export interface BonusHistoryResponse {
  data: any;
  headers: Header[];
}

export interface Header {
  header: string;
  key: string;
  type: string;
  isVisible: boolean;
}
