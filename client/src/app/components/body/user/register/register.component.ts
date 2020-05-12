import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  user = {
    firstName: '',
    lastName: '',
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

  constructor(private titleService: Title, private userService: UserService) {
    this.titleService.setTitle('Register | Lmaci');
    this.emailRegex = this.userService.emailRegex;
    this.mobileNumberRegex = this.userService.mobileNumberRegex;
    this.usernameRegex = this.userService.usernameRegex;
  }

  ngOnInit(): void {
    if (this.userService.getToken()) this.userService.removeToken();
  }
  
  checkStrengthPassword() {
    let count = 0, strength = {
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
    if (this.matchPassword()) {
      this.userService.register(form.value).subscribe(
        res => {
          this.showSuccessMessages = true;
          setTimeout(() => this.showSuccessMessages = false, 4000);
        },
        err => {
          this.serverErrorMessages = err.status === 422 
                                     ? err.error.join('<br/>') 
                                     : 'Something went wrong. Please contact admin.';
        }
      );
    }
  }
}
