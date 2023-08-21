import { ReleaseUnitRequest } from '../request/releaseunit.request.model';

export class ReleaseUnite {
  userId: number;

  startDate: string;

  endDate: string;

  constructor(startDate: string, endDate: string) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  getRequestModel(): ReleaseUnitRequest {
    const releaseUnit: ReleaseUnitRequest = {
      userId: 0,
      startDate: this.startDate,
      endDate: this.endDate
    };

    return releaseUnit;
  }
}
