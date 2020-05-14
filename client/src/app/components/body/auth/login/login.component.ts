import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private titleService: Title, private authService: AuthService, private userService: UserService, private router: Router) {
    this.titleService.setTitle(this.title);
    this.usernameRegex = this.authService.usernameRegex;
  }

  ngOnInit(): void {
    if (this.authService.getToken()) this.authService.removeToken();
  }

  onSubmit(form: NgForm) {
    this.authService.login(form.value).subscribe(
      res => {
        this.authService.setToken(res['token']);
        this.userService.getProfile().subscribe(
          res => {
            let userDetails = res['user'];
            if (userDetails.activated) this.router.navigateByUrl('/');
            else this.router.navigateByUrl('user/active');
          },
          err => {}
        );
      },
      err => {
        this.serverErrorMessages = err.error.msg;
      }
    );
  }

}
