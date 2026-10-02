import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';
import Header from '../components/Header';
import { getDump } from '../lib/dump';
import Icon from '../components/Icon';

type Props = NativeStackScreenProps<RootStackParamList, 'Invite'>;

export default function InviteScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const dumpId = route.params?.dumpId;

  const [title, setTitle] = useState('YOUR DUMP');
  const [inviteUrl, setInviteUrl] = useState(`https://aftr.app/join/${dumpId ?? ''}`);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!dumpId) return;

    (async () => {
      try {
        const dump = await getDump(dumpId);
        if (dump?.name) setTitle(dump.name);
        if (dump?.invite_code) {
          setInviteUrl(`https://aftr.app/join/${dump.invite_code}`);
        }
      } catch (e) {
        console.log('Invite load error', e);
      }
    })();
  }, [dumpId]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my Dump on Aftr: ${inviteUrl}`,
        url: inviteUrl,
      });
    } catch (e) {
      console.log('Share error:', e);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: insets.top }}>
        <Header showBack rightLabel="LIVE" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom },
        ]}
      >
        <Text style={styles.eyebrow}>{title.toUpperCase()}</Text>

        <Text style={styles.title}>
          MORE EYES.{`\n`}BETTER{`\n`}DUMP.
        </Text>

        <Text style={styles.subtitle}>
          Invite the group. One link, every POV.
        </Text>

        <View style={styles.qrContainer}>
          <QRCode
            value={inviteUrl}
            size={200}
            color="#000"
            backgroundColor="#fff"
          />
        </View>

        <Text style={styles.expiry}>SCAN TO JOIN</Text>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom - 20 }]}>
        <Pressable style={styles.copyButton} onPress={handleCopy}>
          {copied ? (
            <Icon name="check" size={20} color="#000" />
          ) : (
            <Icon name="link" size={20} color="#000" />
          ) }
          <Text style={styles.copyText}>
            {copied ? 'LINK COPIED' : 'COPY INVITE LINK'}
          </Text>
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

          <Pressable
            style={[styles.shareBox, styles.shareBoxLast]}
            onPress={handleShare}
          >
            <Text style={styles.social}>•••</Text>
            <Text style={styles.socialSmall}>MORE</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  eyebrow: {
    color: '#999',
    fontSize: 13,
    letterSpacing: 2.2,
    fontWeight: '900',
    marginTop: 8,
    textAlign: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: 48,
    lineHeight: 46,
    letterSpacing: -2.2,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 22,
    marginTop: 36,
  },
  expiry: {
    color: '#777',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginTop: 24,
  },
  bottom: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#333',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  copyButton: {
    backgroundColor: Colors.accent,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  copyText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
  },
  shareRow: {
    height: 60,
    flexDirection: 'row',
  },
  shareBox: {
    flex: 1,
    backgroundColor: '#101010',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBoxLast: {
    borderRightWidth: 0,
  },
  social: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  socialSmall: {
    color: '#888',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 8,
  },
});