import { Injectable } from '@angular/core'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore/lite';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Gymbro } from '../models/gymbro.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firebaseConfig = environment.firebase;
  gymbroCollectionName = 'gymbro';
  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  gymbroCollection = collection(this.db, this.gymbroCollectionName)
  googleProvider = new GoogleAuthProvider()
  partner: BehaviorSubject<User> = new BehaviorSubject({} as User);
  gymbros: BehaviorSubject<Gymbro[]> = new BehaviorSubject([] as Gymbro[])
  isGymbros = false;

  constructor(private snackBar: MatSnackBar) {
    this.auth.onAuthStateChanged(user => {
      console.log(user)
      this.partner.next(user ?? {} as User);
      if (user) {
        this.getGymbros();
      }
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

  getGymbros(): void {
    const q = query(this.gymbroCollection, where('partnerId', '==', this.auth?.currentUser?.uid))
    getDocs(q).then(data => {
      this.isGymbros = data.docs && data.docs.length > 0;
      const dateTypes = ['created', 'updated', 'subscriptionStart', 'subscriptionEnd'];
      const result = data.docs.map((doc) => {
        const data = doc.data();
        dateTypes.forEach(val => {
          data[val] = data[val] ? new Date(data?.[val].seconds * 1000) : undefined;
        })
        return { ...data, id: doc.id } as any;
      })
      this.gymbros.next(result as Gymbro[]);
      console.log(result)
    }).catch((error) => {
      console.error(error.message)
      this.openSnackbar("Error getting gymbros from database: " + error.message)
    })
  }

  getGymbroWith(query: string, data: string): void {

  }

  newGymbro(gymbro: Gymbro): void {
    gymbro.partnerId = this.auth?.currentUser?.uid ?? '';
    addDoc(this.gymbroCollection, gymbro).then(() => {
      this.getGymbros();
      this.openSnackbar('Gymbro added successfully');
    }).catch(error => {
      this.openSnackbar('Error trying to add gymbro: ' + error.message)
    });
  }

  editGymbro(id: string, gymbro: Gymbro): void {
    const gymbroDoc = doc(this.db, this.gymbroCollectionName, id);
    gymbro.id = undefined;
    updateDoc(gymbroDoc, { ...gymbro }).then(() => {
      this.getGymbros();
      this.openSnackbar('Gymbro updated successfully');
    }).catch(error => {
      this.openSnackbar('Error trying to update gymbro: ' + error.message)
    });
  }

  removeGymbro(id: string | undefined): void {
    if (!id) {
      this.openSnackbar('Error trying to delete gymbro: Error getting gymbro id');
    }
    const gymbroDoc = doc(this.db, this.gymbroCollectionName, id as string);
    deleteDoc(gymbroDoc).then(() => {
      this.getGymbros();
      this.openSnackbar('Gymbro deleted successfully');
    }).catch(error => {
      this.openSnackbar('Error trying to delete gymbro: ' + error.message)
    })
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


