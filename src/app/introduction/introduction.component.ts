import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit, OnDestroy {
  // 工作室照片集
  studioImages: string[] = [
    '/assets/photo1.png',
    '/assets/photo2.png',
    '/assets/photo3.png',
    '/assets/photo4.png'
  ];

  currentSlide = 0;
  private autoPlayInterval: any;

  // 注入 PLATFORM_ID 確保在 SSR (Server-Side Rendering) 環境下不會報錯
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // 只有在瀏覽器環境下才啟動自動輪播
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    // 使用者手動點擊後，重新計算輪播時間
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.studioImages.length;
    }, 4500); // 每 4.5 秒切換一張
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}
