import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/http/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLogin = true;
  loginForm;
  loading = false;

  constructor(private firebaseService: FirebaseService, private readonly fb: FormBuilder) {
    this.loginForm = fb.group(
      {
        name: [''],
        email: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        rePassword: ['', [Validators.required, Validators.minLength(8)]],
      }
    )
  }

  submitForm(): void {
    this.firebaseService.login(this.loginForm.controls?.['email']?.value, this.loginForm.controls?.['password']?.value)
  }

}
