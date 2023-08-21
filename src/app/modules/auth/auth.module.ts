import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import PrimengModule from 'src/app/primeng.module';
import { NgxSharedModule } from 'projects/shared/src/lib/shared.module';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { ShareModule } from '../share/share.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { AccountBlockedComponent } from './components/account-blocked/account-blocked.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { MobileNumberVerificationComponent } from './components/mobile-number-verification/mobile-number-verification.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PromoCodeComponent } from './components/promo-code/promo-code.component';
import { SideBannerComponent } from './components/side-banner/side-banner.component';
import { TermsComponent } from './components/terms/terms.component';
import { UsernameComponent } from './components/username/username.component';
import { WelcomeScreenComponent } from './components/welcome-screen/welcome-screen.component';
import { NextDirective } from './directives/next.directive';
import { GeoLocationBlockedComponent } from './components/geo-location-blocked/geo-location-blocked.component';
import { RegistrationSuccessfulComponent } from './components/registration-successful/registration-successful.component';
import { AlertComponent } from './components/alert/alert.component';
import { AlphanumericDirective } from './directives/alphanumeric-only.directive';
import { PrevDirective } from './directives/prev.directive';
import { MultiAccountingComponent } from './components/multi-accounting/multi-accounting.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    PromoCodeComponent,
    MobileNumberVerificationComponent,
    AvatarComponent,
    UsernameComponent,
    AccountBlockedComponent,
    TermsComponent,
    AuthComponent,
    PasswordResetComponent,
    SideBannerComponent,
    WelcomeScreenComponent,
    PrevDirective,
    NextDirective,
    GeoLocationBlockedComponent,
    RegistrationSuccessfulComponent,
    AlertComponent,
    AlphanumericDirective,
    MultiAccountingComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    NgxSharedModule,
    LottieModule.forRoot({ player: playerFactory })
  ]
})
export class AuthModule {}
