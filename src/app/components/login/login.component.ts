import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokensInterface } from 'src/app/interfaces/token.interface';
import { UserInterface } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // emailControl = new FormControl('');
  // passwordControl = new FormControl('');

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }

  onSubmit() {
    const authData = this.loginForm.value as UserInterface;

    // проверяем форму на валидность
    if (this.loginForm.invalid) {
      for (let key in this.loginForm.controls) {
        this.loginForm.controls[key].markAsTouched();
      }

      return;
    }

    this.authService.login(authData)
      .subscribe((data) => {
        const tokens = data as TokensInterface;

        const currentUser = {
          email: this.loginForm.value.email
        } as UserInterface;

        this.authService.setAccessToken(tokens.accessToken);
        this.authService.setCurrentUser(currentUser);

        this.loginForm.reset();
        this.router.navigate(['/']);
        this.toastrService.success(`Привет, ${currentUser.email}`);
      });
  }
}
