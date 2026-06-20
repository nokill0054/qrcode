# B54 QR Code SaaS — Lessons Learned

Bu dosya B54 QR Code SaaS projesinde yapılan hataları, doğru kararları, tekrar edilmemesi gereken problemleri ve gelecekte uygulanacak çalışma kurallarını kayıt altına alır.

Amaç:
- Aynı hatayı tekrar yapmamak
- Başarılı süreçleri korumak
- Anayasa dışına çıkmayı önlemek
- Hermes öğrenme hafızası için temel oluşturmak

---

## LESSON-001 — Ürün çekirdeği ile şirket sistemi birbirinden ayrılmamalı

- Tarih: 2026-06-20
- Konu: Proje başlangıç sırası
- Ne oldu: QR ürününün çalışan teknik MVP'sine hızlı geçildi. Fakat anayasanın istediği şirket/workflow/agent dosyaları aynı disiplinle başta kurulmadı.
- Etki: Ürün çalıştı ama proje yönetim sistemi eksik kaldı.
- Öğrenilen ders: Bundan sonra yeni teknik işlere başlamadan önce ilgili durum, karar, test ve roadmap dosyaları güncellenmeli.
- Yeni kural: Kod yazmadan önce ilgili doküman kontrol edilecek.

---

## LESSON-002 — Kullanıcının ana ihtiyacı önce görünür olmalı

- Tarih: 2026-06-20
- Konu: Dashboard önceliği
- Ne oldu: Public profil altyapısı, dashboard tam oturmadan önce eklendi.
- Etki: Kullanıcı açısından “QR nerede, linki nereden değiştireceğim?” sorusu oluştu.
- Öğrenilen ders: Ana kullanıcı akışı görünür ve çalışır olmadan yan özelliklere geçilmemeli.
- Yeni kural: Her sprintte önce ana kullanıcı akışı test edilecek.

---

## LESSON-003 — Çalışan ürün bozulmadan ilerlemek gerekiyor

- Tarih: 2026-06-20
- Konu: MVP koruma
- Ne oldu: Sabit QR ve link değiştirme sistemi çalışır hale geldi. Daha sonra auth, dashboard ve profil katmanları eklendi.
- Etki: Çekirdek ürün korunarak geliştirildi.
- Öğrenilen ders: Her yeni özellikten sonra build, route, API ve gerçek tarayıcı testi yapılmalı.
- Yeni kural: Her commit öncesi en az build testi ve temel route testi yapılacak.

---

## LESSON-004 — Secret ve token güvenliği doğru yönetildi

- Tarih: 2026-06-20
- Konu: Güvenlik
- Ne oldu: JWT secret koda gömülü olmaktan çıkarıldı. .env dosyası public repo dışında tutuldu. Tokenlar mesajlarda gösterilmedi.
- Etki: Temel secret güvenliği sağlandı.
- Öğrenilen ders: Güvenlik kuralları baştan uygulanırsa sonradan kriz çıkmaz.
- Yeni kural: .env, token, private key, API key ve credential hiçbir zaman mesajlarda veya public repo’da gösterilmeyecek.

---

## LESSON-005 — Geçici deploy ile production karıştırılmamalı

- Tarih: 2026-06-20
- Konu: Deploy
- Ne oldu: Sistem nohup ve Cloudflare tunnel ile test ortamında çalıştırıldı.
- Etki: Demo yapılabildi ama sistem production-ready olmadı.
- Öğrenilen ders: Demo çalışması production anlamına gelmez.
- Yeni kural: Production deploy için önce QA, security checklist, kalıcı servis ve Bülent onayı gerekir.

---

## LESSON-006 — Markdown dosyaları source of truth olmalı

- Tarih: 2026-06-20
- Konu: Dokümantasyon
- Ne oldu: QR_PROJECT_STATUS.md ve DECISION_LOG.md dosyaları geç de olsa oluşturuldu.
- Etki: Proje tekrar anayasa merkezli hale getirildi.
- Öğrenilen ders: Sadece sohbet hafızasına güvenilmemeli. Kararlar dosyalara yazılmalı.
- Yeni kural: Büyük kararlar DECISION_LOG.md dosyasına, hatalar LESSONS_LEARNED.md dosyasına yazılacak.

---

## LESSON-007 — Her yeni iş küçük commitlere bölünmeli

- Tarih: 2026-06-20
- Konu: Git disiplini
- Ne oldu: MVP-001, SEC-001, MODEL-001, AUTH-001, QR-API-001, PUBLIC-001, FRONT-001, FRONT-002 gibi küçük commitlerle ilerleme sağlandı.
- Etki: Geri alma ve takip kolaylaştı.
- Öğrenilen ders: Büyük tek commit yerine küçük kontrollü commitler daha güvenlidir.
- Yeni kural: Her mantıksal iş ayrı commit olacak.

---

## Aktif Çalışma Kuralları

1. Koddan önce ilgili doküman kontrol edilir.
2. Destructive komutlar Bülent onayı olmadan çalıştırılmaz.
3. Secret bilgiler gösterilmez.
4. Backup gereken işlemde önce backup alınır.
5. Her teknik işten sonra test yapılır.
6. Her önemli karar DECISION_LOG.md dosyasına yazılır.
7. Her tekrar eden hata LESSONS_LEARNED.md dosyasına yazılır.
8. Ana kullanıcı akışı bozulmadan ilerlenir.
9. Production deploy ayrı bir karar olarak ele alınır.
10. Bülent nihai karar makamıdır.

