import { UpdateAvtarRequestModel } from '../request/update-avatar-request.model';

export class UpdateAvatarModel {
  avtarId: string;

  constructor(avtarId: string) {
    this.avtarId = avtarId;
  }

  getRequestModel(): UpdateAvtarRequestModel {
    const updateAvatarRequestModel: UpdateAvtarRequestModel = {
      avtarId: this.avtarId,
      userId: ''
    };

    return updateAvatarRequestModel;
  }
}
