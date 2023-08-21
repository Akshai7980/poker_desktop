import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CashierService } from '../../services/cashier.service';

@Component({
  selector: 'app-razor-pay',
  templateUrl: './razor-pay.component.html',
  styleUrls: ['./razor-pay.component.scss']
})
export class RazorPayComponent {
  justPayUrl: SafeResourceUrl;

  constructor(
    private cashierService: CashierService,
    public sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.justPayUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.cashierService.razorPayUrl
    );
  }

  onClickBack() {
    this.router.navigateByUrl('addcash');
  }
}
