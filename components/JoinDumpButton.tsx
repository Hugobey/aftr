import { Pressable, StyleSheet, Text } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Colors } from '../constants/Colors';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function JoinDumpButton({ navigation }: Props) {
  return (
    <Pressable
      style={styles.button}
      onPress={() => navigation.navigate('JoinDump')}
    >
      <Text style={styles.text}>⌗  JOIN A DUMP</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 100,
    borderColor: Colors.text,
    borderWidth: 1,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: Colors.text,
    fontWeight: '900',
    fontSize: 17,
  },
});
