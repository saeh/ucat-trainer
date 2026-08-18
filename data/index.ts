import banks from './banks.json';

const bankFiles: Record<string, () => any> = {
  'vr-1': () => require('./questions/vr/bank1.json'),
  'vr-2': () => require('./questions/vr/bank2.json'),
  'vr-3': () => require('./questions/vr/bank3.json'),
  'vr-4': () => require('./questions/vr/bank4.json'),
  'vr-5': () => require('./questions/vr/bank5.json'),
  'vr-6': () => require('./questions/vr/bank6.json'),
  'vr-7': () => require('./questions/vr/bank7.json'),
  'vr-8': () => require('./questions/vr/bank8.json'),
  'vr-9': () => require('./questions/vr/bank9.json'),
  'vr-10': () => require('./questions/vr/bank10.json'),
  'dm-1': () => require('./questions/dm/bank1.json'),
  'dm-2': () => require('./questions/dm/bank2.json'),
  'dm-3': () => require('./questions/dm/bank3.json'),
  'dm-4': () => require('./questions/dm/bank4.json'),
  'dm-5': () => require('./questions/dm/bank5.json'),
  'dm-6': () => require('./questions/dm/bank6.json'),
  'dm-7': () => require('./questions/dm/bank7.json'),
  'dm-8': () => require('./questions/dm/bank8.json'),
  'dm-9': () => require('./questions/dm/bank9.json'),
  'dm-10': () => require('./questions/dm/bank10.json'),
  'qr-1': () => require('./questions/qr/bank1.json'),
  'qr-2': () => require('./questions/qr/bank2.json'),
  'qr-3': () => require('./questions/qr/bank3.json'),
  'qr-4': () => require('./questions/qr/bank4.json'),
  'qr-5': () => require('./questions/qr/bank5.json'),
  'qr-6': () => require('./questions/qr/bank6.json'),
  'qr-7': () => require('./questions/qr/bank7.json'),
  'qr-8': () => require('./questions/qr/bank8.json'),
  'qr-9': () => require('./questions/qr/bank9.json'),
  'qr-10': () => require('./questions/qr/bank10.json'),
  'sjt-1': () => require('./questions/sjt/bank1.json'),
  'sjt-2': () => require('./questions/sjt/bank2.json'),
  'sjt-3': () => require('./questions/sjt/bank3.json'),
  'sjt-4': () => require('./questions/sjt/bank4.json'),
  'sjt-5': () => require('./questions/sjt/bank5.json'),
  'sjt-6': () => require('./questions/sjt/bank6.json'),
  'sjt-7': () => require('./questions/sjt/bank7.json'),
  'sjt-8': () => require('./questions/sjt/bank8.json'),
  'sjt-9': () => require('./questions/sjt/bank9.json'),
  'sjt-10': () => require('./questions/sjt/bank10.json'),
};

export interface BankInfo {
  id: string;
  name: string;
  section: string;
  questionCount: number;
  timeMinutes: number;
}

export function getBanksForSection(section: string): BankInfo[] {
  return banks.filter((b) => b.section === section);
}

export function getBankInfo(bankId: string): BankInfo | undefined {
  return banks.find((b) => b.id === bankId);
}

export function loadQuestions(bankId: string): any[] {
  const loader = bankFiles[bankId];
  if (!loader) return [];
  return loader().questions;
}
