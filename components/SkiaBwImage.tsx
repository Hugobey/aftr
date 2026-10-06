import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  Canvas,
  Image as SkiaImage,
  ColorMatrix,
  useImage,
  FilterMode,
  MipmapMode,
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
  style?: StyleProp<ViewStyle>;
  fit?: 'cover' | 'contain';
};

export default function SkiaBwImage({
  uri,
  bw = true,
  style,
  fit = 'cover',
}: Props) {
  const image = useImage(uri);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <View style={[styles.fill, style]} onLayout={onLayout}>
      {image && size.width > 0 && (
        <Canvas style={StyleSheet.absoluteFill}>
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
        </Canvas>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    overflow: 'hidden',
    backgroundColor: '#111',
  },
});