import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Lesson } from "../types/learning";
import { getLessonConfig, getLessonCardImage } from "../lib/lessonHelpers";
import { AnimatedPressable } from "./AnimatedPressable";

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  isInProgress: boolean;
  isLocked: boolean;
  baseColor: string;
  onPress: (lesson: Lesson) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  isCompleted,
  isInProgress,
  isLocked,
  baseColor,
  onPress,
}) => {
  const config = getLessonConfig(lesson.type);

  return (
    <AnimatedPressable
      onPress={() => {
        if (!isLocked) {
          onPress(lesson);
        }
      }}
      style={[
        styles.card,
        styles.lessonCard,
        isCompleted && styles.lessonCardCompleted,
        isInProgress && {
          borderColor: baseColor || "#5B4CFA",
          borderBottomWidth: 5,
        },
        isLocked && styles.lessonCardLocked,
      ]}
      className="p-5 mb-4 rounded-3xl flex-row items-center justify-between bg-white relative"
    >
      <View className="flex-1 pr-4">
        <Text
          className="text-xs font-poppins-bold uppercase tracking-wider mb-1"
          style={{
            color: isCompleted
              ? "#10B981"
              : isLocked
                ? "#9CA3AF"
                : baseColor || "#5B4CFA",
          }}
        >
          Lesson {lesson.order} • {config.label}
        </Text>
        <Text
          className={`text-lg font-poppins-bold ${
            isLocked ? "text-neutral-400" : "text-[#111827]"
          }`}
        >
          {lesson.title}
        </Text>

        {isInProgress && (
          <Text
            className="text-xs font-poppins-bold mt-2"
            style={{ color: baseColor || "#5B4CFA" }}
          >
            In progress
          </Text>
        )}

        {isLocked && (
          <Text className="text-xs font-poppins text-neutral-400 mt-1">
            {lesson.durationMinutes} mins • {lesson.xpReward} XP
          </Text>
        )}

        {isCompleted && (
          <Text className="text-xs font-poppins-bold text-[#10B981] mt-2">
            Completed (+{lesson.xpReward} XP)
          </Text>
        )}
      </View>

      {/* Right Side Status Element */}
      <View className="items-center justify-center">
        {isCompleted ? (
          <View className="bg-[#10B981] w-8 h-8 rounded-full items-center justify-center shadow-sm">
            <Feather name="check" size={18} color="white" />
          </View>
        ) : isLocked ? (
          <View className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 items-center justify-center">
            <Feather name="lock" size={16} color="#9CA3AF" />
          </View>
        ) : (
          <Image
            source={{ uri: getLessonCardImage(lesson) }}
            className="w-14 h-14"
            resizeMode="contain"
          />
        )}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#E5E5E5",
  },
  lessonCard: {
    borderRadius: 24,
  },
  lessonCardCompleted: {
    borderColor: "#E5E5E5",
    backgroundColor: "#FAFAFA",
  },
  lessonCardLocked: {
    opacity: 0.8,
    backgroundColor: "#FAFAFA",
    borderColor: "#E5E5E5",
  },
});
