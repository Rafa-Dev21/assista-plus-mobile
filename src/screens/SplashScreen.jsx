
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#080808" />

      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.content}>
        <View style={styles.logoIcon}>
          <Text style={styles.playIcon}>▶</Text>
        </View>

        <Text style={styles.logoText}>
          ASSISTA<Text style={styles.plus}>+</Text>
        </Text>

        <Text style={styles.tagline}>
          SEU MUNDO DE FILMES E SÉRIES
        </Text>
      </View>

      <View style={styles.loadingContainer}>
        <View style={styles.loadingTrack}>
          <View style={styles.loadingProgress} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  glowTop: {
    position: 'absolute',
    top: -100,
    left: -130,
    width: 280,
    height: 380,
    borderRadius: 200,
    borderWidth: 2,
    borderColor: '#E50914',
    backgroundColor: '#240407',
    opacity: 0.45,
  },

  glowBottom: {
    position: 'absolute',
    bottom: -170,
    right: -150,
    width: 330,
    height: 420,
    borderRadius: 220,
    borderWidth: 2,
    borderColor: '#E50914',
    backgroundColor: '#200306',
    opacity: 0.35,
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },

  logoIcon: {
    width: 100,
    height: 100,
    borderWidth: 5,
    borderColor: '#E50914',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  playIcon: {
    color: '#FFFFFF',
    fontSize: 43,
    marginLeft: 7,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 43,
    fontWeight: '900',
    letterSpacing: -1.5,
  },

  plus: {
    color: '#E50914',
    fontSize: 48,
    fontWeight: '900',
  },

  tagline: {
    color: '#D0D0D0',
    fontSize: 11,
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 14,
  },

  loadingContainer: {
    position: 'absolute',
    bottom: 65,
    alignItems: 'center',
  },

  loadingTrack: {
    width: 110,
    height: 7,
    borderRadius: 10,
    backgroundColor: '#303030',
    overflow: 'hidden',
  },

  loadingProgress: {
    width: '50%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#E50914',
  },
});
