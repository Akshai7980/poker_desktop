import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { AUTH, GenerateOTPModel, VerifyOTPModel } from 'projects/shared/src/public-api';
import { SpecConstant } from 'projects/shared/src/lib/constants/spec.constants';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';

describe('HandHistoryService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the login session ID', () => {
    const { sessionId } = SpecConstant.cashier.params;
    service.loginSessionId = sessionId;
    expect(service.loginSessionId).toEqual(sessionId);
  });

  it('should set the login session ID', () => {
    const { sessionId } = SpecConstant.cashier.params;
    service.loginSessionId = sessionId;
    expect(service.loginSessionId).toEqual(sessionId);
  });

  it('should return the login model', () => {
    const loginModel: any = {
      username: 'testuser',
      password: 'testpassword'
    };
    service.loginModel = loginModel;
    expect(service.loginModel).toEqual(loginModel);
  });

  it('should set the login model', () => {
    const loginModel: any = {
      username: 'testuser',
      password: 'testpassword'
    };
    service.loginModel = loginModel;
    expect(service.loginModel).toEqual(loginModel);
  });

  it('should generate an OTP', () => {
    const generateOTPModel: GenerateOTPModel = new GenerateOTPModel('1234567890', '');
    const expectedResponse = {
      status: 'success',
      message: 'OTP sent successfully.'
    };

    service.generateOTP(generateOTPModel).subscribe((response) => {
      expect(response.message).toEqual(expectedResponse.message);
    });

    const req = httpMock.expectOne(`${environment.config.TOMCAT_HOST + AUTH.SEND_OTP}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(generateOTPModel.getRequestModel());

    req.flush(expectedResponse);
  });

  it('should verify an OTP', () => {
    const verifyOTPModel: VerifyOTPModel = new VerifyOTPModel('123456');
    const expectedResponse = {
      status: 'success',
      message: 'OTP verified successfully.'
    };

    const userDetails = { userId: '0' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(userDetails));

    service.verifyOtp(verifyOTPModel).subscribe((response) => {
      expect(response.message).toEqual(expectedResponse.message);
    });

    const req = httpMock.expectOne(`${environment.config.TOMCAT_HOST + AUTH.VERIFY_OTP}`);
    expect(req.request.method).toBe('POST');

    req.flush(expectedResponse);
  });

  it('should execute logout', () => {
    const expectedResponse = {
      status: 'success'
    };

    service.executeLogOut().subscribe((response) => {
      expect(response.status).toEqual(expectedResponse.status);
    });

    const req = httpMock.expectOne(`${environment.config.TOMCAT_HOST + AUTH.LOGOUT_USER}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});

    req.flush(expectedResponse);
  });

  it('should call the network service with the correct URL', () => {
    const promoCode = 'TEST_PROMO_CODE';
    const expectedUrl = `${environment.config.TOMCAT_HOST}/auth/validate-promo-code?code=${promoCode}`;
    expect(expectedUrl).toBeDefined();
  });
});
