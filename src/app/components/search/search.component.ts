import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { FirebaseService } from 'src/app/http/firebase.service';
import { Gymbro } from 'src/app/models/gymbro.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CreateUserComponent } from '../create-user/create-user.component';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchControl: FormControl<string | null> = new FormControl('');
  filteredOptions!: Observable<Gymbro[]>;
  selectedGymbro: Gymbro | undefined;

  constructor(public firebaseService: FirebaseService, private dialog: MatDialog, private helperService: HelperService) { }

  ngOnInit() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith('') as any,
      map((value: string) => this._filter(value)),
    );
  }

  private _filter(value: string): Gymbro[] {
    if (!value || typeof (value) !== 'string') return [];
    const filterValue = value?.toLowerCase()?.trim();
    return this.firebaseService.gymbros?.value?.filter(option => {
      return option.internalId?.toLowerCase().includes(filterValue) || option.name?.toLowerCase().trim().includes(filterValue) || option.lastName?.trim().toLowerCase().includes(filterValue)
    });
  }

  displayFn(gymbro: Gymbro): string {
    if (!gymbro) return '';
    return `${gymbro?.internalId ?? ''} - ${gymbro?.name ?? ''} ${gymbro?.lastName ?? ''}`;
  }

  isExpired(gymbro: Gymbro): boolean {
    return gymbro?.subscriptionEnd ? gymbro.subscriptionEnd < (new Date()) : false;
  }

  onSelectionChanged(e: MatAutocompleteSelectedEvent): void {
    this.selectedGymbro = e?.option?.value ?? undefined;
    this.searchControl.reset();
  }

  editGymbro(): void {
    this.helperService.editGymbro(this.selectedGymbro as Gymbro, () => {
      this.selectedGymbro = undefined;
    })
  }

  removeGymbro(): void {
    this.helperService.removeGymbro(this.selectedGymbro as Gymbro, () => {
      this.selectedGymbro = undefined;
    })
  }
}
