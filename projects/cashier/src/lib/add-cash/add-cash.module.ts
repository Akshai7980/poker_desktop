import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxSharedModule } from 'projects/shared/src/public-api';
import { MaterialModule } from '../material.module';
import PrimengModule from '../primeng.module';
import { ViewAppliedSuccessfullyComponent } from './view-applied-successfully/view-applied-successfully.component';
import { ViewStatusComponent } from './view-status/view-status.component';
import { AddCashComponent } from './add-cash.component';
import { RazorPayComponent } from './razor-pay/razor-pay.component';

const routes: Routes = [
  { path: '', component: AddCashComponent, pathMatch: 'full' },
  {
    path: 'view-applied-successfully',
    component: ViewAppliedSuccessfullyComponent,
    pathMatch: 'full'
  },
  {
    path: 'razor-pay',
    component: RazorPayComponent,
    pathMatch: 'full'
  },
  { path: 'payment-complete/:id', component: ViewStatusComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AddCashComponent,
    ViewAppliedSuccessfullyComponent,
    ViewStatusComponent,
    RazorPayComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSharedModule
  ]
})
export class AddCashModule {}
