import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { FirebaseService } from '../http/firebase.service';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private firebaseService: FirebaseService,
        private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Promise<boolean> {
        var isAuthenticated = this.firebaseService.getAuthStatus();
        return isAuthenticated;
    }
}