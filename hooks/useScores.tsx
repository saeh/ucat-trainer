import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@clerk/react';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

export interface QuizResult {
  id: string;
  section: string;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  percentage: number;
}

interface QuizResultRow {
  id: string;
  user_id: string;
  section: string;
  total_questions: number;
  correct_answers: number;
  time_spent: number;
  percentage: number;
  created_at: string;
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

function rowToResult(row: QuizResultRow): QuizResult {
  return {
    id: row.id,
    section: row.section,
    date: row.created_at,
    totalQuestions: row.total_questions,
    correctAnswers: row.correct_answers,
    timeSpent: row.time_spent,
    percentage: row.percentage,
  };
}

function localKey(userId?: string | null) {
  return userId ? `ucat_scores_${userId}` : 'ucat_scores_guest';
}

export function ScoresProvider({ children }: { children: ReactNode }) {
  const { userId, getToken } = useAuth();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, [userId]);

  const loadScores = async () => {
    setLoading(true);
    try {
      if (userId && isSupabaseConfigured()) {
        const token = await getToken();
        const supabase = getSupabaseClient(token);
        const { data, error } = await supabase
          .from('quiz_results')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setResults((data as QuizResultRow[] | null)?.map(rowToResult) ?? []);
      } else {
        const key = localKey(userId);
        const data = await AsyncStorage.getItem(key);
        setResults(data ? JSON.parse(data) : []);
      }
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
      if (userId && isSupabaseConfigured()) {
        const token = await getToken();
        const supabase = getSupabaseClient(token);
        const { error } = await supabase.from('quiz_results').insert({
          user_id: userId,
          section: result.section,
          total_questions: result.totalQuestions,
          correct_answers: result.correctAnswers,
          time_spent: result.timeSpent,
          percentage: result.percentage,
        });
        if (error) throw error;
      } else {
        const key = localKey(userId);
        await AsyncStorage.setItem(key, JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Failed to save score:', e);
    }
  }, [results, userId, getToken]);

  const clearScores = useCallback(async () => {
    setResults([]);
    try {
      if (userId && isSupabaseConfigured()) {
        const token = await getToken();
        const supabase = getSupabaseClient(token);
        const { error } = await supabase.from('quiz_results').delete().match({ user_id: userId });
        if (error) throw error;
      } else {
        const key = localKey(userId);
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.error('Failed to clear scores:', e);
    }
  }, [userId, getToken]);

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