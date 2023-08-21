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
  Avatar,
  BaseResponse,
  CommonService,
  MessageConstant,
  Paths
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs/internal/Subscription';
import { HeaderType, ReferralTable } from '../../../models/models';
import { activeHeader, activeTableData } from '../../../static/data';
import { EarningsActiveResponse } from '../../../models/response/earnings-active.response';
import { RAFService } from '../../../services/raf.service';
import { RemindResponse } from '../../../models/response/remind.response';
import { RAF, RAF_CONSTANTS } from '../../../constants/app-constants';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss']
})
export class ActiveComponent implements OnInit, OnDestroy, OnChanges {
  @HostBinding('class') class = 'd-flex flex-column flex-1';

  isAcitveEmpty: boolean = false;

  assetsImagePath = Paths.imagePath;

  activeHeader: HeaderType[] = activeHeader;

  activeTableData: ReferralTable[] = activeTableData;

  @Input() activeEarningsList: EarningsActiveResponse[] = [];

  userNameAscend: boolean = true;

  fullNameAscend: boolean = true;

  signupTimeAscend: boolean = true;

  pgpEarnedAscend: boolean = true;

  lastPlayedAscend: boolean = true;

  statusAscend: boolean = true;

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  subscriptions: Subscription[] = [];

  remindDisabel: boolean = false;

  userId: number;

  selectedAvatar: string;

  activeList: EarningsActiveResponse[] = [];

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
    if (changes['activeEarningsList']) {
      this.activeList = changes['activeEarningsList'].currentValue;
      this.activeList.forEach((element) => {
        if (element.avatarName) {
          const avatar = parseInt(element?.avatarName.slice('avatar'.length), 10);
          this.selectedAvatar = Avatar.avatars[avatar];
        } else {
          [this.selectedAvatar] = Avatar.avatars;
        }
      });
    }
  }

  sortByHeader(header: keyof EarningsActiveResponse, type: string) {
    if (type === 'string') this.sortStrings(header);
    else if (type === 'number') this.sortNumbers(header);
    this.cdr.detectChanges();
  }

  sortStrings(parameter: keyof EarningsActiveResponse) {
    const currentList = [...this.activeEarningsList];

    this.activeEarningsList = this.activeEarningsList.sort(
      (a: EarningsActiveResponse, b: EarningsActiveResponse) =>
        a[parameter].toString().localeCompare(b[parameter].toString())
    );

    if (JSON.stringify(this.activeEarningsList) === JSON.stringify(currentList)) {
      this.activeEarningsList = this.activeEarningsList.sort(
        (a: EarningsActiveResponse, b: EarningsActiveResponse) =>
          b[parameter].toString().localeCompare(a[parameter].toString())
      );
    }

    const value = Reflect.get(this, `${parameter}Ascend`);
    if (typeof value === 'boolean') {
      Reflect.set(this, `${parameter}Ascend`, !value);
    }
  }

  sortNumbers(parameter: keyof EarningsActiveResponse) {
    const currentList = [...this.activeEarningsList];

    this.activeEarningsList = this.activeEarningsList.sort(
      (a: EarningsActiveResponse, b: EarningsActiveResponse) =>
        parseInt(a[parameter].toString(), 10) - parseInt(b[parameter].toString(), 10)
    );

    if (JSON.stringify(this.activeEarningsList) === JSON.stringify(currentList)) {
      this.activeEarningsList = this.activeEarningsList.sort(
        (a: EarningsActiveResponse, b: EarningsActiveResponse) =>
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
