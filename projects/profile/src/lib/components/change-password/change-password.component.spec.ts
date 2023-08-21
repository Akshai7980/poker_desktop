import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { PasswordChangeModel } from '../../models/view/password-change.model';
import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [ReactiveFormsModule, HttpClientModule, FormsModule, MatDialogModule],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: FormBuilder, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    expect(component.resetPasswordModel).toEqual(new PasswordChangeModel('', '', ''));
    expect(component.newPasswordType).toBe('password');
    expect(component.confirmPasswordType).toBe('password');
    expect(component.newPasswordEyeImagePath).toBe('password-eye-slash.svg');
    expect(component.newPasswordEyeImagePath).toBe('password-eye-slash.svg');
    expect(component.verifiedImagePath).toBe('verify-light.svg');
    expect(component.isShowToast).toBe(false);
    expect(component.showStatusText).toBe(false);
  });

  it('should change passwordType to "text" and passwordEyeImagePath to "password-eye.svg" if passwordType is "password"', () => {
    component.showNewPassword();
    expect(component.newPasswordType).toBe('text');
    expect(component.newPasswordEyeImagePath).toBe('password-eye.svg');
  });

  it('should change passwordType to "password" and passwordEyeImagePath to "password-eye-slash.svg" if passwordType is not "password"', () => {
    component.newPasswordType = 'text';
    component.newPasswordEyeImagePath = 'password-eye.svg';
    component.showNewPassword();
    expect(component.newPasswordType).toBe('password');
    expect(component.newPasswordEyeImagePath).toBe('password-eye-slash.svg');
  });

  it('should change passwordType to "text" and passwordEyeImagePath to "password-eye.svg" if passwordType is "password"', () => {
    component.showCurrentPassword();
    expect(component.newPasswordType).toBe('password');
    expect(component.newPasswordEyeImagePath).toBe('password-eye-slash.svg');
  });

  it('should change passwordType to "password" and passwordEyeImagePath to "password-eye-slash.svg" if passwordType is not "password"', () => {
    component.newPasswordType = 'text';
    component.newPasswordEyeImagePath = 'password-eye.svg';
    component.showCurrentPassword();
    expect(component.newPasswordType).toBe('text');
    expect(component.newPasswordEyeImagePath).toBe('password-eye.svg');
  });

  it('should set enableConfirmBtn to true and verifiedImagePath to "verify-green.svg" if newPassword is between 8 and 20 characters and confirmPassword is not empty', () => {
    component.resetPasswordModel.newPassword = 'password123';
    component.resetPasswordModel.confirmPassword = 'password123';
    component.onNewPasswordChange();
    expect(component.enableConfirmBtn).toBe(true);
    expect(component.verifiedImagePath).toBe('verify-green.svg');
  });

  it('should set enableConfirmBtn to false and verifiedImagePath to "verify-light.svg" if newPassword is not between 8 and 20 characters', () => {
    component.resetPasswordModel.newPassword = 'password';
    component.onNewPasswordChange();
    expect(component.enableConfirmBtn).toBe(false);
    expect(component.verifiedImagePath).toBe('verify-green.svg');
  });

  it('should set enableConfirmBtn to false and verifiedImagePath to "verify-light.svg" if confirmPassword is empty', () => {
    component.resetPasswordModel.newPassword = 'password123';
    component.resetPasswordModel.confirmPassword = '';
    component.onNewPasswordChange();
    expect(component.enableConfirmBtn).toBe(false);
    expect(component.verifiedImagePath).toBe('verify-green.svg');
  });

  it('should set enableConfirmBtn to true if all passwords are not empty', () => {
    component.resetPasswordModel.newPassword = 'newpassword123';
    component.resetPasswordModel.confirmPassword = 'newpassword123';
    component.resetPasswordModel.currentPassword = 'currentpassword123';
    component.onConfirmPasswordChange();
    expect(component.enableConfirmBtn).toBe(true);
  });

  it('should set enableConfirmBtn to false if newPassword is empty', () => {
    component.resetPasswordModel.confirmPassword = 'newpassword123';
    component.resetPasswordModel.currentPassword = 'currentpassword123';
    component.onConfirmPasswordChange();
    expect(component.enableConfirmBtn).toBe(false);
  });

  it('should set enableConfirmBtn to false if confirmPassword is empty', () => {
    component.resetPasswordModel.newPassword = 'newpassword123';
    component.resetPasswordModel.currentPassword = 'currentpassword123';
    component.onConfirmPasswordChange();
    expect(component.enableConfirmBtn).toBe(false);
  });

  it('should set enableConfirmBtn to false if currentPassword is empty', () => {
    component.resetPasswordModel.newPassword = 'newpassword123';
    component.resetPasswordModel.confirmPassword = 'newpassword123';
    component.onConfirmPasswordChange();
    expect(component.enableConfirmBtn).toBe(true);
  });

  it('should set enableConfirmBtn to true if newPassword, confirmPassword, and currentPassword are all not empty', () => {
    component.resetPasswordModel.newPassword = 'newpassword123';
    component.resetPasswordModel.confirmPassword = 'newpassword123';
    component.resetPasswordModel.currentPassword = 'oldpassword123';
    component.onCurrentPasswordChange();
    expect(component.enableConfirmBtn).toBe(true);
  });

  it('should set enableConfirmBtn to false if currentPassword is empty', () => {
    component.resetPasswordModel.newPassword = 'newpassword123';
    component.resetPasswordModel.confirmPassword = 'newpassword123';
    component.resetPasswordModel.currentPassword = '';
    component.onCurrentPasswordChange();
    expect(component.enableConfirmBtn).toBe(false);
  });

  it('should set enableConfirmBtn to false if newPassword or confirmPassword is empty', () => {
    component.resetPasswordModel.newPassword = '';
    component.resetPasswordModel.confirmPassword = 'newpassword123';
    component.resetPasswordModel.currentPassword = 'oldpassword123';
    component.onCurrentPasswordChange();
    expect(component.enableConfirmBtn).toBe(false);
  });
});
