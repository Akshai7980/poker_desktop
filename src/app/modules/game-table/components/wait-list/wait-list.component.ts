import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wait-list',
  templateUrl: './wait-list.component.html',
  styleUrls: ['./wait-list.component.scss']
})
export class WaitListComponent {
  waitListForm: FormGroup = new FormGroup({});
  @Output() switch = new EventEmitter();

  selectedRadio: string = '';

  constructor(private formBuilder: FormBuilder) {
    this.waitListForm = this.formBuilder.group({
      postBBRadio: ['']
    });
  }

  onSelectRadio(value: string) {
    this.selectedRadio = value;
  }

  executeSwitch() {
    this.switch.emit(true);
  }
}
