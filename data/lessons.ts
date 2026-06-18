import { Lesson } from '../types/learning';
import { languages } from './languages';

const baseLessons: Lesson[] = [
  // ==========================================
  // SPANISH LESSONS (es)
  // ==========================================
  
  // Unit 1: Basics & Greetings (es-unit-1)
  {
    id: 'es-u1-l1',
    unitId: 'es-unit-1',
    order: 1,
    title: 'Meeting People',
    type: 'vocabulary',
    durationMinutes: 5,
    xpReward: 10,
    goals: [
      'Learn basic Spanish greetings',
      'Understand how to say hello and goodbye',
      'Recognize common polite expressions'
    ],
    vocabulary: [
      {
        word: 'Hola',
        translation: 'Hello',
        pronunciation: 'OH-lah',
        exampleSentence: 'Hola, ¿cómo estás?',
        exampleTranslation: 'Hello, how are you?'
      },
      {
        word: 'Adiós',
        translation: 'Goodbye',
        pronunciation: 'ah-DYOHS',
        exampleSentence: 'Adiós, nos vemos mañana.',
        exampleTranslation: 'Goodbye, see you tomorrow.'
      },
      {
        word: 'Gracias',
        translation: 'Thank you',
        pronunciation: 'GRAH-syahs',
        exampleSentence: 'Muchas gracias por la comida.',
        exampleTranslation: 'Thank you very much for the food.'
      },
      {
        word: 'Por favor',
        translation: 'Please',
        pronunciation: 'por fah-VOR',
        exampleSentence: 'Un agua, por favor.',
        exampleTranslation: 'A water, please.'
      }
    ],
    phrases: [
      {
        phrase: '¿Cómo te llamas?',
        translation: 'What is your name?',
        context: 'Asking someone their name (informal)'
      },
      {
        phrase: 'Mucho gusto',
        translation: 'Nice to meet you',
        context: 'Responding to an introduction'
      }
    ],
    activities: [
      {
        id: 'es-u1-l1-a1',
        lessonId: 'es-u1-l1',
        type: 'multiple-choice',
        question: 'What does "Hola" mean?',
        options: ['Goodbye', 'Please', 'Hello', 'Thank you'],
        correctAnswer: 'Hello'
      },
      {
        id: 'es-u1-l1-a2',
        lessonId: 'es-u1-l1',
        type: 'translate',
        question: 'Translate to Spanish: "Thank you"',
        options: ['Adiós', 'Gracias', 'Por favor', 'Hola'],
        correctAnswer: 'Gracias'
      },
      {
        id: 'es-u1-l1-a3',
        lessonId: 'es-u1-l1',
        type: 'matching',
        question: 'Match the words with their meanings',
        options: ['Hola', 'Adiós', 'Hello', 'Goodbye'],
        correctAnswer: ['Hola:Hello', 'Adiós:Goodbye']
      }
    ],
    aiTeacherPrompt: 'Greet the student with a warm, energetic "¡Hola! (Hello!)". Introduce yourself as their friendly Spanish teacher, Juan. Tell them they are going to learn basic greetings today, and ask them to start by repeating "Hola, mucho gusto (Hello, nice to meet you)". Keep your tone encouraging and lively!'
  },
  {
    id: 'es-u1-l2',
    unitId: 'es-unit-1',
    order: 2,
    title: 'Chat: Asking "How are you?"',
    type: 'chat',
    durationMinutes: 8,
    xpReward: 15,
    goals: [
      'Ask others how they are doing',
      'Respond to health/mood questions',
      'Engage in simple conversational greetings'
    ],
    vocabulary: [
      {
        word: 'Bien',
        translation: 'Well / Good',
        pronunciation: 'byen',
        exampleSentence: 'Estoy muy bien, gracias.',
        exampleTranslation: 'I am doing very well, thank you.'
      },
      {
        word: 'Mal',
        translation: 'Bad / Unwell',
        pronunciation: 'mahl',
        exampleSentence: 'Hoy me siento un poco mal.',
        exampleTranslation: 'Today I feel a bit unwell.'
      },
      {
        word: '¿Y tú?',
        translation: 'And you?',
        pronunciation: 'ee too',
        exampleSentence: 'Yo estoy bien, ¿y tú?',
        exampleTranslation: 'I am doing well, and you?'
      }
    ],
    phrases: [
      {
        phrase: '¿Cómo estás?',
        translation: 'How are you?',
        context: 'Asking a friend how they are'
      },
      {
        phrase: 'Estoy bien',
        translation: 'I am doing well',
        context: 'Standard positive reply'
      }
    ],
    activities: [
      {
        id: 'es-u1-l2-a1',
        lessonId: 'es-u1-l2',
        type: 'multiple-choice',
        question: 'How do you say "How are you?" in Spanish?',
        options: ['¿Cómo te llamas?', 'Mucho gusto', '¿Cómo estás?', 'Adiós'],
        correctAnswer: '¿Cómo estás?'
      },
      {
        id: 'es-u1-l2-a2',
        lessonId: 'es-u1-l2',
        type: 'translate',
        question: 'Translate: "Estoy bien, ¿y tú?"',
        correctAnswer: 'I am well, and you?'
      }
    ],
    aiTeacherPrompt: 'Welcome the student back with a bright, energetic "¡Hola! (Hello!)". Introduce yourself as their warm tutor, Juan, and ask them how they are doing today using "¿Cómo estás? (How are you?)". Tell them you want to hear how they feel and prompt them to ask you back using "¿Y tú? (And you?)". Keep the feedback simple and supportive!'
  },
  {
    id: 'es-u1-l3',
    unitId: 'es-unit-1',
    order: 3,
    title: 'Audio: Saying Goodbye',
    type: 'audio',
    durationMinutes: 6,
    xpReward: 12,
    goals: [
      'Learn different ways to say goodbye',
      'Listen to and match pronunciation',
      'Practice auditory recognition of Spanish farewells'
    ],
    vocabulary: [
      {
        word: 'Hasta luego',
        translation: 'See you later',
        pronunciation: 'AHS-tah LWEH-go',
        exampleSentence: 'Hasta luego, amigo.',
        exampleTranslation: 'See you later, friend.'
      },
      {
        word: 'Hasta mañana',
        translation: 'See you tomorrow',
        pronunciation: 'AHS-tah mah-NYAH-nah',
        exampleSentence: 'Tengo clase, hasta mañana.',
        exampleTranslation: 'I have class, see you tomorrow.'
      }
    ],
    phrases: [
      {
        phrase: 'Chao',
        translation: 'Bye',
        context: 'Informal goodbye'
      }
    ],
    activities: [
      {
        id: 'es-u1-l3-a1',
        lessonId: 'es-u1-l3',
        type: 'listen',
        question: 'Listen and select what you hear: "Hasta luego"',
        options: ['Hasta mañana', 'Hasta luego', 'Adiós', 'Hola'],
        correctAnswer: 'Hasta luego'
      },
      {
        id: 'es-u1-l3-a2',
        lessonId: 'es-u1-l3',
        type: 'speak',
        question: 'Say: "Hasta mañana"',
        correctAnswer: 'Hasta mañana'
      }
    ],
    aiTeacherPrompt: 'Start the session with an energetic, friendly welcome! Tell the student that today they will master saying goodbye in Spanish. Warmly explain that the letter "H" in Spanish is silent, then slowly introduce "Hasta luego (See you later)" and ask them to repeat it first, before moving on to "Hasta mañana (See you tomorrow)". Encourage them to give it their best shot!'
  },
  {
    id: 'es-u1-l4',
    unitId: 'es-unit-1',
    order: 4,
    title: 'Vision: Visual Introductions',
    type: 'video',
    durationMinutes: 10,
    xpReward: 20,
    goals: [
      'Introduce yourself with gestures and expressions',
      'Observe real conversational context',
      'Demonstrate comprehension of visual and verbal cues'
    ],
    vocabulary: [
      {
        word: 'Me llamo',
        translation: 'My name is / I call myself',
        pronunciation: 'meh YAH-moh',
        exampleSentence: 'Me llamo Sofia.',
        exampleTranslation: 'My name is Sofia.'
      },
      {
        word: 'Señor',
        translation: 'Mr. / Sir',
        pronunciation: 'seh-NYOR',
        exampleSentence: 'Buenos días, Señor Gomez.',
        exampleTranslation: 'Good morning, Mr. Gomez.'
      }
    ],
    phrases: [
      {
        phrase: 'Mi nombre es...',
        translation: 'My name is...',
        context: 'Introducing yourself formally'
      }
    ],
    activities: [
      {
        id: 'es-u1-l4-a1',
        lessonId: 'es-u1-l4',
        type: 'multiple-choice',
        question: 'If Sofia says "Me llamo Sofia", what is she doing?',
        options: ['Saying goodbye', 'Introducing herself', 'Asking a question', 'Ordering food'],
        correctAnswer: 'Introducing herself'
      }
    ],
    aiTeacherPrompt: 'Wave energetically at the student and say "¡Hola! Me llamo Juan (Hello! My name is Juan)". Share your excitement to meet them, and prompt them to introduce themselves on screen by saying "Me llamo (My name is)" followed by their name. Maintain a warm, encouraging presence!'
  },

  // Unit 2: Food & Dining (es-unit-2)
  {
    id: 'es-u2-l1',
    unitId: 'es-unit-2',
    order: 1,
    title: 'Ordering Food',
    type: 'vocabulary',
    durationMinutes: 6,
    xpReward: 12,
    goals: [
      'Learn common restaurant vocabulary',
      'Ask for menu items politely',
      'Express basic culinary desires'
    ],
    vocabulary: [
      {
        word: 'La cuenta',
        translation: 'The bill / check',
        pronunciation: 'lah KWEHN-tah',
        exampleSentence: 'La cuenta, por favor.',
        exampleTranslation: 'The bill, please.'
      },
      {
        word: 'Comida',
        translation: 'Food / Meal',
        pronunciation: 'koh-MEE-dah',
        exampleSentence: 'La comida está deliciosa.',
        exampleTranslation: 'The food is delicious.'
      },
      {
        word: 'Quiero',
        translation: 'I want',
        pronunciation: 'KYEH-roh',
        exampleSentence: 'Quiero un taco de pollo.',
        exampleTranslation: 'I want a chicken taco.'
      }
    ],
    phrases: [
      {
        phrase: '¿Cuánto cuesta?',
        translation: 'How much does it cost?',
        context: 'Asking for the price of an item'
      }
    ],
    activities: [
      {
        id: 'es-u2-l1-a1',
        lessonId: 'es-u2-l1',
        type: 'multiple-choice',
        question: 'How do you ask for the bill in a restaurant?',
        options: ['Hola', 'La cuenta, por favor', '¿Cómo estás?', 'Quiero comida'],
        correctAnswer: 'La cuenta, por favor'
      },
      {
        id: 'es-u2-l1-a2',
        lessonId: 'es-u2-l1',
        type: 'translate',
        question: 'Translate: "Quiero comida"',
        correctAnswer: 'I want food'
      }
    ],
    aiTeacherPrompt: 'Step into the role of a lively, friendly waiter at a bustling Madrid cafe! Welcome the student warmly in Spanish and ask "What would you like to eat?" using "¿Qué desea comer?". Enthusiastically guide them to place their order using the polite phrase "Quiero... (I want...)" followed by a food item.'
  },

  // ==========================================
  // FRENCH LESSONS (fr)
  // ==========================================
  
  // Unit 1: Introductions & Greetings (fr-unit-1)
  {
    id: 'fr-u1-l1',
    unitId: 'fr-unit-1',
    order: 1,
    title: 'First Contact',
    type: 'vocabulary',
    durationMinutes: 5,
    xpReward: 10,
    goals: [
      'Learn primary French greetings',
      'Understand when to use formal vs informal hello',
      'Say goodbye politely'
    ],
    vocabulary: [
      {
        word: 'Bonjour',
        translation: 'Hello / Good morning',
        pronunciation: 'bohn-ZHOOR',
        exampleSentence: 'Bonjour, comment ça va ?',
        exampleTranslation: 'Hello, how is it going?'
      },
      {
        word: 'Salut',
        translation: 'Hi / Bye (informal)',
        pronunciation: 'sah-LOO',
        exampleSentence: 'Salut ! Tu vas bien ?',
        exampleTranslation: 'Hi! Are you doing well?'
      },
      {
        word: 'Merci',
        translation: 'Thank you',
        pronunciation: 'mair-SEE',
        exampleSentence: 'Merci beaucoup pour votre aide.',
        exampleTranslation: 'Thank you very much for your help.'
      },
      {
        word: 'Au revoir',
        translation: 'Goodbye',
        pronunciation: 'oh ruh-VWAR',
        exampleSentence: 'Au revoir, à bientôt !',
        exampleTranslation: 'Goodbye, see you soon!'
      }
    ],
    phrases: [
      {
        phrase: 'S’il vous plaît',
        translation: 'Please (formal/plural)',
        context: 'Polite requests'
      },
      {
        phrase: 'Ça va ?',
        translation: 'How is it going?',
        context: 'Informal check-in with friends'
      }
    ],
    activities: [
      {
        id: 'fr-u1-l1-a1',
        lessonId: 'fr-u1-l1',
        type: 'multiple-choice',
        question: 'Which word means hello in formal situations?',
        options: ['Au revoir', 'Merci', 'Bonjour', 'Salut'],
        correctAnswer: 'Bonjour'
      },
      {
        id: 'fr-u1-l1-a2',
        lessonId: 'fr-u1-l1',
        type: 'translate',
        question: 'Translate to French: "Thank you"',
        options: ['Au revoir', 'Merci', 'Salut', 'S’il vous plaît'],
        correctAnswer: 'Merci'
      }
    ],
    aiTeacherPrompt: 'Greet the student with a cheerful, high-energy "Bonjour! (Hello!)". Introduce yourself as their friendly French teacher, Pierre. Explain that "Bonjour" is a key polite greeting in French culture, contrast it briefly with the casual "Salut (Hi)", and ask them to repeat "Bonjour" to get started!'
  },
  {
    id: 'fr-u1-l2',
    unitId: 'fr-unit-1',
    order: 2,
    title: 'Audio: French Nasal Sounds',
    type: 'audio',
    durationMinutes: 7,
    xpReward: 15,
    goals: [
      'Distinguish nasal vowel sounds in French',
      'Practice pronouncing nasal letters',
      'Improve general listening comprehension'
    ],
    vocabulary: [
      {
        word: 'Un',
        translation: 'One / A',
        pronunciation: 'uh',
        exampleSentence: 'J’ai un chat.',
        exampleTranslation: 'I have a cat.'
      },
      {
        word: 'Bon',
        translation: 'Good',
        pronunciation: 'boh',
        exampleSentence: 'C’est un bon livre.',
        exampleTranslation: 'It is a good book.'
      }
    ],
    phrases: [
      {
        phrase: 'Je ne sais pas',
        translation: 'I do not know',
        context: 'When you do not have an answer'
      }
    ],
    activities: [
      {
        id: 'fr-u1-l2-a1',
        lessonId: 'fr-u1-l2',
        type: 'listen',
        question: 'Listen and select the word with a nasal sound:',
        options: ['Table', 'Bon', 'Route', 'Livre'],
        correctAnswer: 'Bon'
      },
      {
        id: 'fr-u1-l2-a2',
        lessonId: 'fr-u1-l2',
        type: 'speak',
        question: 'Pronounce the nasal vowel in: "Un"',
        correctAnswer: 'Un'
      }
    ],
    aiTeacherPrompt: 'Welcome the student with a very encouraging, energetic tone! Explain that today they will learn the secrets of beautiful French nasal vowels. Warmly guide them through "un (one)", "bon (good)", and "pain (bread)", asking them to repeat each one slowly after you while giving them lots of positive reinforcement.'
  },

  // ==========================================
  // JAPANESE LESSONS (ja)
  // ==========================================
  
  // Unit 1: Greetings & Hiragana (ja-unit-1)
  {
    id: 'ja-u1-l1',
    unitId: 'ja-unit-1',
    order: 1,
    title: 'Essential Greetings',
    type: 'vocabulary',
    durationMinutes: 5,
    xpReward: 10,
    goals: [
      'Learn standard Japanese daily greetings',
      'Understand morning, afternoon, and evening hello variations',
      'Say thank you politely'
    ],
    vocabulary: [
      {
        word: 'こんにちは (Konnichiwa)',
        translation: 'Hello / Good afternoon',
        pronunciation: 'kon-nee-chee-wah',
        exampleSentence: '皆さん、こんにちは。',
        exampleTranslation: 'Hello, everyone.'
      },
      {
        word: 'おはよう (Ohayou)',
        translation: 'Good morning (informal)',
        pronunciation: 'oh-hah-yoh',
        exampleSentence: 'おはよう、お兄ちゃん。',
        exampleTranslation: 'Good morning, brother.'
      },
      {
        word: 'ありがとう (Arigatou)',
        translation: 'Thank you (informal)',
        pronunciation: 'ah-ree-gah-toh',
        exampleSentence: '手伝ってくれてありがとう。',
        exampleTranslation: 'Thank you for helping me.'
      },
      {
        word: 'さようなら (Sayounara)',
        translation: 'Goodbye',
        pronunciation: 'sah-yoh-nah-rah',
        exampleSentence: '先生、さようなら。',
        exampleTranslation: 'Goodbye, teacher.'
      }
    ],
    phrases: [
      {
        phrase: 'はじめまして (Hajimemashite)',
        translation: 'Nice to meet you / How do you do',
        context: 'Starting an introduction'
      },
      {
        phrase: 'どうぞよろしく (Douzo yoroshiku)',
        translation: 'Please be kind to me / Glad to meet you',
        context: 'Ending an introduction'
      }
    ],
    activities: [
      {
        id: 'ja-u1-l1-a1',
        lessonId: 'ja-u1-l1',
        type: 'multiple-choice',
        question: 'Which word means "Good morning" in Japanese?',
        options: ['こんにちは', 'さようなら', 'おはよう', 'ありがとう'],
        correctAnswer: 'おはよう'
      },
      {
        id: 'ja-u1-l1-a2',
        lessonId: 'ja-u1-l1',
        type: 'translate',
        question: 'Translate: "ありがとう"',
        options: ['Hello', 'Thank you', 'Goodbye', 'Please'],
        correctAnswer: 'Thank you'
      }
    ],
    aiTeacherPrompt: 'Greet the student with a warm, enthusiastic "Konnichiwa! (Hello!)". Introduce yourself as their friendly Japanese assistant, Sakura. Teach them that "Konnichiwa" is for the afternoon, introduce "Hajimemashite (Nice to meet you)", and encourage them to repeat it while imagining a polite bow.'
  },
  {
    id: 'ja-u1-l2',
    unitId: 'ja-unit-1',
    order: 2,
    title: 'Chat: Introductions',
    type: 'chat',
    durationMinutes: 8,
    xpReward: 15,
    goals: [
      'State your name in Japanese',
      'Ask others for their name',
      'Complete a basic introduction dialog'
    ],
    vocabulary: [
      {
        word: '名前 (Namae)',
        translation: 'Name',
        pronunciation: 'nah-mah-eh',
        exampleSentence: 'お名前は何ですか？',
        exampleTranslation: 'What is your name?'
      },
      {
        word: '私 (Watashi)',
        translation: 'I / Me',
        pronunciation: 'wah-tah-shee',
        exampleSentence: '私は学生です。',
        exampleTranslation: 'I am a student.'
      },
      {
        word: 'です (Desu)',
        translation: 'To be / Is / Am / Are',
        pronunciation: 'deh-soo',
        exampleSentence: '私はケンです。',
        exampleTranslation: 'I am Ken.'
      }
    ],
    phrases: [
      {
        phrase: 'お名前は何ですか？ (O-namae wa nan desu ka?)',
        translation: 'What is your name?',
        context: 'Asking someone their name politely'
      }
    ],
    activities: [
      {
        id: 'ja-u1-l2-a1',
        lessonId: 'ja-u1-l2',
        type: 'multiple-choice',
        question: 'How do you say "I / Me" in Japanese?',
        options: ['名前', '私', 'です', 'おはよう'],
        correctAnswer: '私'
      },
      {
        id: 'ja-u1-l2-a2',
        lessonId: 'ja-u1-l2',
        type: 'translate',
        question: 'Translate to English: "私はケンです。"',
        correctAnswer: 'I am Ken.'
      }
    ],
    aiTeacherPrompt: 'Bow virtually and greet the student with an energetic "Hajimemashite! Watashi wa Sakura desu (Nice to meet you! I am Sakura)". Ask for their name using "O-namae wa nan desu ka? (What is your name?)", and guide them to reply with "Watashi wa... desu (I am...)"! Keep your feedback warm and supportive.'
  }
];

