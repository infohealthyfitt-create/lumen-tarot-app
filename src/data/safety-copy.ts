export const DISCLAIMER_SHORT =
  'Tarot readings are provided for personal reflection and entertainment purposes and should not replace professional medical, legal, financial, or mental-health advice.';

export const POSITIONING_STATEMENT = 'Tarot-inspired guidance, reflection, and entertainment.';

export const SERIOUS_TOPIC_NOTICE =
  "This question touches on something significant. Tarot can offer a space for reflection, but it isn't a substitute for qualified professional guidance. If this involves a medical, legal, financial, or safety decision, please consider speaking with a licensed professional who can advise on your specific situation.";

/** Simple keyword check used to surface SERIOUS_TOPIC_NOTICE before generating a reading. */
export function mentionsSeriousTopic(question: string): boolean {
  const flagged = [
    'pregnan', 'die', 'death', 'suicide', 'cancer', 'disease', 'illness',
    'lawsuit', 'court', 'divorce settlement', 'invest', 'stock', 'bankrupt',
    'diagnos', 'medication', 'surgery', 'custody',
  ];
  const lower = question.toLowerCase();
  return flagged.some((word) => lower.includes(word));
}
