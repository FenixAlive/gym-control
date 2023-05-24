import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateUserComponent } from '../components/create-user/create-user.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { Gymbro } from '../models/gymbro.model';
import { FirebaseService } from '../http/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private dialog: MatDialog, private firebaseService: FirebaseService) { }

  editGymbro(gymbro: Gymbro, callback: () => void): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      maxHeight: '98vh',
      maxWidth: '98vw',
      data: gymbro
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response === true) {
        callback();
      }
    })
  }

  removeGymbro(gymbro: Gymbro, callback: () => void): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxHeight: '98vh',
      maxWidth: '98vw',
      data: {
        title: 'Remove Gymbro',
        content: `Are you sure you want to delete Gymbro ${gymbro?.name} ${gymbro?.lastName ?? ''}`
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response === true) {
        this.firebaseService.removeGymbro(gymbro?.id)
        callback();
      }
    })
  }
}
