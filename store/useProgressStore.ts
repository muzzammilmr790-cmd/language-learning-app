import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProgressState {
  xp: number;
  dailyXpGoal: number;
  streak: number;
  completedLessonIds: string[];
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, xpReward: number) => void;
  setDailyXpGoal: (goal: number) => void;
  incrementStreak: () => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      xp: 15, // Starting value matching design
      dailyXpGoal: 20, // Daily goal matching design
      streak: 12, // Starting streak matching design
      completedLessonIds: [], // Start with no completed lessons
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      completeLesson: (lessonId, xpReward) =>
        set((state) => {
          if (state.completedLessonIds.includes(lessonId)) return {};
          return {
            completedLessonIds: [...state.completedLessonIds, lessonId],
            xp: state.xp + xpReward,
          };
        }),
      setDailyXpGoal: (goal) => set({ dailyXpGoal: goal }),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
      resetProgress: () =>
        set({
          xp: 15,
          dailyXpGoal: 20,
          streak: 12,
          completedLessonIds: [],
        }),
    }),
    {
      name: "progress-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
