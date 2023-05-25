import { DataSource } from '@angular/cdk/table';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/http/firebase.service';
import { Gymbro } from 'src/app/models/gymbro.model';
import { HelperService } from 'src/app/services/helper.service';
import { DetailsComponent } from '../details/details.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements AfterViewInit {
  displayedColumns: string[] = ['internalId', 'name', 'expiration', 'duration', 'updated', 'actions'];
  dataSource = new MatTableDataSource([] as Gymbro[]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public firebaseService: FirebaseService, private helperService: HelperService, private dialog: MatDialog) {
    this.firebaseService.gymbros.subscribe(gymbros => {
      this.dataSource = new MatTableDataSource(gymbros);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  editGymbro(gymbro: Gymbro): void {
    this.helperService.editGymbro(gymbro, () => {
    })
  }

  removeGymbro(gymbro: Gymbro): void {
    this.helperService.removeGymbro(gymbro, () => {
    })
  }

  detailsGymbro(gymbro: Gymbro): void {
    const dialogRef = this.dialog.open(DetailsComponent, {
      maxHeight: '98vh',
      maxWidth: '98vw',
      data: gymbro
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isExpired(gymbro: Gymbro): boolean {
    return gymbro?.subscriptionEnd ? gymbro.subscriptionEnd < (new Date()) : false;
  }
}
