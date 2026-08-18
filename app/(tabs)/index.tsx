import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../../constants/colors';
import { SECTIONS } from '../../constants/sections';
import { useScores } from '../../hooks/useScores';

export default function HomeScreen() {
  const { getOverallStats, loading } = useScores();
  const stats = getOverallStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>UCAT Trainer</Text>
        <Text style={styles.subtitle}>University Clinical Aptitude Test</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalQuizzes}</Text>
          <Text style={styles.statLabel}>Quizzes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.avgPercentage}%</Text>
          <Text style={styles.statLabel}>Avg Score</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalQuestions}</Text>
          <Text style={styles.statLabel}>Questions</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Sections</Text>
      {SECTIONS.map((section) => (
        <Link key={section.key} href={`/practice/${section.key}`} asChild>
          <TouchableOpacity style={[styles.sectionCard, { borderLeftColor: section.color }]}>
            <View style={styles.sectionIcon}>
              <Text style={styles.iconText}>{section.icon}</Text>
            </View>
            <View style={styles.sectionInfo}>
              <Text style={styles.sectionName}>{section.fullName}</Text>
              <Text style={styles.sectionDesc}>{section.questions} questions · {section.timeMinutes} min</Text>
            </View>
            <Text style={[styles.arrow, { color: section.color }]}>›</Text>
          </TouchableOpacity>
        </Link>
      ))}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>2026 UCAT Format</Text>
        <Text style={styles.infoText}>
          4 sections · 184 questions · ~2 hours. Abstract Reasoning was removed in 2025.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconText: {
    fontSize: 22,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },
  infoBox: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
