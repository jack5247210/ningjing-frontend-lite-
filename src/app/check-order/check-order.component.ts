import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OilService, OrderRequest, OrderResponse } from '../oil.service';
import { MemberSidebarComponent } from "../member-sidebar/member-sidebar.component";

@Component({
  selector: 'app-check-order',
  standalone: true,
  imports: [CommonModule, FormsModule, MemberSidebarComponent],
  templateUrl: './check-order.component.html',
  styleUrls: ['./check-order.component.scss']
})
export class CheckOrderComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount = 0;
  finalAmount = 0;
  discount = 0;
  giftMessage = '';
  loading = false;
  error = '';

  address = '';
  recipientName = '';
  phone = '';
  deliveryMethod: 'pickup' | 'delivery' = 'delivery';  // 預設送貨到府
  paymentMethod: string = 'cod';  // 貨到付款

  constructor(
    private oilService: OilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadUserInfo();
  }

  loadCart(): void {
    this.cartItems = this.oilService.getCart();
    if (this.cartItems.length === 0) {
      this.goBack();
      return;
    }
    this.calcSummary();
  }

  calcSummary(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (this.totalAmount >= 2000) {
      this.discount = 200;
      this.finalAmount = this.totalAmount - this.discount;
      this.giftMessage = '';
    } else if (this.totalAmount >= 1000) {
      this.discount = 0;
      this.finalAmount = this.totalAmount;
      this.giftMessage = '🎁 贈送薰衣草精油滾珠瓶 5ml';
    } else {
      this.discount = 0;
      this.finalAmount = this.totalAmount;
      this.giftMessage = '';
    }
  }

  loadUserInfo(): void {
    const userName = localStorage.getItem('userName');
    if (userName) {
      this.recipientName = userName;
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/oil-cart');
  }

  submitOrder(): void {
    // 根據配送方式驗證
    if (this.deliveryMethod === 'delivery' && !this.address.trim()) {
      this.error = '送貨到府請填寫收貨地址';
      return;
    }
    if (!this.recipientName.trim()) {
      this.error = '請填寫收件人姓名';
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('請先登入');
      this.router.navigateByUrl('/login');
      return;
    }

    const items = this.cartItems.map(item => ({
      oilId: item.oilId,
      quantity: item.quantity
    }));

    const orderReq: OrderRequest = {
      userId: Number(userId),
      items: items,
      address: this.deliveryMethod === 'delivery' ? this.address : null,
      recipientName: this.recipientName,
      phone: this.phone,
      deliveryMethod: this.deliveryMethod,
      paymentMethod: this.paymentMethod
    };

    this.loading = true;
    this.error = '';

    this.oilService.createOrder(orderReq).subscribe({
      next: (res: OrderResponse) => {
        this.loading = false;
        alert(`訂單已送出！實付金額 NT$ ${res.finalAmount}${res.giftItem ? '，贈品：' + res.giftItem : ''}`);
        this.oilService.clearCart();
        this.router.navigateByUrl('/member/orders');
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || '訂單送出失敗，請稍後再試';
      }
    });
  }
}
