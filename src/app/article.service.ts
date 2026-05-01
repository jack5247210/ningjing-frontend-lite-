import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8080/api/articles';

  constructor(private http: HttpClient) { }

  // 新增文章（FormData 包含文字和圖片）
  createArticle(articleData: any): Observable<any> {
  return this.http.post(this.apiUrl, articleData);
}

  // 取得文章列表（分頁）
  getArticles(page: number = 0, size: number = 10, category?: string): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
  if (category) {
    params = params.set('category', category);
  }
  return this.http.get(this.apiUrl, { params });
}

  // 根據文章 id 取得單一文章
  getArticleById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // 更新文章
  updateArticle(id: number, articleData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, articleData);
}

  // 刪除文章
  deleteArticle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 取得最新文章（首頁用）
  getLatestArticles(limit: number = 3): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/latest`, { params: { limit: limit.toString() } });
  }

  getAllCategories(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/categories`);
}

uploadImage(file: File): Observable<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post<{ url: string }>(`${this.apiUrl}/upload-image`, formData);
}

uploadImages(files: File[]): Observable<{ urls: string[] }> {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  return this.http.post<{ urls: string[] }>(`${this.apiUrl}/upload-images`, formData);
}

}
