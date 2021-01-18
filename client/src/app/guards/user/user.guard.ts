import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.authService.isLoggedIn() && this.authService.activated() && this.authService.isAdmin() || this.authService.isLoggedIn() && this.authService.getUsername() == route.paramMap.get('username');
  }

}
