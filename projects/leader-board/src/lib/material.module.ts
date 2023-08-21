import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatTooltipModule
  ],
  exports: [
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatTooltipModule
  ]
})
export class MaterialModule {}
