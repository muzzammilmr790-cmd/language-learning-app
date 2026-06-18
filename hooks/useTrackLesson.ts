import { useEffect, useRef } from "react";
import { posthog } from "../lib/posthog";
import { useProgressStore } from "../store/useProgressStore";

export function useTrackLesson(lessonId: string, language: string, lessonNumber: number) {
  const startTimeRef = useRef<number>(0);
  const lastQuestionIndexRef = useRef<number>(0);

  useEffect(() => {
    // 1. lesson_started — fires when the lesson screen mounts and the user begins the lesson
    posthog.capture("lesson_started", {
      lesson_id: lessonId,
      language,
      lesson_number: lessonNumber,
    });

    startTimeRef.current = Date.now();

    return () => {
      // 2. lesson_abandoned — fires when the user exits a lesson before completion
      const completedLessonIds = useProgressStore.getState().completedLessonIds;
      const isCompleted = completedLessonIds.includes(lessonId);

      if (!isCompleted) {
        const timeIntoLessonSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
        posthog.capture("lesson_abandoned", {
          lesson_id: lessonId,
          time_into_lesson_seconds: timeIntoLessonSeconds,
          last_question_index: lastQuestionIndexRef.current,
        });
      }
    };
  }, [lessonId, language, lessonNumber]);

  return {
    lastQuestionIndexRef,
  };
}
