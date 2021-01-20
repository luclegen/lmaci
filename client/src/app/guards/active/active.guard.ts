import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveGuard implements CanActivate {
  
  constructor(private authService: AuthService) { }

  canActivate(): boolean {
    return this.authService.loggedIn() && !this.authService.activated();
  }

}
