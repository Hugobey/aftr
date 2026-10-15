// components/DumpActionButton.tsx
import { Pressable, StyleSheet, Text } from 'react-native';
import Icon from './Icon';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Colors } from '../constants/Colors';

type Variant = 'join' | 'create';
type Appearance = 'primary' | 'secondary';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  variant?: Variant;
  appearance?: Appearance;
  onPress?: () => void;
};

const CONFIG: Record<
  Variant,
  { label: string; icon: 'scan' | 'plus'; route: keyof RootStackParamList }
> = {
  join: { label: 'JOIN A DUMP', icon: 'scan', route: 'JoinDump' },
  create: { label: 'CREATE A DUMP', icon: 'plus', route: 'CreateDump' },
};

export default function DumpActionButton({
  navigation,
  variant = 'join',
  appearance = 'primary',
  onPress,
}: Props) {
  const config = CONFIG[variant];
  const isSecondary = appearance === 'secondary';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isSecondary ? styles.buttonSecondary : styles.buttonPrimary,
        pressed && styles.buttonPressed,
      ]}
      onPress={() => {
        if (onPress) return onPress();
        navigation.navigate(config.route as any);
      }}
    >
      <Icon
        name={config.icon}
        size={22}
        color={isSecondary ? '#fff' : '#000'}
      />
      <Text
        style={[styles.text, isSecondary && styles.textSecondary]}
      >
        {config.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonPrimary: {
    backgroundColor: Colors.accent,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
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
  textSecondary: {
    color: '#fff',
  },
});