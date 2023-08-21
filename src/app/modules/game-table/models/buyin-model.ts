import { Output, EventEmitter, ChangeDetectorRef, Directive, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MathPipe } from 'src/app/core/pipes/math.pipe';
import { ToFixedPipe } from 'projects/shared/src/lib/pipe/to-fixed.pipe';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  BroadcastService,
  DataStorage,
  GlobalConstant,
  SfsRequestService,
  TickerTimerService,
  UtilityService
} from 'projects/shared/src/public-api';
import { WindowCommService } from 'projects/shared/src/lib/services/window-comm.service';

interface DialogData {
  ringVariant: string;
  roomName: string;
  isDecimalTable: boolean;
  smallBlind: number;
  bigBlind: number;
  buyInHigh: number;
  buyInLow: number;
}
@Directive()
export abstract class BuyInModel {
  buyInData: any;

  @Output() buyInCallback = new EventEmitter();

  isAntiBankingEnabled: boolean;

  isDisableMaxAmtBtn: boolean;

  disableBuyInFormButtons: boolean;

  disabledEmpty: boolean;

  antiBankingMsg: string;

  buyinAmountOption = 'otherAmount';

  isAutoRebuyChecked = false;

  sliderConfig: any = {
    value: 0,
    options: {
      floor: 0,
      ceil: 0,
      step: 1,
      disabled: false,
      showSelectionBar: true,
      hideLimitLabels: true
    }
  };

  buyInTimerLeft = GlobalConstant.MAX_BUY_IN_TIME_LEFT;

  antiBankingTimeLeft = 0;

  private buyinTimerRef$: Subscription;

  private buyInTimeLeft = 0;

  private tickTimerMap: Map<String, any> = new Map();

