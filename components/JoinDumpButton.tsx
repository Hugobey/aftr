import { Pressable, StyleSheet, Text } from 'react-native';
import Icon from './Icon';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Colors } from '../constants/Colors';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function JoinDumpButton({ navigation }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={() => navigation.navigate('JoinDump')}
    >
      <Icon
        name='scan'
        size={22}
        color="#000"
      />

      <Text style={styles.text}>JOIN A DUMP</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 64,
    backgroundColor: Colors.accent,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 10,

    borderRadius: 0,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  text: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1.2,
  },
});