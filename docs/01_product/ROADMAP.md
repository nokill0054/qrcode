# B54 QR Code SaaS — Product Roadmap

Bu dosya B54 QR Code SaaS ürününün geliştirme sırasını ve MVP yol haritasını belirler.

Ana ilke:
Çalışan ürün çekirdeği bozulmadan, sırayla ürünleştirme yapılır.

---

## 1. Ürün Vizyonu

B54 QR Code SaaS; kullanıcıların tek ve kalıcı bir QR kod ile profil, link, sosyal medya, dijital kartvizit, ürün sayfası veya kampanya sayfası yönetmesini sağlayan bir SaaS ürünüdür.

Kullanıcı QR kodunu bir kez alır. QR kod değişmez. Kullanıcı panelden arkasındaki hedefi değiştirir.

---

## 2. Ana Kullanıcı Akışı

1. Kullanıcı kayıt olur.
2. Giriş yapar.
3. Dashboard’a girer.
4. Sabit QR kodunu görür.
5. QR kodun şu an hangi linke gittiğini görür.
6. Yeni hedef link yazar.
7. Linki yayınlar.
8. QR kodu okutan kişi en son yayınlanan linke gider.

Bu akış ürünün çekirdeğidir. Bu akış bozulmadan geliştirme yapılır.

---

## 3. Mevcut Durum

### Tamamlandı

- Kullanıcı kayıt/giriş sistemi
- Kullanıcıya özel QR slug
- Sabit QR kod
- Link değiştirme
- Son linke yönlendirme
- Dashboard temel ekranı
- Public profil endpointi
- Public profil sayfası
- Temel güvenlik .env düzeni
- GitHub commit disiplini
- Proje durum ve karar dosyaları

### Eksik

- QR indirme
- QR kopyalama butonu
- Dashboard UX iyileştirme
- Profil düzenleme ekranı
- Kalıcı deploy
- Admin panel
- Analytics
- Ödeme sistemi
- Mobil uygulama

---

## 4. Öncelik Sırası

### P0 — Çekirdek Ürün Koruma

Amaç:
Mevcut çalışan QR link değiştirme sistemini korumak.

İşler:
- Login çalışıyor mu?
- Dashboard açılıyor mu?
- QR gösteriliyor mu?
- Link değiştiriliyor mu?
- QR son linke gidiyor mu?

Durum:
- Çalışıyor.

---

### P1 — Dashboard Ürünleştirme

Amaç:
Kullanıcının QR kodunu kolayca yönetmesini sağlamak.

İşler:
- QR kod ekranını sadeleştir
- Aktif link alanını netleştir
- QR linki kopyalama butonu ekle
- Başarı/hata mesajlarını iyileştir
- Eski `/generate` akışını değerlendirme altına al
- Mobil ekranda düzgün görünümü kontrol et

Başarı kriteri:
Kullanıcı yardım almadan link değiştirebilmeli.

---

### P2 — QR Export

Amaç:
Kullanıcı QR kodunu indirip basılı materyalde kullanabilsin.

İşler:
- PNG indirme butonu
- SVG export değerlendirmesi
- Basılı kullanım için yüksek kalite QR
- QR altına kısa yönlendirme linki opsiyonu
- QR test senaryosu

Başarı kriteri:
Kullanıcı QR kodunu indirip telefondan okutunca doğru son linke gitmeli.

---

### P3 — Kalıcı Deploy

Amaç:
Demo ortamından daha stabil çalışan test/beta ortamına geçmek.

İşler:
- Backend kalıcı servis
- Frontend production build
- Reverse proxy planı
- Gerçek domain planı
- Restart sonrası otomatik açılma
- Deploy rollback planı

Başarı kriteri:
Server restart sonrası sistem otomatik ayağa kalkmalı.

---

### P4 — Profil Yönetimi

Amaç:
Kullanıcı isterse QR kodunu direkt link yerine profil/dijital kartvizit olarak kullanabilsin.

İşler:
- Profil düzenleme ekranı
- İsim, bio, website
- Sosyal medya linkleri
- Profil / direkt yönlendirme modu seçimi
- Public profil tasarımı

Başarı kriteri:
Kullanıcı dashboard’dan profilini güncelleyebilmeli.

---

### P5 — Admin Panel

Amaç:
Founder/admin kullanıcıları ve QR kayıtlarını görebilsin.

İşler:
- Kullanıcı listesi
- QR listesi
- Son aktif link
- Basit kullanıcı durumu
- Manuel inceleme

Başarı kriteri:
Admin sistemde kaç kullanıcı ve kaç QR olduğunu görebilmeli.

---

### P6 — Analytics

Amaç:
Kullanıcı QR kodunun kaç kez okutulduğunu görebilsin.

İşler:
- Scan count
- Son tarama zamanı
- Basit günlük/haftalık grafik
- Cihaz ve referrer bilgisi opsiyonel

Başarı kriteri:
Dashboard’da QR tarama sayısı görünebilmeli.

---

### P7 — Ödeme Sistemi

Amaç:
Ürünü SaaS olarak satılabilir hale getirmek.

İşler:
- Planlar
- Free / Pro ayrımı
- Lemon Squeezy veya Stripe değerlendirme
- Payment webhook
- Abonelik durumu

Başarı kriteri:
Kullanıcı ödeme yaptıktan sonra Pro özellik açılmalı.

---

### P8 — Mobil Uygulama

Amaç:
Web ürün oturduktan sonra Android/iOS uygulama değerlendirmek.

İşler:
- Flutter veya React Native kararı
- Login
- QR görüntüleme
- Link değiştirme
- Profil düzenleme

Başarı kriteri:
Mobil uygulama web dashboard’un temel işlerini yapabilmeli.

---

## 5. İlk 7 Günlük Uygulama Planı

### Gün 1

- QR_PROJECT_STATUS.md tamamlandı.
- DECISION_LOG.md tamamlandı.
- LESSONS_LEARNED.md tamamlandı.
- ROADMAP.md oluşturulacak.

### Gün 2

- TEST_PLAN.md oluşturulacak.
- Mevcut çalışan akış test edilecek.
- Dashboard UX iyileştirme planı çıkarılacak.

### Gün 3

- QR linki kopyalama butonu eklenecek.
- QR kod indirme teknik planı çıkarılacak.

### Gün 4

- QR PNG indirme eklenecek.
- Basılı QR testi yapılacak.

### Gün 5

- DEPLOY_PLAN.md oluşturulacak.
- Kalıcı servis planı hazırlanacak.

### Gün 6

- Güvenlik checklisti oluşturulacak.
- Yetkisiz erişim testleri yapılacak.

### Gün 7

- Demo senaryosu hazırlanacak.
- Bülent karar toplantısı yapılacak.
- Sonraki sprint kapsamı belirlenecek.

---

## 6. Şu Anki Net Öncelik

Bir sonraki ürün geliştirme işi:

1. TEST_PLAN.md
2. Dashboard UX iyileştirme
3. QR linki kopyalama butonu
4. QR PNG indirme
5. DEPLOY_PLAN.md

---

## 7. Yasaklı / Ertelenmiş İşler

Aşağıdaki işler şimdilik yapılmayacak:

- Ödeme sistemi
- Production deploy
- Büyük tasarım değişikliği
- Mobil uygulama
- Admin panel
- Analytics
- Müşteri verisi alma
- Pazarlama kampanyası başlatma

Bu işler ancak Bülent kararıyla açılır.

