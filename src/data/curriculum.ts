import { StationMeta, VerbType } from '../types/learning';
import { ConjugationEntry } from '../utils/arabicHelpers';

import heroPortalsImg from '../assets/images/hero_time_portals_1794911219872.jpg';
import guidePortraitImg from '../assets/images/guide_character_portrait_1794911219836.jpg';
import pastLibraryImg from '../assets/images/scene_past_library_1794911221327.jpg';
import presentReadingImg from '../assets/images/scene_present_future_reading_1794911221520.jpg';
import imperativeTeamworkImg from '../assets/images/scene_imperative_teamwork_1794911221872.jpg';
import readingCornerProjectImg from '../assets/images/scene_reading_corner_project_1794911221100.jpg';

export const ASSETS = {
  heroPortals: heroPortalsImg,
  guidePortrait: guidePortraitImg,
  pastLibrary: pastLibraryImg,
  presentReading: presentReadingImg,
  imperativeTeamwork: imperativeTeamworkImg,
  readingCornerProject: readingCornerProjectImg,
};

export const STATIONS: StationMeta[] = [
  {
    id: 'a1',
    order: 1,
    code: 'A1',
    title: 'ذاكرة الأفعال',
    subtitle: 'تنشيط المعرفة السابقة',
    description: 'نلاحظ الحدث والقرينة الزمنية في مشاهد من حياتنا المدرسية.',
  },
  {
    id: 'a2',
    order: 2,
    code: 'A2',
    title: 'مختبر الزمن اللغوي',
    subtitle: 'بوابة الزمن',
    description: 'نستكشف خط الزمن ونفرّق بين الحدث الذي وقع، والحدث الجاري أو المتوقع، والطلب.',
    requiresPrevious: 'a1',
  },
  {
    id: 'a3',
    order: 3,
    code: 'A3',
    title: 'محطة الفعل الماضي',
    subtitle: 'مملكة الأحداث التي وقعت',
    description: 'نكتشف الفعل الماضي، ونصطاد الأفعال، ونتدرب على إسناده إلى الضمائر التسعة.',
    requiresPrevious: 'a2',
  },
  {
    id: 'a4',
    order: 4,
    code: 'A4',
    title: 'محطة الفعل المضارع',
    subtitle: 'مدينة الآن وغداً',
    description: 'نكتشف أحرف المضارعة «نأتي»، ودلالة المضارع على الحاضر والمستقبل، وإسناده.',
    requiresPrevious: 'a3',
  },
  {
    id: 'a5',
    order: 5,
    code: 'A5',
    title: 'محطة فعل الأمر',
    subtitle: 'مدينة الطلبات الذكية',
    description: 'نميّز أسلوب الطلب عن الخبر، ونسند فعل الأمر إلى ضمائر المخاطب الخمسة.',
    requiresPrevious: 'a4',
  },
  {
    id: 'a6',
    order: 6,
    code: 'A6',
    title: 'المحقق اللغوي',
    subtitle: 'مهمة كشف الأفعال',
    description: 'نقرأ نصاً قصيراً ونستخرج الأفعال الستة ونصنّفها إلى ماضٍ ومضارع وأمر.',
    requiresPrevious: 'a5',
  },
  {
    id: 'a7',
    order: 7,
    code: 'A7',
    title: 'ورشة الجمل',
    subtitle: 'أنا صانع الجمل',
    description: 'ننتج جملاً من إنشائنا توظف الماضي والمضارع والأمر ونراجعها ذاتياً.',
    requiresPrevious: 'a6',
  },
  {
    id: 'quiz',
    order: 8,
    code: 'التقويم',
    title: 'الاختبار الختامي',
    subtitle: 'التحدي النهائي (13 سؤالاً)',
    description: 'نقيس ما تعلمناه في رحلتنا من خلال ثلاثة عشر سؤالاً متنوعاً.',
    requiresPrevious: 'a7',
  },
  {
    id: 'a8',
    order: 9,
    code: 'A8',
    title: 'مهمة ركن القراءة',
    subtitle: 'نجهّز ركن القراءة',
    description: 'نعدّ بطاقة عمل فريقنا لتنظيم ركن القراءة وتوظيف الأفعال الثلاثة في مشروع واقعي.',
    requiresPrevious: 'quiz',
  },
  {
    id: 'results',
    order: 10,
    code: 'الملف',
    title: 'النتائج وملف المهارات',
    subtitle: 'أنجزت رحلتك اللغوية!',
    description: 'نستعرض ملخص المهارات، وإسناد الماضي، وحالة المهمة الأدائية، وفرص المراجعة.',
    requiresPrevious: 'a8',
  },
];

// A1: Activation Questions
export interface A1Question {
  id: string;
  sentence: string;
  clueWord: string;
  eventWord: string;
  prompt: string;
  correctOption: 'yesterday' | 'now' | 'request';
  successExplanation: string;
  hint1: string;
  hint2: string;
  parallelExample: string;
}

export const A1_OPTIONS = [
  { id: 'yesterday', label: 'أمسِ (حدثٌ انتهى)' },
  { id: 'now', label: 'الآنَ (حدثٌ يقعُ الآن)' },
  { id: 'request', label: 'طلبٌ من شخصٍ أن يفعلَ شيئاً' },
] as const;

export const A1_QUESTIONS: A1Question[] = [
  {
    id: 'a1_q1',
    sentence: 'تقرأُ سلمى قصةً ممتعةً الآنَ.',
    clueWord: 'الآنَ',
    eventWord: 'تقرأُ',
    prompt: 'ما القرينةُ أو المعنى الذي يدلُّ عليهِ زمنُ الحدثِ في الجملةِ؟',
    correctOption: 'now',
    successExplanation:
      'أحسنت! الفعلُ «تقرأُ» يدلُّ على حدثِ القراءةِ، والقرينةُ «الآنَ» تُرشدنا إلى أنَّ الحدثَ يقعُ في الوقتِ الحاضرِ.',
    hint1: 'ما الكلمةُ التي تدلُّ على الحدثِ؟ وما القرينةُ التي تساعدُك؟',
    hint2: 'تأمّل آخرَ كلمةٍ في الجملةِ: «الآنَ» — هل تعني وقتاً مضى أم وقتاً حاضراً أم طلباً؟',
    parallelExample: 'مثالٌ مشابهٌ: «يكتبُ طارقٌ التقريرَ الآنَ» — الحدثُ يقعُ في اللحظةِ الحاضرةِ.',
  },
  {
    id: 'a1_q2',
    sentence: 'يا طارقُ، ضعِ الكتابَ على الرفِّ.',
    clueWord: 'ضعِ',
    eventWord: 'ضعِ',
    prompt: 'ما الذي تعبّرُ عنهُ هذهِ الجملةُ؟',
    correctOption: 'request',
    successExplanation:
      'رائع! كلمةُ «ضعِ» لم تُخبرنا عن حدثٍ وقعَ أمسِ أو يقعُ الآنَ، بل هي طلبٌ موجَّهٌ إلى طارقٍ ليقومَ بوضعِ الكتابِ.',
    hint1: 'ما الكلمةُ التي تدلُّ على الحدثِ؟ وما القرينةُ التي تساعدُك؟',
    hint2: 'لاحظ أنَّ الجملةَ تخاطبُ طارقاً مباشرةً وتطلبُ منهُ القيامَ بعملٍ معيَّنٍ.',
    parallelExample: 'مثالٌ مشابهٌ: «يا سلمى، افتحي النافذةَ» — هنا توجيهٌ وطلبٌ من المخاطبةِ.',
  },
];

