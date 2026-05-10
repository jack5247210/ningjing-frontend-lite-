import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppointmentService, AppointmentRes } from '../appointment.service';
import { ProductService } from '../store/product.service';
import { OilService, EssentialOil } from '../oil.service';
import { MemberSidebarComponent } from '../member-sidebar/member-sidebar.component';
import { RouterLink } from '@angular/router';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MemberSidebarComponent],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  userId = 0;

  // 日历相关
  currentYear = 0;
  currentMonth = 0;
  daysInMonth: Date[] = [];
  availabilityMap: Map<string, number> = new Map();
  holidays: Map<string, string> = new Map();   // 日期 → 原因

  selectedDate = '';
  loading = false;
  error = '';

  products: any[] = [];
  selectedProductId = 0;
  selectedTime = '';
  timeOptions = [
    { value: '09:00', label: '上午 09:00 - 11:00' },
    { value: '14:00', label: '下午 14:00 - 16:00' },
    { value: '16:00', label: '下午 16:00 - 18:00' },
    { value: '18:30', label: '下午 18:30 - 20:00' }
  ];

  oils: EssentialOil[] = [];
  selectedOilId: number | null = null;

  // 我的预约
  appointments: AppointmentRes[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private productService: ProductService,
    private oilService: OilService,
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

    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth();

    this.generateCalendar();
    this.loadProducts();
    this.loadOils();
    this.loadHolidays();
    this.loadMyAppointments();
  }

  formatYMD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  }

  isDateAvailable(date: Date): boolean {
    const ymd = this.formatYMD(date);
    if (this.holidays.has(ymd)) return false;
    if (date.getDay() === 4) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 21);

    if (date <= today || date > maxDate) return false;
    return (this.availabilityMap.get(ymd) ?? 2) > 0;
  }

  selectDate(date: Date) {
    if (!this.isDateAvailable(date)) {
      this.dialogService.alert('此日期已額滿、公休或不可預約');
      return;
    }
    this.selectedDate = this.formatYMD(date);
    this.error = '';
  }

  generateCalendar() {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysInPrevMonth = startDayOfWeek;
    const daysInCurrentMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const totalDays = 42;

    this.daysInMonth = [];
    const prevMonthDate = new Date(this.currentYear, this.currentMonth, 0);
    const prevMonthDays = prevMonthDate.getDate();
    for (let i = daysInPrevMonth - 1; i >= 0; i--) {
      const d = new Date(this.currentYear, this.currentMonth - 1, prevMonthDays - i);
      this.daysInMonth.push(d);
    }
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      this.daysInMonth.push(new Date(this.currentYear, this.currentMonth, i));
    }
    const remaining = totalDays - this.daysInMonth.length;
    for (let i = 1; i <= remaining; i++) {
      this.daysInMonth.push(new Date(this.currentYear, this.currentMonth + 1, i));
    }
    this.loadAvailability();
  }

  loadAvailability() {
    const startDate = this.daysInMonth[0];
    const endDate = this.daysInMonth[this.daysInMonth.length - 1];
    this.appointmentService.getAvailability(this.formatYMD(startDate), this.formatYMD(endDate)).subscribe({
      next: (data) => { this.availabilityMap = new Map(Object.entries(data)); },
      error: (err) => console.error('載入日曆失敗', err)
    });
  }

  loadMyAppointments() {
    this.appointmentService.getByUser(this.userId).subscribe({
      next: (data) => this.appointments = data,
      error: (err) => console.error('載入預約失敗', err)
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
        if (data.length > 0) this.selectedProductId = data[0].productId;
      },
      error: (err) => console.error('載入產品失敗', err)
    });
  }

  loadOils() {
    this.oilService.getOils().subscribe({
      next: (data) => this.oils = data,
      error: (err) => console.error('載入精油失敗', err)
    });
  }

  loadHolidays() {
    this.http.get<any[]>('http://localhost:8080/api/holidays').subscribe({
      next: (data) => {
        this.holidays = new Map<string, string>();
        data.forEach(h => {
          this.holidays.set(h.holidayDate, h.description || '公休');
        });
        this.generateCalendar();
      },
      error: (err) => console.error('載入公休日失敗', err)
    });
  }

  prevMonth() {
    if (this.currentMonth === 0) { this.currentYear--; this.currentMonth = 11; }
    else { this.currentMonth--; }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) { this.currentYear++; this.currentMonth = 0; }
    else { this.currentMonth++; }
    this.generateCalendar();
  }

  goToToday() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.generateCalendar();
  }

  submitAppointment() {
    if (!this.selectedDate || !this.selectedTime || !this.selectedProductId) {
      this.dialogService.alert('請填寫完整預約資訊');
      return;
    }
    this.loading = true;
    this.error = '';
    const appointmentTime = `${this.selectedDate}T${this.selectedTime}:00`;
    this.appointmentService.create({
      userId: this.userId,
      appointmentTime: appointmentTime,
      productId: this.selectedProductId,
      oilId: this.selectedOilId
    }).subscribe({
      next: () => {
        this.loading = false;
        this.dialogService.alert('預約申請已送出，等待管理員確認');
        this.selectedDate = '';
        this.selectedTime = '';
        this.selectedOilId = null;
        this.loadMyAppointments();
        this.loadAvailability();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || '預約失敗';
        console.error('預約失敗', err);
      }
    });
  }

  cancelAppointment(appointmentId: number) {
    this.dialogService.confirm('確定要取消此預約嗎？').subscribe(result => {
      if (result) {
        this.appointmentService.cancel(appointmentId, this.userId).subscribe({
          next: () => {
            this.dialogService.alert('已取消預約');
            this.loadMyAppointments();
            this.loadAvailability();
          },
          error: (err) => console.error(err)
        });
      }
    });
  }
}
