
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

export default function CadastroScreen({ onVoltarLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleCadastro() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      alert('Preencha todos os campos.');
      return;
    }

    alert('Cadastro pronto! A conexão com a API será feita depois.');
  }

  function handleLogin() {
    onVoltarLogin?.();
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
            <Text style={styles.formTitle}>Criar conta</Text>

            <Text style={styles.formDescription}>
              Entre para o mundo do entretenimento.
            </Text>

            <Text style={styles.label}>Nome completo</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#777777"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              autoCorrect={false}
            />

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
              placeholder="Crie uma senha"
              placeholderTextColor="#777777"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
            />

            <Pressable
              style={styles.registerButton}
              onPress={handleCadastro}
            >
              <Text style={styles.registerButtonText}>
                CRIAR CONTA
              </Text>
            </Pressable>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Já tem uma conta?
              </Text>

              <Pressable onPress={handleLogin}>
                <Text style={styles.loginLink}>
                  Entrar
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
    paddingVertical: 35,
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
    width: 60,
    height: 60,
    borderWidth: 3,
    borderColor: '#E50914',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 26,
    marginLeft: 5,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  plus: {
    color: '#E50914',
    fontSize: 36,
    fontWeight: '900',
  },
  subtitle: {
    color: '#BDBDBD',
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 8,
    marginBottom: 25,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 420,
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 7,
  },
  formDescription: {
    color: '#AAAAAA',
    fontSize: 13,
    marginBottom: 23,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#383838',
    borderRadius: 12,
    color: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 17,
  },
  registerButton: {
    height: 54,
    backgroundColor: '#E50914',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 22,
    gap: 5,
  },
  loginText: {
    color: '#AAAAAA',
    fontSize: 13,
  },
  loginLink: {
    color: '#E50914',
    fontSize: 13,
    fontWeight: '800',
  },
});
