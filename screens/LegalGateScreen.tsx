// screens/LegalGateScreen.tsx
import { Linking, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useDeviceStore } from '../store/deviceStore';

const PRIVACY_URL = 'https://joinaftr.app/privacy';
const TERMS_URL = 'https://joinaftr.app/terms';

type Props = {
  onAccepted: () => void;
};

export default function LegalGateScreen({ onAccepted }: Props) {
  const insets = useSafeAreaInsets();
  const acceptLegal = useDeviceStore((s) => s.acceptLegal);

  const handleContinue = () => {
    acceptLegal();
    onAccepted();
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.body}>
        {/* <Text style={styles.eyebrow}>AFTR</Text> */}
        <Image
            source={require('../assets/images/AFTR_logo..png')}
            style={styles.logo}
            resizeMode="contain"
        />
        <Text style={styles.title}>
          BEFORE{`\n`}YOU DUMP.
        </Text>
        <Text style={styles.copy}>
          By using Aftr, you agree to our{' '}
          <Text style={styles.link} onPress={() => Linking.openURL(TERMS_URL)}>
            Terms of Service
          </Text>
          {' '}and{' '}
          <Text style={styles.link} onPress={() => Linking.openURL(PRIVACY_URL)}>
            Privacy Policy
          </Text>
          .
        </Text>
        <Text style={styles.copy}>
          Objectionable content will not be tolerated. You can report content inside a dump. Violations may result in removal from the dump or the platform.
        </Text>
      </View>

      <Pressable style={styles.cta} onPress={handleContinue}>
        <Text style={styles.ctaText}>CONTINUE</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.4,
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 48,
    lineHeight: 46,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 28,
  },
  logo: {
    width: 45,
    height: 15,
    marginBottom: 16,
  },
  copy: {
    color: '#999',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  link: {
    color: Colors.accent,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  cta: {
    height: 64,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});