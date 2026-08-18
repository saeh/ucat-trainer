import { View, StyleSheet } from 'react-native';
import { SignUp } from '@clerk/react';
import { Colors } from '../../constants/colors';
import { clerkAppearance } from '../../constants/clerkTheme';

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <SignUp
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
