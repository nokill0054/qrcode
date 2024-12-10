import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { Button, Container, TextField, Paper, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const QRGenerator = () => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const generateQR = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('QR kod oluşturulurken bir hata oluştu');

      const data = await response.json();
      history.push('/dashboard', { userId: data.userId });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <h2>QR Kod Oluşturucu</h2>
        <TextField
          fullWidth
          label="Benzersiz Kullanıcı Adı"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          margin="normal"
        />
        {userId && (
          <div style={{ textAlign: 'center', margin: 20 }}>
            <QRCode value={`http://yourapp.com/redirect/${userId}`} size={256} />
          </div>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={generateQR}
          disabled={!userId}
        >
          QR Kod Oluştur
        </Button>
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <MuiAlert elevation={6} variant="filled" severity="error">
            {error}
          </MuiAlert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default QRGenerator; 