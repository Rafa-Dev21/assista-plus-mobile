
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const API_URL = 'https://assista-plus.onrender.com/series';

export default function HomeScreen({ onAbrirSerie }) {
  const [busca, setBusca] = useState('');
  const [series, setSeries] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarSeries() {
      try {
        setErro('');

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
          throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        const listaSeries =
          dados._embedded?.serieResponseDTOList ?? [];

        setSeries(Array.isArray(listaSeries) ? listaSeries : []);
      } catch (error) {
        console.error('Erro ao carregar séries:', error);
        setErro(
          'Não foi possível carregar as séries. Verifique sua conexão e tente novamente.'
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarSeries();
  }, []);

  const seriesFiltradas = series.filter((serie) =>
    serie.titulo
      ?.toLowerCase()
      .includes(busca.toLowerCase().trim())
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

          <Text style={styles.slogan}>
            SEU MUNDO DAS SÉRIES
          </Text>
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
            <Text style={styles.secaoTitulo}>
              Em destaque
            </Text>

            <Text style={styles.quantidade}>
              {seriesFiltradas.length}{' '}
              {seriesFiltradas.length === 1
                ? 'série'
                : 'séries'}
            </Text>
          </View>

          {carregando && (
            <View style={styles.estadoContainer}>
              <ActivityIndicator
                size="large"
                color="#E50914"
              />

              <Text style={styles.estadoTexto}>
                Carregando séries...
              </Text>
            </View>
          )}

          {!carregando && erro !== '' && (
            <View style={styles.estadoContainer}>
              <Text style={styles.erroTexto}>{erro}</Text>

              <Pressable
                style={styles.botaoTentar}
                onPress={() => {
                  setCarregando(true);
                  setErro('');

                  fetch(API_URL)
                    .then((resposta) => {
                      if (!resposta.ok) {
                        throw new Error(
                          `Erro HTTP: ${resposta.status}`
                        );
                      }

                      return resposta.json();
                    })
                    .then((dados) => {
                      const lista =
                        dados._embedded?.serieResponseDTOList ??
                        [];

                      setSeries(
                        Array.isArray(lista) ? lista : []
                      );
                    })
                    .catch((error) => {
                      console.error(
                        'Erro ao tentar novamente:',
                        error
                      );

                      setErro(
                        'Não foi possível carregar as séries. Tente novamente.'
                      );
                    })
                    .finally(() => setCarregando(false));
                }}
              >
                <Text style={styles.botaoTentarTexto}>
                  TENTAR NOVAMENTE
                </Text>
              </Pressable>
            </View>
          )}

          {!carregando && erro === '' && (
            <>
              <View style={styles.listaSeries}>
                {seriesFiltradas.map((serie) => (
                  <Pressable
                    key={serie.id}
                    style={styles.card}
                    onPress={() => onAbrirSerie?.(serie)}
                    accessibilityRole="button"
                    accessibilityLabel={`Ver detalhes de ${serie.titulo}`}
                  >
                    {serie.imagemUrl ? (
                      <Image
                        source={{ uri: serie.imagemUrl }}
                        style={styles.capa}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[
                          styles.capa,
                          styles.capaSemImagem,
                        ]}
                      >
                        <Text style={styles.capaSemImagemTexto}>
                          ASSISTA+
                        </Text>
                      </View>
                    )}

                    <View style={styles.status}>
                      <Text style={styles.statusTexto}>
                        {serie.status || 'SEM STATUS'}
                      </Text>
                    </View>

                    <Text
                      style={styles.nomeSerie}
                      numberOfLines={2}
                    >
                      {serie.titulo || 'Série sem título'}
                    </Text>

                    <Text
                      style={styles.genero}
                      numberOfLines={2}
                    >
                      {serie.nomeGeneros?.join(' / ') ||
                        'Sem gênero informado'}
                    </Text>

                    {serie.anoLancamento != null && (
                      <Text style={styles.ano}>
                        {serie.anoLancamento}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>

              {seriesFiltradas.length === 0 && (
                <Text style={styles.semResultados}>
                  {series.length === 0
                    ? 'Nenhuma série cadastrada ainda.'
                    : 'Nenhuma série encontrada.'}
                </Text>
              )}
            </>
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
  capaSemImagem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  capaSemImagemTexto: {
    color: '#E50914',
    fontSize: 18,
    fontWeight: '900',
  },
  status: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#251012',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  statusTexto: {
    color: '#FF5B63',
    fontSize: 9,
    fontWeight: '800',
  },
  nomeSerie: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
  },
  genero: {
    color: '#999999',
    fontSize: 12,
    marginTop: 5,
  },
  ano: {
    color: '#777777',
    fontSize: 11,
    marginTop: 5,
  },
  estadoContainer: {
    alignItems: 'center',
    paddingVertical: 35,
  },
  estadoTexto: {
    color: '#999999',
    fontSize: 13,
    marginTop: 12,
  },
  erroTexto: {
    color: '#FF7777',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  botaoTentar: {
    backgroundColor: '#E50914',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 18,
  },
  botaoTentarTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  semResultados: {
    color: '#999999',
    textAlign: 'center',
    marginTop: 25,
    lineHeight: 20,
  },
  rodape: {
    color: '#555555',
    fontSize: 9,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 5,
  },
});
