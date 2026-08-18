import { ReactNode } from 'react';
import { Show } from '@clerk/react';
import { Redirect } from 'expo-router';

export function AuthGate({ children }: { children: ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">
        <Redirect href="/" />
      </Show>
    </>
  );
}
