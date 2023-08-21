import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppInitService, AuthGuard, NgxErrorHandlerService } from 'projects/shared/src/public-api';
import { ToFixedPipe } from 'projects/shared/src/lib/pipe/to-fixed.pipe';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { ReponseInterceptor } from './core/interceptors/response.interceptor';
import { ShareModule } from './modules/share/share.module';
import { AppComponent } from './app.component';
import { CashierModule } from './modules/cashier/cashier.module';

export function playerFactory() {
  return player;
}

export function appInit(appInitService: AppInitService) {
  return () => appInitService.load();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ShareModule,
    CoreModule,
    CashierModule,
    HttpClientModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [
    ToFixedPipe,
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      deps: [AppInitService],
      multi: true
    },
    AuthGuard,
    { provide: ErrorHandler, useClass: NgxErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: ReponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
