import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BaseResponse, CurrencyFormatPipe } from 'projects/shared/src/public-api';
import { Subscription, of } from 'rxjs';

import { DailyLimitComponent } from '../../dialogs/daily-limit/daily-limit.component';
import { PerTransactionLimitComponent } from '../../dialogs/per-transaction-limit/per-transaction-limit.component';
import { WeeklyLimitComponent } from '../../dialogs/weekly-limit/weekly-limit.component';
import { ResponsibleGameService } from '../../services/responsible-game.service';
import { DepositLimitComponent } from './deposit-limit.component';
import { RESPONSIBLE_GAMING } from '../../constants/app-constants';
import { UserDepositHistoryResponseModel } from '../../models/response/user-deposit-history.response.model';

describe('DepositLimitComponent', () => {
  let component: DepositLimitComponent;
  let fixture: ComponentFixture<DepositLimitComponent>;
  let mockResponsibleGameService: jasmine.SpyObj<ResponsibleGameService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockResponsibleGameService = jasmine.createSpyObj('mockResponsibleGameService', [
      'getRestrictTableTab',
      'getUserDepositHistory'
    ]);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      declarations: [
        DepositLimitComponent,
        PerTransactionLimitComponent,
        DailyLimitComponent,
        WeeklyLimitComponent,
        CurrencyFormatPipe
      ],
      imports: [ReactiveFormsModule, FormsModule, MatDialogModule, BrowserAnimationsModule],
      providers: [
        { provide: ResponsibleGameService, useValue: mockResponsibleGameService },
        { provide: MatDialog, useValue: matDialogSpy },
        FormBuilder,
        HttpHandler,
        HttpClient
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.depositLimitForm.get('periods')).toBeTruthy();
    expect(component.depositLimitForm.get('periods')?.value).toBe('');
  });

  it('should initialize depositLimitForm', () => {
    component.ngOnInit();
    expect(component.depositLimitForm.get('periods')).toBeTruthy();
  });

  it('should call getUserDepositHistory on ngOnInit', () => {
    const mockResponse: BaseResponse<UserDepositHistoryResponseModel> = {
      code: RESPONSIBLE_GAMING.SUCCESS,
      data: {} as UserDepositHistoryResponseModel,
      message: ''
    };

    mockResponsibleGameService.getUserDepositHistory.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(mockResponsibleGameService.getUserDepositHistory).toHaveBeenCalled();
    expect(component.remainingData).toEqual(mockResponse.data);
  });

  it('should unsubscribe from subscriptions on component destroy', () => {
    const mockSubscription: Subscription = of().subscribe();
    spyOn(mockSubscription, 'unsubscribe').and.callThrough();
    component.subscriptions.push(mockSubscription);

    component.ngOnDestroy();

    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });
});
