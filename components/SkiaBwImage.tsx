import { useState } from 'react';
import {
  Image as RNImage,
  LayoutChangeEvent,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  Canvas,
  ColorMatrix,
  FilterMode,
  Image as SkiaImage,
  LinearGradient,
  MipmapMode,
  Rect,
  useImage,
  vec,
} from '@shopify/react-native-skia';

const GRAYSCALE = [
  0.33, 0.33, 0.33, 0, 0,
  0.33, 0.33, 0.33, 0, 0,
  0.33, 0.33, 0.33, 0, 0,
  0, 0, 0, 1, 0,
];

type Props = {
  uri: string;
  bw?: boolean;
  /** smooth black fade at the bottom (for cards / covers) */
  bottomFade?: boolean;
  style?: StyleProp<ViewStyle>;
  fit?: 'cover' | 'contain';
};

export default function SkiaBwImage({
  uri,
  bw = true,
  bottomFade = false,
  style,
  fit = 'cover',
}: Props) {
  const image = useImage(uri);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) setSize({ width, height });
  };

  // Fallback while Skia loads
  if (!image || size.width === 0) {
    return (
      <View style={[styles.fill, style]} onLayout={onLayout}>
        <RNImage
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          resizeMode={fit}
        />
      </View>
    );
  }

  const fadeTop = size.height * 0.4;
  const fadeHeight = size.height * 0.6;

  return (
    <View style={[styles.fill, style]} onLayout={onLayout}>
      <Canvas style={{ width: size.width, height: size.height }}>
        <SkiaImage
          image={image}
          x={0}
          y={0}
          width={size.width}
          height={size.height}
          fit={fit}
          sampling={{ filter: FilterMode.Linear, mipmap: MipmapMode.None }}
        >
          {bw ? <ColorMatrix matrix={GRAYSCALE} /> : null}
        </SkiaImage>

        {bottomFade && (
          <Rect x={0} y={fadeTop} width={size.width} height={fadeHeight}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, fadeHeight)}
              colors={[
                'transparent',
                'rgba(0,0,0,0.35)',
                'rgba(0,0,0,0.8)',
                'rgba(0,0,0,1)',
              ]}
            />
          </Rect>
        )}
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    overflow: 'hidden',
    backgroundColor: '#111',
  },
});