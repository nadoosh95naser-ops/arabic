// Linguistic helpers for Grade 5 Arabic verb matching without false positives across pronouns

const ALL_DIACRITICS_REGEX = /[\u064B-\u065F\u0670]/g;
const TATWEEL_REGEX = /\u0640/g;

export function sanitizeUserText(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripAllDiacritics(text: string): string {
  return text
    .replace(TATWEEL_REGEX, '')
    .replace(ALL_DIACRITICS_REGEX, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeBaseLetters(text: string): string {
  return stripAllDiacritics(text)
    .replace(/[إأآ]/g, 'أ') // keep hamza distinction gently normalized only on initial alef forms if needed
    .trim();
}

/**
 * Extract the trailing diacritic on the final letter of an Arabic word (e.g., فَتَحْتُ -> ُ)
 */
export function getTrailingDiacritic(word: string): string {
  const cleaned = word.replace(TATWEEL_REGEX, '').trim();
  if (!cleaned) return '';
  const lastChar = cleaned[cleaned.length - 1];
  if (/[\u064B-\u065F]/.test(lastChar)) {
    return lastChar;
  }
  return '';
}

export type VerbCheckStatus =
  | 'exact'
  | 'wrong_pronoun'
  | 'needs_diacritic'
  | 'incorrect'
  | 'empty';

export interface VerbCheckResult {
  status: VerbCheckStatus;
  matchedOtherPronoun?: string;
  message: string;
}

export interface ConjugationEntry {
  pronounId: string;
  pronounLabel: string;
  validForms: string[];
  /** Whether final diacritic on the last consonant is required to distinguish from another pronoun (e.g. تُ / تَ / تِ) */
  requireFinalDiacritic?: '\u064F' | '\u064E' | '\u0650';
  suffixHint: string;
}

export function evaluateConjugatedVerb(
  rawInput: string,
  targetEntry: ConjugationEntry,
  allEntriesForVerb: ConjugationEntry[]
): VerbCheckResult {
  const input = sanitizeUserText(rawInput).replace(TATWEEL_REGEX, '');
  if (!input) {
    return {
      status: 'empty',
      message: 'اكتب صيغة الفعل المناسبة لهذا الضمير.',
    };
  }

  const inputBase = stripAllDiacritics(input);
  const inputLastDiacritic = getTrailingDiacritic(input);

  // Check against target valid forms first
  const matchesTargetBase = targetEntry.validForms.some(
    (form) => stripAllDiacritics(form) === inputBase
  );

  if (matchesTargetBase) {
    if (targetEntry.requireFinalDiacritic) {
      if (!inputLastDiacritic) {
        return {
          status: 'needs_diacritic',
          message: `حروف الكلمة صحيحة! لكن يجب وضع الحركة المناسبة على آخر الفعل لتمييز الضمير (${targetEntry.pronounLabel}). استخدم أزرار الحركات المساعدة.`,
        };
      }
      if (inputLastDiacritic === targetEntry.requireFinalDiacritic) {
        return {
          status: 'exact',
          message: `ممتاز! الصيغة (${targetEntry.validForms[0]}) تطابق الضمير (${targetEntry.pronounLabel}) بدقة.`,
        };
      }
      // Different diacritic -> check which other pronoun has that diacritic
      const otherWithDiacritic = allEntriesForVerb.find(
        (entry) =>
          entry.pronounId !== targetEntry.pronounId &&
          entry.validForms.some((f) => stripAllDiacritics(f) === inputBase) &&
          entry.requireFinalDiacritic === inputLastDiacritic
      );
      if (otherWithDiacritic) {
        return {
          status: 'wrong_pronoun',
          matchedOtherPronoun: otherWithDiacritic.pronounLabel,
          message: `انتبه! هذه الصيغة بالحركة التي وضعتها تناسب الضمير (${otherWithDiacritic.pronounLabel})، وليس (${targetEntry.pronounLabel}). ${targetEntry.suffixHint}`,
        };
      }
      return {
        status: 'incorrect',
        message: `الحركة الأخيرة لا تناسب الضمير (${targetEntry.pronounLabel}). ${targetEntry.suffixHint}`,
      };
    }

    // No ambiguous final diacritic conflict -> exact match!
    return {
      status: 'exact',
      message: `رائع! الصيغة (${targetEntry.validForms[0]}) صحيحة للضمير (${targetEntry.pronounLabel}).`,
    };
  }

  // Check if the student entered a valid form belonging to a DIFFERENT pronoun
  const otherEntry = allEntriesForVerb.find(
    (entry) =>
      entry.pronounId !== targetEntry.pronounId &&
      entry.validForms.some((f) => stripAllDiacritics(f) === inputBase)
  );

  if (otherEntry) {
    return {
      status: 'wrong_pronoun',
      matchedOtherPronoun: otherEntry.pronounLabel,
      message: `هذه الصيغة تناسب الضمير (${otherEntry.pronounLabel})، ونحن نريد إسناد الفعل إلى الضمير (${targetEntry.pronounLabel}). ${targetEntry.suffixHint}`,
    };
  }

  return {
    status: 'incorrect',
    message: `تحقّق من نهاية الفعل أو حروفه للضمير (${targetEntry.pronounLabel}). ${targetEntry.suffixHint}`,
  };
}
