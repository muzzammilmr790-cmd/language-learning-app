import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../components/PrimaryButton";

import { images } from "../constants/images";
import { languages } from "../data/languages";
import { lessons } from "../data/lessons";
import { posthog } from "../lib/posthog";
import { useLanguageStore } from "../store/useLanguageStore";
import { useProgressStore } from "../store/useProgressStore";

interface DialogueTurn {
  aiText: string;
  aiTranslation: string;
  userPrompt: string;
  type: "intro" | "vocab" | "phrase" | "outro";
  expectedResponse?: string;
}

interface CaptionMessage {
  id: string;
  role: "user" | "model";
  text: string;
  translation?: string;
  timestamp: Date;
}

const langLocales: Record<string, string> = {
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  ja: "ja-JP",
  en: "en-US",
  ko: "ko-KR",
  zh: "zh-CN",
  it: "it-IT",
};

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

// Request dynamic response from Gemini API in JSON format
async function fetchGeminiAudioLessonResponse(
  userText: string,
  history: CaptionMessage[],
  langName: string,
  lesson: any,
  tutorName: string,
  expectedText: string
) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.replace(/['"]/g, "");
  if (!apiKey) throw new Error("API Key not found");

  const systemPrompt = `You are a warm, human, energetic, and highly supportive language teacher named "${tutorName}". You are teaching the language "${langName}".
You are conducting an interactive, voice-only audio lesson.

Your teaching persona:
- Warm, human, energetic, and passionate about teaching.
- Use natural spoken English with contractions (e.g., "let's", "you're", "don't").
- Provide gentle encouragement (e.g., "Great job!", "You're doing amazing!", "Let's try that one more time!").
- Speak mostly in English. Introduce target-language words slowly, always putting their English translations in parentheses next to them.
- Keep your replies short and conversational—strictly one or two sentences max. Never give long explanations or list multiple bullet points.

Your lesson constraints:
- Stay strictly within the current lesson's title, goals, target vocabulary, and target phrases.
- Lesson Title: "${lesson.title}"
- Lesson Goals: ${JSON.stringify(lesson.goals)}
- Target Vocabulary: ${JSON.stringify(lesson.vocabulary)}
- Target Phrases: ${JSON.stringify(lesson.phrases)}
- Lesson Context: "${lesson.aiTeacherPrompt || ""}"
- Do NOT teach unrelated topics. Do NOT teach vocabulary or phrases outside of this lesson.
- Stay in character as a teacher of "${langName}". Do NOT switch to teaching other languages.

Your lesson flow and interaction logic:
1. Compare the user's spoken response ("${userText}") with the expected target response ("${expectedText}").
2. Evaluate their response:
   - If they made a pronunciation or spelling mistake, said a completely different word, or if their response does not match the expected target response ("${expectedText}"), you MUST correct their mistake. Give them a speakingScore/pronunciationScore/grammarScore of "Needs Practice" or "Good", explain their mistake/give them a helpful suggestion, and gently ask them to repeat the target word/phrase or try again (e.g., "Let's try that again, say...").
   - If they did well and correctly repeated/stated the expected response, give a high score ("Great" or "Excellent"), offer warm praise, and guide them to the next vocabulary word or phrase in the lesson (select from the target vocabulary/phrases list).
3. Track lesson completion:
   - When the user has successfully practiced and repeated all target vocabulary and phrases in the lesson, set "isLessonComplete" to true in your JSON output, and give a warm, enthusiastic final wrap-up message.

You MUST respond ONLY with a JSON object matching this schema (do not output any other text or markdown):
{
  "aiText": "Your spoken response in English/target language mix (one or two sentences max). Put target language translations in parentheses, e.g., 'Let's try saying hello: Hola (Hello)!'",
  "aiTranslation": "English translation of target-language portions of your response.",
  "speakingScore": "Excellent" | "Great" | "Good" | "Needs Practice",
  "pronunciationScore": "Excellent" | "Great" | "Good" | "Needs Practice",
  "grammarScore": "Excellent" | "Great" | "Good" | "Needs Practice",
  "isLessonComplete": true | false
}`;

  const formattedHistory = history.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  formattedHistory.push({
    role: "user",
    parts: [{ text: userText }],
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: formattedHistory,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini API error:", errText);
    let errMsg = "Request to Gemini failed";
    try {
      const parsed = JSON.parse(errText);
      errMsg = parsed.error?.message || errMsg;
    } catch { }
    throw new Error(errMsg);
  }

  const data = await response.json();
  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  try {
    let cleanedText = replyText.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
    }
    return JSON.parse(cleanedText.trim());
  } catch (e) {
    console.error("Failed to parse Gemini JSON output:", replyText);
    return {
      aiText: replyText || "Excellent! Let's continue our lesson.",
      aiTranslation: "¡Excelente! Continuemos nuestra lección.",
      speakingScore: "Excellent",
      pronunciationScore: "Great",
      grammarScore: "Great",
      isLessonComplete: false
    };
  }
}

// Fallback dynamic mock generator if API key is not present
const getMockAudioLessonResponse = (
  userText: string,
  langId: string,
  lesson: any,
  turnCount: number,
  expectedText: string
) => {
  const vocab = lesson.vocabulary || [];
  const phrases = lesson.phrases || [];
  const randScore = () => Math.random() > 0.3 ? "Excellent" : "Great";

  const clean = (str: string) => str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?¿¡]/g, "").trim();
  const isCorrect = clean(userText) === clean(expectedText);

  const vocabIndex = Math.min(turnCount - 1, vocab.length - 1);
  const nextVocab = vocab[vocabIndex + 1] || phrases[0];

  if (!isCorrect) {
    return {
      aiText: `Not quite! You said "${userText}", but we are trying to practice "${expectedText}". Let's try that one more time! Say: "${expectedText}".`,
      aiTranslation: `No del todo. Dijiste "${userText}", pero estamos practicando "${expectedText}".`,
      speakingScore: "Needs Practice",
      pronunciationScore: "Good",
      grammarScore: "Needs Practice",
      isLessonComplete: false,
    };
  }

  if (turnCount >= 4 || (!nextVocab && turnCount >= 2)) {
    return {
      aiText: "¡Excelente! You've practiced all the target words and phrases for this session. You did a wonderful job!",
      aiTranslation: "¡Excelente! Has practicado todas las palabras y frases de esta sesión. ¡Hiciste un trabajo maravilloso!",
      speakingScore: "Excellent",
      pronunciationScore: "Excellent",
      grammarScore: "Excellent",
      isLessonComplete: true,
    };
  }

  return {
    aiText: `Good job! You said "${userText}". Let's practice the next one: "${nextVocab?.word || nextVocab?.phrase || "Adiós"}". Repeat it!`,
    aiTranslation: `¡Buen trabajo! Practiquemos el siguiente: "${nextVocab?.word || nextVocab?.phrase || "Adiós"}".`,
    speakingScore: randScore(),
    pronunciationScore: randScore(),
    grammarScore: Math.random() > 0.4 ? "Excellent" : "Good",
    isLessonComplete: false,
  };
};

