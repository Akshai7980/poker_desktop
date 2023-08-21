import { Injectable } from '@angular/core';
import { environment } from 'projects/shared/src/environments/environment';
import {
  BaseResponse,
  CommonService,
  LocalStorageService,
  NetworkService,
  RegexExpression
} from 'projects/shared/src/public-api';
import { Subject } from 'rxjs/internal/Subject';
import { APIMethod } from 'src/app/core/constants/api-enum.constants';

import { EmailOtpSendModel } from 'projects/shared/src/lib/models/view/email-otp-send';
import { EmailOtpVerifyModel } from 'projects/shared/src/lib/models/view/email-otp-verify';
import { EmailOtpSendRes } from 'projects/shared/src/lib/models/response/email-send-response';
import { EmailOtpVerifyRes } from 'projects/shared/src/lib/models/response/email-verify-response';
import { EmailOtpSendReq } from 'projects/shared/src/lib/models/request/email-send-request';
import { MatDialogRef } from '@angular/material/dialog';
import { EmailOtpVerifyReq } from 'projects/shared/src/lib/models/request/email-verify-request';
import { AUTH, UrlConstant } from '../constants/api-url.constants';
import { AlternateMobileOtpRequestModel } from '../models/request/alternate-mobile-otp-send';
import { AlternateMobileVerifyOtpReq } from '../models/request/alternate-mobile-verify-otp';
import { DefaultBankRequest } from '../models/request/default-bank-request';
import { DeleteSavedCardsReq } from '../models/request/delete-saved-cards-request';
import { PasswordChangeRequestModel } from '../models/request/password-change-request.model';
import { SaveUserProfileReq } from '../models/request/save-user-profile-details';
import { UpdateAvtarRequestModel } from '../models/request/update-avatar-request.model';
import { UploadBankDetailsRequest } from '../models/request/upload-bank-details';
import { UploadKycDetailsReq } from '../models/request/upload-kyc-details-req';
import { AadharRedirectResponse } from '../models/response/aadhar-redirect-response.model';
import { AlternateMobileSendOtp } from '../models/response/alternate-mobile-number-otp';
import { AlternateMobileVerifyOtpResp } from '../models/response/alternate-mobile-verify-otp';
import { BankListResponse } from '../models/response/bank-list-response';
import { DefaultBankResponse } from '../models/response/default-bank-response';
import { UserKycDocsRes } from '../models/response/get-kyc-docs-response';
import { GetSavedCardsRes } from '../models/response/get-saved-cards-response';
import { IfscDetailsResponse } from '../models/response/ifsc-details';
import { KycDocumentListResponse } from '../models/response/kyc-doclist-response';
import { KycStatusResponse } from '../models/response/kycstatus-response.model';
import { NewProfileResponseModel } from '../models/response/new-profile-response';
import { UserPanCardDetails } from '../models/response/pan-details-res';
import { SaveUserProfileRes } from '../models/response/save-user-profile-res';
import { SelfieDetailsResponse } from '../models/response/selfi-details-response.model';
import { UpdateAvatarResponseModel } from '../models/response/update-avatar-response.model';
import { UploadBankDetailsResponse } from '../models/response/upload-bank-details';
import { AlternateMobileOtpModel } from '../models/view/alternate-mobile-otp-model';
import { AlternateMobileVerifyOtp } from '../models/view/alternate-mobile-verify-otp';
import { DefaultBankModel } from '../models/view/default-bank-model';
import { DeleteSavedCardsModel } from '../models/view/delete-saved-cards-model';
import { PasswordChangeModel } from '../models/view/password-change.model';
import { UserDataModel } from '../models/view/unnamed-data-model';
import { UpdateAvatarModel } from '../models/view/update-avtar-model';
import { UploadBankDetailsModel } from '../models/view/upload-bank-details-model';
import {
  ValidateUpiModel,
  ValidateUpiRequest,
  ValidateUpiResponse
} from '../models/view/validate-upi.model';
import {
  VerifyUpiModel,
  VerifyUpiRequest,
  VerifyUpiResponse
} from '../models/view/verify-upi.model';

