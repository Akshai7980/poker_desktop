import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'input[alphanumericOnly]'
})
export class AlphanumericDirective {
  @HostListener('keypress', ['$event']) onInputChange(e: any) {
    const regex = /^[a-zA-Z0-9]+$/;
    const str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str) || e.which === 8 || e.which === 13 || e.charCode === 46) {
      return true;
    }
    e.preventDefault();
    return false;
  }
}
