import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashGamesComponent } from './cash-games.component';

const routes: Routes = [{ path: '', component: CashGamesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashGamesRoutingModule {}
