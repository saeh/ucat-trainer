import { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router, Redirect } from 'expo-router';
import { Show } from '@clerk/react';
import { Colors } from '../../constants/colors';
import { getSectionByKey } from '../../constants/sections';
import { useTimer } from '../../hooks/useTimer';
import { useScores } from '../../hooks/useScores';
import { QuizResult } from '../../hooks/useScores';
import vrData from '../../data/questions/vr.json';
import dmData from '../../data/questions/dm.json';
import qrData from '../../data/questions/qr.json';
import sjtData from '../../data/questions/sjt.json';

const ALL_QUESTIONS: Record<string, typeof vrData.questions> = {
  vr: vrData.questions,
  dm: dmData.questions,
  qr: qrData.questions,
  sjt: sjtData.questions,
};

interface Answer {
  questionId: string;
  selected: string;
  isCorrect: boolean;
}

export default function QuizScreen() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const sectionInfo = getSectionByKey(section ?? '');
  const timer = useTimer((sectionInfo?.timeMinutes ?? 22) * 60);
  const { addResult } = useScores();

  return (
    <Show when="signed-in" fallback={<Redirect href="/" />}>
      <QuizContent section={section} sectionInfo={sectionInfo} timer={timer} addResult={addResult} />
    </Show>
  );
}

function QuizContent({ section, sectionInfo, timer, addResult }: {
  section: string | undefined;
  sectionInfo: ReturnType<typeof getSectionByKey>;
  timer: ReturnType<typeof useTimer>;
  addResult: (result: QuizResult) => Promise<void>;
}) {

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = useMemo(() => {
    const allQs = ALL_QUESTIONS[section ?? ''] ?? [];
    return allQs.slice(0, Math.min(10, allQs.length));
  }, [section]);

  const question = questions[currentIndex];

  const handleStart = useCallback(() => {
    setStarted(true);
    timer.start();
  }, [timer]);

  const handleAnswer = useCallback((answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  }, [showResult]);

  const handleConfirm = useCallback(() => {
    if (!selectedAnswer || !question) return;
    const isCorrect = selectedAnswer === question.correct;
    const newAnswer: Answer = {
      questionId: question.id,
      selected: selectedAnswer,
      isCorrect,
    };
    setAnswers((prev) => [...prev, newAnswer]);
    setShowResult(true);
  }, [selectedAnswer, question]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      timer.pause();
      setQuizComplete(true);
      const totalCorrect = [...answers].filter((a) => a.isCorrect).length;
      const result: QuizResult = {
        id: `${section}-${Date.now()}`,
        section: section ?? '',
        date: new Date().toISOString(),
        totalQuestions: questions.length,
        correctAnswers: totalCorrect,
        timeSpent: (sectionInfo?.timeMinutes ?? 22) * 60 - timer.seconds,
        percentage: Math.round((totalCorrect / questions.length) * 100),
      };
      addResult(result);
    }
  }, [currentIndex, questions.length, timer, answers, section, sectionInfo, addResult]);

  if (!sectionInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Section not found</Text>
      </View>
    );
  }

  if (quizComplete) {
    const totalCorrect = answers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((totalCorrect / questions.length) * 100);
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultsContainer}>
        <Text style={styles.resultsIcon}>
          {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
        </Text>
        <Text style={styles.resultsTitle}>Quiz Complete!</Text>
        <Text style={styles.resultsSection}>{sectionInfo.fullName}</Text>

        <View style={styles.resultsCard}>
          <Text style={styles.resultsScore}>{percentage}%</Text>
          <Text style={styles.resultsDetail}>
            {totalCorrect} correct out of {questions.length}
          </Text>
          <Text style={styles.resultsTime}>
            Time: {Math.floor(((sectionInfo.timeMinutes * 60) - timer.seconds) / 60)}m {((sectionInfo.timeMinutes * 60) - timer.seconds) % 60}s
          </Text>
        </View>

        <Text style={styles.reviewTitle}>Review Answers</Text>
        {answers.map((answer, idx) => {
          const q = questions.find((ques) => ques.id === answer.questionId);
          if (!q) return null;
          return (
            <View key={answer.questionId} style={[styles.reviewItem, { borderLeftColor: answer.isCorrect ? Colors.success : Colors.error }]}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewNumber}>Q{idx + 1}</Text>
                <Text style={[styles.reviewStatus, { color: answer.isCorrect ? Colors.success : Colors.error }]}>
                  {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </Text>
              </View>
              {q.passage && (
                <Text style={styles.reviewPassage} numberOfLines={3}>{q.passage}</Text>
              )}
              <Text style={styles.reviewQuestion}>{q.question}</Text>
              {!answer.isCorrect && (
                <View style={styles.reviewAnswers}>
                  <Text style={[styles.reviewAnswer, styles.wrongAnswer]}>Your answer: {answer.selected}</Text>
                  <Text style={[styles.reviewAnswer, styles.correctAnswer]}>Correct: {q.correct}</Text>
                </View>
              )}
              <Text style={styles.reviewExplanation}>{q.explanation}</Text>
            </View>
          );
        })}

        <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
          <Text style={styles.homeButtonText}>Back to Sections</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (!started) {
    return (
      <View style={styles.container}>
        <View style={styles.startContainer}>
          <Text style={[styles.startIcon, { color: sectionInfo.color }]}>{sectionInfo.icon}</Text>
          <Text style={styles.startTitle}>{sectionInfo.fullName}</Text>
          <Text style={styles.startDesc}>{sectionInfo.description}</Text>

          <View style={styles.startStats}>
            <View style={styles.startStat}>
              <Text style={styles.startStatNum}>{Math.min(10, sectionInfo.questions)}</Text>
              <Text style={styles.startStatLabel}>Questions</Text>
            </View>
            <View style={styles.startStat}>
              <Text style={styles.startStatNum}>{sectionInfo.timeMinutes}</Text>
              <Text style={styles.startStatLabel}>Minutes</Text>
            </View>
            <View style={styles.startStat}>
              <Text style={styles.startStatNum}>~{Math.round(sectionInfo.timeMinutes * 60 / Math.min(10, sectionInfo.questions))}s</Text>
              <Text style={styles.startStatLabel}>Per Question</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.startButton, { backgroundColor: sectionInfo.color }]} onPress={handleStart}>
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.timerBar}>
        <View style={[styles.timerProgress, { width: `${timer.progress * 100}%`, backgroundColor: timer.seconds < 60 ? Colors.error : sectionInfo.color }]} />
      </View>
      <View style={styles.quizHeader}>
        <Text style={styles.quizCounter}>
          Q{currentIndex + 1} / {questions.length}
        </Text>
        <Text style={[styles.quizTimer, timer.seconds < 60 && { color: Colors.error }]}>
          {timer.formatted}
        </Text>
      </View>

      <ScrollView style={styles.quizContent} contentContainerStyle={styles.quizContentInner}>
        {question?.passage && (
          <View style={styles.passageBox}>
            <Text style={styles.passageText}>{question.passage}</Text>
          </View>
        )}

        <Text style={styles.questionText}>{question?.question}</Text>

        <View style={styles.optionsContainer}>
          {question?.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === question.correct;
            const showCorrectHighlight = showResult && isCorrectAnswer;
            const showWrongHighlight = showResult && isSelected && !isCorrectAnswer;

            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  isSelected && !showResult && { borderColor: sectionInfo.color, backgroundColor: Colors.surfaceLight },
                  showCorrectHighlight && { borderColor: Colors.success, backgroundColor: 'rgba(76,175,80,0.15)' },
                  showWrongHighlight && { borderColor: Colors.error, backgroundColor: 'rgba(255,82,82,0.15)' },
                ]}
                onPress={() => handleAnswer(option)}
                disabled={showResult}
              >
                <Text style={[
                  styles.optionText,
                  showCorrectHighlight && { color: Colors.success },
                  showWrongHighlight && { color: Colors.error },
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showResult && question && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationLabel}>Explanation</Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.quizFooter}>
        {!showResult ? (
          <TouchableOpacity
            style={[styles.confirmButton, !selectedAnswer && styles.confirmButtonDisabled, { backgroundColor: sectionInfo.color }]}
            onPress={handleConfirm}
            disabled={!selectedAnswer}
          >
            <Text style={styles.confirmButtonText}>Confirm Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.nextButton, { backgroundColor: sectionInfo.color }]} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  startIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  startTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  startDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  startStats: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 40,
  },
  startStat: {
    alignItems: 'center',
  },
  startStatNum: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  startStatLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  startButton: {
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 14,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  timerBar: {
    height: 4,
    backgroundColor: Colors.surfaceLight,
  },
  timerProgress: {
    height: '100%',
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  quizCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  quizTimer: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    fontVariant: ['tabular-nums'],
  },
  quizContent: {
    flex: 1,
  },
  quizContentInner: {
    padding: 20,
  },
  passageBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  passageText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  explanationBox: {
    marginTop: 20,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
  },
  explanationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  explanationText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  quizFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  resultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  resultsIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  resultsSection: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 24,
  },
  resultsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  resultsScore: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.primary,
  },
  resultsDetail: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  resultsTime: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 6,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  reviewItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    borderLeftWidth: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  reviewStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  reviewPassage: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  reviewQuestion: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  reviewAnswers: {
    marginBottom: 8,
  },
  reviewAnswer: {
    fontSize: 13,
    marginBottom: 2,
  },
  wrongAnswer: {
    color: Colors.error,
    textDecorationLine: 'line-through',
  },
  correctAnswer: {
    color: Colors.success,
    fontWeight: '600',
  },
  reviewExplanation: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  homeButton: {
    marginTop: 10,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    marginBottom: 40,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
});
