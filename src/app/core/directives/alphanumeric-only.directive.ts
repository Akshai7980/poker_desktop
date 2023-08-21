import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'input[alphanumericOnly]'
})
export class AlphanumericDirective {
  @HostListener('keypress', ['$event']) onInputChange(e: KeyboardEvent) {
    const regex = /^[a-zA-Z0-9]+$/;
    const str = e.key;
    if (regex.test(str) || e.key === 'Backspace' || e.key === 'Enter' || e.key === '.') {
      return true;
    }
    e.preventDefault();
    return false;
  }
}
