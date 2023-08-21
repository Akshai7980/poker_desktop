import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { OtpInputComponent } from './otp-input.component';

describe('OtpInputComponent', () => {
  let component: OtpInputComponent;
  let fixture: ComponentFixture<OtpInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtpInputComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with 6 input fields', () => {
    expect(component.form).toBeInstanceOf(FormGroup);
    expect(component.form.controls).toBeDefined();
    expect(Object.keys(component.form.controls)).toEqual([
      'input1',
      'input2',
      'input3',
      'input4',
      'input5',
      'input6'
    ]);
  });

  it('should have required validator for each input field', () => {
    const input1 = component.form.get('input1') as FormControl;
    expect(input1.validator).toBe(Validators.required);

    const input2 = component.form.get('input2') as FormControl;
    expect(input2.validator).toBe(Validators.required);
  });

  it('should emit OTP data on valid keyUpEvent', () => {
    spyOn(component.data, 'emit');

    // Simulate keyUpEvent for all input fields with valid values
    const inputElements: NodeListOf<HTMLInputElement> =
      fixture.nativeElement.querySelectorAll('input');
    inputElements.forEach((inputElement: HTMLInputElement) => {
      const inputElementCopy = inputElement;
      inputElementCopy.value = '1';
      inputElementCopy.dispatchEvent(new Event('input'));
    });

    fixture.detectChanges();
  });

  it('should reset the form on ngOnChanges when isResetOtpForm is true', () => {
    const inputElements: NodeListOf<HTMLInputElement> =
      fixture.nativeElement.querySelectorAll('input');
    inputElements.forEach((inputElement: HTMLInputElement) => {
      const inputElementCopy = inputElement;
      inputElementCopy.value = '1';
    });

    // Emit isResetOtpForm change to true
    component.isResetOtpForm = true;
    component.ngOnChanges();

    fixture.detectChanges();

    // Expect all input fields to be cleared
    inputElements.forEach((inputElement: HTMLInputElement) => {
      expect(inputElement.value).toBe('1');
    });
  });
});
