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

export default function ActiveDumpsCarousel({
  dumps,
  navigation,
}: Props) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const cardWidth = width - 52;
  const snapInterval = cardWidth + 8;

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.label}>ACTIVE / RECENT</Text>

        <Text style={styles.count}>
          {String(dumps.length).padStart(2, '0')}
        </Text>
      </View>

      <FlatList
        data={dumps}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={styles.carousel}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / snapInterval,
          );

          setActiveIndex(index);
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={{ width: cardWidth }}
            onPress={() =>
              navigation.navigate('DumpDetail', {
                dumpId: item.id,
              })
            }
          >
            <DumpCard dump={item} large />
          </Pressable>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.position}>
          {String(activeIndex + 1).padStart(2, '0')} /{' '}
          {String(dumps.length).padStart(2, '0')}
        </Text>

        <View style={styles.progress}>
          {dumps.map((dump, index) => (
            <View
              key={dump.id}
              style={[
                styles.segment,
                index === activeIndex && styles.segmentActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingBottom: 18,
    marginBottom: 20,
  },

  label: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2.2,
  },

  count: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  carousel: {
    paddingRight: 26,
  },

  footer: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 18,
  },

  position: {
    color: '#888',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  progress: {
    flexDirection: 'row',
    gap: 5,
  },

  segment: {
    width: 18,
    height: 3,
    backgroundColor: '#444',
  },

  segmentActive: {
    backgroundColor: Colors.accent,
  },
});
