import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import PrimengModule from 'src/app/primeng.module';
import { TournamentsComponent } from './tournaments.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { TournamentsRoutingModule } from './tournaments-routing.module';
import { PrizesComponent } from './components/prizes/prizes.component';
import { RulesComponent } from './components/rules/rules.component';
import { PrizeStructureComponent } from './components/prize-structure/prize-structure.component';
import { TournamentDetailsComponent } from './components/tournament-details/tournament-details.component';
import { LateRegistrationComponent } from './dialogs/late-registration/late-registration.component';
import { UnregisterComponent } from './dialogs/unregister/unregister.component';

@NgModule({
  declarations: [
    TournamentsComponent,
    RegistrationComponent,
    PrizesComponent,
    RulesComponent,
    PrizeStructureComponent,
    TournamentDetailsComponent,
    LateRegistrationComponent,
    UnregisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TournamentsRoutingModule,
    MaterialModule,
    PrimengModule
  ]
})
export class TournamentsModule {}
