import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "../types/learning";
import { languages } from "../data/languages";

interface LanguageState {
  selectedLanguageId: string | null;
  setSelectedLanguageId: (id: string | null) => void;
  getSelectedLanguage: () => Language | null;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      selectedLanguageId: null,
      setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
      getSelectedLanguage: () => {
        const { selectedLanguageId } = get();
        if (!selectedLanguageId) return null;
        return languages.find((lang) => lang.id === selectedLanguageId) || null;
      },
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
