import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';   // 加入 BehaviorSubject

export interface EssentialOil {
  oilId: number;
  name: string;
  price: number;
  capacity: string;
  description: string;
  introduce: string;
  oilImg: string;
  stock: number;
  category: string;
}

// 精油订单项
export interface OilOrderItem {
  itemId: number;
  orderId: number;
  oilId: number;
  quantity: number;
  unitPrice: number;
  oilName?: string;    // 后端通过 @Transient 填充
}

// 精油订单
export interface OilOrder {
  orderId: number;
  userId: number;
  orderDate: string;    // ISO 日期字符串
  totalAmount: number;
  discount: number;
  finalAmount: number;
  giftItem: string | null;
  status: string;
  address: string | null;
  recipientName: string;
  phone: string;
  deliveryMethod: string;
  paymentMethod: string;
  items?: OilOrderItem[];
}

export interface OrderItem {
  oilId: number;
  quantity: number;
}

export interface OrderRequest {
  userId: number;
  items: OrderItem[];
  address: string | null;
  recipientName: string;
  phone: string;
  deliveryMethod: string;
  paymentMethod: string;
}

export interface OrderResponse {
  orderId: number;
  finalAmount: number;
  giftItem: string;
  discount: number;
}

@Injectable({ providedIn: 'root' })
export class OilService {
  private baseUrl = 'http://localhost:8080/api';
  private shopUrl = `${this.baseUrl}/oil-shop`;
  private adminUrl = `${this.baseUrl}/admin/oils`;

  // 購物車狀態管理
  private cartSubject = new BehaviorSubject<any[]>(this.getCart());
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.shopUrl}/categories`);
  }

  getOils(category?: string): Observable<EssentialOil[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<EssentialOil[]>(`${this.shopUrl}/oils`, { params });
  }

  createOrder(req: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.shopUrl}/order`, req);
  }

  getAllOilsForAdmin(): Observable<EssentialOil[]> {
    return this.http.get<EssentialOil[]>(`${this.adminUrl}`);
  }

  createOil(oilData: any): Observable<EssentialOil> {
    return this.http.post<EssentialOil>(`${this.adminUrl}`, oilData);
  }

  updateOil(id: number, oilData: any): Observable<EssentialOil> {
    return this.http.put<EssentialOil>(`${this.adminUrl}/${id}`, oilData);
  }

  deleteOil(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }

  toggleOilVisibility(id: number): Observable<void> {
    return this.http.put<void>(`${this.adminUrl}/${id}/toggle-visibility`, {});
  }

  getOilById(id: number): Observable<EssentialOil> {
    return this.http.get<EssentialOil>(`${this.shopUrl}/oils/${id}`);
  }

  // ✅ 新增：根据当前 userId 生成专属 localStorage 键
  private getCartKey(): string {
    const userId = localStorage.getItem('userId');
    if (userId) {
      return `oilCart_${userId}`;   // 例如 oilCart_1
    }
    // 未登录时使用一个临时键（但你的系统会在未登录时拦截购买，所以一般不会用到）
    return 'oilCart_guest';
  }

  // 購物車操作方法
  getCart(): any[] {
    const key = this.getCartKey();
    const cart = localStorage.getItem(key);

    // 如果当前用户有购物车，直接返回
    if (cart) {
      return JSON.parse(cart);
    }

    // 如果没有，检查是否存在旧版本的通用购物车
    const oldCart = localStorage.getItem('oilCart');   // 旧键
    if (oldCart) {
      const parsed = JSON.parse(oldCart);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // 把旧购物车迁移到当前用户的名下
        this.saveCart(parsed);
        // 删除旧键，避免下次再次读取
        localStorage.removeItem('oilCart');
        return parsed;
      }
    }

    // 都没有，返回空数组
    return [];
  }

  // oil.service.ts
  getAllOrders(): Observable<OilOrder[]> {
    return this.http.get<OilOrder[]>(`${this.baseUrl}/admin/orders`);
  }

  getOrderDetail(orderId: number): Observable<OilOrder> {
    return this.http.get<OilOrder>(`${this.baseUrl}/admin/orders/${orderId}`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/admin/orders/${orderId}/status?status=${status}`, {});
  }

  private saveCart(cart: any[]): void {
    const key = this.getCartKey();
    localStorage.setItem(key, JSON.stringify(cart));
    this.cartSubject.next([...cart]); // 通知所有订阅者
  }

  addToCart(oil: EssentialOil, quantity: number): void {
    const cart = this.getCart();
    const existing = cart.find(item => item.oilId === oil.oilId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        oilId: oil.oilId,
        name: oil.name,
        price: oil.price,
        quantity,
        oilImg: oil.oilImg
      });
    }
    this.saveCart(cart);
  }


  removeFromCart(oilId: number): void {
    let cart = this.getCart();
    cart = cart.filter(item => item.oilId !== oilId);
    this.saveCart(cart);
  }

  updateQuantity(oilId: number, quantity: number): void {
    const cart = this.getCart();
    const item = cart.find(i => i.oilId === oilId);
    if (item) {
      item.quantity = quantity;
      this.saveCart(cart);
    }
  }

  clearCart(): void {
    const key = this.getCartKey();
    localStorage.removeItem(key);
    this.cartSubject.next([]);   // 推送空数组
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.adminUrl}/upload-image`, formData);
  }


  private cartVisibleSubject = new BehaviorSubject<boolean>(false);
  public cartVisible$ = this.cartVisibleSubject.asObservable();

  toggleCartVisibility(): void {
    this.cartVisibleSubject.next(!this.cartVisibleSubject.value);
  }

  setCartVisibility(visible: boolean): void {
    this.cartVisibleSubject.next(visible);
  }

  // 强制刷新购物车（用于登录/登出切换账号）
  refreshCart(): void {
    this.cartSubject.next(this.getCart());
  }

  // 取得使用者的歷史訂單（基本資料，不含明細）
getUserOrders(userId: number): Observable<OilOrder[]> {
  return this.http.get<OilOrder[]>(`${this.shopUrl}/orders/user/${userId}`);
}
}
