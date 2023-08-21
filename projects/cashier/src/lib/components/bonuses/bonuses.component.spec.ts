import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BaseResponse, MessageConstant } from 'projects/shared/src/public-api';
import { Subscription, of, throwError } from 'rxjs';
import { SpecConstant } from 'projects/shared/src/lib/constants/spec.constants';
import { BonusInfoData } from '../../models/response/bonusInfoResponse.model';
import { CashierService } from '../../services/cashier.service';
import { BonusPoints, BonusesComponent } from './bonuses.component';

describe('BonusesComponent', () => {
  let component: BonusesComponent;
  let fixture: ComponentFixture<BonusesComponent>;
  let mockCashierService: jasmine.SpyObj<CashierService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<BonusesComponent>>;

  beforeEach(() => {
    mockCashierService = jasmine.createSpyObj('CashierService', [
      'getBonusesInfo',
      'toggleAnimationDialog'
    ]);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['backdropClick']);

    TestBed.configureTestingModule({
      declarations: [BonusesComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: CashierService, useValue: mockCashierService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: MatDialogRef, useValue: mockMatDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BonusesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and set bonus points on initialization', () => {
    const { bonusData } = SpecConstant.cashier.requests;
    const bonusDataResponse: BaseResponse<any> = {
      code: 200,
      data: {
        pageData: {
          ibInfo: [bonusData.instantPoint1, bonusData.instantPoint2],
          tbInfo: [bonusData.tournamentPoint1, bonusData.tournamentPoint2],
          boosterBonusInfo: [bonusData.boosterPoint1, bonusData.boosterPoint2],
          freerollInfo: [bonusData.freeRoll]
        }
      },
      message: ''
    };

    mockCashierService.getBonusesInfo.and.returnValue(of(bonusDataResponse));

    fixture.detectChanges();

    expect(component.instantBonus).toEqual({
      title: bonusData.instant,
      points: [bonusData.instantPoint1, bonusData.instantPoint2]
    } as BonusPoints);

    expect(component.tournamentBonus).toEqual({
      title: bonusData.tournament,
      points: [bonusData.tournamentPoint1, bonusData.tournamentPoint2]
    } as BonusPoints);

    expect(component.boosterBonus).toEqual({
      title: bonusData.booster,
      points: [bonusData.boosterPoint1, bonusData.boosterPoint2]
    } as BonusPoints);

    expect(component.freeChips).toEqual({
      title: bonusData.freeChips,
      points: [bonusData.freeRoll]
    } as BonusPoints);
  });

  it('should display error toast on service call failure', () => {
    const bonusDataErrorResponse: BaseResponse<any> = {
      code: 500,
      data: null,
      message: MessageConstant.SomeThingWentWrong
    };

    mockCashierService.getBonusesInfo.and.returnValue(throwError(bonusDataErrorResponse));

    fixture.detectChanges();

    expect(component.isShowToast).toBe(true);
    expect(component.toastValue.message).toBe(MessageConstant.SomeThingWentWrong);
    expect(component.toastValue.flag).toBe('error');
  });

  it('should close all dialogs on "onBack" method call', () => {
    component.onBack();

    expect(mockMatDialog.closeAll).toHaveBeenCalled();
  });

  it('should unsubscribe from subscriptions on ngOnDestroy', () => {
    const mockSubscription = jasmine.createSpyObj<Subscription>('Subscription', ['unsubscribe']);
    component.subscriptions = [mockSubscription];
    component.ngOnDestroy();
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should display bonuses information on successful service call', () => {
    const { bonusData } = SpecConstant.cashier.requests;
    const bonusDataResponse: BaseResponse<BonusInfoData> = {
      code: 200,
      data: {
        pageData: {
          ibInfo: [bonusData.instantPoint1, bonusData.instantPoint2],
          tbInfo: [bonusData.tournamentPoint1, bonusData.tournamentPoint2],
          boosterBonusInfo: [bonusData.boosterPoint1, bonusData.boosterPoint2],
          freerollInfo: [bonusData.freeChipsPoint1],
          HoldAmountInfo: [],
          investmentConsideredCallout: '',
          isTBVisible: '',
          isVipPartialEnable: '',
          nonTaxedWinningsCallout: '',
          pokerWalletInfo: [],
          realToVip: [],
          tdsInfo: [],
          tdsLiabilitiesCallout: '',
          vipChipsInfo: [],
          vipToReal: []
        }
      },
      message: 'Success'
    };

    mockCashierService.getBonusesInfo.and.returnValue(of(bonusDataResponse));

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.instantBonus).toEqual({
      title: bonusData.instant,
      points: [bonusData.instantPoint1, bonusData.instantPoint2]
    });

    expect(component.tournamentBonus).toEqual({
      title: bonusData.tournament,
      points: [bonusData.tournamentPoint1, bonusData.tournamentPoint2]
    });

    expect(component.boosterBonus).toEqual({
      title: bonusData.booster,
      points: [bonusData.boosterPoint1, bonusData.boosterPoint2]
    });

    expect(component.freeChips).toEqual({
      title: bonusData.freeChips,
      points: [bonusData.freeChipsPoint1]
    });

    expect(component.isShowToast).toBe(false);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
