import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/http/firebase.service';
import { Partner } from 'src/app/models/partner.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  isLoading = false;
  settingsForm: FormGroup;
  photoUrl = '';

  constructor(public readonly firebaseService: FirebaseService, private router: Router, private fb: FormBuilder) {
    this.settingsForm = this.fb.group(
      {
        name: [this.firebaseService.auth.currentUser?.displayName, [Validators.required]],
        email: [this.firebaseService.auth.currentUser?.email, [Validators.required, Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)]],
        photo: [this.firebaseService.auth.currentUser?.photoURL],
        password: ['', [Validators.minLength(8)]],
        rePassword: ['', [Validators.minLength(8)]],
      }
    )
  }

  ngOnInit(): void {
    this.photoUrl = this.firebaseService.auth.currentUser?.photoURL as string;

    this.settingsForm.controls['password'].valueChanges.subscribe(value => {
      if (value && value !== '') {
        this.settingsForm.controls['rePassword'].setValidators([Validators.required, Validators.minLength(8)])
        rePasswordControl.setErrors({ ...rePasswordControl?.errors, samepass: true })
      } else {
        this.settingsForm.controls['rePassword'].setValidators([Validators.minLength(8)])
      }
      this.settingsForm.updateValueAndValidity();
      console.log(this.settingsForm)
    })
    const rePasswordControl = this.settingsForm.controls?.['rePassword'];
    rePasswordControl.valueChanges.subscribe(val => {

      if (val && val !== this.settingsForm.controls['password'].value) {
        rePasswordControl.setErrors({ ...rePasswordControl?.errors, samepass: true })
      } else if (this.settingsForm.controls['password'].value) {
        rePasswordControl.setValidators([Validators.required, Validators.minLength(8)])
      } else {
        rePasswordControl.setValidators([Validators.minLength(8)])
      }
      this.settingsForm.updateValueAndValidity();
    })
  }

  submitSettings(): void {
    const partner = {
      name: this.settingsForm.controls['name'].value,
      email: this.settingsForm.controls['email'].value,
    } as Partner;
    if (this.settingsForm.controls['photo'].value) {
      partner['photoUrl'] = this.settingsForm.controls['photo'].value
    }
    const password = this.settingsForm.controls['password'].value;
    if (password && password === this.settingsForm.controls['rePassword'].value) {
      partner['password'] = password;
    }
    this.firebaseService.editPartner(partner);
  }

  onFileSelected(event: any): void {
    const file = event?.target?.files?.[0]
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e?.target?.result === 'string') {
        //change image size
        this.photoUrl = e.target.result;
        this.settingsForm.controls['photo'].setValue(this.photoUrl);
      } else {
      }
    };
    reader.readAsDataURL(file);
  }
}
