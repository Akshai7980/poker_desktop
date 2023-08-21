import { colors } from 'projects/cashier/src/assets/abstract/colorsConfig';

import { BaseResponse } from 'projects/shared/src/public-api';
import { TransactionStatusModel } from '../../models/response/transaction-history.model';
import { CashierConstants } from '../../constants/app-constants';

export interface OfferResponse {
  offerId: number;
  offerName: string;
  startDate: string;
  endDate: string;
  originalPrice: number | string;
  offerPrice?: number | string;
  percentOff?: number | string;
  desktopBanner: string;
  tktId: number;
  status: string;
  purchaseStatus: string;
  paymentType: string;
  urgencyMaxUsage: number;
  maxUsage: number;
  adminId: number;
  totalUsage: number;
}

export interface CustomTimeLine {
  title?: string;
  date?: string;
  icon?: string | number;
  color?: string;
  status?: string;
  reason?: string;
  isIndex?: boolean;
  subStatus?: string;
  subStatusBank?: string;
  iconColor?: string;
  borderColor?: string;
  titleColor?: string;
  remarks?: string;
  disabled?: boolean;
}

export const CashierServiceTypeConst = {
  WITHDRAWAL_BACK: 1
};
export interface CashierServiceModel {
  type: number;
  value?: string;
}

export class CustomTimeLineModel {
  customTimeLine: Array<CustomTimeLine>;

  colors = colors;

  constructor(
    customTimeLine?: Array<CustomTimeLine>,
    apiResponse?: BaseResponse<TransactionStatusModel>
  ) {
    if (customTimeLine) {
      this.customTimeLine = customTimeLine;
    } else {
      this.customTimeLine = this.getViewModel(apiResponse?.data);
    }
  }

  getViewModel(apiResponse: TransactionStatusModel | undefined) {
    let result: Array<CustomTimeLine> = [];

    if (apiResponse?.redeemStatus === CashierConstants.pending) {
      result = this.getPendingTimeLine(apiResponse);
    } else if (apiResponse?.redeemStatus === CashierConstants.cancelled) {
      result = this.getCancelledTimeLine(apiResponse);
    } else if (apiResponse?.redeemStatus === CashierConstants.transferred) {
      result = this.getTransferredTimeLine(apiResponse);
    } else if (apiResponse?.redeemStatus === CashierConstants.approved) {
      result = this.getApprovedTimeLine(apiResponse);
    } else if (apiResponse?.redeemStatus === CashierConstants.pending_bank) {
      result = this.getPendingBankTimeLine(apiResponse);
    } else if (apiResponse?.redeemStatus === CashierConstants.failed) {
      result = this.getFailedTimeLine(apiResponse);
    } else if (apiResponse) {
      result = this.getBlockedTimeLine(apiResponse);
    }
    return result;
  }

  getPendingTimeLine(apiResponse: TransactionStatusModel): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: CashierConstants.requestReceived,
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: CashierConstants.approval,
      remarks: CashierConstants.remark,
      icon: CashierConstants.three,
      isIndex: true,
      color: this.colors['grey-light'],
      disabled: true
    };
    const customTimeLine3: CustomTimeLine = {
      title: CashierConstants.bankTransfer,
      remarks: CashierConstants.remark,
      icon: CashierConstants.three,
      isIndex: true,
      color: this.colors['grey-light'],
      disabled: true
    };

    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }

  getFailedTimeLine(apiResponse: TransactionStatusModel | undefined): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: CashierConstants.requestReceived,
      date: apiResponse?.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: CashierConstants.Approved,
      date: apiResponse?.redeemStatusArr[1].modifiedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine3: CustomTimeLine = {
      title: CashierConstants.bankTransfer,
      subStatus: CashierConstants.failedCap,
      icon: 'WarningOctagon.svg',
      reason: apiResponse?.failedReason,
      color: this.colors['shade-red']
    };

    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }

  getPendingBankTimeLine(apiResponse: TransactionStatusModel): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: CashierConstants.requestReceived,
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: CashierConstants.Approved,
      date: apiResponse?.redeemStatusArr[1].modifiedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine3: CustomTimeLine = {
      title: CashierConstants.bankTransfer,
      subStatusBank: CashierConstants.bankPending,
      remarks: CashierConstants.remarkMax,
      icon: 'ClockPending.svg',
      color: this.colors['shade-orange']
    };
    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }

  getApprovedTimeLine(apiResponse: TransactionStatusModel): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: CashierConstants.requestReceived,
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: CashierConstants.Approved,
      date: apiResponse?.redeemStatusArr[1].modifiedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine3: CustomTimeLine = {
      title: CashierConstants.bankTransfer,
      remarks: CashierConstants.remark,
      icon: CashierConstants.three,
      isIndex: true,
      color: this.colors['grey-light'],
      disabled: true
    };
    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }

  getTransferredTimeLine(apiResponse: TransactionStatusModel): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: CashierConstants.requestReceived,
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: CashierConstants.Approved,
      date: apiResponse?.redeemStatusArr[1].modifiedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine3: CustomTimeLine = {
      title: CashierConstants.bankTransfer,
      date: apiResponse?.redeemStatusArr[2].modifiedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }

  getCancelledTimeLine(apiResponse: TransactionStatusModel): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: CashierConstants.requestReceived,
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: CashierConstants.Approved,
      subStatus: CashierConstants.cancelledCap,
      reason: apiResponse?.redeemStatusArr[1].remarks,
      icon: 'WarningOctagon.svg',
      color: this.colors['shade-red']
    };
    const customTimeLine3: CustomTimeLine = {
      title: CashierConstants.bankTransfer,
      icon: CashierConstants.three,
      isIndex: true,
      color: this.colors['grey-light'],
      disabled: true
    };

    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }

  getBlockedTimeLine(apiResponse: TransactionStatusModel): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: CashierConstants.requestReceived,
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: CashierConstants.approvalCap,
      subStatus: CashierConstants.hold,
      reason: apiResponse?.blockReason,
      icon: 'ClockPending.svg',
      color: this.colors['shade-orange']
    };
    const customTimeLine3: CustomTimeLine = {
      title: CashierConstants.bankTransfer,
      icon: CashierConstants.three,
      isIndex: true,
      color: this.colors['grey-light'],
      disabled: true
    };

    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }
}
