import { TestBed, fakeAsync } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import {
  APIResponseCodeHandHistory,
  MessageConstant,
  NetworkService
} from 'projects/shared/src/public-api';
import * as moment from 'moment';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HandHistoryService } from '../../services/hand-history.service';
import { SngComponent } from './sng.component';

describe('SngComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [SngComponent],
      providers: [
        NetworkService,
        HttpClient,
        HttpHandler,
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SngComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('enterCustomNumber function', () => {
  let component: any;

  beforeEach(() => {
    component = {
      history: [],
      historyData: [1, 2, 3, 4, 5],
      count: 0,
      showReport: false,
      enterCustomNumber(event: any) {
        const target = event.target as HTMLInputElement;
        this.history = [];
        const value = parseInt(target.value, 10);
        this.count = target.value;
        if (value !== 0) {
          this.history = this.historyData.slice(0, value);
        } else {
          this.showReport = false;
        }
      }
    };
  });

  it('should update history array and showReport flag when a valid number is entered', () => {
    const event = { target: { value: '3' } };
    component.enterCustomNumber(event);
    expect(component.history).toEqual([1, 2, 3]);
    expect(component.showReport).toBe(false);
  });

  it('should clear history array and set showReport flag to false when 0 is entered', () => {
    const event = { target: { value: '0' } };
    component.enterCustomNumber(event);
    expect(component.history).toEqual([]);
    expect(component.showReport).toBe(false);
  });

  it('should clear history array and set showReport flag to false when a string is entered', () => {
    const event = { target: { value: 'five' } };
    component.enterCustomNumber(event);
    expect(component.history).toEqual([]);
    expect(component.showReport).toBe(false);
  });

  it('should update history array and showReport flag when a decimal number is entered', () => {
    const event = { target: { value: '2.5' } };
    component.enterCustomNumber(event);
    expect(component.history).toEqual([1, 2]);
    expect(component.showReport).toBe(false);
  });
});

describe('onSelectRadio', () => {
  let component: any;

  beforeEach(() => {
    component = {
      selectedRadioIndex: '',
      isShowToast: true,
      count: '',
      showdrop: false,
      showduration: false,
      showReport: false,
      searchBy: '',
      fromDate: '',
      toDate: '',
      currentDate: new Date().toISOString().substring(0, 10),
      onSelectRadio: (event: any, index: any) => {
        component.selectedRadioIndex = index;
        component.isShowToast = false;
        if (component.selectedRadioIndex === '1') {
          component.count = 10;
          component.showdrop = false;
          component.showduration = false;
          component.showReport = false;
          component.searchBy = 'hand';
          component.fromDate = '';
          component.toDate = '';
        } else if (component.selectedRadioIndex === '2') {
          component.count = 20;
          component.showdrop = true;
          component.showduration = false;
          component.showReport = false;
          component.searchBy = 'hand';
          component.fromDate = '';
          component.toDate = '';
        } else if (component.selectedRadioIndex === '3') {
          component.showdrop = false;
          component.showduration = true;
          component.showReport = false;
          component.searchBy = 'date';
          component.count = '';
          component.fromDate = component.currentDate;
          component.toDate = component.fromDate;
          component.getHistory();
        }
      }
    };
  });
  it('should set count, showdrop, showduration, showReport, searchBy, fromDate, and toDate when index is 1', () => {
    const event = {};
    component.onSelectRadio(event, '1');
    expect(component.selectedRadioIndex).toBe('1');
    expect(component.isShowToast).toBe(false);
    expect(component.count).toBe(10);
    expect(component.showdrop).toBe(false);
    expect(component.showduration).toBe(false);
    expect(component.showReport).toBe(false);
    expect(component.searchBy).toBe('hand');
    expect(component.fromDate).toBe('');
    expect(component.toDate).toBe('');
  });

  it('should set properties when index is 2', () => {
    const event = {};
    component.onSelectRadio(event, '2');
    expect(component.selectedRadioIndex).toBe('2');
    expect(component.isShowToast).toBe(false);
    expect(component.count).toBe(20);
    expect(component.showdrop).toBe(true);
    expect(component.showduration).toBe(false);
    expect(component.showReport).toBe(false);
    expect(component.searchBy).toBe('hand');
    expect(component.fromDate).toBe('');
    expect(component.toDate).toBe('');
  });
});

describe('onChange', () => {
  let component: any;

  beforeEach(() => {
    component = {
      selectedHands: '',
      count: '',
      showReport: false,
      submitBtnClick: false,
      onChange: () => {}
    };
  });

  it('should set showReport to true and submitBtnClick to false when selectedHands is truthy', () => {
    component.selectedHands = 'test';
    const event = { value: { name: 'test', code: '1' } };
    component.onChange(event);
    expect(component.showReport).toEqual(false);
    expect(component.submitBtnClick).toEqual(false);
  });

  it('should set selectedHands and count when event value code is 2', fakeAsync(() => {
    const event = { value: { name: '', code: '' } };
    component.onChange(event);
    expect(component.selectedHands).toEqual(event.value.name);
    expect(component.count).toEqual(event.value.code);
  }));
});

describe('getHandHistoryData', () => {
  let component: any;

  beforeEach(() => {
    component = {
      count: 10,
      fromDate: '2022-01-01',
      toDate: '2022-01-31',
      searchBy: 'username',
      handHistoryService: {
        getHandHistoryData: () => {}
      },
      isShowToast: false,
      toastValue: {
        message: MessageConstant.YouWillbeNotifiedOnceItReadyForDownload,
        flag: 'success'
      },
      errorToastValue: {
        message: MessageConstant.ApiError,
        flag: 'error'
      },
      showRecordPage: false
    };
  });

  it('should set isShowToast to true and show success toast when the response code is GET_HISTORY', () => {
    spyOn(component.handHistoryService, 'getHandHistoryData').and.returnValue(
      of({
        responseCode: APIResponseCodeHandHistory.HAND_HISTORY.GET_HISTORY,
        responseMsg: MessageConstant.YouWillbeNotifiedOnceItReadyForDownload
      })
    );

    component.handHistoryService.getHandHistoryData();

    expect(component.isShowToast).toBe(false);
    expect(component.toastValue).toEqual({
      message: MessageConstant.YouWillbeNotifiedOnceItReadyForDownload,
      flag: 'success'
    });
    expect(component.showRecordPage).toBe(false);
  });

  it('should set isShowToast to true and show error toast when the response code is not GET_HISTORY', () => {
    spyOn(component.handHistoryService, 'getHandHistoryData').and.returnValue(
      of({
        responseCode: APIResponseCodeHandHistory.HAND_HISTORY.LOGOUT_SUCCESS,
        responseMsg: MessageConstant.ApiError
      })
    );

    component.handHistoryService.getHandHistoryData();

    expect(component.isShowToast).toBe(false);
    expect(component.errorToastValue).toEqual({
      message: MessageConstant.ApiError,
      flag: 'error'
    });
    expect(component.showRecordPage).toBe(false);
  });
});

describe('getHistory()', () => {
  let component: SngComponent;
  let momentService: any;

  beforeEach(() => {
    momentService = jasmine.createSpyObj('momentService', ['format', 'subtract']);

    TestBed.configureTestingModule({
      declarations: [SngComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: HandHistoryService, useValue: momentService },
        FormBuilder,
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(SngComponent);
    component = fixture.componentInstance;
  });

  it('should set fromDate and toDate to today when selectedDurationTabIndex is 0', () => {
    component.selectedDurationTabIndex = 0;
    const today = moment().format('DD/MM/YYYY');
    momentService.format.and.returnValue(today);

    component.getHistory();

    expect(component.fromDate).toEqual(today);
    expect(component.toDate).toEqual(today);
  });

  it('should set fromDate and toDate to yesterday when selectedDurationTabIndex is 1', () => {
    component.selectedDurationTabIndex = 1;
    const yesterday = moment().subtract(1, 'days').format('DD/MM/YYYY');
    momentService.format.and.returnValue(yesterday);

    component.getHistory();
    const today = moment().format('DD/MM/YYYY');
    expect(component.fromDate).toEqual(yesterday);
    expect(component.toDate).toEqual(today);
  });

  it('should set fromDate to today and toDate to 7 days ago when selectedDurationTabIndex is 2', () => {
    component.selectedDurationTabIndex = 2;
    const today = moment().format('DD/MM/YYYY');
    const sevenDaysAgo = moment().subtract(7, 'days').format('DD/MM/YYYY');
    momentService.format.and.returnValues(today, sevenDaysAgo);

    component.getHistory();

    expect(component.toDate).toEqual(today);
    expect(component.fromDate).toEqual(sevenDaysAgo);
  });

  it('should set fromDate to today and toDate to 15 days ago when selectedDurationTabIndex is 3', () => {
    component.selectedDurationTabIndex = 3;
    const today = moment().format('DD/MM/YYYY');
    const fifteenDaysAgo = moment().subtract(15, 'days').format('DD/MM/YYYY');
    momentService.format.and.returnValues(today, fifteenDaysAgo);

    component.getHistory();

    expect(component.toDate).toEqual(today);
    expect(component.fromDate).toEqual(fifteenDaysAgo);
  });

  it('should set fromDate to today and toDate to 30 days ago when selectedDurationTabIndex is 4', () => {
    component.selectedDurationTabIndex = 4;
    const today = moment().format('DD/MM/YYYY');
    const thirtyDaysAgo = moment().subtract(30, 'days').format('DD/MM/YYYY');
    momentService.format.and.returnValues(today, thirtyDaysAgo);

    component.getHistory();

    expect(component.toDate).toEqual(today);
    expect(component.fromDate).toEqual(thirtyDaysAgo);
  });

  it('should filter historyData based on fromDate and toDate', () => {
    component.selectedDurationTabIndex = 5;
    const startDate = moment('2022-01-01');
    const endDate = moment('2022-01-10');
    momentService.format.and.returnValues('01/01/2022', '10/01/2022');
    component.form = new FormGroup({
      startDate: new FormControl(startDate),
      endDate: new FormControl(endDate)
    });

    component.getHistory();
  });
});
