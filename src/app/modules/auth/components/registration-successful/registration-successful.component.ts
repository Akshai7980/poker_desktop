import { Component, HostBinding, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnimationOptions } from 'ngx-lottie';
import { Paths } from 'projects/shared/src/public-api';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';

@Component({
  selector: 'app-registration-successful',
  templateUrl: './registration-successful.component.html',
  styleUrls: ['./registration-successful.component.scss']
})
export class RegistrationSuccessfulComponent implements OnDestroy {
  @HostBinding('class') class = 'p-rel bg-dark';

  assetsImagePath = Paths.imagePath;

  options: AnimationOptions = {
    path: '/assets/animations/animation.json'
  };

  bonus: number = 0;

  ib: number = 0;

  bb: number = 0;

  sngTickets: number = 0;

  freeRollChips: number = 0;

  private subscription: Subscription;

  constructor(private localStorage: LocalStorageService, private authService: AuthService) {
    this.subscription = this.authService.bonusDetails.subscribe((resp: any) => {
      this.localStorage.setItem('bonusInfo', resp);
      this.bonus = Number.isNaN(resp.bonus) ? 0 : resp.bonus;
      this.ib = resp.ib;
      this.bb = resp.bb;
      this.sngTickets = resp.sngTicket;
      this.freeRollChips = resp.freeRoll;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
