import { Directive, ElementRef, HostListener } from '@angular/core';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';

@Directive({
  selector: '[appPrev]'
})
export class PrevDirective {
  constructor(private el: ElementRef, private authService: AuthService) {}

  @HostListener('click')
  prevFunc() {
    const elm = this.el.nativeElement.parentElement.parentElement.children[0];

    this.authService.getAvatar(elm.children[2].children[0].id);

    const item = elm.getElementsByClassName('item');

    elm.prepend(item[item.length - 1]);
  }
}
