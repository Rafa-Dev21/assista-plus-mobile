
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const MinhasSeriesContext = createContext();

const CHAVE_MINHAS_SERIES = '@assista_plus:minhas_series';

export function MinhasSeriesProvider({ children }) {
  const [minhasSeries, setMinhasSeries] = useState([]);
  const [carregandoMinhasSeries, setCarregandoMinhasSeries] = useState(true);

  useEffect(() => {
    async function carregarMinhasSeries() {
      try {
        const dadosSalvos = await AsyncStorage.getItem(CHAVE_MINHAS_SERIES);

        if (dadosSalvos) {
          setMinhasSeries(JSON.parse(dadosSalvos));
        }
      } catch (erro) {
        console.error('Erro ao carregar minhas séries:', erro);
      } finally {
        setCarregandoMinhasSeries(false);
      }
    }

    carregarMinhasSeries();
  }, []);

  useEffect(() => {
    if (carregandoMinhasSeries) return;

    async function salvarMinhasSeries() {
      try {
        await AsyncStorage.setItem(
          CHAVE_MINHAS_SERIES,
          JSON.stringify(minhasSeries)
        );
      } catch (erro) {
        console.error('Erro ao salvar minhas séries:', erro);
      }
    }

    salvarMinhasSeries();
  }, [minhasSeries, carregandoMinhasSeries]);

  function adicionarMinhaSerie(serie) {
    setMinhasSeries((listaAtual) => {
      const jaExiste = listaAtual.some(
        (item) =>
          String(item.id) === String(serie.id) &&
          String(item.usuarioId) === String(serie.usuarioId)
      );

      if (jaExiste) return listaAtual;

      return [...listaAtual, serie];
    });
  }

  function removerMinhaSerie(id, usuarioId) {
    setMinhasSeries((listaAtual) =>
      listaAtual.filter(
        (serie) =>
          !(
            String(serie.id) === String(id) &&
            String(serie.usuarioId) === String(usuarioId)
          )
      )
    );
  }

  function obterMinhasSeries(usuarioId) {
    return minhasSeries.filter(
      (serie) => String(serie.usuarioId) === String(usuarioId)
    );
  }

  return (
    <MinhasSeriesContext.Provider
      value={{
        minhasSeries,
        carregandoMinhasSeries,
        adicionarMinhaSerie,
        removerMinhaSerie,
        obterMinhasSeries,
      }}
    >
      {children}
    </MinhasSeriesContext.Provider>
  );
}

export function useMinhasSeries() {
  const contexto = useContext(MinhasSeriesContext);

  if (!contexto) {
    throw new Error(
      'useMinhasSeries precisa ser usado dentro de MinhasSeriesProvider.'
    );
  }

  return contexto;
}
