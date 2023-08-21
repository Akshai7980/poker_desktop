import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import PrimengModule from 'src/app/primeng.module';
import { NgxSharedModule } from 'projects/shared/src/lib/shared.module';
import { ShareModule } from '../share/share.module';
import { CashGamesModule } from './components/cash-games/cash-games.module';
import { InfoComponent } from './components/info/info.component';
import { LobbyHeaderComponent } from './components/lobby-header/lobby-header.component';
import { PrivateTablesModule } from './components/private-tables/private-tables.module';
import { SitNGoModule } from './components/sit-n-go/sit-n-go.module';
import { TournamentsModule } from './components/tournaments/tournaments.module';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { CreateTableComponent } from './dialogs/create-table/create-table.component';
import { FiltersComponent } from './dialogs/filters/filters.component';
import { IconsLegendComponent } from './dialogs/icons-legend/icons-legend.component';
import { InfoPopupComponent } from './dialogs/info-popup/info-popup.component';
import { InviteYourFriendComponent } from './dialogs/invite-your-friend/invite-your-friend.component';
import { MyTicketsAndOffersComponent } from './dialogs/my-tickets-and-offers/my-tickets-and-offers.component';
import { RegistrationComponent } from './dialogs/registration/registration.component';
import { TournamentScheduleComponent } from './dialogs/tournament-schedule/tournament-schedule.component';
import { LobbyRoutingModule } from './lobby-routing.module';
import { LobbyComponent } from './lobby.component';

@NgModule({
  declarations: [
    LobbyComponent,
    LobbyHeaderComponent,
    InfoComponent,
    IconsLegendComponent,
    FiltersComponent,
    InfoPopupComponent,
    InviteYourFriendComponent,
    CreateTableComponent,
    RegistrationComponent,
    TournamentScheduleComponent,
    MyTicketsAndOffersComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    LobbyRoutingModule,
    CashGamesModule,
    PrivateTablesModule,
    SitNGoModule,
    TournamentsModule,
    ShareModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSharedModule
  ]
})
export class LobbyMainModule {}
