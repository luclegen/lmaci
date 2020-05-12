import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
