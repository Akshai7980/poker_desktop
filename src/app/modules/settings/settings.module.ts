import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import PrimengModule from 'src/app/primeng.module';
import { NgxSharedModule } from 'projects/shared/src/lib/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ShareModule } from '../share/share.module';
import { BuyInPreferencesComponent } from './components/buy-in-preferences/buy-in-preferences.component';
import { GameSettingsComponent } from './components/game-settings/game-settings.component';
import { SettingsBetOptionComponent } from './components/settings-bet-option/settings-bet-option.component';
import { SettingsHotKeysComponent } from './components/settings-hot-keys/settings-hot-keys.component';
import { SettingsSoundComponent } from './components/settings-sound/settings-sound.component';
import { SettingsThemeComponent } from './components/settings-theme/settings-theme.component';
import { ThemeTablePreviewComponent } from './components/theme-table-preview/theme-table-preview.component';
import { TourneyThemeTablePreviewComponent } from './components/tourney-theme-table-preview/tourney-theme-table-preview.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'game-settings', pathMatch: 'full' },
      { path: 'game-settings', component: GameSettingsComponent, pathMatch: 'full' },
      { path: 'buy-in-preferences', component: BuyInPreferencesComponent, pathMatch: 'full' },
      { path: 'bet-options', component: SettingsBetOptionComponent, pathMatch: 'full' },
      { path: 'hot-keys', component: SettingsHotKeysComponent, pathMatch: 'full' },
      { path: 'sound', component: SettingsSoundComponent, pathMatch: 'full' },
      { path: 'theme', component: SettingsThemeComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsThemeComponent,
    SettingsBetOptionComponent,
    SettingsHotKeysComponent,
    GameSettingsComponent,
    BuyInPreferencesComponent,
    SettingsSoundComponent,
    ThemeTablePreviewComponent,
    TourneyThemeTablePreviewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    PrimengModule,
    ReactiveFormsModule,
    ShareModule,
    NgxSharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SettingsModule {}
