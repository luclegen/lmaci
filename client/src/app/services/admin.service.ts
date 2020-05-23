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

  //#endregion Http Methods

}
