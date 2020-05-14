import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
  
  usernameRegex = /^(?=[a-zA-Z0-9._]{1,20}$)/;
  codeRegex = /^\d{6}$/;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobileNumberRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  
  constructor(private http: HttpClient) { }

  //#region Http Methods
  
  register(user: User) {
    return this.http.post(environment.authUrl + '/register', user, this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.authUrl + '/authenticate', authCredentials, this.noAuthHeader);
  }

  active(id: string, code: string) {
    return this.http.post(environment.authUrl + '/active/' + id, code);
  }

  resendActive(id: string) {
    return this.http.get(environment.authUrl + '/resend-active/' + id);
  }

  getInfo() {
    return this.http.get(environment.authUrl + '/info');
  }

  //#endregion Http Methods

  //#region Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getPayload() {
    return this.getToken() ? JSON.parse(atob(this.getToken().split('.')[1])) : null;
  }

  getId() {
    return this.getToken() ? JSON.parse(atob(this.getToken().split('.')[1]))._id : null;
  }

  isLoggedIn() {
    return this.getPayload().exp > Date.now() / 1000;
  }

  setUsername(username: string) {
    localStorage.setItem('username', username);
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  removeUsername() {
    localStorage.removeItem('username');
  }

  //#endregion Helper Methods

}
