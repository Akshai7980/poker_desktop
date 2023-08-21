import { Component, Input } from '@angular/core';
import { CreditedToWallet } from '../../models/response/payoff-history.response';

@Component({
  selector: 'app-other-prizes',
  templateUrl: './other-prizes.component.html',
  styleUrls: ['./other-prizes.component.scss']
})
export class OtherPrizesComponent {
  @Input() creditedToWallet: CreditedToWallet;
}
