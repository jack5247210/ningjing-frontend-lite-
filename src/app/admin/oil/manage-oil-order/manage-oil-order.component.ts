import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OilService, OilOrder } from '../../../oil.service';

interface OilOrderItem {
  itemId: number;
  oilId: number;
  quantity: number;
  unitPrice: number;
  oilName?: string;
}

@Component({
  selector: 'app-manage-oil-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-oil-order.component.html',
  styleUrls: ['./manage-oil-order.component.scss']
})
export class ManageOilOrderComponent implements OnInit {
  orders: OilOrder[] = [];
  filteredOrders: OilOrder[] = [];
  loading = false;
  error = '';
  expandedOrderId: number | null = null;

  sortColumn = 'orderId';
  sortDirection: 'asc' | 'desc' = 'desc';

  statusFilter = '';
  selectedDate: string = '';

  statusOptions = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
  statusLabels: { [key: string]: string } = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已出貨',
    completed: '已完成',
    cancelled: '已取消'
  };

  constructor(private oilService: OilService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.oilService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.applyFilterAndSort();
        this.loading = false;
      },
      error: () => {
        this.error = '載入訂單失敗';
        this.loading = false;
      }
    });
  }

  // 日期 input 改變時呼叫 (value 為 yyyy-mm-dd 或空字串)
  onDateChange(value: string) {
    if (!value) {
      this.selectedDate = '';
    } else {
      // toggle：如果選的跟目前一樣就清除，否則設定
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
    let data = [...this.orders];

    if (this.statusFilter) {
      data = data.filter(o => o.status === this.statusFilter);
    }

    if (this.selectedDate) {
      data = data.filter(o => o.orderDate?.startsWith(this.selectedDate));
    }

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

    this.filteredOrders = data;
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

  updateStatus(orderId: number, newStatus: string) {
    if (!confirm(`確定將訂單狀態改為「${this.statusLabels[newStatus]}」嗎？`)) return;
    this.oilService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const order = this.orders.find(o => o.orderId === orderId);
        if (order) order.status = newStatus;
        alert('狀態已更新');
      },
      error: () => alert('更新失敗')
    });
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

  getOrderById(orderId: number): OilOrder | undefined {
    return this.orders.find(o => o.orderId === orderId);
  }
}
