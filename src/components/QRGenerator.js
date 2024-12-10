import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { Button, Container, Paper, Typography, Box } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

// Ngrok'un verdiği yeni URL'i buraya yazın
const BACKEND_URL = 'https://1234-abc-xyz.ngrok.io';

const QRGenerator = () => {
  const [qrId, setQrId] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const generateQR = async () => {
    try {
      console.log('QR kod oluşturuluyor...');
      const uniqueId = generateRandomId();
      
      // Backend'e localhost üzerinden istek at
      const response = await fetch('http://localhost:5001/api/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: uniqueId }),
      });

      console.log('Backend yanıtı:', response.status);
      const data = await response.json();
      console.log('Backend data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'QR kod oluşturulurken bir hata oluştu');
      }

      setQrId(data.userId);
      
      // QR kodu oluşturulduğunda dashboard'a yönlendir
      history.push('/dashboard', { userId: data.userId });
    } catch (err) {
      console.error('Hata:', err);
      setError(err.message || 'Bir hata oluştu');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: 20, marginTop: 20, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          QR Kod Oluşturucu
        </Typography>
        
        <Box my={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={generateQR}
          >
            Bana Özel QR Kod Oluştur
          </Button>
        </Box>

        {qrId && (
          <Box my={4}>
            <QRCode 
              value="https://www.akillimizan.com"
              size={256}
              level="H"
            />
            <Typography variant="body2" style={{ marginTop: 10 }}>
              QR kodu telefonunuzla tarayın
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default QRGenerator; 