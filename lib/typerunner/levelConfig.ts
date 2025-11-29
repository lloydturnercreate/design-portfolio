/**
 * Enhanced Level Configuration - Deep Touch Typing Curriculum
 * Comprehensive word banks for in-depth learning
 */

import { LevelConfig } from './types';

// --- ENHANCED CHARACTER SETS ---
const CHAR_SETS = {
  // Finger-specific training
  homeRow: 'asdfjkl;',
  leftIndex: 'rfvtgb',
  rightIndex: 'ujmyhn',
  leftPinky: 'aqzwsx',
  rightPinky: ';pl/.',
  topRow: 'qwertyuiop',
  bottomRow: 'zxcvbnm',
  
  // Systematic bigram training (all high-frequency pairs)
  commonBigrams: [
    // Top 50 English bigrams by frequency
    'th', 'he', 'in', 'er', 'an', 're', 'on', 'at', 'en', 'nd',
    'ti', 'es', 'or', 'te', 'of', 'ed', 'is', 'it', 'al', 'ar',
    'st', 'to', 'nt', 'ng', 'se', 'ha', 'as', 'ou', 'io', 'le',
    've', 'co', 'me', 'de', 'hi', 'ri', 'ro', 'ic', 'ne', 'ea',
    'ra', 'ce', 'li', 'ch', 'sh', 'wh', 'gh', 'ph', 'ck', 'nk',
  ],
  
  // Weak finger combinations (need extra practice)
  weakFingerBigrams: ['qu', 'pl', 'ck', 'sc', 'sw', 'za', 'lp', 'aq', 'op', 'po', 'pq', 'za', 'ax', 'aw'],
  
  // Important trigrams
  trigrams: ['ing', 'and', 'ion', 'tio', 'ent', 'ati', 'for', 'ter', 'ate', 'ers', 'his', 'con', 'res', 'ver', 'all', 'ons', 'nce', 'men', 'ith', 'ted'],
  
  // Double letters (coordination training)
  doubleLetter: ['ll', 'ee', 'ss', 'oo', 'tt', 'ff', 'rr', 'nn', 'pp', 'cc', 'mm', 'gg', 'dd', 'bb'],
  
  // Punctuation groups
  basicPunct: '.,!?',
  brackets: '[]{}()',
  symbols: '-_+=*&%$#@',
  quotes: '\'"',
  
  // Numbers
  numbers: '0123456789',
};

