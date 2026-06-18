import React, { useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const CIRCLE_SIZE = 48;
const TAB_BAR_HEIGHT = 64;

const routeConfig: Record<
  string,
  { label: string; icon: React.ComponentProps<typeof Feather>["name"] }
> = {
  home: { label: "Home", icon: "home" },
  learn: { label: "Learn", icon: "book-open" },
  "ai-teacher": { label: "AI Teacher", icon: "video" },
  profile: { label: "Profile", icon: "user" },
};

interface TabButtonProps {
  isActive: boolean;
  onPress: () => void;
  onLongPress: () => void;
  label: string;
  iconName: React.ComponentProps<typeof Feather>["name"];
}

const TabButton: React.FC<TabButtonProps> = ({
  isActive,
  onPress,
  onLongPress,
  label,
  iconName,
}) => {
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: 250 });
  }, [isActive, progress]);

  const activeStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        { scale: progress.value },
        { translateY: (1 - progress.value) * 8 },
      ],
    };
  });

  const inactiveStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - progress.value,
      transform: [
        { scale: 1 - progress.value * 0.15 },
        { translateY: -progress.value * 8 },
      ],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center h-full relative"
      activeOpacity={0.8}
    >
      {/* Active State (centered white icon inside the indicator circle) */}
      <Animated.View
        style={[activeStyle, styles.activeIconWrapper]}
        pointerEvents={isActive ? "auto" : "none"}
      >
        <Feather name={iconName} size={24} color="#FFFFFF" />
      </Animated.View>

      {/* Inactive State (gray icon and label stacked vertically) */}
      <Animated.View
        style={[inactiveStyle, styles.inactiveIconWrapper]}
        pointerEvents={isActive ? "none" : "auto"}
      >
        <Feather name={iconName} size={20} color="#777777" />
        <Text
          numberOfLines={1}
          className="text-[9px] font-poppins-bold text-neutral-400 mt-0.5 uppercase tracking-wider"
          style={styles.label}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(screenWidth);

  const onLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const activeIndex = state.index;

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / state.routes.length;
    const targetX = activeIndex * tabWidth + (tabWidth - CIRCLE_SIZE) / 2;
    return {
      transform: [
        {
          translateX: withSpring(targetX, {
            damping: 14,
            stiffness: 110,
            mass: 0.8,
          }),
        },
      ],
    };
  });

  const bottomPadding = insets.bottom > 0 ? Math.max(insets.bottom - 6, 0) : 6;

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.container,
        {
          height: TAB_BAR_HEIGHT + bottomPadding,
          paddingBottom: bottomPadding,
        },
      ]}
    >
      {/* Animated Sliding Background Circle */}
      <Animated.View style={[styles.activeIndicator, indicatorStyle]} />

      {/* Tab Buttons */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const config = routeConfig[route.name] || {
          label: options.title || route.name,
          icon: "help-circle",
        };

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabButton
            key={route.key}
            isActive={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            label={config.label}
            iconName={config.icon}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1.5,
    borderTopColor: "#E5E5E5",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0 -4px 8px rgba(0,0,0,0.03)",
      },
    }),
  },
  activeIndicator: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#5B4CFA",
    top: (TAB_BAR_HEIGHT - CIRCLE_SIZE) / 2 - 4,
    ...Platform.select({
      ios: {
        shadowColor: "#5B4CFA",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 4px 6px rgba(91,76,250,0.3)",
      },
    }),
  },
  activeIconWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Poppins_700Bold",
  },
});
