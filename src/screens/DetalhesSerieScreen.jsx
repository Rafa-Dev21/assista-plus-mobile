import { useState } from 'react';
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

import { useFavoritos } from '../context/FavoritosContext';

const DetalhesSerieScreen = ({ route, navigation }) => {
  const serie = route?.params?.serie;

  const { alternarFavorito, ehFavorito } = useFavoritos();
  const favorita = serie ? ehFavorito(serie.id) : false;

  const [temporadaAberta, setTemporadaAberta] = useState(1);
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [comentario, setComentario] = useState('');

  const [avaliacoes, setAvaliacoes] = useState([
    {
      id: '1',
      usuario: 'Lucas Oliveira',
      nota: 5,
      comentario:
        'Uma das melhores séries que já assisti! A história prende do começo ao fim e os personagens são incríveis.',
      data: 'Há 2 dias',
      exemplo: true,
    },
    {
      id: '2',
      usuario: 'Mariana Santos',
      nota: 4,
      comentario:
        'A primeira temporada é muito boa. O clima de mistério é o que mais gostei!',
      data: 'Há 5 dias',
      exemplo: true,
    },
  ]);

  const detalhes = {
    sinopse:
      'Uma cidade pequena enfrenta acontecimentos misteriosos que mudam a vida de seus moradores.',
    atores: ['Millie Bobby Brown', 'Finn Wolfhard', 'David Harbour'],
    diretor: 'Irmãos Duffer',
    generos: [serie?.genero ?? 'Drama'],
  };

  const temporadas = [
    {
      id: 1,
      numero: 1,
      episodios: [
        {
          numero: 1,
          titulo: 'Capítulo Um: O Desaparecimento de Will Byers',
          duracao: 48,
          temporadaId: 1,
        },
        {
          numero: 2,
          titulo: 'Capítulo Dois: A Estranha da Rua Maple',
          duracao: 55,
          temporadaId: 1,
        },
        {
          numero: 3,
          titulo: 'Capítulo Três: Caramba',
          duracao: 51,
          temporadaId: 1,
        },
      ],
    },
    {
      id: 2,
      numero: 2,
      episodios: [
        {
          numero: 1,
          titulo: 'Capítulo Um: MADMAX',
          duracao: 48,
          temporadaId: 2,
        },
        {
          numero: 2,
          titulo: 'Capítulo Dois: Doces ou Travessuras',
          duracao: 56,
          temporadaId: 2,
        },
      ],
    },
  ];

  const publicarAvaliacao = () => {
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
        'Digite sua opinião antes de publicar a avaliação.'
      );
      return;
    }

    const novaAvaliacao = {
      id: `${Date.now()}`,
      usuario: 'Você',
      nota: notaSelecionada,
      comentario: textoComentario,
      data: 'Agora mesmo',
      exemplo: false,
    };

    setAvaliacoes((listaAtual) => [
      novaAvaliacao,
      ...listaAtual,
    ]);

    setNotaSelecionada(0);
    setComentario('');

    Alert.alert(
      'Avaliação publicada!',
      'Seu comentário foi adicionado à lista nesta sessão.'
    );
  };

  const quantidadeEpisodios = temporadas.reduce(
    (total, temporada) => total + temporada.episodios.length,
    0
  );

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
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoVoltar}>‹  Voltar</Text>
        </Pressable>

        {/* Informações principais da série */}
        <View style={styles.cabecalho}>
          <Image
            source={
              serie?.imagem
                ? { uri: serie.imagem }
                : undefined
            }
            style={styles.capa}
            resizeMode="cover"
          />

          <View style={styles.informacoesPrincipais}>
            <Text style={styles.titulo}>
              {serie?.nome ?? 'Detalhes da série'}
            </Text>

            <Text style={styles.generoPrincipal}>
              {serie?.genero ?? 'Gênero não informado'}
            </Text>

            <Text style={styles.notaMedia}>
              ★ {serie?.nota ?? '—'}
              <Text style={styles.notaLegenda}> / 10</Text>
            </Text>

            <Text style={styles.dadoPrincipal}>
              {temporadas.length} temporadas
            </Text>

            <Text style={styles.dadoPrincipal}>
              {quantidadeEpisodios} episódios
            </Text>
          </View>
        </View>

        {/* Botão de favoritar */}
        <View style={styles.areaFavorito}>
          <Pressable
            style={[
              styles.botaoFavorito,
              favorita && styles.botaoFavoritoAtivo,
            ]}
            onPress={handleFavorito}
            accessibilityRole="button"
            accessibilityLabel={
              favorita
                ? 'Remover série dos favoritos'
                : 'Adicionar série aos favoritos'
            }
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
          <Text style={styles.descricao}>{detalhes.sinopse}</Text>
        </View>

        {/* Gêneros */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Gêneros</Text>

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
        </View>

        {/* Temporadas e episódios */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>
            Temporadas e episódios
          </Text>

          <Text style={styles.textoAuxiliar}>
            Selecione uma temporada para ver seus episódios.
          </Text>

          {temporadas.map((temporada) => {
            const aberta = temporadaAberta === temporada.id;

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
                    {temporada.episodios.map((episodio) => (
                      <View
                        key={`${temporada.id}-${episodio.numero}`}
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
                          {episodio.duracao} min
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Elenco */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Elenco</Text>

          {detalhes.atores.map((ator) => (
            <Text key={ator} style={styles.itemInformacao}>
              • {ator}
            </Text>
          ))}
        </View>

        {/* Direção */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Direção</Text>
          <Text style={styles.descricao}>{detalhes.diretor}</Text>
        </View>

        {/* Avaliações e comentários */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>
            Comentários e avaliações
          </Text>

          <Text style={styles.textoAuxiliar}>
            Veja as opiniões e compartilhe a sua.
          </Text>

          {/* Formulário de avaliação */}
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
              style={styles.botaoEnviar}
              onPress={publicarAvaliacao}
            >
              <Text style={styles.textoBotaoEnviar}>
                Publicar avaliação
              </Text>
            </Pressable>
          </View>

          {/* Lista de comentários */}
          <View style={styles.cabecalhoComentarios}>
            <Text style={styles.subtituloComentarios}>
              Todas as avaliações
            </Text>

            <Text style={styles.quantidadeComentarios}>
              {avaliacoes.length}
            </Text>
          </View>

          {avaliacoes.length === 0 ? (
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
            avaliacoes.map((avaliacao) => (
              <View
                key={avaliacao.id}
                style={styles.cardAvaliacao}
              >
                <View style={styles.cabecalhoAvaliacao}>
                  <View style={styles.avatar}>
                    <Text style={styles.letraAvatar}>
                      {avaliacao.usuario.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.infoUsuario}>
                    <Text style={styles.nomeUsuario}>
                      {avaliacao.usuario}
                    </Text>

                    <Text style={styles.dataAvaliacao}>
                      {avaliacao.data}
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

                {avaliacao.exemplo && (
                  <Text style={styles.avisoExemplo}>
                    Comentário de demonstração
                  </Text>
                )}
              </View>
            ))
          )}

          <Text style={styles.aviso}>
            As avaliações são temporárias e não são salvas na API.
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
  notaMedia: {
    color: '#FFD166',
    fontSize: 17,
    fontWeight: '800',
  },
  notaLegenda: {
    color: '#AAAAAA',
    fontSize: 12,
    fontWeight: '400',
  },
  dadoPrincipal: {
    color: '#FFFFFF',
    fontSize: 13,
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
