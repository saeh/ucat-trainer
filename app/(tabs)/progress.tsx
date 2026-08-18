import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { SECTIONS } from '../../constants/sections';
import { useScores } from '../../hooks/useScores';

export default function ProgressScreen() {
  const { results, getOverallStats, getSectionStats, clearScores, loading } = useScores();
  const stats = getOverallStats();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Progress</Text>

      <View style={styles.overallCard}>
        <Text style={styles.overallTitle}>Overall Performance</Text>
        <View style={styles.overallStats}>
          <View style={styles.overallStat}>
            <Text style={styles.overallNumber}>{stats.totalQuizzes}</Text>
            <Text style={styles.overallLabel}>Quizzes Taken</Text>
          </View>
          <View style={styles.overallStat}>
            <Text style={[styles.overallNumber, { color: Colors.primary }]}>{stats.avgPercentage}%</Text>
            <Text style={styles.overallLabel}>Average Score</Text>
          </View>
          <View style={styles.overallStat}>
            <Text style={styles.overallNumber}>{stats.totalCorrect}/{stats.totalQuestions}</Text>
            <Text style={styles.overallLabel}>Correct</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>By Section</Text>
      {SECTIONS.map((section) => {
        const sStats = getSectionStats(section.key);
        return (
          <View key={section.key} style={[styles.sectionCard, { borderLeftColor: section.color }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{section.icon}</Text>
              <Text style={styles.sectionName}>{section.fullName}</Text>
            </View>
            {sStats.quizzes > 0 ? (
              <View style={styles.sectionStats}>
                <View style={styles.sectionStat}>
                  <Text style={styles.sectionStatNum}>{sStats.quizzes}</Text>
                  <Text style={styles.sectionStatLabel}>Quizzes</Text>
                </View>
                <View style={styles.sectionStat}>
                  <Text style={[styles.sectionStatNum, { color: section.color }]}>{sStats.avgPercentage}%</Text>
                  <Text style={styles.sectionStatLabel}>Average</Text>
                </View>
                <View style={styles.sectionStat}>
                  <Text style={[styles.sectionStatNum, { color: Colors.success }]}>{sStats.bestPercentage}%</Text>
                  <Text style={styles.sectionStatLabel}>Best</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.noData}>No quizzes taken yet</Text>
            )}
          </View>
        );
      })}

      {results.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Quizzes</Text>
          {results.slice(0, 10).map((result) => {
            const section = SECTIONS.find((s) => s.key === result.section);
            return (
              <View key={result.id} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historySection}>{section?.icon} {section?.name}</Text>
                  <Text style={styles.historyDate}>{new Date(result.date).toLocaleDateString()}</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={[styles.historyScore, { color: result.percentage >= 70 ? Colors.success : result.percentage >= 50 ? Colors.warning : Colors.error }]}>
                    {result.percentage}%
                  </Text>
                  <Text style={styles.historyDetail}>
                    {result.correctAnswers}/{result.totalQuestions}
                  </Text>
                </View>
              </View>
            );
          })}

          <TouchableOpacity style={styles.clearButton} onPress={clearScores}>
            <Text style={styles.clearButtonText}>Clear All Progress</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  loadingText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 20,
  },
  overallCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
  },
  overallTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  overallStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overallStat: {
    alignItems: 'center',
  },
  overallNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  overallLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sectionStat: {
    alignItems: 'center',
  },
  sectionStatNum: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionStatLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  noData: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  historyLeft: {},
  historySection: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyScore: {
    fontSize: 18,
    fontWeight: '700',
  },
  historyDetail: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  clearButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
  },
  clearButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
});
