import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;                           // 已是完整 URL，直接返回
    }
    if (value.startsWith('/uploads/')) {
      return 'http://localhost:8080' + value; // 后端相对路径拼接
    }
    // 纯文件名（不含斜杠），映射到 Angular 的 assets 目录
    if (!value.includes('/')) {
      return '/assets/' + value;
    }
    return value;
  }
}
