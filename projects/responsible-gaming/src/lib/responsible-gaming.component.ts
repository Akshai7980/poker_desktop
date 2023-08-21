import { Component, HostBinding } from '@angular/core';
import { Paths } from './constants/app-constants';

interface Tabs {
  name: string;
  path: string;
}

@Component({
  selector: 'app-responsible-gaming',
  templateUrl: './responsible-gaming.component.html',
  styleUrls: ['./responsible-gaming.component.scss']
})
export class ResponsibleGamingComponent {
  @HostBinding('class') class = 'd-flex flex-column hp100 ovf-y-auto';
  assetsImagePath = Paths.imagePath;
  tabs: Tabs[] = [
    { name: 'Cash', path: 'cash' },
    { name: 'Tournament', path: 'tournament' },
    { name: 'Sit n Go', path: 'sit-n-go' },
    { name: 'Self-Exclusion', path: 'self-exclusion' },
    { name: 'Deposit Limit', path: 'deposit-limit' }
  ];
}
