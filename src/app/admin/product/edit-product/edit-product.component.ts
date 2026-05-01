import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../../store/product.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  title = '';
  price: number | null = null;
  duration: number | null = null;
  description = '';
  introduce = '';
  productImg = '';

  isEdit = false;
  productId: number | null = null;
  loading = false;
  error = '';

  // 图片上传相关
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = Number(idParam);
      if (this.productId) {
        this.isEdit = true;
        this.loadProductData();
      }
    }
  }

  private loadProductData(): void {
    this.loading = true;
    this.productService.getProductById(this.productId!).subscribe({
      next: (product: Product) => {
        this.title = product.title;
        this.price = product.price;
        this.duration = product.duration;
        this.description = product.description || '';
        this.introduce = product.introduce || '';
        this.productImg = product.productImg || '';
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = '載入產品資料失敗';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private async uploadImage(): Promise<string | null> {
    if (!this.selectedFile) {
      return this.productImg;
    }
    this.uploading = true;
    try {
      const res = await lastValueFrom(this.productService.uploadImage(this.selectedFile));
      return res?.url || null;
    } catch (err) {
      alert('圖片上傳失敗');
      throw err;
    } finally {
      this.uploading = false;
    }
  }

  async submitForm(): Promise<void> {
    if (!this.title.trim()) {
      alert('請填寫產品標題');
      return;
    }
    if (this.price === null || this.price <= 0) {
      alert('請填寫有效價格');
      return;
    }
    if (this.duration === null || this.duration <= 0) {
      alert('請填寫有效時長');
      return;
    }

    try {
      const imageUrl = await this.uploadImage();
      if (imageUrl === null) {
        alert('圖片上傳失敗');
        return;
      }

      const productData = {
        title: this.title.trim(),
        price: this.price,
        duration: this.duration,
        description: this.description.trim(),
        introduce: this.introduce.trim(),
        productImg: imageUrl
      };

      this.loading = true;
      if (this.isEdit) {
        this.productService.updateProduct(this.productId!, productData).subscribe({
          next: () => {
            alert('產品更新成功！');
            this.router.navigate(['/admin/products']);
          },
          error: (err) => {
            console.error(err);
            alert('更新失敗');
            this.loading = false;
          }
        });
      } else {
        this.productService.addProduct(productData).subscribe({
          next: () => {
            alert('產品新增成功！');
            this.router.navigate(['/admin/products']);
          },
          error: (err) => {
            console.error(err);
            alert('新增失敗');
            this.loading = false;
          }
        });
      }
    } catch (error) {
      console.error('上傳流程出錯', error);
      this.loading = false;
    }
  }
}
