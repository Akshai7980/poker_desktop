import { DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CashierService } from '../../services/cashier.service';
import { RedeemVoutcherOrScratchCardComponent } from './redeem-voutcher-or-scratch-card.component';

describe('RedeemVoutcherOrScratchCardComponent', () => {
  let component: RedeemVoutcherOrScratchCardComponent;
  let fixture: ComponentFixture<RedeemVoutcherOrScratchCardComponent>;
  let mockCashierService: jasmine.SpyObj<CashierService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<DialogRef<any>>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<RedeemVoutcherOrScratchCardComponent>>;

  beforeEach(() => {
    mockCashierService = jasmine.createSpyObj('CashierService', [
      'getFaqData',
      'verifyScratchCard',
      'toggleAnimationDialog'
    ]);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialogRef = jasmine.createSpyObj('DialogRef', ['close']);
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['']);
    TestBed.configureTestingModule({
      declarations: [RedeemVoutcherOrScratchCardComponent],
      imports: [ReactiveFormsModule, MatDialogModule],
      providers: [
        { provide: CashierService, useValue: mockCashierService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: MatDialogRef, useValue: mockMatDialogRef }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemVoutcherOrScratchCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should reset scratch card validation status on OnChangeCode', () => {
    component.isScratchCardValid = true;
    component.isValidCode = true;
    component.scratchCardInputStatus = 'success';

    component.OnChangeCode();

    expect(component.isScratchCardValid).toBe(false);
    expect(component.isValidCode).toBe(false);
    expect(component.scratchCardInputStatus).toBe('');
  });

  it('should unsubscribe from subscriptions on ngOnDestroy', () => {
    component.subscriptions.push(of().subscribe());
    component.subscriptions.push(of().subscribe());

    spyOn(component.subscriptions[0], 'unsubscribe');
    spyOn(component.subscriptions[1], 'unsubscribe');

    component.ngOnDestroy();

    expect(component.subscriptions[0].unsubscribe).toHaveBeenCalled();
    expect(component.subscriptions[1].unsubscribe).toHaveBeenCalled();
  });
});
