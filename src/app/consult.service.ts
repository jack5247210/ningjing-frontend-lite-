import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConsultReq {
  userId: number;
  tags: string;
}

export interface ProductRes {
  productId: number;
  title: string;
  description: string;
  duration: number;
  price: number;
  productImg: string;
}

@Injectable({ providedIn: 'root' })
export class ConsultService {
  private apiUrl = 'http://localhost:8080/api/consult';

  constructor(private http: HttpClient) { }

  recommend(req: ConsultReq): Observable<ProductRes> {
    return this.http.post<ProductRes>(`${this.apiUrl}/recommend`, req);
  }

  getHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
}
