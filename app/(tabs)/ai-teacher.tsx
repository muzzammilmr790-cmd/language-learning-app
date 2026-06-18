import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatMessage } from "../../components/ChatMessage";
import { images } from "../../constants/images";
import { languages } from "../../data/languages";
import { useLanguageStore } from "../../store/useLanguageStore";
import { Message } from "../../types/chat";

const tutorNames: Record<string, string> = {
  es: "Juan 🇪🇸",
  fr: "Pierre 🇫🇷",
  de: "Lukas 🇩🇪",
  ja: "Sakura 🇯🇵",
  en: "Sarah 🇺🇸",
  ko: "Min-ji 🇰🇷",
  zh: "Mei 🇨🇳",
  it: "Giovanni 🇮🇹",
};

const getTutorName = (langId: string | null, langName: string) => {
  if (!langId) return "AI Tutor";
  return tutorNames[langId] || `${langName} Tutor`;
};

const getInitialGreeting = (langId: string | null, langName: string) => {
  switch (langId) {
    case "es":
      return "¡Hola! (Hello!) I am Juan, your Spanish tutor. I am so excited to practice with you today! How are you doing? (¿Cómo estás?)";
    case "fr":
      return "Bonjour! (Hello!) I am Pierre, your French tutor. Welcome! Let's start learning. Can you repeat: 'Bonjour' (Hello)?";
    case "de":
      return "Hallo! (Hello!) I am Lukas, your German tutor. It is great to meet you. Can you say: 'Guten Tag' (Good day)?";
    case "ja":
      return "Konnichiwa! (Hello!) I am Sakura, your Japanese tutor. Let's learn together. Please say: 'Konnichiwa' (Hello/Good afternoon)!";
    case "en":
      return "Hello! I am Sarah, your English tutor. Welcome! How can I help you learn English today?";
    default:
      return `Hello! I am your AI ${langName} tutor. Let's practice speaking and writing together!`;
  }
};

const getLocalMockTranslation = (text: string, langId: string | null, langName: string) => {
  const normalized = text.toLowerCase().trim();

  // Spanish mocks
  if (langId === "es") {
    if (normalized.includes("¡hola! (hello!) i am juan")) return "Hello! I am Juan, your Spanish tutor. I am so excited to practice with you today! How are you doing?";
    if (normalized.includes("hola") || normalized.includes("hello")) return "Hello!";
    if (normalized.includes("cómo estás") || normalized.includes("como estas")) return "How are you?";
    if (normalized.includes("estoy muy bien")) return "I am doing very well, thank you!";
    if (normalized.includes("gracias")) return "Thank you";
    if (normalized.includes("por favor")) return "Please";
    if (normalized.includes("adiós")) return "Goodbye";
  }

  // French mocks
  if (langId === "fr") {
    if (normalized.includes("bonjour")) return "Hello / Good morning";
    if (normalized.includes("merci")) return "Thank you";
    if (normalized.includes("s’il vous plaît") || normalized.includes("sil vous plait")) return "Please";
    if (normalized.includes("au revoir")) return "Goodbye";
  }

  // Japanese mocks
  if (langId === "ja") {
    if (normalized.includes("こんにちは") || normalized.includes("konnichiwa")) return "Hello / Good afternoon";
    if (normalized.includes("ありがとう") || normalized.includes("arigatou")) return "Thank you";
    if (normalized.includes("さようなら") || normalized.includes("sayounara")) return "Goodbye";
    if (normalized.includes("おはよう") || normalized.includes("ohayou")) return "Good morning";
  }

  // Default translation strategy for demo mode
  return `[Demo Translation] "${text}" translated between English and ${langName}.`;
};

