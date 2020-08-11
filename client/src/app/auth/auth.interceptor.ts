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
    return req.headers.get('noauth') ? next.handle(req.clone()) : next.handle(req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.authService.getToken()) })).pipe();
  }
}
