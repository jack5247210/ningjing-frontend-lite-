# 寧境芳療系統 – 前端

Angular 19 前端應用，提供會員登入、線上預約、電商購物、文章管理、後台管理等完整功能。

---

## 技術棧

- Angular 19
- TypeScript
- RxJS
- Bootstrap 5
- SCSS
- RWD 響應式設計

---

## 主要功能

- 會員註冊 / 登入（JWT 身分驗證）
- Google OAuth2 第三方登入
- 線上預約系統（日曆即時查詢名額、自動排除公休日、時段控管）
- 精油電商購物車（滿額折扣與贈品邏輯）
- 文章管理與留言互動
- 後台管理介面（產品上下架、預約審核、訂單管理）
- AI 諮詢小幫手（根據需求自動推薦療程）

---

## 環境變數設定

建立 `src/environments/environment.ts` 檔案：

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  googleClientId: 'your_google_client_id'
};