  private dataStorage: DataStorage = DataStorage.getInstance();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public sfsRequestService: SfsRequestService,
    public tickerTimerService: TickerTimerService,
    public windowCommService: WindowCommService,
    public broadcastService: BroadcastService,
    public utilityService: UtilityService,
    public toFixedPipe: ToFixedPipe,
    public cdr: ChangeDetectorRef,
    public mathPipe: MathPipe
  ) {
    this.buyInData = this.data;
  }

  protected onInit() {
    this.broadcastService.$on('onCancelBuyInForm', (data: any) => {
      if (data) {
        this.cancelBuyInForm();
      }
    });
    this.callTimers();
    this.sliderConfig.options.step = this.buyInData?.isDecimalTable ? 0.01 : 1;
    this.buyInData.bid = JSON.parse(this.buyInData.bid);
    this.buyInData.sid = this.buyInData.sid || -1;
    this.buyInData.srName = this.buyInData.srName || '';
    const { clientData } = this.buyInData;
    if (clientData.buyin) {
      clientData.buyin = clientData.buyin.toLowerCase();
      const buyIn = clientData.buyin.split('/');
      if (buyIn.length > 1) {
        clientData.buyinLow = Number(this.convertCurrency(buyIn[0]));
        clientData.buyinLowOrg = Number(this.convertCurrency(buyIn[0]));
        if (this.buyInData.isTopupForm) {
          clientData.buyinLow =
            this.buyInData.minTopupChips < clientData.buyinLow
              ? clientData.buyinLow
              : this.buyInData.minTopupChips;
        }
        clientData.buyinHigh = Number(this.convertCurrency(buyIn[1]));
        clientData.buyinHighOrg = Number(this.convertCurrency(buyIn[1]));
      }

      // topup must be greater or equals of buyInLow
      if (this.buyInData.isTopupForm && this.buyInData.minTopupChips < clientData.buyinLow) {
        this.buyInData.minTopupChips = clientData.buyinLow;
      }
    }

    // in case of user anti-banking start after send client-ready
    if (this.buyInData.isTopupForm || this.buyInData.asWaiting) {
      this.buyInTimerLeft = GlobalConstant.MAX_WAITLIST_POPOUT_INTERVAL;
    } else if (this.buyInData.bft !== undefined) {
      this.buyInTimerLeft = this.buyInData.bft;
    }

    switch (this.buyInData.bid.ct) {
      case 'vip': {
        let totalAmt = this.buyInData.cashBal;
        // in case of topup user account total amount increase by minTopupChips
        if (this.buyInData.isTopupForm) {
          totalAmt += this.buyInData.minTopupChips - 1;
        }
        clientData.buyinHigh = clientData.buyinHigh > totalAmt ? totalAmt : clientData.buyinHigh;
        break;
      }
      case 'real': {
        let rTotalAmt = this.buyInData.bid.rc;
        // in case of topup user account total amount increase by minTopupChips
        if (this.buyInData.isTopupForm) {
          rTotalAmt += this.buyInData.minTopupChips - 1;
        }
        clientData.buyinHigh = clientData.buyinHigh > rTotalAmt ? rTotalAmt : clientData.buyinHigh;
        break;
      }
      case 'freeroll': {
        let fTotalAmt = this.buyInData.bid.fc;
        // in case of topup user account total amount increase by minTopupChips
        if (this.buyInData.isTopupForm) {
          fTotalAmt += this.buyInData.minTopupChips - 1;
        }
        clientData.buyinHigh = clientData.buyinHigh > fTotalAmt ? fTotalAmt : clientData.buyinHigh;
        break;
      }

      default:
        break;
    }

    if (this.buyInData.bid.ebd && this.buyInData.bid.ebd.enforceBuyIn === true) {
      this.isAntiBankingEnabled = true;
      const minBuyInAmt = this.buyInData?.isDecimalTable
        ? this.buyInData.bid.ebd.lastBuyInAmountDecimal
        : this.buyInData.bid.ebd.lastBuyInAmount;

      if (!this.sliderConfig.options.disabled) {
        clientData.buyinLow = minBuyInAmt;
        clientData.buyinLowOrg = minBuyInAmt;
      }

      this.sliderConfig.value = this.buyInData?.isDecimalTable
        ? this.toFixedPipe.transform(minBuyInAmt, 2)
        : minBuyInAmt;
      // if buy-in high amount less then antibanking
      // amount then disable max-amount and other amount field
      if (clientData.buyinHigh < minBuyInAmt) {
        this.disableBuyInFormButtons = true;
        this.sliderConfig.options.disabled = true;
      }

      this.antiBankingTimeLeft = this.buyInData.abt;
      this.tickTimerMap.set('calculateAntiBankingTimer', [this.calculateAntiBankingTimer, {}]);
    } else if (this.buyInData.isTopupForm) {
      this.sliderConfig.value = this.buyInData?.isDecimalTable
        ? this.toFixedPipe.transform(
            (
              this.buyInData.minTopupChips +
              (clientData.buyinHigh - this.buyInData.minTopupChips) / 2
            ).toFixed(2),
            2
          )
        : parseInt(
            this.buyInData.minTopupChips +
              (clientData.buyinHigh - this.buyInData.minTopupChips) / 2,
            10
          );
    } else {
      this.sliderConfig.value = this.buyInData?.isDecimalTable
        ? this.toFixedPipe.transform(
            Number(clientData.buyinLow + (clientData.buyinHigh - clientData.buyinLow) / 2),
            2
          )
        : parseInt(clientData.buyinLow + (clientData.buyinHigh - clientData.buyinLow) / 2, 10);
    }

    // If Buyin form slider disabled with value set to minimum
    if (this.sliderConfig.value === clientData.buyinHigh) {
      clientData.buyinHigh = clientData.buyinHighOrg;
      this.disableBuyInFormButtons = true;
      this.disabledEmpty = true;
    }
    if (this.buyInData && this.buyInData?.isDecimalTable) {
      this.sliderConfig.options.ceil = Number(clientData.buyinHigh);
      this.sliderConfig.options.floor = this.buyInData.isTopupForm
        ? this.buyInData.minTopupChips
        : clientData.buyinLow;
      this.sliderConfig.options.floor = Number(this.sliderConfig.options.floor);
    } else {
      this.sliderConfig.options.ceil = Math.floor(clientData.buyinHigh);
      this.sliderConfig.options.floor = this.buyInData.isTopupForm
        ? this.buyInData.minTopupChips
        : clientData.buyinLow;
    }

    this.tickTimerMap.set('calculateBuyInTimer', [this.calculateBuyInTimer, {}]);
    this.cdr.detectChanges();
  }

  // convert short amount to long or long amount to short
  private convertCurrency(amt: string) {
    let newAmt: any = amt;
    if (newAmt.indexOf('k') !== -1) {
      newAmt = amt.split('k');
      newAmt = Number(newAmt[0]) * 1000;
    }
    return newAmt;
  }

  // start buy-in timer
  private calculateBuyInTimer(data: any, tickTime: number) {
    this.buyInTimeLeft += tickTime;
    if (Math.floor(this.buyInTimeLeft / 1000) === 1) {
      this.buyInTimeLeft %= 1000;
      this.buyInTimerLeft -= 1;
      if (this.buyInTimerLeft <= 0) {
        this.cancelBuyInForm();
        this.tickTimerMap.delete('calculateBuyInTimer');
      } else {
        this.cdr.detectChanges();
      }
    }
  }

  // calculate antibanking timer
  private calculateAntiBankingTimer(data: any, tickTime: number) {
    this.antiBankingTimeLeft -= tickTime;
    if (this.antiBankingTimeLeft < 0) {
      this.tickTimerMap.delete('calculateAntiBankingTimer');
    }
  }

  // stop buy-in timer
  private stopBuyInTimer() {
    if (this.buyinTimerRef$) {
      this.buyinTimerRef$.unsubscribe();
    }
  }

  // on click OK button of buy-in form
  okBuyInForm() {
    if (this.buyinAmountOption === 'maxAmount') {
      this.sliderConfig.value = this.buyInData.clientData.buyinHigh;
    }

    // convert into Number
    if (this.buyInData?.isDecimalTable) {
      this.sliderConfig.value = Number(Number(this.sliderConfig.value).toFixed(2));
    } else {
      this.sliderConfig.value = Number(this.sliderConfig.value);
    }

    // if (this.buyInData.isTopupForm) {
    // const topupMinBuyin = this.buyInData.clientData.buyinLow - addValueByOne;
    // const topupMaxBuyin = this.buyInData.clientData.buyinHigh + addValueByOne;

    // if user not given correct Top-up amount then show alert msg otherwise request for Topup
    // if (
    //   this.sliderConfig.value <= topupMinBuyin
    //   || Number.isNaN(this.sliderConfig.value)
    //   || this.sliderConfig.value >= topupMaxBuyin
    // ) {
    // const msg = `Amount must be greater than
    // ${topupMinBuyin} and less than ${topupMaxBuyin}`;
    // this.msgDialogService.open(msg, { showCancelButton: false, dialogTitle: 'INFO' });
    // } else {
    // this.sfsRequestService.requestForTopup({
    //   amt: this.sliderConfig.value,
    //   seatid: this.buyInData.sid,
    //   roomName: this.buyInData.roomName,
    // });
    // }
    // } else {
    // if user not given correct buy-in amount then show alert msg otherwise request for Game Play
    // if (
    //   Number.isNaN(this.sliderConfig.value)
    //   || (!this.isAntiBankingEnabled
    //     && this.sliderConfig.value > this.buyInData.clientData.buyinHigh)
    //   || this.sliderConfig.value < this.buyInData.clientData.buyinLow
    //   || (this.isAntiBankingEnabled
    //     && this.sliderConfig.value > this.buyInData.clientData.buyinHigh
    //     && this.sliderConfig.value !== this.buyInData.bid.ebd.lastBuyInAmountDecimal)
    // ) {
    // this.msgDialogService.open(MessageConstant.amountBwtBuyINlowAndHighMsg, {
    //   showCancelButton: false,
    // });
    //   if (
    //     (this.dataStorage.newServer || this.buyInData.isAntiBumGame)
    //     && this.buyInData.isDynamic
    //   ) {
    //     if (
    //       this.buyInData.srName
    //       && this.buyInData.sid
    //       && this.buyInData.srName !== ''
    //       && this.buyInData.sid !== -1
    //     ) {
    //       this.sfsRequestService.requestForCancelGamePlay(
    //         this.buyInData.srName,
    //         this.buyInData.sid,
    //         this.buyInData.gcId,
    //       );
    //     }
    //   } else {
    //     const params = {
    //       seatId: this.buyInData.sid,
    //       reserve: false,
    //       isWaiting: false,
    //     };
    //     this.sfsRequestService.seatReservationRequest(params, this.buyInData.srName);
    //   }
    // } else if (
    //   (this.dataStorage.newServer || this.buyInData.isAntiBumGame)
    //   && this.buyInData.isDynamic
    // ) {
    //   this.sfsRequestService.requestForCancelGamePlay(
    //     this.buyInData.srName,
    //     this.buyInData.sid,
    //     this.sliderConfig.value,
    // this.buyInData.gcId,
    // this.buyInData.fRoom,
    // this.isAutoRebuyChecked,
    //   );
    // } else {
    //   let params;
    //   if (!this.platformDetection.isDesktop) {
    //     params = {
    //       seatid: this.buyInData.sid,
    //       amt: this.sliderConfig.value,
    //       autoRebuy: this.isAutoRebuyChecked,
    //     };
    //   } else {
    //     params = {
    //       seatid: this.buyInData.sid,
    //       amt: this.sliderConfig.value,
    //       autoRebuy: false,
    //     };
    //   }
    //   this.sfsRequestService.takeSeatRequest(params, this.buyInData.srName);
    // }
    // }
    this.buyInCallback.emit();
  }

  // closeBuyinPopup() {
  //   setTimeout(() => {
  //     this.buyInCallback.emit();
  //   }, 500);
  // }

  // on close buy-in form
  cancelBuyInForm() {
    let isCloseRoom = false;
    if ((this.dataStorage.newServer || this.buyInData.isAntiBumGame) && this.buyInData.isDynamic) {
      if (
        this.buyInData.srName &&
        this.buyInData.sid &&
        this.buyInData.srName !== '' &&
        this.buyInData.sid !== -1
      ) {
        this.sfsRequestService.requestForCancelGamePlay(
          this.buyInData.srName,
          this.buyInData.sid,
          this.buyInData.gcId
        );
      }
      if (this.buyInData.ispb !== undefined) {
        isCloseRoom = !this.buyInData.ispb;
      }
    } else {
      const params = {
        seatId: this.buyInData.sid,
        reserve: false,
        isWaiting: false
      };
      this.sfsRequestService.seatReservationRequest(params, this.buyInData.srName);
    }
    this.buyInCallback.emit({ isCloseRoom });
  }

  // on slider value change
  onInputChange(event: any) {
    if (this.buyInData && this.buyInData?.isDecimalTable) {
      this.sliderConfig.value = this.toFixedPipe.transform(Number(event.value), 2);
    } else {
      this.sliderConfig.value = event.value;
    }
  }

  // open setting window buy-in preferences
  // openBuyInPreference() {
  //   if (this.buyInData.fRoom === '') {
  //     // this.mainService.openSettingWindow({ isFromBuyIn: true });
  //   } else {
  //     // if (
  //     // this.windowCommService.isAlreadyOpenWindow(WindowManagerConstant.WINDOW_TYPE.SETTINGS)
  //     // ) {
  //     //   this.windowCommService.focusWindow(WindowManagerConstant.WINDOW_TYPE.SETTINGS);
  //     //   this.windowCommService.sendDataToChildWindow({
  //     //     cmd: 'showSettingWindow',
  //     //     data: { isFromBuyIn: true },
  //     //     windowType: WindowManagerConstant.WINDOW_TYPE.LOBBY,
  //     //   });
  //     // } else {
  //     //   this.windowCommService.sendDataToChildWindow({
  //     //     cmd: 'showSettingWindow',
  //     //     data: { isFromBuyIn: true },
  //     //     windowType: WindowManagerConstant.WINDOW_TYPE.LOBBY,
  //     //   });
  //     // }
  //   }
  // }

  // buy-in form slider minus, plus button handling
  buyInFormSliderHandler(event: MouseEvent, btnName: string) {
    if (btnName === 'onMinus') {
      if (Number(this.sliderConfig.value) > Number(this.sliderConfig.options.floor)) {
        this.sliderConfig.value *= 1;
        this.sliderConfig.value -= this.buyInData.clientData.buyinLow;
        if (this.buyInData.clientData.buyinLow % 1 === 0) {
          this.sliderConfig.value = this.buyInData?.isDecimalTable
            ? this.toFixedPipe.transform(this.sliderConfig.value, 2)
            : this.sliderConfig.value;
        } else {
          this.sliderConfig.value = this.buyInData?.isDecimalTable
            ? this.sliderConfig.value.toFixed(2)
            : this.sliderConfig.value;
        }
        if (this.sliderConfig.value < this.sliderConfig.options.floor) {
          this.sliderConfig.value = this.buyInData?.isDecimalTable
            ? this.toFixedPipe.transform(this.sliderConfig.options.floor, 2)
            : this.sliderConfig.options.floor;
        }
      }
    } else if (Number(this.sliderConfig.value) < Number(this.sliderConfig.options.ceil)) {
      this.sliderConfig.value *= 1;
      this.sliderConfig.value += this.buyInData.clientData.buyinLow;
      if (this.sliderConfig.value % 1 === 0) {
        this.sliderConfig.value = this.buyInData.isDecimalTable
          ? this.toFixedPipe.transform(this.sliderConfig.value, 2)
          : this.sliderConfig.value;
      } else {
        this.sliderConfig.value = this.buyInData.isDecimalTable
          ? this.sliderConfig.value.toFixed(2)
          : this.sliderConfig.value;
      }

      if (this.sliderConfig.value > this.sliderConfig.options.ceil) {
        this.sliderConfig.value = this.buyInData.isDecimalTable
          ? this.toFixedPipe.transform(this.sliderConfig.options.ceil, 2)
          : this.sliderConfig.options.ceil;
      }
    }
  }

  // callTimers() {
  //   this.stopBuyInTimer();
  //   this.buyinTimerRef$ = this.tickerTimerService.tickerMessage.subscribe((tickerMessage) => {
  //     for (const timer of Array.from(this.tickTimerMap.values())) {
  //       timer[0].call(this, timer[1], tickerMessage.tickTime);
  //     }
  //   });
  // }

  callTimers() {
    this.stopBuyInTimer();
    this.buyinTimerRef$ = this.tickerTimerService.tickerMessage.subscribe((tickerMessage) => {
      Array.from(this.tickTimerMap.values()).forEach((timer) => {
        timer[0].call(this, timer[1], tickerMessage.tickTime);
      });
    });
  }

  // isInteger(event: any) {
  //   if (this.buyInData.isDecimalTable) {
  //     return;
  //   }

  //   const obj: any = document.getElementById('buyInAmt');
  //   const startPos = obj.selectionStart;
  //   if (startPos === 0 && String.fromCharCode(event.which) === '0') {
  //     obj.setSelectionRange(event?.target?.value.length, event.target.value.length);
  //     return false;
  //   }
  // }

  isInteger(event: any) {
    if (this.buyInData.isDecimalTable) {
      return undefined;
    }

    const obj: any = document.getElementById('buyInAmt');
    const startPos = obj.selectionStart;
    if (startPos === 0 && String.fromCharCode(event.which) === '0') {
      obj.setSelectionRange(event?.target?.value.length, event.target.value.length);
      return false;
    }

    return undefined;
  }

  protected onDestroy() {
    // this.stopBuyInTimer();
    this.broadcastService.$off('onCancelBuyInForm');
  }
}
