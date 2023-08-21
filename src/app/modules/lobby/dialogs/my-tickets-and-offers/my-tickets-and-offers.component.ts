import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Cashier } from 'projects/cashier/src/lib/constants/app-constants';
import { CashierService } from 'projects/cashier/src/lib/services/cashier.service';
import {
  MATDIALOG,
  Paths,
  BaseResponse,
  OffersResponse,
  MessageConstant
} from 'projects/shared/src/public-api';

import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { TicketInfo, TicketInfoResponse } from '../../models/response/ticket-info.response.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { OfferResponse } from '../models/cashier.model';

@Component({
  selector: 'app-my-tickets-and-offers',
  templateUrl: './my-tickets-and-offers.component.html',
  styleUrls: ['./my-tickets-and-offers.component.scss']
})
export class MyTicketsAndOffersComponent implements OnInit {
  // Note This Component is similar to Cashier So For Any Integration
  // Related imports should be from "app" level not "cashier" project

  assetsImagePath = Paths.imagePath;

  selectedTab: string;

  subTab: string[] = ['My Tickets', 'My Offers'];

  isShowToast: boolean = false;

  toastValue: ToastModel;

  allTickets: any = [];

  allOffers: any = [];

  showEyeIcon: boolean = false;

  totalAmount: any;

  offersList: any;

  offerPrice: any;

  offerId: any;

  purchased: boolean;

  ticketId: any;

  tooltipContent: any;

  tktArr: any;

  selectedIndex: number;

  isExpireFlag: boolean = false;

  tickets: Array<string> = [];

  constructor(
    public dialog: MatDialog,
    public cashierService: CashierService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

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

  activeTickets: any[] = [
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

  expiredTickets: any[] = [
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

  openConfirmationDialog(index: number, price: any, offerId: any, tktId: any) {
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
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result?.code === Cashier.SUCCESS) {
          this.getTicketOffers();
          this.isShowToast = true;
          this.toastValue = {
            message: 'Ticket purchased successfully.',
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
  }

  getTicketInfo() {
    this.cashierService.getTicketInfo().subscribe(
      (res: BaseResponse<TicketInfoResponse>) => {
        if (!res.data) return;
        this.allTickets = res.data.ticketInfo;
        for (let i = 0; i < this.allTickets.length; i += 1) {
          if (this.allTickets[i].isExpire) {
            this.isExpireFlag = true;
            break;
          }
        }
        // extract all tkt values into a new array
        this.tktArr = this.allTickets.map((item: any) => item.tkt);
        const duplicates = this.tktArr.filter(
          (item: any, index: any) => this.tktArr.indexOf(item) !== index
        );
        // filter out only the duplicate values

        if (duplicates.length > 0) {
          this.showEyeIcon = true;
          const tickets = this.tktArr.map(
            (ticket: any, index: any) =>
              `${index + 1}st Ticket: ${moment(ticket.expiryDate).format('D MMM, ‘YY')}`
          );
          this.tooltipContent = tickets.join('\n');
        } else {
          this.showEyeIcon = false;
        }

        // Filtering My Tickets based on the context (Cashier/MTT/SNG)
        switch (this.data.from) {
          case 'SNG':
            this.allTickets = this.allTickets.filter(
              (item: TicketInfo) => item.tournament === null
            );
            break;

          case 'TOURNEY':
            this.allTickets = this.allTickets.filter(
              (item: TicketInfo) => item.tournament !== null
            );
            break;

          // Cashier case
          default:
        }
      },
      () => {
        this.isShowToast = true;

        this.toastValue = {
          message: MessageConstant.ErrorHandHistory,
          flag: 'error'
        };
      }
    );
  }

  getTicketOffers() {
    this.cashierService.getTicketOffers().subscribe(
      (res: BaseResponse<OffersResponse[]>) => {
        this.allOffers = res.data;
        this.offersList = this.allOffers;
      },
      () => {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.ErrorHandHistory,
          flag: 'error'
        };
      }
    );
  }
}
