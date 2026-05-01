import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-success',
  template: '<div>登入中，請稍後...</div>',
})
export class LoginSuccessComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        // 儲存 token
        localStorage.setItem('token', token);
        // 可以透過解析 token 或另外呼叫 API 取得使用者資訊
        // 這裡假設 token 裡有我們需要的資訊
        this.router.navigateByUrl('/');
      } else {
        // 登入失敗
        this.router.navigateByUrl('/login');
      }
    });
  }
}
