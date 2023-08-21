import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateTablesComponent } from './private-tables.component';

const routes: Routes = [{ path: '', component: PrivateTablesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateTablesRoutingModule {}
