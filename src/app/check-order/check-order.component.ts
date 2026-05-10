import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OilService, OrderRequest, OrderResponse } from '../oil.service';
import { MemberSidebarComponent } from "../member-sidebar/member-sidebar.component";
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-check-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MemberSidebarComponent],
  templateUrl: './check-order.component.html',
  styleUrls: ['./check-order.component.scss']
})
export class CheckOrderComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount = 0;
  finalAmount = 0;
  discount = 0;
  giftMessage = '';
  loading = false;
  error = '';

  recipientName = '';
  phone = '';
  deliveryMethod: 'pickup' | 'delivery' = 'delivery';
  paymentMethod: string = 'cod';

  // 縣市區域下拉選單
  cities: string[] = [
    '臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市',
    '基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
    '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣',
    '澎湖縣', '金門縣', '連江縣'
  ];

  districtsMap: { [key: string]: string[] } = {
    '臺北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
    '新北市': ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '樹林區', '鶯歌區', '三峽區', '淡水區', '汐止區', '瑞芳區', '土城區', '蘆洲區', '五股區', '泰山區', '林口區', '深坑區', '石碇區', '坪林區', '三芝區', '石門區', '八里區', '平溪區', '雙溪區', '貢寮區', '金山區', '萬里區', '烏來區'],
    '桃園市': ['桃園區', '中壢區', '大溪區', '楊梅區', '蘆竹區', '大園區', '龜山區', '八德區', '龍潭區', '平鎮區', '新屋區', '觀音區', '復興區'],
    '臺中市': ['中區', '東區', '南區', '西區', '北區', '西屯區', '南屯區', '北屯區', '豐原區', '東勢區', '大甲區', '清水區', '沙鹿區', '梧棲區', '后里區', '神岡區', '潭子區', '大雅區', '新社區', '石岡區', '外埔區', '大安區', '烏日區', '大肚區', '龍井區', '霧峰區', '太平區', '大里區', '和平區'],
    '臺南市': ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區', '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區'],
    '高雄市': ['楠梓區', '左營區', '鼓山區', '三民區', '苓雅區', '新興區', '前金區', '鹽埕區', '前鎮區', '旗津區', '小港區', '鳳山區', '林園區', '大寮區', '大樹區', '大社區', '仁武區', '鳥松區', '岡山區', '橋頭區', '燕巢區', '田寮區', '阿蓮區', '路竹區', '湖內區', '茄萣區', '永安區', '彌陀區', '梓官區', '旗山區', '美濃區', '六龜區', '甲仙區', '杉林區', '內門區', '茂林區', '桃源區', '那瑪夏區'],
    '基隆市': ['仁愛區', '信義區', '中正區', '中山區', '安樂區', '暖暖區', '七堵區'],
    '新竹市': ['東區', '北區', '香山區'],
    '新竹縣': ['竹北市', '湖口鄉', '新豐鄉', '新埔鎮', '關西鎮', '芎林鄉', '寶山鄉', '竹東鎮', '五峰鄉', '橫山鄉', '尖石鄉', '北埔鄉', '峨眉鄉'],
    '苗栗縣': ['苗栗市', '頭份市', '竹南鎮', '後龍鎮', '通霄鎮', '苑裡鎮', '卓蘭鎮', '三灣鄉', '南庄鄉', '獅潭鄉', '造橋鄉', '頭屋鄉', '公館鄉', '大湖鄉', '泰安鄉', '銅鑼鄉', '三義鄉', '西湖鄉'],
    '彰化縣': ['彰化市', '員林市', '和美鎮', '鹿港鎮', '溪湖鎮', '二林鎮', '田中鎮', '北斗鎮', '花壇鄉', '芬園鄉', '大村鄉', '永靖鄉', '伸港鄉', '線西鄉', '福興鄉', '秀水鄉', '埔心鄉', '埔鹽鄉', '大城鄉', '芳苑鄉', '竹塘鄉', '社頭鄉', '二水鄉', '田尾鄉', '埤頭鄉', '溪州鄉'],
    '南投縣': ['南投市', '埔里鎮', '草屯鎮', '竹山鎮', '集集鎮', '名間鄉', '鹿谷鄉', '中寮鄉', '魚池鄉', '國姓鄉', '水里鄉', '信義鄉', '仁愛鄉'],
    '雲林縣': ['斗六市', '斗南鎮', '虎尾鎮', '西螺鎮', '土庫鎮', '北港鎮', '古坑鄉', '大埤鄉', '莿桐鄉', '林內鄉', '二崙鄉', '崙背鄉', '麥寮鄉', '東勢鄉', '褒忠鄉', '臺西鄉', '元長鄉', '四湖鄉', '口湖鄉', '水林鄉'],
    '嘉義市': ['東區', '西區'],
    '嘉義縣': ['太保市', '朴子市', '布袋鎮', '大林鎮', '民雄鄉', '溪口鄉', '新港鄉', '六腳鄉', '東石鄉', '義竹鄉', '鹿草鄉', '水上鄉', '中埔鄉', '竹崎鄉', '梅山鄉', '番路鄉', '大埔鄉', '阿里山鄉'],
    '屏東縣': ['屏東市', '潮州鎮', '東港鎮', '恆春鎮', '萬丹鄉', '長治鄉', '麟洛鄉', '九如鄉', '里港鄉', '鹽埔鄉', '高樹鄉', '萬巒鄉', '內埔鄉', '竹田鄉', '新埤鄉', '枋寮鄉', '新園鄉', '崁頂鄉', '林邊鄉', '南州鄉', '佳冬鄉', '琉球鄉', '車城鄉', '滿州鄉', '枋山鄉', '三地門鄉', '霧臺鄉', '瑪家鄉', '泰武鄉', '來義鄉', '春日鄉', '獅子鄉', '牡丹鄉'],
    '宜蘭縣': ['宜蘭市', '羅東鎮', '蘇澳鎮', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '冬山鄉', '五結鄉', '三星鄉', '大同鄉', '南澳鄉'],
    '花蓮縣': ['花蓮市', '鳳林鎮', '玉里鎮', '新城鄉', '吉安鄉', '壽豐鄉', '光復鄉', '豐濱鄉', '瑞穗鄉', '富里鄉', '秀林鄉', '萬榮鄉', '卓溪鄉'],
    '臺東縣': ['臺東市', '成功鎮', '關山鎮', '卑南鄉', '鹿野鄉', '池上鄉', '東河鄉', '長濱鄉', '太麻里鄉', '大武鄉', '綠島鄉', '海端鄉', '延平鄉', '金峰鄉', '達仁鄉', '蘭嶼鄉'],
    '澎湖縣': ['馬公市', '湖西鄉', '白沙鄉', '西嶼鄉', '望安鄉', '七美鄉'],
    '金門縣': ['金城鎮', '金沙鎮', '金湖鎮', '金寧鄉', '烈嶼鄉', '烏坵鄉'],
    '連江縣': ['南竿鄉', '北竿鄉', '莒光鄉', '東引鄉']
  };

  selectedCity = '';
  selectedDistrict = '';
  detailAddress = '';

  constructor(
    private oilService: OilService,
    private dialogService: DialogService,   // ✅ 修正名稱，與後續使用一致
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadUserInfo();
  }

  loadCart(): void {
    this.cartItems = this.oilService.getCart();
    if (this.cartItems.length === 0) {
      this.goBack();
      return;
    }
    this.calcSummary();
  }

  calcSummary(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (this.totalAmount >= 2000) {
      this.discount = 200;
      this.finalAmount = this.totalAmount - this.discount;
      this.giftMessage = '';
    } else if (this.totalAmount >= 1000) {
      this.discount = 0;
      this.finalAmount = this.totalAmount;
      this.giftMessage = '🎁 贈送薰衣草精油滾珠瓶 5ml';
    } else {
      this.discount = 0;
      this.finalAmount = this.totalAmount;
      this.giftMessage = '';
    }
  }

  loadUserInfo(): void {
    const userName = localStorage.getItem('userName');
    if (userName) {
      this.recipientName = userName;
    }
  }

  // 數量控制
  updateQuantity(oilId: number, newQty: number) {
    if (newQty < 1) return;
    const item = this.cartItems.find(i => i.oilId === oilId);
    if (item) {
      item.quantity = newQty;
      this.oilService.updateQuantity(oilId, newQty);
      this.calcSummary();
    }
  }

  onQuantityChange() {
    this.cartItems.forEach(item => {
      if (item.quantity < 1) item.quantity = 1;
    });
    this.calcSummary();
  }

  // 驗證手機格式
  isValidPhone(phone: string): boolean {
    if (!phone) return false;
    return /^09\d{8}$/.test(phone);
  }

  // 縣市區域下拉
  get availableDistricts(): string[] {
    return this.districtsMap[this.selectedCity] || [];
  }

  onCityChange() {
    this.selectedDistrict = '';
    this.updateAddress();
  }

  updateAddress(): string | null {
    if (this.deliveryMethod === 'pickup') return null;
    const parts = [this.selectedCity, this.selectedDistrict, this.detailAddress].filter(Boolean);
    return parts.join('');
  }

  goBack(): void {
    this.router.navigateByUrl('/cart');
  }

  submitOrder(): void {
    this.error = '';

    if (this.deliveryMethod === 'delivery') {
      if (!this.selectedCity || !this.selectedDistrict) {
        this.error = '送貨到府請選擇縣市與區域';
        return;
      }
      if (!this.detailAddress.trim()) {
        this.error = '送貨到府請填寫詳細地址';
        return;
      }
      if (!this.phone || !this.phone.trim()) {
        this.error = '送貨到府請填寫聯絡電話';
        return;
      }
      if (!this.isValidPhone(this.phone.trim())) {
        this.error = '請輸入正確的手機格式（例如：0912345678）';
        return;
      }
    }

    if (!this.recipientName.trim()) {
      this.error = '請填寫收件人姓名';
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.dialogService.alert('請先登入');   // ✅ 一致使用 dialogService
      this.router.navigateByUrl('/login');
      return;
    }

    const items = this.cartItems.map(item => ({
      oilId: item.oilId,
      quantity: item.quantity
    }));

    const orderReq: OrderRequest = {
      userId: Number(userId),
      items: items,
      address: this.deliveryMethod === 'delivery' ? this.updateAddress() : null,
      recipientName: this.recipientName,
      phone: this.phone,
      deliveryMethod: this.deliveryMethod,
      paymentMethod: this.paymentMethod
    };

    this.loading = true;

    this.oilService.createOrder(orderReq).subscribe({
      next: (res: OrderResponse) => {
        this.loading = false;
        this.dialogService.alert(`訂單已送出！實付金額 NT$ ${res.finalAmount}${res.giftItem ? '，贈品：' + res.giftItem : ''}`);
        this.oilService.clearCart();
        this.router.navigateByUrl('/member');
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || '訂單送出失敗，請稍後再試';
      }
    });
  }
}
