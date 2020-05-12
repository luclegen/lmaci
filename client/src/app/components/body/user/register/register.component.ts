import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

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
  }

}
