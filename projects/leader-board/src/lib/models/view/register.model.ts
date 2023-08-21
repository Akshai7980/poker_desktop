import environment from 'projects/shared/src/environments/environment';
import { RegisterRequest } from '../request/register.request';

export class RegisterModel {
  clientName: string;

  contestType: string;

  leagueId: string;

  clear() {
    this.clientName = '';
    this.contestType = '';
    this.leagueId = '';
  }

  getRequestModel(): RegisterRequest {
    const register: RegisterRequest = {
      clientName: environment.config.DESK_APP_NAME,
      contestType: this.contestType,
      leagueId: this.leagueId
    };

    return register;
  }
}
