import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-log-in',
  imports: [FormsModule, RouterLink],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialogService: DialogService   // ← 在 constructor 里
  ) { }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  login() {
    // 電子郵件正規化
    const normalizedEmail = this.email.trim().toLowerCase();

    const loginData = {
      email: normalizedEmail,
      password: this.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        if (response.code === 200) {
          localStorage.setItem('token', response.token);   // 新增
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('userName', response.name);
          localStorage.setItem('isAdmin', response.admin);
          localStorage.setItem('userEmail', response.email);
          this.dialogService.alert('登入成功', '提示');

          if (response.admin) {
            this.router.navigateByUrl('/admin');
          } else {
            this.router.navigateByUrl('/member');
          }
        } else {
          this.dialogService.alert('登入失敗：' + response.message);
        }
      },
      error: (err) => {
        console.error('登入錯誤', err);
        alert('系統錯誤，請稍後再試');
      }
    });
  }
}
