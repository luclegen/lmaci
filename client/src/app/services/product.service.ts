import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProduct(id: string) {
    return this.http.get(environment.productUrl + '/' + id);
  }

  uploadImgs(id: string, slider: Object) {
    return this.http.put(environment.productUrl + '/upload-imgs/' + id, slider);
  }

}
