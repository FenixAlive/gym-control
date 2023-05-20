import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private firebaseService: FirebaseService, private readonly fb: FormBuilder) {
    this.createAccountForm();
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

  submitForm(e: any): void {
    e.preventDefault();
    const controls = this.createForm.controls;
    const todayDate = new Date();
    const gymbro: Gymbro = {
      partnerId: this.firebaseService.auth.currentUser?.uid as string,
      name: controls['name'].value,
      lastName: controls['lastName'].value,
      internalId: controls['internalId'].value,
      created: todayDate,
      subscriptionStart: new Date(controls['subscriptionStart'].value),
      subscriptionLap: controls['subscriptionLap'].value,
      subscriptionEnd: new Date((new Date()).setMonth(todayDate.getMonth() + controls['subscriptionLap'].value)),
      phone: controls['phone'].value,
      email: controls['email'].value,
    }
    this.firebaseService.newGymbro(gymbro);
    this.createAccountForm();

  }
}
