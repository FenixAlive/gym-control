import { Component, Inject, Input, Optional, Output } from '@angular/core';
import { Gymbro } from 'src/app/models/gymbro.model';
import { CreateUserComponent } from '../create-user/create-user.component';
import { FirebaseService } from 'src/app/http/firebase.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  @Input('gymbro') gymbro!: Gymbro | undefined;

  gymbroState!: Gymbro;

  constructor(public firebaseService: FirebaseService, private dialog: MatDialog, @Optional() @Inject(MAT_DIALOG_DATA) public data?: Gymbro, @Optional() public dialogRef?: MatDialogRef<CreateUserComponent>) {
    if (this.data) {
      this.gymbro = this.data;
    }
  }

  isExpired(gymbro: Gymbro): boolean {
    return gymbro?.subscriptionEnd ? gymbro.subscriptionEnd < (new Date()) : false;
  }


  editGymbro(): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      maxHeight: '98vh',
      maxWidth: '98vh',
      data: {
        ...this.gymbro
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response === true) {
        this.gymbro = undefined;
      }
    })
  }

  removeGymbro(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxHeight: '98vh',
      maxWidth: '98vw',
      data: {
        title: 'Remove Gymbro',
        content: `Are you sure you want to delete Gymbro ${this.gymbro?.name} ${this.gymbro?.lastName ?? ''}`
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response === true) {
        this.firebaseService.removeGymbro(this.gymbro?.id)
        this.gymbro = undefined;
      }
    })
  }

  closeDialog(): void {
    this.dialogRef?.close();
  }
}
