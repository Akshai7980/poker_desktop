import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { RegistrationSuccessfulComponent } from './registration-successful.component';

describe('RegistrationSuccessfulComponent', () => {
  let component: RegistrationSuccessfulComponent;
  let fixture: ComponentFixture<RegistrationSuccessfulComponent>;
  let authService: AuthService;
  let localStorage: LocalStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationSuccessfulComponent],
      providers: [AuthService, LocalStorageService],
      imports: [HttpClientModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSuccessfulComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    localStorage = TestBed.inject(LocalStorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize bonus details on authService subscription', () => {
    const mockBonusDetails = {
      bonus: 2000,
      ib: 100,
      bb: 300,
      sngTicket: 2,
      freeRoll: 38000
    };
    authService.bonusDetails.next(mockBonusDetails);
    expect(localStorage.getItem('bonusInfo')).toEqual(mockBonusDetails);
    expect(component.bonus).toEqual(mockBonusDetails.bonus);
    expect(component.ib).toEqual(mockBonusDetails.ib);
    expect(component.bb).toEqual(mockBonusDetails.bb);
    expect(component.sngTickets).toEqual(mockBonusDetails.sngTicket);
    expect(component.freeRollChips).toEqual(mockBonusDetails.freeRoll);
  });
});
