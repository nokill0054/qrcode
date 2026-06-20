# B54 QR Code SaaS — Security Audit Log

Bu dosya QR Code SaaS projesinde yapılan güvenlik kontrollerinin sonuçlarını kayıt altına alır.

---

## SEC-CHECK-001 — Temel güvenlik mini kontrol

- Tarih: 2026-06-20
- Ortam: Demo/Test
- Kapsam: Secret kontrolü, auth endpoint kontrolü, public endpoint kontrolü, password hash kontrolü
- Sonuç: Geçti
- Onay durumu: Production onayı değildir

### Kontrol Edilen Maddeler

#### 1. Git tracked secret kontrolü

Sonuç:
- Geçti

Not:
- Git tarafından takip edilen `.env`, `.pem`, `.key`, `id_rsa`, `client_secret` dosyası bulunmadı.

#### 2. backend/.env ignore kontrolü

Sonuç:
- Geçti

Not:
- `backend/.env`, `backend/.gitignore` tarafından ignore ediliyor.

#### 3. Password hash kontrolü

Sonuç:
- Geçti

Not:
- Kullanıcı şifresi `bcrypt.hash(password, 8)` ile hashleniyor.
- Login sırasında `bcrypt.compare(password, user.password)` kullanılıyor.
- Şifre düz metin olarak saklanmıyor.

#### 4. JWT secret kontrolü

Sonuç:
- Geçti

Not:
- JWT secret `process.env.JWT_SECRET` üzerinden okunuyor.
- JWT secret koda gömülü değil.

#### 5. Token olmadan protected endpoint testi

Endpoint:
- `GET /api/me/qr`

Beklenen:
- 401 Unauthorized

Sonuç:
- Geçti
- Response: `{"error":"Lütfen giriş yapın"}`

#### 6. Geçersiz token ile protected endpoint testi

Endpoint:
- `GET /api/me/qr`

Beklenen:
- 401 Unauthorized

Sonuç:
- Geçti
- Response: `{"error":"Lütfen giriş yapın"}`

#### 7. Public profile secret/password kontrolü

Endpoint:
- `GET /api/public/profile/test-example-com-3edhzj`

Sonuç:
- Geçti

Public response içinde aşağıdaki bilgiler dönmedi:
- password
- secret
- token
- jwt
- key
- credential

#### 8. Build testi

Komut:
- `npm run build`

Sonuç:
- Geçti

Not:
- Browserslist uyarısı var.
- CRA uyarısı var.
- Bunlar build hatası değildir.

---

## Açık Güvenlik Riskleri

Aşağıdaki maddeler henüz production öncesi çözülmelidir:

1. CORS şu an `*` durumunda.
2. Rate limit yok.
3. Helmet/security headers yok.
4. Backend nohup ile çalışıyor.
5. Frontend development server ile çalışıyor.
6. Cloudflare tunnel geçici.
7. Production domain yok.
8. Otomatik backup yok.
9. Monitoring yok.
10. Log rotation yok.

---

## Karar

SEC-CHECK-001 demo/test ortamı için temel güvenlikten geçti.

Bu sonuç production onayı değildir.

Production için ayrıca:
- Security checklist
- QA checklist
- Deploy checklist
- Backup
- Rollback
- Bülent final onayı

gereklidir.
