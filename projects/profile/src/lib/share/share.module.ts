import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayService } from './overlay/overlay.service';
import { OtpInputComponent } from './otp-input/otp-input.component';

@NgModule({
  declarations: [OtpInputComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, OverlayModule],
  exports: [OtpInputComponent],
  providers: [OverlayService]
})
export class ShareModule {}
