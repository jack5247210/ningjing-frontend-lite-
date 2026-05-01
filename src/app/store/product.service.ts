import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Product {
  productId: number;
  title: string;
  description: string;   // 詳細介紹
  introduce: string;     // 簡短介紹（新增）
  duration: number;
  price: number;
  productImg: string;
  isVisible?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  // 取得產品列表，admin=true 時包含隱藏的產品
  getProducts(admin: boolean = false): Observable<Product[]> {
    const params = new HttpParams().set('admin', admin.toString());
    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(productData: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, productData);
  }

  updateProduct(id: number, productData: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, productData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleVisibility(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/toggle-visibility`, {});
  }

  uploadImage(file: File): Observable<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post<{ url: string }>(`${this.apiUrl}/upload-image`, formData);
}
}