export default function AudioLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { completeLesson, streak } = useProgressStore();
  const { getSelectedLanguage } = useLanguageStore();

  const lesson = lessons.find((l) => l.id === id) || lessons[0];
  const selectedLanguage =
    getSelectedLanguage() ||
    languages.find((lang) => lang.id === lesson.id.split("-")[0]) ||
    languages[0];

  const tutorName = tutorNames[selectedLanguage.id] || `${selectedLanguage.name} Teacher`;

  // Control Toggles
  const [micEnabled, setMicEnabled] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);

  // Lesson States
  const [lessonState, setLessonState] = useState<"intro" | "learning" | "outro" | "completed">("intro");
  const [interactionState, setInteractionState] = useState<"idle" | "listening" | "analyzing" | "success">("idle");
  const [agentStatus, setAgentStatus] = useState<"idle" | "connecting" | "connected" | "failed">("idle");
  const [userSpokenText, setUserSpokenText] = useState("");

  // Live Captions Transcript History
  const [messages, setMessages] = useState<CaptionMessage[]>([]);



  // Performance Scores (simulated real-time stats)
  const [speakingScore, setSpeakingScore] = useState("---");
  const [pronunciationScore, setPronunciationScore] = useState("---");
  const [grammarScore, setGrammarScore] = useState("---");

  // Animations
  const micPulseAnim = useRef(new Animated.Value(1)).current;
  const greenDotPulseAnim = useRef(new Animated.Value(1)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  const micScaleAnim = useRef(new Animated.Value(1)).current;

  // Avatar Animations
  const avatarTranslateY = useRef(new Animated.Value(0)).current;
  const avatarRotation = useRef(new Animated.Value(0)).current;
  const avatarScale = useRef(new Animated.Value(1)).current;
  const idleAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const speakingAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const listeningAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  // Wave bar animations for speaker
  const waveAnim1 = useRef(new Animated.Value(5)).current;
  const waveAnim2 = useRef(new Animated.Value(5)).current;
  const waveAnim3 = useRef(new Animated.Value(5)).current;
  const waveAnim4 = useRef(new Animated.Value(5)).current;
  const [isSpeakerPlaying, setIsSpeakerPlaying] = useState(false);

  // Web Speech Refs
  const recognitionTimeoutRef = useRef<any>(null);
  const turnCountRef = useRef(0);
  const hasApiKey = !!process.env.EXPO_PUBLIC_GEMINI_API_KEY?.replace(/['"]/g, "");
  const isCompletedRef = useRef(false);

  // Clean up agent speech synthesis, recognition and timeouts
  const cleanupAgentSession = () => {
    setAgentStatus("idle");
    setInteractionState("idle");
    Speech.stop();
    if (typeof window !== "undefined") {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch (e) {
      console.warn("Failed to stop recognition during cleanup:", e);
    }
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
      recognitionTimeoutRef.current = null;
    }
  };


  // Active Current Turn Dialogue State
  const [currentTurn, setCurrentTurn] = useState<DialogueTurn>({
    aiText: `Welcome to your lesson! Today we are practicing "${lesson.title}". Let's get started!`,
    aiTranslation: "¡Bienvenido a tu lección! Hoy practicaremos. ¡Empecemos!",
    userPrompt: "Tap the Mic below to answer my greetings.",
    type: "intro",
  });

  // Track page load in PostHog & handle abandonment cleanup
  useEffect(() => {
    const startTime = Date.now();
    posthog.capture("lesson_started", {
      lesson_id: lesson.id,
      language: selectedLanguage.name,
      lesson_number: lesson.order || 1,
    });

    return () => {
      cleanupAgentSession();
      if (!isCompletedRef.current) {
        const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
        posthog.capture("lesson_abandoned", {
          lesson_id: lesson.id,
          time_into_lesson_seconds: durationSeconds,
          last_question_index: turnCountRef.current,
        });
      }
    };
  }, [lesson]);

  // Green dot pulsing animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(greenDotPulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(greenDotPulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Mic Ripple animations when listening
  useEffect(() => {
    let anim: Animated.CompositeAnimation | null = null;
    if (interactionState === "listening") {
      ripple1.setValue(0);
      ripple2.setValue(0);
      ripple3.setValue(0);

      const createRippleAnim = (val: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(val, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        );
      };

      anim = Animated.parallel([
        createRippleAnim(ripple1, 0),
        createRippleAnim(ripple2, 600),
        createRippleAnim(ripple3, 1200),
      ]);
      anim.start();
    } else {
      ripple1.setValue(0);
      ripple2.setValue(0);
      ripple3.setValue(0);
    }
    return () => {
      if (anim) anim.stop();
    };
  }, [interactionState]);

  // Dynamic Avatar Animations
  useEffect(() => {
    idleAnimRef.current?.stop();
    speakingAnimRef.current?.stop();
    listeningAnimRef.current?.stop();

    Animated.parallel([
      Animated.spring(avatarTranslateY, { toValue: 0, useNativeDriver: true }),
      Animated.spring(avatarRotation, { toValue: 0, useNativeDriver: true }),
      Animated.spring(avatarScale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    if (isSpeakerPlaying) {
      speakingAnimRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(avatarScale, { toValue: 1.05, duration: 150, useNativeDriver: true }),
          Animated.timing(avatarScale, { toValue: 0.95, duration: 150, useNativeDriver: true }),
        ])
      );
      speakingAnimRef.current.start();
    } else if (interactionState === "listening") {
      listeningAnimRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(avatarRotation, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(avatarRotation, { toValue: -1, duration: 1000, useNativeDriver: true }),
          Animated.timing(avatarRotation, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      );
      listeningAnimRef.current.start();
    } else if (interactionState === "analyzing") {
      listeningAnimRef.current = Animated.loop(
        Animated.sequence([
           Animated.timing(avatarRotation, { toValue: 0.5, duration: 100, useNativeDriver: true }),
           Animated.timing(avatarRotation, { toValue: -0.5, duration: 100, useNativeDriver: true })
        ])
      );
      listeningAnimRef.current.start();
    } else {
      idleAnimRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(avatarTranslateY, { toValue: -10, duration: 1500, useNativeDriver: true }),
          Animated.timing(avatarTranslateY, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      );
      idleAnimRef.current.start();
    }
    
    return () => {
      idleAnimRef.current?.stop();
      speakingAnimRef.current?.stop();
      listeningAnimRef.current?.stop();
    }
  }, [interactionState, isSpeakerPlaying]);

  const animateMicPress = () => {
    Animated.sequence([
      Animated.timing(micScaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(micScaleAnim, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(micScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getRippleStyle = (animValue: Animated.Value) => {
    return {
      transform: [
        {
          scale: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2.2],
          }),
        },
      ],
      opacity: animValue.interpolate({
        inputRange: [0, 0.8, 1],
        outputRange: [0.5, 0.3, 0],
      }),
    };
  };

  // Listen for native speech recognition events using hooks
  useSpeechRecognitionEvent("start", () => {
    setInteractionState("listening");
  });

  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript;
    if (transcript) {
      processUserResponse(transcript);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.warn("Speech recognition error:", event.error);
    stopSpeechRecognitionSimulated();
  });

  useSpeechRecognitionEvent("end", () => {
    setInteractionState((prev) => (prev === "listening" ? "idle" : prev));
  });

  // Text-To-Speech (TTS) voice generation using expo-speech
  const speakText = (text: string, langId: string) => {
    // Stop any ongoing speech
    Speech.stop();

    // Clean brackets, parentheses, translations for clean pronunciation
    const cleaned = text.replace(/\([^)]*\)/g, "").replace(/["']/g, "").trim();
    if (!cleaned) return;

    const lang = langLocales[langId] || "en-US";

    // Set voice animation control
    const animateBar = (val: Animated.Value, max: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: max, duration: 250, useNativeDriver: false }),
          Animated.timing(val, { toValue: 5, duration: 250, useNativeDriver: false }),
        ])
      );
    };

    let loops: Animated.CompositeAnimation | null = null;

    Speech.speak(cleaned, {
      language: lang,
      rate: 0.82, // Slower rate (default is 1.0) for clearer language comprehension
      onStart: () => {
        setIsSpeakerPlaying(true);
        loops = Animated.parallel([
          animateBar(waveAnim1, 24),
          animateBar(waveAnim2, 18),
          animateBar(waveAnim3, 28),
          animateBar(waveAnim4, 16),
        ]);
        loops.start();
      },
      onDone: () => {
        setIsSpeakerPlaying(false);
        if (loops) loops.stop();
        waveAnim1.setValue(5);
        waveAnim2.setValue(5);
        waveAnim3.setValue(5);
        waveAnim4.setValue(5);
      },
      onStopped: () => {
        setIsSpeakerPlaying(false);
        if (loops) loops.stop();
        waveAnim1.setValue(5);
        waveAnim2.setValue(5);
        waveAnim3.setValue(5);
        waveAnim4.setValue(5);
      },
      onError: (err) => {
        console.error("Speech error:", err);
        setIsSpeakerPlaying(false);
        if (loops) loops.stop();
        waveAnim1.setValue(5);
        waveAnim2.setValue(5);
        waveAnim3.setValue(5);
        waveAnim4.setValue(5);
      }
    });
  };

  // Trigger TTS of the initial greeting on mount
  useEffect(() => {
    setAgentStatus("connecting");
    if (!hasApiKey) {
      setAgentStatus("failed");
    }

    // Initialize messages state with the starting AI message!
    const welcomeMsg: CaptionMessage = {
      id: "greeting",
      role: "model",
      text: currentTurn.aiText,
      translation: currentTurn.aiTranslation,
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);

    const timer = setTimeout(() => {
      // SpeechSynthesis voices take a moment to load in browsers
      try {
        speakText(currentTurn.aiText, selectedLanguage.id);
        if (hasApiKey) {
          setAgentStatus("connected");
        }
      } catch (err) {
        console.error("Failed to speak initial greeting:", err);
        setAgentStatus("failed");
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const triggerHaptic = async (style: any) => {
    try {
      if (Platform.OS !== "web") {
        if (Object.values(Haptics.NotificationFeedbackType).includes(style)) {
          await Haptics.notificationAsync(style);
        } else {
          await Haptics.impactAsync(style);
        }
      }
    } catch (e) {
      console.warn("Haptic failed:", e);
    }
  };

  const processUserResponse = async (text: string) => {
    if (!text.trim()) return;

    // Log the turn
    const userMsg: CaptionMessage = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserSpokenText(text.trim());
    setInteractionState("analyzing");
    turnCountRef.current += 1;
    const vocab = lesson.vocabulary || [];
    const phrases = lesson.phrases || [];
    const currentTurnIndex = turnCountRef.current - 1;
    const target = vocab[currentTurnIndex] || phrases[currentTurnIndex - vocab.length] || vocab[0] || phrases[0];
    const expectedText = target ? ((target as any).word || (target as any).phrase) : "";

    try {
      let result;
      if (hasApiKey) {
        try {
          result = await fetchGeminiAudioLessonResponse(
            text.trim(),
            messages,
            selectedLanguage.name,
            lesson,
            tutorName,
            expectedText
          );
        } catch (apiError: any) {
          const errMsg = apiError.message?.toLowerCase() || "";
          if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("rate limit")) {
            console.warn("API quota exceeded, falling back to mock response.");
            Alert.alert("Quota Exceeded", "You have reached the free tier quota. Please come back when the limit resets.");
            await new Promise((resolve) => setTimeout(resolve, 1500));
            result = getMockAudioLessonResponse(text.trim(), selectedLanguage.id, lesson, turnCountRef.current, expectedText);
          } else {
            throw apiError;
          }
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        result = getMockAudioLessonResponse(text.trim(), selectedLanguage.id, lesson, turnCountRef.current, expectedText);
      }

      const botMsg: CaptionMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: result.aiText,
        translation: result.aiTranslation,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Set performance scores
      setSpeakingScore(result.speakingScore);
      setPronunciationScore(result.pronunciationScore);
      setGrammarScore(result.grammarScore);

      setCurrentTurn({
        aiText: result.aiText,
        aiTranslation: result.aiTranslation,
        userPrompt: result.isLessonComplete
          ? "Tap Finish to save your progress and claim XP!"
          : "Tap the Mic below to respond.",
        type: result.isLessonComplete ? "outro" : "phrase",
      });

      if (result.isLessonComplete) {
        setLessonState("outro");
      } else {
        setLessonState("learning");
      }

      setInteractionState("success");
      triggerHaptic(Haptics.NotificationFeedbackType.Success);

      // Play teacher audio
      speakText(result.aiText, selectedLanguage.id);
    } catch (err: any) {
      console.error("AI response fetch failed:", err);
      setInteractionState("idle");
      setAgentStatus("failed");
      Alert.alert("Brain Freeze", `Error: ${err.message || err}`);
    }
  };

  const stopSpeechRecognitionSimulated = () => {
    setInteractionState("idle");

    // Select the target phrase that matches the current turn index
    const vocab = lesson.vocabulary || [];
    const phrases = lesson.phrases || [];
    const currentTurnIndex = turnCountRef.current;

    const target = vocab[currentTurnIndex] || phrases[currentTurnIndex - vocab.length] || vocab[0] || phrases[0] || { word: "Hola" };
    const simulatedText = (target as any).word || (target as any).phrase || "Hola";

    processUserResponse(simulatedText);
  };

  const startSpeechRecognition = async () => {
    try {
      const permissionResult = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Denied",
          "Microphone and speech recognition permissions are required to use this feature."
        );
        stopSpeechRecognitionSimulated();
        return;
      }

      setInteractionState("listening");
      ExpoSpeechRecognitionModule.start({
        lang: langLocales[selectedLanguage.id] || "en-US",
        interimResults: false,
      });
    } catch (err) {
      console.warn("Native speech recognition failed to start, falling back to simulator:", err);
      // Fallback to simulator if native module is not available (e.g. running in standard Expo Go or simulator)
      setInteractionState("listening");
      const timer = setTimeout(() => {
        stopSpeechRecognitionSimulated();
      }, 3500);
      recognitionTimeoutRef.current = timer;
    }
  };

  const handleMicPressIn = () => {
    if (interactionState !== "idle" && interactionState !== "success" && interactionState !== "listening") return;

    Speech.stop();
    setIsSpeakerPlaying(false);

    animateMicPress();
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);

    setUserSpokenText("");
    startSpeechRecognition();
  };

  const handleMicPressOut = () => {
    if (interactionState === "listening") {
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
        recognitionTimeoutRef.current = null;
      }
      try {
        ExpoSpeechRecognitionModule.stop();
      } catch (err) {
        stopSpeechRecognitionSimulated();
      }
    }
  };

  const handleNextTurn = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    setInteractionState("idle");
    setUserSpokenText("");
  };

  const handleFinishLesson = async () => {
    triggerHaptic(Haptics.NotificationFeedbackType.Success);
    isCompletedRef.current = true;

    // Save progress
    completeLesson(lesson.id, lesson.xpReward);

    // Track completed event
    posthog.capture("audio_lesson_completed", {
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      xp_earned: lesson.xpReward,
      speaking_feedback: speakingScore,
      pronunciation_feedback: pronunciationScore,
      grammar_feedback: grammarScore,
    });

    Alert.alert(
      "Congratulations! 🎉",
      `You successfully completed your AI Teacher Audio Lesson and earned +${lesson.xpReward} XP!`,
      [
        {
          text: "Done",
          onPress: () => {
            cleanupAgentSession();
            router.replace("/(tabs)/learn");
          },
        },
      ]
    );
  };

  const handleEndCall = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "End Audio Lesson?",
      "Are you sure you want to exit? Your progress in this session will not be saved.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Call",
          style: "destructive",
          onPress: () => {
            cleanupAgentSession();
            router.back();
          },
        },
      ]
    );
  };

  // Dynamic connection indicator helper
  const renderConnectionStatus = () => {
    if (agentStatus === "connecting") {
      return (
        <View className="flex-row items-center mt-0.5">
          <View className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
          <Text className="text-xs font-poppins text-neutral-500 font-medium">Connecting...</Text>
        </View>
      );
    }
    if (agentStatus === "failed") {
      return (
        <View className="flex-row items-center mt-0.5">
          <View className="w-2 h-2 rounded-full bg-red-600 mr-1.5" />
          <Text className="text-xs font-poppins text-red-600 font-bold">
            {!hasApiKey ? "Connection Failed (No API Key)" : "Connection Failed"}
          </Text>
        </View>
      );
    }
    if (interactionState === "analyzing") {
      return (
        <View className="flex-row items-center mt-0.5">
          <View className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
          <Text className="text-xs font-poppins text-neutral-500 font-medium">Thinking...</Text>
        </View>
      );
    }
    if (interactionState === "listening") {
      return (
        <View className="flex-row items-center mt-0.5">
          <View className="w-2 h-2 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
          <Text className="text-xs font-poppins text-rose-500 font-bold">Listening...</Text>
        </View>
      );
    }
    return (
      <View className="flex-row items-center mt-0.5">
        <Animated.View
          style={{
            opacity: greenDotPulseAnim,
            backgroundColor: "#10B981",
            width: 8,
            height: 8,
            borderRadius: 4,
            marginRight: 6,
          }}
        />
        <Text className="text-xs font-poppins text-neutral-500 font-medium">
          {hasApiKey ? "Online (Gemini AI)" : "Online (Demo Mode)"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      {/* 1. Header Navigation */}
      <View className="flex-row items-center justify-between px-6 py-3 bg-white border-b border-neutral-100">
        <TouchableOpacity
          onPress={handleEndCall}
          className="w-10 h-10 items-center justify-center rounded-full bg-neutral-50 active:bg-neutral-100"
        >
          <Feather name="chevron-left" size={24} color="#4B4B4B" />
        </TouchableOpacity>

        {/* Status indicator */}
        <View className="items-center">
          <Text className="text-base font-poppins-bold text-[#111827]">{tutorName}</Text>
          {renderConnectionStatus()}
        </View>

        {/* Top-Right indicators */}
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center bg-[#FFF2F2] border border-[#FFD2D2] px-3 py-1.5 rounded-full">
            <Image source={images.streakFire} className="mr-1" style={{ width: 20, height: 20 }} resizeMode="contain" />
            <Text className="text-xs font-poppins-bold text-[#FF4B4B]">{streak}</Text>
          </View>

          <TouchableOpacity
            onPress={handleEndCall}
            className="w-10 h-10 rounded-full bg-[#FF4B4B] items-center justify-center shadow-sm"
          >
            <Feather name="phone-off" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content Container */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-white">
        {/* 2. Main Call Window Card */}
        <View className="px-6 pt-4 pb-2">
          <View style={styles.cardContainer} className="rounded-[32px] overflow-hidden shadow-md relative bg-neutral-900 border-2 border-b-4 border-neutral-200">
            <ImageBackground
              source={images.lessonHeader}
              style={StyleSheet.absoluteFillObject}
            />
            <View className="absolute inset-0 bg-black/15" />

            {/* Centered AI Avatar (Fox Mascot) */}
            <View className="flex-1 items-center justify-center pb-24">
              <Animated.Image 
                source={images.mascotWelcome} 
                style={[
                  styles.avatarImage, 
                  { 
                    transform: [
                      { translateY: avatarTranslateY },
                      { 
                        rotate: avatarRotation.interpolate({ 
                          inputRange: [-1, 1], 
                          outputRange: ['-5deg', '5deg'] 
                        }) 
                      },
                      { scale: avatarScale }
                    ]
                  }
                ]} 
                resizeMode="contain" 
              />
            </View>

            {/* Speech Dialogue Bubble Overlay (with Subtitles Toggle) */}
            <View className="absolute bottom-[135px] left-5 right-5 bg-white rounded-2xl p-4 shadow-lg border border-neutral-100 flex-row items-center justify-between">
              {subtitlesEnabled ? (
                <View className="flex-1 pr-4">
                  <Text className="text-xs font-poppins-bold uppercase tracking-wider text-[#5B4CFA] mb-1">
                    {tutorName}
                  </Text>
                  <Text className="text-sm font-poppins-bold text-[#111827] leading-relaxed">
                    {currentTurn.aiText}
                  </Text>
                  <Text className="text-xs font-poppins text-neutral-500 mt-1.5 leading-snug">
                    {currentTurn.aiTranslation}
                  </Text>
                </View>
              ) : (
                <View className="flex-1 pr-4 flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-[#EFEFFF] items-center justify-center mr-3 border border-neutral-200">
                    <Feather name="headphones" size={18} color="#5B4CFA" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-poppins-bold text-[#111827]">
                      {tutorName} (Voice Message)
                    </Text>
                    {/* Voice message waveform simulator */}
                    <View className="flex-row items-center mt-1.5 gap-0.5 pr-2">
                      {[12, 18, 14, 24, 16, 20, 10, 18, 22, 14, 12, 16, 8, 14, 20, 12, 18].map((h, idx) => (
                        <View
                          key={idx}
                          style={{
                            height: h,
                            backgroundColor: isSpeakerPlaying
                              ? idx % 3 === 0
                                ? "#5B4CFA"
                                : "rgba(91, 76, 250, 0.4)"
                              : "#D1D5DB",
                            width: 3,
                            borderRadius: 1.5,
                          }}
                        />
                      ))}
                    </View>
                    <Text className="text-[10px] font-poppins text-neutral-500 mt-1 font-bold">
                      {isSpeakerPlaying ? "🔊 Playing voice note..." : "🔇 Voice note (Ready)"}
                    </Text>
                  </View>
                </View>
              )}

              {/* Speaker play / Audio wave animation */}
              <TouchableOpacity
                onPress={() => speakText(currentTurn.aiText, selectedLanguage.id)}
                className="w-12 h-12 bg-[#EFEFFF] active:bg-[#DEDEFF] rounded-full items-center justify-center ml-2"
              >
                {isSpeakerPlaying ? (
                  <View className="flex-row items-end justify-center w-6 h-6 gap-0.5">
                    <Animated.View style={[styles.waveBar, { height: waveAnim1 }]} />
                    <Animated.View style={[styles.waveBar, { height: waveAnim2 }]} />
                    <Animated.View style={[styles.waveBar, { height: waveAnim3 }]} />
                    <Animated.View style={[styles.waveBar, { height: waveAnim4 }]} />
                  </View>
                ) : (
                  <Feather name="play" size={20} color="#5B4CFA" style={{ marginLeft: 2 }} />
                )}
              </TouchableOpacity>
            </View>

            {/* 3. Action / Speech Controls Area (INTEGRATED INSIDE THE CARD WITH BLUR EFFECT) */}
            <View className="absolute bottom-0 left-0 right-0 h-[120px] overflow-hidden rounded-b-[30px] border-t border-white/10">
              <Image
                source={images.lessonHeader}
                style={StyleSheet.absoluteFillObject}
                blurRadius={20}
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-white/5" />

              {/* Controls Row */}
              <View className="flex-row justify-center items-center gap-12 w-full h-full px-4 pt-1">

                {/* Mic Button */}
                <View className="items-center justify-center relative">
                  <View className="absolute top-0 w-14 h-14 items-center justify-center">
                    {interactionState === "listening" && (
                      <>
                        <Animated.View
                          style={[
                            styles.pulseRing,
                            getRippleStyle(ripple1),
                          ]}
                        />
                        <Animated.View
                          style={[
                            styles.pulseRing,
                            getRippleStyle(ripple2),
                          ]}
                        />
                        <Animated.View
                          style={[
                            styles.pulseRing,
                            getRippleStyle(ripple3),
                          ]}
                        />
                      </>
                    )}
                  </View>
                  <Animated.View
                    style={{
                      transform: [{ scale: micScaleAnim }],
                    }}
                  >
                    <TouchableOpacity
                      onPressIn={handleMicPressIn}
                      onPressOut={handleMicPressOut}
                      disabled={interactionState === "analyzing"}
                      style={styles.micButton}
                      className={`w-14 h-14 rounded-full items-center justify-center shadow-sm ${interactionState === "listening"
                        ? "bg-[#FF4B4B]"
                        : interactionState === "analyzing"
                          ? "bg-white/45"
                          : "bg-white"
                        }`}
                    >
                      {interactionState === "analyzing" ? (
                        <ActivityIndicator size="small" color="#5B4CFA" />
                      ) : (
                        <Feather
                          name="mic"
                          size={22}
                          color={interactionState === "listening" ? "white" : "#111827"}
                        />
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                  <Text className="text-[11px] font-poppins text-white mt-1.5 font-bold">Hold to Talk</Text>
                </View>

                {/* Subtitles Button */}
                <View className="items-center justify-center">
                  <TouchableOpacity
                    onPress={() => setSubtitlesEnabled(!subtitlesEnabled)}
                    className={`w-14 h-14 rounded-full items-center justify-center shadow-sm ${subtitlesEnabled ? "bg-white" : "bg-white/40"}`}
                  >
                    <Feather name="align-left" size={22} color="#111827" />
                  </TouchableOpacity>
                  <Text className="text-[11px] font-poppins text-white mt-1.5 font-bold">Subtitles</Text>
                </View>
              </View>
            </View>
          </View>
        </View>




        {/* Helper instruction text and continue actions */}
        <View className="px-6 py-1 items-center bg-white">
          <Text className="text-xs font-poppins text-neutral-500 mb-2 text-center">
            {interactionState === "listening"
              ? "🎤 Speaking now... Speak clearly."
              : interactionState === "analyzing"
                ? "⚡ Analyzing pronunciation..."
                : currentTurn.userPrompt}
          </Text>

          {/* Primary Continue / Finish Button */}
          {(interactionState === "success" || (currentTurn.type === "outro" && interactionState === "idle")) && (
            <View className="w-full max-w-sm mb-2">
              <PrimaryButton
                label={currentTurn.type === "outro" ? "Finish Lesson" : "Continue"}
                onPress={currentTurn.type === "outro" ? handleFinishLesson : handleNextTurn}
                color={selectedLanguage.baseColor || "#5B4CFA"}
                icon={currentTurn.type === "outro" ? "check" : "arrow-right"}
              />
            </View>
          )}

          {userSpokenText ? (
            <View className="bg-neutral-50 px-4 py-2 rounded-2xl border border-neutral-100 max-w-[85%] mt-1">
              <Text className="text-[10px] font-poppins text-neutral-400 text-center">You said:</Text>
              <Text className="text-xs font-poppins-bold text-[#111827] mt-0.5 text-center">
                &quot;{userSpokenText}&quot;
              </Text>
            </View>
          ) : null}
        </View>

        {/* 4. Real-time Lesson Feedback Card */}
        <View className="px-6 pb-2 bg-white">
          <View style={styles.feedbackCard} className="bg-white rounded-3xl p-4 border-2 border-b-4 border-neutral-200">
            <Text className="text-[10px] font-poppins-bold text-neutral-400 uppercase tracking-wider mb-2.5 text-center">
              Pronunciation Diagnostics (Real-time)
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="items-center flex-1">
                <Text className="text-[11px] font-poppins text-neutral-500">Speaking</Text>
                <Text
                  className={`text-xs font-poppins-bold mt-1 ${speakingScore === "Excellent" ? "text-emerald-500" : "text-neutral-400"
                    }`}
                >
                  {speakingScore}
                </Text>
              </View>

              <View style={styles.divider} />

              <View className="items-center flex-1">
                <Text className="text-[11px] font-poppins text-neutral-500">Pronunciation</Text>
                <Text
                  className={`text-xs font-poppins-bold mt-1 ${pronunciationScore === "Excellent"
                    ? "text-emerald-500"
                    : pronunciationScore === "Great"
                      ? "text-sky-500"
                      : "text-neutral-400"
                    }`}
                >
                  {pronunciationScore}
                </Text>
              </View>

              <View style={styles.divider} />

              <View className="items-center flex-1">
                <Text className="text-[11px] font-poppins text-neutral-500">Grammar</Text>
                <Text
                  className={`text-xs font-poppins-bold mt-1 ${grammarScore === "Excellent"
                    ? "text-emerald-500"
                    : grammarScore === "Great"
                      ? "text-sky-500"
                      : grammarScore === "Good"
                        ? "text-purple-500"
                        : "text-neutral-400"
                    }`}
                >
                  {grammarScore}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4.5 Live Captions Transcript Drawer */}
        <View className="px-6 pb-6 bg-white mt-2">
          <View className="bg-neutral-50 rounded-3xl p-4 border border-neutral-200">
            <Text className="text-[10px] font-poppins-bold text-neutral-400 uppercase tracking-wider mb-2 flex-row items-center">
              <MaterialCommunityIcons name="closed-caption" size={12} color="#777777" /> Live Captions
            </Text>
            <ScrollView
              style={{ maxHeight: 250 }}
              nestedScrollEnabled={true}
              ref={(ref) => ref?.scrollToEnd({ animated: true })}
            >
              {messages.length === 0 ? (
                <Text className="text-xs font-poppins text-neutral-400 italic text-center py-4">
                  Captions will appear here as you speak.
                </Text>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <View key={msg.id} className={`my-1 flex-row ${isUser ? "justify-end" : "justify-start"}`}>
                      <View
                        className={`rounded-2xl px-3 py-2 max-w-[85%] ${isUser ? "bg-[#EFEFFF] border border-[#DEDEFF]" : "bg-white border border-neutral-200"
                          }`}
                      >
                        <Text className={`text-[9px] font-poppins-bold uppercase tracking-wider ${isUser ? "text-[#5B4CFA]" : "text-neutral-500"} mb-0.5`}>
                          {isUser ? "You" : tutorName}
                        </Text>
                        <Text className="text-xs font-poppins text-[#111827]">
                          {msg.text}
                        </Text>
                        {!isUser && msg.translation && (
                          <Text className="text-[10px] font-poppins italic text-neutral-500 mt-0.5 border-t border-neutral-100 pt-0.5">
                            {msg.translation}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>


    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  cardContainer: {
    height: 520,
  },
  avatarImage: {
    width: 280,
    height: 280,
    marginBottom: 120,
  },
  pulseRing: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF4B4B",
  },
  micButton: {
    zIndex: 10,
  },
  feedbackCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  divider: {
    width: 1.5,
    height: 30,
    backgroundColor: "#E5E5E5",
  },
  waveBar: {
    width: 3,
    backgroundColor: "#5B4CFA",
    borderRadius: 1.5,
  },

});
