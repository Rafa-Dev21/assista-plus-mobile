
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiGet, apiPost } from '../services/api';

const STATUS = [
  { valor: 'EM_EXIBICAO', texto: 'Em exibição' },
  { valor: 'FINALIZADA', texto: 'Finalizada' },
  { valor: 'CANCELADA', texto: 'Cancelada' },
];

const ETAPAS = [
  { titulo: 'Diretor', icone: 'account-tie-outline' },
  { titulo: 'Gêneros', icone: 'tag-multiple-outline' },
  { titulo: 'Série', icone: 'movie-open-outline' },
  { titulo: 'Detalhes', icone: 'information-outline' },
  { titulo: 'Temporadas', icone: 'layers-outline' },
];

function extrairLista(dados) {
  if (Array.isArray(dados)) return dados;

  if (dados?._embedded && typeof dados._embedded === 'object') {
    return Object.values(dados._embedded).find(Array.isArray) || [];
  }

  return [];
}

function Campo({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeholder}
        placeholderTextColor="#777777"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        textAlignVertical={multiline ? 'top' : 'center'}
        selectionColor="#E50914"
      />
    </View>
  );
}

export default function CadastrarSerieScreen() {
  const [etapa, setEtapa] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [carregandoGeneros, setCarregandoGeneros] = useState(false);

  const [nomeDiretor, setNomeDiretor] = useState('');
  const [nacionalidadeDiretor, setNacionalidadeDiretor] = useState('');
  const [diretorId, setDiretorId] = useState(null);

  const [generos, setGeneros] = useState([]);
  const [generosSelecionados, setGenerosSelecionados] = useState([]);
  const [novoGenero, setNovoGenero] = useState('');

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [anoLancamento, setAnoLancamento] = useState('');
  const [status, setStatus] = useState('EM_EXIBICAO');
  const [imagemUrl, setImagemUrl] = useState('');

  const [serieId, setSerieId] = useState(null);
  const [serieCriada, setSerieCriada] = useState(false);

  const [idiomaOriginal, setIdiomaOriginal] = useState('');
  const [paisOrigem, setPaisOrigem] = useState('');
  const [classificacaoIndicativa, setClassificacaoIndicativa] = useState('');

  const [quantidadeTemporadas, setQuantidadeTemporadas] = useState('1');
  const [temporadaAtual, setTemporadaAtual] = useState(1);
  const [temporadaId, setTemporadaId] = useState(null);
  const [temporadaCriada, setTemporadaCriada] = useState(false);

  const [numeroEpisodio, setNumeroEpisodio] = useState('1');
  const [tituloEpisodio, setTituloEpisodio] = useState('');
  const [duracaoEpisodio, setDuracaoEpisodio] = useState('45');
  const [episodiosDaTemporada, setEpisodiosDaTemporada] = useState(0);
  const [totalEpisodios, setTotalEpisodios] = useState(0);
  const [totalTemporadas, setTotalTemporadas] = useState(0);

  useEffect(() => {
    carregarGeneros();
  }, []);

  async function carregarGeneros() {
    setCarregandoGeneros(true);

    try {
      const dados = await apiGet('/generos?page=0&size=50');
      setGeneros(extrairLista(dados));
    } catch {
      Alert.alert('Ops!', 'Não foi possível carregar os gêneros.');
    } finally {
      setCarregandoGeneros(false);
    }
  }

  function alternarGenero(genero) {
    setGenerosSelecionados((atuais) =>
      atuais.some((item) => item.id === genero.id)
        ? atuais.filter((item) => item.id !== genero.id)
        : [...atuais, genero]
    );
  }

  async function cadastrarGenero() {
    const nome = novoGenero.trim();

    if (!nome) {
      Alert.alert('Atenção', 'Digite o nome do gênero.');
      return;
    }

    const existente = generos.find(
      (item) => item.nome?.toLowerCase() === nome.toLowerCase()
    );

    if (existente) {
      setGenerosSelecionados((atuais) =>
        atuais.some((item) => item.id === existente.id)
          ? atuais
          : [...atuais, existente]
      );
      setNovoGenero('');
      return;
    }

    setCarregando(true);

    try {
      const criado = await apiPost('/generos', { nome });

      if (criado?.id == null) {
        throw new Error('Não foi possível cadastrar o gênero.');
      }

      setGeneros((atuais) => [...atuais, criado]);
      setGenerosSelecionados((atuais) => [...atuais, criado]);
      setNovoGenero('');

      Alert.alert('Pronto!', 'Gênero adicionado.');
    } catch {
      Alert.alert('Ops!', 'Não foi possível cadastrar esse gênero.');
    } finally {
      setCarregando(false);
    }
  }

  async function continuarDiretor() {
    if (!nomeDiretor.trim() || !nacionalidadeDiretor.trim()) {
      Alert.alert(
        'Faltou preencher!',
        'Informe o nome e a nacionalidade do diretor.'
      );
      return;
    }

    setCarregando(true);

    try {
      const criado = await apiPost('/diretores', {
        nome: nomeDiretor.trim(),
        nacionalidade: nacionalidadeDiretor.trim(),
      });

      if (criado?.id == null) {
        throw new Error('Não foi possível cadastrar o diretor.');
      }

      setDiretorId(criado.id);
      setEtapa(1);
    } catch {
      Alert.alert(
        'Ops!',
        'Não foi possível cadastrar o diretor. Confira os dados e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  async function continuarSerie() {
    if (!titulo.trim() || !descricao.trim() || !anoLancamento.trim()) {
      Alert.alert(
        'Faltou preencher!',
        'Informe o título, a descrição e o ano de lançamento.'
      );
      return;
    }

    if (descricao.trim().length < 10) {
      Alert.alert(
        'Descrição muito curta',
        'Escreva pelo menos 10 caracteres.'
      );
      return;
    }

    const ano = Number(anoLancamento);

    if (!Number.isInteger(ano) || ano < 1900 || ano > 2100) {
      Alert.alert('Ano inválido', 'Informe um ano entre 1900 e 2100.');
      return;
    }

    if (!diretorId) {
      Alert.alert('Ops!', 'Volte à etapa do diretor e tente novamente.');
      return;
    }

    setCarregando(true);

    try {
      const criada = await apiPost('/series', {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        anoLancamento: ano,
        imagemUrl: imagemUrl.trim() || null,
        status,
        diretorId,
        generosIds: generosSelecionados.map((genero) => genero.id),
      });

      if (criada?.id == null) {
        throw new Error(
          'A série pode ter sido salva, mas não foi possível confirmar o cadastro. Verifique a lista de séries antes de tentar novamente.'
        );
      }

      setSerieId(criada.id);
      setSerieCriada(true);
      setEtapa(3);
    } catch (erro) {
      Alert.alert(
        'Não foi possível cadastrar',
        erro.message || 'Confira os dados e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  async function cadastrarDetalhes() {
    if (
      !idiomaOriginal.trim() ||
      !paisOrigem.trim() ||
      !classificacaoIndicativa.trim()
    ) {
      Alert.alert(
        'Faltou preencher!',
        'Informe o idioma original, o país de origem e a classificação indicativa.'
      );
      return;
    }

    if (!serieId) {
      Alert.alert('Ops!', 'Não foi possível localizar a série cadastrada.');
      return;
    }

    const classificacao = Number(classificacaoIndicativa);

    if (!Number.isInteger(classificacao) || classificacao < 0) {
      Alert.alert(
        'Classificação inválida',
        'Informe a idade mínima em números, como 10, 12, 14, 16 ou 18.'
      );
      return;
    }

    setCarregando(true);

    try {
      await apiPost('/serie-detalhes', {
        idiomaOriginal: idiomaOriginal.trim(),
        paisOrigem: paisOrigem.trim(),
        classificacaoIndicativa: classificacao,
        serieId,
      });

      setEtapa(4);
    } catch {
      Alert.alert(
        'Não foi possível salvar',
        'Confira os detalhes técnicos e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  async function cadastrarTemporada() {
    if (!serieId) {
      Alert.alert('Ops!', 'Não foi possível localizar a série.');
      return;
    }

    if (temporadaCriada) return;

    setCarregando(true);

    try {
      const criada = await apiPost('/temporadas', {
        numero: temporadaAtual,
        serieId,
      });

      if (criada?.id == null) {
        throw new Error('Não foi possível confirmar a temporada.');
      }

      setTemporadaId(criada.id);
      setTemporadaCriada(true);
      setTotalTemporadas((total) => total + 1);
      setEpisodiosDaTemporada(0);
      setNumeroEpisodio('1');

      Alert.alert(
        'Temporada criada!',
        `Temporada ${temporadaAtual} cadastrada. Agora adicione os episódios.`
      );
    } catch {
      Alert.alert(
        'Não foi possível cadastrar',
        'Não foi possível salvar a temporada. Tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  async function cadastrarEpisodio() {
    if (!temporadaId) {
      Alert.alert('Atenção', 'Cadastre a temporada primeiro.');
      return;
    }

    if (!tituloEpisodio.trim()) {
      Alert.alert('Faltou preencher!', 'Informe o título do episódio.');
      return;
    }

    if (tituloEpisodio.trim().length < 2) {
      Alert.alert(
        'Título inválido',
        'O título precisa ter pelo menos 2 caracteres.'
      );
      return;
    }

    const numero = Number(numeroEpisodio);
    const duracao = Number(duracaoEpisodio);

    if (!Number.isInteger(numero) || numero < 1) {
      Alert.alert('Número inválido', 'Informe um número de episódio válido.');
      return;
    }

    if (!Number.isInteger(duracao) || duracao < 1) {
      Alert.alert(
        'Duração inválida',
        'Informe a duração do episódio em minutos.'
      );
      return;
    }

    setCarregando(true);

    try {
      await apiPost('/episodios', {
        numero,
        titulo: tituloEpisodio.trim(),
        duracao,
        temporadaId,
      });

      setTotalEpisodios((total) => total + 1);
      setEpisodiosDaTemporada((total) => total + 1);
      setNumeroEpisodio(String(numero + 1));
      setTituloEpisodio('');

      Alert.alert('Episódio cadastrado!', 'Pode adicionar o próximo episódio.');
    } catch {
      Alert.alert(
        'Não foi possível cadastrar',
        'Confira os dados do episódio e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  function concluirTemporada() {
    if (!temporadaCriada) {
      Alert.alert(
        'Cadastre a temporada',
        'Primeiro, crie a temporada para adicionar episódios.'
      );
      return;
    }

    if (episodiosDaTemporada === 0) {
      Alert.alert(
        'Adicione um episódio',
        'Cadastre pelo menos um episódio antes de continuar.'
      );
      return;
    }

    const quantidade = Number(quantidadeTemporadas);

    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 100) {
      Alert.alert(
        'Quantidade inválida',
        'Informe uma quantidade de temporadas entre 1 e 100.'
      );
      return;
    }

    if (temporadaAtual < quantidade) {
      Alert.alert(
        `Temporada ${temporadaAtual} concluída!`,
        'Deseja cadastrar a próxima temporada?',
        [
          { text: 'Continuar depois', style: 'cancel' },
          {
            text: 'Próxima temporada',
            onPress: () => {
              setTemporadaAtual((numero) => numero + 1);
              setTemporadaId(null);
              setTemporadaCriada(false);
              setEpisodiosDaTemporada(0);
              setNumeroEpisodio('1');
              setTituloEpisodio('');
            },
          },
        ]
      );
    } else {
      finalizarCadastro();
    }
  }

  function finalizarCadastro() {
    Alert.alert(
      'Cadastro concluído!',
      `${titulo} foi cadastrada com ${totalTemporadas} temporada(s) e ${totalEpisodios} episódio(s).`,
      [
        {
          text: 'Concluir',
          onPress: limparFormulario,
        },
      ]
    );
  }

  function limparFormulario() {
    setEtapa(0);

    setNomeDiretor('');
    setNacionalidadeDiretor('');
    setDiretorId(null);

    setGenerosSelecionados([]);
    setNovoGenero('');

    setTitulo('');
    setDescricao('');
    setAnoLancamento('');
    setStatus('EM_EXIBICAO');
    setImagemUrl('');

    setSerieId(null);
    setSerieCriada(false);

    setIdiomaOriginal('');
    setPaisOrigem('');
    setClassificacaoIndicativa('');

    setQuantidadeTemporadas('1');
    setTemporadaAtual(1);
    setTemporadaId(null);
    setTemporadaCriada(false);

    setNumeroEpisodio('1');
    setTituloEpisodio('');
    setDuracaoEpisodio('45');
    setEpisodiosDaTemporada(0);
    setTotalEpisodios(0);
    setTotalTemporadas(0);

    carregarGeneros();
  }

  function voltar() {
    if (carregando) return;

    if (etapa === 4 && temporadaCriada) {
      Alert.alert(
        'Temporada em andamento',
        'A temporada já foi criada. Para evitar duplicações, continue adicionando os episódios ou finalize a etapa.'
      );
      return;
    }

    if (etapa === 3 && serieCriada) {
      Alert.alert(
        'Série já cadastrada',
        'A série já foi salva. Continue com os detalhes técnicos para terminar o cadastro.',
        [{ text: 'Entendi' }]
      );
      return;
    }

    if (etapa > 0) setEtapa(etapa - 1);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />

      <View style={styles.header}>
        <Text style={styles.logo}>
          ASSISTA<Text style={styles.plus}>+</Text>
        </Text>
        <Text style={styles.slogan}>SEU MUNDO DAS SÉRIES</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.tituloPagina}>Cadastrar série</Text>
        <Text style={styles.subtitulo}>
          Vamos adicionar uma nova série à sua coleção.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressoContainer}
        >
          {ETAPAS.map((item, index) => {
            const ativa = index === etapa;
            const concluida = index < etapa;

            return (
              <View key={item.titulo} style={styles.itemProgresso}>
                <View
                  style={[
                    styles.circuloEtapa,
                    (ativa || concluida) && styles.circuloAtivo,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={concluida ? 'check' : item.icone}
                    size={20}
                    color={ativa || concluida ? '#FFFFFF' : '#777777'}
                  />
                </View>

                <Text
                  style={[
                    styles.nomeEtapa,
                    ativa && styles.nomeEtapaAtiva,
                  ]}
                >
                  {item.titulo}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.barraFundo}>
          <View
            style={[
              styles.barraProgresso,
              { width: `${((etapa + 1) / ETAPAS.length) * 100}%` },
            ]}
          />
        </View>

        {etapa === 0 && (
          <View style={styles.secao}>
            <Text style={styles.numeroGrande}>01</Text>
            <Text style={styles.tituloSecao}>Quem é o diretor?</Text>
            <Text style={styles.textoAuxiliar}>
              Vamos começar com as informações do diretor.
            </Text>

            <Campo
              label="Nome do diretor *"
              placeholder="Ex.: Matt Duffer"
              value={nomeDiretor}
              onChangeText={setNomeDiretor}
            />

            <Campo
              label="Nacionalidade *"
              placeholder="Ex.: Americano"
              value={nacionalidadeDiretor}
              onChangeText={setNacionalidadeDiretor}
            />
          </View>
        )}

        {etapa === 1 && (
          <View style={styles.secao}>
            <Text style={styles.numeroGrande}>02</Text>
            <Text style={styles.tituloSecao}>Escolha os gêneros</Text>
            <Text style={styles.textoAuxiliar}>
              Selecione todos os gêneros que combinam com a série.
            </Text>

            {carregandoGeneros ? (
              <ActivityIndicator color="#E50914" size="large" />
            ) : generos.length === 0 ? (
              <View style={styles.vazio}>
                <Text style={styles.vazioTexto}>
                  Nenhum gênero disponível no momento.
                </Text>
                <Pressable
                  style={styles.botaoRecarregar}
                  onPress={carregarGeneros}
                >
                  <Text style={styles.textoBotaoSecundario}>
                    TENTAR NOVAMENTE
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.generosContainer}>
                {generos.map((genero) => {
                  const selecionado = generosSelecionados.some(
                    (item) => item.id === genero.id
                  );

                  return (
                    <Pressable
                      key={genero.id}
                      style={[
                        styles.genero,
                        selecionado && styles.generoSelecionado,
                      ]}
                      onPress={() => alternarGenero(genero)}
                    >
                      <Text
                        style={[
                          styles.textoGenero,
                          selecionado && styles.textoGeneroSelecionado,
                        ]}
                      >
                        {genero.nome}
                      </Text>

                      {selecionado && (
                        <MaterialCommunityIcons
                          name="check"
                          size={16}
                          color="#FFFFFF"
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}

            <Text style={[styles.label, { marginTop: 25 }]}>
              Adicionar outro gênero
            </Text>

            <View style={styles.linhaNovo}>
              <TextInput
                style={[styles.input, styles.inputNovo]}
                placeholder="Nome do gênero"
                placeholderTextColor="#777777"
                value={novoGenero}
                onChangeText={setNovoGenero}
                selectionColor="#E50914"
              />

              <Pressable
                style={styles.botaoAdicionar}
                onPress={cadastrarGenero}
                disabled={carregando}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={25}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Text style={styles.selecionados}>
              {generosSelecionados.length} gênero(s) selecionado(s)
            </Text>
          </View>
        )}

        {etapa === 2 && (
          <View style={styles.secao}>
            <Text style={styles.numeroGrande}>03</Text>
            <Text style={styles.tituloSecao}>Sobre a série</Text>

            <Campo
              label="Título da série *"
              placeholder="Ex.: Stranger Things"
              value={titulo}
              onChangeText={setTitulo}
            />

            <Campo
              label="Descrição *"
              placeholder="Conte um pouco sobre a história..."
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />

            <Campo
              label="Ano de lançamento *"
              placeholder="Ex.: 2016"
              value={anoLancamento}
              onChangeText={setAnoLancamento}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Status da série *</Text>

            <View style={styles.opcoes}>
              {STATUS.map((opcao) => (
                <Pressable
                  key={opcao.valor}
                  style={[
                    styles.opcao,
                    status === opcao.valor && styles.opcaoSelecionada,
                  ]}
                  onPress={() => setStatus(opcao.valor)}
                >
                  <Text
                    style={[
                      styles.textoOpcao,
                      status === opcao.valor && styles.textoOpcaoSelecionada,
                    ]}
                  >
                    {opcao.texto}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Campo
              label="Link do pôster (opcional)"
              placeholder="https://..."
              value={imagemUrl}
              onChangeText={setImagemUrl}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        )}

        {etapa === 3 && (
          <View style={styles.secao}>
            <Text style={styles.numeroGrande}>04</Text>
            <Text style={styles.tituloSecao}>Detalhes técnicos</Text>
            <Text style={styles.textoAuxiliar}>
              Mais algumas informações para completar a ficha da série.
            </Text>

            <Campo
              label="Idioma original *"
              placeholder="Ex.: Inglês"
              value={idiomaOriginal}
              onChangeText={setIdiomaOriginal}
            />

            <Campo
              label="País de origem *"
              placeholder="Ex.: Estados Unidos"
              value={paisOrigem}
              onChangeText={setPaisOrigem}
            />

            <Campo
              label="Classificação indicativa *"
              placeholder="Ex.: 16"
              value={classificacaoIndicativa}
              onChangeText={setClassificacaoIndicativa}
              keyboardType="numeric"
            />
          </View>
        )}

        {etapa === 4 && (
          <View style={styles.secao}>
            <Text style={styles.numeroGrande}>05</Text>
            <Text style={styles.tituloSecao}>Temporadas e episódios</Text>
            <Text style={styles.textoAuxiliar}>
              Organize as temporadas e adicione os episódios de cada uma.
            </Text>

            <Campo
              label="Quantas temporadas a série tem?"
              placeholder="Ex.: 4"
              value={quantidadeTemporadas}
              onChangeText={setQuantidadeTemporadas}
              keyboardType="numeric"
            />

            <View style={styles.cartaoTemporada}>
              <Text style={styles.cartaoTitulo}>
                Temporada {temporadaAtual}
              </Text>

              <Text style={styles.cartaoDescricao}>
                {temporadaCriada
                  ? `${episodiosDaTemporada} episódio(s) adicionado(s) nesta temporada.`
                  : 'Crie esta temporada para começar a adicionar episódios.'}
              </Text>

              {!temporadaCriada ? (
                <Pressable
                  style={styles.botaoPrincipal}
                  onPress={cadastrarTemporada}
                  disabled={carregando}
                >
                  {carregando ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="plus-circle-outline"
                        size={21}
                        color="#FFFFFF"
                      />
                      <Text style={styles.textoBotao}>
                        CRIAR TEMPORADA
                      </Text>
                    </>
                  )}
                </Pressable>
              ) : (
                <>
                  <Campo
                    label="Número do episódio"
                    placeholder="Ex.: 1"
                    value={numeroEpisodio}
                    onChangeText={setNumeroEpisodio}
                    keyboardType="numeric"
                  />

                  <Campo
                    label="Título do episódio"
                    placeholder="Ex.: O desaparecimento"
                    value={tituloEpisodio}
                    onChangeText={setTituloEpisodio}
                  />

                  <Campo
                    label="Duração em minutos"
                    placeholder="Ex.: 45"
                    value={duracaoEpisodio}
                    onChangeText={setDuracaoEpisodio}
                    keyboardType="numeric"
                  />

                  <Pressable
                    style={styles.botaoPrincipal}
                    onPress={cadastrarEpisodio}
                    disabled={carregando}
                  >
                    {carregando ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <MaterialCommunityIcons
                          name="plus-circle-outline"
                          size={21}
                          color="#FFFFFF"
                        />
                        <Text style={styles.textoBotao}>
                          ADICIONAR EPISÓDIO
                        </Text>
                      </>
                    )}
                  </Pressable>

                  <View style={styles.contador}>
                    <MaterialCommunityIcons
                      name="check-circle-outline"
                      size={20}
                      color="#4ADE80"
                    />
                    <Text style={styles.contadorTexto}>
                      {episodiosDaTemporada} episódio(s) cadastrado(s)
                    </Text>
                  </View>

                  <Pressable
                    style={styles.botaoSecundario}
                    onPress={concluirTemporada}
                    disabled={carregando}
                  >
                    <Text style={styles.textoBotao}>
                      {temporadaAtual <
                      Math.max(1, Number(quantidadeTemporadas))
                        ? 'CONCLUIR E IR PARA A PRÓXIMA'
                        : 'FINALIZAR CADASTRO'}
                    </Text>
                  </Pressable>
                </>
              )}
            </View>

            <Text style={styles.resumoEpisodios}>
              {totalTemporadas} temporada(s) concluída(s) nesta sessão ·{' '}
              {totalEpisodios} episódio(s) cadastrado(s)
            </Text>
          </View>
        )}

        <View style={styles.navegacao}>
          {etapa > 0 ? (
            <Pressable
              style={styles.botaoVoltar}
              onPress={voltar}
              disabled={carregando}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.textoBotao}>VOLTAR</Text>
            </Pressable>
          ) : (
            <View />
          )}

          {etapa < 4 && (
            <Pressable
              style={[
                styles.botaoContinuar,
                carregando && styles.botaoDesativado,
              ]}
              onPress={() => {
                if (etapa === 0) continuarDiretor();
                else if (etapa === 1) setEtapa(2);
                else if (etapa === 2) continuarSerie();
                else if (etapa === 3) cadastrarDetalhes();
              }}
              disabled={carregando || carregandoGeneros}
            >
              {carregando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.textoBotao}>CONTINUAR</Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color="#FFFFFF"
                  />
                </>
              )}
            </Pressable>
          )}
        </View>

        <Text style={styles.rodape}>ASSISTA+ • SEU UNIVERSO DE SÉRIES</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080808' },
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
  plus: { color: '#E50914' },
  slogan: {
    color: '#888888',
    fontSize: 10,
    letterSpacing: 3,
    marginTop: 5,
  },
  scroll: { flex: 1 },
  conteudo: { padding: 22, paddingBottom: 40 },
  tituloPagina: { color: '#FFFFFF', fontSize: 27, fontWeight: '800' },
  subtitulo: {
    color: '#999999',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 25,
  },
  progressoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
    paddingBottom: 13,
  },
  itemProgresso: { alignItems: 'center', minWidth: 52 },
  circuloEtapa: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#151515',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloAtivo: { backgroundColor: '#E50914', borderColor: '#E50914' },
  nomeEtapa: {
    color: '#777777',
    fontSize: 11,
    marginTop: 7,
    fontWeight: '600',
  },
  nomeEtapaAtiva: { color: '#FFFFFF' },
  barraFundo: {
    height: 4,
    backgroundColor: '#292929',
    borderRadius: 3,
    marginBottom: 32,
    overflow: 'hidden',
  },
  barraProgresso: {
    height: 4,
    backgroundColor: '#E50914',
    borderRadius: 3,
  },
  secao: { marginBottom: 20 },
  numeroGrande: {
    color: '#E50914',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tituloSecao: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    marginBottom: 10,
  },
  textoAuxiliar: {
    color: '#999999',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 22,
  },
  campo: { marginBottom: 19 },
  label: {
    color: '#CCCCCC',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 9,
  },
  input: {
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#FFFFFF',
    fontSize: 14,
    minHeight: 48,
  },
  inputMultiline: { minHeight: 110, paddingTop: 14 },
  vazio: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  vazioTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  botaoRecarregar: {
    borderWidth: 1,
    borderColor: '#E50914',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  textoBotaoSecundario: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  generosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  genero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  generoSelecionado: {
    backgroundColor: '#351013',
    borderColor: '#E50914',
  },
  textoGenero: { color: '#BBBBBB', fontSize: 12 },
  textoGeneroSelecionado: { color: '#FFFFFF', fontWeight: '700' },
  linhaNovo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inputNovo: { flex: 1 },
  botaoAdicionar: {
    width: 48,
    height: 48,
    backgroundColor: '#E50914',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selecionados: { color: '#999999', fontSize: 12, marginTop: 15 },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 20,
  },
  opcao: {
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 9,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  opcaoSelecionada: { backgroundColor: '#351013', borderColor: '#E50914' },
  textoOpcao: { color: '#AAAAAA', fontSize: 11, fontWeight: '600' },
  textoOpcaoSelecionada: { color: '#FFFFFF' },
  cartaoTemporada: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 14,
    padding: 16,
    marginTop: 5,
  },
  cartaoTitulo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  cartaoDescricao: {
    color: '#999999',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  botaoPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: '#E50914',
    borderRadius: 10,
    padding: 15,
    marginBottom: 18,
  },
  botaoSecundario: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#292929',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  },
  contador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  contadorTexto: { color: '#CCCCCC', fontSize: 13 },
  resumoEpisodios: {
    color: '#999999',
    fontSize: 12,
    lineHeight: 20,
    marginTop: 15,
  },
  navegacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  botaoVoltar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 11,
    paddingVertical: 15,
  },
  botaoContinuar: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#E50914',
    borderRadius: 11,
    paddingVertical: 15,
  },
  botaoDesativado: { opacity: 0.6 },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  rodape: {
    color: '#666666',
    fontSize: 10,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 30,
  },
});
