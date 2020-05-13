import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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

  constructor(private titleService: Title, private userService: UserService, private router: Router) {
    this.titleService.setTitle(this.title);
    this.usernameRegex = this.userService.usernameRegex;
  }

  ngOnInit(): void {
    if (this.userService.getToken()) this.userService.removeToken();
  }

  onSubmit(form: NgForm) {
    this.userService.login(form.value).subscribe(
      res => {
        this.userService.setToken(res['token']);
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
