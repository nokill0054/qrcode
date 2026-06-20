# B54 QR Code SaaS — Deploy Plan

Bu dosya B54 QR Code SaaS ürününün demo, beta ve production deploy planını tanımlar.

Ana ilke:
Production deploy; CTO + QA + Security + Bülent onayı olmadan yapılmaz.

---

## 1. Mevcut Çalışma Durumu

Şu an sistem demo/test ortamında çalışmaktadır.

### Backend

Backend Node.js / Express ile çalışır.

Mevcut çalışma şekli:

- Klasör: `/workspaces/qr-code/app/backend`
- Çalışma komutu: `node server.js`
- Bind: `127.0.0.1`
- Port: `5001`
- Config: `backend/.env`

Mevcut durum:
- Demo için çalışıyor.
- Production-ready değildir.
- Kalıcı servis değildir.
- Server restart olursa kapanabilir.

---

### Frontend

Frontend React uygulamasıdır.

Mevcut çalışma şekli:

- Klasör: `/workspaces/qr-code/app`
- Çalışma komutu: `npm start`
- Bind: `127.0.0.1`
- Port: `3000`

Mevcut durum:
- Demo için çalışıyor.
- Development server kullanıyor.
- Production build ile servis edilmiyor.
- Server restart olursa kapanabilir.

---

### Public Test URL

Şu an dış test için Cloudflare tunnel kullanılmaktadır.

Mevcut durum:
- Geçicidir.
- URL değişebilir.
- Production domain değildir.
- Müşteri kullanımına uygun değildir.

---

## 2. Mevcut Riskler

- Server restart olursa backend kapanabilir.
- Server restart olursa frontend kapanabilir.
- Cloudflare tunnel URL değişebilir.
- Production build kullanılmıyor.
- Reverse proxy yok.
- Kalıcı domain yok.
- SSL/domain yönetimi kalıcı değil.
- Otomatik backup sistemi yok.
- Monitoring yok.
- Log rotation yok.
- Rollback planı tam hazır değil.

---

## 3. Deploy Aşamaları

### Aşama 1 — Demo Ortamı

Amaç:
Çalışan ürünü Bülent’in test etmesi.

Durum:
- Tamamlandı.

Kapsam:
- Login
- Dashboard
- Sabit QR
- Link değiştirme
- QR redirect
- Public profil temel sayfası

Risk:
- Geçici ortamdır.

---

### Aşama 2 — Stabil Test Ortamı

Amaç:
Demo ortamını daha stabil hale getirmek.

İşler:
- Backend’i PM2 veya systemd ile kalıcı çalıştırmak
- Frontend’i production build almak
- Frontend’i statik olarak servis etmek
- Backend API’yi reverse proxy arkasına almak
- Restart sonrası otomatik açılma sağlamak
- Temel log kontrolü eklemek

Başarı kriteri:
Server restart sonrası sistem otomatik ayağa kalkmalıdır.

---

### Aşama 3 — Beta Ortamı

Amaç:
Gerçek domain ile sınırlı kullanıcı testi yapmak.

İşler:
- Domain bağlamak
- SSL aktif etmek
- Production build kullanmak
- MongoDB backup planı oluşturmak
- Security checklist tamamlamak
- QA checklist tamamlamak
- Demo kullanıcı senaryosu hazırlamak

Başarı kriteri:
Bülent ve sınırlı test kullanıcıları sistemi gerçek domain üzerinden kullanabilmelidir.

---

### Aşama 4 — Production

Amaç:
Ürünü gerçek müşterilere açmak.

Production için gerekli onaylar:
- CTO onayı
- QA onayı
- Security onayı
- Bülent onayı

Production öncesi zorunlu şartlar:
- Backup alınmış olmalı
- Rollback planı yazılmış olmalı
- Secret kontrolü yapılmış olmalı
- `.env` public repo’da olmamalı
- Test planı geçilmiş olmalı
- Domain ve SSL stabil olmalı
- Monitoring/log kontrolü yapılmış olmalı

---

## 4. PM2 ve systemd Değerlendirmesi

### PM2

Artıları:
- Node.js uygulamaları için kolaydır.
- Restart sonrası otomatik başlatma destekler.
- Logları kolay takip edilir.
- Process listesi basittir.

Eksileri:
- Ek araçtır.
- Doğru startup ayarı yapılmazsa restart sonrası çalışmayabilir.

Uygunluk:
- Backend için uygundur.
- Frontend production build servisinde doğrudan şart değildir.

---

### systemd

Artıları:
- Linux native servis sistemidir.
- Production için daha standarttır.
- Restart politikası güçlüdür.

Eksileri:
- Başlangıçta biraz daha dikkat ister.
- Yeni başlayan için yapılandırması PM2’ye göre daha karmaşıktır.

Uygunluk:
- Backend için uygundur.
- Reverse proxy ve statik frontend ile birlikte iyi çalışır.

---

## 5. Önerilen İlk Deploy Stratejisi

İlk stabil test ortamı için öneri:

1. Backend PM2 ile çalıştırılır.
2. Frontend production build alınır.
3. Frontend statik dosya olarak servis edilir.
4. Cloudflare tunnel yerine gerçek domain planlanır.
5. Reverse proxy planı hazırlanır.
6. Backup ve rollback dokümanı tamamlanır.

Not:
Bu adımlar Bülent onayı olmadan uygulanmaz.

---

## 6. Production Öncesi Checklist

### Teknik

- [ ] Backend kalıcı servis oldu
- [ ] Frontend production build ile servis ediliyor
- [ ] Reverse proxy hazır
- [ ] Domain bağlı
- [ ] SSL aktif
- [ ] MongoDB erişimi güvenli
- [ ] Backup planı var
- [ ] Rollback planı var
- [ ] Log takibi var

### Güvenlik

- [ ] `.env` public repo’da yok
- [ ] Tokenlar mesajlarda görünmedi
- [ ] JWT secret güçlü
- [ ] CORS production için sınırlandı
- [ ] Rate limit değerlendirildi
- [ ] Public endpoint secret döndürmüyor
- [ ] Destructive komut çalıştırılmadı

### QA

- [ ] Login testi geçti
- [ ] Register testi geçti
- [ ] Dashboard testi geçti
- [ ] Link değiştirme testi geçti
- [ ] QR redirect testi geçti
- [ ] Public profil testi geçti
- [ ] Yetkisiz erişim testi geçti
- [ ] Build testi geçti

### Onay

- [ ] CTO rolü onayı
- [ ] QA rolü onayı
- [ ] Security rolü onayı
- [ ] Bülent final onayı

---

## 7. Şu An Yasak Olan İşler

Bülent onayı olmadan yapılmayacak işler:

- Production deploy
- Domain DNS değişikliği
- Server firewall değişikliği
- MongoDB volume silme
- Docker prune
- rm -rf
- Database migration
- Token rotate
- Payment sistemi açma
- Gerçek müşteri verisi alma

---

## 8. Bir Sonraki DevOps İşi

Kod veya production deploy yapmadan önce:

1. Mevcut çalışan process listesi kayıt altına alınacak.
2. Backend restart komutu dokümante edilecek.
3. Frontend restart komutu dokümante edilecek.
4. Cloudflare tunnel geçici olduğu açıkça yazılacak.
5. Kalıcı servis için PM2 veya systemd kararı Bülent’e sunulacak.

---

## 9. Mevcut Karar

Şu an production deploy yapılmayacak.

Sistem demo/test ortamında kalacak.

Bir sonraki DevOps kararı:
PM2 mi systemd mi kullanılacak?

Bu karar Bülent onayıyla alınacaktır.
