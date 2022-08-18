import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, retry, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokensInterface } from '../interfaces/token.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isRefreshing: boolean = false;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // get access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    // set Authorization header
    if (accessToken) {
      request = this.addAccessToken(request, accessToken);
    }

    return next.handle(request)
      .pipe(
        // retry(1),
        catchError((error: HttpErrorResponse) => {
          // ошибка 401, если нет access token или он истек, то делать запрос на /auth/refresh
          if (error.status === 401) {
            return this.handle401Error(request, next);
          }

          return throwError(() => error);
        })
      );
  }

  private addAccessToken(request: HttpRequest<any>, accessToken: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refresh()
        .pipe(
          switchMap((data) => {
            // response с сервера устанавливает куки с новым refresh token
            // возвращает новый access token, который нужно добавить к запросу
            const tokens = data as TokensInterface;
            const accessToken = tokens.accessToken;

            this.isRefreshing = false;
            this.refreshTokenSubject.next(accessToken);
            this.authService.setAccessToken(accessToken);

            return next.handle(this.addAccessToken(request, accessToken));
          }));
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((accessToken) => next.handle(this.addAccessToken(request, accessToken)))
    );
  }
}
