import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './http/firebase.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Gym Control';
  showFiller = false;
  titles = {};
  isLogin = false;
  isLoading = true;
  constructor(public firebaseService: FirebaseService, private router: Router) { }

  ngOnInit(): void {
    this.firebaseService.partner.subscribe(val => {
      if (this.firebaseService.getAuthStatus()) {
        this.isLogin = true;
        this.router.navigate(['']);
      } else {
        this.isLogin = false;
        this.router.navigate(['/login']);
      }
      this.isLoading = false;
    })
  }

  changeLanguage(value: string): void {
    if (!value || value === '' || value === 'es') {
      this.titles = {
        account: "Account Settings",
        search: "Search User",
        list: "List Users",
        new: "New User",
        settings: "General Settings"
      }
    } else if (value === 'en') {

    }
  }

  logout(): void {
    this.firebaseService.logout();
  }

}
