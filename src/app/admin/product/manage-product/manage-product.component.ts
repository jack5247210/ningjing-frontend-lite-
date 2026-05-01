import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../../store/product.service';

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss'
})
export class ManageProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error = '';

  // 排序相关
  sortColumn = 'productId';
  sortDirection: 'asc' | 'desc' = 'desc';

  // 筛选相关（状态：显示/隐藏）
  visibilityFilter = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts(true).subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilterAndSort();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = '載入失敗';
        this.loading = false;
      }
    });
  }

  // ─── 筛选 + 排序 ──────────────────────────────
  applyFilterAndSort() {
    let data = [...this.products];

    // 按可见性筛选
    if (this.visibilityFilter === 'visible') {
      data = data.filter(p => p.isVisible);
    } else if (this.visibilityFilter === 'hidden') {
      data = data.filter(p => !p.isVisible);
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

    this.filteredProducts = data;
  }

  onVisibilityChange() {
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

  // ─── 操作 ────────────────────────────────────
  toggleVisibility(id: number) {
    this.productService.toggleVisibility(id).subscribe(() => {
      this.loadProducts();
    });
  }

  editProduct(id: number) {
    this.router.navigate(['/admin/products/edit', id]);
  }

  deleteProduct(id: number) {
    if (confirm('確定刪除此產品？')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err: any) => alert('刪除失敗')
      });
    }
  }
}
