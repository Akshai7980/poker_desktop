import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  BaseResponse,
  GlobalConstant,
  LocalStorageService,
  MATDIALOG,
  MatDialogService,
  MessageConstant,
  ToastModel
} from 'projects/shared/src/public-api';
import { ContactSupport } from 'projects/shared/src/lib/models/response/contact-us/viewmodel/contact-support.model';
import { Subscription } from 'rxjs';
import {
  EnquiryCategoryItem,
  EnquiryCategoryListResponse
} from 'projects/shared/src/lib/models/response/contact-us/response/enquiry-category-response.model';
import { LoginComponent } from 'src/app/modules/auth/components/login/login.component';
import { ContactUsService } from 'projects/shared/src/lib/services/contact-us.service';
import { ContactUs, ContactUsConstants, Paths } from '../../constants/app-constants';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;
  enquiryCategoryList: EnquiryCategoryListResponse = {} as EnquiryCategoryListResponse;
  contactSupportList: ContactSupport[] = [];
  subscriptions: Subscription[] = [];
  toastValue: ToastModel;
  isShowToast: boolean = false;
  userLoggedIn: boolean;
  openSubchildPage: 'chat' | 'generalenq' = 'chat';
  selectedEnqCategoryItem: EnquiryCategoryItem = {} as EnquiryCategoryItem;
  selectedBox: string = '';

  constructor(
    private dialogRef: MatDialogRef<HelpComponent>,
    public readonly contactUsService: ContactUsService,
    private localStorageService: LocalStorageService,
    private matDialogService: MatDialogService
  ) {}

  ngOnInit(): void {
    this.getContactSupportList();
    this.getEnquiryCategoryList();
  }

  getContactSupportList() {
    this.contactSupportList = [
      {
        type: 'call',
        title: 'Helpline Numbers and Timings',
        dialNumber: '1800-572-0611',
        timings: '10:00 AM to 07:00 PM',
        fromTime: '10:00:00',
        toTime: '19:00:00',
        dayTypes: 'All Days',
        enabled: this.checkTimeRange('10:00:00', '19:00:00')
      },
      {
        type: 'chat',
        title: 'Chat and Email Support Timings',
        timings: '10:00 AM to 07:00 PM',
        fromTime: '01:00:00',
        toTime: '02:00:00',
        dayTypes: 'All Days',
        enabled: this.checkTimeRange('10:00:00', '19:00:00')
      }
    ];

    this.contactSupportList = this.contactSupportList.map((item: ContactSupport) => {
      let image = '';
      if (item.type === 'call') {
        if (item.enabled) {
          image = 'auth/call.svg';
        } else {
          image = 'contact-us/call-grey.svg';
        }
      } else if (item.type === 'chat') {
        if (item.enabled) {
          image = 'auth/chat.svg';
        } else {
          image = 'contact-us/chat-grey.svg';
        }
      }
      return { ...item, image };
    });
  }

  getEnquiryCategoryList() {
    const getEnquiryCategory$ = this.contactUsService.getEnquiryCategoryList();
    const getEnquiryCategory: Subscription = getEnquiryCategory$.subscribe({
      next: (res: BaseResponse<EnquiryCategoryListResponse>) => {
        if (res.code === ContactUs.SUCCESS) {
          this.enquiryCategoryList = res.data;
        } else {
          this.toastMessageShow(ContactUsConstants.errorFlag, res.message);
        }
      },
      error: () => {
        this.toastMessageShow(ContactUsConstants.errorFlag, MessageConstant.SomeThingWentWrong);
      }
    });
    this.subscriptions.push(getEnquiryCategory);
  }

  clickRightNext(item: ContactSupport) {
    if (item.type === 'call' || item.type === 'chat') {
      this.isUserLoggedIn();
      this.openSubchildPage = 'chat';
      this.selectedBox = item.title;
    }
  }

  openGeneralEnquires(enquiryCategoryItem: EnquiryCategoryItem) {
    this.isUserLoggedIn();
    this.openSubchildPage = 'generalenq';
    const modifiedEnquiryCategoryItem: EnquiryCategoryItem = { ...enquiryCategoryItem };
    modifiedEnquiryCategoryItem.inputData = true;
    this.selectedEnqCategoryItem = modifiedEnquiryCategoryItem;
    this.selectedBox = enquiryCategoryItem.name;
  }

  isUserLoggedIn() {
    this.userLoggedIn = this.localStorageService.getItem('token');
    if (!this.userLoggedIn) {
      this.matDialogService.openDialog(LoginComponent, 'login', MATDIALOG.loginDialog);
      return false;
    }
    return true;
  }

  toastMessageShow(flag: string, message: string) {
    this.isShowToast = true;
    this.toastValue = {
      message,
      flag
    };
  }

  onBack() {
    const { BACK_BUTTON_TRANSACTION } = GlobalConstant.CASHIER;
    this.onClose(BACK_BUTTON_TRANSACTION);
  }

  checkTimeRange(fromTimeString: string, toTimeString: string): boolean | undefined {
    let currentTime: boolean | undefined;
    const now = new Date();
    const fromTime = new Date();
    const toTime = new Date();

    // Convert time strings to Date objects
    const [fromHour, fromMinute, fromSecond] = fromTimeString.split(':').map(Number);
    fromTime.setHours(fromHour, fromMinute, fromSecond);

    const [toHour, toMinute, toSecond] = toTimeString.split(':').map(Number);
    toTime.setHours(toHour, toMinute, toSecond);

    // Compare current time with the range
    if (now >= fromTime && now <= toTime) {
      currentTime = true;
    }
    return currentTime;
  }

  onClose(result?: string) {
    this.dialogRef.addPanelClass('dialog-slide-out-right');
    this.dialogRef.removePanelClass('dialog-slide-in-right');
    setTimeout(() => {
      this.dialogRef.close(result);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
