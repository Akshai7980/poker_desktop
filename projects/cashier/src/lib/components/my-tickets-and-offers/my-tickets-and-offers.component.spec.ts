import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MyTicketsAndOffersComponent } from './my-tickets-and-offers.component';
import { CashierService } from '../../services/cashier.service';

describe('MyTicketsAndOffersComponent', () => {
  let component: MyTicketsAndOffersComponent;
  let fixture: ComponentFixture<MyTicketsAndOffersComponent>;
  let mockCashierService: jasmine.SpyObj<CashierService>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<MyTicketsAndOffersComponent>>;

  beforeEach(async () => {
    mockCashierService = jasmine.createSpyObj('CashierService', [
      'getTicketInfo',
      'toggleAnimationDialog'
    ]);
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [MyTicketsAndOffersComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { totalAmount: 0 } },
        { provide: CashierService, useValue: mockCashierService },
        { provide: MatDialogRef, useValue: mockMatDialogRef }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTicketsAndOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update selectedTab and call the appropriate methods based on the selected tab', () => {
    spyOn(component, 'getTicketInfo');
    spyOn(component, 'getTicketOffers');

    component.onSelectTab('My Tickets');

    expect(component.selectedTab).toEqual('My Tickets');

    expect(component.getTicketInfo).toHaveBeenCalled();

    component.onSelectTab('My Offers');

    expect(component.selectedTab).toEqual('My Offers');

    expect(component.getTicketOffers).toHaveBeenCalled();
  });

  it('should close all dialogs when onBack is called', () => {
    const dialogCloseAllSpy = spyOn(component.dialog, 'closeAll');

    component.onBack();

    expect(dialogCloseAllSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions when ngOnDestroy is called', () => {
    const subscription1 = new Subscription();
    const subscription2 = new Subscription();

    component.subscriptions = [subscription1, subscription2];

    const unsubscribeSpy1 = spyOn(subscription1, 'unsubscribe');
    const unsubscribeSpy2 = spyOn(subscription2, 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy1).toHaveBeenCalled();
    expect(unsubscribeSpy2).toHaveBeenCalled();
  });
});
