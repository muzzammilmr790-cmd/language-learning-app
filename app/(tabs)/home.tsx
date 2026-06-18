import { useUser } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/images";
import { languages } from "../../data/languages";
import { lessons } from "../../data/lessons";
import { units } from "../../data/units";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useProgressStore } from "../../store/useProgressStore";
import { LessonDetailsModal } from "../../components/LessonDetailsModal";
import { Lesson, LessonType } from "../../types/learning";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedLessonForModal, setSelectedLessonForModal] = React.useState<Lesson | null>(null);

  const { getSelectedLanguage } = useLanguageStore();
  const selectedLanguage =
    getSelectedLanguage() ||
    languages.find((lang) => lang.id === "es") ||
    languages[0];

  const {
    xp,
    dailyXpGoal,
    streak,
    completedLessonIds,
    completeLesson,
  } = useProgressStore();

  // Greeting name from Clerk
  const firstName = user?.firstName || "Learner";

  // Filter units for the selected language
  const languageUnits = units
    .filter((u) => u.languageId === selectedLanguage.id)
    .sort((a, b) => a.order - b.order);

  // Fallback / dynamic resolution of current unit & lessons
  let currentUnit = languageUnits[0];
  let currentLessons = currentUnit
    ? lessons.filter((l) => l.unitId === currentUnit.id).sort((a, b) => a.order - b.order)
    : [];

  // If no lessons or unit found, fallback to Spanish (es) Unit 1
  if (currentLessons.length === 0) {
    const fallbackUnit = units.find((u) => u.languageId === "es");
    if (fallbackUnit) {
      currentUnit = fallbackUnit;
      currentLessons = lessons
        .filter((l) => l.unitId === fallbackUnit.id)
        .sort((a, b) => a.order - b.order);
    }
  }

  // Find first incomplete lesson
  const currentLesson =
    currentLessons.find((l) => !completedLessonIds.includes(l.id)) ||
    currentLessons[currentLessons.length - 1];

  // Calculate progress metrics
  const completedLessonsInUnit = currentLessons.filter((l) =>
    completedLessonIds.includes(l.id)
  );
  const progressFraction = `${completedLessonsInUnit.length}/${currentLessons.length}`;

  // Get up to 4 upcoming lessons for Today's Plan
  const firstIncompleteIndex = currentLessons.findIndex((l) => !completedLessonIds.includes(l.id));
  const startIndex = Math.max(0, firstIncompleteIndex === -1 ? currentLessons.length - 4 : firstIncompleteIndex);
  const todaysPlanLessons = currentLessons.slice(startIndex, startIndex + 4);

  // Toggle completion of a lesson for testing and interactive feedback
  const handleToggleLesson = async (lessonId: string, xpReward: number) => {
    const isAlreadyCompleted = completedLessonIds.includes(lessonId);

    if (isAlreadyCompleted) {
      Alert.alert(
        "Lesson Completed",
        "You have already completed this lesson. Keep going!"
      );
      return;
    }

    try {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (e) {
      console.warn("Haptics failed:", e);
    }

    completeLesson(lessonId, xpReward);
  };

  // Start current lesson CTA
  const handleStartLesson = () => {
    if (!currentLesson) return;
    setSelectedLessonForModal(currentLesson);
  };

  const handleLessonRowClick = (lesson: Lesson) => {
    setSelectedLessonForModal(lesson);
  };

  // Helper to resolve icon style by type
  const getLessonConfig = (type: LessonType) => {
    switch (type) {
      case "vocabulary":
        return {
          iconName: "book-open" as const,
          iconBg: "#FF5E7E",
          labelText: "Vocabulary Lesson",
        };
      case "chat":
        return {
          iconName: "message-square" as const,
          iconBg: "#5B4CFA",
          labelText: "AI Conversation",
        };
      case "audio":
        return {
          iconName: "headphones" as const,
          iconBg: "#1CB0F6",
          labelText: "Audio Practice",
        };
      case "video":
        return {
          iconName: "video" as const,
          iconBg: "#10B981",
          labelText: "AI Video Lesson",
        };
      default:
        return {
          iconName: "book-open" as const,
          iconBg: "#777777",
          labelText: "Lesson",
        };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-neutral-100">
        <View className="flex-row items-center">
          {/* Language Flag circle */}
          <View className="w-10 h-10 rounded-full bg-neutral-50 items-center justify-center border border-neutral-200 mr-3 overflow-hidden">
            {selectedLanguage.flag.includes('http') ? (
              <Image source={{ uri: selectedLanguage.flag }} style={{ width: 24, height: 24, borderRadius: 12 }} resizeMode="cover" />
            ) : (
              <Text className="text-xl leading-8">{selectedLanguage.flag}</Text>
            )}
          </View>
          <Text className="text-xl font-poppins-bold text-[#111827]">
            Hola, {firstName}! 👋
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          {/* Streak count */}
          <View className="flex-row items-center">
            <Image
              source={images.streakFire}
              className="mr-1"
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
            <Text className="text-base font-poppins-bold text-[#777777]">
              {streak}
            </Text>
          </View>
          {/* Notifications bell */}
          <TouchableOpacity className="p-1 active:opacity-75">
            <Feather name="bell" size={22} color="#777777" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        className="flex-1 bg-white px-6 pt-5"
      >
        {/* Continue Learning Card */}
        <View style={[styles.card, styles.continueCard]} className="mb-6 rounded-3xl p-5 overflow-hidden relative">
          <View className="flex-1 pr-28 z-10">
            <Text className="text-[10px] font-poppins-bold text-white/70 uppercase tracking-wider">
              Continue learning
            </Text>
            <Text className="text-2xl font-poppins-bold text-white mt-0.5">
              {selectedLanguage.name}
            </Text>
            <Text
              className="text-xs font-poppins text-white/90 mt-1"
              numberOfLines={2}
            >
              {currentUnit ? `${currentUnit.title} (${progressFraction})` : "Basics & Greetings"}
            </Text>
            <TouchableOpacity
              onPress={handleStartLesson}
              className="bg-white rounded-full px-5 py-2.5 shadow-sm mt-4 self-start active:opacity-90"
            >
              <Text className="text-[#5B4CFA] font-poppins-bold text-xs uppercase tracking-wider">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            source={images.palace}
            className="absolute right-[-5] bottom-0"
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        </View>

        {/* Today's Plan Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-poppins-bold text-[#111827]">
              {"Today's plan"}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/learn")}
              activeOpacity={0.7}
            >
              <Text className="text-sm font-poppins-bold text-[#5B4CFA]">
                View all
              </Text>
            </TouchableOpacity>
          </View>

          {/* Lessons List */}
          {todaysPlanLessons.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const { iconBg, iconName, labelText } = getLessonConfig(lesson.type);

            return (
              <TouchableOpacity
                key={lesson.id}
                onPress={() => handleLessonRowClick(lesson)}
                style={[styles.card, styles.lessonRow]}
                className="flex-row items-center justify-between mb-3 bg-white p-4"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center flex-1 pr-4">
                  {/* Icon Container */}
                  <View
                    style={{ backgroundColor: iconBg }}
                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                  >
                    <Feather name={iconName} size={20} color="white" />
                  </View>
                  {/* Text Container */}
                  <View className="flex-1">
                    <Text className="text-sm font-poppins-bold text-[#111827]">
                      {labelText}
                    </Text>
                    <Text
                      className="text-xs font-poppins text-[#777777] mt-0.5"
                      numberOfLines={1}
                    >
                      {lesson.title}
                    </Text>
                  </View>
                </View>
                {/* Circle Checkbox */}
                <View className="items-center justify-center">
                  {isCompleted ? (
                    <View className="bg-[#5B4CFA] w-6 h-6 rounded-full items-center justify-center">
                      <Feather name="check" size={14} color="white" />
                    </View>
                  ) : (
                    <View className="border-2 border-neutral-300 w-6 h-6 rounded-full" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      {/* Lesson Details Modal */}
      <LessonDetailsModal
        lesson={selectedLessonForModal}
        isCompleted={selectedLessonForModal ? completedLessonIds.includes(selectedLessonForModal.id) : false}
        baseColor={selectedLanguage.baseColor}
        onClose={() => setSelectedLessonForModal(null)}
        onStart={(lessonId) => {
          if (selectedLessonForModal) {
            handleToggleLesson(lessonId, selectedLessonForModal.xpReward);
          }
          setSelectedLessonForModal(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#E5E5E5",
  },
  continueCard: {
    backgroundColor: "#5B4CFA",
    borderColor: "#4338CA",
    borderBottomWidth: 5,
  },
  lessonRow: {
    borderColor: "#E5E5E5",
    borderRadius: 16,
  },

});