const getLocalMockResponse = (userText: string, langId: string | null, langName: string) => {
  const text = userText.toLowerCase().trim();
  const name = getTutorName(langId, langName).split(" ")[0];

  if (langId === "es") {
    if (text.includes("hola") || text.includes("hello")) {
      return `¡Hola! (Hello!) It is so nice to chat. Let's practice. Can you say: 'Gracias, Señor ${name}' (Thank you, Sir ${name})?`;
    }
    if (text.includes("gracias") || text.includes("thank")) {
      return "¡De nada! (You are welcome!) You are doing great. Try asking me: '¿Cómo estás?' (How are you?)";
    }
    if (text.includes("cómo estás") || text.includes("como estas") || text.includes("how are you")) {
      return "Estoy muy bien, ¡gracias! (I am doing very well, thank you!) Now, let's practice saying goodbye: 'Adiós' (Goodbye)!";
    }
    return "¡Excelente! (Excellent!) Let's keep practicing. Try saying: 'Por favor' (Please).";
  }

  if (langId === "fr") {
    if (text.includes("bonjour") || text.includes("hello")) {
      return "Bonjour! (Hello!) Great job. Can you try saying: 'Merci beaucoup' (Thank you very much)?";
    }
    if (text.includes("merci") || text.includes("thank")) {
      return "De rien! (You're welcome!) Now, let's try saying: 'S’il vous plaît' (Please).";
    }
    return "Trés bien! (Very well!) Let's keep practicing basic greetings together!";
  }

  if (langId === "ja") {
    if (text.includes("konnichiwa") || text.includes("hello")) {
      return "Konnichiwa! (Hello!) Fantastic pronunciation. Can you repeat: 'Arigatou' (Thank you)?";
    }
    if (text.includes("arigatou") || text.includes("thank")) {
      return "Douいたしまして (You're welcome!) Next, try saying: 'Sayounara' (Goodbye)!";
    }
    return "Subarashii! (Wonderful!) Let's practice greeting people in the morning: 'Ohayou' (Good morning)!";
  }

  return `Great! Keep practicing. (Demo Mode: To get full AI responses, configure EXPO_PUBLIC_GEMINI_API_KEY in your .env file).`;
};

