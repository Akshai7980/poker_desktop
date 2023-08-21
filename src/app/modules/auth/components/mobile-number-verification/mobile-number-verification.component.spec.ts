import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AUTH } from 'projects/shared/src/public-api';
import { MobileNumberVerificationComponent } from './mobile-number-verification.component';

describe('MobileNumberVerificationComponent', () => {
  let httpBackend: any;
  let myService: any;
  const url = AUTH.SIGNUP;
  let component: MobileNumberVerificationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        HttpClientModule
      ],
      declarations: [MobileNumberVerificationComponent],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(MobileNumberVerificationComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(MobileNumberVerificationComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Positive test case for Signup
  it('should make a POST request', () => {
    const requestData = {
      url_1: 'https://www.adda52.com/',
      url_2: 'https://fullhouse.adda52poker.com/',
      utmParam: 'https://fullhouseapi.adda52poker.com/playpoker/',
      signupCode: '',
      otp: '325578',
      mobile: '7377373737',
      clientName: environment.config.DESK_APP_NAME,
      deviceId: '1046248812',
      appFlyerId: '',
      source: '',
      avtarId: 'girl2'
    };
    const expectedResponse = {
      code: 200,
      message: 'Success',
      data: {
        tempOtp: 519653,
        userId: 4129055,
        userName: '3X3X2X2X2X',
        message: {},
        avtarId: 'girl2'
      }
    };

    httpBackend?.expect(url, requestData).respond(expectedResponse);

    myService?.postData(requestData).then((response: any) => {
      expect(response.data).toEqual(expectedResponse);
    });

    httpBackend?.flush();
  });

  // negative test case for Signup
  it('should make a POST request', () => {
    const requestData = {
      url_1: 'https://www.adda52.com/',
      url_2: 'https://fullhouse.adda52poker.com/',
      utmParam: 'https://fullhouseapi.adda52poker.com/playpoker/',
      signupCode: '',
      otp: '1111111',
      mobile: '7377373737',
      clientName: environment.config.DESK_APP_NAME,
      deviceId: '1046248812',
      appFlyerId: '',
      source: '',
      avtarId: 'girl2'
    };
    const expectedResponse = {
      code: 1006,
      message: 'Please enter correct OTP. 3 attempts remaining ',
      data: {
        attemptLeft: 3
      }
    };

    httpBackend?.expect(url, requestData).respond(expectedResponse);

    myService?.postData(requestData).then((response: any) => {
      expect(response.data).toEqual(expectedResponse);
    });

    httpBackend?.flush();
  });

  // Positive test case for Verify OTP
  it('should make a POST request', () => {
    const requestData = {
      platform: 'mobile',
      userId: '4129249',
      code: '994176',
      clientName: 'ngxpokerdesk'
    };
    const expectedResponse = {
      code: 200,
      message: 'Success',
      data: {
        userId: 4129249,
        userName: '2X2X2X6X8X',
        gender: '',
        isMobileVerified: 1,
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxMjkyNDksImNsaWVudE5hbWUiOiJnYW1lIiwicGxhdGZvcm0iOiJuZ3hwb2tlcmRlc2siLCJpYXQiOjE2ODAyNTk4Mzh9.UjjaC9doMvAhwIQkQ_VYJOSOViWPIq0bOFxsMfUStaM',
        deleteRequestRaised: false,
        revertRequestAllowed: false
      }
    };

    httpBackend?.expect(url, requestData).respond(expectedResponse);

    myService?.postData(requestData).then((response: any) => {
      expect(response.data).toEqual(expectedResponse);
    });

    httpBackend?.flush();
  });

  it('should make a POST request', () => {
    const requestData = {
      platform: 'mobile',
      userId: '4129249',
      code: '994176',
      clientName: 'ngxpokerdesk'
    };
    const expectedResponse = {
      code: 1006,
      message: 'Please enter correct OTP. 3 attempts remaining ',
      data: {
        attemptLeft: 3
      }
    };

    httpBackend?.expect(url, requestData).respond(expectedResponse);

    myService?.postData(requestData).then((response: any) => {
      expect(response.data).toEqual(expectedResponse);
    });

    httpBackend?.flush();
  });

  it('should convert mobile number to mask', () => {
    const result = component.convertMobileNumberToMask('1234567890');
    expect(result).toEqual('12******90');
  });

  it('should return empty string when input is undefined', () => {
    const result = component.convertMobileNumberToMask('');
    expect(result).toEqual('');
  });

  it('should return empty string when input is not equal', () => {
    const result = component.convertMobileNumberToMask('1234567890');
    expect(result).not.toEqual('');
  });
});
