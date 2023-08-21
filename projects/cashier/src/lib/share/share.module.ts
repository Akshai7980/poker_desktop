import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayService } from './overlay/overlay.service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, OverlayModule],
  providers: [OverlayService]
})
export class ShareModule {}
