import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-anti-banking',
  templateUrl: './anti-banking.component.html',
  styleUrls: ['./anti-banking.component.scss']
})
export class AntiBankingComponent implements AfterViewInit {
  buyIn: number = 20;

  min: number = 10;

  max: number = 50;

  walletAmount: number = 40;

  buyInAmount: string = '₹ 10';

  buyInForm: FormGroup = new FormGroup({});

  constructor(private el: ElementRef, private formBuilder: FormBuilder) {
    this.buyInForm = this.formBuilder.group({
      buyInAmount: ['₹ 10', Validators.required]
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
