import { Injectable } from '@angular/core';
import { Partner } from '../models/partner.model';
import { Gymbro } from '../models/gymbro.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  users: Gymbro[] = [];
  partner: Partner = {} as Partner;
  nameGymbrosKey = 'users';
  namePartnerKey = 'partner';
  constructor() {
    console.log(this.partner);
  }

  getLocalStorageGymbros(): Gymbro[] {
    this.users = JSON.parse(localStorage.getItem(this.nameGymbrosKey) ?? '[]') ?? [];
    return this.users;
  }

  setLocalStorageGymbros(users: Gymbro[]): Gymbro[] {
    localStorage.setItem(this.nameGymbrosKey, JSON.stringify(users));
    this.users = [...users];
    return users;
  }

  addLocalStorageGymbro(user: Gymbro): Gymbro {
    let exists = this.users.findIndex(element => {
      user?.id === element?.id || user?.internalId === element?.internalId
    })
    if (exists >= 0) {
      console.log('updating user');
      this.users[exists] = user;
    } else {
      console.log('Creating Gymbro');
      this.users.push(user);
    }
    this.setLocalStorageGymbros(this.users);
    return user;
  }

  deleteLocalStorageGymbro(user: Gymbro): Gymbro | null {
    let exists = this.users.findIndex(element => {
      user?.id === element?.id || user?.internalId === element?.internalId
    })
    if (exists >= 0) {
      console.log('deleting user');
      this.users.splice(exists, 1);
      this.setLocalStorageGymbros(this.users);
      return user;
    } else {
      console.error('Gymbro not found to be deleted');
      return null;
    }
  }
}
