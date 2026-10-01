import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import type { RootStackParamList } from '../App';
import { Colors } from '../constants/Colors';
import Header from '../components/Header';

import EmptyState from '../components/EmptyState';
import ActiveDumpsCarousel from '../components/ActiveDumpsCarousel';
import ArchiveGrid from '../components/ArchiveGrid';
import JoinDumpButton from '../components/JoinDumpButton';

import {
  ACTIVE_DUMPS,
  ARCHIVED_DUMPS,
} from '../data/dumps';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [showDumps, setShowDumps] = useState(true);
  const insets = useSafeAreaInsets();


  const totalCount = ACTIVE_DUMPS.length + ARCHIVED_DUMPS.length;

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        variant="home"
        onPlusPress={() => navigation.navigate('CreateDump')}
        onScanPress={() => navigation.navigate('JoinDump')}
        onLogoLongPress={() => setShowDumps((prev) => !prev)}
      />

      {showDumps ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Title block */}
          <Text style={styles.eyebrow}>YOUR NIGHT, EVERY POV</Text>

          <View style={styles.titleRow}>
            <Text style={styles.title}>DUMPS</Text>
            <Text style={styles.totalCount}>
              {String(totalCount).padStart(2, '0')}
            </Text>
          </View>

          <ActiveDumpsCarousel
            dumps={ACTIVE_DUMPS}
            navigation={navigation}
          />

          <ArchiveGrid
            dumps={ARCHIVED_DUMPS}
            navigation={navigation}
          />

          {/* <JoinDumpButton navigation={navigation} /> */}
        </ScrollView>
        
      ) : (
        <EmptyState navigation={navigation} />
      )}

      {/* Fixed CTA */}
      <View
        style={[
          styles.fixedButton,
          {
            bottom: insets.bottom + 16,
          },
        ]}
      >
        <JoinDumpButton navigation={navigation} />
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 50,
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 28,
  },
  title: {
    color: Colors.text,
    fontSize: 64,
    lineHeight: 60,
    fontWeight: '900',
    letterSpacing: -2.5,
  },
  totalCount: {
    color: '#666',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
  },
   fixedButton: {
    position: 'absolute',
    left: 26,
    right: 26,
  },
});