// A2: Timeline Lab Comparison Activity
export interface A2CompareItem {
  id: string;
  sentence: string;
  correctType: 'inform' | 'request';
  explanation: string;
}

export const A2_COMPARE_ITEMS: A2CompareItem[] = [
  {
    id: 'cmp1',
    sentence: 'رتّبَ الطلابُ رفوفَ المكتبةِ أمسِ.',
    correctType: 'inform',
    explanation: 'هذه الجملةُ تُخبرنا عن حدثٍ وقعَ وانتهى قبلَ لحظةِ التكلمِ (أمسِ).',
  },
  {
    id: 'cmp2',
    sentence: 'افتحِ الكتابَ واقرأِ الصفحةَ الأولى.',
    correctType: 'request',
    explanation: 'هذه الجملةُ لا تخبرُ عن حدثٍ واقعٍ على خطِّ الزمنِ، بل تطلبُ من المخاطبِ أن يفعلَ شيئاً.',
  },
  {
    id: 'cmp3',
    sentence: 'يزورُ فريقُنا معرضَ الكتابِ غداً.',
    correctType: 'inform',
    explanation: 'هذه الجملةُ تخبرنا عن حدثٍ متوقَّعٍ بعدَ لحظةِ التكلمِ (غداً).',
  },
  {
    id: 'cmp4',
    sentence: 'حافظوا على هدوءِ ركنِ القراءةِ.',
    correctType: 'request',
    explanation: 'هذه الجملةُ موجَّهةٌ إلى المخاطبينَ وتطلبُ منهمُ الالتزامَ بالهدوءِ.',
  },
];

// A3: Past Tense Station
export interface A3IntroScene {
  id: string;
  sentenceParts: Array<{ text: string; isVerb: boolean }>;
  verb: string;
  meaning: string;
  iconName: 'pen' | 'book' | 'books' | 'tree';
}

export const A3_INTRO_SCENES: A3IntroScene[] = [
  {
    id: 'intro_1',
    sentenceParts: [
      { text: 'كتبَ', isVerb: true },
      { text: 'طفلٌ', isVerb: false },
      { text: 'رسالةً.', isVerb: false },
    ],
    verb: 'كتبَ',
    meaning: 'حدثُ الكتابةِ وقعَ وانتهى قبلَ أن نتكلَّمَ.',
    iconName: 'pen',
  },
  {
    id: 'intro_2',
    sentenceParts: [
      { text: 'قرأتْ', isVerb: true },
      { text: 'طالبةٌ', isVerb: false },
      { text: 'قصةً.', isVerb: false },
    ],
    verb: 'قرأتْ',
    meaning: 'حدثُ القراءةِ اكتملَ وانتهى في الزمنِ الماضي.',
    iconName: 'book',
  },
  {
    id: 'intro_3',
    sentenceParts: [
      { text: 'جمعَ', isVerb: true },
      { text: 'الطلابُ', isVerb: false },
      { text: 'الكتبَ.', isVerb: false },
    ],
    verb: 'جمعَ',
    meaning: 'الطلابُ أتمّوا جمعَ الكتبِ في وقتٍ مضى.',
    iconName: 'books',
  },
  {
    id: 'intro_4',
    sentenceParts: [
      { text: 'زرعَ', isVerb: true },
      { text: 'طفلٌ', isVerb: false },
      { text: 'شجرةً.', isVerb: false },
    ],
    verb: 'زرعَ',
    meaning: 'زراعةُ الشجرةِ حدثٌ قد تمَّ وانتهى بالفعلِ.',
    iconName: 'tree',
  },
];

export interface VerbHunterToken {
  id: string;
  word: string;
  isPastVerb: boolean;
  reason: string;
}

export const A3_HUNTER_SENTENCES: Array<{
  id: string;
  tokens: VerbHunterToken[];
}> = [
  {
    id: 'hs1',
    tokens: [
      {
        id: 'h1_1',
        word: 'نظّفَ',
        isPastVerb: true,
        reason: '«نظّفَ» فعلٌ ماضٍ؛ لأنَّهُ يدلُّ على حدثِ التنظيفِ الذي وقعَ وانتهى.',
      },
      {
        id: 'h1_2',
        word: 'أحمدُ',
        isPastVerb: false,
        reason: '«أحمدُ» اسمُ علمٍ يدلُّ على شخصٍ ولا يرتبطُ بزمنٍ.',
      },
      {
        id: 'h1_3',
        word: 'طاولةَ',
        isPastVerb: false,
        reason: '«طاولةَ» اسمٌ يدلُّ على جمادٍ ولا يدلُّ على حدثٍ مقترنٍ بزمنٍ.',
      },
      {
        id: 'h1_4',
        word: 'المكتبةِ.',
        isPastVerb: false,
        reason: '«المكتبةِ» اسمُ مكانٍ يقبلُ «ال» التعريفَ، وليس فعلاً.',
      },
    ],
  },
  {
    id: 'hs2',
    tokens: [
      {
        id: 'h2_1',
        word: 'علّقتْ',
        isPastVerb: true,
        reason: '«علّقتْ» فعلٌ ماضٍ؛ يدلُّ على حدثِ التعليقِ الذي انتهى في الماضي.',
      },
      {
        id: 'h2_2',
        word: 'لينا',
        isPastVerb: false,
        reason: '«لينا» اسمُ فتاةٍ، والأسماءُ لا تدلُّ على حدثٍ وزمنٍ.',
      },
      {
        id: 'h2_3',
        word: 'لوحةً',
        isPastVerb: false,
        reason: '«لوحةً» اسمٌ يدلُّ على شيءٍ مرسومٍ، وليس فعلاً.',
      },
      {
        id: 'h2_4',
        word: 'جميلةً.',
        isPastVerb: false,
        reason: '«جميلةً» اسمٌ (صفةٌ) يقبلُ التنوينَ، وليس فعلاً.',
      },
    ],
  },
  {
    id: 'hs3',
    tokens: [
      {
        id: 'h3_1',
        word: 'وزّعَ',
        isPastVerb: true,
        reason: '«وزّعَ» فعلٌ ماضٍ؛ يدلُّ على حدثِ التوزيعِ قبلَ لحظةِ التكلمِ.',
      },
      {
        id: 'h3_2',
        word: 'الأطفالُ',
        isPastVerb: false,
        reason: '«الأطفالُ» اسمٌ يبدأُ بـ«ال» التعريفِ.',
      },
      {
        id: 'h3_3',
        word: 'القصصَ',
        isPastVerb: false,
        reason: '«القصصَ» اسمُ جمعٍ لشيءٍ يُقرأُ، وليس فعلاً.',
      },
      {
        id: 'h3_4',
        word: 'الجديدةَ.',
        isPastVerb: false,
        reason: '«الجديدةَ» اسمٌ يصفُ القصصَ، وليس حدثاً.',
      },
    ],
  },
];

