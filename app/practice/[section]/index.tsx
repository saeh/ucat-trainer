import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { getSectionByKey } from '../../../constants/sections';
import { getBanksForSection } from '../../../data';

export default function BankPickerScreen() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const sectionInfo = getSectionByKey(section ?? '');
  const banks = getBanksForSection(section ?? '');

  if (!sectionInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Section not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[styles.sectionIcon, { color: sectionInfo.color }]}>{sectionInfo.icon}</Text>
      <Text style={styles.title}>{sectionInfo.fullName}</Text>
      <Text style={styles.subtitle}>
        {sectionInfo.description}
      </Text>

      <Text style={styles.bankTitle}>Choose a Question Bank</Text>
      <Text style={styles.bankSubtitle}>
        {banks.length} banks available · {banks[0]?.questionCount ?? 10} questions each · {banks[0]?.timeMinutes ?? 22} min timer
      </Text>

      <View style={styles.bankGrid}>
        {banks.map((bank, idx) => (
          <Link key={bank.id} href={`/practice/${section}/${bank.id}`} asChild>
            <TouchableOpacity style={[styles.bankCard, { borderColor: sectionInfo.color }]}>
              <Text style={[styles.bankNumber, { color: sectionInfo.color }]}>{idx + 1}</Text>
              <Text style={styles.bankName}>{bank.name}</Text>
              <Text style={styles.bankMeta}>
                {bank.questionCount}Q · {bank.timeMinutes}min
              </Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
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
    alignItems: 'center',
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
  },
  sectionIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  bankTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  bankSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 20,
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  bankCard: {
    width: '45%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  bankNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  bankName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  bankMeta: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
