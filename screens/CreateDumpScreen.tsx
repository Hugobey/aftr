import { useState, useRef } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';
import Header from '../components/Header';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateDump'>;

export default function CreateDumpScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [openUploads, setOpenUploads] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const isReady = !!name.trim();

  const handleCreate = () => {
    if (!isReady) return;
    Keyboard.dismiss();
    navigation.replace('DumpDetail', { dumpId: 'new-dump' });
  };

  const handleFocus = () => {
    setIsInputFocused(true);
    // Small delay so the keyboard has time to open
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header showBack rightLabel="01 / 01" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.eyebrow}>NEW DUMP</Text>
          <Text style={styles.title}>
            NAME THE{`\n`}DAMAGE.
          </Text>

          <View style={styles.form}>
            {/* Dump Name */}
            <Text style={styles.label}>DUMP NAME</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="E.G. AFTRS AT MIA'S"
              placeholderTextColor="#555"
              style={styles.input}
              autoCapitalize="characters"
              onFocus={handleFocus}
              onBlur={handleBlur}
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />

            {/* Date */}
            <Text style={styles.label}>DATE</Text>
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>24/09/2026</Text>
              <Text style={styles.calendarIcon}>▣</Text>
            </View>

            {/* Cover Photo */}
            <View style={styles.optionRow}>
              <Text style={styles.optionIcon}>▣</Text>
              <Text style={styles.optionLabel}>COVER PHOTO</Text>
              <Text style={styles.addText}>ADD</Text>
            </View>

            {/* Open Uploads */}
            <View style={styles.optionRow}>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>OPEN UPLOADS</Text>
                <Text style={styles.optionHint}>
                  Everyone invited can add photos
                </Text>
              </View>
              <Switch
                value={openUploads}
                onValueChange={setOpenUploads}
                trackColor={{ false: '#333', true: Colors.accent }}
                thumbColor={openUploads ? Colors.accent : '#888'}
              />
            </View>
          </View>

          {/* Spacer so content can scroll above the bottom bar */}
          <View style={{ height: 10 }} />
        </ScrollView>

        {/* Fixed / Keyboard-aware Bottom Bar */}
        <View style={styles.bottomBar}>
          <Pressable
            disabled={!isReady}
            onPress={handleCreate}
            style={[styles.createButton, isReady && styles.createButtonActive]}
          >
            <Text
              style={[
                styles.createButtonText,
                isReady && styles.createButtonTextActive,
              ]}
            >
              CREATE DUMP  ↗
            </Text>
          </Pressable>

          <Text style={styles.helpText}>
            {isReady ? 'READY TO MAKE IT OFFICIAL.' : 'GIVE IT A NAME FIRST.'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 38,
    paddingTop: 24,
    paddingBottom: 20,
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2.4,
  },
  title: {
    color: Colors.text,
    fontSize: 65,
    lineHeight: 60,
    fontWeight: '900',
    letterSpacing: -3.5,
    marginTop: 32,
  },
  form: {
    marginTop: 48,
  },
  label: {
    color: '#888',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
  },
  input: {
    color: Colors.text,
    fontSize: 25,
    fontWeight: '900',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    height: 62,
    marginBottom: 53,
  },
  dateRow: {
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 63,
  },
  dateText: {
    color: Colors.text,
    fontSize: 27,
    fontWeight: '900',
  },
  calendarIcon: {
    color: Colors.text,
    fontSize: 27,
  },
  optionRow: {
    minHeight: 102,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    justifyContent: 'space-between',
  },
  optionIcon: {
    fontSize: 25,
    color: Colors.text,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.7,
  },
  optionHint: {
    color: '#777',
    fontSize: 16,
    marginTop: 8,
  },
  addText: {
    color: Colors.accent,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1.3,
  },

  // Bottom bar (stays above keyboard)
  bottomBar: {
    paddingHorizontal: 38,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#222',
    backgroundColor: Colors.background,
  },
  createButton: {
    height: 68,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181818',
  },
  createButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  createButtonText: {
    fontWeight: '900',
    fontSize: 17,
    color: '#666',
  },
  createButtonTextActive: {
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