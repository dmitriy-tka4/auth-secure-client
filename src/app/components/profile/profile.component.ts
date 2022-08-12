import { Component, OnInit } from '@angular/core';
import { UserInterface } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: UserInterface;

  constructor(
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.userService.getCurrentUser()
      .subscribe((user: UserInterface) => {
        this.user = user;
      });
  }
}
