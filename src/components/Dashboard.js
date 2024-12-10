import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  Grid
} from '@material-ui/core';
import QRCode from 'qrcode.react';
import MuiAlert from '@material-ui/lab/Alert';

// Ngrok'un verdiği yeni URL'i buraya yazın
const BACKEND_URL = 'https://1234-abc-xyz.ngrok.io';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    if (userId) {
      fetchUrls();
    }
  }, [userId]);

  const fetchUrls = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/qr/${userId}`);
      const data = await response.json();
      setUrls(data.urls || []);
    } catch (err) {
      console.error('Fetch hatası:', err);
      setError('URLler yüklenirken hata oluştu');
    }
  };

  const addUrl = async () => {
    if (newUrl) {
      try {
        const response = await fetch(`http://localhost:5001/api/qr/${userId}/urls`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: newUrl }),
        });

        if (!response.ok) throw new Error('URL eklenirken hata oluştu');

        const data = await response.json();
        setUrls(data.urls);
        setNewUrl('');
      } catch (err) {
        console.error('URL ekleme hatası:', err);
        setError(err.message);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              QR Kod Yönetimi
            </Typography>
            {userId && (
              <Box mb={4}>
                <QRCode 
                  value="https://www.akillimizan.com"  // Doğrudan akillimizan.com'a yönlendir
                  size={200}
                  level="H"
                />
                <Typography variant="body2" style={{ marginTop: 10 }}>
                  Yönlendirilecek URL: {urls[0] || 'Henüz URL eklenmemiş'}
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                Yönlendirme Adresi Ekle
              </Typography>
              <TextField
                fullWidth
                label="URL (örn: https://www.example.com)"
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
                Yayınla
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Aktif Yönlendirmeler
            </Typography>
            <List>
              {urls.map((url, index) => (
                <ListItem key={index}>
                  <ListItemText primary={url} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <MuiAlert elevation={6} variant="filled" severity="error">
            {error}
          </MuiAlert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Dashboard; 