import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import { Colors } from '../constants/Colors';

interface HeaderProps {
  /** Home screen variant */
  variant?: 'default' | 'home';

  showBack?: boolean;
  rightLabel?: string;
  rightLabelColor?: string;
  onRightPress?: () => void;

  rightIcon?: 'share' | 'scan' | 'plus';
  onRightIconPress?: () => void;

  // Home specific
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
  onPlusPress,
  onScanPress,
  onLogoLongPress,
}: HeaderProps) {
  const navigation = useNavigation();

  // ========== HOME HEADER ==========
  if (variant === 'home') {
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          {/* Left - Plus */}
          <Pressable style={styles.iconButton} onPress={onPlusPress}>
            <Icon name="plus" size={24} />
          </Pressable>

          {/* Center - Logo */}
          <Pressable onLongPress={onLogoLongPress}>
            <Image
              source={require('../assets/images/AFTR_logo..png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Pressable>

          {/* Right - Scan */}
          <Pressable style={styles.iconButton} onPress={onScanPress}>
            <Icon name="scan" size={22} />
          </Pressable>
        </View>

        <View style={styles.divider} />
      </View>
    );
  }

  // ========== DEFAULT HEADER ==========
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Left */}
        {showBack ? (
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="back" size={24} />
          </Pressable>
        ) : (
          <View style={styles.iconButtonPlaceholder} />
        )}

        {/* Right side */}
        <View style={styles.right}>
          {rightLabel && (
            <Pressable onPress={onRightPress}>
              <Text style={[styles.rightLabel, { color: rightLabelColor }]}>
                {rightLabel}
              </Text>
            </Pressable>
          )}

          {rightIcon && (
            <Pressable style={styles.iconButton} onPress={onRightIconPress}>
              <Icon name={rightIcon} size={22} />
            </Pressable>
          )}
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
    height: 64, // smaller header
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
    gap: 16,
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