import { Injectable } from '@angular/core';
import { Partner } from '../models/partner.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  users: User[] = [];
  partner: Partner = {} as Partner;
  nameUsersKey = 'users';
  namePartnerKey = 'partner';
  constructor() {
    console.log(this.partner);
  }

  getLocalStorageUsers(): User[]{
    this.users = JSON.parse(localStorage.getItem(this.nameUsersKey) ?? '[]') ?? [];
    return this.users;
  }

  setLocalStorageUsers(users: User[]): User[]{
    localStorage.setItem(this.nameUsersKey, JSON.stringify(users));
    this.users = [...users];
    return users;
  }

  addLocalStorageUser(user: User): User{
    let exists = this.users.findIndex(element =>{
      user?.id === element?.id || user?.internalId === element?.internalId
    })
    if(exists >= 0){
      console.log('updating user');
      this.users[exists] = user;
    }else{
      console.log('Creating User');
      this.users.push(user);
    }
    this.setLocalStorageUsers(this.users);
    return user;
  }

  deleteLocalStorageUser(user: User): User | null{
    let exists = this.users.findIndex(element =>{
      user?.id === element?.id || user?.internalId === element?.internalId
    })
    if(exists >= 0 ){
      console.log('deleting user');
      this.users.splice(exists,1);
      this.setLocalStorageUsers(this.users);
      return user;
    }else{
      console.error('User not found to be deleted');
      return null;
    }
  }
}
