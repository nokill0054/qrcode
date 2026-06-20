# B54 QR Code SaaS — Security Checklist

Bu dosya B54 QR Code SaaS ürününde uygulanacak güvenlik kontrollerini tanımlar.

Ana ilke:
Token, API key, private key, credential, secret ve .env içeriği hiçbir zaman mesajlarda veya public repo’da gösterilmez.

---

## 1. Nihai Güvenlik Yetkisi

Founder / CEO:
- Bülent

Bülent onayı olmadan yapılmayacak işlemler:
- Production deploy
- Database migration
- Docker volume silme
- rm -rf
- docker prune
- Token rotate
- Firewall değişikliği
- DNS/domain değişikliği
- Payment sistemi açma
- Gerçek müşteri verisi işleme

---

## 2. Secret ve Credential Kuralları

### Zorunlu Kurallar

- [x] `.env` dosyası public repo’ya eklenmeyecek.
- [x] `.env.example` kullanılabilir.
- [x] JWT secret koda gömülü olmayacak.
- [x] Tokenlar mesajlarda gösterilmeyecek.
- [x] API key mesajlarda gösterilmeyecek.
- [x] Private key mesajlarda gösterilmeyecek.
- [x] GitHub token sohbet içine yazılmayacak.
- [x] Server komutlarında secret ekrana basılmayacak.

### Kontrol Edilecekler

- [ ] Repo içinde yanlışlıkla `.env` var mı?
- [ ] Git geçmişinde secret var mı?
- [ ] Backend loglarında secret var mı?
- [ ] Frontend build çıktısında secret var mı?
- [ ] Telegram mesajlarında secret paylaşılmadı mı?

---

## 3. Backend Güvenliği

Mevcut durum:
- Backend Express.js kullanıyor.
- Config `.env` üzerinden alınıyor.
- Backend localhost bind ile çalışıyor.
- JWT auth var.

Kontroller:

- [x] JWT secret env üzerinden okunuyor.
- [x] Auth middleware user doğrulaması yapıyor.
- [x] `/api/me/qr` token gerektiriyor.
- [x] `/api/me/qr/urls` token gerektiriyor.
- [x] `/api/me/qr/profile` token gerektiriyor.
- [x] Public profile endpoint password döndürmüyor.
- [ ] Rate limit eklendi mi?
- [ ] Production CORS sınırlandı mı?
- [ ] Input validation yeterli mi?
- [ ] URL validation yeterli mi?
- [ ] Error mesajları secret sızdırıyor mu?
- [ ] Helmet veya benzeri security headers değerlendirildi mi?

---

## 4. Frontend Güvenliği

Mevcut durum:
- React frontend kullanılıyor.
- Token localStorage içinde tutuluyor.
- Dashboard token yoksa login sayfasına yönlendiriyor.

Kontroller:

- [x] Token olmadan dashboard API çalışmıyor.
- [x] Login sonrası token kaydediliyor.
- [x] Logout token siliyor.
- [ ] XSS riski değerlendirildi mi?
- [ ] Kullanıcı inputları güvenli gösteriliyor mu?
- [ ] Public profil alanlarında HTML injection engelleniyor mu?
- [ ] Production build içinde debug bilgi var mı?
- [ ] Hata mesajları sade mi?

---

## 5. Database Güvenliği

Mevcut durum:
- MongoDB Docker container içinde çalışıyor.
- Demo/test verisi kullanılıyor.
- MongoDB backup alındı.

Kontroller:

- [x] Backup alındı.
- [ ] Otomatik backup planlandı mı?
- [ ] Production database erişimi sınırlandı mı?
- [ ] Database dış dünyaya açık mı?
- [ ] Kullanıcı password hashleniyor mu?
- [ ] Eski test verileri temizlenecek mi?
- [ ] Migration planı var mı?

Not:
Password hash konusu ayrıca kontrol edilecek kritik alandır.

---

## 6. Deploy Güvenliği

Mevcut durum:
- Sistem demo/test ortamında çalışıyor.
- Backend nohup ile çalışıyor.
- Frontend development server ile çalışıyor.
- Cloudflare tunnel geçici public URL sağlıyor.

Kontroller:

- [x] Production deploy yapılmadı.
- [x] Deploy planı oluşturuldu.
- [ ] Kalıcı servis planı onaylandı mı?
- [ ] Domain/SSL planı onaylandı mı?
- [ ] Reverse proxy planı yazıldı mı?
- [ ] Rollback planı yazıldı mı?
- [ ] Monitoring/log planı var mı?
- [ ] Server restart testi yapılacak mı?

---

## 7. Public Endpoint Kontrolleri

Public endpointler:

- `/api/redirect/:slug`
- `/api/public/profile/:slug`
- `/q/:slug`

Kontroller:

- [x] Public profile endpoint password döndürmüyor.
- [x] Redirect endpoint son linke yönlendiriyor.
- [x] Redirect cache problemi 302 + no-cache ile azaltıldı.
- [ ] Slug enumeration riski değerlendirilecek.
- [ ] Public profil spam/abuse riski değerlendirilecek.
- [ ] Public endpoint rate limit değerlendirilecek.

---

## 8. Kill Switch Durumları

Aşağıdaki durumda iş durdurulur ve Bülent onayı istenir:

- [ ] Token sızıntısı şüphesi
- [ ] API key ekrana basılması
- [ ] Private key paylaşılması
- [ ] Production database değişikliği
- [ ] Docker volume silme riski
- [ ] rm -rf komutu
- [ ] docker prune komutu
- [ ] Yetkisiz deploy
- [ ] Büyük maliyet/token sıçraması
- [ ] Güvenlik agentının kritik uyarısı

---

## 9. Production Öncesi Security Gate

Production açılmadan önce zorunlu maddeler:

- [ ] `.env` repo’da yok
- [ ] Git secret scan yapılacak
- [ ] Password hashing doğrulanacak
- [ ] Auth endpointleri test edilecek
- [ ] Yetkisiz erişim testleri geçecek
- [ ] Public endpointler secret döndürmeyecek
- [ ] CORS production domain ile sınırlanacak
- [ ] Rate limit değerlendirilecek
- [ ] Backup alınacak
- [ ] Rollback planı hazır olacak
- [ ] Bülent final onayı alınacak

---

## 10. Mevcut Güvenlik Kararı

Şu an sistem production-ready değildir.

Sistem demo/test ortamında güvenli geliştirme prensipleriyle devam edecektir.

Bir sonraki güvenlik işi:
- Password hash kontrolü
- Yetkisiz erişim testi
- Git secret scan
- Public endpoint response kontrolü
