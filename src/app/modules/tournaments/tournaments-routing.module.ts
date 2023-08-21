import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentsComponent } from './tournaments.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { PrizesComponent } from './components/prizes/prizes.component';
import { RulesComponent } from './components/rules/rules.component';
import { PrizeStructureComponent } from './components/prize-structure/prize-structure.component';

const routes: Routes = [
  {
    path: '',
    component: TournamentsComponent,
    children: [
      { path: '', redirectTo: 'registration', pathMatch: 'full' },
      { path: 'registration', component: RegistrationComponent, pathMatch: 'full' },
      { path: 'prizes', component: PrizesComponent, pathMatch: 'full' },
      { path: 'rules', component: RulesComponent, pathMatch: 'full' },
      { path: 'prize-structure', component: PrizeStructureComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentsRoutingModule {}
