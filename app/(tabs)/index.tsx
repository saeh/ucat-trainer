import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, Redirect } from 'expo-router';
import { Show } from '@clerk/react';
import { Colors } from '../../constants/colors';

export default function IndexScreen() {
  return (
    <>
      <Show when="signed-in">
        <Redirect href="/(tabs)/home" />
      </Show>
      <Show when="signed-out">
        <View style={styles.container}>
          <Text style={styles.icon}>🎓</Text>
          <Text style={styles.title}>UCAT Trainer</Text>
          <Text style={styles.subtitle}>
            Practise for the University Clinical Aptitude Test
          </Text>

          <View style={styles.buttons}>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Sign In</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Create Account</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Text style={styles.footer}>
            Track your progress across devices
          </Text>
        </View>
      </Show>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  icon: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 22,
  },
  buttons: {
    width: '100%',
    maxWidth: 320,
    gap: 14,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  footer: {
    marginTop: 40,
    fontSize: 13,
    color: Colors.textMuted,
  },
});
