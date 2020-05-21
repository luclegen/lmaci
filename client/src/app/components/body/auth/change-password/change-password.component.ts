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

  codeRegex;

  serverErrorMessages: string;
  successMessages: string;

  constructor(private titleServer: Title, private authService: AuthService, private router: Router) {
    this.titleServer.setTitle('Change Password | Lmaci');
  }
  
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

    if (/[A-Z]/.test(this.user.newPassword)) count++;
    if (/[a-z]/.test(this.user.newPassword)) count++;
    if (/\d/.test(this.user.newPassword)) count++;
    if (/[!@#\$%\^\&*\)\(+=._-]/.test(this.user.newPassword)) count++;
    
    meter[0].value = count;
    password_strength.innerHTML = strength[count];
  }

  matchPassword() {

  }
  
  togglePassword() {

  }

  onSubmit(form: NgForm) {
    
  }
}
