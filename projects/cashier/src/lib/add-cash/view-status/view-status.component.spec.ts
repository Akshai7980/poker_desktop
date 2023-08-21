import { Clipboard } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'projects/shared/src/lib/services/common.service';
import { of } from 'rxjs';
import { CashierService } from '../../services/cashier.service';
import { ViewStatusComponent } from './view-status.component';

describe('ViewStatusComponent', () => {
  let component: ViewStatusComponent;
  let fixture: ComponentFixture<ViewStatusComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockClipboard: jasmine.SpyObj<Clipboard>;
  let mockCommonService: jasmine.SpyObj<CommonService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const clipboardSpy = jasmine.createSpyObj('Clipboard', ['copy']);
    const cashierServiceSpy = jasmine.createSpyObj('CashierService', [
      'getPaymentTransactionStatus'
    ]);
    const commonServiceSpy = jasmine.createSpyObj('CommonService', ['clearFlow']);

    await TestBed.configureTestingModule({
      declarations: [ViewStatusComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Clipboard, useValue: clipboardSpy },
        { provide: CashierService, useValue: cashierServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map<string, string>().set('id', '123')) // Mock the ActivatedRoute paramMap with the required parameter 'id'
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStatusComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockClipboard = TestBed.inject(Clipboard) as jasmine.SpyObj<Clipboard>;
    mockCommonService = TestBed.inject(CommonService) as jasmine.SpyObj<CommonService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call `clearFlow` method from `CommonService` on component initialization', () => {
    fixture.detectChanges();
    expect(mockCommonService.clearFlow).toHaveBeenCalled();
  });

  it('should call `copy` from `Clipboard` when `copyToClipboard` method is called', () => {
    const copiedText = 'Some text to copy';
    component.copyToClipboard(copiedText);

    expect(mockClipboard.copy).toHaveBeenCalledWith(copiedText);
  });

  it('should navigate to `/addcash` when `onClickBack` method is called', () => {
    component.onClickBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/addcash']);
  });

  it('should navigate to `/addcash` when `retryPayment` method is called', () => {
    component.retryPayment();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/addcash']);
  });

  it('should remove dynamic path when `removeDynamicPath` method is called', () => {
    const inputUrl = 'http://example.com/addcash/payment-complete/123';
    const expectedUrl = 'http://example.com';
    const outputUrl = component.removeDynamicPath(inputUrl);
    expect(outputUrl).toBe(expectedUrl);
  });
});
