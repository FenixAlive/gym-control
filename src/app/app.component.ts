import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Gym Control';
  showFiller = false;
  titles = {};
  constructor(){}

  ngOnInit(): void {

  }

  changeLanguage(value: string): void{
    if(!value || value === '' || value === 'es'){
      this.titles = {
        account: "Account Settings",
        search: "Search User",
        list: "List Users",
        new: "New User",
        settings: "General Settings"
      }
    }else if(value === 'en'){

    }
  }

}
