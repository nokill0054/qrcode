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
              <QRCode
                value={qrRedirectUrl}
                size={220}
                level="H"
              />

              <Typography variant="body2" style={{ marginTop: 12, wordBreak: 'break-all' }}>
                QR Linki: {qrRedirectUrl}
              </Typography>

              <Typography variant="body2" style={{ marginTop: 8, wordBreak: 'break-all' }}>
                Profil Sayfası: {profileUrl}
              </Typography>
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
