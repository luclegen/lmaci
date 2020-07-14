import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { Review } from '../models/review.model';

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

  post(id: string, post: Object) {
    return this.http.put(environment.productUrl + '/post/' + id, post);
  }

  sendReview(id: string, review: Review, files: []) {
    const formData = new FormData();

    formData.append('star', review.star.toString());
    formData.append('content', review.content);
    for (const f of files) formData.append('files', f, files.indexOf(f).toString());

    return this.http.put(environment.productUrl + '/review/' + id, formData);
  }

}
