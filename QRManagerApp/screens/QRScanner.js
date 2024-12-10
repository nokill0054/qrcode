import React, { useState } from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

const QRScanner = ({ navigation }) => {
  const [error, setError] = useState(null);

  const onSuccess = async (e) => {
    try {
      const url = e.data;
      // URL'i aç
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        setError('Bu URL açılamıyor');
      }
      
      navigation.navigate('Result', { data: url });
    } catch (err) {
      setError(err.message);
      navigation.navigate('Result', { error: err.message });
    }
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        topContent={
          <Text style={styles.centerText}>
            QR kodunu tarayın
          </Text>
        }
        bottomContent={
          error && (
            <Text style={styles.errorText}>
              {error}
            </Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerText: {
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  errorText: {
    color: 'red',
    padding: 16
  }
});

export default QRScanner; 