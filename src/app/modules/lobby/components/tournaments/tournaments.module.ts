import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { ShareModule } from 'src/app/modules/share/share.module';
import { TournamentsRoutingModule } from './tournaments-routing.module';
import { TournamentsComponent } from './tournaments.component';
import { FilterSectionComponent } from './filter-section/filter-section.component';
import { GameListComponent } from './game-list/game-list.component';
import { TournamentRhsComponent } from './tournament-rhs/tournament-rhs.component';

@NgModule({
  declarations: [
    TournamentsComponent,
    FilterSectionComponent,
    GameListComponent,
    TournamentsComponent,
    TournamentRhsComponent
  ],
  imports: [
    CommonModule,
    TournamentsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    ShareModule
  ],
  exports: [TournamentRhsComponent]
})
export class TournamentsModule {}
