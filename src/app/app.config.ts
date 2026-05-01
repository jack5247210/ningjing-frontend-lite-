import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { routes } from './app.routes';

// 函數式攔截器
function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const token = localStorage.getItem('token');
  console.log('🔐 攔截器執行中，URL:', req.url, 'Token存在:', !!token);

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  return next(req);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])  // 使用我們自己定義的函數
    )
  ]
};
