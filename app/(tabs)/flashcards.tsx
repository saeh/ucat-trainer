import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../constants/colors';
import { SECTIONS, SectionKey } from '../../constants/sections';
import vrFlashcards from '../../data/flashcards/vr.json';
import dmFlashcards from '../../data/flashcards/dm.json';
import qrFlashcards from '../../data/flashcards/qr.json';
import sjtFlashcards from '../../data/flashcards/sjt.json';

const ALL_FLASHCARDS: Record<SectionKey, typeof vrFlashcards.cards> = {
  vr: vrFlashcards.cards,
  dm: dmFlashcards.cards,
  qr: qrFlashcards.cards,
  sjt: sjtFlashcards.cards,
};

export default function FlashcardsScreen() {
  const [selectedSection, setSelectedSection] = useState<SectionKey | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const allCards = selectedSection === 'all'
    ? Object.values(ALL_FLASHCARDS).flat()
    : ALL_FLASHCARDS[selectedSection];

  const card = allCards[currentIndex];

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % allCards.length);
  }, [allCards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + allCards.length) % allCards.length);
  }, [allCards.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Flashcards</Text>
      <Text style={styles.subtitle}>Tap a card to flip it</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, selectedSection === 'all' && styles.filterChipActive]}
          onPress={() => { setSelectedSection('all'); setCurrentIndex(0); setIsFlipped(false); }}
        >
          <Text style={[styles.filterText, selectedSection === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        {SECTIONS.map((s) => (
          <TouchableOpacity
            key={s.key}
            style={[styles.filterChip, selectedSection === s.key && { backgroundColor: s.color }]}
            onPress={() => { setSelectedSection(s.key); setCurrentIndex(0); setIsFlipped(false); }}
          >
            <Text style={[styles.filterText, selectedSection === s.key && styles.filterTextActive]}>
              {s.icon} {s.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.cardContainer} onPress={handleFlip} activeOpacity={0.8}>
        <View style={[styles.card, isFlipped ? styles.cardBack : styles.cardFront]}>
          <Text style={styles.cardCounter}>
            {currentIndex + 1} / {allCards.length}
          </Text>
          <Text style={[styles.cardText, isFlipped && styles.cardTextBack]}>
            {isFlipped ? card?.back : card?.front}
          </Text>
          <Text style={styles.flipHint}>
            {isFlipped ? 'Tap to see front' : 'Tap to reveal answer'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navButton} onPress={handlePrev}>
          <Text style={styles.navButtonText}>← Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary]} onPress={handleNext}>
          <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>Next →</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  filterRow: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.text,
  },
  cardContainer: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 28,
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFront: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  cardBack: {
    borderWidth: 2,
    borderColor: Colors.success,
  },
  cardCounter: {
    position: 'absolute',
    top: 14,
    right: 18,
    fontSize: 12,
    color: Colors.textMuted,
  },
  cardText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
  },
  cardTextBack: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  flipHint: {
    position: 'absolute',
    bottom: 14,
    fontSize: 11,
    color: Colors.textMuted,
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  navButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  navButtonTextPrimary: {
    color: Colors.text,
  },
});
