import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView as Camera, useCameraPermissions } from 'expo-camera';

const ScanQRCodeScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  // Determine a safe initial camera type. Some versions export CameraType, others use Camera.Constants.Type
  const getInitialCameraType = () => {
    try {
      // Preferred: CameraType (named export) if available
      if (CameraType && CameraType.back) {
        return CameraType.back;
      }
    } catch (e) {
      // ignore
    }

    try {
      if (Camera && Camera.Constants && Camera.Constants.Type && typeof Camera.Constants.Type.back !== 'undefined') {
        return Camera.Constants.Type.back;
      }
    } catch (e) {
      // ignore
    }

    // Fallback to simple string expected by Camera
    return 'back';
  };

  // Track facing as 'back' or 'front', then resolve the actual camera value to pass to the component.
  const [facing, setFacing] = useState('back');
  const cameraType = facing;

  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
  }, [requestPermission]);

  useEffect(() => {
    if (permission) {
      setHasPermission(permission.granted);
    }
  }, [permission]);

  const handleBarCodeScanned = ({ type: codeType, data }) => {
    setScanned(true);
    if (!data) {
      Alert.alert('Invalid QR', 'Scanned QR code contained no data.');
      setScanned(false);
      return;
    }

    // Basic validation to ensure it looks like a user ID
    const trimmed = data.trim();
    if (!trimmed.startsWith('user_')) {
      Alert.alert('Invalid QR', 'Scanned QR does not contain a valid user ID.');
      setScanned(false);
      return;
    }

    // Navigate back to MainTabs and then to SendMoney screen with the scanned recipient ID.
    navigation.navigate('MainTabs', { 
      screen: 'SendMoney', 
      params: { recipientFromQR: trimmed } 
    });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}><Text style={{ fontFamily: 'StackSansHeadline-Regular' }}>Requesting camera permission...</Text></View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}><Text style={{ fontFamily: 'StackSansHeadline-Regular' }}>No access to camera. Please enable camera permissions in device settings.</Text></View>
    );
  }

  const isValidCameraComponent = Camera && (typeof Camera === 'function' || Camera?.displayName || Camera?.name);
  if (!isValidCameraComponent) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#333', textAlign: 'center', fontFamily: 'StackSansHeadline-Regular' }}>
          Camera module is not available. It seems the `expo-camera` import didn't provide a React component. Please ensure `expo-camera` is installed and linked correctly (run `npx expo install expo-camera`).
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#007bff" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Scan QR Code</Text>
        <Text style={styles.instruction}>
          This scanner only accepts QR codes from the camera. Uploading or selecting screenshots or images from your gallery is not supported.
        </Text>
        
        <View style={styles.scannerContainer}>
          <Camera
            style={StyleSheet.absoluteFillObject}
            facing={cameraType}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
        </View>

        <View style={styles.toggleRow}>
          <TouchableOpacity style={[styles.cancelButton, styles.toggleButton]} onPress={() => setFacing(prev => prev === 'back' ? 'front' : 'back')}>
            <Text style={styles.cancelText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    color: '#333',
    fontFamily: 'StackSansHeadline-SemiBold',
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontFamily: 'StackSansHeadline-Regular',
  },
  scannerContainer: {
    width: '100%',
    flex: 1,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: '#000',
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%'
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'StackSansHeadline-Medium',
  }
  ,
  toggleRow: {
    width: '100%',
    marginTop: 12,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#007bff',
  }
});

export default ScanQRCodeScreen;
