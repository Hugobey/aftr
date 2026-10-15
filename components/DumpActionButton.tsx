// components/DumpActionButton.tsx
import { Pressable, StyleSheet, Text } from 'react-native';
import Icon from './Icon';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Colors } from '../constants/Colors';

type Variant = 'join' | 'create';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  variant?: Variant;
  onPress?: () => void;
};

const CONFIG: Record<
  Variant,
  {
    label: string;
    icon: 'scan' | 'plus';
    route: keyof RootStackParamList;
  }
> = {
  join: {
    label: 'JOIN A DUMP',
    icon: 'scan',
    route: 'JoinDump',
  },
  create: {
    label: 'CREATE A DUMP',
    icon: 'plus',
    route: 'CreateDump',
  },
};

export default function DumpActionButton({
  navigation,
  variant = 'join',
  onPress,
}: Props) {
  const config = CONFIG[variant];

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    navigation.navigate(config.route as any);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={handlePress}
    >
      <Icon name={config.icon} size={22} color="#000" />
      <Text style={styles.text}>{config.label}</Text>
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