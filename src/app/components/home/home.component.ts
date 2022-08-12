import { Component, OnInit } from '@angular/core';
import { UserInterface } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users: UserInterface[];
  currentUser: UserInterface | null;

  constructor(
    private authService: AuthService,
    private userService: UserService,

  ) {

  }

  ngOnInit(): void {
    this.authService.currentUser$
      .subscribe((currentUser: UserInterface | null) => {
        this.currentUser = currentUser;
      });

    this.userService.getAllUser()
      .subscribe((users: UserInterface[]) => {
        this.users = users;
      });
  }

  logout() {
    this.authService.logout()
      .subscribe(() => {
        this.authService.removeCurrentUser();
        this.authService.removeAccessToken();
      });
  }
}
