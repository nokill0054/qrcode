# B54 QR Code SaaS — Test Plan

Bu dosya B54 QR Code SaaS ürününde yapılacak manuel ve teknik testleri tanımlar.

Ana ilke:
Her yeni özellikten sonra ana kullanıcı akışı tekrar test edilir.

---

## 1. Test Kapsamı

Bu test planı şu alanları kapsar:

- Kullanıcı kayıt
- Kullanıcı giriş
- Dashboard erişimi
- Sabit QR görüntüleme
- QR hedef link değiştirme
- QR yönlendirme
- Public profil sayfası
- Yetkisiz erişim kontrolleri
- Build testi
- Route testi
- Güvenlik temel kontrolleri

---

## 2. Ana Kullanıcı Akışı Testi

### TEST-001 — Yeni kullanıcı kayıt olabilir

Adımlar:
1. Ana sayfa açılır.
2. Kayıt ol sekmesi seçilir.
3. E-posta yazılır.
4. Şifre yazılır.
5. Kayıt ol butonuna basılır.

Beklenen sonuç:
- Kullanıcı oluşturulur.
- Token localStorage içine yazılır.
- Kullanıcı dashboard sayfasına yönlenir.

Durum:
- Geçti.

---

### TEST-002 — Kullanıcı giriş yapabilir

Adımlar:
1. Ana sayfa açılır.
2. Giriş sekmesi seçilir.
3. E-posta yazılır.
4. Şifre yazılır.
5. Giriş butonuna basılır.

Beklenen sonuç:
- Kullanıcı giriş yapar.
- Dashboard açılır.

Durum:
- Geçti.

---

### TEST-003 — Dashboard QR kodu gösterir

Adımlar:
1. Kullanıcı giriş yapar.
2. Dashboard açılır.

Beklenen sonuç:
- Sabit QR kod görünür.
- QR linki görünür.
- Profil sayfası linki görünür.
- Aktif hedef link görünür.

Durum:
- Geçti.

---

### TEST-004 — Kullanıcı hedef link değiştirebilir

Adımlar:
1. Dashboard açılır.
2. Yeni yönlendirme linki alanına URL yazılır.
3. Linki Yayınla butonuna basılır.

Beklenen sonuç:
- Yeni link aktif hedef olur.
- Önceki yönlendirme linkleri listesine eklenir.
- Başarı mesajı görünür.

Durum:
- Geçti.

---

### TEST-005 — QR kod son yayınlanan linke gider

Adımlar:
1. Dashboard üzerinden yeni link yayınlanır.
2. QR kod okutulur veya QR linki tarayıcıda açılır.

Beklenen sonuç:
- Kullanıcı en son yayınlanan linke yönlendirilir.
- Eski linke gitmez.

Durum:
- Geçti.

---

## 3. API Testleri

### TEST-API-001 — Auth me endpoint

Endpoint:
- GET /api/auth/me

Beklenen sonuç:
- Geçerli token ile user ve qr datası döner.
- Geçersiz token ile hata döner.

Durum:
- Geçti.

---

### TEST-API-002 — Me QR endpoint

Endpoint:
- GET /api/me/qr

Beklenen sonuç:
- Geçerli token ile kullanıcının QR datası döner.
- QR slug, mode, urls ve profile alanları görünür.

Durum:
- Geçti.

---

### TEST-API-003 — Yeni URL ekleme

Endpoint:
- POST /api/me/qr/urls

Beklenen sonuç:
- Geçerli token ile yeni URL eklenir.
- URL listenin sonuna eklenir.
- QR son URL’ye yönlenir.

Durum:
- Geçti.

---

### TEST-API-004 — Public profil endpoint

Endpoint:
- GET /api/public/profile/:slug

Beklenen sonuç:
- Public profil bilgisi döner.
- Secret veya kullanıcı password bilgisi dönmez.

Durum:
- Geçti.

---

### TEST-API-005 — Redirect endpoint

Endpoint:
- GET /api/redirect/:slug

Beklenen sonuç:
- QR slug bulunursa son URL’ye 302 redirect yapar.
- Cache engelleyici headerlar vardır.
- QR slug bulunmazsa hata döner.

Durum:
- Geçti.

---

## 4. Frontend Route Testleri

### TEST-FE-001 — Login route

Route:
- /

Beklenen sonuç:
- Login/kayıt ekranı açılır.

Durum:
- Geçti.

---

### TEST-FE-002 — Dashboard route

Route:
- /dashboard

Beklenen sonuç:
- Token varsa dashboard açılır.
- Token yoksa login sayfasına yönlenir.

Durum:
- Geçti.

---

### TEST-FE-003 — Public profil route

Route:
- /q/:slug

Beklenen sonuç:
- Public profil sayfası açılır.

Durum:
- Geçti.

---

## 5. Build Testleri

### TEST-BUILD-001 — React production build

Komut:
- npm run build

Beklenen sonuç:
- Build hatasız tamamlanır.

Durum:
- Geçti.

Not:
- Browserslist ve CRA uyarıları var ama build hatası değildir.

---

## 6. Güvenlik Testleri

### TEST-SEC-001 — .env public repo’ya gitmemeli

Beklenen sonuç:
- backend/.env GitHub’a eklenmez.
- backend/.env.example eklenebilir.
- Secret değerleri mesajlarda gösterilmez.

Durum:
- Geçti.

---

### TEST-SEC-002 — Yetkisiz QR erişimi

Beklenen sonuç:
- /api/me/qr token olmadan çalışmaz.
- /api/me/qr geçersiz token ile çalışmaz.

Durum:
- Test edilecek.

---

### TEST-SEC-003 — Public endpoint secret döndürmez

Beklenen sonuç:
- Public profil endpoint password, JWT, secret veya private bilgi döndürmez.

Durum:
- Geçti.

---

## 7. Yeni Özellik Öncesi Zorunlu Test Listesi

Her yeni özellikten önce ve sonra şu testler yapılır:

1. npm run build
2. / route testi
3. /dashboard route testi
4. /api/auth/me token testi
5. /api/me/qr token testi
6. Link değiştirme testi
7. QR redirect testi
8. git diff --check
9. git status --short

---

## 8. Henüz Test Edilmeyen Alanlar

- QR PNG indirme
- QR kopyalama butonu
- Profil düzenleme ekranı
- Admin panel
- Analytics
- Payment
- Production deploy
- Mobil uygulama
- Server restart sonrası otomatik ayağa kalkma

---

## 9. Test Kararı

Mevcut teknik MVP demo için çalışır durumdadır.

Production için henüz yeterli değildir.

Production öncesi gerekenler:
- Kalıcı servis
- Deploy planı
- Security checklist
- QA checklist
- Backup otomasyonu
- Bülent onayı

