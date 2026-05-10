import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  message = '';
  success = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.message = '無效的重設連結';
      this.success = false;
    }
  }

  submit() {
    if (!this.newPassword || !this.confirmPassword) {
      this.message = '請填寫所有欄位';
      this.success = false;
      return;
    }
    if (this.newPassword.length < 6) {
      this.message = '密碼長度至少 6 位';
      this.success = false;
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.message = '兩次輸入的密碼不一致';
      this.success = false;
      return;
    }

    this.loading = true;
    this.http.post('http://localhost:8080/api/auth/reset-password', {
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: (res: any) => {
        this.message = res.message || '密碼重設成功';
        this.success = true;
        this.loading = false;
        setTimeout(() => this.router.navigateByUrl('/login'), 2000);
      },
      error: (err) => {
        this.message = err.error?.message || '系統錯誤，請稍後再試';
        this.success = false;
        this.loading = false;
      }
    });
  }
}