// Define high-quality vocabularies for popular languages
const languageVocab: Record<string, {
  unit1: {
    l1: { word: string; translation: string; pronunciation: string; exampleSentence: string; exampleTranslation: string }[];
    l2: { word: string; translation: string; pronunciation: string; exampleSentence: string; exampleTranslation: string }[];
    l3: { word: string; translation: string; pronunciation: string; exampleSentence: string; exampleTranslation: string }[];
    l4: { word: string; translation: string; pronunciation: string; exampleSentence: string; exampleTranslation: string }[];
    l5: { word: string; translation: string; pronunciation: string; exampleSentence: string; exampleTranslation: string }[];
  };
  phrases: Record<string, { phrase: string; translation: string; context: string }[]>;
}> = {
  de: {
    unit1: {
      l1: [
        { word: 'Hallo', translation: 'Hello', pronunciation: 'HAHL-oh', exampleSentence: 'Hallo, wie geht es dir?', exampleTranslation: 'Hello, how are you?' },
        { word: 'Tschüss', translation: 'Goodbye', pronunciation: 'tshoos', exampleSentence: 'Tschüss, bis morgen!', exampleTranslation: 'Goodbye, see you tomorrow!' },
        { word: 'Danke', translation: 'Thank you', pronunciation: 'DAHN-kuh', exampleSentence: 'Danke für das Essen.', exampleTranslation: 'Thank you for the food.' },
        { word: 'Bitte', translation: 'Please', pronunciation: 'BIT-uh', exampleSentence: 'Ein Bier, bitte.', exampleTranslation: 'A beer, please.' }
      ],
      l2: [
        { word: 'Gut', translation: 'Well / Good', pronunciation: 'goot', exampleSentence: 'Mir geht es gut, danke.', exampleTranslation: 'I am doing well, thank you.' },
        { word: 'Schlecht', translation: 'Bad / Unwell', pronunciation: 'shleht', exampleSentence: 'Heute geht es mir schlecht.', exampleTranslation: 'Today I feel unwell.' },
        { word: 'Und dir?', translation: 'And you?', pronunciation: 'oont deer', exampleSentence: 'Ich bin müde. Und dir?', exampleTranslation: 'I am tired. And you?' }
      ],
      l3: [
        { word: 'Auf Wiedersehen', translation: 'Goodbye', pronunciation: 'owf VEE-der-zayn', exampleSentence: 'Auf Wiedersehen, Herr Schmidt.', exampleTranslation: 'Goodbye, Mr. Schmidt.' },
        { word: 'Bis morgen', translation: 'See you tomorrow', pronunciation: 'bis MOR-gen', exampleSentence: 'Gute Nacht, bis morgen.', exampleTranslation: 'Good night, see you tomorrow.' }
      ],
      l4: [
        { word: 'Ich heiße', translation: 'My name is', pronunciation: 'ih HAI-suh', exampleSentence: 'Ich heiße Lukas.', exampleTranslation: 'My name is Lukas.' },
        { word: 'Herr', translation: 'Mr.', pronunciation: 'hair', exampleSentence: 'Guten Tag, Herr Müller.', exampleTranslation: 'Good day, Mr. Müller.' }
      ],
      l5: [
        { word: 'Die Rechnung', translation: 'The bill', pronunciation: 'dee REH-noong', exampleSentence: 'Die Rechnung, bitte.', exampleTranslation: 'The bill, please.' },
        { word: 'Essen', translation: 'Food', pronunciation: 'EH-sen', exampleSentence: 'Das Essen ist lecker.', exampleTranslation: 'The food is delicious.' },
        { word: 'Ich möchte', translation: 'I would like', pronunciation: 'ih MERH-tuh', exampleSentence: 'Ich möchte einen Kaffee.', exampleTranslation: 'I would like a coffee.' }
      ]
    },
    phrases: {
      l1: [
        { phrase: 'Wie heißt du?', translation: 'What is your name?', context: 'Asking a name' },
        { phrase: 'Freut mich', translation: 'Nice to meet you', context: 'Introduction response' }
      ],
      l2: [
        { phrase: 'Wie geht es dir?', translation: 'How are you?', context: 'Asking how someone is' }
      ],
      l3: [
        { phrase: 'Bis später', translation: 'See you later', context: 'Informal farewell' }
      ],
      l4: [
        { phrase: 'Mein Name ist...', translation: 'My name is...', context: 'Formal introduction' }
      ],
      l5: [
        { phrase: 'Wie viel kostet das?', translation: 'How much does it cost?', context: 'Asking price' }
      ]
    }
  },
  en: {
    unit1: {
      l1: [
        { word: 'Hello', translation: 'Hello', pronunciation: 'hə-LOH', exampleSentence: 'Hello, how are you?', exampleTranslation: 'Hello, how are you?' },
        { word: 'Goodbye', translation: 'Goodbye', pronunciation: 'gud-BYE', exampleSentence: 'Goodbye, see you tomorrow!', exampleTranslation: 'Goodbye, see you tomorrow!' },
        { word: 'Thanks', translation: 'Thanks', pronunciation: 'thangks', exampleSentence: 'Thanks for the food.', exampleTranslation: 'Thanks for the food.' },
        { word: 'Please', translation: 'Please', pronunciation: 'pleez', exampleSentence: 'Water, please.', exampleTranslation: 'Water, please.' }
      ],
      l2: [
        { word: 'Fine', translation: 'Fine / Good', pronunciation: 'fyne', exampleSentence: 'I am fine, thanks.', exampleTranslation: 'I am fine, thanks.' },
        { word: 'Bad', translation: 'Bad', pronunciation: 'bad', exampleSentence: 'Today is a bad day.', exampleTranslation: 'Today is a bad day.' },
        { word: 'And you?', translation: 'And you?', pronunciation: 'and yoo', exampleSentence: 'I am doing well. And you?', exampleTranslation: 'I am doing well. And you?' }
      ],
      l3: [
        { word: 'See you later', translation: 'See you later', pronunciation: 'see yoo LAY-ter', exampleSentence: 'See you later, friend.', exampleTranslation: 'See you later, friend.' },
        { word: 'See you tomorrow', translation: 'See you tomorrow', pronunciation: 'see yoo tuh-MAH-roh', exampleSentence: 'I am leaving now, see you tomorrow.', exampleTranslation: 'I am leaving now, see you tomorrow.' }
      ],
      l4: [
        { word: 'My name is...', translation: 'My name is...', pronunciation: 'my naym iz', exampleSentence: 'My name is John.', exampleTranslation: 'My name is John.' },
        { word: 'Mister', translation: 'Mr.', pronunciation: 'MIS-ter', exampleSentence: 'Good morning, Mr. Brown.', exampleTranslation: 'Good morning, Mr. Brown.' }
      ],
      l5: [
        { word: 'The check', translation: 'The check / bill', pronunciation: 'theh chek', exampleSentence: 'The check, please.', exampleTranslation: 'The check, please.' },
        { word: 'Food', translation: 'Food', pronunciation: 'food', exampleSentence: 'The food is delicious.', exampleTranslation: 'The food is delicious.' },
        { word: 'I want', translation: 'I want', pronunciation: 'eye wahnt', exampleSentence: 'I want an apple.', exampleTranslation: 'I want an apple.' }
      ]
    },
    phrases: {
      l1: [
        { phrase: 'What is your name?', translation: 'What is your name?', context: 'Asking name' },
        { phrase: 'Nice to meet you', translation: 'Nice to meet you', context: 'Responding' }
      ],
      l2: [
        { phrase: 'How are you?', translation: 'How are you?', context: 'Asking how someone is' }
      ],
      l3: [
        { phrase: 'Bye', translation: 'Bye', context: 'Short farewell' }
      ],
      l4: [
        { phrase: 'I am...', translation: 'I am...', context: 'Simple introduction' }
      ],
      l5: [
        { phrase: 'How much is it?', translation: 'How much is it?', context: 'Asking price' }
      ]
    }
  }
};

