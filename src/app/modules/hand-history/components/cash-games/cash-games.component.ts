import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { SelectItem } from 'primeng/api';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { SocketCommService } from 'projects/shared/src/lib/services/socket-comm.service';
import { Subscription } from 'rxjs';
import {
  APIResponseCodeHandHistory,
  BaseResponse,
  FLAG,
  HandHistoryConstants,
  MAX_VALUE,
  MessageConstant,
  Paths
} from 'projects/shared/src/public-api';

import { HandHistoryListResponse } from '../../models/response/hand-history-list.response';
import { NewUserResponse } from '../../models/response/new-user.response.model';
import { CashGamesModel } from '../../models/view-models/cash-games-model';
import { HandHistoryService } from '../../services/hand-history.service';

@Component({
  selector: 'app-cash-games',
  templateUrl: './cash-games.component.html'
})
export class CashGamesComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-auto';

  assetsImagePath = Paths.imagePath;

  isShowToast: boolean = false;

  toastValue: ToastModel;

  form: FormGroup = new FormGroup({});

  selectedCity: { name: string; code: string };

  maxValue = MAX_VALUE;

  showReport: boolean = true;

  showdrop: boolean = false;

  showduration: boolean = false;

  dropdownclick: boolean = false;

  selectedHands: string = '';

  selectHand: { name: ''; code: '' };

  selectduration: { name: ''; code: '' };

  customBtnClicked: boolean = true;

  todayBtnClicked: boolean = false;

  yestBtnClicked: boolean = false;

  sevenBtnClicked: boolean = false;

  fiftnBtnClicked: boolean = false;

  thirtyBtnClicked: boolean = false;

  submitBtnClick: boolean = true;

  handHistoryList: HandHistoryListResponse[] = [];

  @Output() selectEmitter = new EventEmitter();

  @Output() onbtnSelect = new EventEmitter();

  hands: { name: string; code: string }[];

  showProcessing: boolean = false;

  cashGamesForm: FormGroup = new FormGroup({});

  showRecordPage: boolean = true;

  cashGamesModel: CashGamesModel;

  enteredNumber: number;

  date = new Date();

  myForm: FormGroup;

  count: number | string = 10;

  currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  fromDate: any = '';

  toDate: any = '';

  searchBy: string = 'hand';

  maxDate = new Date();

  sixMonthsAgo = new Date();

  minDate = this.sixMonthsAgo.setDate(this.sixMonthsAgo.getDate() - 180);

  customValue: number;

  selectedFileName: string = '';

  selectedIndex: number;

  isProcessing: boolean = false;

  isDownload: boolean = true;

  subscriptions: Subscription[] = [];

  @ViewChild('picker') datePicker: MatDateRangePicker<Date>;

  processingList: HandHistoryListResponse[] = [];

  newUserData: NewUserResponse;

  showEmptyScreen: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private handHistoryService: HandHistoryService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private readonly socketCommService: SocketCommService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      startDate: new FormControl<Date | null>(null, Validators.required),
      endDate: new FormControl<Date | null>(null, Validators.required)
    });

    this.myForm = this.formBuilder.group({
      selectedValue: ['', Validators.required],
      customValue: []
    });

    this.cashGamesForm = this.formBuilder.group({
      quickReport: [],
      numberOfHands: [],
      duration: []
    });

    this.getNewUser();
    this.getHandHistoryListData();

    this.hands = HandHistoryConstants.hands;

    [this.selectedCity] = this.hands;

    this.socketCommService.socketCommandSubject.subscribe((event: any) => {
      if (event.cmd === 'onAdminmessage') {
        if (event.params.msgType === 'HAND_HISTORY') {
          this.processingList.splice(event.params.fileName);
          this.getHandHistoryListData();
        }
      }
    });
  }

  onChange(event: SelectItem) {
    this.selectedHands = event.value.name;
    switch (event.value.code) {
      case '1':
        this.count = 20;
        break;
      case '2':
        this.count = 50;
        break;
      case '3':
        this.count = 100;
        break;
      case '4': {
        this.count = 1;
        const customFieldVar = setTimeout(() => {
          const element = this.elementRef.nativeElement.querySelector('#cashgames-custom-input');
          this.renderer.selectRootElement(element).focus();
          clearTimeout(customFieldVar);
        }, 10);
        break;
      }
      default:
        break;
    }

    if (this.selectedHands) {
      this.showReport = true;
      this.submitBtnClick = false;
    }
  }

  onProcess(type: string, index: number, s3FilePath: string) {
    this.selectedFileName = type;
    this.selectedIndex = index;
    if (this.selectedIndex === index) {
      this.isProcessing = true;
      this.isDownload = false;
      this.downloadFile(s3FilePath, this.selectedFileName);
    } else {
      this.isProcessing = false;
    }
  }

  durationTabList = HandHistoryConstants.durationTabList;

  selectedDurationTabIndex: number = this.durationTabList[0].tabIndex;

  onSelectDTab(index: number) {
    if (index === 5) {
      const datePickerOpenVar = setTimeout(() => {
        this.datePicker.open();
        clearTimeout(datePickerOpenVar);
      }, 0);
    }
    if (index !== 5) {
      this.form.reset();
    }
    this.selectedDurationTabIndex = index;
    this.fromDate = this.currentDate;
    this.getHistory();
  }

  selectedRadioIndex: string = '1';

  onSelectRadio(event: Event, index: string) {
    this.getHandHistoryListData();
    this.selectedRadioIndex = index;
    this.isShowToast = false;

    switch (this.selectedRadioIndex) {
      case '1':
        this.count = 10;
        this.showdrop = false;
        this.showduration = false;
        this.showReport = true;
        this.searchBy = 'hand';
        this.fromDate = '';
        this.toDate = '';
        break;

      case '2':
        [this.selectedCity] = this.hands;
        this.selectedHands = '';
        this.count = 20;
        this.showdrop = true;
        this.showduration = false;
        this.showReport = true;
        this.searchBy = 'hand';
        this.fromDate = '';
        this.toDate = '';
        break;

      case '3':
        this.selectedDurationTabIndex = this.durationTabList[0].tabIndex;
        this.showdrop = false;
        this.showduration = true;
        this.showReport = true;
        this.searchBy = 'date';
        this.count = '';
        this.fromDate = this.currentDate;
        this.toDate = this.fromDate;
        this.getHistory();
        break;

      default:
        break;
    }
  }

  getHandHistoryData() {
    if (
      this.count.toString() === '0' ||
      this.count.toString() === '01' ||
      this.count.toString() === '001'
    ) {
      this.count = 1;
    }
    const getHandHistoryData = this.handHistoryService
      .getHandHistoryData(this.count, this.fromDate, this.toDate, this.searchBy)
      .subscribe((resp: any) => {
        if (resp.code === APIResponseCodeHandHistory.HAND_HISTORY.LOGOUT_SUCCESS) {
          this.processingList.push(resp.data);
          this.showReport = true;

          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.YouWillbeNotifiedOnceItReadyForDownload,
            flag: 'success'
          };

          this.showRecordPage = true;
        } else {
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.NoHistoryFoundForDuration,
            flag: 'error'
          };

          this.showRecordPage = true;
        }
      });
    this.subscriptions.push(getHandHistoryData);
  }

  getHistory() {
    if (this.selectedDurationTabIndex === 0) {
      this.fromDate = moment().format('DD/MM/YYYY');
      this.toDate = this.fromDate;
    } else if (this.selectedDurationTabIndex === 1) {
      this.toDate = moment().format('DD/MM/YYYY');
      this.fromDate = moment().subtract(1, 'days').format('DD/MM/YYYY');
    } else if (this.selectedDurationTabIndex === 2) {
      this.toDate = moment().format('DD/MM/YYYY');
      this.fromDate = moment().subtract(7, 'days').format('DD/MM/YYYY');
    } else if (this.selectedDurationTabIndex === 3) {
      this.toDate = moment().format('DD/MM/YYYY');
      this.fromDate = moment().subtract(15, 'days').format('DD/MM/YYYY');
    } else if (this.selectedDurationTabIndex === 4) {
      this.toDate = moment().format('DD/MM/YYYY');
      this.fromDate = moment().subtract(30, 'days').format('DD/MM/YYYY');
    } else if (this.selectedDurationTabIndex === 5) {
      this.fromDate = moment(this.form.controls['startDate'].value).format('DD/MM/YYYY');
      this.toDate = moment(this.form.controls['endDate'].value).format('DD/MM/YYYY');
    }
  }

  enterCustomNumber(event: Event) {
    const target = event.target as HTMLInputElement;
    if (
      target.value.toString() === '0' ||
      target.value.toString() === '01' ||
      target.value.toString() === '001'
    ) {
      this.count = 1;
    }
  }

  getHandHistoryListData() {
    const handHistoryList$ = this.handHistoryService.getHandHistoryListData('REAL');
    const handHistorySubscription: Subscription = handHistoryList$.subscribe({
      next: (res: BaseResponse<HandHistoryListResponse[]>) => {
        this.handHistoryList = res.data;
        this.showReport = this.handHistoryList.length > 0;
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ErrorHandHistory,
          flag: 'error'
        };
      }
    });
    this.subscriptions.push(handHistorySubscription);
  }

  downloadFile(s3FilePath: string, fileName: string) {
    const url = s3FilePath;
    const download = this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
      const timeoutId = setTimeout(() => {
        this.isProcessing = false;
        this.isDownload = true;
        clearTimeout(timeoutId);
      }, 1000);
    });
    this.subscriptions.push(download);
  }

  getNewUser() {
    const getNewUser$ = this.handHistoryService.getNewUser();
    const getNewUser: Subscription = getNewUser$.subscribe({
      next: (res: BaseResponse<NewUserResponse>) => {
        if (res.code === APIResponseCodeHandHistory.HAND_HISTORY.LOGOUT_SUCCESS) {
          this.newUserData = res.data;
          if (this.newUserData.cash === FLAG.false) {
            this.showEmptyScreen = false;
          } else {
            this.showEmptyScreen = true;
          }
        }
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ApiError,
          flag: 'error'
        };
      }
    });
    this.subscriptions.push(getNewUser);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
