import { View, Image, StyleSheet } from 'react-native';

const LOGO_ASPECT = 813 / 270;

interface LogoProps {
  width?: number;
  compact?: boolean;
}

export function Logo({ width = 220, compact = false }: LogoProps) {
  const height = width / LOGO_ASPECT;
  return (
    <View
      style={[
        styles.card,
        compact ? styles.cardCompact : styles.cardDefault,
        { width, height },
      ]}
    >
      <Image
        source={require('../assets/logo.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardDefault: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cardCompact: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});