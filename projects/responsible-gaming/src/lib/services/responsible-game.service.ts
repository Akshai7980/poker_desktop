import { Injectable } from '@angular/core';
import { APIMethod } from 'projects/shared/src/lib/constants/api-enum.constants';
import { BaseResponse } from 'projects/shared/src/lib/models/common/base-response.model';
import environment from 'projects/shared/src/environments/environment';
import { NetworkService } from 'projects/shared/src/public-api';
import { MatDialogRef } from '@angular/material/dialog';
import { RESPONSIBLE_GAMING } from '../constants/app-url.constants';
import { CustomBaseResponse } from '../models/common/custom-base-response.model';
import { RestrictTableTabModelRequest } from '../models/request/restrict-table-tab.request.model';
import { SendConfirmationOtpRequest } from '../models/request/send-confirmation-otp.request.model';
import { ValidateSaveDataModelRequest } from '../models/request/validate-save-data.request.model';
import { VerifyEnteredOtpRequest } from '../models/request/verify-entered-otp.resquest.model';
import { RestrictTableResponseModel } from '../models/response/restrict-table.response.model';
import { SendConfirmationOtpResponse } from '../models/response/send-confirmation-otp.response.model';
import { UserDepositHistoryResponseModel } from '../models/response/user-deposit-history.response.model';
import { ValidateSavedDataResponseModel } from '../models/response/validate-save-data.response.model';
import { VerifyEnteredOtpResponse } from '../models/response/verify-entered-otp.response.model';
import { RestrictTableTabModel } from '../models/view/restrict-table-tab.view.model';
import { SendConfirmationOtpModel } from '../models/view/send-confirmation-otp.view.model';
import { ValidateSaveDataModel } from '../models/view/validate-save-data.view.model';
import { VerifyEnteredOtpModel } from '../models/view/verify-entered-otp.view.model';
import { RestrictTableTabResponseModel } from '../models/response/restrict-table-tab.response.model';
import { ValidateSaveDataCashModel } from '../models/view/validate-save-data-cash.view.model';
import { ValidateSaveDataCashModelRequest } from '../models/request/validate-save-data-cash.request.model';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleGameService {
  constructor(private readonly networkService: NetworkService) {}

  // TO GET THE USER RESTRICT TABLE TABS | RESPONSIBLE GAMING | TOURNAMENT
  getRestrictTableTab(viewModel: RestrictTableTabModel) {
    const bodyData = viewModel.getRequestModel();
    const restrictTableTab = this.networkService.call<
      RestrictTableTabModelRequest,
      CustomBaseResponse<RestrictTableResponseModel | RestrictTableTabResponseModel>
    >(
      `${
        environment.config.RESP_GAMING_TOMCAT_HOST + RESPONSIBLE_GAMING.TABLE_TAB_LIMIT
      }?platform=desktop`,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return restrictTableTab;
  }

  // TO GET THE USER DEPOSIT HISTORY | RESPONSIBLE GAMING | DEPOSIT LIMIT
  getUserDepositHistory() {
    return this.networkService.call<BaseResponse<UserDepositHistoryResponseModel>>(
      environment.config.TOMCAT_HOST + RESPONSIBLE_GAMING.GET_USER_DEPOSIT_HISTORY,
      APIMethod.GET
    );
  }

  // TO VALIDATE SAVED DATA | RESPONSIBLE GAMING | TOURNAMENT
  toValidateSaveData(viewModel: ValidateSaveDataModel) {
    const bodyData = viewModel.getRequestModel();
    const validateSaveData = this.networkService.call<
      ValidateSaveDataModelRequest,
      CustomBaseResponse<ValidateSavedDataResponseModel[]>
    >(
      `${
        environment.config.RESP_GAMING_TOMCAT_HOST + RESPONSIBLE_GAMING.VALIDATE_SAVE_DATA
      }?platform=desktop`,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return validateSaveData;
  }

  toValidateSaveDataCash(viewModel: ValidateSaveDataCashModel) {
    const bodyData = viewModel.getRequestModel();
    const validateSaveData = this.networkService.call<
      ValidateSaveDataCashModelRequest,
      CustomBaseResponse<ValidateSavedDataResponseModel[]>
    >(
      `${
        environment.config.RESP_GAMING_TOMCAT_HOST + RESPONSIBLE_GAMING.VALIDATE_SAVE_DATA
      }?platform=desktop`,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return validateSaveData;
  }

  // TO SEND OTP | RESPONSIBLE GAMING | TOURNAMENT
  toSendConfirmationOtp(viewModel: SendConfirmationOtpModel) {
    const bodyData = viewModel.getRequestModel();
    const sendConfirmationOtp = this.networkService.call<
      SendConfirmationOtpRequest,
      BaseResponse<SendConfirmationOtpResponse>
    >(
      `${
        environment.config.TOMCAT_HOST + RESPONSIBLE_GAMING.SENT_CHANGE_CONFIRM_OTP
      }?platform=desktop`,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return sendConfirmationOtp;
  }

  // TO VERIFY USER ENTERED OTP | RESPONSIBLE GAMING | TOURNAMENT
  verifyEnteredOtp(viewModel: VerifyEnteredOtpModel) {
    const bodyData = viewModel.getRequestModel();
    const sendConfirmationOtp = this.networkService.call<
      VerifyEnteredOtpRequest,
      CustomBaseResponse<VerifyEnteredOtpResponse>
    >(
      `${
        environment.config.RESP_GAMING_TOMCAT_HOST + RESPONSIBLE_GAMING.VERIFY_OTP
      }?platform=desktop`,
      APIMethod.POST,
      new Map<string, string>(),
      bodyData
    );

    return sendConfirmationOtp;
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
