import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[autocompleteOff]'
})
export class AutocompleteOffDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.setAttribute('autocomplete', 'off');
    this.el.nativeElement.setAttribute('autocapitalize', 'none');
  }
}
