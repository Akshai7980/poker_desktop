import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  Paths,
  BaseResponse,
  MessageConstant,
  CommonService,
  Avatar
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs/internal/Subscription';
import { inActiveTableData, inactiveHeader } from '../../../static/data';
import { HeaderType, ReferralTable } from '../../../models/models';
import { EarningsInactiveResponse } from '../../../models/response/earnings-inactive.response';
import { RAFService } from '../../../services/raf.service';
import { RemindResponse } from '../../../models/response/remind.response';
import { RAF, RAF_CONSTANTS } from '../../../constants/app-constants';

@Component({
  selector: 'app-in-active',
  templateUrl: './in-active.component.html',
  styleUrls: ['./in-active.component.scss']
})
export class InActiveComponent implements OnInit, OnDestroy, OnChanges {
  @HostBinding('class') class = 'd-flex flex-column flex-1';

  isInAcitveEmpty: boolean = false;

  assetsImagePath = Paths.imagePath;

  inactiveHeader: HeaderType[] = inactiveHeader;

  activeTableData: ReferralTable[] = inActiveTableData;

  @Input() inactiveEarningsList: EarningsInactiveResponse[] = [];

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  userId: number;

  remindDisabel: boolean = false;

  userNameAscend: boolean = true;

  fullNameAscend: boolean = true;

  signupTimeAscend: boolean = true;

  noOfHandsAscend: boolean = true;

  statusAscend: boolean = true;

  selectedAvatar: string;

  inActiveList: EarningsInactiveResponse[] = [];

  constructor(
    public cdr: ChangeDetectorRef,
    private rafService: RAFService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    const user = this.commonService.getUserData();
    this.userId = user?.userId;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inactiveEarningsList']) {
      this.inActiveList = changes['inactiveEarningsList'].currentValue;
      this.inActiveList.forEach((element) => {
        if (element.avatarName) {
          const avatar = parseInt(element?.avatarName.slice('avatar'.length), 10);
          this.selectedAvatar = Avatar.avatars[avatar];
        } else {
          [this.selectedAvatar] = Avatar.avatars;
        }
      });
    }
  }

  sortByHeader(header: keyof EarningsInactiveResponse, type: string) {
    if (type === 'string') this.sortStrings(header);
    else if (type === 'number') this.sortNumbers(header);
    this.cdr.detectChanges();
  }

  sortStrings(parameter: keyof EarningsInactiveResponse) {
    const currentList = [...this.inactiveEarningsList];

    this.inactiveEarningsList = this.inactiveEarningsList.sort(
      (a: EarningsInactiveResponse, b: EarningsInactiveResponse) =>
        a[parameter].toString().localeCompare(b[parameter].toString())
    );

    if (JSON.stringify(this.inactiveEarningsList) === JSON.stringify(currentList)) {
      this.inactiveEarningsList = this.inactiveEarningsList.sort(
        (a: EarningsInactiveResponse, b: EarningsInactiveResponse) =>
          b[parameter].toString().localeCompare(a[parameter].toString())
      );
    }

    const value = Reflect.get(this, `${parameter}Ascend`);
    if (typeof value === 'boolean') {
      Reflect.set(this, `${parameter}Ascend`, !value);
    }
  }

  sortNumbers(parameter: keyof EarningsInactiveResponse) {
    const currentList = [...this.inactiveEarningsList];

    this.inactiveEarningsList = this.inactiveEarningsList.sort(
      (a: EarningsInactiveResponse, b: EarningsInactiveResponse) =>
        parseInt(a[parameter].toString(), 10) - parseInt(b[parameter].toString(), 10)
    );

    if (JSON.stringify(this.inactiveEarningsList) === JSON.stringify(currentList)) {
      this.inactiveEarningsList = this.inactiveEarningsList.sort(
        (a: EarningsInactiveResponse, b: EarningsInactiveResponse) =>
          parseInt(b[parameter].toString(), 10) - parseInt(a[parameter].toString(), 10)
      );
    }

    const value = Reflect.get(this, `${parameter}Ascend`);
    if (typeof value === 'boolean') {
      Reflect.set(this, `${parameter}Ascend`, !value);
    }
  }

  onRemind() {
    const getEarningPoints$ = this.rafService.getRemind(this.userId);
    const getEarningPoints: Subscription = getEarningPoints$.subscribe({
      next: (res: BaseResponse<RemindResponse>) => {
        if (res.code === RAF.SUCCESS) {
          this.remindDisabel = true;
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.Remind,
            flag: RAF_CONSTANTS.SUCCESS_FLAG
          };
        } else {
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.ApiError,
            flag: RAF_CONSTANTS.ERROR_FLAG
          };
        }
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: RAF_CONSTANTS.ERROR_FLAG
        };
      }
    });
    this.subscriptions.push(getEarningPoints);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
