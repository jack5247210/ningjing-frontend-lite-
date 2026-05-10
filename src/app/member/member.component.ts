import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppointmentService, AppointmentRes } from '../appointment.service';
import { MemberSidebarComponent } from '../member-sidebar/member-sidebar.component';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [CommonModule, FormsModule, MemberSidebarComponent],
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  userId = 0;
  userName = '';
  userEmail = '';

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  changingPassword = false;
  passwordError = '';
  passwordSuccess = '';

  appointments: AppointmentRes[] = [];
  loadingAppointments = false;

  lineBound = false;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private http: HttpClient,
    private dialogService: DialogService
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
    this.dialogService.confirm('確定要取消此預約嗎？').subscribe(result => {
      if (result) {
        this.appointmentService.cancel(appointmentId, this.userId).subscribe({
          next: () => {
            this.dialogService.alert('已取消預約');
            this.loadAppointments();
          },
          error: (err) => console.error(err)
        });
      }
    });
  }

  checkLineBinding() {
    this.http.get<{lineUserId: string}>('http://localhost:8080/api/auth/line-status').subscribe({
      next: (res) => this.lineBound = res.lineUserId != null,
      error: () => {}
    });
  }

  unbindLine() {
    this.dialogService.confirm('確定取消 LINE 提醒嗎？').subscribe(result => {
      if (result) {
        this.http.post('http://localhost:8080/api/auth/unbind-line', {}).subscribe({
          next: () => {
            this.lineBound = false;
            this.dialogService.alert('已取消 LINE 绑定');
          },
          error: (err) => {
            console.error('解绑失败', err);
            this.dialogService.alert('操作失败，请稍后再试');
          }
        });
      }
    });
  }

  changePassword() {
    this.passwordError = '';
    this.passwordSuccess = '';
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.dialogService.alert('請填寫所有密碼欄位');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.dialogService.alert('新密碼與確認密碼不一致');
      return;
    }
    if (this.newPassword.length < 6) {
      this.dialogService.alert('新密碼長度至少6位');
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
          this.dialogService.alert('密碼修改成功');
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.dialogService.alert(res.message || '修改失敗');
        }
      },
      error: (err) => {
        this.changingPassword = false;
        this.dialogService.alert(err.error?.message || '系統錯誤，請稍後再試');
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
