import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from "rxjs/operators";
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    if (req.headers.get('noauth')) return next.handle(req.clone());
    else {
      const clonereq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this.authService.getToken())
      });
      return next.handle(clonereq).pipe();
    }
    return next.handle(req);
  }
}
