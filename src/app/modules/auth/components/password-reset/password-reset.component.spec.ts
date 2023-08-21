import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OverlayModule } from 'primeng/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasswordResetModel } from 'projects/shared/src/public-api';
import { PasswordResetComponent } from './password-reset.component';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordResetComponent],
      providers: [MatDialog, { provide: MatDialogRef, useValue: {} }],
      imports: [MatDialogModule, OverlayModule, HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    expect(component.resetPasswordModel).toEqual(new PasswordResetModel('', ''));
    expect(component.newPasswordType).toBe('text');
    expect(component.confirmPasswordType).toBe('password');
    expect(component.newPasswordEyeImagePath).toBe('auth/password-eye.svg');
    expect(component.confirmPasswordEyeImagePath).toBe('auth/password-eye-slash.svg');
    expect(component.enableConfirmBtn).toBe(false);
    expect(component.isShowToast).toBe(false);
    expect(component.showStatusText).toBe(false);
  });

  it('should switch password visibility', () => {
    component.showNewPassword();
    expect(component.newPasswordType).toBe('password');
    expect(component.newPasswordEyeImagePath).toBe('auth/password-eye-slash.svg');
    component.showNewPassword();
    expect(component.newPasswordType).toBe('text');
    expect(component.newPasswordEyeImagePath).toBe('auth/password-eye.svg');
  });

  it('should switch password visibility', () => {
    component.showConfirmPassword();
    expect(component.confirmPasswordType).toBe('text');
    expect(component.confirmPasswordEyeImagePath).toBe('auth/password-eye.svg');
    component.showConfirmPassword();
    expect(component.confirmPasswordType).toBe('password');
    expect(component.confirmPasswordEyeImagePath).toBe('auth/password-eye-slash.svg');
  });

  it('should enable confirm button and change image path for valid new password', () => {
    component.resetPasswordModel.newPassword = '12345678';
    component.onNewPasswordChange();
    expect(component.enableConfirmBtn).toBe(false);
  });

  it('should disable confirm button and change image path for invalid new password', () => {
    component.resetPasswordModel.newPassword = '1234';
    component.onNewPasswordChange();
    expect(component.enableConfirmBtn).toBe(false);
  });

  it('should disable confirm button and change image path when confirm password is empty', () => {
    component.resetPasswordModel.newPassword = '12345678';
    component.resetPasswordModel.confirmPassword = '';
    component.onNewPasswordChange();
    expect(component.enableConfirmBtn).toBe(false);
  });

  it('should disable confirm button when new password is empty', () => {
    component.resetPasswordModel.newPassword = '';
    component.resetPasswordModel.confirmPassword = '12345678';
    component.validateForm();
    expect(component.enableConfirmBtn).toBe(false);
  });

  it('should disable confirm button when confirm password is empty', () => {
    component.resetPasswordModel.newPassword = '12345678';
    component.resetPasswordModel.confirmPassword = '';
    component.validateForm();
    expect(component.enableConfirmBtn).toBe(false);
  });
});
