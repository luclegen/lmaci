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

  }

  matchPassword() {

  }

  togglePassword() {

  }

  onSubmit(form: NgForm) {
    
  }

  resendEmail() {

  }

}
