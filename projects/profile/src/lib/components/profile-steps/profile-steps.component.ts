import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { MenuItem } from 'primeng/api';
import { LocalStorageService } from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { Paths } from '../../constants/app-constants';
import { NewProfileResponseModel } from '../../models/response/new-profile-response';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-steps',
  templateUrl: './profile-steps.component.html',
  styleUrls: ['../../../assets/components/common.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class ProfileStepsComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column hp100 ovf-hide';

  activeTitle: string = 'Personal Details';

  assetsImagePath = Paths.imagePath;

  activeIndex: number;

  items: MenuItem[];

  isComplected: boolean;

  @Input() activeIndexFromServer: number;

  @ViewChild('stepper')
  stepper: MatStepper;

  userName: string;

  completed: boolean = false;

  isLinear = true;

  userData: NewProfileResponseModel;

  subscriptions: Subscription[] = [];

  firstFormGroup = this.formBuilder.group({
    firstCtrl: ['', Validators.required]
  });

  secondFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required]
  });

  thirdFromGroup = this.formBuilder.group({
    thirdCtrl: ['', Validators.required]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly profileService: ProfileService,
    private readonly localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<ProfileStepsComponent>
  ) {
    const user: { userName: string; password: string } =
      this.localStorageService.getItem('userLoginDetails');
    this.userName = user?.userName;
    [this.activeIndexFromServer, this.userData] = this.data;
  }

  ngAfterViewInit(): void {
    const stepsList: QueryList<MatStep> = this.stepper._steps;
    if (this.activeIndexFromServer === 1) {
      stepsList.toArray()[0].completed = true;
    } else if (this.activeIndexFromServer === 2) {
      stepsList.toArray()[0].completed = true;
      stepsList.toArray()[1].completed = true;
    }
  }

  ngOnInit(): void {
    const userNameSub = this.profileService.userName.subscribe((res: string) => {
      this.userName = res;
    });

    this.subscriptions.push(userNameSub);

    this.items = [
      {
        label: 'Personal Details',
        command: () => {
          this.activeIndex = 0;
        }
      },
      {
        label: 'Document Verification',
        command: () => {
          this.activeIndex = 1;
        }
      },
      {
        label: 'Bank A/C Details',
        command: () => {
          this.activeIndex = 2;
        }
      }
    ];
    this.activeTitle = this.items[this.activeIndexFromServer]?.label as string;
  }

  next() {
    if (this.activeIndex === 2) {
      this.activeIndex = 0;
    } else {
      this.activeIndex += 1;
    }
  }

  @Output() stepsChange = new EventEmitter<number>();

  gotChanged(event: any) {
    this.activeTitle = this.items[event.selectedIndex]?.label as string;
    this.stepsChange.emit(event.selectedIndex);
  }

  nextClicked2nd() {
    this.firstFormGroup.controls.firstCtrl.setValue('1st');
    this.secondFormGroup.controls.secondCtrl.setValue('2nd');

    // move to next step
    this.stepper.next();
  }

  nextClicked() {
    this.firstFormGroup.controls.firstCtrl.setValue('1st');

    // move to next step
    this.stepper.next();
  }

  goBackToProfile() {
    this.profileService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((val: Subscription) => val.unsubscribe());
  }
}
