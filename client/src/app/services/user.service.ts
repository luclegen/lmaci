import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  noAuthHeader = { headers: new HttpHeaders({ 'noAuth': 'True' }) };
  
  constructor(private http: HttpClient) { }

  //#region Http Methods

  getUser(username: string) {
    return this.http.get(environment.userUrl + '/' + username);
  }

  updateUser(username: string, form: Object) {
    return this.http.put(environment.userUrl + '/' + username, form);
  } 

  uploadAvatar(username: string, form: Object) {
    return this.http.put(environment.userUrl + '/upload-avatar/' + username, form);
  } 

  //#endregion Http Methods

  //#region Helper Methods

  //#endregion Helper Methods

}
