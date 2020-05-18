import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent implements OnInit {

  user = {
    verificationCode: '',
    password: '',
    confirmPassword: ''
  }

  codeRegex;

  serverErrorMessages: string;

  constructor() { }

  ngOnInit(): void {
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

  }

  onSubmit(form: NgForm) {
    
  }

  resendEmail() {

  }

}
