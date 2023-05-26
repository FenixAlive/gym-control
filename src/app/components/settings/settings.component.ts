import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/http/firebase.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  isLoading = false;
  settingsForm: FormGroup;

  constructor(public readonly firebaseService: FirebaseService, private router: Router, private fb: FormBuilder) {
    this.settingsForm = this.fb.group(
      {
        name: [this.firebaseService.auth.currentUser?.displayName],
        email: [this.firebaseService.auth.currentUser?.email, [Validators.required, Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)]],
        photo: [this.firebaseService.auth.currentUser?.photoURL],
        phone: [this.firebaseService.auth.currentUser?.phoneNumber],
        password: ['', [Validators.minLength(8)]],
        rePassword: ['', [Validators.minLength(8)]],
      }
    )
  }

  ngOnInit(): void {
    console.log(this.firebaseService.auth)
    console.log(this.firebaseService.partner.value)

  }

  submitSettings(): void {

  }
}
