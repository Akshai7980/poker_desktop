export interface CustomBaseResponse<T> {
  respCode: number;
  respData: T;
  message: string;
}
