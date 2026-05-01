import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
private apiUrl = 'http://localhost:8080/api/auth'; // 你的後端網址

  constructor(private http: HttpClient) { }

  // 註冊
  register(registerData: any): Observable<any> {
    // registerData 應包含 email, name, password, age
    return this.http.post(`${this.apiUrl}/register`, registerData);
}

  // 登入
  login(loginData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
    tap((res: any) => {
      if (res.token) {
        localStorage.setItem('token', res.token); // ← 加這行
      }
    })
  );
}
}
