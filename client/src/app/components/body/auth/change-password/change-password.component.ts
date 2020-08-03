import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent implements OnInit {

  user = {
    password: '',
    newPassword: '',
    confirmPassword: ''
  }

  serverErrorMessages: string;
  successMessages: string;

  constructor(private titleServer: Title, private authService: AuthService, private router: Router) {
    this.titleServer.setTitle('Change Password | Lmaci');
  }
  
  ngOnInit(): void {
    this.authService.getInfo().subscribe(
      res => {
        if (!res['user'].activated) this.router.navigateByUrl('active');
      },
      err => {
        if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login');
      }
    );
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

    if (/[A-Z]/.test(this.user.newPassword)) count++;
    if (/[a-z]/.test(this.user.newPassword)) count++;
    if (/\d/.test(this.user.newPassword)) count++;
    if (/[!@#\$%\^\&*\)\(+=._-]/.test(this.user.newPassword)) count++;
    
    meter[0].value = count;
    password_strength.innerHTML = strength[count];
  }

  matchPassword() {
    const password_error = document.getElementById('password-error');
    password_error.style.display = (this.user.newPassword === this.user.confirmPassword) ? 'none' : 'inline';
    return this.user.newPassword === this.user.confirmPassword;
  }
  
  togglePassword() {
    const eye = document.getElementById('eye'),
    notEye = document.getElementById('not-eye'),
    button = document.getElementById('eye-btn'),
    password = document.getElementsByClassName('password');

    if (button.getAttribute('aria-visible') == 'false') {
      eye.style.display = 'inline';
      notEye.style.display = 'none';
      button.setAttribute('aria-visible', 'true');

      for (let i = 0; i < password.length; i++) {
        password[i].setAttribute('type', 'text');
      }
    } else {
      eye.style.display = 'none';
      notEye.style.display = 'inline';
      button.setAttribute('aria-visible', 'false');

      for (let i = 0; i < password.length; i++) {
        password[i].setAttribute('type', 'password');
      }
    }
  }

  onSubmit(form: NgForm) {
    this.serverErrorMessages = null;
    this.successMessages = null;
    if (this.matchPassword()) {
      this.authService.getInfo().subscribe(
        res => {
          if (res['user'].activated) {
            this.authService.changePassword(this.authService.getId(), form.value).subscribe(
              res => {
                this.successMessages = res['msg'];
              },
              err => {
                this.serverErrorMessages = err.error.msg;
              }
            );
          }
        },
        err => {
          if (err.status == 440) {
            if (confirm('Your session has expired and must log in again.\nDo you want to login again?')) window.open('/login');
            else this.authService.removeToken();
          } else this.authService.removeToken();
        }
      );
    }
  }
}
