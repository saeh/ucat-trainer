import { View, StyleSheet } from 'react-native';
import { SignIn } from '@clerk/react';
import { Colors } from '../../constants/colors';
import { clerkAppearance } from '../../constants/clerkTheme';

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <SignIn
        routing="hash"
        fallbackRedirectUrl="/"
        appearance={clerkAppearance}
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
