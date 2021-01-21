import { Component, HostListener, OnInit } from '@angular/core';
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

  @HostListener('window:resize')
  onResize() {
    this.helperService.setPositionOnlyForm();
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    return !(this.user.username || this.user.password);
  }

  ngOnInit(): void {
    if (this.authService.getToken()) this.authService.removeToken();
    this.helperService.setPositionOnlyForm();
  }

  onSubmit(form: NgForm) {
    this.serverErrorMessages = null;
    this.authService.login(form.value).subscribe(
      res => {
        this.authService.setToken(res['token']);
        if (!this.authService.activated()) alert('Your session exists for 5 minutes.');
        this.router.navigateByUrl(this.authService.activated() ? '/' : 'activate')
      },
      err => this.serverErrorMessages = err.error.msg
    );
  }

}
