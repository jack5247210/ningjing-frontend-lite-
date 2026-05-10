import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DialogService } from '../dialog.service';
@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name: string = '';
  age: number = 25;
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialogService: DialogService
  ) { }

  register() {
    // 前端基本檢查
    if (!this.name || !this.email || !this.password) {
      this.dialogService.alert('請填寫完整資料');
      return;
    }

    // 電子郵件正規化（與後端保持一致）
    const normalizedEmail = this.email.trim().toLowerCase();

    const registerData = {
      email: normalizedEmail,
      name: this.name,
      password: this.password,
      age: this.age
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.dialogService.alert('註冊成功！');
          this.router.navigateByUrl('/login');
        } else {
          this.dialogService.alert('註冊失敗：' + response.message);
        }
      },
      error: (err) => {
        console.error('註冊錯誤', err);
        alert('系統錯誤，請稍後再試');
      }
    });
  }

  goToLogin() {
    this.router.navigateByUrl('login');
  }
}
