import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  //#region Http Methods

  //#region Admins

  getAdmins() {
    return this.http.get(environment.adminUrl + '/admins');
  }

  removeAsAdmin(username: string) {
    return this.http.get(environment.adminUrl + '/remove-as-admin/' + username);
  }

  searchAdmins(req: Object) {
    return this.http.put(environment.adminUrl + '/search-admins', req);
  }

  //#endregion Admins

  //#region Users

  getUsers() {
    return this.http.get(environment.adminUrl + '/users');
  }

  makeAdmin(username: string) {
    return this.http.get(environment.adminUrl + '/make-admin/' + username);
  }

  searchUsers(req: Object) {
    return this.http.put(environment.adminUrl + '/search-users', req);
  }

  //#endregion Users

  //#region Products

  getProducts() {
    return this.http.get(environment.adminUrl + '/products');
  }

  //#endregion Products

  //#endregion Http Methods

}
