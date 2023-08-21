import { DialogRef } from '@angular/cdk/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';

import { ProfileService } from '../../services/profile.service';
import { PersonalDetailsComponent } from './personal-details.component';

import '@angular/localize/init';

describe('PersonalDetailsComponent', () => {
  let component: PersonalDetailsComponent;
  let fixture: ComponentFixture<PersonalDetailsComponent>;
  let stepperSpy: jasmine.SpyObj<MatStepper>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<PersonalDetailsComponent>>;

  beforeEach(async () => {
    stepperSpy = jasmine.createSpyObj('MatStepper', ['next']);
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    profileServiceSpy = jasmine.createSpyObj('ProfileService', [
      'createNewProfile',
      'toggleAnimationDialog'
    ]);
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['']);
    await TestBed.configureTestingModule({
      declarations: [PersonalDetailsComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatTooltipModule,
        HttpClientModule,
        MatDialogModule
      ],
      providers: [
        FormBuilder,
        { provide: MatStepper, useValue: stepperSpy },
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: DialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture1 = TestBed.createComponent(PersonalDetailsComponent);
    const app = fixture1.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call the profile service to create a new profile on initialization', () => {
    component.ngOnInit();
    expect(profileServiceSpy.createNewProfile).toHaveBeenCalled();
  });

  it('should set the otp value and show the otp button when otp is 6 digits long', () => {
    const otp = '123456';
    expect(otp);
    expect(component.showOtpButton).toBe(false);
  });

  it('should not set the otp value or show the otp button when otp is less than 6 digits long', () => {
    const otp = '12345';
    const value = 'email';
    component.onOtpChange(otp, value);
    expect(component.showOtpButton).toBe(false);
  });

  it('should not set the otp value or show the otp button when otp is more than 6 digits long', () => {
    const otp = '123';
    const value = 'email';
    component.onOtpChange(otp, value);
    expect(component.showOtpButton).toBe(false);
  });

  it('toChangeEntry should set isEmailIdVerify and isVerifyAlternateMobile to false', () => {
    component.isEmailIdVerify = true;
    component.isVerifyAlternateMobile = true;
    const from = '';
    component.toChangeEntry(from);
    expect(component.isEmailIdVerify).toBe(false);
    expect(component.isVerifyAlternateMobile).toBe(false);
  });

  it('should update selectedGender and personalDetailsForm control', () => {
    const component1 = fixture.componentInstance;
    const mockEvent = { value: { code: 'M' } };
    const formControlSpy = spyOn(component1.personalDetailsForm.controls['gender'], 'setValue');
    expect(mockEvent);
    expect(formControlSpy);
  });

  it('should mask the entered content correctly', () => {
    const content = 'john.doe@example.com';
    const maskedContent = component.maskEnteredContent(content);
    expect(maskedContent).toBe('jo***doe@example.com');
  });
});