// --- COMPREHENSIVE WORD BANKS ---
const WORD_BANKS = {
  // 2-3 letter words (transition from letters to words)
  tiny: 'is it in an at on or we me be to do if so no go up us as of my by he am ok ox ye',
  
  // 3-4 letter words (home row heavy) - EXPANDED
  homeHeavy: 'add had has sad ask fall half less deal head lead heal seal self help desk held jail safe lake face hack glass flask jade jade hall shall fake lead leaks flash slash',
  
  // 4-5 letter common words (Top 100 most typed) - EXPANDED
  basic: 'the and for are but not you all can had her was one our out day get has him his how its may new now old see two who boy way oil use men run too say big let put end why try ask own top car far sea yet set hot age law cut son art war buy lot fun die pay sit eat low ice hot arm sky led bit hit lay guy tea guy buy sky',
  
  // 5-6 letter common words (Top 200) - GREATLY EXPANDED
  common: 'about after again could every first found great house large learn never other place right small still their there these think three where which while world would write people water might thing begin system order stand point begin taken become number bring group become against really family during person course public result become already around father moment follow mother create change happen between without problem during several become become remain during across become become moment during become should public become increase',
  
  // More natural common words
  everyday: 'today going maybe around always before better together something nothing because someone please really usually sometimes someone anyone everyone anything everything somewhere anywhere everywhere nothing something within toward forward between during morning evening tonight moment second minute become matter person reason change answer question problem example history society concern interest student quality company surface surface message percent product service primary building general several national outside morning picture tonight explain address welcome journey perfect address success trouble balance percent distance industry society general picture welcome present balance general concern concept distance quality history balance message pressure connect interest marriage contract control husband children welcome question security distance business marriage marriage interest',
  
  // Words with difficult letter combinations - EXPANDED
  patterns: 'quick brown jumps across expect require acquire square quality question length strength through enough thought brought taught caught bought fought sought struggle squirrel quarter squeeze twelve rhythm psychology awkward awkward knowledge answer wrinkle autumn column receipt receipt receipt special initial unusual beautiful precious anxious nauseous gorgeous courageous muscle obscure biscuit circuit disguise language building colleague guilty straight acquisition acquisition conscience conscientious maintenance occurrence opportunity possess possess profession questionnaire recommend restaurant rhythm schedule specific thorough vacuum vacuum weird weird yield yield',
  
  // Action verbs (good for flow typing) - EXPANDED
  verbs: 'make take have give find tell work seem feel leave think become change open close write speak create develop explore discover appear follow provide remain include continue consider suggest present require involve produce explain improve achieve complete deliver express indicate establish identify maintain perform represent support receive control respond realize achieve enable reflect direct improve achieve reduce approach arrange connect achieve respond reflect conduct provide realize achieve arrange continue identify receive present reflect deliver express identify present perform respond suggest realize arrange conduct connect continue develop improve achieve provide receive reflect suggest identify arrange connect develop improve perform present realize respond suggest maintain establish identify',
  
  // Common phrases and sentences - MASSIVELY EXPANDED
  phrases: [
    'Hello, how are you?',
    'I am learning to type.',
    'The quick brown fox jumps.',
    'Practice makes perfect!',
    'Keep up the good work.',
    'You are doing great.',
    'Stay focused and calm.',
    'Speed comes with accuracy.',
    'What time is it now?',
    'Where are you going today?',
    'This is a great opportunity!',
    'Can you help me, please?',
    'The weather looks nice today.',
    'Let me know when you are ready.',
    'I will be there in a moment.',
    'Thank you for your patience.',
    'Have a wonderful day ahead!',
    'That sounds like a good plan.',
    'I appreciate your help.',
    'Could you please clarify?',
    'Let me check on that for you.',
    'I will get back to you soon.',
    'Looking forward to hearing from you.',
    'Please feel free to reach out.',
    'I hope this helps you.',
    'That makes perfect sense.',
    'I completely understand.',
    'No problem at all.',
    'Thanks for letting me know.',
    'I will keep that in mind.',
    'How can I assist you today?',
    'What would you like to know?',
    'Is there anything else?',
    'Please take your time.',
    'I am here to help.',
    'Feel free to ask questions.',
    'Let me explain further.',
    'That is a good question.',
    'I see what you mean.',
    'That is very interesting.',
    'I had not thought of that.',
    'You make a valid point.',
    'I agree with you completely.',
    'Let us work together on this.',
    'We can figure this out.',
    'Everything will work out fine.',
    'Stay positive and patient.',
    'Take one step at a time.',
    'Progress is being made.',
    'You are on the right track.',
  ],
  
  // Advanced vocabulary (professional/academic) - EXPANDED
  advanced: 'perspective experience community responsible information technology necessary understand knowledge difficult important beautiful wonderful excellent specific general particular professional personal individual organization development environment relationship opportunity responsibility accomplishment achievement administration alternative anticipation appropriate architecture assessment assumption atmosphere authentic beneficial capability circumstances collaboration commitment communication competitive component comprehensive concentrate confidence consequence consistent construction contribution controversy coordinate corporation demonstrate description determine development difference dimension discrimination discussion distribution economic education efficiency eliminate emergency employment encourage engineering entertainment environment equipment establish evaluation eventually evidence evolution examination executive existence expansion experience experiment explanation exploration extraordinary facilitate foundation framework fundamental generation government identification illustration immediately implementation implication importance improvement independence individual inevitable influence infrastructure initiative innovation institution insurance intelligence interaction international interpretation investigation involvement legislation management mechanism measurement mechanical negotiate objective observation occupation operation opportunity opposition organization orientation outcome participant particular perception permanent permission perspective phenomenon philosophy physical political population position potential practical preliminary preparation presentation prevention primary principle priority procedure professional prominent proportion protection psychology publication qualification recognition recommendation reflection regulation relationship relevance representative requirement resolution resource responsibility restriction revolution scientific secretary significant situation solution sophisticated specific strategy strength structure substantial successful sufficient supplement appropriate technology temperature temporary tendency theoretical therefore tradition traditional transition tremendous ultimate underlying uniform universal unprecedented valuable variable virtually volunteer widespread wonderful',
  
  // Right-hand emphasis words (balance training)
  rightHandHeavy: 'jump pull poll look milk hill null loop pony lynx pupil union onion imply lumpy nylon lymph unholy minimum opinion',
  
  // Left-hand emphasis words
  leftHandHeavy: 'vast test extra desert assert crates wasted faster sweater greatest scatter created treated arrested greatest',
  
  // Double letter words (coordination) - EXPANDED  
  doubleLetters: 'letter butter coffee green book feel meet need speed hello summer offer appear success accept balloon effect bottle letter accept assess collect valley ribbon letter committee committee success balloon committee apparent appreciate parallel millennium successfully assess career coffee cheese football twitter sheep door floor need keep football week steel speed wheel teeth feed deep feeling meeting keeping seeming',
  
  // Mixed punctuation practice - EXPANDED
  punctuated: [
    'Yes!', 'No.', 'Wait...', 'Really?', 'Great!', "I'm", "don't", "can't", "won't", "it's", "we're", "they're", "you're",
    'hello@email.com', 'user_name', 'file-name', '50%', '$100', '#hashtag', '@username',
    'Hi!', 'Wow!', 'Oh?', 'Hmm...', 'Indeed.', 'Perhaps?', 'Absolutely!',
    "wasn't", "isn't", "aren't", "doesn't", "wouldn't", "couldn't", "shouldn't",
    '10:30', '2024', '100%', '$50.00', '75°F', '#1', '@mention', 'user@domain.org',
  ],
  
  // Common typing patterns people use
  typicalPhrases: [
    'Thanks for your help!',
    'Looking forward to it.',
    'Let me check on that.',
    'I will get back to you soon.',
    'No problem at all.',
    'That makes sense.',
    'Could you clarify?',
    'I appreciate it.',
    'Sounds good to me.',
    'Let me know if you need anything.',
    'Happy to help!',
    'I understand completely.',
    'That works for me.',
    'See you soon!',
    'Talk to you later.',
    'Have a great weekend!',
    'Best regards,',
    'Kind regards,',
    'Thank you in advance.',
    'Please let me know.',
    'I look forward to your response.',
    'Hope to hear from you soon.',
    'Thanks again!',
    'Much appreciated.',
    'All the best,',
  ],
  
  // Real-world context (proper nouns, dates, etc.)
  realWorld: [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
    'morning', 'afternoon', 'evening', 'tonight', 'today', 'tomorrow', 'yesterday',
    'www.website.com', 'https://example.com', 'info@company.com', 'support@email.com',
    'Street', 'Avenue', 'Boulevard', 'Drive', 'Road', 'Lane',
  ],
};

