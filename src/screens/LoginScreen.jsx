import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function LoginScreen({
  onIrCadastro,
  onLoginSucesso,
}) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrarLogin, setLembrarLogin] = useState(false);

  function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      alert('Preencha o e-mail e a senha.');
      return;
    }

    onLoginSucesso?.();
  }

  function handleCadastro() {
    onIrCadastro?.();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" backgroundColor="#080808" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <View style={styles.content}>
          <View style={styles.logoIcon}>
            <Text style={styles.playIcon}>▶</Text>
          </View>

          <Text style={styles.logoText}>
            ASSISTA<Text style={styles.plus}>+</Text>
          </Text>

          <Text style={styles.subtitle}>
            SEU MUNDO DAS SÉRIES
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>E-mail</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#777777"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Senha</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#777777"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
            />

            <Pressable
              style={styles.rememberContainer}
              onPress={() => setLembrarLogin(!lembrarLogin)}
            >
              <View
                style={[
                  styles.checkbox,
                  lembrarLogin && styles.checkboxChecked,
                ]}
              >
                {lembrarLogin && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>

              <Text style={styles.rememberText}>
                Lembrar meu login
              </Text>
            </Pressable>

            <Pressable
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>
                ENTRAR
              </Text>
            </Pressable>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Ainda não tem uma conta?
              </Text>

              <Pressable onPress={handleCadastro}>
                <Text style={styles.registerButton}>
                  Criar conta
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    left: -130,
    width: 280,
    height: 350,
    borderRadius: 200,
    borderWidth: 2,
    borderColor: '#E50914',
    backgroundColor: '#240407',
    opacity: 0.35,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -160,
    right: -140,
    width: 320,
    height: 400,
    borderRadius: 220,
    borderWidth: 2,
    borderColor: '#E50914',
    backgroundColor: '#200306',
    opacity: 0.3,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logoIcon: {
    width: 65,
    height: 65,
    borderWidth: 3,
    borderColor: '#E50914',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    marginLeft: 5,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  plus: {
    color: '#E50914',
    fontSize: 38,
    fontWeight: '900',
  },
  subtitle: {
    color: '#BDBDBD',
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 8,
    marginBottom: 35,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 420,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 9,
  },
  input: {
    height: 54,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#383838',
    borderRadius: 12,
    color: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 20,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: -4,
    marginBottom: 20,
    gap: 10,
  },
  checkbox: {
    width: 21,
    height: 21,
    borderWidth: 1.5,
    borderColor: '#777777',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171717',
  },
  checkboxChecked: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 18,
  },
  rememberText: {
    color: '#D0D0D0',
    fontSize: 13,
  },
  loginButton: {
    height: 54,
    backgroundColor: '#E50914',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 25,
    gap: 5,
  },
  registerText: {
    color: '#AAAAAA',
    fontSize: 13,
  },
  registerButton: {
    color: '#E50914',
    fontSize: 13,
    fontWeight: '800',
  },
});