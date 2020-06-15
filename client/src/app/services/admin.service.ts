import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  positiveNumberRegex = /^\d*[1-9]\d*$/;
  NotNegativeNumberRegex = /^\d*[0-9]\d*$/;
  
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

  createProduct(product: Product) {
    return this.http.post(environment.adminUrl + '/create-product', product);
  }

  removeProduct(id: string) {
    return this.http.delete(environment.adminUrl + '/delete-product/' + id);
  }

  //#endregion Products

  //#endregion Http Methods

}
