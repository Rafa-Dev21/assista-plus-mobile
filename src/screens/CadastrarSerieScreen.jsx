import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STATUS = ['EM_EXIBICAO', 'FINALIZADA', 'CANCELADA'];
const GENEROS_INICIAIS = [
  'Ação',
  'Aventura',
  'Comédia',
  'Drama',
  'Fantasia',
  'Ficção científica',
  'Mistério',
  'Romance',
  'Terror',
  'Suspense',
];

const CLASSIFICACOES = ['L', '10', '12', '14', '16', '18'];

const Campo = ({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}) => (
  <View style={styles.campo}>
    <Text style={styles.label}>{label}</Text>

    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      placeholder={placeholder}
      placeholderTextColor="#707070"
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

const CadastrarSerieScreen = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [anoLancamento, setAnoLancamento] = useState('');
  const [status, setStatus] = useState('EM_EXIBICAO');
  const [imagemUrl, setImagemUrl] = useState('');

  const [nomeDiretor, setNomeDiretor] = useState('');
  const [nacionalidadeDiretor, setNacionalidadeDiretor] = useState('');

  const [atores, setAtores] = useState([
    { nome: '', nacionalidade: '' },
  ]);

  const [generosDisponiveis, setGenerosDisponiveis] =
    useState(GENEROS_INICIAIS);
  const [generosSelecionados, setGenerosSelecionados] = useState([]);
  const [novoGenero, setNovoGenero] = useState('');

  const [idiomaOriginal, setIdiomaOriginal] = useState('');
  const [paisOrigem, setPaisOrigem] = useState('');
  const [classificacao, setClassificacao] = useState('16');

  const alternarGenero = (genero) => {
    setGenerosSelecionados((atuais) =>
      atuais.includes(genero)
        ? atuais.filter((item) => item !== genero)
        : [...atuais, genero]
    );
  };

  const adicionarGenero = () => {
    const nome = novoGenero.trim();

    if (!nome) {
      Alert.alert('Atenção', 'Digite o nome do novo gênero.');
      return;
    }

    const existente = generosDisponiveis.find(
      (item) => item.toLowerCase() === nome.toLowerCase()
    );

    if (existente) {
      if (!generosSelecionados.includes(existente)) {
        alternarGenero(existente);
      }

      setNovoGenero('');
      return;
    }

    setGenerosDisponiveis((atuais) => [...atuais, nome]);
    setGenerosSelecionados((atuais) => [...atuais, nome]);
    setNovoGenero('');
  };

  const atualizarAtor = (index, campo, valor) => {
    setAtores((atuais) =>
      atuais.map((ator, i) =>
        i === index ? { ...ator, [campo]: valor } : ator
      )
    );
  };

  const adicionarAtor = () => {
    setAtores((atuais) => [
      ...atuais,
      { nome: '', nacionalidade: '' },
    ]);
  };

  const removerAtor = (index) => {
    setAtores((atuais) =>
      atuais.filter((_, i) => i !== index)
    );
  };

  const cadastrarSerie = () => {
    if (
      !titulo.trim() ||
      !descricao.trim() ||
      !anoLancamento.trim()
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha o título, a descrição e o ano de lançamento.'
      );
      return;
    }

    const atoresPreenchidos = atores.filter(
      (ator) => ator.nome.trim() !== ''
    );

    // Estrutura provisória para a futura integração com a API.
    const dadosFormulario = {
      serie: {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        anoLancamento: Number(anoLancamento),
        status,
        imagemUrl: imagemUrl.trim(),
      },
      diretor: {
        nome: nomeDiretor.trim(),
        nacionalidade: nacionalidadeDiretor.trim(),
      },
      atores: atoresPreenchidos.map((ator) => ({
        nome: ator.nome.trim(),
        nacionalidade: ator.nacionalidade.trim(),
      })),
      generos: generosSelecionados,
      detalhes: {
        idiomaOriginal: idiomaOriginal.trim(),
        paisOrigem: paisOrigem.trim(),
        classificacaoIndicativa:
          classificacao === 'L' ? 0 : Number(classificacao),
      },
    };

    console.log(
      'Dados preparados para a API:',
      JSON.stringify(dadosFormulario, null, 2)
    );

    Alert.alert(
      'Formulário validado!',
      'Os dados foram preparados. O envio para a API será implementado na próxima etapa.'
    );
  };

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
          Cadastre a série, o elenco e as informações técnicas.
        </Text>

        {/* 01 - Informações da série */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>
            <Text style={styles.numeroSecao}>01 </Text>
            INFORMAÇÕES DA SÉRIE
          </Text>

          <View style={styles.imagemContainer}>
            <MaterialCommunityIcons
              name="image-plus"
              size={38}
              color="#E50914"
            />
            <Text style={styles.imagemTitulo}>Pôster da série</Text>
            <Text style={styles.imagemDescricao}>
              Cole a URL da imagem no campo abaixo.
            </Text>
          </View>

          <Campo
            label="Título da série *"
            placeholder="Ex.: Stranger Things"
            value={titulo}
            onChangeText={setTitulo}
          />

          <Campo
            label="Descrição *"
            placeholder="Digite a sinopse da série..."
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
                key={opcao}
                style={[
                  styles.opcao,
                  status === opcao && styles.opcaoSelecionada,
                ]}
                onPress={() => setStatus(opcao)}
              >
                <Text
                  style={[
                    styles.textoOpcao,
                    status === opcao && styles.textoOpcaoSelecionada,
                  ]}
                >
                  {opcao.replace('_', ' ')}
                </Text>
              </Pressable>
            ))}
          </View>

          <Campo
            label="URL do pôster"
            placeholder="https://site.com/poster.jpg"
            value={imagemUrl}
            onChangeText={setImagemUrl}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        {/* 02 - Diretor */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>
            <Text style={styles.numeroSecao}>02 </Text>
            DIRETOR
          </Text>

          <Campo
            label="Nome do diretor"
            placeholder="Ex.: Matt Duffer"
            value={nomeDiretor}
            onChangeText={setNomeDiretor}
          />

          <Campo
            label="Nacionalidade"
            placeholder="Ex.: Americano"
            value={nacionalidadeDiretor}
            onChangeText={setNacionalidadeDiretor}
          />
        </View>

        {/* 03 - Atores */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>
            <Text style={styles.numeroSecao}>03 </Text>
            ELENCO DE ATORES
          </Text>

          {atores.map((ator, index) => (
            <View key={index} style={styles.cardAtor}>
              <View style={styles.linhaAtor}>
                <Text style={styles.tituloAtor}>
                  Ator {index + 1}
                </Text>

                {atores.length > 1 && (
                  <Pressable
                    onPress={() => removerAtor(index)}
                    hitSlop={8}
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={21}
                      color="#E50914"
                    />
                  </Pressable>
                )}
              </View>

              <Campo
                label="Nome do ator"
                placeholder="Ex.: Millie Bobby Brown"
                value={ator.nome}
                onChangeText={(valor) =>
                  atualizarAtor(index, 'nome', valor)
                }
              />

              <Campo
                label="Nacionalidade"
                placeholder="Ex.: Britânica"
                value={ator.nacionalidade}
                onChangeText={(valor) =>
                  atualizarAtor(index, 'nacionalidade', valor)
                }
              />
            </View>
          ))}

          <Pressable style={styles.botaoSecundario} onPress={adicionarAtor}>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color="#E50914"
            />
            <Text style={styles.textoBotaoSecundario}>
              ADICIONAR ATOR
            </Text>
          </Pressable>
        </View>

        {/* 04 - Gêneros */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>
            <Text style={styles.numeroSecao}>04 </Text>
            GÊNEROS DA SÉRIE
          </Text>

          <Text style={styles.textoAuxiliar}>
            Selecione todos os gêneros que combinam com a série.
          </Text>

          <View style={styles.generosContainer}>
            {generosDisponiveis.map((genero) => {
              const selecionado = generosSelecionados.includes(genero);

              return (
                <Pressable
                  key={genero}
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
                    {genero}
                  </Text>

                  {selecionado && (
                    <MaterialCommunityIcons
                      name="check"
                      size={15}
                      color="#FFFFFF"
                    />
                  )}
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.label, styles.labelNovo]}>
            Cadastrar outro gênero
          </Text>

          <View style={styles.linhaNovo}>
            <TextInput
              style={[styles.input, styles.inputNovo]}
              placeholder="Nome do novo gênero"
              placeholderTextColor="#707070"
              value={novoGenero}
              onChangeText={setNovoGenero}
              selectionColor="#E50914"
              returnKeyType="done"
              onSubmitEditing={adicionarGenero}
            />

            <Pressable
              style={styles.botaoAdicionar}
              onPress={adicionarGenero}
            >
              <MaterialCommunityIcons
                name="plus"
                size={25}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </View>

        {/* 05 - Detalhes técnicos */}
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>
            <Text style={styles.numeroSecao}>05 </Text>
            DETALHES TÉCNICOS
          </Text>

          <Campo
            label="Idioma original"
            placeholder="Ex.: Inglês"
            value={idiomaOriginal}
            onChangeText={setIdiomaOriginal}
          />

          <Campo
            label="País de origem"
            placeholder="Ex.: Estados Unidos"
            value={paisOrigem}
            onChangeText={setPaisOrigem}
          />

          <Text style={styles.label}>Classificação indicativa</Text>

          <View style={styles.opcoes}>
            {CLASSIFICACOES.map((idade) => (
              <Pressable
                key={idade}
                style={[
                  styles.classificacao,
                  classificacao === idade &&
                    styles.classificacaoSelecionada,
                ]}
                onPress={() => setClassificacao(idade)}
              >
                <Text
                  style={[
                    styles.textoClassificacao,
                    classificacao === idade &&
                      styles.textoClassificacaoSelecionada,
                  ]}
                >
                  {idade === 'L' ? 'Livre' : `${idade}+`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={styles.botaoCadastrar}
          onPress={cadastrarSerie}
        >
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={22}
            color="#FFFFFF"
          />
          <Text style={styles.textoBotao}>CADASTRAR SÉRIE</Text>
        </Pressable>

        <Text style={styles.rodape}>
          ASSISTA+ • SEU UNIVERSO DE SÉRIES
        </Text>
      </ScrollView>
    </View>
  );
};

export default CadastrarSerieScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
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
  scroll: {
    flex: 1,
  },
  conteudo: {
    padding: 22,
    paddingBottom: 40,
  },
  tituloPagina: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
  },
  subtitulo: {
    color: '#999999',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 28,
  },
  secao: {
    marginBottom: 30,
  },
  tituloSecao: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 20,
  },
  numeroSecao: {
    color: '#E50914',
  },
  imagemContainer: {
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#303030',
    borderStyle: 'dashed',
    borderRadius: 14,
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    padding: 18,
  },
  imagemTitulo: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },
  imagemDescricao: {
    color: '#888888',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  campo: {
    marginBottom: 19,
  },
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
  inputMultiline: {
    minHeight: 110,
    paddingTop: 14,
  },
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
  opcaoSelecionada: {
    backgroundColor: '#351013',
    borderColor: '#E50914',
  },
  textoOpcao: {
    color: '#AAAAAA',
    fontSize: 11,
    fontWeight: '600',
  },
  textoOpcaoSelecionada: {
    color: '#FFFFFF',
  },
  cardAtor: {
    backgroundColor: '#101010',
    borderWidth: 1,
    borderColor: '#292929',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  linhaAtor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  tituloAtor: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: '800',
  },
  botaoSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: '#E50914',
    borderRadius: 10,
    paddingVertical: 13,
  },
  textoBotaoSecundario: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  textoAuxiliar: {
    color: '#888888',
    fontSize: 12,
    lineHeight: 18,
    marginTop: -9,
    marginBottom: 16,
  },
  generosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
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
  textoGenero: {
    color: '#BBBBBB',
    fontSize: 12,
  },
  textoGeneroSelecionado: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  labelNovo: {
    marginTop: 22,
  },
  linhaNovo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputNovo: {
    flex: 1,
  },
  botaoAdicionar: {
    width: 48,
    height: 48,
    backgroundColor: '#E50914',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classificacao: {
    minWidth: 48,
    alignItems: 'center',
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 9,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  classificacaoSelecionada: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  textoClassificacao: {
    color: '#BBBBBB',
    fontWeight: '700',
    fontSize: 12,
  },
  textoClassificacaoSelecionada: {
    color: '#FFFFFF',
  },
  botaoCadastrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#E50914',
    borderRadius: 11,
    paddingVertical: 16,
    marginTop: 2,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  rodape: {
    color: '#666666',
    fontSize: 10,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 26,
  },
});
