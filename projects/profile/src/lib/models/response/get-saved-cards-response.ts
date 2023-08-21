export interface GetSavedCardsRes {
  list: [
    {
      cardId: string;
      cardNumber: string;
      cardType: string;
      cardIssuer: string;
      cardBrand: string;
    }
  ];
}
