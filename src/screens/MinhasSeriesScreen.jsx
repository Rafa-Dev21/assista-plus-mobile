
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMinhasSeries } from '../context/MinhasSeriesContext';

export default function MinhasSeriesScreen({ usuario }) {
  const navigation = useNavigation();

  const {
    obterMinhasSeries,
    removerMinhaSerie,
    carregandoMinhasSeries,
  } = useMinhasSeries();

  const series = obterMinhasSeries(usuario?.id);

  function abrirDetalhes(serie) {
    navigation.navigate('DetalhesSerie', {
      serie,
      usuario,
    });
  }

  function confirmarRemocao(serie) {
    Alert.alert(
      'Remover série',
      `Deseja remover "${serie.titulo}" da sua lista?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => removerMinhaSerie(serie.id, usuario?.id),
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#080808" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>
            ASSISTA<Text style={styles.plus}>+</Text>
          </Text>

          <Text style={styles.slogan}>
            SEU MUNDO DAS SÉRIES
          </Text>
        </View>

        <View style={styles.secao}>
          <View style={styles.secaoHeader}>
            <View>
              <Text style={styles.secaoTitulo}>
                Minhas séries
              </Text>

              <Text style={styles.subtitulo}>
                Todas as séries que você cadastrou.
              </Text>
            </View>

            <MaterialCommunityIcons
              name="movie-open"
              size={29}
              color="#E50914"
            />
          </View>

          <Text style={styles.quantidade}>
            {series.length}{' '}
            {series.length === 1
              ? 'série cadastrada'
              : 'séries cadastradas'}
          </Text>

          {carregandoMinhasSeries ? (
            <View style={styles.vazio}>
              <ActivityIndicator size="large" color="#E50914" />
              <Text style={styles.textoVazio}>
                Carregando suas séries...
              </Text>
            </View>
          ) : series.length === 0 ? (
            <View style={styles.vazio}>
              <View style={styles.iconeVazio}>
                <MaterialCommunityIcons
                  name="movie-open-outline"
                  size={55}
                  color="#E50914"
                />
              </View>

              <Text style={styles.tituloVazio}>
                Você ainda não cadastrou séries
              </Text>

              <Text style={styles.textoVazio}>
                As séries que você cadastrar e finalizar aparecerão aqui.
              </Text>

              <Pressable
                style={styles.botaoExplorar}
                onPress={() => navigation.navigate('CadastrarSerie')}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={21}
                  color="#FFFFFF"
                />

                <Text style={styles.textoBotaoExplorar}>
                  Cadastrar série
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.listaSeries}>
              {series.map((serie) => {
                const imagem = serie.imagemUrl || serie.imagem;

                const genero = Array.isArray(serie.nomeGeneros)
                  ? serie.nomeGeneros.join(' / ')
                  : 'Gênero não informado';

                return (
                  <View
                    key={`${serie.usuarioId}-${serie.id}`}
                    style={styles.card}
                  >
                    <Pressable
                      style={styles.areaSerie}
                      onPress={() => abrirDetalhes(serie)}
                    >
                      {imagem ? (
                        <Image
                          source={{ uri: imagem }}
                          style={styles.capa}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.capa, styles.capaVazia]}>
                          <MaterialCommunityIcons
                            name="movie-open"
                            size={32}
                            color="#777777"
                          />
                        </View>
                      )}

                      <Text
                        style={styles.nomeSerie}
                        numberOfLines={1}
                      >
                        {serie.titulo}
                      </Text>

                      <Text
                        style={styles.genero}
                        numberOfLines={1}
                      >
                        {genero}
                      </Text>

                      <Text style={styles.ano}>
                        {serie.anoLancamento || 'Ano não informado'}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={styles.botaoRemover}
                      onPress={() => confirmarRemocao(serie)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remover ${serie.titulo}`}
                    >
                      <MaterialCommunityIcons
                        name="delete-outline"
                        size={23}
                        color="#E50914"
                      />
                    </Pressable>
                  </View>
                );
              })}
            </View>
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
  secao: {
    paddingHorizontal: 22,
    marginTop: 28,
  },
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secaoTitulo: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#888888',
    fontSize: 13,
    marginTop: 7,
  },
  quantidade: {
    color: '#AAAAAA',
    fontSize: 13,
    marginTop: 20,
    marginBottom: 15,
  },
  vazio: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#151515',
    borderRadius: 14,
    padding: 28,
    marginTop: 10,
  },
  iconeVazio: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tituloVazio: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  textoVazio: {
    color: '#999999',
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
  },
  botaoExplorar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E50914',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 9,
    marginTop: 22,
  },
  textoBotaoExplorar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listaSeries: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#292929',
  },
  areaSerie: {
    flex: 1,
  },
  capa: {
    width: '100%',
    height: 210,
    borderRadius: 8,
    backgroundColor: '#252525',
  },
  capaVazia: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nomeSerie: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 11,
  },
  genero: {
    color: '#AAAAAA',
    fontSize: 11,
    marginTop: 5,
  },
  ano: {
    color: '#777777',
    fontSize: 11,
    marginTop: 5,
  },
  botaoRemover: {
    alignSelf: 'flex-end',
    padding: 7,
    marginTop: 5,
  },
  rodape: {
    color: '#555555',
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 25,
  },
});
