import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Box,
  Snackbar
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Login = () => {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = tab === 0 ? 'login' : 'register';

      const response = await fetch(`/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      localStorage.setItem('token', data.token);
      history.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Sunucuya bağlanılamadı');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: 24, marginTop: 40 }}>
        <Typography variant="h4" align="center" gutterBottom>
          B54 QR Yönetim Paneli
        </Typography>

        <Typography variant="body2" align="center" style={{ marginBottom: 20 }}>
          Sabit QR kodunu yönet. Hedef linki istediğin zaman değiştir.
        </Typography>

        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          centered
        >
          <Tab label="Giriş" />
          <Tab label="Kayıt Ol" />
        </Tabs>

        <Box mt={3}>
          <Typography variant="h5" align="center">
            {tab === 0 ? 'Giriş Yap' : 'Kayıt Ol'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-posta"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 20 }}
            >
              {tab === 0 ? 'Giriş Yap' : 'Kayıt Ol'}
            </Button>
          </form>
        </Box>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <MuiAlert elevation={6} variant="filled" severity="error">
            {error}
          </MuiAlert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Login;
