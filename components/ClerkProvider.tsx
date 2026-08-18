import { ReactNode } from 'react';
import { ClerkProvider as BaseClerkProvider } from '@clerk/react';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

export function ClerkProvider({ children }: { children: ReactNode }) {
  return (
    <BaseClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      {children}
    </BaseClerkProvider>
  );
}
