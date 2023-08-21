import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from 'src/app/modules/share/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSharedModule } from 'projects/shared/src/lib/shared.module';
import { PrivateTablesRoutingModule } from './private-tables-routing.module';
import { PrivateTablesComponent } from './private-tables.component';
import { PrivateTableDetailsComponent } from './private-table-details/private-table-details.component';

@NgModule({
  declarations: [PrivateTablesComponent, PrivateTableDetailsComponent],
  imports: [
    CommonModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    PrivateTablesRoutingModule,
    NgxSharedModule
  ],
  exports: [PrivateTableDetailsComponent]
})
export class PrivateTablesModule {}
