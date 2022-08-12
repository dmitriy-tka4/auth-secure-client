import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // не обрабатывать ошибку 401, она ловится в AuthInterceptor
          if (error.status === 401) {
            return next.handle(request);
          }

          // ошибка обновления refresh token (невалиден или истек)
          if (error.status === 400 && error?.url?.includes('auth/refresh')) {
            this.authService.removeCurrentUser();
            this.authService.removeAccessToken();
            this.router.navigate(['/login']);
          } else {
            this.toastrService.error(error.error);
          }

          return throwError(() => {
            return error;
          });
        })
      );
  }
}
