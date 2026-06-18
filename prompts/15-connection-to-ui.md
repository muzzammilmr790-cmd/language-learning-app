Read AGENTS.md first and follow it strictly.

Connect the Audio Lesson screen to the client-side Gemini AI teacher agent. 

Ensure the Gemini response generator uses the selected lesson, language, goals, vocabulary, phrases, and AI teacher prompt. On mount, transition the agent through connecting and connected states.

Clean up the agent session (speech recognition, speech synthesis, and timeouts) both when the user ends the call and when the screen unmounts. 

Do not expose any secrets in the mobile app. Show the agent connection status with idle, connecting, connected, and failed states.