// A3 Conjugation Tables (All 9 Curriculum Pronouns)
export const PAST_REFERENCE_DARASA = [
  { pronoun: 'أنا', form: 'درَسْتُ', highlight: 'تُ', note: 'تاءُ المتكلّمِ المضمومةُ' },
  { pronoun: 'نحن', form: 'درَسْنا', highlight: 'نا', note: 'نا الفاعلينَ' },
  { pronoun: 'أنتِ', form: 'درَسْتِ', highlight: 'تِ', note: 'تاءُ المخاطَبةِ المكسورةُ' },
  { pronoun: 'أنتَ', form: 'درَسْتَ', highlight: 'تَ', note: 'تاءُ المخاطَبِ المفتوحةُ' },
  { pronoun: 'أنتما', form: 'درَسْتُما', highlight: 'تُما', note: 'تاءُ المخاطبَينِ المثنّى' },
  { pronoun: 'أنتم', form: 'درَسْتُمْ', highlight: 'تُمْ', note: 'ضميرُ جمعِ المخاطبينَ' },
  { pronoun: 'هما', form: 'درَسا / درَسَتا', highlight: 'ا / تا', note: 'ألفُ الاثنينِ (للمذكرِ درَسا، وللمؤنثِ درَسَتا)' },
  { pronoun: 'هم', form: 'درَسوا', highlight: 'وا', note: 'واوُ الجماعةِ مع الألفِ الفارقةِ' },
  { pronoun: 'هنّ', form: 'درَسْنَ', highlight: 'نَ', note: 'نونُ النسوةِ المفتوحةُ' },
];

export const SHURB_CONJUGATION: ConjugationEntry[] = [
  {
    pronounId: 'ana',
    pronounLabel: 'أنا',
    validForms: ['شرِبْتُ', 'شربتُ'],
    requireFinalDiacritic: '\u064F',
    suffixHint: 'مع «أنا» نُلحقُ بالفعلِ تاءً مضمومةً (ـتُ).',
  },
  {
    pronounId: 'nahnu',
    pronounLabel: 'نحن',
    validForms: ['شرِبْنا', 'شربنا'],
    suffixHint: 'مع «نحن» نُلحقُ بالفعلِ (ـنا) للدلالةِ على الجماعةِ المتكلمةِ.',
  },
  {
    pronounId: 'anti',
    pronounLabel: 'أنتِ',
    validForms: ['شرِبْتِ', 'شربتِ'],
    requireFinalDiacritic: '\u0650',
    suffixHint: 'مع «أنتِ» نُلحقُ بالفعلِ تاءً مكسورةً (ـتِ).',
  },
  {
    pronounId: 'anta',
    pronounLabel: 'أنتَ',
    validForms: ['شرِبْتَ', 'شربتَ'],
    requireFinalDiacritic: '\u064E',
    suffixHint: 'مع «أنتَ» نُلحقُ بالفعلِ تاءً مفتوحةً (ـتَ).',
  },
  {
    pronounId: 'antuma',
    pronounLabel: 'أنتما',
    validForms: ['شرِبْتُما', 'شربتما'],
    suffixHint: 'مع «أنتما» نُلحقُ بالفعلِ (ـتُما) للمثنّى المخاطبِ.',
  },
  {
    pronounId: 'antum',
    pronounLabel: 'أنتم',
    validForms: ['شرِبْتُمْ', 'شربتم'],
    suffixHint: 'مع «أنتم» نُلحقُ بالفعلِ (ـتُمْ) لجمعِ المذكرِ المخاطبِ.',
  },
  {
    pronounId: 'huma',
    pronounLabel: 'هما',
    validForms: ['شرِبا', 'شربا', 'شرِبَتا', 'شربتا'],
    suffixHint: 'مع «هما» نُلحقُ ألفَ الاثنينِ (شَرِبا أو شَرِبَتا).',
  },
  {
    pronounId: 'hum',
    pronounLabel: 'هم',
    validForms: ['شرِبوا', 'شربوا'],
    suffixHint: 'مع «هم» نُلحقُ واوَ الجماعةِ وبعدَها الألفُ الفارقةُ (ـوا).',
  },
  {
    pronounId: 'hunna',
    pronounLabel: 'هنّ',
    validForms: ['شرِبْنَ', 'شربنَ', 'شربن'],
    suffixHint: 'مع «هنّ» نُلحقُ نونَ النسوةِ المفتوحةَ (ـنَ).',
  },
];

