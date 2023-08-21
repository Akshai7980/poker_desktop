import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService, SpinnerService } from 'projects/shared/src/public-api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService, private commonService: CommonService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorResponse = error.error.responseException;
        this.spinnerService.close();
        this.spinnerService.resetSpinnerData();
        if (error.error instanceof ErrorEvent) {
          // Client side error
          return throwError(errorResponse);
        }
        if (error.status === 504) {
          return throwError(errorResponse);
        }
        if (error.status === 502) {
          return throwError(errorResponse);
        }
        if (error.status === 404) {
          return throwError(errorResponse);
        }
        if (error.status === 500) {
          return throwError(errorResponse);
        }
        if (error.status === 400) {
          return throwError(errorResponse);
        }
        if (error.status === 401) {
          this.commonService.executeUnAuthorizedAccess();
          return throwError(errorResponse);
        }
        if (error.status >= 500) {
          // Server side error

          return throwError(errorResponse);
        }
        if (error.status === 401) {
          // Server side error
          return throwError(errorResponse);
        }
        return throwError(errorResponse);
      })
    );
  }
}
