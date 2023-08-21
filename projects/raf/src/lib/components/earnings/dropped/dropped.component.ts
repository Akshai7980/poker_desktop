import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Avatar, Paths } from 'projects/shared/src/public-api';
import { droppedHeader, droppedTableData } from '../../../static/data';
import { HeaderType, ReferralTable } from '../../../models/models';
import { EarningsDroppedResponse } from '../../../models/response/earnings-dropped.response';

@Component({
  selector: 'app-dropped',
  templateUrl: './dropped.component.html',
  styleUrls: ['./dropped.component.scss']
})
export class DroppedComponent implements OnChanges {
  @HostBinding('class') class = 'd-flex flex-column flex-1';

  isAcitveEmpty: boolean = false;

  assetsImagePath = Paths.imagePath;

  droppedHeader: HeaderType[] = droppedHeader;

  droppedTableData: ReferralTable[] = droppedTableData;

  @Input() droppedEarningsList: EarningsDroppedResponse[] = [];

  userNameAscend: boolean = true;

  fullNameAscend: boolean = true;

  signupTimeAscend: boolean = true;

  pgpEarnedAscend: boolean = true;

  noOfHandsAscend: boolean = true;

  statusAscend: boolean = true;

  selectedAvatar: string;

  droppedList: EarningsDroppedResponse[] = [];

  constructor(public cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['droppedEarningsList']) {
      this.droppedList = changes['droppedEarningsList'].currentValue;
      this.droppedList.forEach((element) => {
        if (element.avatarName) {
          const avatar = parseInt(element?.avatarName.slice('avatar'.length), 10);
          this.selectedAvatar = Avatar.avatars[avatar];
        } else {
          [this.selectedAvatar] = Avatar.avatars;
        }
      });
    }
  }

  sortByHeader(header: keyof EarningsDroppedResponse, type: string) {
    if (type === 'string') this.sortStrings(header);
    else if (type === 'number') this.sortNumbers(header);
    this.cdr.detectChanges();
  }

  sortStrings(parameter: keyof EarningsDroppedResponse) {
    const currentList = [...this.droppedEarningsList];

    this.droppedEarningsList = this.droppedEarningsList.sort(
      (a: EarningsDroppedResponse, b: EarningsDroppedResponse) =>
        a[parameter].toString().localeCompare(b[parameter].toString())
    );

    if (JSON.stringify(this.droppedEarningsList) === JSON.stringify(currentList)) {
      this.droppedEarningsList = this.droppedEarningsList.sort(
        (a: EarningsDroppedResponse, b: EarningsDroppedResponse) =>
          b[parameter].toString().localeCompare(a[parameter].toString())
      );
    }

    const value = Reflect.get(this, `${parameter}Ascend`);
    if (typeof value === 'boolean') {
      Reflect.set(this, `${parameter}Ascend`, !value);
    }
  }

  sortNumbers(parameter: keyof EarningsDroppedResponse) {
    const currentList = [...this.droppedEarningsList];

    this.droppedEarningsList = this.droppedEarningsList.sort(
      (a: EarningsDroppedResponse, b: EarningsDroppedResponse) =>
        parseInt(a[parameter].toString(), 10) - parseInt(b[parameter].toString(), 10)
    );

    if (JSON.stringify(this.droppedEarningsList) === JSON.stringify(currentList)) {
      this.droppedEarningsList = this.droppedEarningsList.sort(
        (a: EarningsDroppedResponse, b: EarningsDroppedResponse) =>
          parseInt(b[parameter].toString(), 10) - parseInt(a[parameter].toString(), 10)
      );
    }

    const value = Reflect.get(this, `${parameter}Ascend`);
    if (typeof value === 'boolean') {
      Reflect.set(this, `${parameter}Ascend`, !value);
    }
  }
}