export const SAMA_CONJUGATION: ConjugationEntry[] = [
  {
    pronounId: 'ana',
    pronounLabel: 'أنا',
    validForms: ['سمِعْتُ', 'سمعتُ'],
    requireFinalDiacritic: '\u064F',
    suffixHint: 'مع «أنا» نُلحقُ بالفعلِ تاءً مضمومةً (ـتُ).',
  },
  {
    pronounId: 'nahnu',
    pronounLabel: 'نحن',
    validForms: ['سمِعْنا', 'سمعنا'],
    suffixHint: 'مع «نحن» نُلحقُ بالفعلِ (ـنا).',
  },
  {
    pronounId: 'anti',
    pronounLabel: 'أنتِ',
    validForms: ['سمِعْتِ', 'سمعتِ'],
    requireFinalDiacritic: '\u0650',
    suffixHint: 'مع «أنتِ» نُلحقُ بالفعلِ تاءً مكسورةً (ـتِ).',
  },
  {
    pronounId: 'anta',
    pronounLabel: 'أنتَ',
    validForms: ['سمِعْتَ', 'سمعتَ'],
    requireFinalDiacritic: '\u064E',
    suffixHint: 'مع «أنتَ» نُلحقُ بالفعلِ تاءً مفتوحةً (ـتَ).',
  },
  {
    pronounId: 'antuma',
    pronounLabel: 'أنتما',
    validForms: ['سمِعْتُما', 'سمعتما'],
    suffixHint: 'مع «أنتما» نُلحقُ بالفعلِ (ـتُما).',
  },
  {
    pronounId: 'antum',
    pronounLabel: 'أنتم',
    validForms: ['سمِعْتُمْ', 'سمعتم'],
    suffixHint: 'مع «أنتم» نُلحقُ بالفعلِ (ـتُمْ).',
  },
  {
    pronounId: 'huma',
    pronounLabel: 'هما',
    validForms: ['سمِعا', 'سمعا', 'سمِعَتا', 'سمعتا'],
    suffixHint: 'مع «هما» نُلحقُ ألفَ الاثنينِ (سَمِعا أو سَمِعَتا).',
  },
  {
    pronounId: 'hum',
    pronounLabel: 'هم',
    validForms: ['سمِعوا', 'سمعوا'],
    suffixHint: 'مع «هم» نُلحقُ واوَ الجماعةِ مع الألفِ الفارقةِ (ـوا).',
  },
  {
    pronounId: 'hunna',
    pronounLabel: 'هنّ',
    validForms: ['سمِعْنَ', 'سمعنَ', 'سمعن'],
    suffixHint: 'مع «هنّ» نُلحقُ نونَ النسوةِ (ـنَ).',
  },
];

// A4: Present Tense Station
export const NAATI_LETTERS = [
  {
    letter: 'ن',
    pronoun: 'نحن',
    exampleSentence: 'نرتّبُ الكتبَ في ركنِ القراءةِ الآنَ.',
    verb: 'نرتّبُ',
    note: 'تبدأُ بالنونِ عندما يتكلمُ الجمعُ عن أنفسِهم (نحن).',
  },
  {
    letter: 'أ',
    pronoun: 'أنا',
    exampleSentence: 'أكتبُ أسماءَ القصصِ على البطاقاتِ.',
    verb: 'أكتبُ',
    note: 'تبدأُ بالهمزةِ عندما يتكلمُ المفردُ عن نفسهِ (أنا).',
  },
  {
    letter: 'ت',
    pronoun: 'هي / أنتَ',
    exampleSentence: 'ترسمُ ليلى لوحةً جميلةً للمكتبةِ.',
    verb: 'ترسمُ',
    note: 'تبدأُ بالتاءِ للمخاطَبِ (أنتَ) أو الغائبةِ (هي).',
  },
  {
    letter: 'ي',
    pronoun: 'هو',
    exampleSentence: 'يقرأُ خالدٌ قصةً جديدةً غداً.',
    verb: 'يقرأُ',
    note: 'تبدأُ بالياءِ للغائبِ المذكرِ (هو) أو للجمعِ الغائبِ (هم).',
  },
];

export const A4_CONVERSION_ITEMS = [
  {
    id: 'conv1',
    pastVerb: 'كتَبَ',
    pronoun: 'أنا',
    options: ['أكتبُ', 'نكتبُ', 'تكتبُ', 'يكتبُ'],
    correct: 'أكتبُ',
    hint: 'الضميرُ «أنا» يناسبهُ حرفُ المضارعةِ (أ).',
  },
  {
    id: 'conv2',
    pastVerb: 'زرَعَ',
    pronoun: 'نحن',
    options: ['أزرعُ', 'تزرعُ', 'نزرعُ', 'يزرعُ'],
    correct: 'نزرعُ',
    hint: 'الضميرُ «نحن» يناسبهُ حرفُ المضارعةِ (ن).',
  },
  {
    id: 'conv3',
    pastVerb: 'قرأَ',
    pronoun: 'هو',
    options: ['تقرأُ', 'يقرأُ', 'أقرأُ', 'نقرأُ'],
    correct: 'يقرأُ',
    hint: 'الضميرُ «هو» يناسبهُ حرفُ المضارعةِ (ي).',
  },
  {
    id: 'conv4',
    pastVerb: 'رسَمَ',
    pronoun: 'هي',
    options: ['يرسمُ', 'ترسمُ', 'أرسمُ', 'نرسمُ'],
    correct: 'ترسمُ',
    hint: 'الضميرُ «هي» يناسبهُ حرفُ المضارعةِ (ت).',
  },
  {
    id: 'conv5',
    pastVerb: 'فتَحَ',
    pronoun: 'هم',
    options: ['يفتحونَ', 'تفتحونَ', 'نفتحُ', 'يفتحْ'],
    correct: 'يفتحونَ',
    hint: 'الضميرُ «هم» يبدأُ بـ(ي) وينتهي بواوِ الجماعةِ والنونِ (يفتحونَ).',
  },
];

export interface PresentConjugationVerb {
  id: string;
  baseLabel: string;
  entries: Array<{
    pronounId: string;
    pronounLabel: string;
    prefixLetter: string;
    stem: string;
    validForms: string[];
    suffixHint: string;
  }>;
}

