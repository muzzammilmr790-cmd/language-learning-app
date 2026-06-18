import { Lesson, LessonType } from "../types/learning";
import { Feather } from "@expo/vector-icons";

export const getLessonConfig = (type: LessonType) => {
  switch (type) {
    case "vocabulary":
      return {
        label: "Vocabulary",
        color: "#FF5E7E",
        icon: "book" as const,
      };
    case "chat":
      return {
        label: "AI Chat",
        color: "#5B4CFA",
        icon: "message-circle" as const,
      };
    case "audio":
      return {
        label: "Audio",
        color: "#1CB0F6",
        icon: "headphones" as const,
      };
    case "video":
      return {
        label: "Video Call",
        color: "#10B981",
        icon: "video" as const,
      };
    default:
      return {
        label: "Lesson",
        color: "#777777",
        icon: "book-open" as const,
      };
  }
};

export const getLessonCardImage = (lesson: Lesson) => {
  if (lesson.id.includes("l1")) {
    return "https://img.icons8.com/color/96/handshake.png";
  }
  if (lesson.id.includes("l2")) {
    return "https://img.icons8.com/color/96/chat--v1.png";
  }
  if (lesson.id.includes("l3")) {
    return "https://img.icons8.com/color/96/headphones.png";
  }
  if (lesson.id.includes("l4")) {
    return "https://img.icons8.com/color/96/video-call.png";
  }
  if (lesson.id.includes("l5") || lesson.id.includes("u2")) {
    return "https://img.icons8.com/color/96/restaurant.png";
  }
  return "https://img.icons8.com/color/96/learning.png";
};
