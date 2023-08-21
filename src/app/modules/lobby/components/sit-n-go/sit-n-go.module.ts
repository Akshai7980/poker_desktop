import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareModule } from 'src/app/modules/share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import PrimengModule from 'src/app/primeng.module';
import { MaterialModule } from 'src/app/material.module';
import { SngTableDetailsComponent } from './sng-table-details/sng-table-details.component';
import { SitNGoComponent } from './sit-n-go.component';
import { SitNGoRoutingModule } from './sit-n-go-routing.module';

@NgModule({
  declarations: [SitNGoComponent, SngTableDetailsComponent],
  imports: [
    CommonModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    SitNGoRoutingModule,
    PrimengModule,
    MaterialModule
  ],
  exports: [SngTableDetailsComponent]
})
export class SitNGoModule {}
