import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';
import Header from '../components/Header';
import { parseJoinCode } from '../utils/parseJoinCode';
import { getDumpByInviteCode } from '../lib/dump';
import { useDeviceStore } from '../store/deviceStore';
import { addDumpMember } from '../lib/members';

type Props = NativeStackScreenProps<RootStackParamList, 'JoinDump'>;

export default function JoinDumpScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scale type from width (base ~390)
  const scale = Math.min(Math.max(width / 390, 0.85), 1.1);
  const titleSize = Math.round(56 * scale);
  const pad = Math.max(16, Math.round(width * 0.05));

  // Finder size: square, limited by width and available height
  const finderSize = Math.min(width - pad * 2, height * 0.42, 320);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission, requestPermission]);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    const code = parseJoinCode(data);
    if (!code) {
      setError('Invalid QR');
      return;
    }
    setScanned(true);
    setError(null);

    try {
      const dump = await getDumpByInviteCode(code);
      const dumpId = dump.id;
      const dumpName = dump.name;

      const displayName = useDeviceStore.getState().displayName?.trim();
      const ensureDeviceId = useDeviceStore.getState().ensureDeviceId;
      const addJoinedId = useDeviceStore.getState().addJoinedId;

      if (displayName) {
        await addDumpMember({
          dumpId,
          deviceId: ensureDeviceId(),
          displayName,
          role: 'member',
        });
        addJoinedId(dumpId);
        navigation.replace('DumpDetail', { dumpId });
        return;
      }

      navigation.replace('JoinProfile', { dumpId, dumpName });
    } catch {
      setError('Dump not found');
      setScanned(false);
    }
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <Header showBack rightLabel="SCAN" />

      <View style={[styles.content, { paddingHorizontal: pad }]}>
        {/* Top copy — doesn't shrink away */}
        <View style={styles.top}>
          <Text style={styles.eyebrow}>JOIN A DUMP</Text>
          <Text
            style={[
              styles.title,
              { fontSize: titleSize, lineHeight: titleSize * 0.95 },
            ]}
          >
            SCAN THE{`\n`}CODE.
          </Text>
          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>

        {/* Camera fills remaining space */}
        <View style={styles.cameraBox}>
          {permission?.granted && (
            <CameraView
              style={StyleSheet.absoluteFill}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />
          )}

          {/* Centered square finder */}
          <View style={[styles.finder, { width: finderSize, height: finderSize }]}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

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

        <Text
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          POINT YOUR CAMERA AT THE DUMP QR CODE
        </Text>
      </View>
    </View>
  );
}

const CORNER = 44;
const BORDER = 4;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  top: {
    paddingTop: 8,
    marginBottom: 16,
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
  title: {
    color: Colors.text,
    fontWeight: '900',
    letterSpacing: -2.5,
    marginTop: 10,
  },
  error: {
    color: '#E85A5A',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 10,
  },
  cameraBox: {
    flex: 1, // ← grows/shrinks with phone height
    minHeight: 200,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#444',
    backgroundColor: '#0d0d0d',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finder: {
    position: 'absolute',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: Colors.accent,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: BORDER,
    borderLeftWidth: BORDER,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: BORDER,
    borderRightWidth: BORDER,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: BORDER,
    borderLeftWidth: BORDER,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: BORDER,
    borderRightWidth: BORDER,
  },
  permission: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.72)',
    zIndex: 3,
  },
  cameraIcon: {
    fontSize: 34,
    color: '#ccc',
  },
  permissionTitle: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 14,
    borderTopWidth: 2,
    borderTopColor: Colors.accent,
    paddingTop: 10,
  },
  permissionBody: {
    color: '#777',
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
  },
  allowButton: {
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 20,
  },
  allowText: {
    color: Colors.accent,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  footer: {
    color: '#777',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.3,
    textAlign: 'center',
    marginTop: 16,
  },
});