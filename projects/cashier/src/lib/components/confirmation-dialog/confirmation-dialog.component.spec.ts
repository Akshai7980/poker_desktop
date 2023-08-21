import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BaseResponse } from 'projects/shared/src/public-api';
import { of } from 'rxjs';
import { CashierService } from '../../services/cashier.service';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;
  let mockCashierService: jasmine.SpyObj<CashierService>;

  beforeEach(async () => {
    const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const cashierServiceSpy = jasmine.createSpyObj('CashierService', [
      'getPurchaseNowSufficientBalance'
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule],
      declarations: [ConfirmationDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: CashierService, useValue: cashierServiceSpy }
      ]
    }).compileComponents();

    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<ConfirmationDialogComponent>
    >;
    mockCashierService = TestBed.inject(CashierService) as jasmine.SpyObj<CashierService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when dialogClose() is called', () => {
    component.dialogClose();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call getPurchaseNowSufficientBalance and close the dialog with the result when getPurchaseWithSufficientBalance() is called', () => {
    const offerId = 'someOfferId';
    const mockResponse: BaseResponse<any> = {
      code: 200,
      data: 'mock data',
      message: 'Success'
    };

    mockCashierService.getPurchaseNowSufficientBalance.and.returnValue(of(mockResponse));

    component.data = { offerId };
    component.getPurchaseWithSufficientBalance();

    expect(mockCashierService.getPurchaseNowSufficientBalance).toHaveBeenCalledWith(offerId);

    expect(mockDialogRef.close).toHaveBeenCalledWith(mockResponse);
  });
});
