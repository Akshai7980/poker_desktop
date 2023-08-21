import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToFixedPipe } from 'projects/shared/src/lib/pipe/to-fixed.pipe';
import { MathPipe } from 'src/app/core/pipes/math.pipe';
import {
  BroadcastService,
  LobbyService,
  SfsRequestService,
  TickerTimerService,
  UtilityService
} from 'projects/shared/src/public-api';
import { WindowCommService } from 'projects/shared/src/lib/services/window-comm.service';
import { BuyInModel } from '../../models/buyin-model';

interface DialogData {
  ringVariant: string;
  roomName: string;
  isDecimalTable: boolean;
  smallBlind: number;
  bigBlind: number;
  buyInHigh: number;
  buyInLow: number;
}

@Component({
  selector: 'app-buy-in',
  templateUrl: './buy-in.component.html',
  styleUrls: ['./buy-in.component.scss']
})
export class BuyInComponent extends BuyInModel implements OnInit, AfterViewInit {
  buyIn: number = 0;

  min: number = 0;

  max: number = 0;

  walletAmount: number = 300;

  buyInAmount: string;

  buyInForm: FormGroup = new FormGroup({});

  currRoomData: object;

  isInSufficient: string = '1';

  timeLeft: number = 40;

  minute: string | number | undefined = '00';

  second: string | number | undefined = '00';

  value: number[] = [0, 100];

  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public override data: DialogData,
    public dialogRef: MatDialogRef<BuyInComponent>,
    public override sfsRequestService: SfsRequestService,
    public override tickerTimerService: TickerTimerService,
    public override windowCommService: WindowCommService,
    public override cdr: ChangeDetectorRef,
    public lobbyService: LobbyService,
    public override utilityService: UtilityService,
    public override broadcastService: BroadcastService,
    public override mathPipe: MathPipe,
    public override toFixedPipe: ToFixedPipe
  ) {
    super(
      data,
      sfsRequestService,
      tickerTimerService,
      windowCommService,
      broadcastService,
      utilityService,
      toFixedPipe,
      cdr,
      mathPipe
    );
  }

  ngOnInit(): void {
    this.buyInForm = this.formBuilder.group({
      buyInAmount: ['', Validators.required]
    });

    this.buyIn = this.data.buyInLow;
    const buyInAmount = `₹ ${this.data.buyInLow.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
    this.buyInForm.controls['buyInAmount'].setValue(buyInAmount);

    super.onInit();
    this.cdr.detectChanges();
  }

  handleValueChange(event: any) {
    this.buyIn = event.value;
    const buyInAmount = `₹ ${event.value.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
    this.buyInForm.controls['buyInAmount'].setValue(buyInAmount);
    if (event.value > this.walletAmount) {
      this.isInSufficient = '2';
    } else this.isInSufficient = '1';
  }

  onAmountInput(event: Event) {
    this.isInSufficient = '1';
    const target = event.target as HTMLInputElement;
    if (event) {
      const amountString = target.value ? target.value : '₹ 0';
      const amountWithoutSymbol = amountString.replace(/[^0-9]/g, '');
      const amount = parseInt(amountWithoutSymbol, 10);

      if (!Number.isNaN(amount) && amount > -1) {
        this.value = [0, amount];
        this.cdr.detectChanges();

        const isInValidRange = amount >= this.data.buyInLow && amount <= this.data.buyInHigh;
        this.isInSufficient = isInValidRange && amount > this.walletAmount ? '2' : '1';
        if (isInValidRange) {
          if (amount > this.walletAmount) {
            this.isInSufficient = '2';
          } else {
            this.isInSufficient = '1';
          }
        } else {
          this.isInSufficient = '3';
        }
      }
    }
  }

  startTimer() {
    this.timeLeft = 40;
    const interval = setInterval(() => {
      if (this.timeLeft >= 0) {
        const m: number = Math.floor(this.timeLeft / 60);
        const s: number = this.timeLeft % 60;
        this.minute = m < 10 ? `0${m}` : m;
        this.second = s < 10 ? `0${s}` : s;
        if (m === 0 && s === 0) {
          this.dialogRef.close();
        }

        this.timeLeft -= 1;
      } else {
        clearTimeout(interval);
      }
    }, 1000);
  }

  ngAfterViewInit(): void {
    this.showWalletBar();
  }

  showWalletBar() {
    if (this.walletAmount < this.data.buyInHigh) {
      const gameTableSlider: HTMLDivElement =
        this.el.nativeElement.querySelector('.game-table-slider');
      const walletSpan = document.createElement('span');
      walletSpan.style.width = `${((this.walletAmount / this.data.buyInHigh) * 100).toString()}%`;
      walletSpan.classList.add('wallet-span');
      gameTableSlider.appendChild(walletSpan);
    }
  }
}
