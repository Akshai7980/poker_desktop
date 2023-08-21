import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageConstant } from 'projects/shared/src/public-api';
import { of } from 'rxjs';
import { CustomBaseResponse } from '../../models/common/custom-base-response.model';
import { VerifyEnteredOtpResponse } from '../../models/response/verify-entered-otp.response.model';
import { ResponsibleGameService } from '../../services/responsible-game.service';
import { RestrictTableLimitComponent } from './restrict-table-limit.component';
import { RG_CASH_TAB } from '../../constants/app-constants';

describe('RestrictTableLimitComponent', () => {
  let component: RestrictTableLimitComponent;
  let fixture: ComponentFixture<RestrictTableLimitComponent>;
  let mockDialogRef: Partial<MatDialogRef<RestrictTableLimitComponent>>;
  let mockResponsibleGameService: Partial<ResponsibleGameService>;

  const mockData = {
    from: RG_CASH_TAB.CASH_LABEL,
    details: [
      {
        blinds: 'Blinds 5/10',
        duration: '15 Days',
        gameVariant: 'PLO5'
      },
      {
        blinds: 'Blinds 0.10/0.25',
        duration: '12 Hours',
        gameVariant: 'PLO'
      }
    ]
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jasmine.createSpy('close')
    };
    mockResponsibleGameService = {
      toSendConfirmationOtp: jasmine.createSpy('toSendConfirmationOtp').and.returnValue(
        of({
          code: 'SUCCESS',
          message: MessageConstant.OtpSendSuccessfully
        } as unknown as CustomBaseResponse<any>)
      ),
      verifyEnteredOtp: jasmine.createSpy('verifyEnteredOtp').and.returnValue(
        of({
          respCode: 'SUCCESS',
          respData: {
            code: 'VALID_OTP'
          } as unknown as VerifyEnteredOtpResponse
        } as unknown as CustomBaseResponse<VerifyEnteredOtpResponse>)
      )
    };

    await TestBed.configureTestingModule({
      declarations: [RestrictTableLimitComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ResponsibleGameService, useValue: mockResponsibleGameService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RestrictTableLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
