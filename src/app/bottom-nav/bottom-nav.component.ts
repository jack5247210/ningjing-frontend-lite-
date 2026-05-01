import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss'
})
export class BottomNavComponent {
  navItems = [
    { label: '首頁', icon: '🏠', route: '/home' },
    { label: '療程', icon: '💆‍♀️', route: '/store' },
    { label: '商城', icon: '🛍️', route: '/oil-shop' },
    { label: '專欄', icon: '📖', route: '/article' },
    { label: '會員', icon: '👤', route: '/member' }
  ];

  constructor(public router: Router) {}
}
