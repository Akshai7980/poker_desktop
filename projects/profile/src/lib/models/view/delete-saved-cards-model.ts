import { DeleteSavedCardsReq } from '../request/delete-saved-cards-request';

export class DeleteSavedCardsModel {
  cardId: string;

  clear() {
    this.cardId = '';
  }

  getRequestModel(): DeleteSavedCardsReq {
    const DeleteSavedCards: DeleteSavedCardsReq = {
      cardId: this.cardId
    };

    return DeleteSavedCards;
  }
}
