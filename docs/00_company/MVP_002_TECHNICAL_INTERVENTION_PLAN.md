# MVP-002 Technical Intervention Plan

## Faz

Faz 1 — MVP / Build

## Anayasa Kontrolü

Bu çalışma kod değişikliği içereceği için şu kurallara bağlıdır:

- Bülent final karar makamıdır.
- Büyük görev RACI ile başlatılır.
- Backup ihtiyacı değerlendirilmeden database değişikliği yapılmaz.
- Secret, token, credential açık yazılmaz.
- Test geçmeden release yapılmaz.
- QR kod değişmez, arkasındaki hedef değişir.
- Markdown dosyaları gerçek kaynaktır.

## Mevcut Backend Durumu

Ana dosya:

- `backend/server.js`

Mevcut durum:

- Express backend tek dosyada çalışıyor.
- MongoDB bağlantısı hardcoded.
- JWT secret hardcoded.
- User modeli var.
- QR modeli var.
- Auth middleware var.
- QR endpointleri auth kullanmıyor.
- QR kaydı `userId` ve `urls` alanlarıyla çalışıyor.
- Redirect endpointi 302 ve no-cache kullanıyor.

Korunacak çalışan davranış:

- `/api/redirect/:userId` benzeri redirect mantığı korunacak.
- Son URL’ye yönlendirme mantığı korunacak.
- 302 + no-cache korunacak.
- Backend localhost bind korunacak.

## Mevcut Frontend Durumu

Ana dosyalar:

- `src/App.js`
- `src/components/Login.js`
- `src/components/QRGenerator.js`
- `src/components/Dashboard.js`
- `src/setupProxy.js`

Mevcut durum:

- `/` route QRGenerator açıyor.
- `/dashboard` route Dashboard açıyor.
- Login component var ama route’a bağlı değil.
- Login sonrası `/generate` adresine gidiyor fakat route yok.
- QRGenerator random userId üretiyor.
- Dashboard `location.state.userId` ile çalışıyor.
- Gerçek kullanıcıya bağlı QR yönetimi yok.

## MVP-002 Hedef Teknik Yapı

### Backend

Yeni veya güncellenecek alanlar:

User:
- email
- password
- defaultQrSlug
- createdAt

QR:
- ownerUserId
- slug
- mode
- urls
- profile
- createdAt
- updatedAt

Mode değerleri:

- `redirect`
- `profile`

Profile alanları:

- displayName
- bio
- website
- socialLinks

### API Planı

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

QR:

- `GET /api/me/qr`
- `POST /api/me/qr/urls`
- `PUT /api/me/qr/mode`
- `PUT /api/me/qr/profile`

Public:

- `GET /q/:slug`
- `GET /api/redirect/:slug`, geriye dönük uyumluluk için korunabilir.

## Frontend Planı

Route planı:

- `/login`
- `/dashboard`
- `/q/:slug`
- `/` geçici olarak login veya QRGenerator yönlendirmesi

Component planı:

- Login mevcut component ile düzeltilir.
- Dashboard gerçek token ile kullanıcı QR bilgisini çeker.
- QRGenerator ya kaldırılır ya da dashboard içine taşınır.
- ProfilePage public profil gösterimi için eklenebilir.

## Güvenlik Planı

- JWT secret `.env` üzerinden okunacak.
- Mongo URI `.env` üzerinden okunacak.
- `.env.example` oluşturulacak.
- `.env` GitHub’a gönderilmeyecek.
- QR yönetim endpointleri auth zorunlu olacak.
- Kullanıcı sadece kendi QR kaydını değiştirebilecek.
- Public endpointlerde secret/log yok.

## Backup İhtiyacı

Kod değişikliğinden önce app klasörü backup alınmalı.

Database alanları genişletilecekse MongoDB backup alınmalı.

Bu çalışma database silme veya destructive migration içermemelidir.
Mevcut kayıtlara geriye dönük uyum korunmalıdır.

## Dokunulacak Dosyalar

Kesin:

- `backend/server.js`
- `src/App.js`
- `src/components/Login.js`
- `src/components/Dashboard.js`
- `src/components/QRGenerator.js`

Muhtemel:

- `src/components/ProfilePage.js`
- `backend/.env.example`
- `backend/.gitignore`
- `docs/00_company/CURRENT_HANDOFF.md`
- `docs/02_engineering/API_CONTRACTS.md`
- `docs/02_engineering/DATABASE.md`
- `docs/03_testing/TEST_PLAN.md`
- `docs/04_security/TOKEN_POLICY.md`

## Test Planı

Minimum testler:

1. Register
2. Login
3. Token ile `/api/auth/me`
4. Kullanıcıya ait QR kaydı oluşturma
5. Dashboard QR gösterimi
6. URL ekleme
7. Redirect mode test
8. Profile mode test
9. Slug ile public profil görüntüleme
10. Başka kullanıcının QR kaydını değiştirme engeli
11. 302 no-cache redirect kontrolü
12. Production build testi

## Stop-the-Line Koşulları

İş şu durumlarda durur:

- Secret dosyada veya terminal çıktısında görünürse
- Backup gerektiren işlem backup olmadan istenirse
- QR slug kalıcılığı bozulursa
- Auth bypass riski oluşursa
- Mevcut çalışan redirect sistemi bozulursa
- Test başarısız olursa
- Bülent onayı gereken adım belirsizse

## Sonuç

MVP-002 kod değişikliklerine başlamadan önce bu teknik plan kabul edilmelidir.
İlk uygulama adımı backup almak ve ardından `.env` güvenlik düzenlemesiyle başlamaktır.
