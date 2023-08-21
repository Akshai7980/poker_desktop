import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import PrimengModule from 'src/app/primeng.module';

import { CashComponent } from './cash/cash.component';
import { MyStatsRoutingModule } from './my-stats-routing.module';
import { MyStatsComponent } from './my-stats/my-stats.component';
import { TournamentComponent } from './tournament/tournament.component';

@NgModule({
  declarations: [MyStatsComponent, CashComponent, TournamentComponent],
  imports: [CommonModule, MyStatsRoutingModule, MaterialModule, PrimengModule]
})
export class MyStatsModule {}
