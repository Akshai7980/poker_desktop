import { BaseResponse, TransactionStatusModel } from 'projects/shared/src/public-api';
import { colors } from 'src/assets/abstract/colorsConfig';

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
  iconColor?: string;
  borderColor?: string;
  titleColor?: string;
  remarks?: string;
  disabled?: boolean;
}

export class CustomTimeLineModel {
  customTimeLine: Array<CustomTimeLine>;

  colors = colors;

  constructor(
    customTimeLine?: Array<CustomTimeLine>,
    apiResponse?: BaseResponse<TransactionStatusModel>
  ) {
    if (customTimeLine) this.customTimeLine = customTimeLine;
    else this.customTimeLine = this.getViewModel(apiResponse?.data);
  }

  getViewModel(apiResponse: TransactionStatusModel | undefined) {
    let result: Array<CustomTimeLine> = [];

    if (apiResponse?.redeemStatus === 'pending') {
      result = this.getPendingTimeLine(apiResponse);
    } else if (apiResponse?.redeemStatus === 'cancelled') {
      result = this.getCancelledTimeLine(apiResponse);
    } else if (apiResponse?.redeemStatus === 'transferred') {
      result = this.getTransferredTimeLine(apiResponse);
    } else if (apiResponse?.redeemStatus === 'approved') {
      result = this.getApprovedTimeLine(apiResponse);
    } else if (apiResponse?.redeemStatus === 'pending_bank') {
      result = this.getPendingBankTimeLine(apiResponse);
    } else if (apiResponse?.redeemStatus === 'failed') {
      result = this.getFailedTimeLine(apiResponse);
    } else {
      result = this.getBlockedTimeLine(apiResponse);
    }
    return result;
  }

  getPendingTimeLine(apiResponse: any): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: 'Request Received',
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: 'Approved',
      subStatus: 'Your request may take up to 6 hours to approve*',
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine3: CustomTimeLine = {
      title: 'Bank Transfer',
      subStatus: 'May Take up to 2 hours',
      icon: 'ClockPending.svg',
      color: this.colors['secondary-success']
    };

    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }

  getFailedTimeLine(apiResponse: any): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: 'Request Received',
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: 'Approved',
      date: apiResponse?.redeemStatusArr[1].modifiedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine3: CustomTimeLine = {
      title: 'Bank Transfer',
      subStatus: 'Failed',
      icon: 'WarningOctagon.svg',
      reason: apiResponse.failedReason,
      color: this.colors['secondary-success']
    };

    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }

  getPendingBankTimeLine(apiResponse: any): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: 'Request Received',
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: 'Approved',
      date: apiResponse?.redeemStatusArr[1].modifiedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine3: CustomTimeLine = {
      title: 'Bank Transfer',
      subStatus: 'Pending with your Bank',
      remarks: 'May Take up to 72 hours',
      icon: 'ClockPending.svg',
      color: this.colors['secondary-success']
    };
    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }

  getApprovedTimeLine(apiResponse: any): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: 'Request Received',
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: 'Approved',
      date: apiResponse?.redeemStatusArr[1].modifiedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine3: CustomTimeLine = {
      title: 'Bank Transfer',
      subStatus: 'May Take up to 2 hours',
      icon: '3',
      isIndex: true,
      color: this.colors['secondary-success']
    };
    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }

  getTransferredTimeLine(apiResponse: any): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: 'Request Received',
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: 'Approved',
      date: apiResponse?.redeemStatusArr[1].modifiedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine3: CustomTimeLine = {
      title: 'Bank Transfer',
      date: apiResponse?.redeemStatusArr[1].modifiedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }

  getCancelledTimeLine(apiResponse: any): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: 'Request Received',
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: 'Approved',
      subStatus: 'Cancelled',
      reason: apiResponse?.redeemStatusArr[1].remarks,
      icon: 'WarningOctagon.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine3: CustomTimeLine = {
      title: 'Bank Transfer',
      icon: '3',
      isIndex: true,
      color: this.colors['secondary-success'],
      disabled: true
    };

    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }

  getBlockedTimeLine(apiResponse: any): CustomTimeLine[] {
    const customTimeLine1: CustomTimeLine = {
      title: 'Request Received',
      date: apiResponse.addedOn,
      icon: 'CheckCircle.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine2: CustomTimeLine = {
      title: 'Approved',
      subStatus: 'On Hold',
      reason: apiResponse?.blockReason,
      icon: 'WarningOctagon.svg',
      color: this.colors['secondary-success']
    };
    const customTimeLine3: CustomTimeLine = {
      title: 'Bank Transfer',
      icon: '3',
      isIndex: true,
      color: this.colors['secondary-success'],
      disabled: true
    };

    return [customTimeLine1, customTimeLine2, customTimeLine3];
  }
}
