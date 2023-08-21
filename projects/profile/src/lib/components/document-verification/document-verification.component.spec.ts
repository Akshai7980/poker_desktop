import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatStepper } from '@angular/material/stepper';
import { ProfileService } from '../../services/profile.service';
import { DocumentVerificationComponent } from './document-verification.component';

describe('DocumentVerificationComponent', () => {
  let component: DocumentVerificationComponent;
  let fixture: ComponentFixture<DocumentVerificationComponent>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;

  const mockMatStepperRef = jasmine.createSpyObj('MatStepper', ['next']);

  beforeEach(async () => {
    profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getKycDetails']);

    await TestBed.configureTestingModule({
      declarations: [DocumentVerificationComponent],
      providers: [
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: MatStepper, useValue: mockMatStepperRef }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentVerificationComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tabs and select first tab on initialization', () => {
    fixture.detectChanges();

    expect(component.tabs).toEqual([
      {
        tabIndex: 0,
        label: 'PAN',
        verified: false
      },
      {
        tabIndex: 1,
        label: 'KYC',
        verified: false
      },
      {
        tabIndex: 2,
        label: 'SELFIE',
        verified: false
      }
    ]);
    expect(component.selectedTabIndex).toBe(0);
  });
});