declare const Sha256: any;

export interface UserNameModel {
  userId: number;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public userName = new Subject<string>();

  userNameChangeDetector = new Subject();

  avatarChangeDetector = new Subject();

  private pvtKycData: KycStatusResponse;

  private pvtKycDocsData: UserKycDocsRes;

  public get kycData() {
    return this.pvtKycData;
  }

  public set kycData(value: KycStatusResponse) {
    this.pvtKycData = value;
  }

  public get kycDocsData() {
    return this.pvtKycDocsData;
  }

  public set kycDocsData(value: UserKycDocsRes) {
    this.pvtKycDocsData = value;
  }

  profileCompletionDetector = new Subject();

  constructor(
    private readonly networkService: NetworkService,
    private readonly localStorageService: LocalStorageService,
    private commonService: CommonService
  ) {}

  // ----- User Profile - Personal Details APIs Starts Here -----

  // New Profile API
  createNewProfile() {
    return this.networkService.call<BaseResponse<NewProfileResponseModel>>(
      environment.config.TOMCAT_HOST + UrlConstant.NEW_PROFILE,
      APIMethod.GET
    );
  }

  getKycDetails() {
    return this.networkService.call<BaseResponse<KycStatusResponse>>(
      environment.config.TOMCAT_HOST + UrlConstant.KYC_DETAILS,
      APIMethod.GET
    );
  }

