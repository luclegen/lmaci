import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  noAuthHeader = { headers: new HttpHeaders({ 'noAuth': 'True' }) };
  
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

  changeEmail(id: string, email: string) {
    return this.http.put(environment.authUrl + '/change-email/' + id, email);
  }

  findUsername(email: string) {
    return this.http.post(environment.authUrl + '/find-username', email);
  }

  resendVerifyResetPassword(username: string) {
    return this.http.get(environment.authUrl + '/resend-verify-reset-password/' + username);
  }

  resetPassword(username: string, user: Object) {
    return this.http.put(environment.authUrl + '/reset-password/' + username, user);
  }

  changePassword(id: string, user: User) {
    return this.http.put(environment.authUrl + '/change-password/' + id, user);
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

  loggedIn() {
    return Boolean(this.getToken());
  }

  getPayload() {
    return this.loggedIn() ? JSON.parse(atob(this.getToken().split('.')[1])) : null;
  }

  getId() {
    return this.loggedIn() ? this.getPayload()._id : null;
  }

  getUsername() {
    return this.loggedIn() ? this.getPayload().username : null;
  }

  activated() {
    return this.getPayload().activated;
  }

  isAdmin() {
    return this.getPayload().admin;
  }

  isExpired() {
    return this.getToken() ? this.getPayload().exp ? this.getPayload().exp * 1000 < Date.now() : false : true;
  }

  //#endregion Helper Methods

}
