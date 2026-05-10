import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-holiday',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-holiday.component.html',
  styleUrls: ['./manage-holiday.component.scss']
})
export class ManageHolidayComponent implements OnInit {
  holidays: any[] = [];
  showAddForm = false;
  newDate = '';
  newReason = '';
  message = '';
  success = false;

  // ✅ 改成你的後端完整網址（若用 ngrok 則替換為 ngrok 後端網址）
  private apiBase = 'http://localhost:8080';
  // ✅ 正確的路徑
  private apiUrl = `${this.apiBase}/api/holidays/admin`;

  // 下拉選單的預設原因
  reasonOptions: string[] = [
    '內部訓練',
    '店休',
    '國定假日',
    '年度盤點',
    '其他'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadHolidays();
  }

  loadHolidays() {
    // 載入公休日的 API 可以繼續用相對路徑，因為它是公開的
    this.http.get<any[]>(`${this.apiBase}/api/holidays`).subscribe({
      next: (data) => this.holidays = data,
      error: (err) => console.error('載入公休日失敗', err)
    });
  }

  addHoliday() {
    if (!this.newDate) {
      this.message = '請選擇日期';
      this.success = false;
      return;
    }
    this.http.post(this.apiUrl, {
      holidayDate: this.newDate,
      description: this.newReason
    }).subscribe({
      next: (res: any) => {
        let extra = '';
        if (res?.cancelledCount > 0) {
          extra = `，已自動取消該日 ${res.cancelledCount} 筆預約`;
        }
        this.showAddForm = false;
        this.newDate = '';
        this.newReason = '';
        this.message = '公休日新增成功' + extra;
        this.success = true;
        this.loadHolidays();
      },
      error: (err) => {
        this.message = err.error?.message || '新增失敗';
        this.success = false;
      }
    });
  }

  deleteHoliday(id: number) {
    if (!confirm('確定刪除此公休日嗎？')) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.message = '公休日已刪除';
        this.success = true;
        this.loadHolidays();
      },
      error: (err) => {
        this.message = err.error?.message || '刪除失敗';
        this.success = false;
      }
    });
  }
}