export const A4_PRESENT_VERBS: PresentConjugationVerb[] = [
  {
    id: 'p_kataba',
    baseLabel: 'يكتبُ (من: كتَبَ)',
    entries: [
      { pronounId: 'ana', pronounLabel: 'أنا', prefixLetter: 'أ', stem: 'كتبُ', validForms: ['أكتبُ', 'أكتب'], suffixHint: 'يبدأُ بحرفِ المضارعةِ (أ).' },
      { pronounId: 'nahnu', pronounLabel: 'نحن', prefixLetter: 'ن', stem: 'كتبُ', validForms: ['نكتبُ', 'نكتب'], suffixHint: 'يبدأُ بحرفِ المضارعةِ (ن).' },
      { pronounId: 'anta', pronounLabel: 'أنتَ', prefixLetter: 'ت', stem: 'كتبُ', validForms: ['تكتبُ', 'تكتب'], suffixHint: 'يبدأُ بحرفِ المضارعةِ (ت).' },
      { pronounId: 'anti', pronounLabel: 'أنتِ', prefixLetter: 'ت', stem: 'كتبينَ', validForms: ['تكتبينَ', 'تكتبين'], suffixHint: 'يبدأُ بـ(ت) وينتهي بياءِ المخاطبةِ والنونِ (تكتبينَ).' },
      { pronounId: 'huwa', pronounLabel: 'هو', prefixLetter: 'ي', stem: 'كتبُ', validForms: ['يكتبُ', 'يكتب'], suffixHint: 'يبدأُ بحرفِ المضارعةِ (ي).' },
      { pronounId: 'hiya', pronounLabel: 'هي', prefixLetter: 'ت', stem: 'كتبُ', validForms: ['تكتبُ', 'تكتب'], suffixHint: 'يبدأُ بحرفِ المضارعةِ (ت).' },
      { pronounId: 'hum', pronounLabel: 'هم', prefixLetter: 'ي', stem: 'كتبونَ', validForms: ['يكتبونَ', 'يكتبون'], suffixHint: 'يبدأُ بـ(ي) وينتهي بـ(ونَ).' },
      { pronounId: 'hunna', pronounLabel: 'هنّ', prefixLetter: 'ي', stem: 'كتبْنَ', validForms: ['يكتبْنَ', 'يكتبنَ', 'يكتبن'], suffixHint: 'يبدأُ بـ(ي) وينتهي بنونِ النسوةِ (يكتبْنَ).' },
    ],
  },
  {
    id: 'p_qaraa',
    baseLabel: 'يقرأُ (من: قرأَ)',
    entries: [
      { pronounId: 'ana', pronounLabel: 'أنا', prefixLetter: 'أ', stem: 'قرأُ', validForms: ['أقرأُ', 'أقرأ'], suffixHint: 'يبدأُ بـ(أ): أقرأُ.' },
      { pronounId: 'nahnu', pronounLabel: 'نحن', prefixLetter: 'ن', stem: 'قرأُ', validForms: ['نقرأُ', 'نقرأ'], suffixHint: 'يبدأُ بـ(ن): نقرأُ.' },
      { pronounId: 'anta', pronounLabel: 'أنتَ', prefixLetter: 'ت', stem: 'قرأُ', validForms: ['تقرأُ', 'تقرأ'], suffixHint: 'يبدأُ بـ(ت): تقرأُ.' },
      { pronounId: 'anti', pronounLabel: 'أنتِ', prefixLetter: 'ت', stem: 'قرئينَ', validForms: ['تقرئينَ', 'تقرئين', 'تقرأين', 'تقرءين'], suffixHint: 'مع «أنتِ»: تقرئينَ.' },
      { pronounId: 'huwa', pronounLabel: 'هو', prefixLetter: 'ي', stem: 'قرأُ', validForms: ['يقرأُ', 'يقرأ'], suffixHint: 'يبدأُ بـ(ي): يقرأُ.' },
      { pronounId: 'hiya', pronounLabel: 'هي', prefixLetter: 'ت', stem: 'قرأُ', validForms: ['تقرأُ', 'تقرأ'], suffixHint: 'يبدأُ بـ(ت): تقرأُ.' },
      { pronounId: 'hum', pronounLabel: 'هم', prefixLetter: 'ي', stem: 'قرؤونَ', validForms: ['يقرؤونَ', 'يقرؤون', 'يقرأون', 'يقرءون'], suffixHint: 'مع «هم»: يقرؤونَ.' },
      { pronounId: 'hunna', pronounLabel: 'هنّ', prefixLetter: 'ي', stem: 'قرأْنَ', validForms: ['يقرأْنَ', 'يقرأنَ', 'يقرأن'], suffixHint: 'مع «هنّ»: يقرأْنَ.' },
    ],
  },
  {
    id: 'p_rasama',
    baseLabel: 'يرسمُ (من: رسَمَ)',
    entries: [
      { pronounId: 'ana', pronounLabel: 'أنا', prefixLetter: 'أ', stem: 'رسمُ', validForms: ['أرسمُ', 'أرسم'], suffixHint: 'مع «أنا»: أرسمُ.' },
      { pronounId: 'nahnu', pronounLabel: 'نحن', prefixLetter: 'ن', stem: 'رسمُ', validForms: ['نرسمُ', 'نرسم'], suffixHint: 'مع «نحن»: نرسمُ.' },
      { pronounId: 'anta', pronounLabel: 'أنتَ', prefixLetter: 'ت', stem: 'رسمُ', validForms: ['ترسمُ', 'ترسم'], suffixHint: 'مع «أنتَ»: ترسمُ.' },
      { pronounId: 'anti', pronounLabel: 'أنتِ', prefixLetter: 'ت', stem: 'رسمينَ', validForms: ['ترسمينَ', 'ترسمين'], suffixHint: 'مع «أنتِ»: ترسمينَ.' },
      { pronounId: 'huwa', pronounLabel: 'هو', prefixLetter: 'ي', stem: 'رسمُ', validForms: ['يرسمُ', 'يرسم'], suffixHint: 'مع «هو»: يرسمُ.' },
      { pronounId: 'hiya', pronounLabel: 'هي', prefixLetter: 'ت', stem: 'رسمُ', validForms: ['ترسمُ', 'ترسم'], suffixHint: 'مع «هي»: ترسمُ.' },
      { pronounId: 'hum', pronounLabel: 'هم', prefixLetter: 'ي', stem: 'رسمونَ', validForms: ['يرسمونَ', 'يرسمون'], suffixHint: 'مع «هم»: يرسمونَ.' },
      { pronounId: 'hunna', pronounLabel: 'هنّ', prefixLetter: 'ي', stem: 'رسمْنَ', validForms: ['يرسمْنَ', 'يرسمنَ', 'يرسمن'], suffixHint: 'مع «هنّ»: يرسمْنَ.' },
    ],
  },
  {
    id: 'p_fataha',
    baseLabel: 'يفتحُ (من: فتَحَ)',
    entries: [
      { pronounId: 'ana', pronounLabel: 'أنا', prefixLetter: 'أ', stem: 'فتحُ', validForms: ['أفتحُ', 'أفتح'], suffixHint: 'مع «أنا»: أفتحُ.' },
      { pronounId: 'nahnu', pronounLabel: 'نحن', prefixLetter: 'ن', stem: 'فتحُ', validForms: ['نفتحُ', 'نفتح'], suffixHint: 'مع «نحن»: نفتحُ.' },
      { pronounId: 'anta', pronounLabel: 'أنتَ', prefixLetter: 'ت', stem: 'فتحُ', validForms: ['تفتحُ', 'تفتح'], suffixHint: 'مع «أنتَ»: تفتحُ.' },
      { pronounId: 'anti', pronounLabel: 'أنتِ', prefixLetter: 'ت', stem: 'فتحينَ', validForms: ['تفتحينَ', 'تفتحين'], suffixHint: 'مع «أنتِ»: تفتحينَ.' },
      { pronounId: 'huwa', pronounLabel: 'هو', prefixLetter: 'ي', stem: 'فتحُ', validForms: ['يفتحُ', 'يفتح'], suffixHint: 'مع «هو»: يفتحُ.' },
      { pronounId: 'hiya', pronounLabel: 'هي', prefixLetter: 'ت', stem: 'فتحُ', validForms: ['تفتحُ', 'تفتح'], suffixHint: 'مع «هي»: تفتحُ.' },
      { pronounId: 'hum', pronounLabel: 'هم', prefixLetter: 'ي', stem: 'فتحونَ', validForms: ['يفتحونَ', 'يفتحون'], suffixHint: 'مع «هم»: يفتحونَ.' },
      { pronounId: 'hunna', pronounLabel: 'هنّ', prefixLetter: 'ي', stem: 'فتحْنَ', validForms: ['يفتحْنَ', 'يفتحنَ', 'يفتحن'], suffixHint: 'مع «هنّ»: يفتحْنَ.' },
    ],
  },
  {
    id: 'p_saada',
    baseLabel: 'يساعدُ (من: ساعَدَ)',
    entries: [
      { pronounId: 'ana', pronounLabel: 'أنا', prefixLetter: 'أ', stem: 'ساعدُ', validForms: ['أساعدُ', 'أساعد'], suffixHint: 'مع «أنا»: أساعدُ.' },
      { pronounId: 'nahnu', pronounLabel: 'نحن', prefixLetter: 'ن', stem: 'ساعدُ', validForms: ['نساعدُ', 'نساعد'], suffixHint: 'مع «نحن»: نساعدُ.' },
      { pronounId: 'anta', pronounLabel: 'أنتَ', prefixLetter: 'ت', stem: 'ساعدُ', validForms: ['تساعدُ', 'تساعد'], suffixHint: 'مع «أنتَ»: تساعدُ.' },
      { pronounId: 'anti', pronounLabel: 'أنتِ', prefixLetter: 'ت', stem: 'ساعدينَ', validForms: ['تساعدينَ', 'تساعدين'], suffixHint: 'مع «أنتِ»: تساعدينَ.' },
      { pronounId: 'huwa', pronounLabel: 'هو', prefixLetter: 'ي', stem: 'ساعدُ', validForms: ['يساعدُ', 'يساعد'], suffixHint: 'مع «هو»: يساعدُ.' },
      { pronounId: 'hiya', pronounLabel: 'هي', prefixLetter: 'ت', stem: 'ساعدُ', validForms: ['تساعدُ', 'تساعد'], suffixHint: 'مع «هي»: تساعدُ.' },
      { pronounId: 'hum', pronounLabel: 'هم', prefixLetter: 'ي', stem: 'ساعدونَ', validForms: ['يساعدونَ', 'يساعدون'], suffixHint: 'مع «هم»: يساعدونَ.' },
      { pronounId: 'hunna', pronounLabel: 'هنّ', prefixLetter: 'ي', stem: 'ساعدْنَ', validForms: ['يساعدْنَ', 'يساعدنَ', 'يساعدن'], suffixHint: 'مع «هنّ»: يساعدْنَ.' },
    ],
  },
];

