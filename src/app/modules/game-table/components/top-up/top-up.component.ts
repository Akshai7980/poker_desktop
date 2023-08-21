import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.scss']
})
export class TopUpComponent implements AfterViewInit {
  topUp: number = 20;

  min: number = 30;

  max: number = 50;

  walletAmount: number = 40;

  topUpAmount: string = '₹ 30';

  topUpForm: FormGroup = new FormGroup({});

  constructor(private el: ElementRef, private formBuilder: FormBuilder) {
    this.topUpForm = this.formBuilder.group({
      topUpAmount: ['₹ 30', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.showWalletBar();
  }

  showWalletBar() {
    if (this.walletAmount < this.max) {
      const gameTableSlider: HTMLDivElement =
        this.el.nativeElement.querySelector('.game-table-slider');
      const walletSpan = document.createElement('span');
      walletSpan.style.width = `${((this.walletAmount / this.max) * 100).toString()}%`;
      walletSpan.classList.add('wallet-span');
      gameTableSlider.appendChild(walletSpan);
    }
  }
}
