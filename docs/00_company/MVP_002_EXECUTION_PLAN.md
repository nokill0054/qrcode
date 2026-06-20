# MVP-002 Execution Plan

## Faz

Faz 1 — MVP / Build

## Hedef

Mevcut çalışan QR demo sistemini gerçek kullanıcı hesabı, sabit QR slug ve profil/redirect modu olan daha düzgün bir MVP yapısına taşımak.

## Ana Ürün Kuralı

QR kod değişmez.
QR kodun arkasındaki hedef değişir.

## Kapsam

1. Kullanıcı kayıt/giriş sistemi
2. Kullanıcıya ait sabit QR slug
3. Redirect mode
4. Profile mode
5. Mode switch
6. Güvenli .env yapısı
7. Manuel test
8. Build test
9. Local commit
10. Bülent onayıyla GitHub push

## Kapsam Dışı

- Ödeme sistemi
- Gelişmiş analytics
- QR tasarım özelleştirme
- Full admin panel
- Marketing launch
- Production public release

## Bülent Onayı Gerektiren Noktalar

- Database schema değişikliği
- Production deploy
- Gerçek domain bağlama
- Token / credential değişikliği
- Public release
- Ödeme sistemi başlangıcı

## Beklenen Çıktı

Kullanıcı kendi hesabına girip kendi sabit QR slug’ını yönetebilmeli.
QR kod ya hedef URL’ye ya da profil sayfasına gidebilmelidir.