export const A4_NOW_OR_TOMORROW = [
  {
    id: 'nt1',
    situation: 'سلمى تجلسُ الآنَ على الوسادةِ وتقلّبُ صفحاتِ القصةِ.',
    sentenceStart: 'تقرأُ سلمى القصةَ ...',
    correct: 'now',
    explanation: 'سلمى تمارسُ القراءةَ في هذهِ اللحظةِ، لذا نختارُ القرينةَ «الآنَ».',
  },
  {
    id: 'nt2',
    situation: 'فريقُ الصفِّ الخامسِ خطَّطَ لحفلِ افتتاحِ ركنِ القراءةِ في اليومِ التالي.',
    sentenceStart: 'يستقبلُ الفريقُ الزوّارَ ...',
    correct: 'tomorrow',
    explanation: 'استقبالُ الزوّارِ حدثٌ متوقَّعٌ في المستقبلِ، لذا نختارُ القرينةَ «غداً».',
  },
  {
    id: 'nt3',
    situation: 'في هذهِ اللحظةِ يضعُ طارقٌ الملصقَ الترحيبيَّ على لوحةِ الإعلاناتِ.',
    sentenceStart: 'يعلّقُ طارقٌ اللوحةَ ...',
    correct: 'now',
    explanation: 'الحدثُ يقعُ أثناءَ الكلامِ، فالمضارعُ هنا يدلُّ على الحاضرِ بقرينةِ «الآنَ».',
  },
];

// A5: Imperative Station
export const A5_SITUATIONS = [
  {
    id: 'sit1',
    situation: 'زميلُكَ يحملُ كتباً مبعثرةً بجانبِ رفٍّ فارغٍ، وتريدُ أن تطلبَ منهُ تنظيمَها.',
    options: ['رتّبِ الكتبَ على الرفِّ.', 'رتّبَ الكتبَ أمسِ.', 'يرتّبُ الكتبَ.'],
    correct: 'رتّبِ الكتبَ على الرفِّ.',
    explanation: '«رتّبِ» فعلُ أمرٍ يطلبُ من المخاطبِ القيامَ بترتيبِ الكتبِ.',
  },
  {
    id: 'sit2',
    situation: 'أختُكَ سلمى تريدُ بدءَ قراءةِ القصةِ، لكنَّ كتابَها ما زالَ مغلقاً.',
    options: ['تقرأُ القصةَ.', 'افتحي الكتابَ واقرئي.', 'قرأتْ القصةَ.'],
    correct: 'افتحي الكتابَ واقرئي.',
    explanation: 'نخاطبُ المؤنثَ المفردَ (أنتِ) بفعلِ الأمرِ المناسبِ: «افتحي ... واقرئي».',
  },
  {
    id: 'sit3',
    situation: 'فريقُ الصفِّ الخامسِ يستعدُّ لحفظِ القصصِ بعدَ انتهاءِ حصةِ القراءةِ.',
    options: ['حافِظوا على نظافةِ الكتبِ.', 'يحافظُ على الكتبِ.', 'حافَظَ على الكتبِ.'],
    correct: 'حافِظوا على نظافةِ الكتبِ.',
    explanation: 'نوجّهُ الطلبَ إلى مجموعةِ المخاطبينَ (أنتم) بفعلِ الأمرِ: «حافِظوا».',
  },
];

export interface ImperativeConjugationVerb {
  id: string;
  label: string;
  entries: ConjugationEntry[];
}

