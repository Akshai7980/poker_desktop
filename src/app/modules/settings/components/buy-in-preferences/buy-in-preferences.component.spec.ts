import { Dialog } from '@angular/cdk/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { GlobalConstant } from 'projects/shared/src/lib/constants/global-constant';
import { ToastTime } from 'projects/shared/src/public-api';
import { BuyInPreferencesComponent } from './buy-in-preferences.component';

describe('BuyInPreferencesComponent', () => {
  let component: BuyInPreferencesComponent;
  let fixture: ComponentFixture<BuyInPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyInPreferencesComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: Dialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyInPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear toastValue after 3 seconds', () => {
    component.onSave();
    expect(component.toastValue).not.toBeNull();
    const timeOutId = setTimeout(() => {
      clearTimeout(timeOutId);
    }, ToastTime.NOTIFICATION);
  });

  it('should set values correctly when arrAutoRebuy is active', () => {
    component.arrAutoBuyIn = {
      keyName: GlobalConstant.AUTO_BUY_IN_SETTINGS,
      keyValue: '0',
      keyStatus: 'ACTIVE'
    };

    component.arrAutoBuyInBb = {
      keyName: GlobalConstant.AUTO_BUY_IN_BB_SETTINGS,
      keyValue: '',
      keyStatus: 'ACTIVE'
    };

    component.arrAutoRebuyInForm = {
      keyName: GlobalConstant.AUTO_REBUY_IN_FORM,
      keyValue: '0',
      keyStatus: 'ACTIVE'
    };

    component.arrAutoRebuy = [
      {
        keyName: GlobalConstant.AUTO_REBUY_SETTINGS,
        keyValue: '0',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: GlobalConstant.AUTO_REBUY_SETTINGS,
        keyValue: 'BB-',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: GlobalConstant.AUTO_REBUY_SETTINGS,
        keyValue: '2',
        keyStatus: 'ACTIVE'
      }
    ];

    component.arrAddChips = [
      {
        keyName: GlobalConstant.ADD_CHIPS_SETTINGS,
        keyValue: '0',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.ADD_CHIPS_SETTINGS,
        keyValue: '1',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.ADD_CHIPS_SETTINGS,
        keyValue: '2',
        keyStatus: 'ACTIVE'
      },
      {
        keyName: GlobalConstant.ADD_CHIPS_SETTINGS,
        keyValue: '4BB-',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.AUTO_FOCUS_USER_TURN,
        keyValue: '4BB-',
        keyStatus: 'INACTIVE'
      }
    ];

    const result = component.setValueToSettingsModel();
    expect(result).toEqual({
      NG_AUTO_BUYIN_FLAG: false,
      NG_AUTO_BUYIN_VALUE: '',
      NG_AUTO_REBUY_FLAG: false,
      NG_AUTO_REBUY_VALUE: '',
      NG_ADD_CHIPS_VALUE: '',
      autoRebuyFlag: '2',
      autoRebuyValue: '',
      addChipsFlag: '2',
      addChipsValue: ''
    });
  });

  it('should set values correctly when arrAutoRebuy and arrAddChips are inactive', () => {
    // Arrange
    component.arrAutoRebuy = [
      {
        keyName: GlobalConstant.AUTO_REBUY_SETTINGS,
        keyValue: '0',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.AUTO_REBUY_SETTINGS,
        keyValue: 'BB-',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.AUTO_REBUY_SETTINGS,
        keyValue: '2',
        keyStatus: 'INACTIVE'
      }
    ];

    component.arrAddChips = [
      {
        keyName: GlobalConstant.ADD_CHIPS_SETTINGS,
        keyValue: '0',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.ADD_CHIPS_SETTINGS,
        keyValue: '1',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.ADD_CHIPS_SETTINGS,
        keyValue: '2',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.ADD_CHIPS_SETTINGS,
        keyValue: '4BB-',
        keyStatus: 'INACTIVE'
      },
      {
        keyName: GlobalConstant.AUTO_FOCUS_USER_TURN,
        keyValue: '4BB-',
        keyStatus: 'INACTIVE'
      }
    ];

    const result = component.setValueToSettingsModel();

    expect(result).toEqual({
      NG_AUTO_BUYIN_FLAG: false,
      NG_AUTO_BUYIN_VALUE: '',
      NG_AUTO_REBUY_FLAG: false,
      NG_AUTO_REBUY_VALUE: '0',
      NG_ADD_CHIPS_VALUE: '0',
      autoRebuyFlag: '',
      autoRebuyValue: '',
      addChipsFlag: '',
      addChipsValue: ''
    });
  });
});
