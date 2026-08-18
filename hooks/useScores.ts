import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuizResult {
  id: string;
  section: string;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  percentage: number;
}

const STORAGE_KEY = 'ucat_scores';

export function useScores() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setResults(JSON.parse(data));
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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save score:', e);
    }
  }, [results]);

  const clearScores = useCallback(async () => {
    setResults([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear scores:', e);
    }
  }, []);

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

  return { results, loading, addResult, clearScores, getSectionResults, getOverallStats, getSectionStats };
}
