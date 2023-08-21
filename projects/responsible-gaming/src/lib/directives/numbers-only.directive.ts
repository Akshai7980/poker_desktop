import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: 'input[numbersOnly]'
})
export class NumberDirective implements OnInit {
  inputElem: HTMLInputElement;

  @Input() appNumber: any;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.inputElem = this.el.nativeElement;
  }

  @HostListener('keypress', ['$event']) onInputChange(e: KeyboardEvent) {
    if (this.appNumber?.isDeciTable) {
      const regex = /^\d+(\.\d{1,2})?/;
      const str = e.key;
      if (regex.test(str) || e.key === 'Backspace' || e.key === 'Enter' || e.key === '.') {
        return true;
      }
    } else {
      const regex = /^[0-9\b]+$/;
      const str = e.key;
      if (regex.test(str) || e.key === 'Backspace' || e.key === 'Enter') {
        return true;
      }
    }
    e.preventDefault();
    return false;
  }
}
