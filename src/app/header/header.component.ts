import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { OilService } from '../oil.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userName = '';
  isAdmin = false;
  isScrolled = false;
  mobileMenuOpen = false;

  constructor(private router: Router, private oilService: OilService) {}

  ngOnInit(): void {
    this.checkLoginStatus();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();
        this.mobileMenuOpen = false; // 路由切換時關閉手機選單
      });

    window.addEventListener('storage', () => this.checkLoginStatus());
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  checkLoginStatus(): void {
    const userId = localStorage.getItem('userId');
    const adminFlag = localStorage.getItem('isAdmin');
    this.isLoggedIn = !!userId;
    this.isAdmin = adminFlag === 'true';
    this.userName = localStorage.getItem('userName') || '會員';
    this.oilService.refreshCart();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');

    this.oilService.clearCart();

    this.isLoggedIn = false;
    this.isAdmin = false;
    this.userName = '';
    this.mobileMenuOpen = false;

    this.oilService.refreshCart();
    this.router.navigateByUrl('/login');
  }
}
