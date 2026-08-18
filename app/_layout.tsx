import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider } from '@clerk/react';
import { Colors } from '../constants/colors';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/sign-in"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(auth)/sign-up"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="practice/[section]"
          options={{
            title: 'Quiz',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </ClerkProvider>
  );
}
