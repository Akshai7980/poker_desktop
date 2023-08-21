import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appInputNumberOnly]'
})
export class InputNumberOnlyDirective implements OnInit {
  inputElem: HTMLInputElement;

  @Input() appNumber: { isDeciTable: boolean };

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.inputElem = this.el.nativeElement;
  }

  @HostListener('keypress', ['$event']) onInputChange(e: KeyboardEvent) {
    if (this.appNumber?.isDeciTable) {
      const regex = /^[0-9]+(\.[0-9]{1,2})?/;
      const str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
      if (regex.test(str) || e.which === 8 || e.which === 13 || e.charCode === 46) {
        return true;
      }
    } else {
      const regex = /^[0-9\b]+$/;
      const str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
      if (regex.test(str) || e.which === 8 || e.which === 13) {
        return true;
      }
    }
    e.preventDefault();
    return false;
  }
}