export const A5_IMPERATIVE_VERBS: ImperativeConjugationVerb[] = [
  {
    id: 'imp_rattib',
    label: 'رتِّبْ (توجيهٌ لترتيبِ الكتبِ)',
    entries: [
      { pronounId: 'anta', pronounLabel: 'أنتَ', validForms: ['رتِّبْ', 'رتّب', 'رتب'], suffixHint: 'للمخاطبِ المفردِ المذكرِ (أنتَ): رتِّبْ.' },
      { pronounId: 'antuma', pronounLabel: 'أنتما', validForms: ['رتِّبا', 'رتّبا', 'رتبا'], suffixHint: 'للمثنّى المخاطبِ (أنتما): رتِّبا بألفِ الاثنينِ.' },
      { pronounId: 'antum', pronounLabel: 'أنتم', validForms: ['رتِّبوا', 'رتّبوا', 'رتبوا'], suffixHint: 'لجمعِ المذكرِ المخاطبِ (أنتم): رتِّبوا بواوِ الجماعةِ.' },
      { pronounId: 'anti', pronounLabel: 'أنتِ', validForms: ['رتِّبي', 'رتّبي', 'رتبي'], suffixHint: 'للمخاطبةِ المفردةِ (أنتِ): رتِّبي بياءِ المخاطبةِ.' },
      { pronounId: 'antunna', pronounLabel: 'أنتنّ', validForms: ['رتِّبْنَ', 'رتّبنَ', 'رتبنَ', 'رتبن'], suffixHint: 'لجمعِ الإناثِ المخاطباتِ (أنتنّ): رتِّبْنَ بنونِ النسوةِ.' },
    ],
  },
  {
    id: 'imp_iftah',
    label: 'افتحْ (توجيهٌ لفتحِ الكتابِ)',
    entries: [
      { pronounId: 'anta', pronounLabel: 'أنتَ', validForms: ['افتحْ', 'افتح'], suffixHint: 'مع «أنتَ»: افتحْ.' },
      { pronounId: 'antuma', pronounLabel: 'أنتما', validForms: ['افتحا'], suffixHint: 'مع «أنتما»: افتحا.' },
      { pronounId: 'antum', pronounLabel: 'أنتم', validForms: ['افتحوا'], suffixHint: 'مع «أنتم»: افتحوا.' },
      { pronounId: 'anti', pronounLabel: 'أنتِ', validForms: ['افتحي'], suffixHint: 'مع «أنتِ»: افتحي.' },
      { pronounId: 'antunna', pronounLabel: 'أنتنّ', validForms: ['افتحْنَ', 'افتحنَ', 'افتحن'], suffixHint: 'مع «أنتنّ»: افتحْنَ.' },
    ],
  },
  {
    id: 'imp_uktub',
    label: 'اكتبْ (توجيهٌ لكتابةِ اسمِ القصةِ)',
    entries: [
      { pronounId: 'anta', pronounLabel: 'أنتَ', validForms: ['اكتبْ', 'اكتب'], suffixHint: 'مع «أنتَ»: اكتبْ.' },
      { pronounId: 'antuma', pronounLabel: 'أنتما', validForms: ['اكتبا'], suffixHint: 'مع «أنتما»: اكتبا.' },
      { pronounId: 'antum', pronounLabel: 'أنتم', validForms: ['اكتبوا'], suffixHint: 'مع «أنتم»: اكتبوا.' },
      { pronounId: 'anti', pronounLabel: 'أنتِ', validForms: ['اكتبي'], suffixHint: 'مع «أنتِ»: اكتبي.' },
      { pronounId: 'antunna', pronounLabel: 'أنتنّ', validForms: ['اكتبْنَ', 'اكتبنَ', 'اكتبن'], suffixHint: 'مع «أنتنّ»: اكتبْنَ.' },
    ],
  },
];

// A6: Linguist Detective Vetted Paragraph (Exactly 6 unambiguous verbs: 2 past, 2 present, 2 imperative)
export interface DetectiveToken {
  id: string;
  text: string;
  isVerb: boolean;
  verbType?: VerbType;
  clueHint: string;
}

