import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';
import type { Dump } from '../data/dumps';
import DumpCard from './DumpCard';

type Props = {
  dumps: Dump[];
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function ArchiveGrid({ dumps, navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ARCHIVE</Text>

      <View style={styles.subheader}>
        <Text style={styles.label}>PAST NIGHTS</Text>

        <Text style={styles.count}>
          {String(dumps.length).padStart(2, '0')}
        </Text>
      </View>

      <View style={styles.grid}>
        {dumps.map((dump) => (
          <Pressable
            key={dump.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate('DumpDetail', {
                dumpId: dump.id,
              })
            }
          >
            <DumpCard dump={dump} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 38,
  },

  title: {
    color: Colors.text,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -1.5,
  },

  subheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingTop: 12,
    paddingBottom: 18,
  },

  label: {
    color: '#666',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },

  count: {
    color: '#666',
    fontSize: 12,
    fontWeight: '900',
  },

  grid: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 5,
  },

  card: {
    flex: 1,
  },
});
