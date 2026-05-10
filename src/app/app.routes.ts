import { StoreComponent } from './store/store.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { LogInComponent } from './log-in/log-in.component';
import { EditArticleComponent } from './admin/article/edit-article/edit-article.component';
import { ReadArticleComponent } from './read-article/read-article.component';
import { ListArticleComponent } from './list-article/list-article.component';
import { ConsultComponent } from './consult/consult.component';
import { MemberComponent } from './member/member.component';
import { AboutJoyceComponent } from './about-joyce/about-joyce.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { ProductComponent } from './store/product/product.component';
import { ManageProductComponent } from './admin/product/manage-product/manage-product.component';
// 或將元件類別名稱改為 CreateProductComponent 並匯出（但建議正名）
import { AppointmentComponent } from './admin/appointment/appointment.component'; // 需要建立
import { ManageArticleComponent } from './admin/article/manage-article/manage-article.component';
import { EditProductComponent } from './admin/product/edit-product/edit-product.component';
import { LoginSuccessComponent } from './login-success/login-success.component';
import { OilShopComponent } from './oil-shop/oil-shop.component';
import { ManageOilComponent } from './admin/oil/manage-oil/manage-oil.component';
import { EditOilComponent } from './admin/oil/edit-oil/edit-oil.component';
import { OilCartComponent } from './oil-cart/oil-cart.component';
import { OilComponent } from './store/oil/oil.component';
import { CheckOrderComponent } from './check-order/check-order.component';
import { ManageOilOrderComponent } from './admin/oil/manage-oil-order/manage-oil-order.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ManageHolidayComponent } from './admin/appointment/manage-holiday/manage-holiday.component';
import { OrderHistoryComponent } from './order-history/order-history.component';





export const routes: Routes = [
  { path: '', component: HomeComponent }, // 設定預設路徑為 Home
  { path: 'about-joyce', component: AboutJoyceComponent },
  { path: 'introduction', component: IntroductionComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'consult', component: ConsultComponent },
  // 如果有其他頁面可以繼續加，例如：
  { path: 'store', component: StoreComponent },
  { path: 'oil-shop', component: OilShopComponent },
  { path: 'oil/:id', component: OilComponent },
  { path: 'cart', component: OilCartComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'check-order', component: CheckOrderComponent },
  { path: 'login', component: LogInComponent },
  { path: 'member', component: MemberComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'reservation', component: ReservationComponent },
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
    { path: 'oils', component: ManageOilComponent },
    { path: 'oils/create', component: EditOilComponent },
    { path: 'oils/edit/:id', component: EditOilComponent },
    { path: 'oil-orders', component: ManageOilOrderComponent },
    { path: 'appointments', component: AppointmentComponent },
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'holidays', component: ManageHolidayComponent }
    ]
  },
];
