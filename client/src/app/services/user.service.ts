import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    avatar: '',
    firstName: '',
    lastName: '',
    fullName: '',
    role: '',
    email: '',
    emailVerifyCode: '',
    emailVerified: false,
    mobileNumber: '',
    username: '',
    password: '',
    address: ''
  };
  
  noAuthHeader = { headers: new HttpHeaders({ 'noAuth': 'True' }) };
  
  usernameRegex = /^(?=[a-zA-Z0-9._]{1,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  codeRegex = /^\d{6}$/;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobileNumberRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  
  constructor(private http: HttpClient) { }

  //#region Http Methods
  
  register(user: User) {
    return this.http.post(environment.userUrl + '/register', user, this.noAuthHeader);
  }
}
