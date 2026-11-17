import { ConjugationEntry } from '../utils/arabicHelpers';

export interface QuizQuestionBase {
  id: string;
  number: number;
  skillKey:
    | 'classify'
    | 'context_meaning'
    | 'mudaria_letters'
    | 'mudaria_conjugation'
    | 'imperative_conjugation'
    | 'extract_text'
    | 'past_conjugation';
  skillLabel: string;
  reviewStation: 'a2' | 'a3' | 'a4' | 'a5' | 'a6';
  prompt: string;
}

export interface QuizMcqQuestion extends QuizQuestionBase {
  kind: 'mcq';
  contextSentence?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizPastTableQuestion extends QuizQuestionBase {
  kind: 'past_table';
  verbBase: string;
  entries: ConjugationEntry[];
  explanation: string;
}

export type QuizQuestion = QuizMcqQuestion | QuizPastTableQuestion;

export const QUIZ_SKILL_LABELS: Record<
  QuizQuestionBase['skillKey'],
  { label: string; reviewStation: 'a2' | 'a3' | 'a4' | 'a5' | 'a6' }
> = {
  classify: { label: 'التعرّفُ إلى الأفعالِ وتصنيفُها', reviewStation: 'a2' },
  context_meaning: { label: 'دلالةُ الفعلِ في السياقِ', reviewStation: 'a4' },
  mudaria_letters: { label: 'أحرفُ المضارعةِ', reviewStation: 'a4' },
  mudaria_conjugation: { label: 'تحويلُ وإسنادُ المضارعِ', reviewStation: 'a4' },
  imperative_conjugation: { label: 'إسنادُ فعلِ الأمرِ', reviewStation: 'a5' },
  extract_text: { label: 'استخراجُ الأفعالِ من نصٍّ', reviewStation: 'a6' },
  past_conjugation: { label: 'إسنادُ الفعلِ الماضي إلى الضمائرِ التسعةِ', reviewStation: 'a3' },
};

// Q13: 9 pronouns for فَتَحَ
export const Q13_FATAHA_ENTRIES: ConjugationEntry[] = [
  {
    pronounId: 'ana',
    pronounLabel: 'أنا',
    validForms: ['فتَحْتُ', 'فتحتُ'],
    requireFinalDiacritic: '\u064F',
    suffixHint: 'أنا: فتَحْتُ',
  },
  {
    pronounId: 'nahnu',
    pronounLabel: 'نحن',
    validForms: ['فتَحْنا', 'فتحنا'],
    suffixHint: 'نحن: فتَحْنا',
  },
  {
    pronounId: 'anti',
    pronounLabel: 'أنتِ',
    validForms: ['فتَحْتِ', 'فتحتِ'],
    requireFinalDiacritic: '\u0650',
    suffixHint: 'أنتِ: فتَحْتِ',
  },
  {
    pronounId: 'anta',
    pronounLabel: 'أنتَ',
    validForms: ['فتَحْتَ', 'فتحتَ'],
    requireFinalDiacritic: '\u064E',
    suffixHint: 'أنتَ: فتَحْتَ',
  },
  {
    pronounId: 'antuma',
    pronounLabel: 'أنتما',
    validForms: ['فتَحْتُما', 'فتحتما'],
    suffixHint: 'أنتما: فتَحْتُما',
  },
  {
    pronounId: 'antum',
    pronounLabel: 'أنتم',
    validForms: ['فتَحْتُمْ', 'فتحتم'],
    suffixHint: 'أنتم: فتَحْتُمْ',
  },
  {
    pronounId: 'huma',
    pronounLabel: 'هما',
    validForms: ['فتَحا', 'فتحا', 'فتَحَتا', 'فتحتا'],
    suffixHint: 'هما: فتَحا (أو فتَحَتا)',
  },
  {
    pronounId: 'hum',
    pronounLabel: 'هم',
    validForms: ['فتَحوا', 'فتحوا'],
    suffixHint: 'هم: فتَحوا',
  },
  {
    pronounId: 'hunna',
    pronounLabel: 'هنّ',
    validForms: ['فتَحْنَ', 'فتحنَ', 'فتحن'],
    suffixHint: 'هنّ: فتَحْنَ',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Q1–Q3: التعرف إلى الأفعال وتصنيفها (3)
  {
    id: 'q1',
    number: 1,
    kind: 'mcq',
    skillKey: 'classify',
    skillLabel: QUIZ_SKILL_LABELS.classify.label,
    reviewStation: 'a3',
    contextSentence: 'علّقَ الطلابُ اللوحةَ في ركنِ القراءةِ أمسِ.',
    prompt: 'ما نوعُ الفعلِ «علّقَ» في الجملةِ السابقةِ؟',
    options: ['فعلٌ ماضٍ', 'فعلٌ مضارعٌ', 'فعلُ أمرٍ', 'اسمٌ يدلُّ على مكانٍ'],
    correctAnswer: 'فعلٌ ماضٍ',
    explanation: '«علّقَ» فعلٌ ماضٍ؛ لأنَّهُ يدلُّ على حدثٍ وقعَ وانتهى قبلَ زمنِ التكلمِ، وتؤكدُ ذلكَ قرينةُ «أمسِ».',
  },
  {
    id: 'q2',
    number: 2,
    kind: 'mcq',
    skillKey: 'classify',
    skillLabel: QUIZ_SKILL_LABELS.classify.label,
    reviewStation: 'a5',
    contextSentence: 'يا سلمى، نظّمي القصصَ على الرفِّ السفليِّ.',
    prompt: 'ما نوعُ الفعلِ «نظّمي» في هذهِ الجملةِ؟',
    options: ['فعلٌ ماضٍ', 'فعلٌ مضارعٌ', 'فعلُ أمرٍ', 'حرفُ نداءٍ'],
    correctAnswer: 'فعلُ أمرٍ',
    explanation: '«نظّمي» فعلُ أمرٍ؛ لأنَّهُ يطلبُ من المخاطبةِ «سلمى» القيامَ بتنظيمِ القصصِ.',
  },
  {
    id: 'q3',
    number: 3,
    kind: 'mcq',
    skillKey: 'classify',
    skillLabel: QUIZ_SKILL_LABELS.classify.label,
    reviewStation: 'a4',
    contextSentence: 'في الصباحِ، نفتحُ نوافذَ المكتبةِ، ونستقبلُ التلاميذَ.',
    prompt: 'أيُّ الكلماتِ الآتيةِ فعلٌ مضارعٌ؟',
    options: ['الصباحِ', 'نفتحُ', 'نوافذَ', 'المكتبةِ'],
    correctAnswer: 'نفتحُ',
    explanation: '«نفتحُ» فعلٌ مضارعٌ يدلُّ على حدثِ الفتحِ ويبدأُ بحرفِ المضارعةِ (ن)، أمّا البقيةُ فأسماءٌ.',
  },

  // Q4–Q5: دلالة الفعل في السياق (2)
  {
    id: 'q4',
    number: 4,
    kind: 'mcq',
    skillKey: 'context_meaning',
    skillLabel: QUIZ_SKILL_LABELS.context_meaning.label,
    reviewStation: 'a4',
    contextSentence: 'يزورُ فريقُنا معرضَ الكتابِ غداً.',
    prompt: 'على أيِّ زمنٍ يدلُّ الفعلُ المضارعُ «يزورُ» في هذهِ الجملةِ؟',
    options: [
      'الماضي الذي انتهى',
      'الحاضرُ فقطْ دائماً',
      'المستقبلُ بسببِ قرينةِ «غداً»',
      'طلبٌ موجَّهٌ لمخاطبٍ',
    ],
    correctAnswer: 'المستقبلُ بسببِ قرينةِ «غداً»',
    explanation: 'الفعلُ المضارعُ يدلُّ على الحاضرِ أو المستقبلِ بحسبِ السياقِ؛ ووجودُ كلمةِ «غداً» جعلَ معناه مستقبليّاً.',
  },
  {
    id: 'q5',
    number: 5,
    kind: 'mcq',
    skillKey: 'context_meaning',
    skillLabel: QUIZ_SKILL_LABELS.context_meaning.label,
    reviewStation: 'a2',
    contextSentence: '١) يفتحُ طارقٌ الكتابَ.   ٢) افتحِ الكتابَ يا طارقُ.',
    prompt: 'ما الفرقُ بينَ الجملتينِ السابقتينِ في المعنى؟',
    options: [
      'الأولى تُخبرُ عن حدثٍ يقعُ، والثانيةُ تطلبُ من المخاطبِ تنفيذَ الفعلِ',
      'كلاهما فعلُ أمرٍ',
      'الأولى تدلُّ على الماضي، والثانيةُ تدلُّ على المستقبلِ',
      'لا فرقَ في المعنى بينهما',
    ],
    correctAnswer: 'الأولى تُخبرُ عن حدثٍ يقعُ، والثانيةُ تطلبُ من المخاطبِ تنفيذَ الفعلِ',
    explanation: '«يفتحُ طارقٌ» جملةٌ خبريةٌ تصفُ ما يفعلُهُ طارقٌ، بينما «افتحِ» فعلُ أمرٍ يطلبُ منهُ القيامَ بالفتحِ.',
  },

  // Q6: أحرف المضارعة (1)
  {
    id: 'q6',
    number: 6,
    kind: 'mcq',
    skillKey: 'mudaria_letters',
    skillLabel: QUIZ_SKILL_LABELS.mudaria_letters.label,
    reviewStation: 'a4',
    contextSentence: 'أحمدُ يقرأُ تفاحاً؟ لا! تأمّل الكلماتِ: أحمدُ – تفاحةٌ – نرسمُ – يدٌ.',
    prompt: 'أيُّ الكلماتِ التاليةِ تبدأُ بأحدِ أحرفِ «نأتي» وهيَ فعلٌ مضارعٌ حقيقيٌّ يدلُّ على حدثٍ وزمنٍ؟',
    options: ['أحمدُ', 'تفاحةٌ', 'نرسمُ', 'يدٌ'],
    correctAnswer: 'نرسمُ',
    explanation: '«نرسمُ» فعلٌ مضارعٌ يدلُّ على حدثِ الرسمِ ويبدأُ بنونِ المضارعةِ؛ أمّا «أحمدُ» و«تفاحةٌ» و«يدٌ» فأسماءٌ رغمَ بدئِها بحروفِ (أ، ت، ي).',
  },

  // Q7–Q8: تحويل وإسناد المضارع (2)
  {
    id: 'q7',
    number: 7,
    kind: 'mcq',
    skillKey: 'mudaria_conjugation',
    skillLabel: QUIZ_SKILL_LABELS.mudaria_conjugation.label,
    reviewStation: 'a4',
    contextSentence: 'الفعلُ الماضي: «ساعدَ» — الضميرُ المطلوبُ: «نحن».',
    prompt: 'ما الصيغةُ المضارعةُ الصحيحةُ للفعلِ «ساعدَ» عندَ إسنادِهِ إلى الضميرِ «نحن»؟',
    options: ['أساعدُ', 'نساعدُ', 'تساعدُ', 'يساعدونَ'],
    correctAnswer: 'نساعدُ',
    explanation: 'عندَ إسنادِ المضارعِ إلى «نحن» نبدأُ الفعلَ بنونِ المضارعةِ: «نحن نساعدُ».',
  },
  {
    id: 'q8',
    number: 8,
    kind: 'mcq',
    skillKey: 'mudaria_conjugation',
    skillLabel: QUIZ_SKILL_LABELS.mudaria_conjugation.label,
    reviewStation: 'a4',
    contextSentence: 'أنتِ ...... القصصَ المصوَّرةَ بعنايةٍ.',
    prompt: 'اخترِ الفعلَ المضارعَ المطابقَ للضميرِ «أنتِ»:',
    options: ['تقرأُ', 'تقرئينَ', 'يقرأُ', 'نقرأُ'],
    correctAnswer: 'تقرئينَ',
    explanation: 'عندَ إسنادِ المضارعِ إلى «أنتِ» يبدأُ بالتاءِ وينتهي بياءِ المخاطبةِ والنونِ: «تقرئينَ».',
  },

  // Q9–Q10: إسناد فعل الأمر (2)
  {
    id: 'q9',
    number: 9,
    kind: 'mcq',
    skillKey: 'imperative_conjugation',
    skillLabel: QUIZ_SKILL_LABELS.imperative_conjugation.label,
    reviewStation: 'a5',
    contextSentence: 'المخاطَبونَ: «أنتم» — الفعلُ: «اكتبْ».',
    prompt: 'ما صيغةُ فعلِ الأمرِ الصحيحةُ لجمعِ الذكورِ «أنتم»؟',
    options: ['اكتبْ', 'اكتبي', 'اكتبوا', 'اكتبْنَ'],
    correctAnswer: 'اكتبوا',
    explanation: 'للمخاطبينَ «أنتم» نُلحقُ بفعلِ الأمرِ واوَ الجماعةِ والألفَ الفارقةَ: «اكتبوا».',
  },
  {
    id: 'q10',
    number: 10,
    kind: 'mcq',
    skillKey: 'imperative_conjugation',
    skillLabel: QUIZ_SKILL_LABELS.imperative_conjugation.label,
    reviewStation: 'a5',
    contextSentence: 'المخاطَباتُ: «أنتنّ» — الفعلُ: «افتحْ».',
    prompt: 'ما صيغةُ فعلِ الأمرِ الصحيحةُ لجمعِ الإناثِ «أنتنّ»؟',
    options: ['افتحي', 'افتحوا', 'افتحا', 'افتحْنَ'],
    correctAnswer: 'افتحْنَ',
    explanation: 'للمخاطباتِ «أنتنّ» نُلحقُ بفعلِ الأمرِ نونَ النسوةِ: «افتحْنَ».',
  },

  // Q11–Q12: استخراج الأفعال من نص (2)
  {
    id: 'q11',
    number: 11,
    kind: 'mcq',
    skillKey: 'extract_text',
    skillLabel: QUIZ_SKILL_LABELS.extract_text.label,
    reviewStation: 'a6',
    contextSentence:
      'أحضرَ طارقٌ صناديقَ خشبيةً إلى الصفِّ، والآنَ يضعُ الكتبَ فيها بنظامٍ.',
    prompt: 'استخرجِ الفعلَ الماضيَ من الجملةِ السابقةِ:',
    options: ['أحضرَ', 'صناديقَ', 'يضعُ', 'بنظامٍ'],
    correctAnswer: 'أحضرَ',
    explanation: '«أحضرَ» هو الفعلُ الماضي الذي تمَّ قبلَ «الآنَ»؛ أمّا «يضعُ» ففعلٌ مضارعٌ، و«صناديقَ» و«بنظامٍ» اسمانِ.',
  },
  {
    id: 'q12',
    number: 12,
    kind: 'mcq',
    skillKey: 'extract_text',
    skillLabel: QUIZ_SKILL_LABELS.extract_text.label,
    reviewStation: 'a6',
    contextSentence:
      'الهدوءُ جميلٌ في المكتبةِ، تفضَّلوا بالجلوسِ، واقرؤوا قصصَكم بصوتٍ منخفضٍ.',
    prompt: 'أيُّ كلمتينِ في النصِّ السابقِ هما فعلا أمرٍ؟',
    options: [
      'الهدوءُ – جميلٌ',
      'تفضَّلوا – اقرؤوا',
      'المكتبةِ – قصصَكم',
      'بالجلوسِ – منخفضٍ',
    ],
    correctAnswer: 'تفضَّلوا – اقرؤوا',
    explanation: '«تفضَّلوا» و«اقرؤوا» فعلانِ يدلّانِ على الطلبِ الموجَّهِ إلى المخاطبينَ (أنتم).',
  },

  // Q13: إسناد الفعل الماضي إلى الضمائر التسعة (1 item, 9 subfields, partial credit)
  {
    id: 'q13',
    number: 13,
    kind: 'past_table',
    skillKey: 'past_conjugation',
    skillLabel: QUIZ_SKILL_LABELS.past_conjugation.label,
    reviewStation: 'a3',
    verbBase: 'فتَحَ',
    prompt:
      'أسندِ الفعلَ الماضيَ «فتَحَ» إلى الضمائرِ التسعةِ في الجدولِ الآتي بدقةٍ (تُوزَّعُ الدرجةُ بالتساوي على الحقولِ التسعةِ):',
    entries: Q13_FATAHA_ENTRIES,
    explanation:
      'يتغيّرُ آخرُ الفعلِ الماضيِ «فتَحَ» بحسبِ الضميرِ المسندِ إليهِ: فتَحْتُ، فتَحْنا، فتَحْتِ، فتَحْتَ، فتَحْتُما، فتَحْتُمْ، فتَحا، فتَحوا، فتَحْنَ.',
  },
];
