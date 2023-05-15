import { Injectable } from '@angular/core'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firebaseConfig = environment.firebase;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  googleProvider = new GoogleAuthProvider()
  partner: BehaviorSubject<User> = new BehaviorSubject({} as User);

  constructor(private snackBar: MatSnackBar) {
    this.auth.onAuthStateChanged(user => {
      console.log(user)
      this.partner.next(user ?? {} as User);
    })
  }

  openSnackbar(message: string, action: string = 'Ok'): void {
    this.snackBar.open(message, action,
      { duration: 7000 })
  }

  createAccount(email: string | null, password: string | null, name: string | null): void {
    if (!email || !password) return;

    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.partner?.next(userCredential.user);
        this.openSnackbar("User created successfully");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
        this.openSnackbar("Error creating user account: " + errorMessage);
        // ..
      });
  }

  login(email: string | null, password: string | null): void {
    if (!email || !password) return;
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        this.partner?.next(user);
        this.openSnackbar("User logged in successfully");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage)
        this.openSnackbar("Error trying to login account: " + errorMessage)
      })
  }

  logout(): void {
    signOut(this.auth).then(() => {
      this.partner?.next({} as User);
      this.openSnackbar("User Sign-out successful");
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorMessage)
      this.openSnackbar("Error Signning out account: " + errorMessage)
    });
  }

  editPartner(): void {

  }

  getGymbro(): void {

  }

  getGymbroWith(): void {

  }

  newGymbro(): void {

  }

  editGymbro(): void {

  }

  removeGymbro(): void {

  }

  getAuthStatus(): boolean {
    return Boolean(this.partner?.value?.uid)
  }

  signInWithGoogle(): void {
    signInWithPopup(this.auth, this.googleProvider).then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      this.partner?.next(user);
      this.openSnackbar("User logged in successfully");
    })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage)
        this.openSnackbar("Error trying to login account: " + errorMessage)
      })
  }
}


