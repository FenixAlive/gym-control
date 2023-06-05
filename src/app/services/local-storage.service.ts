import { Injectable } from '@angular/core';
import { Partner } from '../models/partner.model';
import { Gymbro } from '../models/gymbro.model';
import { FirebaseService } from '../http/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  nameGymbrosKey = 'gymbros';
  namePartnerKey = 'partner';
  constructor() {

  }

  getLocalStorageGymbros(): Gymbro[] {
    const gymbros = JSON.parse(localStorage.getItem(this.nameGymbrosKey) ?? '[]') ?? [];
    return gymbros;
  }

  setLocalStorageGymbros(gymbros: Gymbro[]): Gymbro[] {
    localStorage.setItem(this.nameGymbrosKey, JSON.stringify(gymbros));
    return gymbros;
  }

  addLocalStorageGymbro(user: Gymbro): Gymbro {
    const existingGymbros = this.getLocalStorageGymbros();
    let exists = existingGymbros.findIndex(element => {
      user?.id === element?.id || user?.internalId === element?.internalId
    })
    if (exists >= 0) {
      existingGymbros[exists] = user;
    } else {
      existingGymbros.push(user);
    }
    this.setLocalStorageGymbros(existingGymbros);
    return user;
  }

  deleteLocalStorageGymbro(user: Gymbro): Gymbro | null {
    const existingGymbros = this.getLocalStorageGymbros();
    let exists = existingGymbros.findIndex(element => {
      user?.id === element?.id || user?.internalId === element?.internalId
    })
    if (exists >= 0) {
      existingGymbros.splice(exists, 1);
      this.setLocalStorageGymbros(existingGymbros);
      return user;
    } else {
      console.error('Gymbro not found to be deleted');
      return null;
    }
  }
}
