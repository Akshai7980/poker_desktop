import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: 'input[numbersOnly]'
})
export class NumberDirective implements OnInit {
  inputElem: HTMLInputElement;

  @Input() appNumber: { isDeciTable: boolean };

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.inputElem = this.el.nativeElement;
  }

  @HostListener('keypress', ['$event'])
  @HostListener('paste', ['$event'])
  onInputChange(e: KeyboardEvent | ClipboardEvent) {
    const eNum = e as KeyboardEvent;
    const pastedText = (e as ClipboardEvent).clipboardData?.getData('text/plain');
    if (pastedText) {
      const onlyNumbers = pastedText.replace(/\D/g, '');
      document.execCommand('insertText', false, onlyNumbers);
      e.preventDefault();
      return true;
    }
    if (this.appNumber?.isDeciTable) {
      const regex = /^\d+(\.\d{1,2})?/;
      const str = String.fromCharCode(!eNum.charCode ? eNum.which : eNum.charCode);
      if (regex.test(str) || eNum.which === 8 || eNum.which === 13 || eNum.charCode === 46) {
        return true;
      }
    } else {
      const regex = /^[0-9\b]+$/;
      const str = String.fromCharCode(!eNum.charCode ? eNum.which : eNum.charCode);
      if (regex.test(str) || eNum.which === 8 || eNum.which === 13) {
        return true;
      }
    }
    e.preventDefault();
    return false;
  }
}
