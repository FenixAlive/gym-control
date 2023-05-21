import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/http/firebase.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public readonly firebaseService: FirebaseService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.firebaseService.auth)
    console.log(this.firebaseService.partner.value)

  }

  submitSettings(): void {

  }
}
