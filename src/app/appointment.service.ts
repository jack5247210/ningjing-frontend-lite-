import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppointmentReq {
  userId: number;
  appointmentTime: string;  // ISO 格式日期時間，如 "2025-04-01T14:30:00"
  productId: number;  // 新增
  oilId?: number | null;
}

export interface AppointmentRes {
  appointmentId: number;
  userId: number;
  userName: string;
  appointmentTime: string;
  status: string;
  productName?: string;
  oilId?: number | null;   // 可選
  oilName?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  create(req: AppointmentReq): Observable<AppointmentRes> {
    return this.http.post<AppointmentRes>(this.apiUrl, req);
  }

  getByUser(userId: number): Observable<AppointmentRes[]> {
    return this.http.get<AppointmentRes[]>(`${this.apiUrl}/user/${userId}`);
  }

  cancel(appointmentId: number, userId: number): Observable<void> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.delete<void>(`${this.apiUrl}/${appointmentId}`, { params });
  }

  getAvailability(start: string, end: string): Observable<Record<string, number>> {
  const params = new HttpParams()
    .set('start', start)
    .set('end', end);
  return this.http.get<Record<string, number>>(`${this.apiUrl}/availability`, { params });
  }
}
