import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/http/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(public firebaseService: FirebaseService) { }
}
