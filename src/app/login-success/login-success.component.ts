import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-success',
  standalone: true,
  template: '<p>登入中，請稍後...</p>',
})
export class LoginSuccessComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('token', token);
        try {
          const payload = this.parseJwt(token);
          console.log('解析的 payload:', payload);
          if (payload.userId) localStorage.setItem('userId', payload.userId);
          if (payload.userName) localStorage.setItem('userName', payload.userName);
          if (payload.isAdmin !== undefined) localStorage.setItem('isAdmin', String(payload.isAdmin));
          if (payload.sub) localStorage.setItem('userEmail', payload.sub);
        } catch (e) {
          console.error('JWT 解析失敗', e);
          this.router.navigateByUrl('/login');
          return;
        }
        // 强制跳转并刷新
        window.location.href = '/member';
      } else {
        this.router.navigateByUrl('/login');
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
