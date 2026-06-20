require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5001;
const BIND_HOST = process.env.BIND_HOST || '127.0.0.1';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/qr-manager';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET eksik. backend/.env dosyasını kontrol edin.');
  process.exit(1);
}
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB bağlantısı başarılı');
  app.listen(PORT, BIND_HOST, () => console.log(`Server running on ${BIND_HOST}:${PORT}`));
})
.catch((err) => {
  console.error('MongoDB bağlantı hatası:', err);
  process.exit(1);
});

mongoose.connection.on('error', err => {
  console.error('MongoDB bağlantı hatası:', err);
});

const QRSchema = new mongoose.Schema({
  userId: String,
  urls: [String],
  createdAt: { type: Date, default: Date.now },
});

const QR = mongoose.model('QR', QRSchema);

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);


const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Lütfen giriş yapın' });
  }
};

app.post('/api/qr', async (req, res) => {
  try {
    console.log('Gelen istek:', req.body);
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId gerekli' });
    }

    const qr = new QR({ userId, urls: [] });
    await qr.save();
    console.log('QR kod oluşturuldu:', qr);
    res.json(qr);
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/qr/:userId/urls', async (req, res) => {
  try {
    const { userId } = req.params;
    const { url } = req.body;
    const qr = await QR.findOne({ userId });
    qr.urls.push(url);
    await qr.save();
    res.json(qr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/qr/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const qr = await QR.findOne({ userId });
    res.json(qr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/redirect/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Redirect isteği alındı:', userId);
    
    // Kullanıcının QR koduna ait URL'i veritabanından al
    const qr = await QR.findOne({ userId });
    
    if (!qr || !qr.urls.length) {
      console.log('URL bulunamadı');
      return res.status(404).send('URL bulunamadı');
    }
    
    // En son eklenen URL'e yönlendir
    let redirectUrl = qr.urls[qr.urls.length - 1];
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
      redirectUrl = 'https://' + redirectUrl;
    }
    
    console.log('Yönlendiriliyor:', redirectUrl);
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
    return res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('Yönlendirme hatası:', error);
    return res.status(500).send('Bir hata oluştu');
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register isteği alındı:', req.body);
    const { email, password } = req.body;

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email zaten kayıtlı:', email);
      return res.status(400).json({ error: 'Bu email zaten kayıtlı' });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 8);

    // Yeni kullanıcı oluştur
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log('Yeni kullanıcı oluşturuldu:', user);

    // Token oluştur
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    console.error('Register hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email veya şifre hatalı' });
    }

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email veya şifre hatalı' });
    }

    // Token oluştur
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Hata yakalama middleware'i
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Sunucu hatası',
    details: err.message
  });
});