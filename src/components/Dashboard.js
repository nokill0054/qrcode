import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Snackbar,
  Divider
} from '@material-ui/core';
import QRCode from 'qrcode.react';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Dashboard = () => {
  const [qr, setQr] = useState(null);
  const [newUrl, setNewUrl] = useState('');
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    bio: '',
    website: '',
    instagram: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');

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
        throw new Error(data.error || 'QR data could not be loaded');
      }

      const profile = data.profile || {};
      const socialLinks = profile.socialLinks || {};

      setQr(data);
      setQrColor(data.qrColor || '#000000');
      setQrBgColor(data.qrBgColor || '#ffffff');
      setProfileForm({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        website: profile.website || '',
        instagram: socialLinks.instagram || ''
      });
    } catch (err) {
      setError(err.message || 'QR data could not be loaded');
    } finally {
      setLoading(false);
    }
  };

  const addUrl = async () => {
    if (!newUrl) {
      setError('Please enter a destination URL');
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
        throw new Error(data.error || 'URL could not be published');
      }

      setQr(data);
      setNewUrl('');
      setSuccess('New destination URL has been published');
    } catch (err) {
      setError(err.message || 'URL could not be published');
    }
  };

  const setQrMode = async (mode) => {
    try {
      const response = await fetch('/api/me/qr/mode', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ mode })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'QR mode could not be updated');
      }

      setQr(data);
      setSuccess(mode === 'profile' ? 'QR now opens your profile page' : 'QR now redirects to the latest destination URL');
    } catch (err) {
      setError(err.message || 'QR mode could not be updated');
    }
  };

  const saveProfile = async () => {
    try {
      const response = await fetch('/api/me/qr/profile', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          displayName: profileForm.displayName,
          bio: profileForm.bio,
          website: profileForm.website,
          socialLinks: {
            instagram: profileForm.instagram
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Profile could not be saved');
      }

      setQr(data);
      setSuccess('Profile has been saved');
    } catch (err) {
      setError(err.message || 'Profile could not be saved');
    }
  };

  const saveQrStyle = async () => {
    try {
      const response = await fetch('/api/me/qr/style', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          qrColor,
          qrBgColor
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'QR colors could not be saved');
      }

      setQr(data);
      setQrColor(data.qrColor || '#000000');
      setQrBgColor(data.qrBgColor || '#ffffff');
      setSuccess('QR color settings have been saved');
    } catch (err) {
      setError(err.message || 'QR colors could not be saved');
    }
  };

  const downloadQrPng = () => {
    try {
      const qrElement = document.getElementById('user-qr-code');

      if (!qrElement) {
        setError('QR code area was not found');
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
        setSuccess('QR PNG downloaded');
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
          context.fillStyle = qrBgColor;
          context.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
          context.drawImage(image, 0, 0);

          const link = document.createElement('a');
          link.href = exportCanvas.toDataURL('image/png');
          link.download = `b54-qr-${qr?.slug || 'code'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(url);
          setSuccess('QR PNG downloaded');
        };

        image.onerror = () => {
          URL.revokeObjectURL(url);
          setError('QR PNG could not be created');
        };

        image.src = url;
        return;
      }

      setError('No downloadable QR code was found');
    } catch (err) {
      setError('QR PNG download failed');
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
      setError('Copy failed. Please select and copy the link manually.');
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
            Loading dashboard...
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
            QR data could not be loaded.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchQr}
            style={{ marginTop: 15 }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  const qrRedirectUrl = `${window.location.origin}/api/redirect/${qr.slug}`;
  const profileUrl = `${window.location.origin}/q/${qr.slug}`;
  const latestUrl = qr.urls && qr.urls.length > 0 ? qr.urls[qr.urls.length - 1] : '';

  const qrColorPalette = [
    { label: 'Black', value: '#000000' },
    { label: 'Navy', value: '#0f172a' },
    { label: 'Green', value: '#14532d' },
    { label: 'Burgundy', value: '#7f1d1d' },
    { label: 'Purple', value: '#581c87' },
    { label: 'Brown', value: '#78350f' }
  ];

  const qrBgColorPalette = [
    { label: 'White', value: '#ffffff' },
    { label: 'Cream', value: '#fff7ed' },
    { label: 'Light Gray', value: '#f3f4f6' },
    { label: 'Light Yellow', value: '#fef9c3' },
    { label: 'Light Blue', value: '#dbeafe' },
    { label: 'Light Green', value: '#dcfce7' }
  ];

  return (
    <Container maxWidth="lg">
      <Box style={{ marginTop: 24, marginBottom: 24 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              B54 QR Dashboard
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your permanent QR code, update its destination, customize its colors, and download it for print.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4} style={{ textAlign: 'right' }}>
            <Button variant="outlined" onClick={logout}>
              Logout
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper style={{ padding: 24, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Your Permanent QR Code
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 18 }}>
              This QR code stays the same. You can change the destination behind it anytime.
            </Typography>

            <Box style={{ textAlign: 'center' }}>
              <Box id="user-qr-code" style={{ display: 'inline-block', padding: 12, backgroundColor: qrBgColor }}>
                <QRCode
                  value={qrRedirectUrl}
                  size={230}
                  level="H"
                  fgColor={qrColor}
                  bgColor={qrBgColor}
                />
              </Box>

              <Box style={{ marginTop: 18 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={downloadQrPng}
                  style={{ marginRight: 8, marginBottom: 8 }}
                >
                  Download QR PNG
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => copyText(qrRedirectUrl, 'QR link copied')}
                  style={{ marginBottom: 8 }}
                >
                  Copy QR Link
                </Button>
              </Box>
            </Box>

            <Divider style={{ marginTop: 20, marginBottom: 16 }} />

            <Typography variant="body2" color="textSecondary">
              QR link
            </Typography>
            <Typography variant="body2" style={{ wordBreak: 'break-all', marginBottom: 12 }}>
              {qrRedirectUrl}
            </Typography>

            <Typography variant="body2" color="textSecondary">
              Profile link
            </Typography>
            <Typography variant="body2" style={{ wordBreak: 'break-all' }}>
              {profileUrl}
            </Typography>

            <Button
              variant="outlined"
              onClick={() => copyText(profileUrl, 'Profile link copied')}
              style={{ marginTop: 12 }}
            >
              Copy Profile Link
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper style={{ padding: 24, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              QR Color Settings
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 18 }}>
              Choose from the palettes or use the custom color pickers. For best scanning, use a dark QR color and a light background.
            </Typography>

            <Typography variant="body2" gutterBottom>
              QR Color Palette
            </Typography>
            <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {qrColorPalette.map((color) => (
                <Button
                  key={color.value}
                  variant={qrColor === color.value ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setQrColor(color.value)}
                  style={{ minWidth: 105 }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: color.value,
                      border: '1px solid #999',
                      display: 'inline-block',
                      marginRight: 6
                    }}
                  />
                  {color.label}
                </Button>
              ))}
            </Box>

            <Box style={{ marginBottom: 20 }}>
              <input
                type="color"
                value={qrColor}
                onChange={(event) => setQrColor(event.target.value)}
                style={{
                  width: 54,
                  height: 38,
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              />
              <Typography variant="caption" display="block" style={{ marginTop: 6 }}>
                Selected QR color: {qrColor}
              </Typography>
            </Box>

            <Typography variant="body2" gutterBottom>
              Background Color Palette
            </Typography>
            <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {qrBgColorPalette.map((color) => (
                <Button
                  key={color.value}
                  variant={qrBgColor === color.value ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setQrBgColor(color.value)}
                  style={{ minWidth: 105 }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: color.value,
                      border: '1px solid #999',
                      display: 'inline-block',
                      marginRight: 6
                    }}
                  />
                  {color.label}
                </Button>
              ))}
            </Box>

            <Box style={{ marginBottom: 20 }}>
              <input
                type="color"
                value={qrBgColor}
                onChange={(event) => setQrBgColor(event.target.value)}
                style={{
                  width: 54,
                  height: 38,
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              />
              <Typography variant="caption" display="block" style={{ marginTop: 6 }}>
                Selected background color: {qrBgColor}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={saveQrStyle}
            >
              Save Color Settings
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 24 }}>
            <Typography variant="h6" gutterBottom>
              Destination Link
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 12 }}>
              Update where your QR code should send people.
            </Typography>

            <Typography variant="body2" color="textSecondary">
              Current destination
            </Typography>
            <Typography style={{ wordBreak: 'break-all', marginBottom: 14 }}>
              {latestUrl || 'No destination URL has been published yet'}
            </Typography>

            <TextField
              fullWidth
              label="Example: https://www.example.com"
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
              Publish Destination
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 24 }}>
            <Typography variant="h6" gutterBottom>
              QR Mode
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 12 }}>
              Choose whether your QR opens your profile page or directly redirects to your latest destination URL.
            </Typography>

            <Typography style={{ marginBottom: 12 }}>
              Current mode: <strong>{qr.mode === 'profile' ? 'Profile Page' : 'Direct Redirect'}</strong>
            </Typography>

            <Button
              variant={qr.mode === 'redirect' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setQrMode('redirect')}
              style={{ marginRight: 8, marginBottom: 8 }}
            >
              Direct Redirect
            </Button>

            <Button
              variant={qr.mode === 'profile' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setQrMode('profile')}
              style={{ marginBottom: 8 }}
            >
              Profile Page
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper style={{ padding: 24 }}>
            <Typography variant="h6" gutterBottom>
              Profile Page Settings
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 12 }}>
              These details appear on your public profile page when your QR is in profile mode.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Display name"
                  value={profileForm.displayName}
                  onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website"
                  value={profileForm.website}
                  onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instagram URL"
                  value={profileForm.instagram}
                  onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="primary"
              onClick={saveProfile}
              style={{ marginTop: 10 }}
            >
              Save Profile
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper style={{ padding: 24 }}>
            <Typography variant="h6" gutterBottom>
              How to Use This QR
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Download the PNG file and place it on business cards, stickers, product labels, flyers, menus, packaging, or social media graphics.
              The printed QR can stay the same while you update the destination link from this dashboard.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={Boolean(error)} autoHideDuration={5000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={Boolean(success)} autoHideDuration={4000} onClose={() => setSuccess('')}>
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
