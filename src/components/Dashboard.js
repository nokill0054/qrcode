import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Grid,
  CircularProgress
} from '@material-ui/core';
import QRCode from 'qrcode.react';
import MuiAlert from '@material-ui/lab/Alert';

const Dashboard = () => {
  const [qr, setQr] = useState(null);
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const token = localStorage.getItem('token');

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  });

  useEffect(() => {
    if (!token) {
      history.push('/login');
      return;
    }

    fetchQr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQr = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/me/qr', {
        headers: getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'QR bilgisi alınamadı');
      }

      setQr(data);
    } catch (err) {
      setError(err.message || 'QR bilgisi alınırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addUrl = async () => {
    if (!newUrl) {
      setError('Lütfen yönlendirme linki yaz');
      return;
    }

    try {
      const response = await fetch('/api/me/qr/urls', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ url: newUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'URL eklenirken hata oluştu');
      }

      setQr(data);
      setNewUrl('');
      setSuccess('Yeni yönlendirme linki yayınlandı');
    } catch (err) {
      setError(err.message || 'URL eklenirken hata oluştu');
    }
  };

  const setRedirectMode = async () => {
    try {
      const response = await fetch('/api/me/qr/mode', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ mode: 'redirect' })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Mod değiştirilirken hata oluştu');
      }

      setQr(data);
      setSuccess('QR artık son linke yönlendirme modunda');
    } catch (err) {
      setError(err.message || 'Mod değiştirilirken hata oluştu');
    }
  };

  const downloadQrPng = () => {
    try {
      const qrElement = document.getElementById('user-qr-code');

      if (!qrElement) {
        setError('QR kod alanı bulunamadı.');
        return;
      }

      const canvas = qrElement.querySelector('canvas');

      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `b54-qr-${qr?.slug || 'code'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSuccess('QR PNG indirildi');
        return;
      }

      const svg = qrElement.querySelector('svg');

      if (svg) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const image = new Image();

        image.onload = () => {
          const exportCanvas = document.createElement('canvas');
          exportCanvas.width = image.width || 512;
          exportCanvas.height = image.height || 512;

          const context = exportCanvas.getContext('2d');
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
          context.drawImage(image, 0, 0);

          const link = document.createElement('a');
          link.href = exportCanvas.toDataURL('image/png');
          link.download = `b54-qr-${qr?.slug || 'code'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(url);
          setSuccess('QR PNG indirildi');
        };

        image.onerror = () => {
          URL.revokeObjectURL(url);
          setError('QR PNG oluşturulamadı.');
        };

        image.src = url;
        return;
      }

      setError('İndirilecek QR kod bulunamadı.');
    } catch (err) {
      setError('QR PNG indirme başarısız oldu.');
    }
  };

  const copyText = async (textToCopy, successMessage) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setSuccess(successMessage);
    } catch (err) {
      setError('Kopyalama başarısız oldu. Linki elle seçip kopyalayabilirsin.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Paper style={{ padding: 30, marginTop: 30, textAlign: 'center' }}>
          <CircularProgress />
          <Typography style={{ marginTop: 15 }}>
            Dashboard yükleniyor...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (!qr) {
    return (
      <Container maxWidth="md">
        <Paper style={{ padding: 30, marginTop: 30, textAlign: 'center' }}>
          <Typography color="error">
            QR bilgisi yüklenemedi.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchQr}
            style={{ marginTop: 15 }}
          >
            Tekrar Dene
          </Button>
        </Paper>
      </Container>
    );
  }

  const qrRedirectUrl = `${window.location.origin}/api/redirect/${qr.slug}`;
  const profileUrl = `${window.location.origin}/q/${qr.slug}`;
  const latestUrl = qr.urls && qr.urls.length > 0 ? qr.urls[qr.urls.length - 1] : '';

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: 24, marginTop: 24 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              QR Kod Yönetim Paneli
            </Typography>

            <Typography variant="body2" style={{ marginBottom: 20 }}>
              Bu QR kod sabit kalır. Sen sadece arkasındaki hedef linki değiştirirsin.
            </Typography>

            <Box mb={3}>
              <Box id="user-qr-code">
                <QRCode
                value={qrRedirectUrl}
                size={220}
                level="H"
              />
              </Box>

              <Typography variant="body2" style={{ marginTop: 12, wordBreak: 'break-all' }}>
                QR Linki: {qrRedirectUrl}
              </Typography>

              <Button
                variant="outlined"
                color="primary"
                onClick={() => copyText(qrRedirectUrl, 'QR linki kopyalandı')}
                style={{ marginTop: 10, marginRight: 10 }}
              >
                QR Linkini Kopyala
              </Button>

              <Button
                variant="outlined"
                onClick={downloadQrPng}
                style={{ marginTop: 10 }}
              >
                QR PNG İndir
              </Button>

              <Typography variant="body2" style={{ marginTop: 14, wordBreak: 'break-all' }}>
                Profil Sayfası: {profileUrl}
              </Typography>

              <Button
                variant="outlined"
                onClick={() => copyText(profileUrl, 'Profil linki kopyalandı')}
                style={{ marginTop: 10 }}
              >
                Profil Linkini Kopyala
              </Button>
            </Box>

            <Box mb={3}>
              <Typography variant="h6">
                Şu Anki Mod: {qr.mode === 'profile' ? 'Profil Sayfası' : 'Direkt Link Yönlendirme'}
              </Typography>

              {qr.mode !== 'redirect' && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={setRedirectMode}
                  style={{ marginTop: 10 }}
                >
                  Direkt Link Yönlendirme Moduna Al
                </Button>
              )}
            </Box>

            <Box mb={3}>
              <Typography variant="h6">
                Şu An QR Kodun Gideceği Link
              </Typography>
              <Typography style={{ wordBreak: 'break-all' }}>
                {latestUrl || 'Henüz link eklenmemiş'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Yeni Yönlendirme Linki Yayınla
            </Typography>

            <TextField
              fullWidth
              label="Örn: https://www.example.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              margin="normal"
              variant="outlined"
            />

            <Button
              variant="contained"
              color="primary"
              onClick={addUrl}
              style={{ marginTop: 10 }}
            >
              Linki Yayınla
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Önceki Yönlendirme Linkleri
            </Typography>

            <List>
              {(qr.urls || []).map((url, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={url}
                    secondary={index === qr.urls.length - 1 ? 'Aktif son link' : ''}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} style={{ textAlign: 'right' }}>
            <Button variant="outlined" onClick={logout}>
              Çıkış Yap
            </Button>
          </Grid>
        </Grid>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <MuiAlert elevation={6} variant="filled" severity="error">
            {error}
          </MuiAlert>
        </Snackbar>

        <Snackbar open={!!success} autoHideDuration={5000} onClose={() => setSuccess('')}>
          <MuiAlert elevation={6} variant="filled" severity="success">
            {success}
          </MuiAlert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Dashboard;
