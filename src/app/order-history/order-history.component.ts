import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OilService, OilOrder } from '../oil.service';
import { MemberSidebarComponent } from '../member-sidebar/member-sidebar.component';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink, MemberSidebarComponent],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: OilOrder[] = [];
  loading = false;
  error = '';
  expandedOrderId: number | null = null;

  constructor(private oilService: OilService, private router: Router) {}

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.loadOrders(Number(userIdStr));
  }

  loadOrders(userId: number) {
    this.loading = true;
    this.oilService.getUserOrders(userId).subscribe({
      next: (data) => {
        this.orders = data.sort((a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('載入歷史訂單失敗', err);
        this.error = '無法載入訂單';
        this.loading = false;
      }
    });
  }

  toggleDetail(orderId: number) {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
    } else {
      this.expandedOrderId = orderId;
      const order = this.orders.find(o => o.orderId === orderId);
      if (order && (!order.items || order.items.length === 0)) {
        this.loadOrderItems(orderId);
      }
    }
  }

  loadOrderItems(orderId: number) {
    this.oilService.getOrderDetail(orderId).subscribe({
      next: (data) => {
        const order = this.orders.find(o => o.orderId === orderId);
        if (order) order.items = data.items;
      },
      error: (err) => console.error('載入明細失敗', err)
    });
  }

  getStatusLabel(status: string): string {
    const map: { [key: string]: string } = {
      pending: '待付款',
      paid: '已付款',
      shipped: '已出貨',
      completed: '已完成',
      cancelled: '已取消'
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'paid': return 'status-paid';
      case 'shipped': return 'status-shipped';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }
}
