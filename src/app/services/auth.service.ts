import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = new BehaviorSubject<UserInterface | null>(this.getCurrentUser());

  constructor(
    private http: HttpClient
  ) {

  }

  setCurrentUser(user: UserInterface) {
    localStorage.setItem('currentUser', JSON.stringify(user));

    this.currentUser$.next(user);
  }

  getCurrentUser(): UserInterface | null {
    const inUserData: string | null = localStorage.getItem('currentUser');

    if (inUserData) {
      return JSON.parse(inUserData);
    }

    return null;
  }

  removeCurrentUser() {
    localStorage.removeItem('currentUser');

    this.currentUser$.next(null);
  }

  setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  getAccessToken(): string | null {
    const inAccessToken: string | null = localStorage.getItem('accessToken');

    if (inAccessToken) {
      return inAccessToken;
    }

    return null;
  }

  removeAccessToken() {
    localStorage.removeItem('accessToken');
  }

  signup(authData: UserInterface) {
    return this.http.post(`${environment.backendUrl}/auth/signup`, authData, {
      withCredentials: true // чтобы получить куки с refresh token и установить их
    });
  }

  login(authData: UserInterface) {
    return this.http.post(`${environment.backendUrl}/auth/login`, authData, {
      withCredentials: true // чтобы получить куки с refresh token и установить их
    });
  }

  logout() {
    return this.http.delete(`${environment.backendUrl}/auth/logout`, {
      withCredentials: true // чтобы удалить cookie with refresh token
    })
  }

  refresh() {
    return this.http.post(`${environment.backendUrl}/auth/refresh`, null, {
      withCredentials: true
    })
  }
}
