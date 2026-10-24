import { Image, Pressable, StyleSheet, Text, View, Vibration } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import { Colors } from '../constants/Colors';

type HeaderIcon = 'share' | 'scan' | 'plus' | 'more' | 'back';

interface HeaderProps {
  variant?: 'default' | 'home';

  showBack?: boolean;
  onBackPress?: () => void;

  rightLabel?: string;
  rightLabelColor?: string;
  onRightPress?: () => void;

  /** Primary right icon (e.g. share) */
  rightIcon?: HeaderIcon;
  onRightIconPress?: () => void;

  /** Secondary right icon (e.g. more / ⋯) */
  rightIcon2?: HeaderIcon;
  onRightIcon2Press?: () => void;

  onPlusPress?: () => void;
  onScanPress?: () => void;
  onLogoLongPress?: () => void;
}

export default function Header({
  variant = 'default',
  showBack = true,
  rightLabel,
  rightLabelColor = Colors.accent,
  onRightPress,
  rightIcon,
  onRightIconPress,
  rightIcon2,
  onRightIcon2Press,
  onPlusPress,
  onScanPress,
  onLogoLongPress,
  onBackPress,
}: HeaderProps) {
  const navigation = useNavigation();

  if (variant === 'home') {
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Pressable style={styles.iconButton} onPress={onPlusPress}>
            <Icon name="plus" size={24} />
          </Pressable>

          <Pressable
            delayLongPress={800}
            onLongPress={() => {
              Vibration.vibrate(40);
              onLogoLongPress?.();
            }}
          >
            <Image
              source={require('../assets/images/AFTR_logo..png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable style={styles.iconButton} onPress={onScanPress}>
            <Icon name="scan" size={22} />
          </Pressable>
        </View>
        <View style={styles.divider} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {showBack ? (
          <Pressable
            style={styles.iconButton}
            onPress={() => {
              if (onBackPress) onBackPress();
              else navigation.goBack();
            }}
          >
            <Icon name="back" size={24} />
          </Pressable>
        ) : (
          <View style={styles.iconButtonPlaceholder} />
        )}

        <View style={styles.right}>
          {rightLabel ? (
            <Pressable onPress={onRightPress}>
              <Text style={[styles.rightLabel, { color: rightLabelColor }]}>
                {rightLabel}
              </Text>
            </Pressable>
          ) : null}

          {rightIcon ? (
            <Pressable style={styles.iconButton} onPress={onRightIconPress}>
              <Icon name={rightIcon} size={22} />
            </Pressable>
          ) : null}

          {rightIcon2 ? (
            <Pressable style={styles.iconButton} onPress={onRightIcon2Press}>
              <Icon name={rightIcon2} size={22} />
            </Pressable>
          ) : null}
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background,
  },
  container: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPlaceholder: {
    width: 48,
    height: 48,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightLabel: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  logo: {
    width: 70,
    height: 28,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#222',
    marginHorizontal: 16,
  },
});