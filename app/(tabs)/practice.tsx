import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../../constants/colors';
import { SECTIONS } from '../../constants/sections';
import { useScores } from '../../hooks/useScores';

export default function PracticeScreen() {
  const { getSectionStats } = useScores();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice</Text>
      <Text style={styles.subtitle}>Choose a section to practise</Text>

      {SECTIONS.map((section) => {
        const stats = getSectionStats(section.key);
        return (
          <Link key={section.key} href={`/practice/${section.key}`} asChild>
            <TouchableOpacity style={[styles.card, { borderLeftColor: section.color }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{section.icon}</Text>
                <View style={styles.cardTitleGroup}>
                  <Text style={styles.cardName}>{section.fullName}</Text>
                  <Text style={styles.cardMeta}>
                    {section.questions} questions · {section.timeMinutes} min timer
                  </Text>
                </View>
              </View>
              <Text style={styles.cardDesc}>{section.description}</Text>
              {stats.quizzes > 0 && (
                <View style={styles.cardStats}>
                  <Text style={styles.cardStatText}>
                    {stats.quizzes} quizzes · Best: {stats.bestPercentage}% · Avg: {stats.avgPercentage}%
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  cardTitleGroup: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  cardMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  cardStats: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cardStatText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
