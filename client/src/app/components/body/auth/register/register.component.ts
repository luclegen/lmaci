import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';

import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  user = {
    firstName: '',
    lastName: '',
    gender: 'male',
    email: '',
    mobileNumber: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: '',
  }
  
  emailRegex;
  nameRegex;
  mobileNumberRegex;
  usernameRegex;

  showSuccessMessages: boolean;
  serverErrorMessages: string;

  constructor(private titleService: Title,
              private helperService: HelperService,
              private authService: AuthService) {
    this.titleService.setTitle('Register | Lmaci');
    this.emailRegex = this.helperService.emailRegex;
    this.mobileNumberRegex = this.helperService.mobileNumberRegex;
    this.usernameRegex = this.helperService.usernameRegex;
  }

  ngOnInit(): void {
    if (this.authService.getToken()) this.authService.removeToken();
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
    this.showSuccessMessages = false;
    this.serverErrorMessages = null;
    if (this.matchPassword()) {
      this.authService.register(form.value).subscribe(
        res => {
          this.showSuccessMessages = true;
          setTimeout(() => this.showSuccessMessages = false, 4000);
          form.resetForm();
        },
        err => {
          this.serverErrorMessages = err.status === 422 ? err.error.join('<br/>') 
                                                        : 'Something went wrong. Please contact admin.';
        }
      );
    }
  }
}
