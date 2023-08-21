import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DropDownItem } from 'projects/shared/src/public-api';

@Component({
  selector: 'app-custom-pot-dropdown',
  templateUrl: './custom-pot-dropdown.component.html',
  styleUrls: ['./custom-pot-dropdown.component.scss']
})
export class CustomPotDropdownComponent implements OnInit {
  showInputText: boolean = false;

  @Input() dropDownListNumberPot: Array<DropDownItem>;

  @Input() inputValue: DropDownItem;

  @Output() value = new EventEmitter();

  invalidBet: boolean = false;

  betOptions: DropDownItem = {} as DropDownItem;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.betOptions = this.setValueToView(this.inputValue);

    const obj = { name: this.betOptions.name, keyName: '' };
    this.value.emit(obj);
  }

  onSettingsChange(event: SelectItem | Event, inputType: number) {
    const modifiedSelectedEvent = event as SelectItem;
    const modifiedEvent = event as Event;

    if (inputType === 0) {
      if (modifiedSelectedEvent.value.keyName === 'Custom') {
        this.betOptions.name = '';
        modifiedSelectedEvent.value.name = '';
        this.showInputText = true;

        const customFieldVar = setTimeout(() => {
          const element = this.elementRef.nativeElement.querySelector('#custom-bet-input');
          this.renderer.selectRootElement(element).focus();
          clearTimeout(customFieldVar);
        }, 10);
      } else this.showInputText = false;

      this.value.emit(modifiedSelectedEvent.value);
    } else {
      this.showInputText = true;

      const target = modifiedEvent.target as HTMLInputElement;
      const valueFromInput = parseInt(target.value, 10);

      if (valueFromInput <= 0 || valueFromInput > 150) {
        if (valueFromInput <= 0) {
          target.value = '30';
        } else {
          target.value = '150';
        }
      }
      const obj = { name: target.value, keyName: '' };
      this.value.emit(obj);
    }
  }

  setValueToView(inputValue: DropDownItem) {
    const dropDownValues = ['30', '40', '50', '60', '70'];
    if (dropDownValues.includes(inputValue.name)) {
      return { name: inputValue.name, keyName: inputValue.name };
    }

    this.showInputText = true;
    return { name: inputValue.name, keyName: 'Custom' };
  }

  onBlur() {
    if (this.inputValue.name === '') {
      this.inputValue = {
        name: '30',
        keyName: '30'
      };
      this.value.emit(this.inputValue);
    }
  }
}
