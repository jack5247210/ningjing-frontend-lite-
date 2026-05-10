import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component'; // 确保路径正确
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { DialogComponent } from "./dialog/dialog.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, DialogComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ningjing-spa';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    // ========== 1. 每次路由切换后自动滚动到顶部 ==========
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });

    // ========== 2. 处理 Google OAuth2 回调 (原有逻辑不变) ==========
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        console.log('从 URL 获取到 token:', token);
        localStorage.setItem('token', token);
        try {
          const payload = this.parseJwt(token);
          console.log('解码后的 payload:', payload);
          if (payload.userId) localStorage.setItem('userId', payload.userId);
          if (payload.userName) localStorage.setItem('userName', payload.userName);
          if (payload.isAdmin !== undefined) localStorage.setItem('isAdmin', payload.isAdmin.toString());
          if (payload.sub) localStorage.setItem('userEmail', payload.sub);
          window.location.href = '/member';
        } catch (e) {
          console.error('JWT 解码失败', e);
          this.router.navigateByUrl('/login');
        }
      }
    });
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
