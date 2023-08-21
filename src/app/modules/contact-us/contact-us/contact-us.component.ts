import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  BaseResponse,
  LocalStorageService,
  MATDIALOG,
  MatDialogService,
  MessageConstant,
  Paths,
  ToastModel
} from 'projects/shared/src/public-api';
import {
  EnquiryCategoryItem,
  EnquiryCategoryListResponse
} from 'projects/shared/src/lib/models/response/contact-us/response/enquiry-category-response.model';
import { ContactUs, ContactUsConstants } from 'projects/cashier/src/lib/constants/app-constants';
import { Clipboard } from '@angular/cdk/clipboard';
import { Subscription } from 'rxjs';
import { FaqDialogComponent } from 'projects/leader-board/src/lib/components/dialogs/faq-dialog/faq-dialog.component';
import { ContactSupport } from 'projects/shared/src/lib/models/response/contact-us/viewmodel/contact-support.model';
import { ContactAddress } from 'projects/shared/src/lib/models/response/contact-us/viewmodel/address.model';
import { ContactUsService } from 'projects/shared/src/lib/services/contact-us.service';
import { ChatWithUsComponent } from 'projects/shared/src/lib/components/contact-us/chat-with-us/chat-with-us.component';
import { GeneralEnquiresComponent } from 'projects/shared/src/lib/components/contact-us/general-enquires/general-enquires.component';
import { LoginComponent } from '../../auth/components/login/login.component';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;
  contactUs: any;
  subscriptions: Subscription[] = [];
  toastValue: ToastModel;
  isShowToast: boolean = false;
  enquiryCategoryList: EnquiryCategoryListResponse = {} as EnquiryCategoryListResponse;
  contactSupportList: ContactSupport[] = [];
  addressList: ContactAddress[] = [];
  userLoggedIn: boolean;

  constructor(
    public dialog: MatDialog,
    private clipBoard: Clipboard,
    // private readonly formBuilder: FormBuilder,
    private matDialogService: MatDialogService,
    private localStorageService: LocalStorageService,
    public readonly contactUsService: ContactUsService
  ) {}

  ngOnInit(): void {
    this.getContactSupportList();
    this.getAddessList();
    this.getEnquiryCategoryList();
  }

  clickRightNext(item: ContactSupport) {
    if (item.type === 'call' || item.type === 'chat') {
      if (item.type === 'chat') {
        if (!this.isUserLoggedIn()) {
          return;
        }
        this.dialog.open(ChatWithUsComponent, {
          ...MATDIALOG.animatedDialog
        });
      }
    } else {
      this.dialog.open(FaqDialogComponent, {
        ...MATDIALOG.faqDialog
      });
    }
  }

  openGeneralEnquires(enquiryCategoryItem: EnquiryCategoryItem) {
    if (!this.isUserLoggedIn()) {
      return;
    }
    const dialogRef = this.dialog.open(GeneralEnquiresComponent, {
      ...MATDIALOG.animatedDialog,
      data: { enquiryCategory: enquiryCategoryItem }
    });
    const dialog = dialogRef.afterClosed().subscribe((result: string) => {
      if (result === ContactUsConstants.successFlag) {
        this.toastMessageShow(
          ContactUsConstants.successFlag,
          MessageConstant.contactUsTicketSuccessMsg
        );
      }
    });
    this.subscriptions.push(dialog);
  }

  isUserLoggedIn() {
    this.userLoggedIn = this.localStorageService.getItem('token');
    if (!this.userLoggedIn) {
      this.matDialogService.openDialog(LoginComponent, 'login', MATDIALOG.loginDialog);
      return false;
    }
    return true;
  }

  getContactSupportList() {
    this.contactSupportList = [
      {
        type: 'call',
        title: 'Give us a call',
        dialNumber: '1800-572-0611',
        timings: '10:00 AM to 07:00 PM',
        fromTime: '10:00:00',
        toTime: '19:00:00',
        dayTypes: 'All Days',
        enabled: this.checkTimeRange('10:00:00', '19:00:00')
      },
      {
        type: 'chat',
        title: 'Chat support',
        timings: '10:00 AM to 07:00 PM',
        fromTime: '01:00:00',
        toTime: '02:00:00',
        dayTypes: 'All Days',
        enabled: this.checkTimeRange('10:00:00', '19:00:00')
      },
      {
        type: 'faq',
        title: `Frequently asked questions (FAQ's)`,
        description: 'Everything you need to know about the product',
        enabled: true
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
      } else if (item.type === 'faq') {
        image = 'auth/questionmark.svg';
      }
      return { ...item, image };
    });
  }

  getAddessList() {
    this.addressList = [
      {
        type: 'registered',
        title: 'Registered Office',
        address1List: [
          'C/O Gaussian Network Pvt. Ltd.',
          '4th Floor, 148 Jessore Road,',
          'Block A,South East Corner,',
          'Kolkata - 700074,',
          'West Bengal, India.'
        ]
      },
      {
        type: 'corporate',
        title: 'Corporate Office',
        address1List: [
          'C/O Gaussian Networks Pvt. Ltd.',
          '349, Shankar Chowk Rd,',
          'Phase II, Udyog Vihar,',
          'Gurugram - 122022,',
          'Haryana, India.'
        ]
      }
    ];
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

  copyToClipboard(copiedAddess: ContactAddress) {
    let copiedText: string = '';
    if (copiedAddess) {
      copiedText += copiedAddess.title;
      copiedAddess.address1List.forEach((address1: string) => {
        copiedText += `\n${address1}`;
      });
    }
    this.clipBoard.copy(copiedText);
    this.toastMessageShow(ContactUsConstants.successFlag, MessageConstant.CopyText);
  }

  toastMessageShow(flag: string, message: string) {
    this.isShowToast = true;
    this.toastValue = {
      message,
      flag
    };
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
