import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from './../store/product.service';
import { RouterLink } from '@angular/router';   // 加入這行
import { ImageUrlPipe } from '../pipes/image-url.pipe';   // 确保路径正确
@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageUrlPipe],  // 需要 CommonModule 來使用 *ngFor
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  products: any[] = [];   // 存放所有產品
  loading = false;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts(false).subscribe({
      next: (data: any) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('載入產品失敗', err);
        this.error = '載入產品失敗，請稍後再試';
        this.loading = false;
      }
    });
  }
}
