import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChildren
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['../../../assets/styles/index.scss']
})
export class OtpInputComponent implements OnInit, OnChanges {
  formInput = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6'];
  form: FormGroup;
  @ViewChildren('formRow') rows: any;
  @ViewChildren('focusId') focusId: any;
  @Input() isErrorFlag: boolean | undefined;
  @Input() isResetOtpForm: boolean;
  @Output() data = new EventEmitter<string>();

  ngOnInit(): void {
    this.form = this.toFormGroup(this.formInput);
  }

  toFormGroup(elements: any) {
    const group: any = {};
    elements.forEach((key: any) => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  ngOnChanges() {
    if (this.isResetOtpForm) {
      this.form?.reset();
    }
  }

  onPaste(event: ClipboardEvent) {
    const clipboardData: string | undefined = event.clipboardData?.getData('text').toString();
    const regex = /^[0-9\b]+$/;
    if (clipboardData && regex.test(clipboardData) && clipboardData.length === 6) {
      const length: number = 1;
      for (let i = 0; i < this.formInput.length; i += 1) {
        const key = this.formInput[i];
        this.form.controls[key].patchValue(
          clipboardData?.substring(i, i + (length ?? clipboardData.length - i))
        );
      }
      (document.getElementById('input6') as HTMLElement).focus();
      this.data.emit(clipboardData);
    } else {
      event.preventDefault();
    }
  }

  keyUpEvent(event: any, index: number) {
    const formInput = this.form.get(event.srcElement.id);
    if (!formInput?.valid && event.keyCode !== 8) return;

    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos -= 1;
    } else {
      pos += 1;
    }
    if (pos > -1 && pos < this.formInput.length) {
      this.rows._results[pos].nativeElement.focus();
    } else if (this.formInput.length === 6 && event.keyCode !== 8) {
      (document.getElementById('input6') as HTMLElement).blur();
    }

    const data = Object.keys(this.form.value)
      .map((key) => `${this.form.value[key]}`)
      .join('');

    this.data.emit(data);
  }
}
