import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Link
} from '@material-ui/core';

const ProfilePage = () => {
  const { slug } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/public/profile/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Profil bulunamadı');
        }

        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Profil yükleniyor...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Profil bulunamadı
          </Typography>
          <Typography>{error}</Typography>
        </Paper>
      </Container>
    );
  }

  const profile = profileData.profile || {};
  const socialLinks = profile.socialLinks || {};

  const normalizeExternalUrl = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  };

  const openExternalUrl = (url) => {
    const safeUrl = normalizeExternalUrl(url);
    if (safeUrl) {
      window.open(safeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {profile.displayName || 'QR Profil'}
        </Typography>

        {profile.bio && (
          <Typography variant="body1" sx={{ mb: 3 }}>
            {profile.bio}
          </Typography>
        )}

        {profile.website && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              onClick={() => openExternalUrl(profile.website)}
            >
              Website
            </Button>
          </Box>
        )}

        {profileData.latestUrl && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              onClick={() => openExternalUrl(profileData.latestUrl)}
            >
              Son Bağlantıya Git
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Object.entries(socialLinks).map(([name, url]) => (
            url ? (
              <Link
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
              </Link>
            ) : null
          ))}
        </Box>

        <Typography variant="caption" display="block" sx={{ mt: 4, color: 'text.secondary' }}>
          QR: {profileData.slug}
        </Typography>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
