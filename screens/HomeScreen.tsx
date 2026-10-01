import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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
          <ActiveDumpsCarousel
            dumps={ACTIVE_DUMPS}
            navigation={navigation}
          />

          <ArchiveGrid
            dumps={ARCHIVED_DUMPS}
            navigation={navigation}
          />

          <JoinDumpButton navigation={navigation} />
        </ScrollView>
      ) : (
        <EmptyState navigation={navigation} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 26,
    paddingBottom: 50,
  },
});
