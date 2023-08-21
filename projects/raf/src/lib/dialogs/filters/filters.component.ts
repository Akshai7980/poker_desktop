import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['../../../assets/styles/_shared.scss']
})
export class FiltersComponent {
  radio: string = 'Last 3 Months';

  @Output() isDualScreen = new EventEmitter<boolean>();

  filterForm: FormGroup = new FormGroup({});

  @Output() value = new EventEmitter<string>();

  currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  @Output() fromDate = new EventEmitter<string | Date>();

  @Output() toDate = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      Last3Months: [],
      Last6Months: [],
      Last9Months: [],
      All: []
    });
  }

  onSelectRadio(event: Event) {
    const target = event.target as HTMLInputElement;
    this.radio = target.value;
    this.fromDate.emit(this.currentDate);
  }

  getDate() {
    if (this.radio === 'Last 3 Months') {
      this.toDate.emit(moment().format('YYYY-MM-DD'));
      this.fromDate.emit(moment().subtract(30, 'days').format('YYYY-MM-DD'));
      this.value.emit(this.radio);
    } else if (this.radio === 'Last 6 Months') {
      this.toDate.emit(moment().format('YYYY-MM-DD'));
      this.fromDate.emit(moment().subtract(60, 'days').format('YYYY-MM-DD'));
      this.value.emit(this.radio);
    } else if (this.radio === 'Last 9 Months') {
      this.toDate.emit(moment().format('YYYY-MM-DD'));
      this.fromDate.emit(moment().subtract(90, 'days').format('YYYY-MM-DD'));
      this.value.emit(this.radio);
    } else if (this.radio === 'All') {
      this.toDate.emit(moment().format('YYYY-MM-DD'));
      this.fromDate.emit(moment().subtract(365, 'days').format('YYYY-MM-DD'));
      this.value.emit(this.radio);
    }
    this.onBackButton();
  }

  onBackButton() {
    this.isDualScreen.emit(false);
  }
}