async function fetchGeminiResponse(userMessage: string, history: Message[], langName: string) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.replace(/['"]/g, "");
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const systemPrompt = `You are a warm, human, energetic, and lesson-focused language teacher for the language "${langName}".
Your goals:
- Act like a real-world friendly tutor.
- Encourage the student.
- Write short, conversational responses (1 or 2 sentences max).
- Introduce target-language words slowly with translations in parentheses.
- Keep the language at a beginner level.
- Mostly speak in English, but use the target language in your greetings, simple sentences, and vocabulary practice.
- Ask the student to repeat words, translate short phrases, or reply to simple questions.`;

  const formattedHistory = [
    { role: "user", parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt}` }] },
    { role: "model", parts: [{ text: "Understood. I will act as the language tutor." }] },
    ...history
      .filter((msg) => msg.id !== "greeting")
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }))
  ];

  formattedHistory.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: formattedHistory,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error("Gemini API error response:", errorDetails);
    let errorMsg = "Gemini request failed";
    try {
      const parsed = JSON.parse(errorDetails);
      errorMsg = parsed.error?.message || errorMsg;
    } catch { }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const replyText =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that. Could you try again?";
  return replyText.trim();
}

async function fetchGeminiTranslation(text: string, langName: string) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.replace(/['"]/g, "");
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const prompt = `You are a professional translator. Translate the following text.
If the text is in English, translate it to "${langName}".
If the text is in any other language (such as ${langName}), translate it to English.
Provide ONLY the raw translation with no quotes, no explanations, no extra characters.
Text: "${text}"`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.1,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Translation request failed");
  }

  const data = await response.json();
  const translation = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return translation.trim();
}

const getTimeUntilReset = () => {
  const now = new Date();
  const ptString = now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const ptDate = new Date(ptString);
  const nextMidnight = new Date(ptDate);
  nextMidnight.setHours(24, 0, 0, 0);
  const diffMs = nextMidnight.getTime() - ptDate.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export default function AiTeacherScreen() {
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const selectedLanguage = languages.find((lang) => lang.id === selectedLanguageId) || languages[0];
  const languageName = selectedLanguage?.name || "Spanish";
  const languageId = selectedLanguage?.id || "es";
  const languageColor = selectedLanguage?.baseColor || "#1CB0F6";
  const tutorName = getTutorName(languageId, languageName).split(" ")[0];

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Check if API key is present in .env
  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.replace(/['"]/g, "");
    setHasApiKey(!!apiKey);
  }, []);

  // Initialize/Reset conversation when language changes
  useEffect(() => {
    const initialGreeting = getInitialGreeting(languageId, languageName);
    setMessages([
      {
        id: "greeting",
        role: "model",
        text: initialGreeting,
        timestamp: new Date(),
      },
    ]);
  }, [languageId, languageName]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText("");
    Keyboard.dismiss();

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: "user",
      text: userText,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      let replyText = "";
      if (hasApiKey) {
        try {
          replyText = await fetchGeminiResponse(userText, messages, languageName);
        } catch (apiError: any) {
          const errMsg = apiError.message?.toLowerCase() || "";
          if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("rate limit")) {
            console.warn("API quota exceeded, returning limit reset message.");
            const resetTime = getTimeUntilReset();
            replyText = `You have reached the free tier quota. Please try again in a minute, or wait until the daily limit resets in ${resetTime}.`;
          } else {
            throw apiError;
          }
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        replyText = getLocalMockResponse(userText, languageId, languageName);
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: "model",
        text: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("AI response failed:", error);
      Alert.alert("Mobile Debug", `Error: ${error.message || JSON.stringify(error)}`);
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: "model",
        text: `AI Error: ${error.message || error}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleTranslate = async (msgId: string) => {
    const message = messages.find((m) => m.id === msgId);
    if (!message || message.isTranslating) return;

    // Toggle if translation already exists
    if (message.translation) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, showTranslation: !m.showTranslation } : m))
      );
      return;
    }

    // Mark as translating
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, isTranslating: true } : m))
    );

    try {
      let translationText = "";
      if (hasApiKey) {
        try {
          translationText = await fetchGeminiTranslation(message.text, languageName);
        } catch (apiError: any) {
          const errMsg = apiError.message?.toLowerCase() || "";
          if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("rate limit")) {
            console.warn("API quota exceeded, returning limit reset message.");
            const resetTime = getTimeUntilReset();
            translationText = `You have reached the free tier quota. Please try again in a minute, or wait until the daily limit resets in ${resetTime}.`;
          } else {
            throw apiError;
          }
        }
      } else {
        // Fallback translation locally
        await new Promise((resolve) => setTimeout(resolve, 800));
        translationText = getLocalMockTranslation(message.text, languageId, languageName);
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? { ...m, translation: translationText, showTranslation: true, isTranslating: false }
            : m
        )
      );
    } catch (err) {
      console.error("Translation failed:", err);
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, isTranslating: false } : m))
      );
    }
  };

  const handleReset = () => {
    const initialGreeting = getInitialGreeting(languageId, languageName);
    setMessages([
      {
        id: Date.now().toString(),
        role: "model",
        text: initialGreeting,
        timestamp: new Date(),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Message }) => {
    return (
      <ChatMessage
        item={item}
        languageColor={languageColor}
        onTranslate={handleTranslate}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ flex: 1, backgroundColor: 'white' }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white">
        <View className="flex-row items-center">
          <View className="relative">
            <Image
              source={images.mascotWelcome}
              className="rounded-full bg-[#E6F4FE] border border-neutral-200"
              style={{ width: 48, height: 48 }}
              resizeMode="contain"
            />
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-[#58CC02] border-2 border-white rounded-full" />
          </View>
          <View className="ml-3">
            <Text className="text-lg font-poppins-bold text-[#111827]">
              {getTutorName(languageId, languageName)}
            </Text>
            <Text className="text-xs font-poppins text-[#58CC02]">
              {hasApiKey ? "Online (Gemini AI)" : "Online (Demo Mode)"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleReset}
          className="p-2 rounded-full active:bg-neutral-100"
          accessibilityLabel="Reset conversation"
        >
          <Feather name="refresh-cw" size={20} color="#777777" />
        </TouchableOpacity>
      </View>

      {/* API Key Banner Notice */}
      {!hasApiKey && (
        <View className="bg-yellow-50 px-4 py-2 border-b border-yellow-100 flex-row items-center justify-center">
          <Feather name="info" size={14} color="#D97706" />
          <Text className="text-xs text-[#D97706] font-poppins ml-2 text-center">
            Demo Mode. Add <Text className="font-poppins-bold">EXPO_PUBLIC_GEMINI_API_KEY</Text> in `.env` for live AI translations!
          </Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 24, flexGrow: 1 }}
          className="flex-1 bg-[#F9FAFB]"
          style={{ flex: 1 }}
        />

        {/* Typing Indicator */}
        {isLoading && (
          <View className="flex-row items-center px-4 py-2 bg-[#F9FAFB]">
            <Image
              source={images.mascotWelcome}
              className="rounded-full mr-2 bg-[#E6F4FE]"
              style={{ width: 32, height: 32 }}
              resizeMode="contain"
            />
            <View className="bg-[#F3F4F6] rounded-2xl px-4 py-2.5 flex-row items-center">
              <Text className="text-sm font-poppins text-neutral-500 mr-2">
                Typing
              </Text>
              <ActivityIndicator size="small" color={languageColor} />
            </View>
          </View>
        )}
        {/* Message Input */}
        <View className="flex-row items-center px-4 py-3 border-t border-neutral-100 bg-white">
          <TextInput
            placeholder={`  Message ${tutorName}...`}
            value={inputText}
            onChangeText={setInputText}
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3 text-base font-poppins text-neutral-800"
            style={{ maxHeight: 120, textAlignVertical: "center" }}
            multiline
            placeholderTextColor="#AFAFAF"
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
            style={{
              backgroundColor: inputText.trim() && !isLoading ? languageColor : "#E5E5E5",
            }}
            className="w-12 h-12 rounded-full items-center justify-center ml-3 active:opacity-90"
          >
            <Feather name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
