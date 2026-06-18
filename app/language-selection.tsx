import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants/images";
import { languages } from "../data/languages";
import { useLanguageStore } from "../store/useLanguageStore";
import { posthog } from "../lib/posthog";

const getLearnerCount = (id: string): string => {
  const custom: Record<string, string> = {
    es: "28.4M learners",
    fr: "19.4M learners",
    ja: "12.7M learners",
    en: "52.1M learners",
    zh: "35.6M learners",
    de: "14.2M learners",
    ko: "10.8M learners",
    it: "8.3M learners",
    ru: "7.1M learners",
    pt: "6.5M learners",
  };
  if (custom[id]) return custom[id];

  // Deterministic generator based on characters of the ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const count = (Math.abs(hash) % 50) / 10 + 1.2;
  return `${count.toFixed(1)}M learners`;
};

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { selectedLanguageId, setSelectedLanguageId } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedId, setTempSelectedId] = useState<string | null>(
    selectedLanguageId
  );

  useEffect(() => {
    setTempSelectedId(selectedLanguageId);
  }, [selectedLanguageId]);

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (tempSelectedId) {
      const lang = languages.find((l) => l.id === tempSelectedId);
      setSelectedLanguageId(tempSelectedId);

      // Track language selection in PostHog
      posthog.capture("language_selected", {
        language_code: tempSelectedId,
        language_name: lang?.name || "",
      });

      router.push("/");
    }
  };

  const isConfirmDisabled = !tempSelectedId;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-neutral-100">
        {selectedLanguageId ? (
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full active:opacity-70"
          >
            <Feather name="chevron-left" size={28} color="#4B4B4B" />
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}

        <Text className="text-xl font-poppins-bold text-[#111827] text-center">
          Choose a language
        </Text>

        {/* Right spacer to perfectly center the title */}
        <View className="w-10" />
      </View>

      {/* Main Content Area */}
      <View className="flex-1 px-6 pt-6">
        {/* Search Bar */}
        <View className="flex-row items-center bg-neutral-100 px-4 py-3 rounded-2xl mb-6 border border-neutral-200">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search languages"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-base font-poppins text-[#111827] py-0"
            style={styles.textInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Scrollable List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text className="text-lg font-poppins-bold text-[#111827] mb-4">
            Popular
          </Text>

          {filteredLanguages.length === 0 ? (
            <View className="items-center justify-center py-10">
              <Text className="text-neutral-500 font-poppins text-base text-center">
                No languages found matching &quot;{searchQuery}&quot;
              </Text>
            </View>
          ) : (
            filteredLanguages.map((lang) => {
              const isSelected = tempSelectedId === lang.id;
              return (
                <TouchableOpacity
                  key={lang.id}
                  onPress={() => setTempSelectedId(lang.id)}
                  style={[
                    styles.card,
                    isSelected ? styles.cardSelected : styles.cardUnselected,
                  ]}
                  className="flex-row items-center justify-between p-4 mb-4 rounded-2xl"
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center">
                    {/* Flag Container */}
                    <View className="w-12 h-12 rounded-full bg-neutral-50 items-center justify-center mr-4 border border-neutral-200 overflow-hidden">
                      {lang.flag.includes('http') ? (
                        <Image source={{ uri: lang.flag }} style={{ width: 32, height: 32, borderRadius: 16 }} resizeMode="cover" />
                      ) : (
                        <Text className="text-2xl" style={styles.flagText}>
                          {lang.flag}
                        </Text>
                      )}
                    </View>

                    {/* Language Info */}
                    <View>
                      <Text className="text-base font-poppins-bold text-[#111827]">
                        {lang.name}
                      </Text>
                      <Text className="text-xs font-poppins text-[#6B7280] mt-0.5">
                        {getLearnerCount(lang.id)}
                      </Text>
                    </View>
                  </View>

                  {/* Right side Selection Indicator */}
                  {isSelected ? (
                    <View className="bg-[#5B4CFA] w-6 h-6 rounded-full items-center justify-center">
                      <Feather name="check" size={14} color="white" />
                    </View>
                  ) : (
                    <Feather name="chevron-right" size={20} color="#AFAFAF" />
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* Bottom Container */}
      <View className="w-full pt-2 items-center">
        {/* Continue Button Wrapper */}
        <View className="w-full px-6 mb-2">
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={isConfirmDisabled}
            style={[
              styles.continueButton,
              isConfirmDisabled ? styles.buttonDisabled : styles.buttonEnabled,
            ]}
            className="w-full py-4 rounded-2xl items-center shadow-sm"
            activeOpacity={0.9}
          >
            <Text
              className="font-poppins-bold text-lg text-center uppercase tracking-wider"
              style={isConfirmDisabled ? styles.textDisabled : styles.textEnabled}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>

        {/* Earth Mascot Image */}
        <Image
          source={images.earth}
          style={styles.earthImage}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  textInput: {
    outlineStyle: "none",
  } as any,
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  cardUnselected: {
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },
  cardSelected: {
    borderColor: "#5B4CFA",
    backgroundColor: "#F3F2FF",
  },
  flagText: {
    // Emojis need careful vertical alignment on some platforms
    textAlign: "center",
    lineHeight: 32,
  },
  continueButton: {
    width: "100%",
  },
  buttonEnabled: {
    backgroundColor: "#5B4CFA",
  },
  buttonDisabled: {
    backgroundColor: "#E5E5E5",
  },
  textEnabled: {
    color: "#FFFFFF",
  },
  textDisabled: {
    color: "#AFAFAF",
  },
  earthImage: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
  },
});
