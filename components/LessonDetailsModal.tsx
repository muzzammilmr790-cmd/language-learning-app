import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Lesson } from "../types/learning";
import { getLessonConfig } from "../lib/lessonHelpers";
import { PrimaryButton } from "./PrimaryButton";

interface LessonDetailsModalProps {
  lesson: Lesson | null;
  isCompleted: boolean;
  baseColor: string;
  onClose: () => void;
  onStart: (lessonId: string) => void;
}

export const LessonDetailsModal: React.FC<LessonDetailsModalProps> = ({
  lesson,
  isCompleted,
  baseColor,
  onClose,
  onStart,
}) => {
  if (!lesson) return null;

  const config = getLessonConfig(lesson.type);

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay} className="flex-1 justify-end">
        <View
          style={styles.modalContent}
          className="bg-white rounded-t-[40px] px-6 pt-6 pb-8 shadow-2xl"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="max-h-[80vh]"
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between pb-4 border-b border-neutral-100">
              <View className="flex-row items-center">
                <View
                  style={{ backgroundColor: config.color }}
                  className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
                >
                  <Feather name={config.icon} size={20} color="white" />
                </View>
                <View>
                  <Text className="text-xs font-poppins-bold uppercase tracking-wider text-neutral-400">
                    {config.label} Lesson
                  </Text>
                  <Text className="text-xl font-poppins-bold text-[#111827]">
                    {lesson.title}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center active:opacity-75"
              >
                <Feather name="x" size={18} color="#4B4B4B" />
              </TouchableOpacity>
            </View>

            {/* Lesson Info Badges */}
            <View className="flex-row items-center gap-3 my-5">
              <View className="bg-neutral-100 px-4 py-2.5 rounded-2xl flex-row items-center border border-neutral-200">
                <Feather
                  name="clock"
                  size={14}
                  color="#6B7280"
                  className="mr-1.5"
                />
                <Text className="text-xs font-poppins-bold text-neutral-600">
                  {lesson.durationMinutes} Minutes
                </Text>
              </View>
              <View className="bg-[#FFFDF4] px-4 py-2.5 rounded-2xl flex-row items-center border border-[#FFD97D]/50">
                <Feather
                  name="zap"
                  size={14}
                  color="#FF9F43"
                  className="mr-1.5"
                />
                <Text className="text-xs font-poppins-bold text-[#FF9F43]">
                  +{lesson.xpReward} XP Reward
                </Text>
              </View>
            </View>

            {/* Goals Section */}
            <View className="mb-6">
              <Text className="text-sm font-poppins-bold text-neutral-400 uppercase tracking-wider mb-2">
                Learning Goals
              </Text>
              {lesson.goals.map((goal, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <View className="w-5 h-5 rounded-full bg-[#E8F8F5] items-center justify-center mr-2 border border-[#A2E8DD]">
                    <Feather name="check" size={12} color="#10B981" />
                  </View>
                  <Text className="text-sm font-poppins text-[#111827] flex-1">
                    {goal}
                  </Text>
                </View>
              ))}
            </View>

            {/* Vocabulary Words (if any) */}
            {lesson.vocabulary && lesson.vocabulary.length > 0 && (
              <View className="mb-6">
                <Text className="text-sm font-poppins-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Vocabulary Preview
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  className="-mx-2 px-2"
                >
                  {lesson.vocabulary.map((vocab, index) => (
                    <View
                      key={index}
                      style={[styles.card, styles.vocabCard]}
                      className="bg-[#FAFAFA] p-4 mr-3 rounded-2xl min-w-[150px] items-center"
                    >
                      <Text className="text-lg font-poppins-bold text-[#5B4CFA] text-center">
                        {vocab.word}
                      </Text>
                      {vocab.pronunciation && (
                        <Text className="text-xs font-poppins text-[#777777] mt-0.5 text-center italic">
                          /{vocab.pronunciation}/
                        </Text>
                      )}
                      <Text className="text-sm font-poppins-bold text-[#111827] mt-2 text-center">
                        {vocab.translation}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Phrases Section (if any) */}
            {lesson.phrases && lesson.phrases.length > 0 && (
              <View className="mb-8">
                <Text className="text-sm font-poppins-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Key Phrases
                </Text>
                {lesson.phrases.map((phrase, index) => (
                  <View
                    key={index}
                    style={styles.card}
                    className="bg-[#FAFAFA] p-4 mb-2 rounded-2xl"
                  >
                    <Text className="text-base font-poppins-bold text-[#111827]">
                      {phrase.phrase}
                    </Text>
                    <Text className="text-sm font-poppins text-neutral-600 mt-1">
                      {phrase.translation}
                    </Text>
                    {phrase.context && (
                      <Text className="text-[10px] font-poppins text-neutral-400 mt-1 italic">
                        Context: {phrase.context}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Bottom Action buttons */}
            <View className="flex-row items-center gap-3 mt-4">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 py-4 border border-neutral-200 rounded-2xl items-center active:opacity-70"
              >
                <Text className="text-base font-poppins-bold text-neutral-600">
                  Close
                </Text>
              </TouchableOpacity>

              <View className="flex-[2]">
                <PrimaryButton
                  label={isCompleted ? "Practice Again" : "Start Lesson"}
                  onPress={() => onStart(lesson.id)}
                  color={baseColor || "#5B4CFA"}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#E5E5E5",
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    maxHeight: "85%",
  },
  vocabCard: {
    borderColor: "#E5E5E5",
    borderBottomWidth: 3,
  },
});
