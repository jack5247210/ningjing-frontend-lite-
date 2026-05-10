import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OilService } from '../oil.service';
import { Subscription } from 'rxjs';
import { ImageUrlPipe } from '../pipes/image-url.pipe';

@Component({
  selector: 'app-oil-cart-order',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  templateUrl: './oil-cart-order.component.html',
  styleUrls: ['./oil-cart-order.component.scss']
})
export class OilCartOrderComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  totalAmount = 0;
  giftMessage = '';
  private cartSubscription!: Subscription;
  private visibleSubscription!: Subscription;
  isVisible = true;

  constructor(private oilService: OilService, private router: Router) { }

  ngOnInit() {
    this.cartSubscription = this.oilService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calcTotal();
    });

    this.visibleSubscription = this.oilService.cartVisible$.subscribe(visible => {
      this.isVisible = visible;
    });
  }

  ngOnDestroy() {
    this.cartSubscription?.unsubscribe();
    this.visibleSubscription?.unsubscribe();
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

  updateQuantity(oilId: number, newQty: number) {
    if (newQty < 1) return;
    this.oilService.updateQuantity(oilId, newQty);
  }

  removeItem(oilId: number) {
    this.oilService.removeFromCart(oilId);
  }

  goToCartOrder() {
    this.router.navigateByUrl('/check-order');
  }

  close(): void {
    this.oilService.setCartVisibility(false);
  }

  open(): void {
    this.oilService.setCartVisibility(true);
  }
}
