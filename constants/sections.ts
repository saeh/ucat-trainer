export type SectionKey = 'vr' | 'dm' | 'qr' | 'sjt';

export interface SectionInfo {
  key: SectionKey;
  name: string;
  fullName: string;
  description: string;
  questions: number;
  timeMinutes: number;
  color: string;
  icon: string;
}

export const SECTIONS: SectionInfo[] = [
  {
    key: 'vr',
    name: 'VR',
    fullName: 'Verbal Reasoning',
    description: 'Read passages and evaluate statements as True, False, or Can\'t Tell. ~28 seconds per question.',
    questions: 44,
    timeMinutes: 22,
    color: '#F15A2B',
    icon: '📖',
  },
  {
    key: 'dm',
    name: 'DM',
    fullName: 'Decision Making',
    description: 'Logical puzzles, Venn diagrams, syllogisms, and chart interpretation. ~62 seconds per question.',
    questions: 35,
    timeMinutes: 37,
    color: '#2AB7A8',
    icon: '🧩',
  },
  {
    key: 'qr',
    name: 'QR',
    fullName: 'Quantitative Reasoning',
    description: 'Numerical problem-solving with tables, charts, and graphs. ~42 seconds per question.',
    questions: 36,
    timeMinutes: 26,
    color: '#4DA6E8',
    icon: '📊',
  },
  {
    key: 'sjt',
    name: 'SJT',
    fullName: 'Situational Judgement',
    description: 'Rate appropriateness and importance of responses in healthcare scenarios. ~22 seconds per question.',
    questions: 69,
    timeMinutes: 27,
    color: '#F9B233',
    icon: '🏥',
  },
];

export function getSectionByKey(key: string): SectionInfo | undefined {
  return SECTIONS.find((s) => s.key === key);
}
