import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export interface DefaultComponent {
  duration?: number;
  animationType?: string | undefined;
  delay?: number;
  infinite?: boolean;
  children?: React.ReactChild | React.ReactChild[];
  style?: any;
}

const AnimatedView = ({
  animationType = undefined,
  // delay = 0,
  duration = 500,
  // infinite = false,
  style,
  children,
}: DefaultComponent): React.ReactElement => {
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (animationType === 'pulse') {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, {
            duration: duration,
          }),
          withTiming(1.1, {
            duration: duration,
          }),
          withTiming(1, {
            duration: duration,
          })
        ),
        -1,
        false
      );
    } else if (animationType === 'fadeIn') {
      pulse.value = withRepeat(
        withSequence(
          withTiming(0, {
            duration,
          }),
          withTiming(1, {
            duration,
          }),
          withTiming(0, {
            duration,
          })
        ),
        -1,
        false
      );
    }
  }, [animationType]);
  const pulseStyle = useAnimatedStyle(() => {
    if (animationType === 'pulse') {
      return {
        transform: [{ scale: pulse.value }],
      };
    }
    if (animationType === 'fadeIn') {
      return {
        opacity: pulse.value,
      };
    }
    return {};
  }, [pulse, animationType]);

  return (
    <Animated.View style={[style, animationType && pulseStyle]}>
      {children}
    </Animated.View>
  );
};
export default AnimatedView;
