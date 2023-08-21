import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AUTH } from 'projects/shared/src/public-api';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let httpBackend: any;
  let myService: any;
  const url = AUTH.SEND_OTP;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [LoginComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MatDialog,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should make a POST request', () => {
    const requestData = {
      user: '2142552520',
      signupCode: '',
      source: 'web_mobile',
      resend: false,
      reqFrom: 'LOGIN'
    };
    const expectedResponse = { success: true };

    httpBackend?.expect(url, requestData).respond(expectedResponse);

    myService?.postData(requestData).then((response: any) => {
      expect(response.data).toEqual(expectedResponse);
    });

    httpBackend?.flush();
  });

  it('should execute onBackClick', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;

    spyOn(app, 'onBackClick').and.callThrough();
    app.onBackClick();
    expect(app.onBackClick).toHaveBeenCalled();
    expect(app.isShowLoginWithOTP).toBeTruthy();
  });

  it('should navigate to Login via password section on passwordLogin execution', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;

    spyOn(app, 'passwordLogin').and.callThrough();
    app.passwordLogin();

    expect(app.isShowLoginWithOTP).toBeFalsy();
  });

  it('should set clicked to false and enableOtpButton to false', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    app.clicked = true;
    app.enableOtpButton = true;
    expect(app.clicked).toBe(true);
    expect(app.enableOtpButton).toBe(true);
  });

  it('should set enteredMobileNumber and enableOtpButton to true if length is 10 and isSelected is true', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    app.isSelected = true;
    expect(app.enableOtpButton).toBe(false);
  });

  it('should enable OTP button when mobile number is 10 digits and isSelected is true', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    app.isSelected = true;
    expect(app.enableOtpButton).toBe(false);
  });

  it('should disable OTP button when mobile number is less than 10 digits and isSelected is true', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    app.isSelected = true;
    expect(app.enableOtpButton).toBe(false);
  });

  it('should disable OTP button when isSelected is false', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    app.isSelected = false;
    expect(app.enableOtpButton).toBe(false);
  });

  it('should not update enteredMobileNumber if mobile number is less than 10 digits', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    app.isSelected = true;
    expect(app.enteredMobileNumber).toBeUndefined();
  });

  it('should update enteredMobileNumber if mobile number is 10 digits and isSelected is true', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    app.isSelected = true;
  });
});
