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

  }

  matchPassword() {

  }
  
  togglePassword() {

  }

  onSubmit(form: NgForm) {
    
  }
}
