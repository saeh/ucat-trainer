import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider } from '@clerk/react';
import { Colors } from '../constants/colors';
import { ScoresProvider } from '../hooks/useScores';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  if (!publishableKey) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} domain="ucatlearn.com">
      <ScoresProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
            contentStyle: { backgroundColor: Colors.background },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="(auth)/sign-in"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(auth)/sign-up"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="practice/[section]/index"
            options={{
              title: '',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="practice/[section]/[bank]"
            options={{
              title: '',
              headerBackTitle: 'Back',
            }}
          />
        </Stack>
      </ScoresProvider>
    </ClerkProvider>
  );
}
