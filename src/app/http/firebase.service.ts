import { Injectable } from '@angular/core'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, User } from "firebase/auth";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private firebaseConfig = {
    apiKey: "AIzaSyAXPKnSGw--fJ-FJNR1rlPNBLOfZTMXKUI",
    authDomain: "gym-control-6ab45.firebaseapp.com",
    projectId: "gym-control-6ab45",
    storageBucket: "gym-control-6ab45.appspot.com",
    messagingSenderId: "210396065339",
    appId: "1:210396065339:web:3d45819180e9a8993bb61e",
    measurementId: "G-WG3HTSZGDS"
  };

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  partner = new BehaviorSubject({} as User);


  createAccount(email: string | null, password: string | null, name = ''): void {
    if (!email || !password) return;

    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.partner.next(userCredential.user);
        console.log(userCredential)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  login(email: string | null, password: string | null, name = ''): void {
    if (!email || !password) return;
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        this.partner.next(userCredential.user);
        console.log(userCredential)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  logout(): void {

  }

  editPartner(): void {

  }

  getUsers(): void {

  }

  getUserWith(): void {

  }

  newUser(): void {

  }

  editUser(): void {

  }

  removeUser(): void {

  }

  getAuthStatus(): boolean {
    if (this.partner.value?.uid) {
      return true;
    }
    return false;
  }
}


