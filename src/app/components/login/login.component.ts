import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { FirebaseService } from 'src/app/http/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  googleLogoURL =
    "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";
  isLogin = true;
  loginForm!: FormGroup<{ email: FormControl<string | null>; password: FormControl<string | null>; }>;
  createForm!: FormGroup<{ name: FormControl<string | null>; email: FormControl<string | null>; password: FormControl<string | null>; rePassword: FormControl<string | null>; }>;
  loading = false;
  subscriber = new Subscriber();

  constructor(private firebaseService: FirebaseService, private readonly fb: FormBuilder, private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
    this.checkType();
    this.matIconRegistry.addSvgIcon(
      "logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.googleLogoURL));
  }

  ngOnInit(): void {
    this.firebaseService.partner.subscribe(val => {
      if (this.firebaseService.getAuthStatus()) {
        this.router.navigate(['']);
      }
    })

  }

  createLoginForm(): void {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
      }
    )
  }

  createAccountForm(): void {
    this.createForm = this.fb.group(
      {
        name: [''],
        email: ['', [Validators.required, Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        rePassword: ['', [Validators.required, Validators.minLength(8)]],
      }
    )
    const rePasswordControl = this.createForm.controls?.['rePassword'];
    const sub = rePasswordControl.valueChanges.subscribe(val => {

      if (val && val !== this.createForm.controls['password'].value) {
        rePasswordControl.setErrors({ ...rePasswordControl?.errors, samepass: true })
      } else {
        this.createForm.controls['rePassword'].setValidators([Validators.required, Validators.minLength(8)])
      }
    })
    this.subscriber.add(sub);
  }

  checkType(): void {
    if (this.isLogin) {
      this.createLoginForm();
    } else {
      this.createAccountForm();
    }
  }

  submitForm(): void {
    if (this.isLogin) {
      const email = this.loginForm.controls?.['email']?.value
      const password = this.loginForm.controls?.['password']?.value;
      this.firebaseService.login(email, password)
    } else {
      const email = this.createForm.controls?.['email']?.value
      const password = this.createForm.controls?.['password']?.value;
      const rePassword = this.createForm.controls?.['rePassword']?.value;
      if (password === rePassword) {
        const name = this.createForm.controls?.['name']?.value;
        this.firebaseService.createAccount(email, password, name)
      }

    }
  }

  changeType(): void {
    this.isLogin = !this.isLogin;
    this.checkType();
  }

  signGoogle(): void {
    this.firebaseService.signInWithGoogle();
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }

}
