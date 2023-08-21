import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import PrimengModule from 'src/app/primeng.module';
import { NgxSharedModule } from 'projects/shared/src/lib/shared.module';
import { ShareModule } from '../share/share.module';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [{ path: '', component: ContactUsComponent, pathMatch: 'full' }];

@NgModule({
  declarations: [ContactUsComponent],
  providers: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    PrimengModule,
    ShareModule,
    NgxSharedModule
  ]
})
export class ContactUsModule {}
