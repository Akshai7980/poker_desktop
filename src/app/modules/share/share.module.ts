import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AlphanumericDirective } from 'src/app/core/directives/alphanumeric-only.directive';
import { AutocompleteOffDirective } from 'src/app/core/directives/autocomplete-off.directive';
import { NumberDirective } from 'src/app/core/directives/numbers-only.directive';
import { TrackEventDirective } from 'src/app/core/directives/track-event.directive';
import { MaterialModule } from 'src/app/material.module';
import { AvatarSelectionComponent } from './avatar-selection/avatar-selection.component';
import { CustomPotDropdownComponent } from './custom-pot-dropdown/custom-pot-dropdown.component';
import { InputNumberOnlyDirective } from './otp-input/input-number-only.directive';
import { OtpInputComponent } from './otp-input/otp-input.component';
import { OverlayService } from './overlay/overlay.service';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { AppNotificationComponent } from './app-notification/app-notification.component';
import { MttFilterPipe } from './pipes/mtt-filter.pipe';

@NgModule({
  declarations: [
    NumberDirective,
    TrackEventDirective,
    AvatarSelectionComponent,
    OtpInputComponent,
    ProgressSpinnerComponent,
    CustomPotDropdownComponent,
    InputNumberOnlyDirective,
    AutocompleteOffDirective,
    AlphanumericDirective,
    AppNotificationComponent,
    MttFilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    MaterialModule,
    DropdownModule
  ],
  exports: [
    NumberDirective,
    TrackEventDirective,
    AvatarSelectionComponent,
    OtpInputComponent,
    ProgressSpinnerComponent,
    CustomPotDropdownComponent,
    AutocompleteOffDirective,
    AlphanumericDirective,
    AppNotificationComponent,
    InputNumberOnlyDirective,
    MttFilterPipe
  ],
  providers: [OverlayService]
})
export class ShareModule {}
