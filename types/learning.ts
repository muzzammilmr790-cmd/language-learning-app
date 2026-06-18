export interface Language {
  id: string; // e.g., 'es', 'fr', 'ja'
  name: string;
  nativeName: string;
  flag: string; // emoji or image source key
  baseColor: string; // tailwind color class or hex string (e.g. 'bg-emerald-500' / '#10B981')
}

export interface Unit {
  id: string;
  languageId: string;
  order: number;
  title: string;
  description: string;
}

export type LessonType = 'vocabulary' | 'chat' | 'audio' | 'video';

export type ActivityType = 'multiple-choice' | 'translate' | 'speak' | 'listen' | 'matching';

export interface Activity {
  id: string;
  lessonId: string;
  type: ActivityType;
  question: string;
  options?: string[]; // Multiple choice options or matching items
  correctAnswer: string | string[]; // Single correct option, or correct translations, or matches
  audioUrl?: string; // Optional audio file/reference for listening tasks
}

export interface VocabularyWord {
  word: string;
  translation: string;
  pronunciation?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}

export interface Phrase {
  phrase: string;
  translation: string;
  context?: string; // Optional context, e.g. "Formal greeting", "At the airport"
}

export interface Lesson {
  id: string;
  unitId: string;
  order: number;
  title: string;
  type: LessonType;
  durationMinutes: number;
  xpReward: number;
  goals: string[];
  vocabulary: VocabularyWord[];
  phrases: Phrase[];
  activities: Activity[];
  aiTeacherPrompt?: string; // Future audio-based/Vision Agent AI prompt instruction
}
