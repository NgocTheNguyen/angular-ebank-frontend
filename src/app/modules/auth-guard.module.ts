import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const accessToken = this.auth.getToken();
    // Logged in so return true
    if (accessToken) {
      return true;
    }
    
    // Not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { continue: state.url } });
    return false;
  }
}