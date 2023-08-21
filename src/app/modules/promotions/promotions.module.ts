import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import PrimengModule from 'src/app/primeng.module';
import { MaterialModule } from 'src/app/material.module';
import { PromotionsComponent } from './promotions.component';
import { PromotionsRoutingModule } from './promotions-routing.module';
import { PromotionsDialogComponent } from './components/promotions-dialog/promotions-dialog.component';

@NgModule({
  declarations: [PromotionsComponent, PromotionsDialogComponent],
  imports: [CommonModule, MaterialModule, PrimengModule, PromotionsRoutingModule]
})
export class PromotionsModule {}
