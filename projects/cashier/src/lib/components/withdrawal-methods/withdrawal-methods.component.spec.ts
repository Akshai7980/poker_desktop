import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { WithdrawalMethodsComponent } from './withdrawal-methods.component';

describe('WithdrawalMethodsComponent', () => {
  let component: WithdrawalMethodsComponent;
  let fixture: ComponentFixture<WithdrawalMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawalMethodsComponent],
      imports: [MatDialogModule, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedRadioIndex when ngOnChanges is called', () => {
    const bankListData = [{ isDefault: true }, { isDefault: false }, { isDefault: false }];

    component.bankListData = bankListData;
    component.ngOnChanges();
    expect(component.selectedRadioIndex).toBe('0');
  });

  it('should open add bank dialog when add() is called with "bank" value', () => {
    spyOn(component, 'openAddBankDialog').and.stub();
    component.add('bank');
    expect(component.openAddBankDialog).toHaveBeenCalled();
  });

  it('should open add upi dialog when add() is called with "upi" value', () => {
    spyOn(component, 'openAddUpiDialog').and.stub();
    component.add('upi');
    expect(component.openAddUpiDialog).toHaveBeenCalled();
  });

  it('should unsubscribe from subscriptions on ngOnDestroy()', () => {
    const subscription1 = new Subscription();
    const subscription2 = new Subscription();
    spyOn(subscription1, 'unsubscribe').and.stub();
    spyOn(subscription2, 'unsubscribe').and.stub();
    component.subscriptions = [subscription1, subscription2];

    component.ngOnDestroy();
    expect(subscription1.unsubscribe).toHaveBeenCalled();
    expect(subscription2.unsubscribe).toHaveBeenCalled();
  });
});
