import { View, StyleSheet } from 'react-native';
import { SignIn } from '@clerk/react';
import { Colors } from '../../constants/colors';

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <SignIn
        routing="path"
        path="/sign-in"
        fallbackRedirectUrl="/"
        appearance={{
          elements: {
            rootBox: { width: '100%', maxWidth: 400 },
            card: {
              backgroundColor: Colors.surface,
              boxShadow: 'none',
              border: `1px solid ${Colors.border}`,
            },
            formButtonPrimary: {
              backgroundColor: Colors.primary,
              '&:hover': { backgroundColor: Colors.primaryDark },
            },
            footerActionLink: { color: Colors.primary },
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
