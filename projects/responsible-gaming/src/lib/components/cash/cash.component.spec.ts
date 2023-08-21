import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, of } from 'rxjs';
import { CashComponent } from './cash.component';

describe('CashComponent', () => {
  let component: CashComponent;
  let fixture: ComponentFixture<CashComponent>;
  let mockDialog: Partial<MatDialog>;

  beforeEach(async () => {
    mockDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of('success')
      })
    };

    await TestBed.configureTestingModule({
      declarations: [CashComponent],
      providers: [FormBuilder, { provide: MatDialog, useValue: mockDialog }],
      imports: [HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe from all subscriptions on ngOnDestroy', () => {
    // Create some mock subscriptions
    const subscription1 = new Subscription();
    const subscription2 = new Subscription();
    const subscription3 = new Subscription();

    // Push the subscriptions into the component's subscriptions array
    component.subscriptions.push(subscription1, subscription2, subscription3);

    // Spy on the 'unsubscribe' method of each subscription
    spyOn(subscription1, 'unsubscribe');
    spyOn(subscription2, 'unsubscribe');
    spyOn(subscription3, 'unsubscribe');

    // Call ngOnDestroy to trigger the unsubscription
    component.ngOnDestroy();

    // Expect 'unsubscribe' to have been called on each subscription
    expect(subscription1.unsubscribe).toHaveBeenCalled();
    expect(subscription2.unsubscribe).toHaveBeenCalled();
    expect(subscription3.unsubscribe).toHaveBeenCalled();
  });
});
