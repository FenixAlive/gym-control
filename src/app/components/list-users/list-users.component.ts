import { DataSource } from '@angular/cdk/table';
import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/http/firebase.service';
import { Gymbro } from 'src/app/models/gymbro.model';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent {
  displayedColumns: string[] = ['internalId', 'name', 'vigent', 'duration', 'updated', 'actions'];
  dataSource = [] as Gymbro[];
  constructor(public firebaseService: FirebaseService) {
    this.dataSource = this.firebaseService.gymbros.value;
  }
}
