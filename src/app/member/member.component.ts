import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AppointmentService, AppointmentRes } from '../appointment.service';
import { MemberSidebarComponent } from '../member-sidebar/member-sidebar.component'; // 路径根据实际调整

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [CommonModule, FormsModule, MemberSidebarComponent],
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  // 用户信息
  userId = 0;
  userName = '';
  userEmail = '';

  // 修改密码
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  changingPassword = false;
  passwordError = '';
  passwordSuccess = '';

  // 预约列表
  appointments: AppointmentRes[] = [];
  loadingAppointments = false;

  // LINE 绑定
  lineBound = false;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.userId = parseInt(userIdStr, 10);
    this.userName = localStorage.getItem('userName') || '會員';
    this.userEmail = localStorage.getItem('userEmail') || '未設定';

    this.loadAppointments();
    this.checkLineBinding();
  }

  // 预约列表
  loadAppointments() {
    this.loadingAppointments = true;
    this.appointmentService.getByUser(this.userId).subscribe({
      next: (data) => {
        this.appointments = data;
        this.loadingAppointments = false;
      },
      error: (err) => {
        console.error('載入預約失敗', err);
        this.loadingAppointments = false;
      }
    });
  }

  cancelAppointment(appointmentId: number) {
    if (!confirm('確定要取消此預約嗎？')) return;
    this.appointmentService.cancel(appointmentId, this.userId).subscribe({
      next: () => {
        alert('已取消預約');
        this.loadAppointments();
      },
      error: (err) => console.error(err)
    });
  }

  // LINE 绑定
  checkLineBinding() {
    this.http.get<{lineUserId: string}>('/api/auth/line-status').subscribe({
      next: (res) => this.lineBound = res.lineUserId != null,
      error: () => {}
    });
  }

  unbindLine() {
    if (!confirm('確定取消 LINE 提醒嗎？')) return;
    this.http.post('/api/auth/unbind-line', {}).subscribe({
      next: () => {
        this.lineBound = false;
        alert('已取消 LINE 绑定');
      },
      error: (err) => {
        console.error('解绑失败', err);
        alert('操作失败，请稍后再试');
      }
    });
  }

  // 修改密码
  changePassword() {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = '請填寫所有密碼欄位';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = '新密碼與確認密碼不一致';
      return;
    }
    if (this.newPassword.length < 6) {
      this.passwordError = '新密碼長度至少6位';
      return;
    }

    this.changingPassword = true;
    this.http.post('http://localhost:8080/api/auth/change-password', {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: (res: any) => {
        this.changingPassword = false;
        if (res.code === 200) {
          this.passwordSuccess = '密碼修改成功';
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.passwordError = res.message || '修改失敗';
        }
      },
      error: (err) => {
        this.changingPassword = false;
        this.passwordError = err.error?.message || '系統錯誤，請稍後再試';
      }
    });
  }

  // 退出登录
  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
