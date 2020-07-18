import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProduct(id: string) {
    return this.http.get(environment.productUrl + '/' + id);
  }

  uploadImgs(id: string, imgs: FormData) {
    return this.http.put(environment.productUrl + '/upload-imgs/' + id, imgs);
  }

  post(id: string, post: Object) {
    return this.http.put(environment.productUrl + '/post/' + id, post);
  }

  sendReview(id: string, review: Review, files) {
    const formData = new FormData();

    formData.append('index', review.index.toString());
    formData.append('star', review.star.toString());
    formData.append('content', review.content);

    for (let i = 0; i < files.length; i++) formData.append('files', files[i], i.toString() + '.' + files[i].type.slice(6));

    return this.http.put(environment.productUrl + '/review/' + id, formData);
  }

}
