import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['../../../assets/abstract/_utilities.scss', '../../../assets/components/buttons.scss']
})
export class TransactionFilterComponent implements OnInit {
  @Output() closeFilter: EventEmitter<string> = new EventEmitter<string>();

  @Input() value: any;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  txnFilterForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder) {
    this.txnFilterForm = this.formBuilder.group({
      Last7Days: [],
      Last15Days: [],
      Last30Days: [],
      CurrentFY: [],
      LastFY: []
    });
  }

  ngOnInit(): void {
    this.initiateDefault();
  }

  radio: string = 'Last 15 Days';

  onSelectRadio(event: any) {
    this.radio = event.value;
  }

  initiateDefault() {
    if (this.value) {
      if (this.value.includes('7')) {
        this.radio = 'Last 7 Days';
      } else if (this.value.includes('15')) {
        this.radio = 'Last 15 Days';
      } else if (this.value.includes('30')) {
        this.radio = 'Last 30 Days';
      } else if (this.value.includes('cf')) {
        this.radio = 'Current FY';
      } else {
        this.radio = 'Last FY';
      }
    }
  }

  onFilterApply() {
    if (this.radio.includes('7')) {
      this.valueChange.emit('7');
    } else if (this.radio.includes('15')) {
      this.valueChange.emit('15');
    } else if (this.radio.includes('30')) {
      this.valueChange.emit('30');
    } else if (this.radio.includes('Current FY')) {
      this.valueChange.emit('cf');
    } else {
      this.valueChange.emit('lf');
    }
    this.closeFilter.emit('close');
  }

  close() {
    this.closeFilter.emit('close');
  }
}
