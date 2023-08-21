import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { NgxSharedModule } from 'projects/shared/src/lib/shared.module';
import { CashGamesRoutingModule } from './cash-games-routing.module';
import { CashGamesComponent } from './cash-games.component';

import { AvgStackTableComponent } from './avg-stack-table/avg-stack-table.component';
import { FilterSectionComponent } from './filter-section/filter-section.component';
import { GameListComponent } from './game-list/game-list.component';
import { TableDetailsComponent } from './table-details/table-details.component';

@NgModule({
  declarations: [
    CashGamesComponent,
    GameListComponent,
    FilterSectionComponent,
    AvgStackTableComponent,
    TableDetailsComponent
  ],
  imports: [
    CommonModule,
    CashGamesRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSharedModule
  ],
  exports: [TableDetailsComponent, CashGamesComponent]
})
export class CashGamesModule {}