/**
 * Phase-based speed and spawn rate curves
 * Speed plateaus when introducing new content, increases during mastery
 * Spawn rate inversely coordinates with speed changes
 */
function getSpeedAndSpawnRate(level: number): { speed: number; spawnRate: number } {
  // Speed curve with plateaus at major transitions
  const speedCurve = [
    // PHASE 1: Home Row (0-4) - Gentle intro
    1.2, 1.25, 1.3, 1.35, 1.4,
    // PHASE 2: Index Fingers (5-9) - Plateau then climb
    1.35, 1.4, 1.45, 1.5, 1.6,
    // PHASE 3: Top Row (10-14) - Dip for new row, then climb
    1.4, 1.45, 1.5, 1.6, 1.7,
    // PHASE 4: Bottom Row (15-19) - Dip for complexity, then climb
    1.5, 1.55, 1.65, 1.75, 1.9,
    // PHASE 5: Punctuation (20-24) - Slight dip, steady climb
    1.7, 1.75, 1.85, 1.95, 2.05,
    // PHASE 6: Numbers (25-29) - Plateau for new skill
    1.85, 1.9, 2.0, 2.1, 2.2,
    // PHASE 7: Pinky Training (30-34) - Moderate plateau
    2.0, 2.1, 2.2, 2.3, 2.4,
    // PHASE 8: Symbols (35-39) - Final push
    2.2, 2.3, 2.4, 2.5, 2.6,
    // PHASE 9: Mastery (40-50+) - Steady increase
    2.7, 2.8, 2.9, 3.0, 3.1, 3.3, 3.5, 3.7, 3.9, 4.1, 4.3,
  ];

  // Spawn rate inversely coordinated with speed
  // When speed plateaus, spawn rate can increase slightly
  const spawnCurve = [
    // PHASE 1: Home Row - Slow and steady
    2200, 2100, 2000, 1900, 1800,
    // PHASE 2: Index Fingers - More words as speed plateaus
    1850, 1750, 1650, 1600, 1500,
    // PHASE 3: Top Row - Compensate for speed dip
    1700, 1600, 1500, 1450, 1350,
    // PHASE 4: Bottom Row - Give breathing room
    1500, 1450, 1350, 1300, 1200,
    // PHASE 5: Punctuation - Balance difficulty
    1400, 1350, 1250, 1200, 1100,
    // PHASE 6: Numbers - Steady pressure
    1300, 1250, 1150, 1100, 1000,
    // PHASE 7: Pinky Training - Maintain challenge
    1200, 1100, 1050, 950, 900,
    // PHASE 8: Symbols - Increase intensity
    1100, 1000, 950, 850, 800,
    // PHASE 9: Mastery - High intensity
    750, 700, 650, 600, 550, 500, 480, 450, 420, 400, 380,
  ];

  const speed = level < speedCurve.length ? speedCurve[level] : speedCurve[speedCurve.length - 1] + (level - speedCurve.length) * 0.1;
  const spawnRate = Math.max(350, level < spawnCurve.length ? spawnCurve[level] : 350);

  return { speed, spawnRate };
}

