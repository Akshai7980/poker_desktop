import { Directive, ElementRef, HostListener } from '@angular/core';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';

@Directive({
  selector: '[appNext]'
})
export class NextDirective {
  constructor(private el: ElementRef, private authService: AuthService) {}

  @HostListener('click')
  nextFunc() {
    const elm = this.el.nativeElement.parentElement.parentElement.children[0];
    this.authService.getAvatar(elm.children[2].children[0].id);
    const item = elm.getElementsByClassName('item');

    elm.append(item[0]);
  }
}
