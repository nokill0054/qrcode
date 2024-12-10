# QR Kod Yönetim Sistemi

## Özellikler
- Benzersiz QR kod oluşturma
- QR kodları yönetme
- URL yönlendirme yönetimi
- Anlık URL güncelleme
- Mobil uyumlu tasarım

## Teknolojiler
- Frontend: React.js, Material-UI
- Backend: Node.js, Express.js
- Veritabanı: MongoDB
- QR Kod: qrcode.react

## Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- MongoDB
- npm veya yarn

### Backend Kurulumu
```bash
cd backend
npm install
node server.js
```

### Frontend Kurulumu
```bash
cd qr-manager-web
npm install
npm start
```

## Kullanım
1. Ana sayfa: http://localhost:3000
2. QR Kod Oluşturma:
   - 'Bana Özel QR Kod Oluştur' butonuna tıklayın
   - Dashboard'da URL'inizi girin
   - QR kodu telefonunuzla tarayın

## Deployment
1. Backend:
   - MongoDB Atlas hesabı oluşturun
   - .env dosyasını düzenleyin
   - Heroku/DigitalOcean'a deploy edin

2. Frontend:
   - `npm run build` ile build alın
   - Netlify/Vercel'e deploy edin

## Lisans
MIT License - Detaylar için LICENSE dosyasına bakın.
