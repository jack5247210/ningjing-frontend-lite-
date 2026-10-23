import { StoreComponent } from './store/store.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LogInComponent } from './log-in/log-in.component';
import { EditArticleComponent } from './admin/article/edit-article/edit-article.component';
import { ReadArticleComponent } from './read-article/read-article.component';
import { ListArticleComponent } from './list-article/list-article.component';
import { AboutJoyceComponent } from './about-joyce/about-joyce.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { ProductComponent } from './store/product/product.component';
import { ManageProductComponent } from './admin/product/manage-product/manage-product.component';
// 或將元件類別名稱改為 CreateProductComponent 並匯出（但建議正名）
import { ManageArticleComponent } from './admin/article/manage-article/manage-article.component';
import { EditProductComponent } from './admin/product/edit-product/edit-product.component';
import { LoginSuccessComponent } from './login-success/login-success.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';





export const routes: Routes = [
  { path: '', component: HomeComponent }, // 設定預設路徑為 Home
  { path: 'about-joyce', component: AboutJoyceComponent },
  { path: 'introduction', component: IntroductionComponent },
  { path: 'product/:id', component: ProductComponent },
  // 如果有其他頁面可以繼續加，例如：
  { path: 'store', component: StoreComponent },
  { path: 'login', component: LogInComponent },
  { path: 'list-article', component: ListArticleComponent },
  { path: 'article/:id', component: ReadArticleComponent },
  { path: 'login-success', component: LoginSuccessComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'admin', component: AdminComponent }, // 確保管理員模式這行存在
  // 管理後台（需加上守衛保護，稍後說明）
  {
  path: 'admin',
  component: AdminComponent,
  children: [
    { path: 'products', component: ManageProductComponent },
    { path: 'products/create', component: EditProductComponent },
    { path: 'products/edit/:id', component: EditProductComponent },
    { path: 'articles', component: ManageArticleComponent },
    { path: 'articles/create', component: EditArticleComponent },
    { path: 'articles/edit/:id', component: EditArticleComponent },
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    ]
  },
];
