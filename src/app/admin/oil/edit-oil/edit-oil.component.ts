import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OilService, EssentialOil } from '../../../oil.service';
import { ImageUrlPipe } from "../../../pipes/image-url.pipe";
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-oil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImageUrlPipe],
  templateUrl: './edit-oil.component.html',
  styleUrls: ['./edit-oil.component.scss']
})
export class EditOilComponent implements OnInit {
  oil: any = {
    name: '',
    price: 0,
    capacity: '',
    stock: 0,
    introduce: '',
    description: '',
    oilImg: '',
    category: ''
  };
  isEdit = false;
  oilId: number | null = null;

  // 图片上传相关
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private oilService: OilService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.oilId = Number(idParam);
      if (this.oilId) {
        this.isEdit = true;
        this.loadOilData();
      }
    }
  }

  private loadOilData(): void {
    this.oilService.getOilById(this.oilId!).subscribe({
      next: (oil) => {
        this.oil = oil;
      },
      error: () => {
        alert('載入精油資料失敗');
        this.router.navigate(['/admin/oils']);
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
      return this.oil.oilImg; // 无新图片则返回原图
    }
    this.uploading = true;
    try {
      const res = await lastValueFrom(this.oilService.uploadImage(this.selectedFile));
      return res?.url || null;
    } catch (err) {
      alert('圖片上傳失敗');
      throw err;
    } finally {
      this.uploading = false;
    }
  }

  async submitForm(): Promise<void> {
    if (!this.oil.name?.trim() || this.oil.price <= 0) {
      alert('請填寫名稱與價格');
      return;
    }

    try {
      const imageUrl = await this.uploadImage();
      if (imageUrl === null) {
        alert('圖片上傳失敗');
        return;
      }

      const oilData = { ...this.oil, oilImg: imageUrl };

      if (this.isEdit) {
        this.oilService.updateOil(this.oilId!, oilData).subscribe({
          next: () => {
            alert('精油更新成功');
            this.router.navigate(['/admin/oils']);
          },
          error: () => alert('更新失敗')
        });
      } else {
        this.oilService.createOil(oilData).subscribe({
          next: () => {
            alert('精油新增成功');
            this.router.navigate(['/admin/oils']);
          },
          error: () => alert('新增失敗')
        });
      }
    } catch (error) {
      console.error('上傳流程出錯', error);
    }
  }
}
