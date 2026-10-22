import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

  const storedName = useDeviceStore((s) => s.displayName);
  const setDisplayName = useDeviceStore((s) => s.setDisplayName);
  const ensureDeviceId = useDeviceStore((s) => s.ensureDeviceId);
  const addJoinedId = useDeviceStore((s) => s.addJoinedId);

  const [name, setName] = useState(storedName?.trim() ?? '');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const ready = name.trim().length > 0;

  const handleEnter = async () => {
    if (!ready || loading) return;
    try {
      setLoading(true);
      const displayName = name.trim();
      const deviceId = ensureDeviceId();
      setDisplayName(displayName);
      console.log('5 after setDisplayName');

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
      {/* Dump lives in the chrome — not next to YOUR NAME */}
      <Header
        showBack
        rightLabel={dumpName ? dumpName.toUpperCase() : undefined}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}
      >
        <View style={styles.body}>
          <Text style={styles.eyebrow}>YOU’RE IN</Text>
          <Text style={[styles.title, focused && styles.titleCompact]}>
            WHO’S{'\n'}JOINING?
          </Text>

          {/* Form only — one label, one field */}
          <View style={[styles.form, focused && styles.formCompact]}>
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
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onSubmitEditing={handleEnter}
            />
            <Text style={styles.hint}>
              SHOWN TO OTHERS IN THE MEMBERS LIST.
            </Text>
          </View>
        </View>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
          <Pressable
            disabled={!ready || loading}
            onPress={handleEnter}
            style={[styles.cta, ready && !loading && styles.ctaActive]}
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
  body: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
  title: {
    color: '#fff',
    fontSize: 48,
    lineHeight: 46,
    fontWeight: '900',
    letterSpacing: -2,
    marginTop: 14,
  },
  titleCompact: {
    fontSize: 36,
    lineHeight: 34,
    marginTop: 8,
  },
  form: {
    marginTop: 40,
  },
  formCompact: {
    marginTop: 24,
  },
  label: {
    color: '#888',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  input: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 10,
  },
  hint: {
    color: '#555',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 12,
  },
  bottomBar: {
    paddingHorizontal: 28,
    paddingTop: 12,
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