  // Alternate Mobile Number SendOtp // POST // API END POINT -- sendMobileOtp
  alternateMobileNumberSendOtp(viewModel: AlternateMobileOtpModel) {
    const bodyData = viewModel.getRequestModel();
    const generateOTP = this.networkService.call<
      AlternateMobileOtpRequestModel,
      BaseResponse<AlternateMobileSendOtp>
    >(
      environment.config.TOMCAT_HOST + UrlConstant.ALTERNATE_MOBILE_NUMBER_SEND_OTP,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return generateOTP;
  }

  // Alternate Mobile verify // POST // API END POINT -- verifyMobileOtp
  alternateMobileNumberVerifyOtp(viewModel: AlternateMobileVerifyOtp) {
    const bodyData = viewModel.getRequestModel();
    const generateOTP = this.networkService.call<
      AlternateMobileVerifyOtpReq,
      BaseResponse<AlternateMobileVerifyOtpResp>
    >(
      environment.config.TOMCAT_HOST + UrlConstant.ALTERNATE_MOBILE_NUMBER_VERIFY_OTP,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return generateOTP;
  }

  // Send Email Verification // POST // API END POINT -- sendEmailOtp
  sendEmailOtp(viewModel: EmailOtpSendModel) {
    const bodyData = viewModel.getRequestModel();
    const generateEmailOTP = this.networkService.call<
      EmailOtpSendReq,
      BaseResponse<EmailOtpSendRes>
    >(
      environment.config.TOMCAT_HOST + UrlConstant.SEND_EMAIL_OTP,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return generateEmailOTP;
  }

  // Email Verification // POST // API END POINT -- verifyEmailOtp
  verifyEmailOtp(viewModel: EmailOtpVerifyModel) {
    const bodyData = viewModel.getRequestModel();
    const verifyEmailOTP = this.networkService.call<
      EmailOtpVerifyReq,
      BaseResponse<EmailOtpVerifyRes>
    >(
      environment.config.TOMCAT_HOST + UrlConstant.SEND_EMAIL_VERIFY_OTP,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return verifyEmailOTP;
  }

  saveUserProfile(request: SaveUserProfileReq) {
    return this.networkService.call<SaveUserProfileReq, BaseResponse<SaveUserProfileRes>>(
      environment.config.TOMCAT_HOST + UrlConstant.SAVE_USER_PROFILE_DETAILS,
      APIMethod.POST,
      new Map<string, string>(),
      request
    );
  }
  // ----- User Profile - Personal Details APIs Ends Here -----

  // ifsc details
  getIfscDetails(ifsc: string) {
    const token = this.localStorageService.getItem('token');
    return this.networkService.call<BaseResponse<IfscDetailsResponse>>(
      `${environment.config.TOMCAT_HOST + UrlConstant.IFSC_DETAILS}?ifsc=${ifsc}`,
      APIMethod.GET,
      token
    );
  }

  // bank-list
  getBankList() {
    const token = this.localStorageService.getItem('token');
    return this.networkService.call<BaseResponse<BankListResponse>>(
      environment.config.TOMCAT_HOST + UrlConstant.BANK_LIST,
      APIMethod.GET,
      token
    );
  }

  // UPI

  validateUpi(viewModel: ValidateUpiModel) {
    const bodyData = viewModel.getRequestModel();
    const validateUpi = this.networkService.call<
      ValidateUpiRequest,
      BaseResponse<ValidateUpiResponse>
    >(
      environment.config.NEW_TOMCAT_HOST + UrlConstant.UPI_VALIDATE,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );
    return validateUpi;
  }

  verifyUpi(viewModel: VerifyUpiModel) {
    const bodyData = viewModel.getRequestModel();
    const verifyUpi = this.networkService.call<VerifyUpiRequest, BaseResponse<VerifyUpiResponse>>(
      environment.config.NEW_TOMCAT_HOST + UrlConstant.UPI_VERIFY,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );
    return verifyUpi;
  }

  // upload bank details
  uploadBankDetails(viewModel: UploadBankDetailsModel) {
    const bodyData = viewModel.getRequestModel();
    const addBankDetails = this.networkService.call<
      UploadBankDetailsRequest,
      BaseResponse<UploadBankDetailsResponse>
    >(
      environment.config.TOMCAT_HOST + UrlConstant.UPLOAD_BANK_DETAILS,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );
    return addBankDetails;
  }

  // ----- Document Verification APIs Starts Here -----

  // Get User Pan card Details // GET // API END POINT -- details
  getPanCardDetails() {
    const token = this.localStorageService.getItem('token');
    return this.networkService.call<BaseResponse<UserPanCardDetails>>(
      environment.config.TOMCAT_HOST + UrlConstant.GET_PAN_DETAILS,
      APIMethod.GET,
      token
    );
  }

  // Upload User Pan card Details // POST // API END POINT --  upload
  uploadPanCardDetails(bodyData: FormData) {
    const uploadPanDetails = this.networkService.call<FormData, any>(
      environment.config.TOMCAT_HOST + UrlConstant.UPLOAD_PAN_DETAILS,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return uploadPanDetails;
  }

  // ----- Document Verification APIs Ends Here -----

  changePassword(viewModel: PasswordChangeModel) {
    const bodyData = viewModel.getRequestModel();
    bodyData.currentPassword = `${Sha256.hash(bodyData.currentPassword)}`;
    bodyData.newPassword = `${Sha256.hash(bodyData.newPassword)}`;
    bodyData.confirmPassword = `${Sha256.hash(bodyData.confirmPassword)}`;
    const changePassword = this.networkService.call<PasswordChangeRequestModel, any>(
      environment.config.TOMCAT_HOST + UrlConstant.CHANGE_PASSWORD,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return changePassword;
  }

  // default bank details
  defaultBankDetails(viewModel: DefaultBankModel) {
    const bodyData = viewModel.getRequestModel();
    const defaultBankDetails = this.networkService.call<
      DefaultBankRequest,
      BaseResponse<DefaultBankResponse>
    >(
      environment.config.TOMCAT_HOST + UrlConstant.DEFAULT_BANK,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );
    return defaultBankDetails;
  }

  // edit userName Api
  getUserName(userName: string) {
    const userDetails: UserDataModel = this.commonService.getUserData();
    const bodyData: UserNameModel = {
      userId: userDetails.userId,
      userName
    };
    return this.networkService.call<UserNameModel, BaseResponse<any>>(
      environment.config.TOMCAT_HOST + AUTH.UPDATE_USER_NAME,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );
  }

  // avatar APi
  upDateAvatar(viewModel: UpdateAvatarModel) {
    const bodyData = viewModel.getRequestModel();
    const userDetails = this.commonService.getUserData();
    bodyData.userId = userDetails.userId.toString();
    const token = this.localStorageService.getItem('token');
    return this.networkService.call<
      UpdateAvtarRequestModel,
      BaseResponse<UpdateAvatarResponseModel>
    >(environment.config.TOMCAT_HOST + AUTH.UPDATE_AVATAR, APIMethod.POST, token, bodyData);
  }

  // ----- Document Verification KYC API Starts Here -----
  uploadKycDetails(bodyData: any) {
    const uploadKycDetails = this.networkService.call<UploadKycDetailsReq, any>(
      environment.config.TOMCAT_HOST + UrlConstant.KYC_UPLOAD,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return uploadKycDetails;
  }
  // ----- Document Verification KYC API Ends Here -----

  // Function to convert Base64 to Blob format
  async b64toBlob(b64Data: string, contentType: string): Promise<Blob> {
    const validBase64Regex = RegexExpression.validateBase64;

    if (!validBase64Regex.test(b64Data)) {
      throw new Error('Invalid base64 string');
    }

    const byteCharacters = window.atob(b64Data.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i += 1) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  convertParamsToFormData(params: any): FormData {
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });
    return formData;
  }

  // To get Saved Card details fo the user
  getSavedCards() {
    const token = this.localStorageService.getItem('token');
    return this.networkService.call<BaseResponse<GetSavedCardsRes>>(
      environment.config.TOMCAT_HOST + UrlConstant.GET_SAVED_CARDS,
      APIMethod.GET,
      token
    );
  }

  // To delete saved card by the user
  deleteSavedCard(viewModel: DeleteSavedCardsModel) {
    const bodyData = viewModel.getRequestModel();
    const uploadKycDetails = this.networkService.call<DeleteSavedCardsReq, any>(
      environment.config.TOMCAT_HOST + UrlConstant.DELETE_SAVED_CARDS,
      APIMethod.DELETE,
      new Map<string, string>(),
      bodyData
    );

    return uploadKycDetails;
  }

  // To get User Kyc Docs List
  getUserKycDocs() {
    return this.networkService.call<BaseResponse<UserKycDocsRes>>(
      environment.config.TOMCAT_HOST + UrlConstant.GET_KYC_DOCS,
      APIMethod.GET
    );
  }

  getAadharRedirectData() {
    const bodyData = {
      redirectUrl: `${window.location.href}`
    };

    return this.networkService.call<any, BaseResponse<AadharRedirectResponse>>(
      environment.config.TOMCAT_HOST + UrlConstant.GET_AADHAR_REDIRECT_DATA,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );
  }

  uploadSelfie(file: File) {
    const bodyData = this.convertParamsToFormData({
      document: file,
      docType: 'selfie'
    });
    return this.networkService.call<any, any>(
      environment.config.TOMCAT_HOST + UrlConstant.SELFIE_UPLOAD,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );
  }
  // kyc droupdown list

  getKycDocList() {
    const token = this.localStorageService.getItem('token');
    return this.networkService.call<BaseResponse<KycDocumentListResponse[]>>(
      environment.config.TOMCAT_HOST + UrlConstant.KYC_DOC_LIST,
      APIMethod.GET,
      token
    );
  }

  getSelfieDetails() {
    return this.networkService.call<BaseResponse<SelfieDetailsResponse>>(
      environment.config.TOMCAT_HOST + UrlConstant.SELFIE_DETAILS,
      APIMethod.GET
    );
  }

  // Add/Remove Animation Class on/and Dialog Close
  toggleAnimationDialog<T>(dialogRef: MatDialogRef<T>) {
    dialogRef.addPanelClass('dialog-slide-out-right');
    dialogRef.removePanelClass('dialog-slide-in-right');
    setTimeout(() => {
      dialogRef.close();
    }, 350);
  }
}
