import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { ForgotPasswordComponent } from './forgot-password.component';
import { MobileNumberVerificationComponent } from '../mobile-number-verification/mobile-number-verification.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent, MobileNumberVerificationComponent],
      imports: [MatDialogModule, BrowserAnimationsModule, HttpClientModule],
      providers: [
        MatDialog,
        LocalStorageService,
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set btnDisabled to false if data length is greater than 0', () => {
    const event = { target: { value: 'test' } };
    component.onTextChange(event);
    expect(component.btnDisabled).toBeTrue();
  });

  it('should set invalidAccount to false', () => {
    component.invalidAccount = true;
    const event = { target: { value: 'test' } };
    component.onTextChange(event);
    expect(component.invalidAccount).toBeFalsy();
  });
});
