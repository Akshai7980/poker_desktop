import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-raf',
  templateUrl: './raf.component.html'
})
export class RafComponent {
  @HostBinding('class') class = 'd-flex flex-column hp100 bg-grey100 p-rel ovf-y-auto';
}
