import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent implements OnInit {
  counter$: Observable<number>;
  count = 90;
  
  username: string;

  user = {
    verificationCode: '',
    password: '',
    confirmPassword: ''
  }

  codeRegex;

  serverErrorMessages: string;

  constructor(private titleService: Title,
              private route: ActivatedRoute,
              private authService: AuthService,
              private helperService: HelperService,
              private router: Router) {
    this.titleService.setTitle('Reset Password | Lmaci');

    this.username = this.route.snapshot.paramMap.get('username');

    this.counter$ = timer(0, 1000).pipe(take(this.count), map(() => --this.count));
  }

  @HostListener('window:resize')
  onResize() {
    this.helperService.setPositionOnlyForm();
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    return !(this.user.verificationCode || this.user.password || this.user.confirmPassword);
  }

  ngOnInit(): void {
    this.authService.resendVerifyResetPassword(this.username).subscribe();
    this.helperService.setPositionOnlyForm();
  }

  checkStrengthPassword() {
    let count = 0
    const strength = {
      0: "Worst",
      1: "Bad",
      2: "Weak",
      3: "Good",
      4: "Strong"
    },
    password_strength = document.getElementById('password-strength'),
    meter = document.getElementsByTagName('meter');

    if (/[A-Z]/.test(this.user.password)) count++;
    if (/[a-z]/.test(this.user.password)) count++;
    if (/\d/.test(this.user.password)) count++;
    if (/[!@#\$%\^\&*\)\(+=._-]/.test(this.user.password)) count++;
    
    meter[0].value = count;
    password_strength.innerHTML = strength[count];
  }

  matchPassword() {
    const password_error = document.getElementById('password-error');
    password_error.style.display = (this.user.password === this.user.confirmPassword) ? 'none' : 'inline';
    return this.user.password === this.user.confirmPassword;
  }

  togglePassword() {
    const eye = document.getElementById('eye'),
          notEye = document.getElementById('not-eye'),
          button = document.getElementById('eye-btn'),
          password = document.getElementById('password'),
          confirmPassword = document.getElementById('confirm-password');

    if (button.getAttribute('aria-visible') == 'false') {
      eye.style.display = 'inline';
      notEye.style.display = 'none';
      button.setAttribute('aria-visible', 'true');
      password.setAttribute('type', 'text');
      confirmPassword.setAttribute('type', 'text');
    } else {
      eye.style.display = 'none';
      notEye.style.display = 'inline';
      button.setAttribute('aria-visible', 'false');
      password.setAttribute('type', 'password');
      confirmPassword.setAttribute('type', 'password');
    }
  }

  onSubmit(form: NgForm) {
    this.serverErrorMessages = null;
    if (this.matchPassword()) {
      this.authService.resetPassword(this.username, form.value).subscribe(
        res => {
          alert(res['msg']);
          this.router.navigateByUrl('login');
        },
        err => this.serverErrorMessages = err.error.msg
      );
    }
  }

  resendEmail() {
    this.serverErrorMessages = null;
    this.authService.resendVerifyResetPassword(this.username).subscribe(
      res => {
        alert(res['msg']);

        this.count = 90;
        this.counter$ = timer(0, 1000).pipe(take(this.count), map(() => --this.count));
      },
      err => this.serverErrorMessages = err.error.msg
    );
  }

}
