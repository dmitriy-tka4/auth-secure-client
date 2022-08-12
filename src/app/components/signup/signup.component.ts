import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokensInterface } from 'src/app/interfaces/token.interface';
import { UserInterface } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
  }

  onSubmit() {
    const authData = this.signupForm.value as UserInterface;

    // проверяем форму на валидность
    if (this.signupForm.invalid) {
      for (let key in this.signupForm.controls) {
        this.signupForm.controls[key].markAsTouched();
      }

      return;
    }

    this.authService.signup(authData)
      .subscribe((data) => {
        const tokens = data as TokensInterface;

        const currentUser = {
          email: this.signupForm.value.email
        } as UserInterface;

        this.authService.setCurrentUser(currentUser);
        this.authService.setAccessToken(tokens.accessToken);

        this.signupForm.reset();
        this.router.navigate(['/']);
        this.toastrService.success(`Добро пожаловать, ${currentUser.email}`);
      });
  }
}
