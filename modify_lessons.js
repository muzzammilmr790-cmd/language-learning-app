const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, 'data', 'lessons.ts');
const content = fs.readFileSync(lessonsPath, 'utf8');

const lines = content.split('\n');
const startIndex = lines.findIndex(l => l.includes('// Now we build the dynamic array'));

if (startIndex === -1) {
  console.error('Could not find start index');
  process.exit(1);
}

const topPart = lines.slice(0, startIndex).join('\n');

const newLogic = `// Now we build the dynamic array
const generatedLessons: Lesson[] = [];

languages.forEach(lang => {
  const langBaseLessons = baseLessons.filter(l => l.id.startsWith(\`\${lang.id}-\`));
  
  // We want to generate 20 lessons total per language. We'll put them ALL in Unit 1 so the user sees them at once.
  // The user requested: greetings, compliments, and day-to-day sentences.
  
  const unitId = \`\${lang.id}-unit-1\`;
  
  for (let lessonOrder = 1; lessonOrder <= 20; lessonOrder++) {
    const lessonId = \`\${lang.id}-u1-l\${lessonOrder}\`;
    
    // Check if this lesson already exists in baseLessons
    if (langBaseLessons.some(l => l.id === lessonId)) {
      continue;
    }
    
    let title = '';
    let goals: string[] = [];
    
    if (lessonOrder <= 5) {
      title = \`Basics & Greetings \${lessonOrder}\`;
      goals = [\`Learn basic \${lang.name} greetings\`, 'Say hello and goodbye', 'Polite expressions'];
    } else if (lessonOrder <= 10) {
      title = \`Compliments & Praise \${lessonOrder - 5}\`;
      goals = [\`Give compliments in \${lang.name}\`, 'Make friends', 'Express positive feelings'];
    } else if (lessonOrder <= 15) {
      title = \`Everyday Sentences \${lessonOrder - 10}\`;
      goals = [\`Talk about daily routines in \${lang.name}\`, 'Describe your hobbies', 'Common phrases'];
    } else {
      title = \`Advanced Conversations \${lessonOrder - 15}\`;
      goals = [\`Have a deeper conversation in \${lang.name}\`, 'Express opinions', 'Day-to-day interactions'];
    }
    
    generatedLessons.push({
      id: lessonId,
      unitId,
      order: lessonOrder,
      title,
      type: lessonOrder % 2 === 0 ? 'chat' : 'vocabulary',
      durationMinutes: 4 + (lessonOrder % 4),
      xpReward: 10 + Math.floor(lessonOrder / 2),
      goals,
      vocabulary: [
        {
          word: \`Sample Word \${lessonOrder} (\${lang.name})\`,
          translation: \`Translation \${lessonOrder}\`,
          pronunciation: '...',
          exampleSentence: \`This is an example in \${lang.name}\`,
          exampleTranslation: 'This is an example in English'
        }
      ],
      phrases: [
        {
          phrase: \`Sample Phrase \${lessonOrder} (\${lang.name})\`,
          translation: \`Translation \${lessonOrder}\`,
          context: 'Everyday usage'
        }
      ],
      activities: [
        {
          id: \`\${lessonId}-a1\`,
          lessonId,
          type: 'multiple-choice',
          question: \`What does "Sample Word \${lessonOrder}" mean?\`,
          options: [\`Translation \${lessonOrder}\`, 'Wrong A', 'Wrong B', 'Wrong C'],
          correctAnswer: \`Translation \${lessonOrder}\`
        }
      ],
      aiTeacherPrompt: \`Act as a warm, energetic teacher in \${lang.name}. Guide the student through lesson \${lessonOrder}.\`
    });
  }
});

export const lessons: Lesson[] = [...baseLessons, ...generatedLessons];
`;

fs.writeFileSync(lessonsPath, topPart + '\n' + newLogic);
console.log('Successfully updated lessons.ts to have 20 lessons in Unit 1');