export const A6_PARAGRAPH_TOKENS: DetectiveToken[] = [
  { id: 'd1', text: 'في', isVerb: false, clueHint: '«في» حرفُ جرٍّ وليس فعلاً.' },
  { id: 'd2', text: 'صباحِ', isVerb: false, clueHint: '«صباحِ» اسمُ زمانٍ وليس فعلاً.' },
  { id: 'd3', text: 'يومِ', isVerb: false, clueHint: '«يومِ» اسمٌ مجرورٌ.' },
  { id: 'd4', text: 'الخميسِ،', isVerb: false, clueHint: '«الخميسِ» اسمٌ يبدأُ بـ«ال» التعريفِ.' },
  {
    id: 'd5',
    text: 'جمعَ',
    isVerb: true,
    verbType: 'past',
    clueHint: 'تأمّل زمنَ الحدثِ: «في صباحِ يومِ الخميسِ» — هل جمعَ الطلابُ القصصَ وانتهى الحدثُ؟',
  },
  { id: 'd6', text: 'طلابُ', isVerb: false, clueHint: '«طلابُ» اسمٌ يدلُّ على الأشخاصِ الذين قاموا بالفعلِ.' },
  { id: 'd7', text: 'الصفِّ', isVerb: false, clueHint: '«الصفِّ» اسمٌ يبدأُ بـ«ال».' },
  { id: 'd8', text: 'الخامسِ', isVerb: false, clueHint: '«الخامسِ» اسمٌ يصفُ الصفَّ.' },
  { id: 'd9', text: 'القصصَ', isVerb: false, clueHint: '«القصصَ» اسمٌ يبدأُ بـ«ال».' },
  { id: 'd10', text: 'المصورةَ،', isVerb: false, clueHint: '«المصورةَ» اسمٌ يصفُ القصصَ.' },
  { id: 'd11', text: 'و', isVerb: false, clueHint: 'حرفُ عطفٍ.' },
  {
    id: 'd12',
    text: 'رتّبوا',
    isVerb: true,
    verbType: 'past',
    clueHint: '«رتّبوا» معطوفٌ على «جمعَ» في صباحِ يومِ الخميسِ؛ وقعَ وانتهى.',
  },
  { id: 'd13', text: 'الكتبَ', isVerb: false, clueHint: '«الكتبَ» اسمٌ يدلُّ على شيءٍ ماديٍّ.' },
  { id: 'd14', text: 'على', isVerb: false, clueHint: '«على» حرفُ جرٍّ.' },
  { id: 'd15', text: 'الرفوفِ', isVerb: false, clueHint: '«الرفوفِ» اسمٌ مجرورٌ.' },
  { id: 'd16', text: 'الخشبيةِ.', isVerb: false, clueHint: '«الخشبيةِ» اسمٌ يصفُ الرفوفَ.' },
  { id: 'd17', text: 'والآنَ', isVerb: false, clueHint: '«الآنَ» قرينةٌ زمنيةٌ تساعدُنا على تحديدِ زمنِ الفعلِ الذي بعدَها.' },
  {
    id: 'd18',
    text: 'تقرأُ',
    isVerb: true,
    verbType: 'present',
    clueHint: 'انظرْ إلى القرينةِ قبلَها «والآنَ» وإلى حرفِ المضارعةِ (ت) في أولِها.',
  },
  { id: 'd19', text: 'سلمى', isVerb: false, clueHint: '«سلمى» اسمُ علمٍ لفتاةٍ.' },
  { id: 'd20', text: 'قصةً', isVerb: false, clueHint: '«قصةً» اسمٌ منوّنٌ.' },
  { id: 'd21', text: 'ممتعةً،', isVerb: false, clueHint: '«ممتعةً» اسمٌ منوّنٌ يصفُ القصةَ.' },
  { id: 'd22', text: 'و', isVerb: false, clueHint: 'حرفُ عطفٍ.' },
  {
    id: 'd23',
    text: 'يرسمُ',
    isVerb: true,
    verbType: 'present',
    clueHint: '«يرسمُ» يحدثُ الآنَ معَ قراءةِ سلمى، ويبدأُ بحرفِ المضارعةِ (ي).',
  },
  { id: 'd24', text: 'طارقٌ', isVerb: false, clueHint: '«طارقٌ» اسمُ علمٍ منوّنٌ.' },
  { id: 'd25', text: 'لوحةً', isVerb: false, clueHint: '«لوحةً» اسمٌ منوّنٌ.' },
  { id: 'd26', text: 'جميلةً', isVerb: false, clueHint: '«جميلةً» اسمٌ منوّنٌ.' },
  { id: 'd27', text: 'للركنِ.', isVerb: false, clueHint: '«للركنِ» حرفُ جرٍّ واسمٌ مجرورٌ.' },
  { id: 'd28', text: 'وهذهِ', isVerb: false, clueHint: '«هذهِ» اسمُ إشارةٍ.' },
  { id: 'd29', text: 'رسالةُ', isVerb: false, clueHint: '«رسالةُ» اسمٌ.' },
  { id: 'd30', text: 'القائدِ', isVerb: false, clueHint: '«القائدِ» اسمٌ يبدأُ بـ«ال».' },
  { id: 'd31', text: 'إلى', isVerb: false, clueHint: '«إلى» حرفُ جرٍّ.' },
  { id: 'd32', text: 'الفريقِ:', isVerb: false, clueHint: '«الفريقِ» اسمٌ يبدأُ بـ«ال».' },
  { id: 'd33', text: 'يا', isVerb: false, clueHint: '«يا» أداةُ نداءٍ تدلُّ على أنَّ كلاماً موجَّهاً للمخاطبينَ سيأتي بعدَها.' },
  { id: 'd34', text: 'أصدقاءُ،', isVerb: false, clueHint: '«أصدقاءُ» اسمٌ منادى.' },
  {
    id: 'd35',
    text: 'حافظوا',
    isVerb: true,
    verbType: 'imperative',
    clueHint: 'انظرْ إلى النداءِ «يا أصدقاءُ» — هذا طلبٌ موجَّهٌ إليهم للقيامِ بالحفظِ.',
  },
  { id: 'd36', text: 'على', isVerb: false, clueHint: '«على» حرفُ جرٍّ.' },
  { id: 'd37', text: 'نظافةِ', isVerb: false, clueHint: '«نظافةِ» اسمٌ.' },
  { id: 'd38', text: 'الكتبِ،', isVerb: false, clueHint: '«الكتبِ» اسمٌ يبدأُ بـ«ال».' },
  { id: 'd39', text: 'و', isVerb: false, clueHint: 'حرفُ عطفٍ.' },
  {
    id: 'd40',
    text: 'اكتبْ',
    isVerb: true,
    verbType: 'imperative',
    clueHint: 'توجَّهَ القائدُ إلى كريمٍ قائلاً «يا كريمُ»، فطلبَ منهُ أن يكتبَ.',
  },
  { id: 'd41', text: 'يا', isVerb: false, clueHint: '«يا» أداةُ نداءٍ.' },
  { id: 'd42', text: 'كريمُ', isVerb: false, clueHint: '«كريمُ» اسمُ علمٍ.' },
  { id: 'd43', text: 'أسماءَ', isVerb: false, clueHint: '«أسماءَ» اسمٌ جمعٌ.' },
  { id: 'd44', text: 'القصصِ', isVerb: false, clueHint: '«القصصِ» اسمٌ يبدأُ بـ«ال».' },
  { id: 'd45', text: 'على', isVerb: false, clueHint: '«على» حرفُ جرٍّ.' },
  { id: 'd46', text: 'البطاقاتِ.', isVerb: false, clueHint: '«البطاقاتِ» اسمٌ يبدأُ بـ«ال».' },
];

export const A6_TARGET_VERBS = A6_PARAGRAPH_TOKENS.filter((t) => t.isVerb);

// A8 Performance Task Rubric (10 points total, self-review ONLY, not auto-graded)
export const A8_RUBRIC_ROWS = [
  {
    key: 'past' as const,
    title: 'الماضي',
    levels: [
      { score: 2 as const, label: 'استخدامُ فعلينِ ماضيينِ مناسبينِ.' },
      { score: 1 as const, label: 'استخدامُ فعلٍ واحدٍ صحيحٍ أو خطأٌ محدودٌ.' },
      { score: 0 as const, label: 'غيرُ متحققٍ.' },
    ],
  },
  {
    key: 'present' as const,
    title: 'المضارع',
    levels: [
      { score: 2 as const, label: 'توظيفُ المضارعِ للحاضرِ والمستقبلِ بقرائنَ واضحةٍ.' },
      { score: 1 as const, label: 'تحققٌ جزئيٌّ.' },
      { score: 0 as const, label: 'غيرُ متحققٍ.' },
    ],
  },
  {
    key: 'imperative' as const,
    title: 'الأمر',
    levels: [
      { score: 2 as const, label: 'استخدامُ فعلَي أمرٍ مناسبينِ للمخاطبِ.' },
      { score: 1 as const, label: 'تحققٌ جزئيٌّ.' },
      { score: 0 as const, label: 'غيرُ متحققٍ.' },
    ],
  },
  {
    key: 'classification' as const,
    title: 'التصنيفُ والتفسيرُ',
    levels: [
      { score: 2 as const, label: 'تصنيفُ الأفعالِ الستةِ وتفسيرُ اختيارٍ بقرينةٍ.' },
      { score: 1 as const, label: 'تحققٌ جزئيٌّ.' },
      { score: 0 as const, label: 'غيرُ متحققٍ.' },
    ],
  },
  {
    key: 'clarity' as const,
    title: 'وضوحُ المنتجِ اللغويِّ',
    levels: [
      { score: 2 as const, label: 'جملٌ مترابطةٌ ومفهومةٌ.' },
      { score: 1 as const, label: 'وضوحٌ جزئيٌّ.' },
      { score: 0 as const, label: 'غيرُ متحققٍ.' },
    ],
  },
];
