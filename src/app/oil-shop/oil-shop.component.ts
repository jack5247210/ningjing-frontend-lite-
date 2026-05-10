import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OilService, EssentialOil } from '../oil.service';
import { OilCartOrderComponent } from '../oil-cart-order/oil-cart-order.component';
import { ImageUrlPipe } from '../pipes/image-url.pipe';

@Component({
  selector: 'app-oil-shop',
  standalone: true,
  imports: [CommonModule, RouterLink, OilCartOrderComponent, ImageUrlPipe],
  templateUrl: './oil-shop.component.html',
  styleUrls: ['./oil-shop.component.scss']
})
export class OilShopComponent implements OnInit {
  oils: EssentialOil[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  loading = false;
  error = '';
  isLoggedIn = false;



  constructor(private oilService: OilService) {}

  ngOnInit() {
  // 檢查登入狀態
  this.isLoggedIn = !!localStorage.getItem('token');
  this.loadCategories();
  this.loadOils();
}
  loadCategories() {
    this.oilService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: () => console.error('获取分类失败')
    });
  }

  loadOils() {
    this.loading = true;
    this.oilService.getOils(this.selectedCategory || undefined).subscribe({
      next: (data) => {
        this.oils = data;
        this.loading = false;
      },
      error: () => {
        this.error = '加载失败，请稍后重试';
        this.loading = false;
      }
    });
  }

  selectCategory(cat: string | null) {
    this.selectedCategory = cat;
    this.loadOils();
  }
}
