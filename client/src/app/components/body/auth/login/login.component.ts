import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  title = 'Login | Lmaci';
  user = {
    username: '',
    password: ''
  };
  usernameRegex;
  serverErrorMessages: string;

  constructor(private titleService: Title,
              private helperService: HelperService,
              private authService: AuthService,
              private router: Router) {
    this.titleService.setTitle(this.title);
    this.usernameRegex = this.helperService.usernameRegex;
  }

  ngOnInit(): void {
    if (this.authService.getToken()) this.authService.removeToken();
  }

  onSubmit(form: NgForm) {
    this.serverErrorMessages = null;
    this.authService.login(form.value).subscribe(
      res => {
        this.authService.setToken(res['token']);
        this.authService.getInfo().subscribe(
          res => {
            if (res['user'].activated) this.router.navigateByUrl('/');
            else this.router.navigateByUrl('active');
          },
          err => {
            if (err.status == 440) {
              if (confirm('Your session has expired and must log in again.\nDo you want to login again?')) window.open('/login');
              else this.authService.removeToken();
            } else this.authService.removeToken();
          }
        );
      },
      err => {
        this.serverErrorMessages = err.error.msg;
      }
    );
  }

}
