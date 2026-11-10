

import { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiGet, apiPost } from '../services/api';

import { useFavoritos } from '../context/FavoritosContext';

const DetalhesSerieScreen = ({ route, navigation }) => {
  const serie = route?.params?.serie;
  const usuario = route?.params?.usuario;

  const { alternarFavorito, ehFavorito } = useFavoritos();

  const favorita = serie ? ehFavorito(serie.id) : false;

  const [temporadaAberta, setTemporadaAberta] = useState(null);
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [comentario, setComentario] = useState('');

  const [temporadas, setTemporadas] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [publicando, setPublicando] = useState(false);

  const detalhes = {
    sinopse:
      serie?.descricao?.trim() ||
      'Nenhuma sinopse foi cadastrada para esta série.',

    diretor:
      serie?.nomeDiretor ||
      'Diretor não informado',

    generos:
      Array.isArray(serie?.nomeGeneros)
        ? serie.nomeGeneros
        : [],

    ano: serie?.anoLancamento,

    status:
      serie?.status ||
      'Não informado',
  };

  
const carregarDados = useCallback(async () => {
  if (!serie?.id) return;

  try {
    setCarregando(true);

    const [
      dadosTemporadas,
      dadosEpisodios,
      dadosAvaliacoes,
    ] = await Promise.all([
      apiGet('/temporadas?page=0&size=100'),
      apiGet('/episodios?page=0&size=100'),
      apiGet('/avaliacoes?page=0&size=100'),
    ]);

    const listaTemporadas =
      dadosTemporadas?._embedded?.temporadaResponseDTOList || [];

    const listaEpisodios =
      dadosEpisodios?._embedded?.episodioResponseDTOList || [];

    const listaAvaliacoes =
      dadosAvaliacoes?._embedded?.avaliacaoResponseDTOList || [];

    const temporadasDaSerie = listaTemporadas
      .filter(
        (temporada) =>
          Number(temporada.serieId) === Number(serie.id)
      )
      .sort((a, b) => a.numero - b.numero)
      .map((temporada) => ({
        ...temporada,
        episodios: listaEpisodios
          .filter(
            (episodio) =>
              Number(episodio.temporadaId) === Number(temporada.id)
          )
          .sort((a, b) => a.numero - b.numero),
      }));

    const avaliacoesDaSerie = listaAvaliacoes.filter(
      (avaliacao) =>
        Number(avaliacao.serieId) === Number(serie.id)
    );

    setTemporadas(temporadasDaSerie);
    setAvaliacoes(avaliacoesDaSerie);

  } catch (error) {
    console.log('Erro ao carregar detalhes:', error.message);

    Alert.alert(
      'Erro',
      'Não foi possível carregar as informações da série.'
    );
  } finally {
    setCarregando(false);
  }
}, [serie?.id]);


  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const quantidadeEpisodios = temporadas.reduce(
    (total, temporada) =>
      total + temporada.episodios.length,
    0
  );

  
const publicarAvaliacao = async () => {
  const textoComentario = comentario.trim();

  if (notaSelecionada === 0) {
    Alert.alert(
      'Escolha uma nota',
      'Selecione de 1 a 5 estrelas antes de publicar.'
    );
    return;
  }

  if (!textoComentario) {
    Alert.alert(
      'Escreva um comentário',
      'Digite sua opinião antes de publicar.'
    );
    return;
  }

  if (!usuario?.id) {
    Alert.alert(
      'Usuário não identificado',
      'Não foi possível identificar o usuário logado. Faça login novamente.'
    );
    return;
  }

  if (!serie?.id) {
    Alert.alert('Erro', 'Não foi possível identificar a série.');
    return;
  }

  try {
    setPublicando(true);

    await apiPost('/avaliacoes', {
      nota: notaSelecionada,
      comentario: textoComentario,
      usuarioId: usuario.id,
      serieId: serie.id,
    });

    setNotaSelecionada(0);
    setComentario('');

    await carregarDados();

    Alert.alert(
      'Avaliação publicada!',
      'Sua avaliação foi salva com sucesso.'
    );
  } catch (error) {
    console.log('Erro ao publicar avaliação:', error.message);

    Alert.alert(
      'Erro',
      'Não foi possível salvar sua avaliação. Tente novamente.'
    );
  } finally {
    setPublicando(false);
  }
};


  const handleFavorito = () => {
    if (!serie) {
      Alert.alert(
        'Série não encontrada',
        'Não foi possível identificar a série para favoritar.'
      );
      return;
    }

    alternarFavorito(serie);

    Alert.alert(
      favorita ? 'Favorito removido' : 'Adicionado aos favoritos',
      favorita
        ? 'A série foi removida dos seus favoritos.'
        : 'A série foi salva nos favoritos do seu aparelho.'
    );
  };

  if (!serie) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#080808" />

        <Text style={styles.erro}>
          Não foi possível carregar os detalhes da série.
        </Text>

        <Pressable
          style={styles.botaoVoltar}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.textoVoltar}>‹  Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#080808" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={styles.botaoVoltar}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.textoVoltar}>‹  Voltar</Text>
        </Pressable>

        {/* Informações principais */}
        <View style={styles.cabecalho}>
          {serie.imagemUrl ? (
            <Image
              source={{ uri: serie.imagemUrl }}
              style={styles.capa}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.capa, styles.capaVazia]}>
              <MaterialCommunityIcons
                name="movie-open-outline"
                size={38}
                color="#777777"
              />
              <Text style={styles.textoCapaVazia}>
                Sem imagem
              </Text>
            </View>
          )}

          <View style={styles.informacoesPrincipais}>
            <Text style={styles.titulo}>
              {serie.titulo ?? 'Detalhes da série'}
            </Text>

            <Text style={styles.generoPrincipal}>
              {detalhes.generos.length > 0
                ? detalhes.generos.join(' / ')
                : 'Gênero não informado'}
            </Text>

            {detalhes.ano != null && (
              <Text style={styles.dadoPrincipal}>
                Ano: {detalhes.ano}
              </Text>
            )}

            <Text style={styles.dadoPrincipal}>
              Status: {detalhes.status}
            </Text>

            <Text style={styles.dadoPrincipal}>
              Diretor: {detalhes.diretor}
            </Text>
          </View>
        </View>

        {/* Favoritos */}
        <View style={styles.areaFavorito}>
          <Pressable
            style={[
              styles.botaoFavorito,
              favorita && styles.botaoFavoritoAtivo,
            ]}
            onPress={handleFavorito}
          >
            <MaterialCommunityIcons
              name={favorita ? 'heart' : 'heart-outline'}
              size={23}
              color={favorita ? '#E50914' : '#FFFFFF'}
            />

            <Text style={styles.textoBotaoFavorito}>
              {favorita
                ? 'Remover dos favoritos'
                : 'Adicionar aos favoritos'}
            </Text>
          </Pressable>
        </View>

        {/* Sinopse */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Sinopse</Text>
          <Text style={styles.descricao}>
            {detalhes.sinopse}
          </Text>
        </View>

        {/* Gêneros */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Gêneros</Text>

          {detalhes.generos.length > 0 ? (
            <View style={styles.listaGeneros}>
              {detalhes.generos.map((genero, index) => (
                <View
                  key={`${genero}-${index}`}
                  style={styles.generoTag}
                >
                  <Text style={styles.textoGeneroTag}>
                    {genero}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.descricao}>
              Nenhum gênero cadastrado.
            </Text>
          )}
        </View>

        {/* Temporadas e episódios */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>
            Temporadas e episódios
          </Text>

          {carregando ? (
            <Text style={styles.textoAuxiliar}>
              Carregando temporadas e episódios...
            </Text>
          ) : temporadas.length === 0 ? (
            <Text style={styles.textoAuxiliar}>
              Nenhuma temporada cadastrada para esta série.
            </Text>
          ) : (
            <>
              <Text style={styles.textoAuxiliar}>
                {temporadas.length} temporada(s) · {quantidadeEpisodios} episódio(s)
              </Text>

              {temporadas.map((temporada) => {
                const aberta =
                  temporadaAberta === temporada.id;

                return (
                  <View
                    key={temporada.id}
                    style={styles.cardTemporada}
                  >
                    <Pressable
                      style={styles.cabecalhoTemporada}
                      onPress={() =>
                        setTemporadaAberta(
                          aberta ? null : temporada.id
                        )
                      }
                    >
                      <View style={styles.numeroTemporada}>
                        <Text style={styles.numeroTemporadaTexto}>
                          {temporada.numero}
                        </Text>
                      </View>

                      <View style={styles.infoTemporada}>
                        <Text style={styles.nomeTemporada}>
                          Temporada {temporada.numero}
                        </Text>

                        <Text style={styles.quantidadeEpisodiosTexto}>
                          {temporada.episodios.length}{' '}
                          {temporada.episodios.length === 1
                            ? 'episódio'
                            : 'episódios'}
                        </Text>
                      </View>

                      <Text style={styles.setaTemporada}>
                        {aberta ? '−' : '+'}
                      </Text>
                    </Pressable>

                    {aberta && (
                      <View style={styles.listaEpisodios}>
                        {temporada.episodios.length === 0 ? (
                          <Text style={styles.textoAuxiliar}>
                            Nenhum episódio cadastrado nesta temporada.
                          </Text>
                        ) : (
                          temporada.episodios.map((episodio) => (
                            <View
                              key={episodio.id}
                              style={styles.cardEpisodio}
                            >
                              <View style={styles.numeroEpisodio}>
                                <Text style={styles.numeroEpisodioTexto}>
                                  {String(episodio.numero).padStart(2, '0')}
                                </Text>
                              </View>

                              <View style={styles.infoEpisodio}>
                                <Text style={styles.tituloEpisodio}>
                                  {episodio.titulo}
                                </Text>

                                <Text style={styles.detalheEpisodio}>
                                  Episódio {episodio.numero}
                                </Text>
                              </View>

                              <Text style={styles.duracaoEpisodio}>
                                {episodio.duracao
                                  ? `${episodio.duracao} min`
                                  : ''}
                              </Text>
                            </View>
                          ))
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </>
          )}
        </View>

        {/* Direção */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Direção</Text>
          <Text style={styles.descricao}>
            {detalhes.diretor}
          </Text>
        </View>

        {/* Avaliações */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>
            Comentários e avaliações
          </Text>

          <Text style={styles.textoAuxiliar}>
            Compartilhe sua opinião sobre esta série.
          </Text>

          <View style={styles.formularioAvaliacao}>
            <Text style={styles.tituloFormulario}>
              Deixe sua avaliação
            </Text>

            <Text style={styles.rotuloNota}>Sua nota</Text>

            <View style={styles.estrelas}>
              {[1, 2, 3, 4, 5].map((nota) => (
                <Pressable
                  key={nota}
                  onPress={() => setNotaSelecionada(nota)}
                  style={styles.botaoEstrela}
                  accessibilityRole="button"
                  accessibilityLabel={`Dar ${nota} estrelas`}
                >
                  <Text
                    style={[
                      styles.estrela,
                      nota <= notaSelecionada &&
                        styles.estrelaSelecionada,
                    ]}
                  >
                    ★
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.rotuloComentario}>
              Seu comentário
            </Text>

            <TextInput
              style={styles.campoComentario}
              placeholder="Conte o que achou da série..."
              placeholderTextColor="#777777"
              value={comentario}
              onChangeText={setComentario}
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />

            <Text style={styles.contadorCaracteres}>
              {comentario.length}/1000 caracteres
            </Text>

            <Pressable
              style={[
                styles.botaoEnviar,
                publicando && { opacity: 0.6 },
              ]}
              onPress={publicarAvaliacao}
              disabled={publicando}
            >
              <Text style={styles.textoBotaoEnviar}>
                {publicando ? 'Publicando...' : 'Publicar avaliação'}
              </Text>
            </Pressable>
          </View>

          {/* Lista de avaliações reais */}
          <View style={styles.cabecalhoComentarios}>
            <Text style={styles.subtituloComentarios}>
              Todas as avaliações
            </Text>

            <Text style={styles.quantidadeComentarios}>
              {avaliacoes.length}
            </Text>
          </View>

          {carregando ? (
            <Text style={styles.textoAuxiliar}>
              Carregando avaliações...
            </Text>
          ) : avaliacoes.length === 0 ? (
            <View style={styles.semAvaliacoes}>
              <Text style={styles.iconeSemAvaliacoes}>☆</Text>

              <Text style={styles.tituloSemAvaliacoes}>
                Nenhuma avaliação ainda
              </Text>

              <Text style={styles.textoSemAvaliacoes}>
                Seja o primeiro a compartilhar sua opinião!
              </Text>
            </View>
          ) : (
            avaliacoes.map((avaliacao) => {
              const nomeUsuario =
                avaliacao.usuarioNome || 'Usuário';

              return (
                <View
                  key={avaliacao.id}
                  style={styles.cardAvaliacao}
                >
                  <View style={styles.cabecalhoAvaliacao}>
                    <View style={styles.avatar}>
                      <Text style={styles.letraAvatar}>
                        {nomeUsuario.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.infoUsuario}>
                      <Text style={styles.nomeUsuario}>
                        {nomeUsuario}
                      </Text>

                      <Text style={styles.dataAvaliacao}>
                        {avaliacao.serieTitulo || serie.titulo}
                      </Text>
                    </View>

                    <View style={styles.notaUsuario}>
                      <Text style={styles.notaUsuarioTexto}>
                        ★ {avaliacao.nota}/5
                      </Text>
                    </View>
                  </View>

                  <View style={styles.estrelasComentario}>
                    {[1, 2, 3, 4, 5].map((estrela) => (
                      <Text
                        key={estrela}
                        style={[
                          styles.estrelaPequena,
                          estrela <= avaliacao.nota &&
                            styles.estrelaPequenaSelecionada,
                        ]}
                      >
                        ★
                      </Text>
                    ))}
                  </View>

                  <Text style={styles.textoComentarioPublicado}>
                    {avaliacao.comentario}
                  </Text>
                </View>
              );
            })
          )}

          <Text style={styles.aviso}>
            As avaliações são carregadas e salvas na API.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};



export default DetalhesSerieScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  conteudo: {
    paddingBottom: 35,
  },
  botaoVoltar: {
    alignSelf: 'flex-start',
    marginTop: 48,
    marginBottom: 20,
    marginHorizontal: 22,
    paddingVertical: 8,
  },
  textoVoltar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cabecalho: {
    flexDirection: 'row',
    paddingHorizontal: 22,
    gap: 16,
  },
  capa: {
    width: 135,
    height: 205,
    borderRadius: 12,
    backgroundColor: '#202020',
  },
  capaVazia: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  textoCapaVazia: {
    color: '#777777',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
  },
  informacoesPrincipais: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
  },
  generoPrincipal: {
    color: '#AAAAAA',
    fontSize: 13,
  },
  dadoPrincipal: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  erro: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    margin: 25,
  },

  // Botão de favoritar
  areaFavorito: {
    paddingHorizontal: 22,
    marginTop: 18,
  },
  botaoFavorito: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    gap: 8,
  },
  botaoFavoritoAtivo: {
    borderColor: '#E50914',
    backgroundColor: '#211012',
  },
  textoBotaoFavorito: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  secao: {
    marginTop: 28,
    paddingHorizontal: 22,
  },
  tituloSecao: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  descricao: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 22,
  },
  listaGeneros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  generoTag: {
    backgroundColor: '#202020',
    borderColor: '#383838',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  textoGeneroTag: {
    color: '#E50914',
    fontSize: 12,
    fontWeight: '600',
  },
  itemInformacao: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 9,
  },
  textoAuxiliar: {
    color: '#999999',
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 19,
  },

  // Temporadas e episódios
  cardTemporada: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cabecalhoTemporada: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  numeroTemporada: {
    width: 42,
    height: 42,
    backgroundColor: '#E50914',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroTemporadaTexto: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  infoTemporada: {
    flex: 1,
    gap: 5,
  },
  nomeTemporada: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  quantidadeEpisodiosTexto: {
    color: '#999999',
    fontSize: 12,
  },
  setaTemporada: {
    color: '#E50914',
    fontSize: 28,
    fontWeight: '600',
    paddingHorizontal: 5,
  },
  listaEpisodios: {
    borderTopWidth: 1,
    borderTopColor: '#303030',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  cardEpisodio: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  numeroEpisodio: {
    width: 37,
    height: 40,
    backgroundColor: '#252525',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroEpisodioTexto: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: '900',
  },
  infoEpisodio: {
    flex: 1,
    gap: 5,
  },
  tituloEpisodio: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  detalheEpisodio: {
    color: '#888888',
    fontSize: 11,
  },
  duracaoEpisodio: {
    color: '#BBBBBB',
    fontSize: 11,
  },

  // Formulário de avaliação
  formularioAvaliacao: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 14,
    padding: 16,
    marginBottom: 25,
  },
  tituloFormulario: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 18,
  },
  rotuloNota: {
    color: '#CCCCCC',
    fontSize: 13,
    fontWeight: '600',
  },
  estrelas: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 7,
    marginBottom: 20,
  },
  botaoEstrela: {
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  estrela: {
    color: '#555555',
    fontSize: 35,
  },
  estrelaSelecionada: {
    color: '#FFD166',
  },
  rotuloComentario: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  campoComentario: {
    minHeight: 110,
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#383838',
    borderRadius: 10,
    color: '#FFFFFF',
    padding: 13,
    fontSize: 14,
    lineHeight: 20,
  },
  contadorCaracteres: {
    color: '#777777',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 7,
    marginBottom: 16,
  },
  botaoEnviar: {
    backgroundColor: '#E50914',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  textoBotaoEnviar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  // Lista de comentários
  cabecalhoComentarios: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  subtituloComentarios: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  quantidadeComentarios: {
    color: '#FFFFFF',
    backgroundColor: '#292929',
    overflow: 'hidden',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  cardAvaliacao: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#292929',
    borderRadius: 13,
    padding: 15,
    marginBottom: 12,
  },
  cabecalhoAvaliacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  avatar: {
    width: 44,
    height: 44,
    backgroundColor: '#292929',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letraAvatar: {
    color: '#E50914',
    fontSize: 19,
    fontWeight: '900',
  },
  infoUsuario: {
    flex: 1,
    gap: 4,
  },
  nomeUsuario: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  dataAvaliacao: {
    color: '#888888',
    fontSize: 11,
  },
  notaUsuario: {
    backgroundColor: '#252117',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  notaUsuarioTexto: {
    color: '#FFD166',
    fontSize: 12,
    fontWeight: '800',
  },
  estrelasComentario: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 14,
    marginBottom: 10,
  },
  estrelaPequena: {
    color: '#444444',
    fontSize: 16,
  },
  estrelaPequenaSelecionada: {
    color: '#FFD166',
  },
  textoComentarioPublicado: {
    color: '#DDDDDD',
    fontSize: 13,
    lineHeight: 21,
  },
  avisoExemplo: {
    color: '#777777',
    fontSize: 10,
    marginTop: 12,
    fontStyle: 'italic',
  },
  semAvaliacoes: {
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 24,
  },
  iconeSemAvaliacoes: {
    color: '#E50914',
    fontSize: 40,
    marginBottom: 8,
  },
  tituloSemAvaliacoes: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  textoSemAvaliacoes: {
    color: '#999999',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  aviso: {
    color: '#777777',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 17,
  },
});
