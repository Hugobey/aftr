import { Pressable, SafeAreaView, Share, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Invite'>;

const INVITE_URL = 'https://aftr.app/join/no-sleep';

export default function InviteScreen({ navigation }: Props) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my Dump: ${INVITE_URL}`,
        url: INVITE_URL,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.live}>LIVE</Text>
      </View>

      <View style={styles.divider} />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.eyebrow}>NO SLEEP TILL MONDAY</Text>

        <Text style={styles.title}>
          MORE EYES.{`\n`}BETTER{`\n`}DUMP.
        </Text>

        <Text style={styles.subtitle}>
          Invite the group. One link, every POV.
        </Text>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode
            value={INVITE_URL}
            size={220}
            color="#000"
            backgroundColor="#fff"
          />
        </View>

        <Text style={styles.expiry}>SCAN TO JOIN · EXPIRES IN 48H</Text>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottom}>
        <Pressable style={styles.copyButton} onPress={handleShare}>
          <Text style={styles.copyText}>⌁   COPY INVITE LINK</Text>
        </Pressable>

        <View style={styles.shareRow}>
          <Pressable style={styles.shareBox} onPress={handleShare}>
            <Text style={styles.social}>IG</Text>
            <Text style={styles.socialSmall}>STORY</Text>
          </Pressable>

          <Pressable style={styles.shareBox} onPress={handleShare}>
            <Text style={styles.social}>WA</Text>
            <Text style={styles.socialSmall}>WHATSAPP</Text>
          </Pressable>

          <Pressable style={[styles.shareBox, styles.shareBoxLast]} onPress={handleShare}>
            <Text style={styles.social}>•••</Text>
            <Text style={styles.socialSmall}>MORE</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 104,
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
  live: {
    color: Colors.accent,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#222',
    marginHorizontal: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 38,
    alignItems: 'center',
  },
  eyebrow: {
    color: '#999',
    fontSize: 15,
    letterSpacing: 2.4,
    fontWeight: '900',
    marginTop: 48,
  },
  title: {
    color: Colors.text,
    fontSize: 57,
    lineHeight: 53,
    letterSpacing: -2.6,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 30,
  },
  subtitle: {
    color: '#999',
    fontSize: 19,
    textAlign: 'center',
    marginTop: 32,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 3,
    marginTop: 48,
  },
  expiry: {
    color: '#777',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginTop: 32,
  },
  bottom: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#333',
    padding: 30,
    gap: 19,
  },
  copyButton: {
    backgroundColor: Colors.accent,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 22,
  },
  copyText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '900',
  },
  shareRow: {
    height: 105,
    flexDirection: 'row',
  },
  shareBox: {
    flex: 1,
    backgroundColor: '#101010',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBoxLast: {
    borderRightWidth: 0,
  },
  social: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  socialSmall: {
    color: '#999',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginTop: 10,
  },
});