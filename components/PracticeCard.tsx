import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AnimatedPressable } from "./AnimatedPressable";

interface PracticeCardProps {
  title: string;
  subtitle: string;
  iconName: React.ComponentProps<typeof Feather>["name"];
  iconBackgroundColor: string;
  cardBackgroundColor: string;
  iconColor: string;
  onPress: () => void;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({
  title,
  subtitle,
  iconName,
  iconBackgroundColor,
  cardBackgroundColor,
  iconColor,
  onPress,
}) => {
  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: cardBackgroundColor }]}
      className="p-5 mb-4 rounded-3xl flex-row items-center"
    >
      <View
        style={{ backgroundColor: iconBackgroundColor }}
        className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
      >
        <Feather name={iconName} size={24} color="white" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-poppins-bold text-[#111827]">
          {title}
        </Text>
        <Text className="text-xs font-poppins text-[#777777] mt-0.5">
          {subtitle}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={iconColor} />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#E5E5E5",
  },
});
