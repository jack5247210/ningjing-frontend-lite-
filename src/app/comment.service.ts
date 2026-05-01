// comment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CommentReq {
  articleId: number;
  userId?: number;
  content: string;
}

export interface CommentRes {
  commentId: number;
  articleId: number;
  userId?: number;
  userName: string;
  content: string;
  commentAt: string;
}

@Injectable({ providedIn: 'root' })
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) {}

  addComment(comment: CommentReq): Observable<CommentRes> {
    return this.http.post<CommentRes>(this.apiUrl, comment);
  }

  getCommentsByArticle(articleId: number): Observable<CommentRes[]> {
    return this.http.get<CommentRes[]>(`${this.apiUrl}/article/${articleId}`);
  }
}
