import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './Header';
import { Colors } from '../constants/Colors';

export type DumpFormProps = {
  mode: 'create' | 'edit';
  /** header right, e.g. "01 / 01" or "EDIT" */
  rightLabel?: string;

  name: string;
  onChangeName: (value: string) => void;

  /** display string, e.g. "24 OCT 2026" */
  dateLabel: string;
  onPressDate?: () => void;

  coverUri: string | null;
  onPickCover: () => void;

  isOpen: boolean;
  onChangeOpen: (value: boolean) => void;

  ctaLabel: string;
  ctaDisabled?: boolean;
  loading?: boolean;
  helpText?: string;
  onSubmit: () => void;

  onBackPress?: () => void;
};

export default function DumpForm({
  mode,
  rightLabel,
  name,
  onChangeName,
  dateLabel,
  onPressDate,
  coverUri,
  onPickCover,
  isOpen,
  onChangeOpen,
  ctaLabel,
  ctaDisabled = false,
  loading = false,
  helpText,
  onSubmit,
  onBackPress,
}: DumpFormProps) {
  const insets = useSafeAreaInsets();
  const canSubmit = !ctaDisabled && !loading && !!name.trim();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header
        showBack
        rightLabel={rightLabel}
        onBackPress={onBackPress}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.eyebrow}>
            {mode === 'edit' ? 'EDIT DUMP' : 'NEW DUMP'}
          </Text>
          <Text style={styles.title}>
            {mode === 'edit' ? 'TWEAK THE\nDAMAGE.' : 'NAME THE\nDAMAGE.'}
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>DUMP NAME</Text>
            <TextInput
              value={name}
              onChangeText={onChangeName}
              placeholder="E.G. AFTRS AT MIA'S"
              placeholderTextColor="#555"
              style={styles.input}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>DATE</Text>
            <Pressable style={styles.dateRow} onPress={onPressDate}>
              <Text style={styles.dateText}>{dateLabel}</Text>
              <Text style={styles.calendarIcon}>▦</Text>
            </Pressable>

            <View style={styles.optionRow}>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>COVER PHOTO</Text>
                <Text style={styles.optionHint}>
                  {coverUri ? 'Tap to change' : 'Optional — first photo can be cover'}
                </Text>
              </View>
              <Pressable onPress={onPickCover} hitSlop={8}>
                {coverUri ? (
                  <Image source={{ uri: coverUri }} style={styles.coverThumb} />
                ) : (
                  <Text style={styles.addText}>
                    ADD
                  </Text>
                )}
              </Pressable>
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>OPEN UPLOADS</Text>
                <Text style={styles.optionHint}>
                  Everyone invited can add photos
                </Text>
              </View>
              <Switch
                value={isOpen}
                onValueChange={onChangeOpen}
                trackColor={{ false: '#333', true: Colors.accent }}
                thumbColor={isOpen ? Colors.accent : '#888'}
              />
            </View>
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
          <Pressable
            disabled={!canSubmit}
            onPress={onSubmit}
            style={[styles.cta, canSubmit && styles.ctaActive]}
          >
            <Text style={[styles.ctaText, canSubmit && styles.ctaTextActive]}>
              {loading ? '…' : ctaLabel}
            </Text>
          </Pressable>
          {!!helpText && <Text style={styles.helpText}>{helpText}</Text>}
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
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2.4,
    marginTop: 28,
  },
  title: {
    color: '#fff',
    fontSize: 48,
    lineHeight: 46,
    fontWeight: '900',
    letterSpacing: -2.2,
    marginTop: 24,
  },
  form: {
    marginTop: 40,
  },
  label: {
    color: '#888',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 12,
  },
  input: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    height: 52,
    marginBottom: 36,
  },
  dateRow: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },
  dateText: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  calendarIcon: {
    color: Colors.text,
    fontSize: 20,
  },
  optionRow: {
    minHeight: 88,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'space-between',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  optionHint: {
    color: '#777',
    fontSize: 14,
    marginTop: 6,
  },
  addText: {
    color: Colors.accent,
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1.2,
  },
  coverThumb: {
    width: 48,
    height: 48,
    backgroundColor: '#222',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#222',
    backgroundColor: Colors.background,
  },
  cta: {
    height: 68,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181818',
  },
  ctaActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  ctaText: {
    fontWeight: '900',
    fontSize: 17,
    color: '#666',
  },
  ctaTextActive: {
    color: '#000',
  },
  helpText: {
    color: '#777',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.6,
    textAlign: 'center',
    marginTop: 16,
  },
});