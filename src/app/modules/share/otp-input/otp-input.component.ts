import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss']
})
export class OtpInputComponent implements OnInit, OnChanges {
  formInput = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6'];

  form: FormGroup;

  @ViewChildren('formRow') rows: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChildren('focusid') focusid: QueryList<ElementRef<HTMLInputElement>>;

  @Input() isErrorFlag: boolean | undefined;

  @Input() isResetOtpForm: boolean;

  @Output() data = new EventEmitter<string>();

  ngOnInit(): void {
    this.form = this.toFormGroup(this.formInput);
  }

  toFormGroup(elements: string[]) {
    const group: { [key: string]: FormControl } = {};
    elements.forEach((key: string) => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  ngOnChanges() {
    if (this.isResetOtpForm) {
      this.form.reset();
      // Here you can reset your form
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
        this.rows.toArray()[i].nativeElement.blur();
      }

      this.data.emit(clipboardData);
    } else {
      event.preventDefault();
    }
  }

  keyUpEvent(event: KeyboardEvent, index: number) {
    if (
      event.code === 'ControlLeft' ||
      event.code === 'ControlRight' ||
      event.ctrlKey ||
      event.code === 'KeyV'
    ) {
      return;
    }

    const formInput = this.form.get((event.target as HTMLInputElement).id);
    if (!formInput?.valid && event.keyCode !== 8) return;

    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < this.formInput.length) {
      this.rows.toArray()[pos].nativeElement.focus();
    } else if (this.formInput.length === 6 && event.keyCode !== 8) {
      this.rows.toArray()[5].nativeElement.blur();
    }

    const data = Object.keys(this.form.value)
      .map((key) => `${this.form.value[key]}`)
      .join('');
    this.data.emit(data);
  }
}
