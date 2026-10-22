import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './Header';
import { Colors } from '../constants/Colors';

type Props = {
  eyebrow: string;
  title: string; // use \n for line breaks
  hint: string;
  ctaLabel: string;
  loadingLabel?: string;
  rightLabel?: string;
  initialName?: string;
  loading?: boolean;
  onSubmit: (name: string) => void;
};

export default function ProfileNameForm({
  eyebrow,
  title,
  hint,
  ctaLabel,
  loadingLabel = '…',
  rightLabel,
  initialName = '',
  loading = false,
  onSubmit,
}: Props) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(initialName.trim());
  const [focused, setFocused] = useState(false);
  const ready = name.trim().length > 0;

  const submit = () => {
    if (!ready || loading) return;
    onSubmit(name.trim());
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header showBack rightLabel={rightLabel} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}
      >
        <View style={styles.body}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={[styles.title, focused && styles.titleCompact]}>
            {title}
          </Text>

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
              onSubmitEditing={submit}
            />
            <Text style={styles.hint}>{hint}</Text>
          </View>
        </View>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable
            disabled={!ready || loading}
            onPress={submit}
            style={[styles.cta, ready && !loading && styles.ctaActive]}
          >
            <Text
              style={[
                styles.ctaText,
                ready && !loading && styles.ctaTextActive,
              ]}
            >
              {loading ? loadingLabel : ctaLabel}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 28, paddingTop: 28 },
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
  titleCompact: { fontSize: 36, lineHeight: 34, marginTop: 8 },
  form: { marginTop: 40 },
  formCompact: { marginTop: 24 },
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
  ctaText: { color: '#666', fontSize: 16, fontWeight: '900' },
  ctaTextActive: { color: '#000' },
});