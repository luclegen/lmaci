import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  //#region Http Methods

  getAdmins() {
    return this.http.get(environment.adminUrl + '/admins');
  }

  removeAsAdmin(username: string) {
    return this.http.get(environment.adminUrl + '/remove-as-admin/' + username);
  }

  getUsers() {
    return this.http.get(environment.adminUrl + '/users');
  }

  //#endregion Http Methods

}
