export interface TicketInfoResponse {
  ticketInfo: TicketInfo[];
}

export interface TicketInfo {
  tktStatusExpiryLst: TktStatusExpiryLst[];
  tournament: string;
  chips: number;
  expiryDate: string;
  tkt: string;
  isExpire: boolean;
}

export interface TktStatusExpiryLst {
  status: string;
  expDate: string;
  count: number;
}
