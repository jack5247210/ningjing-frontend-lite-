import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  message = '';
  success = false;

  constructor(private http: HttpClient) {}

  submit() {
    if (!this.email.trim()) {
      this.message = '請輸入信箱';
      this.success = false;
      return;
    }

    this.loading = true;
    this.http.post('http://localhost:8080/api/auth/forgot-password', { email: this.email.trim().toLowerCase() })
      .subscribe({
        next: (res: any) => {
          this.message = res.message || '重設密碼連結已寄到您的信箱';
          this.success = true;
          this.loading = false;
        },
        error: (err) => {
          this.message = err.error?.message || '系統錯誤，請稍後再試';
          this.success = false;
          this.loading = false;
        }
      });
  }
}
