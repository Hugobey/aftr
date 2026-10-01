import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../App';
import { Colors } from '../constants/Colors';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function EmptyState({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.eyebrow}>NO RECAPS. JUST PROOF.</Text>

        <Text style={styles.hero}>
          THE PARTY{'\n'}
          LIVES ON{'\n'}
          AFTR
          <Text style={styles.dot}>.</Text>
        </Text>

        <Text style={styles.subhead}>
          Create or join a Dump to get started
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('CreateDump')}
        >
          <Text style={styles.primaryText}>CREATE A DUMP</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('JoinDump')}
        >
          <Text style={styles.secondaryText}>JOIN A DUMP</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 42,
    paddingTop: 0,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },

  eyebrow: {
    color: '#999',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2.5,
  },

  hero: {
    color: Colors.text,
    fontSize: 67,
    lineHeight: 58,
    letterSpacing: -3.4,
    fontWeight: '900',
    marginTop: 32,
  },

  dot: {
    color: Colors.accent,
  },

  subhead: {
    color: '#999',
    fontSize: 20,
    marginTop: 40,
  },

  actions: {
    gap: 18,
  },

  primaryButton: {
    height: 72,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },

  primaryText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
  },

  secondaryButton: {
    height: 72,
    borderWidth: 1,
    borderColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },

  secondaryText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
});
