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

  // 排序相关
  sortColumn = 'orderId';
  sortDirection: 'asc' | 'desc' = 'desc';

  // 筛选相关
  statusFilter = '';

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

  // ─── 筛选 + 排序 ──────────────────────────────
  applyFilterAndSort() {
    let data = [...this.orders];

    // 按状态下拉筛选
    if (this.statusFilter) {
      data = data.filter(o => o.status === this.statusFilter);
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

  // ─── 详情展开 / 收起 ─────────────────────────
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

  // ─── 更新状态 ────────────────────────────────
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

  // ─── 辅助方法 ────────────────────────────────
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
