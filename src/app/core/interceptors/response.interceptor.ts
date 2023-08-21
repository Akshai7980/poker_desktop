import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { CASH_GAMES, SpinnerService, UrlConstant } from 'projects/shared/src/public-api';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ReponseInterceptor implements HttpInterceptor {
  excludeSpinnerAPIs = [
    UrlConstant.NO_OF_HANDS_URL.toString(),
    UrlConstant.LOBBY_PROMOTIONS_URL.toString(),
    CASH_GAMES.CASH_GAMES_LIST.toString(),
    CASH_GAMES.TABLE_RING_LIST.toString(),
    CASH_GAMES.RING_TABLE_INFO.toString(),
    '/assets/js/app-config.dev.json'
  ];
  constructor(
    private localStorageService: LocalStorageService,
    private spinnerService: SpinnerService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const shouldShowSpinner = !this.excludeSpinnerAPIs.some((url) => request.url.includes(url));

    if (shouldShowSpinner) {
      this.spinnerService.open();
    } else {
      this.spinnerService.close();
      this.spinnerService.resetSpinnerData();
    }
    let modifiedRequest = request;
    if (request.url.includes('assets/js/app-config') === false) {
      const token = this.localStorageService.getItem('token');
      if (token) {
        modifiedRequest = request.clone({
          headers: request.headers.set('token', token)
        });
      }
    }

    return next.handle(modifiedRequest).pipe(
      tap((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          if (request.url.includes('settings') === false) this.spinnerService.close();
          this.spinnerService.resetSpinnerData();
        }
      })
    );
  }
}
