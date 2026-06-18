import { useUser } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LessonCard } from "../../components/LessonCard";
import { LessonDetailsModal } from "../../components/LessonDetailsModal";
import { PracticeCard } from "../../components/PracticeCard";
import { images } from "../../constants/images";
import { languages } from "../../data/languages";
import { lessons } from "../../data/lessons";
import { units } from "../../data/units";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useProgressStore } from "../../store/useProgressStore";
import { Lesson } from "../../types/learning";

export default function LearnScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { getSelectedLanguage } = useLanguageStore();
  const { completedLessonIds, completeLesson, streak, xp } = useProgressStore();

  const selectedLanguage =
    getSelectedLanguage() ||
    languages.find((lang) => lang.id === "es") ||
    languages[0];

  // Filter units for the selected language
  const languageUnits = units
    .filter((u) => u.languageId === selectedLanguage.id)
    .sort((a, b) => a.order - b.order);

  // Active unit state
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const currentUnit = languageUnits[currentUnitIndex] || languageUnits[0];

  // Active tab state ("lessons" | "practice")
  const [activeTab, setActiveTab] = useState<"lessons" | "practice">("lessons");

  // Selected lesson state for preview modal
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Filter lessons for the current unit
  const currentLessons = currentUnit
    ? lessons
      .filter((l) => l.unitId === currentUnit.id)
      .sort((a, b) => a.order - b.order)
    : [];

  // Completed lessons count in this unit
  const completedLessonsInUnit = currentLessons.filter((l) =>
    completedLessonIds.includes(l.id)
  );

  // Find the first incomplete lesson to mark as "In Progress"
  const firstIncompleteLesson = currentLessons.find(
    (l) => !completedLessonIds.includes(l.id)
  );

  const handlePrevUnit = () => {
    if (currentUnitIndex > 0) {
      setCurrentUnitIndex(currentUnitIndex - 1);
    }
  };

  const handleNextUnit = () => {
    if (currentUnitIndex < languageUnits.length - 1) {
      setCurrentUnitIndex(currentUnitIndex + 1);
    }
  };

  // Trigger completion
  const handleCompleteLesson = async (lesson: Lesson) => {
    if (completedLessonIds.includes(lesson.id)) {
      Alert.alert("Already Completed", "You have already completed this lesson!");
      return;
    }

    try {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (e) {
      console.warn("Haptics failed:", e);
    }

    completeLesson(lesson.id, lesson.xpReward);
    setSelectedLesson(null);
    Alert.alert(
      "Congratulations! 🎉",
      `You completed "${lesson.title}" and earned +${lesson.xpReward} XP!`
    );
  };

  // Helper methods getLessonConfig and getLessonCardImage have been moved to components

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Header / Top Navigation */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-neutral-100">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          className="w-10 h-10 items-center justify-center rounded-full active:opacity-75"
        >
          <Feather name="chevron-left" size={26} color="#4B4B4B" />
        </TouchableOpacity>

        {currentUnit ? (
          <View className="flex-row items-center justify-center flex-1 px-2">
            {currentUnitIndex > 0 && (
              <TouchableOpacity onPress={handlePrevUnit} className="p-1 mr-1">
                <Feather name="chevron-left" size={18} color="#AFAFAF" />
              </TouchableOpacity>
            )}
            <View className="items-center">
              <Text className="text-base font-poppins-bold text-[#111827] text-center" numberOfLines={1}>
                {currentUnit.title}
              </Text>
              <Text className="text-[11px] font-poppins text-[#777777] mt-0.5">
                Unit {currentUnitIndex + 1} • {completedLessonsInUnit.length} / {currentLessons.length} lessons
              </Text>
            </View>
            {currentUnitIndex < languageUnits.length - 1 && (
              <TouchableOpacity onPress={handleNextUnit} className="p-1 ml-1">
                <Feather name="chevron-right" size={18} color="#AFAFAF" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text className="text-lg font-poppins-bold text-[#111827]">Lessons</Text>
        )}

        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full active:opacity-75">
          <Feather name="bookmark" size={22} color="#777777" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-white">
        {/* Banner Section */}
        {currentUnit && (
          <View className="relative mx-6 mt-4 rounded-3xl overflow-hidden shadow-sm border border-neutral-100" style={styles.bannerContainer}>
            <Image
              source={images.lessonHeader}
              className="w-full h-full opacity-90"
              resizeMode="cover"
            />
            {/* Dark overlay for text readability */}
            <View className="absolute inset-0 bg-black/20" />

            {/* Mascot Overlaid on the banner */}
            <View className="absolute bottom-2 left-6 items-center">
              {/* Speech bubble */}
              <View className="bg-white/95 rounded-2xl px-4 py-2 mb-2 shadow-sm border border-neutral-100 max-w-[200px] relative">
                <Text className="text-xs font-poppins-bold text-[#5B4CFA] text-center">
                  Ready for a lesson?
                </Text>
                <Text className="text-[10px] font-poppins text-neutral-600 mt-0.5 text-center">
                  Let&apos;s practice {selectedLanguage.name}!
                </Text>
                {/* Speech bubble tail pointing down */}
                <View
                  style={{
                    position: "absolute",
                    bottom: -5,
                    left: "50%",
                    marginLeft: -5,
                    width: 10,
                    height: 10,
                    backgroundColor: "#ffffff",
                    borderRightWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: "#F3F4F6",
                    transform: [{ rotate: "45deg" }]
                  }}
                />
              </View>

              <View className="w-20 h-20"></View>
            </View>

          </View>
        )}

        {/* Lessons/Practice Tab Selector */}
        <View className="mx-6 mt-6 p-1 bg-neutral-100 rounded-2xl flex-row items-center border border-neutral-200">
          <TouchableOpacity
            onPress={() => setActiveTab("lessons")}
            style={[
              styles.tabBtn,
              activeTab === "lessons" && styles.tabBtnActive,
            ]}
            className="flex-1 py-3 rounded-xl items-center"
          >
            <Text
              className={`text-sm font-poppins-bold ${activeTab === "lessons" ? "text-[#5B4CFA]" : "text-neutral-500"
                }`}
            >
              Lessons
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("practice")}
            style={[
              styles.tabBtn,
              activeTab === "practice" && styles.tabBtnActive,
            ]}
            className="flex-1 py-3 rounded-xl items-center"
          >
            <Text
              className={`text-sm font-poppins-bold ${activeTab === "practice" ? "text-[#5B4CFA]" : "text-neutral-500"
                }`}
            >
              Practice
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "lessons" ? (
          /* Lessons List */
          <View className="px-6 py-6">
            {currentLessons.length === 0 ? (
              <View className="py-10 items-center justify-center">
                <Text className="font-poppins text-neutral-500 text-center">
                  No lessons available for this unit.
                </Text>
              </View>
            ) : (
              currentLessons.map((lesson) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                const isInProgress =
                  !isCompleted &&
                  !!firstIncompleteLesson &&
                  lesson.id === firstIncompleteLesson.id;
                const isLocked = !isCompleted && !isInProgress;

                return (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isCompleted={isCompleted}
                    isInProgress={isInProgress}
                    isLocked={isLocked}
                    baseColor={selectedLanguage.baseColor || "#5B4CFA"}
                    onPress={setSelectedLesson}
                  />
                );
              })
            )}
          </View>
        ) : (
          /* Practice Tab Placeholder Content */
          <View className="px-6 py-8">
            <Text className="text-lg font-poppins-bold text-[#111827] mb-4">
              Personalized Practice Path
            </Text>
            <Text className="text-sm font-poppins text-neutral-500 mb-6">
              Review your weak words, fix mistakes, and practice speaking to master the language.
            </Text>

            <PracticeCard
              title="Mistakes Inbox"
              subtitle="Drill down on questions you missed"
              iconName="alert-triangle"
              iconBackgroundColor="#FF4B4B"
              cardBackgroundColor="#FDF9F9"
              iconColor="#FF4B4B"
              onPress={() => {}}
            />
            <PracticeCard
              title="Vocabulary Drill"
              subtitle="Quick flashcards of your active words"
              iconName="zap"
              iconBackgroundColor="#1CB0F6"
              cardBackgroundColor="#F4FAFC"
              iconColor="#1CB0F6"
              onPress={() => {}}
            />
            <PracticeCard
              title="Speaking Session"
              subtitle="Practice talking with real-time feedback"
              iconName="mic"
              iconBackgroundColor="#5B4CFA"
              cardBackgroundColor="#F6F5FF"
              iconColor="#5B4CFA"
              onPress={() => {}}
            />
          </View>
        )}
      </ScrollView>

      {/* Lesson Details & Preview Modal */}
      <LessonDetailsModal
        lesson={selectedLesson}
        isCompleted={selectedLesson ? completedLessonIds.includes(selectedLesson.id) : false}
        baseColor={selectedLanguage.baseColor || "#5B4CFA"}
        onClose={() => setSelectedLesson(null)}
        onStart={(lessonId) => {
          setSelectedLesson(null);
          router.push({
            pathname: "/audio-lesson",
            params: { id: lessonId },
          });
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
  bannerContainer: {
    height: 180,
  },
  tabBtn: {
    backgroundColor: "transparent",
  },
  tabBtnActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});
