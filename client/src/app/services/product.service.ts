import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  toHTMLName(name: string) {
    let nameOut = name.trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
    return nameOut[0].toLowerCase() + nameOut.slice(1);
  }

  getProduct(id: string) {
    return this.http.get(environment.productUrl + '/' + id);
  }

  uploadImgs(id: string, imgs: FormData) {
    return this.http.put(environment.productUrl + '/upload-imgs/' + id, imgs);
  }

}
