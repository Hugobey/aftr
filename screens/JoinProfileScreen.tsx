import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../App';
import Header from '../components/Header';
import { Colors } from '../constants/Colors';
import { addDumpMember } from '../lib/members';
import { useDeviceStore } from '../store/deviceStore';

type Props = NativeStackScreenProps<RootStackParamList, 'JoinProfile'>;

export default function JoinProfileScreen({ navigation, route }: Props) {
  const { dumpId, dumpName } = route.params;
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const storedName = useDeviceStore((s) => s.displayName);
  const setDisplayName = useDeviceStore((s) => s.setDisplayName);
  const ensureDeviceId = useDeviceStore((s) => s.ensureDeviceId);
  const addJoinedId = useDeviceStore((s) => s.addJoinedId);

  const [name, setName] = useState(storedName?.trim() ?? '');
  const [loading, setLoading] = useState(false);

  const ready = name.trim().length > 0;

  const handleFocus = () => {
    // Let the keyboard open, then scroll input into view
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 100, animated: true });    }, 100);
  };

  const handleEnter = async () => {
    if (!ready || loading) return;
    try {
      setLoading(true);
      const displayName = name.trim();
      const deviceId = ensureDeviceId();

      setDisplayName(displayName);

      await addDumpMember({
        dumpId,
        deviceId,
        displayName,
        role: 'member',
      });
      addJoinedId(dumpId);
      navigation.replace('DumpDetail', { dumpId });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not join this dump. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header showBack />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.eyebrow}>YOU’RE IN</Text>
          <Text style={styles.title}>
            WHO’S{'\n'}JOINING?
          </Text>

          {!!dumpName && (
            <Text style={styles.dumpName}>{dumpName}</Text>
          )}

          <Text style={styles.label}>YOUR NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="E.G. SAM"
            placeholderTextColor="#555"
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.input}
            returnKeyType="done"
            onFocus={handleFocus}
            onSubmitEditing={handleEnter}
          />

          <Text style={styles.hint}>
            SHOWN TO OTHERS IN THE MEMBERS LIST.
          </Text>

          {/* Extra space so the field can scroll above the keyboard */}
          <View style={{ height: 160 }} />
        </ScrollView>

        <View
          style={[styles.bottomBar, { paddingBottom: 16 }]}
        >
          <Pressable
            disabled={!ready || loading}
            onPress={handleEnter}
            style={[
              styles.cta,
              ready && !loading && styles.ctaActive,
            ]}
          >
            <Text
              style={[
                styles.ctaText,
                ready && !loading && styles.ctaTextActive,
              ]}
            >
              {loading ? 'JOINING...' : 'ENTER DUMP  ↗'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 24,
    // no flex: 1 — content must be able to grow so ScrollView can scroll
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
  title: {
    color: '#fff',
    fontSize: 52,
    lineHeight: 50,
    fontWeight: '900',
    letterSpacing: -2,
    marginTop: 20,
  },
  dumpName: {
    color: '#888',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginTop: 16,
    textTransform: 'uppercase',
  },
  label: {
    color: '#888',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginTop: 48,
    marginBottom: 12,
  },
  input: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 12,
  },
  hint: {
    color: '#555',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 16,
  },
  bottomBar: {
    paddingHorizontal: 28,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#222',
    backgroundColor: Colors.background,
  },
  cta: {
    height: 64,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  ctaText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '900',
  },
  ctaTextActive: {
    color: '#000',
  },
});