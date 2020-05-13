import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { tap } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService, private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    if (req.headers.get('noauth')) return next.handle(req.clone());
    else {
      const clonereq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this.userService.getToken())
      });
      return next.handle(clonereq).pipe(
        tap (
          e => {},
          err => {
            if (err.error.auth == false) this.router.navigateByUrl('');
          }
        )
      );
    }
    return next.handle(req);
  }
}
