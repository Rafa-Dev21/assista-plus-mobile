import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

const series = [
  {
    id: '1',
    nome: 'Stranger Things',
    genero: 'Ficção científica',
    nota: '8.7',
    imagem:
      'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
  },
  {
    id: '2',
    nome: 'Breaking Bad',
    genero: 'Drama / Crime',
    nota: '9.5',
    imagem:
      'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
  },
  {
    id: '3',
    nome: 'The Last of Us',
    genero: 'Drama / Aventura',
    nota: '8.5',
    imagem:
      'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
  },
  {
    id: '4',
    nome: 'Wandinha',
    genero: 'Mistério / Comédia',
    nota: '8.0',
    imagem:
      'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
  },
];

export default function HomeScreen({ onAbrirSerie }) {
  const [busca, setBusca] = useState('');

  const seriesFiltradas = series.filter((serie) =>
    serie.nome.toLowerCase().includes(busca.toLowerCase().trim())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#080808" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>
            ASSISTA<Text style={styles.plus}>+</Text>
          </Text>

          <Text style={styles.slogan}>SEU MUNDO DAS SÉRIES</Text>
        </View>

        <View style={styles.buscaContainer}>
          <Text style={styles.iconeBusca}>⌕</Text>

          <TextInput
            style={styles.inputBusca}
            placeholder="Buscar séries..."
            placeholderTextColor="#777777"
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.secao}>
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitulo}>Em destaque</Text>

            <Text style={styles.quantidade}>
              {seriesFiltradas.length}{' '}
              {seriesFiltradas.length === 1 ? 'série' : 'séries'}
            </Text>
          </View>

          <View style={styles.listaSeries}>
            {seriesFiltradas.map((serie) => (
              <Pressable
                key={serie.id}
                style={styles.card}
                onPress={() => onAbrirSerie?.(serie)}
                accessibilityRole="button"
                accessibilityLabel={`Ver detalhes de ${serie.nome}`}
              >
                <Image
                  source={{ uri: serie.imagem }}
                  style={styles.capa}
                  resizeMode="cover"
                />

                <View style={styles.nota}>
                  <Text style={styles.notaTexto}>
                    ★ {serie.nota}
                  </Text>
                </View>

                <Text style={styles.nomeSerie} numberOfLines={1}>
                  {serie.nome}
                </Text>

                <Text style={styles.genero} numberOfLines={1}>
                  {serie.genero}
                </Text>
              </Pressable>
            ))}
          </View>

          {seriesFiltradas.length === 0 && (
            <Text style={styles.semResultados}>
              Nenhuma série encontrada.
            </Text>
          )}
        </View>

        <Text style={styles.rodape}>
          ASSISTA+ • SEU UNIVERSO DE SÉRIES
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
  buscaContainer: {
    height: 49,
    marginHorizontal: 22,
    marginTop: 22,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#292929',
    borderRadius: 12,
  },
  iconeBusca: {
    color: '#E50914',
    fontSize: 27,
    marginRight: 10,
  },
  inputBusca: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  secao: {
    paddingHorizontal: 22,
    marginTop: 27,
  },
  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  secaoTitulo: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },
  quantidade: {
    color: '#888888',
    fontSize: 12,
  },
  listaSeries: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 23,
  },
  capa: {
    width: '100%',
    height: 225,
    borderRadius: 12,
    backgroundColor: '#202020',
  },
  nota: {
    position: 'absolute',
    top: 9,
    left: 8,
    backgroundColor: '#080808',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
  },
  notaTexto: {
    color: '#FFD166',
    fontSize: 12,
    fontWeight: '800',
  },
  nomeSerie: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 10,
  },
  genero: {
    color: '#999999',
    fontSize: 12,
    marginTop: 5,
  },
  semResultados: {
    color: '#999999',
    textAlign: 'center',
    marginTop: 25,
  },
  rodape: {
    color: '#555555',
    fontSize: 9,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 5,
  },
});
