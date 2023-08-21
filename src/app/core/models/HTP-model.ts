import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  GlobalConstant,
  InjectorInstance,
  ServerCommands,
  UrlConstant,
  UserAccountService
} from 'projects/shared/src/public-api';

export class HTPModel extends ServerCommands {
  private static classRef: HTPModel;

  private httpClient: HttpClient;

  private subject = new Subject<object>();

  private userAcountService: UserAccountService;

  private constructor() {
    super(true);
    this.httpClient = InjectorInstance.get(HttpClient);
    this.userAcountService = InjectorInstance.get(UserAccountService);
    this.getHTPData();
  }

  // get instance of class
  static getInstance() {
    if (!HTPModel.classRef) {
      HTPModel.classRef = new HTPModel();
    }
    return HTPModel.classRef;
  }

  // get numberOfHands data
  private getHTPData() {
    const url = `${environment.config.NEW_NODE_HOST}${UrlConstant.NO_OF_HANDS_URL}`;
    this.httpClient.get(url).subscribe(
      (res: any) => {
        this.subject.next(res.data);
        if (!this.userAcountService.isLogged) {
          setTimeout(() => {
            this.getHTPData();
          }, GlobalConstant.NO_OF_HANDS_UPDATION_TIME * 1000);
        }
      },
      () => {
        if (!this.userAcountService.isLogged) {
          setTimeout(() => {
            this.getHTPData();
          }, GlobalConstant.NO_OF_HANDS_UPDATION_TIME * 1000);
        }
      }
    );
  }

  // return HTP observable
  observeHTPData(): Subject<object> {
    return this.subject;
  }

  // reset variables or unsubscription
  protected onDestroy() {
    this.removeSfsCommands();
  }
}
