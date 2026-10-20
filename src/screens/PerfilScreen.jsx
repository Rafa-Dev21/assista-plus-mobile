import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PerfilScreen() {
  const [nome, setNome] = useState('Seu nome');
  const [email, setEmail] = useState('seuemail@email.com');
  const [editando, setEditando] = useState(false);

  function salvarPerfil() {
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Preencha seu nome e e-mail.');
      return;
    }

    setEditando(false);

    Alert.alert(
      'Perfil atualizado',
      'Os dados foram atualizados nesta tela. O salvamento na API será implementado depois.',
    );
  }

  function sairDaConta() {
    Alert.alert(
      'Sair da conta',
      'A função de logout será conectada à autenticação posteriormente.',
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          ASSISTA<Text style={styles.plus}>+</Text>
        </Text>

        <Text style={styles.slogan}>SEU MUNDO DAS SÉRIES</Text>
      </View>

      {/* Perfil */}
      <View style={styles.perfil}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name="account"
            size={58}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.nomePerfil}>{nome}</Text>
        <Text style={styles.emailPerfil}>{email}</Text>

        <View style={styles.badge}>
          <MaterialCommunityIcons
            name="check-circle"
            size={15}
            color="#E50914"
          />
          <Text style={styles.badgeTexto}>Minha conta</Text>
        </View>
      </View>

      {/* Dados da conta */}
      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>DADOS DA CONTA</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nome completo</Text>

          <TextInput
            style={[
              styles.input,
              !editando && styles.inputDesativado,
            ]}
            value={nome}
            onChangeText={setNome}
            editable={editando}
            placeholder="Digite seu nome"
            placeholderTextColor="#777777"
          />

          <View style={styles.divisor} />

          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={[
              styles.input,
              !editando && styles.inputDesativado,
            ]}
            value={email}
            onChangeText={setEmail}
            editable={editando}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#777777"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Pressable
          style={styles.botaoPrincipal}
          onPress={() => {
            if (editando) {
              salvarPerfil();
            } else {
              setEditando(true);
            }
          }}
        >
          <MaterialCommunityIcons
            name={editando ? 'content-save-outline' : 'pencil-outline'}
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.textoBotao}>
            {editando ? 'Salvar alterações' : 'Editar perfil'}
          </Text>
        </Pressable>

        {editando && (
          <Pressable
            style={styles.botaoCancelar}
            onPress={() => {
              setNome('Seu nome');
              setEmail('seuemail@email.com');
              setEditando(false);
            }}
          >
            <Text style={styles.textoCancelar}>Cancelar edição</Text>
          </Pressable>
        )}
      </View>

      {/* Informações */}
      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>SOBRE SUA CONTA</Text>

        <View style={styles.opcao}>
          <MaterialCommunityIcons
            name="movie-open-outline"
            size={24}
            color="#E50914"
          />

          <View style={styles.opcaoConteudo}>
            <Text style={styles.opcaoTitulo}>Minhas Séries</Text>
            <Text style={styles.opcaoDescricao}>
              Suas séries cadastradas aparecerão aqui no aplicativo.
            </Text>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={23}
            color="#777777"
          />
        </View>

        <View style={styles.opcao}>
          <MaterialCommunityIcons
            name="heart-outline"
            size={24}
            color="#E50914"
          />

          <View style={styles.opcaoConteudo}>
            <Text style={styles.opcaoTitulo}>Favoritos</Text>
            <Text style={styles.opcaoDescricao}>
              Acesse as séries que você favoritou.
            </Text>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={23}
            color="#777777"
          />
        </View>
      </View>

      {/* Sair */}
      <Pressable style={styles.botaoSair} onPress={sairDaConta}>
        <MaterialCommunityIcons
          name="logout"
          size={20}
          color="#E50914"
        />
        <Text style={styles.textoSair}>Sair da conta</Text>
      </Pressable>

      <Text style={styles.versao}>ASSISTA+ • VERSÃO 1.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  conteudo: {
    paddingBottom: 35,
  },
  header: {
    paddingTop: 58,
    paddingHorizontal: 22,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#202020',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: 1,
  },
  plus: {
    color: '#E50914',
  },
  slogan: {
    color: '#888888',
    fontSize: 10,
    letterSpacing: 3,
    marginTop: 5,
  },
  perfil: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#202020',
  },
  avatar: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: '#202020',
    borderWidth: 2,
    borderColor: '#E50914',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  nomePerfil: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  emailPerfil: {
    color: '#999999',
    fontSize: 14,
    marginTop: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 13,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  badgeTexto: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  secao: {
    paddingHorizontal: 22,
    marginTop: 26,
  },
  tituloSecao: {
    color: '#999999',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#292929',
  },
  label: {
    color: '#AAAAAA',
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  inputDesativado: {
    borderBottomColor: '#292929',
  },
  divisor: {
    height: 20,
  },
  botaoPrincipal: {
    backgroundColor: '#E50914',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botaoCancelar: {
    alignItems: 'center',
    padding: 13,
  },
  textoCancelar: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#292929',
    gap: 12,
  },
  opcaoConteudo: {
    flex: 1,
  },
  opcaoTitulo: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  opcaoDescricao: {
    color: '#888888',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginHorizontal: 22,
    marginTop: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: '#482025',
    borderRadius: 10,
  },
  textoSair: {
    color: '#E50914',
    fontSize: 15,
    fontWeight: 'bold',
  },
  versao: {
    color: '#555555',
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 25,
  },
});
