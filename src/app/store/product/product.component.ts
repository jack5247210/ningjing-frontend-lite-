import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../product.service';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';
import { RouterLink } from '@angular/router';  // 确保导入

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageUrlPipe],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router   // ✅ 確認有這行

  ) {}

  goToReservation() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('請先登入再預約');
    this.router.navigateByUrl('/login');
    return;
  }
  this.router.navigateByUrl('/reservation');
}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (data: Product) => {
          this.product = data;
          this.loading = false;
        },
        error: (err: any) => {
          console.error(err);
          this.error = '載入產品失敗';
          this.loading = false;
        }
      });
    } else {
      this.error = '無效的產品編號';
      this.loading = false;
    }
  }
}
