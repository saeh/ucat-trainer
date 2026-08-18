import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@clerk/react';

export interface QuizResult {
  id: string;
  section: string;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  percentage: number;
}

interface ScoresContextValue {
  results: QuizResult[];
  loading: boolean;
  addResult: (result: QuizResult) => Promise<void>;
  clearScores: () => Promise<void>;
  getSectionResults: (section: string) => QuizResult[];
  getOverallStats: () => { totalQuizzes: number; avgPercentage: number; totalQuestions: number; totalCorrect: number };
  getSectionStats: (section: string) => { quizzes: number; avgPercentage: number; bestPercentage: number; totalQuestions: number; totalCorrect: number };
}

const ScoresContext = createContext<ScoresContextValue | null>(null);

export function ScoresProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const userId = user?.id;
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, [userId]);

  const loadScores = async () => {
    try {
      const key = userId ? `ucat_scores_${userId}` : 'ucat_scores_guest';
      const data = await AsyncStorage.getItem(key);
      setResults(data ? JSON.parse(data) : []);
    } catch (e) {
      console.error('Failed to load scores:', e);
    } finally {
      setLoading(false);
    }
  };

  const addResult = useCallback(async (result: QuizResult) => {
    const updated = [result, ...results];
    setResults(updated);
    try {
      const key = userId ? `ucat_scores_${userId}` : 'ucat_scores_guest';
      await AsyncStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save score:', e);
    }
  }, [results, userId]);

  const clearScores = useCallback(async () => {
    setResults([]);
    try {
      const key = userId ? `ucat_scores_${userId}` : 'ucat_scores_guest';
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to clear scores:', e);
    }
  }, [userId]);

  const getSectionResults = useCallback((section: string) => {
    return results.filter((r) => r.section === section);
  }, [results]);

  const getOverallStats = useCallback(() => {
    if (results.length === 0) {
      return { totalQuizzes: 0, avgPercentage: 0, totalQuestions: 0, totalCorrect: 0 };
    }
    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalCorrect = results.reduce((sum, r) => sum + r.correctAnswers, 0);
    return {
      totalQuizzes: results.length,
      avgPercentage: Math.round(totalCorrect / totalQuestions * 100),
      totalQuestions,
      totalCorrect,
    };
  }, [results]);

  const getSectionStats = useCallback((section: string) => {
    const sectionResults = getSectionResults(section);
    if (sectionResults.length === 0) {
      return { quizzes: 0, avgPercentage: 0, bestPercentage: 0, totalQuestions: 0, totalCorrect: 0 };
    }
    const totalQuestions = sectionResults.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalCorrect = sectionResults.reduce((sum, r) => sum + r.correctAnswers, 0);
    return {
      quizzes: sectionResults.length,
      avgPercentage: Math.round(totalCorrect / totalQuestions * 100),
      bestPercentage: Math.max(...sectionResults.map((r) => r.percentage)),
      totalQuestions,
      totalCorrect,
    };
  }, [getSectionResults]);

  return (
    <ScoresContext.Provider value={{ results, loading, addResult, clearScores, getSectionResults, getOverallStats, getSectionStats }}>
      {children}
    </ScoresContext.Provider>
  );
}

export function useScores() {
  const ctx = useContext(ScoresContext);
  if (!ctx) throw new Error('useScores must be used within ScoresProvider');
  return ctx;
}
