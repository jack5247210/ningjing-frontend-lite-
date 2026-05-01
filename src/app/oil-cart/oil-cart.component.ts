import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { OilService } from '../oil.service';
import { ImageUrlPipe } from '../pipes/image-url.pipe';
import { MemberSidebarComponent } from '../member-sidebar/member-sidebar.component';

@Component({
  selector: 'app-oil-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImageUrlPipe, MemberSidebarComponent],
  templateUrl: './oil-cart.component.html',
  styleUrls: ['./oil-cart.component.scss']
})
export class OilCartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount = 0;
  giftMessage = '';

  constructor(private oilService: OilService, private router: Router) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.oilService.getCart();
    this.calcTotal();
  }

  calcTotal() {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (this.totalAmount >= 2000) {
      this.giftMessage = '滿2000元可折抵200元！';
    } else if (this.totalAmount >= 1000) {
      this.giftMessage = '滿1000元贈送薰衣草滾珠瓶！';
    } else {
      this.giftMessage = '';
    }
  }

  updateItem(item: any) {
    if (item.quantity < 1) item.quantity = 1;
    this.oilService.updateQuantity(item.oilId, item.quantity);
    this.calcTotal();
  }

  removeItem(oilId: number) {
    this.oilService.removeFromCart(oilId);
    this.loadCart();
  }

  checkout() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('請先登入');
      this.router.navigateByUrl('/login');
      return;
    }
    this.router.navigateByUrl('/check-order');
  }
}
