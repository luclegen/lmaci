import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';
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

  createProduct(product: Product) {
    return this.http.post(environment.adminUrl + '/create-product', product);
  }

  uploadProductImg(id: string, img: FormData) {
    return this.http.put(environment.adminUrl + '/upload-product-img/' + id, img);
  }

  getProducts() {
    return this.http.get(environment.adminUrl + '/products');
  }

  editProduct(id: string, body: Object) {
    return this.http.put(environment.adminUrl + '/edit-product/' + id, body);
  }

  updateProduct(id: string, product: Product) {
    return this.http.put(environment.adminUrl + '/update-product/' + id, product);
  }

  deleteProduct(id: string) {
    return this.http.delete(environment.adminUrl + '/delete-product/' + id);
  }

  searchProducts(req: Object) {
    return this.http.put(environment.adminUrl + '/search-products', req);
  }

  // #endregion Products

  //#endregion Http Methods

  //#region Helper

  startEdit(product: Object) {
    this.editProduct(Object(product)._id, { canEdit: false }).subscribe();
  }

  finishEdit(product: Object) {
    this.editProduct(Object(product)._id, { index: Object(product).session.index, canEdit: true }).subscribe();
  }

  //#endregion Helper
}
