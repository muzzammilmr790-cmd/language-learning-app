import React, { ReactNode } from "react";
import { TouchableOpacity, TouchableOpacityProps, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface AnimatedPressableProps extends TouchableOpacityProps {
  children: ReactNode;
  scaleTo?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function AnimatedPressable({
  children,
  scaleTo = 0.95,
  style,
  onPressIn,
  onPressOut,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = (e: any) => {
    scale.value = withSpring(scaleTo, {
      damping: 15,
      stiffness: 300,
    });
    if (onPressIn) {
      onPressIn(e);
    }
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    if (onPressOut) {
      onPressOut(e);
    }
  };

  return (
    <AnimatedTouchableOpacity
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
      activeOpacity={0.9}
    >
      {children}
    </AnimatedTouchableOpacity>
  );
}
