import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Paper, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Snackbar } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import MuiAlert from '@material-ui/lab/Alert';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/qr/${userId}`);
      const data = await response.json();
      setUrls(data.urls || []);
    } catch (err) {
      setError('URLler yüklenirken hata oluştu');
    }
  };

  const addUrl = async () => {
    if (newUrl) {
      try {
        const response = await fetch(`http://localhost:5000/api/qr/${userId}/urls`, {
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
        setError(err.message);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <h2>QR Kod Yönetimi</h2>
        <TextField
          fullWidth
          label="Yeni URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addUrl}
          style={{ marginTop: 10 }}
        >
          URL Ekle
        </Button>
        <List>
          {urls.map((url, index) => (
            <ListItem key={index}>
              <ListItemText primary={url} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
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