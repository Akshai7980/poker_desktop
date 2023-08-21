import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../material.module';
import { AuthModule } from '../modules/auth/auth.module';
import { ProfileModule } from '../modules/profile/profile.module';
import { SettingsModule } from '../modules/settings/settings.module';
import { ShareModule } from '../modules/share/share.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { CoreRoutingModule } from './core-routing.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    SideMenuComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SettingsModule,
    HttpClientModule,
    AuthModule,
    MaterialModule,
    ProfileModule,
    ShareModule
  ],
  exports: [HeaderComponent, FooterComponent, LoaderComponent, SideMenuComponent, LayoutComponent],
  providers: [{ provide: JsonPipe }]
})
export class CoreModule {}
