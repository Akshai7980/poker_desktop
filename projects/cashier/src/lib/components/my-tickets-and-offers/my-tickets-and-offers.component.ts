import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { BaseResponse, MessageConstant } from 'projects/shared/src/public-api';
import * as moment from 'moment';
import { Cashier, Paths } from '../../constants/app-constants';
import { MATDIALOG } from '../../constants/dialog.constants';
import { OffersResponse } from '../../models/response/offers.response.model';
import { TicketInfo, TicketInfoResponse } from '../../models/response/ticket-info.response.model';
import { CashierService } from '../../services/cashier.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { OfferResponse } from '../models/cashier.model';

@Component({
  selector: 'app-my-tickets-and-offers',
  templateUrl: './my-tickets-and-offers.component.html',
  styleUrls: ['./my-tickets-and-offers.component.scss']
})
export class MyTicketsAndOffersComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  selectedTab: string;

  subTab: string[] = ['My Tickets', 'My Offers'];

  isShowToast: boolean = false;

  toastValue: { message: string; flag: string };

  allTickets: Array<TicketInfo> = [];

  allOffers: Array<OffersResponse> = [];

  showEyeIcon: boolean = false;

  totalAmount: number;

  offersList: Array<OffersResponse>;

  offerPrice: number;

  offerId: number;

  purchased: boolean;

  ticketId: any;

  tooltipContent: string;

  tktArr: any;

  selectedIndex: number;

  isExpireFlag: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    public cashierService: CashierService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MyTicketsAndOffersComponent>
  ) {}

  toFormattedDate = (date: string) => {
    return moment(date).format('D MMM, ‘YY');
  };

  getSubs = (index: number): string => {
    let val: string;
    switch (index) {
      case 0:
        val = 'st';
        break;
      case 1:
        val = 'nd';
        break;
      case 2:
        val = 'rd';
        break;
      default:
        val = 'th';
    }
    return val;
  };

  ngOnInit(): void {
    [this.selectedTab] = this.subTab;
    this.totalAmount = this.data.totalAmount;
    this.getTicketInfo();
  }

  onSelectTab(sTab: string) {
    this.selectedTab = sTab;
    if (this.selectedTab === 'My Offers') {
      this.getTicketOffers();
    } else if (this.selectedTab === 'My Tickets') {
      this.getTicketInfo();
    }
  }

  activeTickets: object[] = [
    {
      ticketCode: 'SUP50TKT',
      ticketImg: 'ticket.svg',
      expireText: '1st Expiry:',
      expireDate: '16 Dec, ‘22',
      isTooltip: true,
      ticketEventDetails: [
        {
          eventName: '1 Cr Nano Main Event',
          startDate: '12 Dec, ‘22 | 12:55 AM'
        }
      ]
    },
    {
      ticketCode: 'SUP50TKT',
      ticketImg: 'ticket.svg',
      expireText: '1st Expiry:',
      expireDate: '16 Dec, ‘22',
      isTooltip: true,
      ticketEventDetails: [
        {
          eventName: '1 Cr Nano Main Event',
          startDate: '12 Dec, ‘22 | 12:55 AM'
        },
        {
          eventName: 'MHW Big Game',
          startDate: '12 Dec, ‘22 | 12:55 AM'
        }
      ]
    },
    {
      ticketCode: 'SUP50TKT',
      ticketImg: 'ticket.svg',
      expireText: '1st Expiry:',
      expireDate: '16 Dec, ‘22',
      isTooltip: true,
      ticketEventDetails: [
        {
          eventName: 'Heads Up Master'
        }
      ]
    },
    {
      ticketCode: 'SUP50TKT',
      ticketImg: 'ticket.svg',
      expireText: '1st Expiry:',
      expireDate: '16 Dec, ‘22',
      isTooltip: true,
      ticketEventDetails: [],
      unused: 'This ticket is not being used in any tournament'
    }
  ];

  expiredTickets: Array<object> = [
    {
      ticketCode: 'SUP50TKT',
      ticketImg: 'ticketExpired.svg',
      expireDate: '16 Dec, ‘22'
    }
  ];

  offersData: OfferResponse[] = [
    {
      offerId: 2311,
      offerName: 'Nano Daily Adda',
      startDate: '2023-03-22T09:40:17.000Z',
      endDate: "24 Mar,'23",
      originalPrice: '₹ 90,000',
      desktopBanner: 'offerCard.svg',
      tktId: 1875,
      status: 'LIVE',
      purchaseStatus: 'new',
      paymentType: 'existing',
      urgencyMaxUsage: 2,
      maxUsage: 25,
      adminId: 327692,
      totalUsage: 100
    },
    {
      offerId: 2311,
      offerName: 'Nano Daily Adda',
      startDate: '2023-03-22T09:40:17.000Z',
      endDate: "24 Mar,'23",
      originalPrice: 'Original Price- ₹ 1,00,000',
      offerPrice: '₹ 75,000',
      percentOff: 25,
      desktopBanner: 'offerCard.svg',
      tktId: 1875,
      status: 'LIVE',
      purchaseStatus: 'new',
      paymentType: 'existing',
      urgencyMaxUsage: 2,
      maxUsage: 0,
      adminId: 327692,
      totalUsage: 100
    },
    {
      offerId: 2311,
      offerName: 'Nano Daily Adda',
      startDate: '2023-03-22T09:40:17.000Z',
      endDate: "24 Mar,'23",
      originalPrice: 'Original Price- ₹ 1,00,000',
      offerPrice: '₹ 75,000',
      percentOff: 25,
      desktopBanner: 'offerCard.svg',
      tktId: 1875,
      status: 'LIVE',
      purchaseStatus: 'new',
      paymentType: 'existing',
      urgencyMaxUsage: 2,
      maxUsage: 25,
      adminId: 327692,
      totalUsage: 100
    },
    {
      offerId: 2311,
      offerName: 'Nano Daily Adda',
      startDate: '2023-03-22T09:40:17.000Z',
      endDate: "24 Mar,'23",
      originalPrice: 'Original Price- ₹ 75,000',
      offerPrice: '₹ 50,000',
      percentOff: 25,
      desktopBanner: 'purchasedDesktopBanner.svg',
      tktId: 1875,
      status: 'NOT LIVE',
      purchaseStatus: 'PURCHASED',
      paymentType: 'existing',
      urgencyMaxUsage: 2,
      maxUsage: 25,
      adminId: 327692,
      totalUsage: 100
    },
    {
      offerId: 2311,
      offerName: 'Nano Daily Adda',
      startDate: '2023-03-22T09:40:17.000Z',
      endDate: "24 Mar,'23",
      originalPrice: 'Original Price- ₹ 75,000',
      offerPrice: '₹ 50,000',
      percentOff: 25,
      desktopBanner: 'purchasedDesktopBanner.svg',
      tktId: 1875,
      status: 'SOLD OUT',
      purchaseStatus: 'SOLD_OUT',
      paymentType: 'existing',
      urgencyMaxUsage: 2,
      maxUsage: 25,
      adminId: 327692,
      totalUsage: 100
    }
  ];

  openConfirmationDialog(index: number, price: number, offerId: number, tktId: number) {
    this.selectedIndex = index;
    this.offerPrice = price;
    this.offerId = offerId;
    this.ticketId = tktId;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...MATDIALOG.confirmationDialog,
      data: {
        from: 'TICKETS_OFFERS',
        totalAmount: this.totalAmount,
        offerPrice: this.offerPrice,
        offerId: this.offerId,
        tktId: this.ticketId
      }
    });
    const dialog = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result?.code === Cashier.SUCCESS) {
          this.getTicketOffers();
          this.isShowToast = true;
          this.toastValue = {
            message: MessageConstant.TicketPurchasedSuccessfully,
            flag: 'success'
          };
        } else {
          this.isShowToast = true;
          this.toastValue = {
            message: result.message,
            flag: 'error'
          };
        }
      }
    });
    this.subscriptions.push(dialog);
  }

  getTicketInfo() {
    const getTicketInfo$ = this.cashierService.getTicketInfo();
    const getTicketInfo: Subscription = getTicketInfo$?.subscribe({
      next: (res: BaseResponse<TicketInfoResponse>) => {
        this.allTickets = res.data.ticketInfo;
        for (let i = 0; i < this.allTickets.length; i += 1) {
          if (this.allTickets[i].isExpire) {
            this.isExpireFlag = true;
            break;
          }
        }
        this.tktArr = this.allTickets.map((item: TicketInfo) => item.tkt);
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.SomeThingWentWrong,
          flag: 'error'
        };
      }
    });
    this.subscriptions.push(getTicketInfo);
  }

  getTicketOffers() {
    const getTicketOffers$ = this.cashierService.getTicketOffers();
    const getTicketOffers: Subscription = getTicketOffers$.subscribe({
      next: (res: BaseResponse<OffersResponse[]>) => {
        this.allOffers = res.data;
        this.offersList = this.allOffers;
      },
      error: () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.SomeThingWentWrong,
          flag: 'error'
        };
      }
    });
    this.subscriptions.push(getTicketOffers);
  }

  onBack() {
    this.dialog.closeAll();
  }

  backToCashier() {
    this.cashierService.toggleAnimationDialog(this.dialogRef);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }
}