// Now we build the dynamic array
const generatedLessons: Lesson[] = [];

languages.forEach(lang => {
  const langBaseLessons = baseLessons.filter(l => l.id.startsWith(`${lang.id}-`));
  
  // We want to generate 20 lessons total per language. We'll put them ALL in Unit 1 so the user sees them at once.
  // The user requested: greetings, compliments, and day-to-day sentences.
  
  const unitId = `${lang.id}-unit-1`;
  
  for (let lessonOrder = 1; lessonOrder <= 20; lessonOrder++) {
    const lessonId = `${lang.id}-u1-l${lessonOrder}`;
    
    // Check if this lesson already exists in baseLessons
    if (langBaseLessons.some(l => l.id === lessonId)) {
      continue;
    }
    
    let title = '';
    let goals: string[] = [];
    
    if (lessonOrder <= 5) {
      title = `Basics & Greetings ${lessonOrder}`;
      goals = [`Learn basic ${lang.name} greetings`, 'Say hello and goodbye', 'Polite expressions'];
    } else if (lessonOrder <= 10) {
      title = `Compliments & Praise ${lessonOrder - 5}`;
      goals = [`Give compliments in ${lang.name}`, 'Make friends', 'Express positive feelings'];
    } else if (lessonOrder <= 15) {
      title = `Everyday Sentences ${lessonOrder - 10}`;
      goals = [`Talk about daily routines in ${lang.name}`, 'Describe your hobbies', 'Common phrases'];
    } else {
      title = `Advanced Conversations ${lessonOrder - 15}`;
      goals = [`Have a deeper conversation in ${lang.name}`, 'Express opinions', 'Day-to-day interactions'];
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
          word: `Sample Word ${lessonOrder} (${lang.name})`,
          translation: `Translation ${lessonOrder}`,
          pronunciation: '...',
          exampleSentence: `This is an example in ${lang.name}`,
          exampleTranslation: 'This is an example in English'
        }
      ],
      phrases: [
        {
          phrase: `Sample Phrase ${lessonOrder} (${lang.name})`,
          translation: `Translation ${lessonOrder}`,
          context: 'Everyday usage'
        }
      ],
      activities: [
        {
          id: `${lessonId}-a1`,
          lessonId,
          type: 'multiple-choice',
          question: `What does "Sample Word ${lessonOrder}" mean?`,
          options: [`Translation ${lessonOrder}`, 'Wrong A', 'Wrong B', 'Wrong C'],
          correctAnswer: `Translation ${lessonOrder}`
        }
      ],
      aiTeacherPrompt: `Act as a warm, energetic teacher in ${lang.name}. Guide the student through lesson ${lessonOrder}.`
    });
  }
});

export const lessons: Lesson[] = [...baseLessons, ...generatedLessons];
