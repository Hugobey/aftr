import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';
import type { Dump } from '../data/dumps';
import DumpCard from './DumpCard';

type Props = {
  dumps: Dump[];
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function ActiveDumpsCarousel({ dumps, navigation }: Props) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const cardWidth = width - 52; // matches horizontal page padding (26 * 2)
  const separator = 8;
  const snapInterval = cardWidth + separator;

  if (dumps.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      {/* Section header */}
      <View style={styles.header}>
        <Text style={styles.label}>ACTIVE / RECENT</Text>
        <Text style={styles.count}>
          {String(dumps.length).padStart(2, '0')}
        </Text>
      </View>

      {/* Carousel */}
      <FlatList
        data={dumps}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={styles.carousel}
        ItemSeparatorComponent={() => <View style={{ width: separator }} />}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / snapInterval,
          );
          setActiveIndex(Math.min(Math.max(index, 0), dumps.length - 1));
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Pressable
            style={{ width: cardWidth }}
            onPress={() =>
              navigation.navigate('DumpDetail', { dumpId: item.id })
            }
          >
            <DumpCard
              dump={item}
              large
            />
          </Pressable>
        )}
      />

      {/* Hint under card — matches screenshot */}
      <Text style={styles.hint}>SWIPE THROUGH YOUR DUMPS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
  },
  count: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  carousel: {
    // no extra right padding if page already has 26
  },
  hint: {
    marginTop: 14,
    color: '#666',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'right',
  },
});