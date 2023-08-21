import { RestrictTableTabModelRequest } from '../request/restrict-table-tab.request.model';

export class RestrictTableTabModel {
  clientTab: string | null;

  tab: string;

  clear() {
    this.clientTab = '';
    this.tab = '';
  }

  getRequestModel(): RestrictTableTabModelRequest {
    const restrictTableTabModelRequest: RestrictTableTabModelRequest = {
      clientTab: this.clientTab,
      tab: this.tab
    };

    return restrictTableTabModelRequest;
  }
}
