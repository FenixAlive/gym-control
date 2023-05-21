import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/http/firebase.service';
import { Gymbro } from 'src/app/models/gymbro.model';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  createForm!: any;
  isLoading = false;

  constructor(private firebaseService: FirebaseService, private readonly fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: Gymbro, @Optional() public dialogRef?: MatDialogRef<CreateUserComponent>) {
    if (this.data?.id) {
      this.editAccountForm(this.data as Gymbro);
    } else {
      this.createAccountForm();
    }
  }

  createAccountForm(): void {
    this.createForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        lastName: [''],
        internalId: [''],
        subscriptionStart: [new Date().toISOString().split('T')[0], [Validators.required]],
        subscriptionLap: ['', [Validators.required]],
        email: ['', [Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)]],
        phone: ['', [Validators.pattern(/^[0-9 -]{8,16}$/)]]
      }
    )
  }

  editAccountForm(gymbro: Gymbro): void {
    this.createForm = this.fb.group(
      {
        name: [gymbro?.name ?? '', [Validators.required]],
        lastName: [gymbro?.lastName ?? ''],
        internalId: [gymbro?.internalId ?? ''],
        subscriptionStart: [gymbro?.subscriptionStart ?? new Date().toISOString().split('T')[0], [Validators.required]],
        subscriptionLap: [gymbro?.subscriptionLap ?? '', [Validators.required]],
        email: [gymbro?.email ?? '', [Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)]],
        phone: [gymbro?.phone ?? '', [Validators.pattern(/^[0-9 -]{8,16}$/)]]
      }
    )
    console.log(this.createForm)
  }

  submitForm(e: any): void {
    e.preventDefault();
    const controls = this.createForm.controls;
    const todayDate = new Date();
    const subscriptionStart = new Date(controls['subscriptionStart'].value);
    const gymbro: Gymbro = {
      partnerId: this.firebaseService.auth.currentUser?.uid as string,
      name: controls['name'].value,
      lastName: controls['lastName'].value,
      internalId: controls['internalId'].value,
      created: this.data?.id ? this.data.created : todayDate,
      updated: todayDate,
      subscriptionStart,
      subscriptionLap: controls['subscriptionLap'].value,
      subscriptionEnd: new Date((new Date(controls['subscriptionStart'].value)).setMonth(subscriptionStart.getMonth() + controls['subscriptionLap'].value)),
      phone: controls['phone'].value,
      email: controls['email'].value,
    }
    if (this.data?.id) {
      this.firebaseService.editGymbro(this.data?.id, gymbro);
      this.dialogRef?.close(true);
    } else {
      this.firebaseService.newGymbro(gymbro);
      this.createAccountForm();
    }

  }
}
