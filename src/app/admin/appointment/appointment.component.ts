import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface Appointment {
  appointmentId: number;
  userId: number;
  userName: string;
  appointmentTime: string;
  status: string;
  productName?: string;
}

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  loading = false;
  error = '';

  sortColumn = 'appointmentId';
  sortDirection: 'asc' | 'desc' = 'desc';

  statusFilter = '';
  selectedDate: string = '';   // 新增日期篩選

  private apiUrl = 'http://localhost:8080/api/appointments/admin';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.http.get<Appointment[]>(`${this.apiUrl}/all`).subscribe({
      next: (data) => {
        this.appointments = data;
        this.applyFilterAndSort();
        this.loading = false;
      },
      error: (err) => {
        console.error('載入預約失敗', err);
        this.error = '無法載入預約資料，請確認後端 API 已實作';
        this.loading = false;
      }
    });
  }

  // 日期輸入框變更時觸發
  onDateChange(value: string) {
    if (!value) {
      this.selectedDate = '';
    } else {
      // toggle：選相同日期就取消
      if (this.selectedDate === value) {
        this.selectedDate = '';
      } else {
        this.selectedDate = value;
      }
    }
    this.applyFilterAndSort();
  }

  clearDateFilter() {
    this.selectedDate = '';
    this.applyFilterAndSort();
  }

  applyFilterAndSort() {
    let data = this.appointments;

    // 狀態篩選
    if (this.statusFilter) {
      data = data.filter(a => a.status === this.statusFilter);
    }

    // 日期篩選（根據 appointmentTime 的前10碼）
    if (this.selectedDate) {
      data = data.filter(a => a.appointmentTime?.startsWith(this.selectedDate));
    }

    // 排序
    data.sort((a: any, b: any) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];
      if (typeof valA === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }
    });

    this.filteredAppointments = data;
  }

  onStatusChange() {
    this.applyFilterAndSort();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  confirmAppointment(appointmentId: number) {
    if (!confirm('確定要確認此預約嗎？')) return;
    this.http.put(`${this.apiUrl}/${appointmentId}/confirm`, {}).subscribe({
      next: () => {
        alert('預約已確認');
        this.loadAppointments();
      },
      error: (err) => {
        console.error('確認預約失敗', err);
        alert('操作失敗');
      }
    });
  }

  rejectAppointment(appointmentId: number) {
    if (!confirm('確定要拒絕此預約嗎？')) return;
    this.http.put(`${this.apiUrl}/${appointmentId}/reject`, {}).subscribe({
      next: () => {
        alert('預約已拒絕');
        this.loadAppointments();
      },
      error: (err) => {
        console.error('拒絕預約失敗', err);
        alert('操作失敗');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return '待確認';
      case 'confirmed': return '已確認';
      case 'cancelled': return '已取消';
      default: return status;
    }
  }
}
