# B54 QR Code SaaS — Decision Log

Bu dosya B54 QR Code SaaS projesinde alınan ürün, teknik, güvenlik, deploy ve iş kararlarını kayıt altına almak için kullanılır.

Her karar aşağıdaki formatla yazılır:

- Tarih:
- Karar ID:
- Karar:
- Gerekçe:
- Etkilenen alan:
- Risk:
- Onaylayan:
- Sonuç:

---

## DEC-001 — QR SaaS projesi devam edecek

- Tarih: 2026-06-20
- Karar ID: DEC-001
- Karar: QR Code SaaS projesine devam edilecek.
- Gerekçe: Çalışan teknik MVP çekirdeği oluşturuldu. Kullanıcı kayıt olabilir, giriş yapabilir, dashboard üzerinden sabit QR kodun hedef linkini değiştirebilir.
- Etkilenen alan: Ürün, backend, frontend, roadmap
- Risk: Ürün henüz production-ready değildir. Kalıcı deploy, QA, güvenlik ve ürünleştirme eksikleri vardır.
- Onaylayan: Bülent
- Sonuç: Proje anayasa merkezli devam edecek.

---

## DEC-002 — Öncelik QR yönetim paneli olacak

- Tarih: 2026-06-20
- Karar ID: DEC-002
- Karar: Bir sonraki ürün önceliği QR yönetim panelinin sadeleştirilmesi ve ürünleştirilmesi olacak.
- Gerekçe: Kullanıcının asıl ihtiyacı sabit QR kodunu görmek ve arkasındaki linki kolayca değiştirmektir.
- Etkilenen alan: Frontend, UX, product roadmap
- Risk: Public profil, ödeme, admin panel gibi işler erken eklenirse ana ürün akışı dağılabilir.
- Onaylayan: Bülent
- Sonuç: Dashboard, QR export ve kalıcı deploy önceliklendirilecek.

---

## DEC-003 — Koddan önce proje durum dosyası oluşturuldu

- Tarih: 2026-06-20
- Karar ID: DEC-003
- Karar: Yeni kod yazmadan önce QR_PROJECT_STATUS.md dosyası oluşturuldu ve GitHub’a eklendi.
- Gerekçe: Blueprint/anayasa ilk görev olarak mevcut durum analizi ve 7 günlük MVP planı istiyordu.
- Etkilenen alan: Governance, documentation, roadmap
- Risk: Dokümantasyon güncel tutulmazsa proje tekrar dağılabilir.
- Onaylayan: Bülent
- Sonuç: DOCS-004 commit'i ile kayıt altına alındı.

---

## DEC-004 — Production deploy henüz yapılmayacak

- Tarih: 2026-06-20
- Karar ID: DEC-004
- Karar: Sistem şu an demo/test ortamında tutulacak; production deploy yapılmayacak.
- Gerekçe: QA, security checklist, kalıcı servis, domain ve backup otomasyonu henüz tamamlanmadı.
- Etkilenen alan: DevOps, Security, QA
- Risk: Geçici Cloudflare tunnel URL değişebilir; server restart olursa servisler durabilir.
- Onaylayan: Bülent
- Sonuç: Önce deploy planı hazırlanacak, sonra Bülent onayıyla production adımı açılacak.

---

## DEC-005 — Secret ve token bilgileri mesajlarda gösterilmeyecek

- Tarih: 2026-06-20
- Karar ID: DEC-005
- Karar: .env, token, private key, credential ve secret bilgileri hiçbir mesajda açık gösterilmeyecek.
- Gerekçe: Proje anayasasının temel güvenlik kuralıdır.
- Etkilenen alan: Security, backend, deployment, GitHub
- Risk: Secret sızıntısı durumunda sistem durdurulmalı ve rotate süreci başlatılmalıdır.
- Onaylayan: Bülent
- Sonuç: Gizli bilgiler sadece server üzerinde tutulacak, public repo’ya konmayacak.

