import { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'JoinDump'>;

export default function JoinDumpScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarcodeScanned = () => {
    if (scanned) return;

    setScanned(true);
    navigation.replace('DumpDetail', { dumpId: 'no-sleep' });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.topLabel}>SCAN</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <Text style={styles.eyebrow}>JOIN A DUMP</Text>
        <Text style={styles.title}>
          SCAN THE{`\n`}CODE.
        </Text>

        {/* Camera Box */}
        <View style={styles.cameraBox}>
          {permission?.granted && (
            <CameraView
              style={StyleSheet.absoluteFill}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />
          )}

          <Corners />

          {/* Permission overlay */}
          {!permission?.granted && (
            <View style={styles.permission}>
              <Text style={styles.cameraIcon}>▣</Text>
              <Text style={styles.permissionTitle}>CAMERA ACCESS NEEDED</Text>
              <Text style={styles.permissionBody}>
                Allow camera access, then try again.
              </Text>
              <Pressable style={styles.allowButton} onPress={requestPermission}>
                <Text style={styles.allowText}>ALLOW CAMERA</Text>
              </Pressable>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          POINT YOUR CAMERA AT THE DUMP QR CODE
        </Text>
      </View>
    </SafeAreaView>
  );
}

/* -------------------- Corner Markers -------------------- */

function Corners() {
  return (
    <>
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />
    </>
  );
}

/* -------------------- Styles -------------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    // height: 100,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 54,
    color: Colors.text,
    fontWeight: '200',
    marginTop: -10,
  },
  topLabel: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#222',
    marginHorizontal: 18,
  },
  content: {
    flex: 1,
    padding: 2,
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2.4,
    // marginTop: 33,
  },
  title: {
    color: Colors.text,
    fontSize: 68,
    lineHeight: 60,
    fontWeight: '900',
    letterSpacing: -3,
    marginTop: 32,
  },
  cameraBox: {
    height: 420,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#444',
    marginTop: 48,
    backgroundColor: '#0d0d0d',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderColor: Colors.accent,
    zIndex: 2,
  },
  topLeft: {
    top: '22%',
    left: '15%',
    borderTopWidth: 5,
    borderLeftWidth: 5,
  },
  topRight: {
    top: '22%',
    right: '15%',
    borderTopWidth: 5,
    borderRightWidth: 5,
  },
  bottomLeft: {
    bottom: '22%',
    left: '15%',
    borderBottomWidth: 5,
    borderLeftWidth: 5,
  },
  bottomRight: {
    bottom: '22%',
    right: '15%',
    borderBottomWidth: 5,
    borderRightWidth: 5,
  },
  permission: {
    alignItems: 'center',
    zIndex: 3,
  },
  cameraIcon: {
    fontSize: 34,
    color: '#ccc',
  },
  permissionTitle: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 15,
    borderTopWidth: 2,
    borderTopColor: Colors.accent,
    paddingTop: 10,
  },
  permissionBody: {
    color: '#777',
    fontSize: 16,
    marginTop: 14,
    textAlign: 'center',
  },
  allowButton: {
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 22,
  },
  allowText: {
    color: Colors.accent,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  footer: {
    color: '#777',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 32,
  },
});