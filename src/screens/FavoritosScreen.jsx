import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFavoritos } from '../context/FavoritosContext';

const FavoritosScreen = () => {
  const navigation = useNavigation();
  const { favoritos, alternarFavorito } = useFavoritos();

  const abrirDetalhes = (serie) => {
    navigation.navigate('DetalhesSerie', { serie });
  };

  const removerFavorito = (serie) => {
    Alert.alert(
      'Remover dos favoritos',
      `Deseja remover "${serie.nome}" dos seus favoritos?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => alternarFavorito(serie),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#080808" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho igual ao da Home */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            ASSISTA<Text style={styles.plus}>+</Text>
          </Text>

          <Text style={styles.slogan}>
            SEU MUNDO DAS SÉRIES
          </Text>
        </View>

        {/* Título da tela */}
        <View style={styles.secao}>
          <View style={styles.secaoHeader}>
            <View>
              <Text style={styles.secaoTitulo}>
                Meus favoritos
              </Text>

              <Text style={styles.subtitulo}>
                Suas séries favoritas em um só lugar.
              </Text>
            </View>

            <MaterialCommunityIcons
              name="heart"
              size={27}
              color="#E50914"
            />
          </View>

          <Text style={styles.quantidade}>
            {favoritos.length}{' '}
            {favoritos.length === 1
              ? 'série favoritada'
              : 'séries favoritadas'}
          </Text>

          {favoritos.length === 0 ? (
            <View style={styles.vazio}>
              <View style={styles.iconeVazio}>
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={55}
                  color="#E50914"
                />
              </View>

              <Text style={styles.tituloVazio}>
                Sua lista está vazia
              </Text>

              <Text style={styles.textoVazio}>
                Você ainda não adicionou séries aos favoritos.
                Entre nos detalhes de uma série e toque no coração
                para encontrá-la aqui.
              </Text>

              <Pressable
                style={styles.botaoExplorar}
                onPress={() => navigation.navigate('Inicio')}
              >
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  color="#FFFFFF"
                />

                <Text style={styles.textoBotaoExplorar}>
                  Explorar séries
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.listaSeries}>
              {favoritos.map((serie) => (
                <View
                  key={String(serie.id)}
                  style={styles.card}
                >
                  <Pressable
                    style={styles.areaSerie}
                    onPress={() => abrirDetalhes(serie)}
                    accessibilityRole="button"
                    accessibilityLabel={`Ver detalhes de ${serie.nome}`}
                  >
                    {serie.imagem ? (
                      <Image
                        source={{ uri: serie.imagem }}
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

                    {serie.nota !== undefined &&
                    serie.nota !== null &&
                    serie.nota !== '' ? (
                      <View style={styles.nota}>
                        <Text style={styles.notaTexto}>
                          ★ {serie.nota}
                        </Text>
                      </View>
                    ) : null}

                    <Text style={styles.nomeSerie} numberOfLines={1}>
                      {serie.nome || 'Série sem título'}
                    </Text>

                    <Text style={styles.genero} numberOfLines={1}>
                      {serie.genero || 'Gênero não informado'}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.botaoRemover}
                    onPress={() => removerFavorito(serie)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remover ${serie.nome} dos favoritos`}
                    hitSlop={8}
                  >
                    <MaterialCommunityIcons
                      name="heart"
                      size={23}
                      color="#E50914"
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.rodape}>
          ASSISTA+ • SEU UNIVERSO DE SÉRIES
        </Text>
      </ScrollView>
    </View>
  );
};

export default FavoritosScreen;

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
    flexGrow: 1,
  },

  // Mesmo cabeçalho da Home
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
    marginTop: 27,
    flex: 1,
  },

  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  secaoTitulo: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },

  subtitulo: {
    color: '#999999',
    fontSize: 12,
    marginTop: 6,
  },

  quantidade: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 17,
  },

  listaSeries: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    marginBottom: 23,
    position: 'relative',
  },

  areaSerie: {
    width: '100%',
  },

  capa: {
    width: '100%',
    height: 225,
    borderRadius: 12,
    backgroundColor: '#202020',
  },

  capaVazia: {
    alignItems: 'center',
    justifyContent: 'center',
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

  botaoRemover: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#080808',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vazio: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 45,
    paddingBottom: 35,
  },

  iconeVazio: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  tituloVazio: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },

  textoVazio: {
    color: '#999999',
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
  },

  botaoExplorar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 23,
    gap: 8,
  },

  textoBotaoExplorar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  rodape: {
    color: '#555555',
    fontSize: 9,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 5,
  },
});