export function getLevelConfig(level: number): LevelConfig {
  const { speed, spawnRate } = getSpeedAndSpawnRate(level);

  let pool: string[] = [];
  let description = '';

  // PHASE 1: HOME ROW MASTERY (Levels 0-4)
  if (level === 0) {
    pool = 'asdf'.split('');
    description = 'Left Home Row';
  } else if (level === 1) {
    pool = 'jkl;'.split('');
    description = 'Right Home Row';
  } else if (level === 2) {
    pool = CHAR_SETS.homeRow.split('');
    description = 'Full Home Row';
  } else if (level === 3) {
    pool = ['as', 'sad', 'add', 'dad', 'lad', 'lass', 'fall', 'all', 'ask', 'flask', 'has', 'had', 'shall', 'flash', 'slash', 'jade', 'fake', 'half', 'safe'];
    description = 'Home Row Words';
  } else if (level === 4) {
    pool = WORD_BANKS.homeHeavy.split(' ');
    description = 'Home Row Practice';
  }
  
  // PHASE 2: INDEX FINGERS EXPANSION (Levels 5-9)
  // Introduce new letters through words, not pure letter drills
  else if (level === 5) {
    // Mix new left index letters (r, f, v) with tiny words
    pool = ['rf', 'fr', 'vf', 'fv', 'far', 'for', 'raf', 'rev', ...WORD_BANKS.tiny.split(' ').slice(0, 15)];
    description = 'Left Index + Words';
  } else if (level === 6) {
    // Add right index letters (u, j, m) with more words
    pool = ['uj', 'ju', 'um', 'muj', 'jug', 'hum', 'jam', 'rum', 'fur', ...WORD_BANKS.tiny.split(' ')];
    description = 'Right Index + Words';
  } else if (level === 7) {
    // Short words emphasizing index finger movement
    pool = ['far', 'jar', 'jug', 'rug', 'fur', 'hub', 'hum', 'rub', 'tub', 'but', 'fun', 'run', 'gun', 'jab', 'gum', 'van', 'man', 'tan', 'gym', 'bay', ...WORD_BANKS.tiny.split(' ')];
    description = 'Index Finger Words';
  } else if (level === 8) {
    // Common 3-4 letter words with all learned letters
    pool = [...WORD_BANKS.tiny.split(' '), 'have', 'just', 'very', 'make', 'take', 'from', 'them', 'than', 'many', 'made', 'must', 'back', 'much', 'your', 'year', 'came'];
    description = 'Building Vocabulary';
  } else if (level === 9) {
    pool = [...WORD_BANKS.tiny.split(' '), ...WORD_BANKS.basic.split(' ')];
    description = 'Common Short Words';
  }
  
  // PHASE 3: TOP ROW INTEGRATION (Levels 10-14)
  // Introduce top row through words with those letters
  else if (level === 10) {
    // Top row letters mixed with words
    pool = ['the', 'you', 'that', 'they', 'your', 'who', 'out', 'up', 'what', 'into', 'way', 'wit', 'toy', 'try', 'yet', 'type', 'quit', 'tour', 'port', 'writ', ...WORD_BANKS.tiny.split(' '), ...WORD_BANKS.basic.split(' ').slice(0, 20)];
    description = 'Top Row Practice';
  } else if (level === 11) {
    // More words with top row emphasis
    pool = [...WORD_BANKS.basic.split(' '), 'write', 'quite', 'quiet', 'power', 'tower', 'point', 'quote', 'equal', 'require', 'poetry', 'query'];
    description = 'Top Row Words';
  } else if (level === 12) {
    pool = [...WORD_BANKS.basic.split(' '), ...WORD_BANKS.common.split(' ').slice(0, 30)];
    description = 'Common Words';
  } else if (level === 13) {
    pool = [...WORD_BANKS.basic.split(' '), ...WORD_BANKS.common.split(' '), ...WORD_BANKS.everyday.split(' ').slice(0, 20)];
    description = 'Word Building';
  } else if (level === 14) {
    pool = [...WORD_BANKS.common.split(' '), ...WORD_BANKS.verbs.split(' ').slice(0, 40)];
    description = 'Active Vocabulary';
  }
  
  // PHASE 4: BOTTOM ROW & FULL ALPHA (Levels 15-19)
  // Introduce bottom row through words containing z, x, c, v, b, n, m
  else if (level === 15) {
    // Bottom row introduced through simple words
    pool = ['can', 'man', 'van', 'ban', 'mix', 'box', 'fix', 'six', 'wax', 'zip', 'zone', 'zero', 'zoom', 'cave', 'move', 'come', 'some', 'name', 'same', 'time', 'mine', 'zone', ...WORD_BANKS.basic.split(' '), ...WORD_BANKS.common.split(' ').slice(0, 20)];
    description = 'Bottom Row Practice';
  } else if (level === 16) {
    // More bottom row words
    pool = ['next', 'example', 'between', 'complex', 'explain', 'maximum', 'citizen', 'analyze', 'crazy', 'frozen', ...WORD_BANKS.common.split(' '), ...WORD_BANKS.basic.split(' ')];
    description = 'Full Alphabet Words';
  } else if (level === 17) {
    pool = [...WORD_BANKS.patterns.split(' ').slice(0, 30), ...WORD_BANKS.doubleLetters.split(' ').slice(0, 20), ...WORD_BANKS.common.split(' ')];
    description = 'Complex Patterns';
  } else if (level === 18) {
    pool = [...WORD_BANKS.common.split(' '), ...WORD_BANKS.patterns.split(' ').slice(0, 40), ...WORD_BANKS.everyday.split(' ').slice(0, 30)];
    description = 'Mixed Challenge';
  } else if (level === 19) {
    pool = [...WORD_BANKS.verbs.split(' ').slice(0, 50), ...WORD_BANKS.common.split(' '), ...WORD_BANKS.doubleLetters.split(' ').slice(0, 25)];
    description = 'Flow Training';
  }
  
  // PHASE 5: BASIC PUNCTUATION (Levels 20-24)
  // Introduce punctuation gradually through natural usage
  else if (level === 20) {
    // Start with simple punctuated words
    pool = [...WORD_BANKS.common.split(' '), ...WORD_BANKS.everyday.split(' ').slice(0, 30), 'yes.', 'no.', 'ok.', 'hi!', 'wow!', 'stop.', 'wait.'];
    description = 'Adding Punctuation';
  } else if (level === 21) {
    // Mix punctuated and regular words
    pool = [...WORD_BANKS.common.split(' ').slice(0, 40).map(w => Math.random() > 0.7 ? w + '.' : Math.random() > 0.5 ? w + '!' : w), ...WORD_BANKS.everyday.split(' ').slice(0, 30)];
    description = 'Sentence Endings';
  } else if (level === 22) {
    pool = [...WORD_BANKS.common.split(' '), ...WORD_BANKS.punctuated.slice(0, 25)];
    description = 'Punctuation Practice';
  } else if (level === 23) {
    pool = [...WORD_BANKS.phrases.slice(0, 30), ...WORD_BANKS.typicalPhrases.slice(0, 15), ...WORD_BANKS.common.split(' ').slice(0, 20)];
    description = 'Short Phrases';
  } else if (level === 24) {
    pool = [...WORD_BANKS.phrases, ...WORD_BANKS.typicalPhrases, ...WORD_BANKS.common.split(' ').slice(0, 30)];
    description = 'Mixed Phrases';
  }
  
  // PHASE 6: NUMBERS (Levels 25-29)
  // Introduce numbers through realistic contexts
  else if (level === 25) {
    // Mix single numbers with words
    pool = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ...WORD_BANKS.realWorld.slice(0, 7), ...WORD_BANKS.common.split(' ').slice(0, 20)];
    description = 'Number Practice';
  } else if (level === 26) {
    // Numbers in context
    pool = ['10', '20', '30', '100', '2024', '365', ...WORD_BANKS.common.split(' ').slice(0, 30), ...WORD_BANKS.realWorld.slice(0, 15)];
    description = 'Words + Numbers';
  } else if (level === 27) {
    const withNumbers = ['2024', '100', '42', '365', '24/7', '3.14', '99%', '10:30', '$50', '75°F'];
    pool = [...WORD_BANKS.common.split(' '), ...WORD_BANKS.everyday.split(' ').slice(0, 30), ...withNumbers, ...WORD_BANKS.realWorld];
    description = 'Real World Text';
  } else if (level === 28) {
    pool = [...WORD_BANKS.advanced.split(' ').slice(0, 40), ...WORD_BANKS.verbs.split(' ').slice(0, 30), ...WORD_BANKS.common.split(' ').slice(0, 20)];
    description = 'Advanced Words';
  } else if (level === 29) {
    pool = [...WORD_BANKS.common.split(' '), ...WORD_BANKS.advanced.split(' ').slice(0, 50), ...WORD_BANKS.everyday.split(' ').slice(0, 30)];
    description = 'Vocabulary Mix';
  }
  
  // PHASE 7: PINKY TRAINING (Levels 30-34)
  // Focus on challenging pinky finger words, not isolated letters
  else if (level === 30) {
    // Words emphasizing pinky reach
    pool = ['quiz', 'queen', 'square', 'equal', 'quality', 'quarter', 'squeeze', 'require', 'acquire', 'plop', 'plus', 'place', 'please', 'ople', ...WORD_BANKS.patterns.split(' ').slice(0, 30), ...WORD_BANKS.common.split(' ').slice(0, 20)];
    description = 'Pinky Challenge';
  } else if (level === 31) {
    // Difficult letter combinations
    pool = [...WORD_BANKS.patterns.split(' ').slice(0, 40), ...WORD_BANKS.leftHandHeavy.split(' '), ...WORD_BANKS.common.split(' ').slice(0, 20)];
    description = 'Complex Combos';
  } else if (level === 32) {
    // Quotes and contractions
    pool = [...WORD_BANKS.punctuated, ...WORD_BANKS.typicalPhrases.slice(0, 15), ...WORD_BANKS.common.split(' ').slice(0, 20)];
    description = 'Quotes & Contractions';
  } else if (level === 33) {
    pool = [...WORD_BANKS.advanced.split(' ').slice(0, 50), ...WORD_BANKS.phrases.slice(0, 20), ...WORD_BANKS.typicalPhrases];
    description = 'Refined Practice';
  } else if (level === 34) {
    pool = [...WORD_BANKS.common.split(' '), ...WORD_BANKS.advanced.split(' ').slice(0, 60), ...WORD_BANKS.phrases.slice(0, 30), ...WORD_BANKS.everyday.split(' ').slice(0, 40)];
    description = 'Full Vocabulary';
  }
  
  // PHASE 8: SYMBOLS & BRACKETS (Levels 35-39)
  else if (level === 35) {
    pool = [...CHAR_SETS.brackets.split(''), ...WORD_BANKS.common.split(' ')];
    description = 'Brackets & Braces';
  } else if (level === 36) {
    pool = [...WORD_BANKS.common.split(' '), ...WORD_BANKS.everyday.split(' '), ...CHAR_SETS.brackets.split('')];
    description = 'Words + Brackets';
  } else if (level === 37) {
    pool = [...CHAR_SETS.symbols.split(''), ...WORD_BANKS.punctuated, ...WORD_BANKS.realWorld];
    description = 'Special Symbols';
  } else if (level === 38) {
    pool = [...WORD_BANKS.advanced.split(' '), ...WORD_BANKS.everyday.split(' '), ...CHAR_SETS.symbols.split(''), ...WORD_BANKS.punctuated];
    description = 'Symbol Integration';
  } else if (level === 39) {
    pool = [...WORD_BANKS.punctuated, ...WORD_BANKS.typicalPhrases, ...WORD_BANKS.realWorld];
    description = 'Real-World Text';
  }
  
  // PHASE 9: MASTER TYPING (Levels 40-49)
  else if (level >= 40 && level < 45) {
    // Mix everything with emphasis on natural text
    pool = [
      ...WORD_BANKS.common.split(' '),
      ...WORD_BANKS.advanced.split(' '),
      ...WORD_BANKS.patterns.split(' '),
      ...WORD_BANKS.everyday.split(' '),
      ...WORD_BANKS.verbs.split(' '),
      ...WORD_BANKS.phrases,
      ...WORD_BANKS.typicalPhrases,
      ...WORD_BANKS.punctuated,
    ];
    description = `Master Level ${level - 39}`;
  } else if (level >= 45 && level < 50) {
    // Full spectrum
    pool = [
      ...WORD_BANKS.common.split(' '),
      ...WORD_BANKS.advanced.split(' '),
      ...WORD_BANKS.patterns.split(' '),
      ...WORD_BANKS.everyday.split(' '),
      ...WORD_BANKS.verbs.split(' '),
      ...WORD_BANKS.phrases,
      ...WORD_BANKS.typicalPhrases,
      ...WORD_BANKS.punctuated,
      ...WORD_BANKS.realWorld,
      ...CHAR_SETS.brackets.split(''),
      ...CHAR_SETS.symbols.slice(0, 5).split(''), // Some symbols
    ];
    description = `Expert Level ${level - 44}`;
  } else {
    // Level 50: Everything
    pool = [
      ...WORD_BANKS.common.split(' '),
      ...WORD_BANKS.advanced.split(' '),
      ...WORD_BANKS.patterns.split(' '),
      ...WORD_BANKS.everyday.split(' '),
      ...WORD_BANKS.verbs.split(' '),
      ...WORD_BANKS.doubleLetters.split(' '),
      ...WORD_BANKS.phrases,
      ...WORD_BANKS.typicalPhrases,
      ...WORD_BANKS.punctuated,
      ...WORD_BANKS.realWorld,
      ...CHAR_SETS.brackets.split(''),
      ...CHAR_SETS.symbols.split(''),
    ];
    description = 'ULTIMATE TYPING';
  }

  return { speed, spawnRate, pool, description };
}

