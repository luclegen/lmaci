import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { Review } from '../models/review.model';
import { Comment } from '../models/comment.model';
import { Answer } from '../models/answer.model';

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
    formData.append('user', JSON.stringify(review.user));
    formData.append('star', review.star.toString());
    formData.append('content', review.content);

    for (let i = 0; i < files.length; i++) formData.append('files', files[i], i.toString() + '.' + files[i].type.slice(6));

    return this.http.put(environment.productUrl + '/review/' + id, formData);
  }

  deleteReview(id: string, review: Object, reviews: []) {
    return this.http.put(environment.productUrl + '/delete-review/' + id, { review: review, reviews: reviews });
  }

  sendComment(id: string, comment: Comment, files) {
    const formData = new FormData();

    formData.append('index', comment.index.toString());
    formData.append('user', JSON.stringify(comment.user));
    formData.append('content', comment.content);

    for (let i = 0; i < files.length; i++) formData.append('files', files[i], i.toString() + '.' + files[i].type.slice(6));

    return this.http.put(environment.productUrl + '/comment/' + id, formData);
  }
  
  deleteComment(id: string, comment: Object, comments: []) {
    return this.http.put(environment.productUrl + '/delete-comment/' + id, { comment: comment, comments: comments });
  }

  sendAnswer(id: string, cmtIndex: number, answer: Answer, files) {
    const formData = new FormData();

    formData.append('index', answer.index.toString());
    formData.append('user', JSON.stringify(answer.user));
    formData.append('content', answer.content);

    formData.append('cmtIndex', cmtIndex.toString());

    for (let i = 0; i < files.length; i++) formData.append('files', files[i], i.toString() + '.' + files[i].type.slice(6));

    return this.http.put(environment.productUrl + '/reply/' + id, formData);
  }
  
}
