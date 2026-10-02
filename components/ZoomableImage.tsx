import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.85;

type Props = {
  uri: string;
  isActive?: boolean;
};

export default function ZoomableImage({ uri, isActive = true }: Props) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);

  useEffect(() => {
    if (!isActive) {
        scale.value = 1;
        translateX.value = 0;
        translateY.value = 0;
        savedScale.value = 1;
        savedX.value = 0;
        savedY.value = 0;
    }
}, [isActive]);

  const reset = () => {
    'worklet';
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedScale.value = 1;
    savedX.value = 0;
    savedY.value = 0;
  };

  // Reset when user swipes to another photo
  if (!isActive && scale.value !== 1) {
    // handled in useEffect below via JS — see note
  }

  const pinch = Gesture.Pinch()
    .onStart((e) => {
      originX.value = e.focalX - width / 2 - savedX.value;
      originY.value = e.focalY - IMAGE_HEIGHT / 2 - savedY.value;
    })
    .onUpdate((e) => {
      const next = Math.min(Math.max(savedScale.value * e.scale, 1), 4);
      const delta = next / savedScale.value;

      // zoom toward focal point
      translateX.value = savedX.value + originX.value - originX.value * delta;
      translateY.value = savedY.value + originY.value - originY.value * delta;
      scale.value = next;
    })
    .onEnd(() => {
      if (scale.value <= 1.05) {
        reset();
      } else {
        savedScale.value = scale.value;
        savedX.value = translateX.value;
        savedY.value = translateY.value;
      }
    });

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((_, state) => {
      if (scale.value > 1) state.activate();
      else state.fail();
    })
    .onUpdate((e) => {
      translateX.value = savedX.value + e.translationX;
      translateY.value = savedY.value + e.translationY;
    })
    .onEnd(() => {
      savedX.value = translateX.value;
      savedY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((e) => {
      if (scale.value > 1) {
        reset();
      } else {
        const fx = e.x - width / 2;
        const fy = e.y - IMAGE_HEIGHT / 2;
        scale.value = withTiming(2);
        translateX.value = withTiming(-fx);
        translateY.value = withTiming(-fy);
        savedScale.value = 2;
        savedX.value = -fx;
        savedY.value = -fy;
      }
    });

  const composed = Gesture.Simultaneous(pinch, pan, doubleTap);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.Image
        source={{ uri }}
        style={[styles.image, style]}
        resizeMode="contain"
      />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  image: {
    width,
    height: IMAGE_HEIGHT,
  },
});