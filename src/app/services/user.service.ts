import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) {

  }

  getAllUser(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${environment.backendUrl}/users`);
  }

  getCurrentUser(): Observable<UserInterface> {
    return this.http.get<UserInterface>(`${environment.backendUrl}/profile`);
  }
}
