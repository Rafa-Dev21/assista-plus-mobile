import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritosContext = createContext();

const CHAVE_FAVORITOS = '@assista_plus:favoritos';

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true);

  // Carrega os favoritos salvos no aparelho.
  useEffect(() => {
    async function carregarFavoritos() {
      try {
        const dadosSalvos = await AsyncStorage.getItem(CHAVE_FAVORITOS);

        if (dadosSalvos) {
          setFavoritos(JSON.parse(dadosSalvos));
        }
      } catch (erro) {
        console.error('Erro ao carregar favoritos:', erro);
      } finally {
        setCarregandoFavoritos(false);
      }
    }

    carregarFavoritos();
  }, []);

  // Salva a lista atual no armazenamento local.
  useEffect(() => {
    if (carregandoFavoritos) {
      return;
    }

    async function salvarFavoritos() {
      try {
        await AsyncStorage.setItem(
          CHAVE_FAVORITOS,
          JSON.stringify(favoritos)
        );
      } catch (erro) {
        console.error('Erro ao salvar favoritos:', erro);
      }
    }

    salvarFavoritos();
  }, [favoritos, carregandoFavoritos]);

  function alternarFavorito(serie) {
    setFavoritos((listaAtual) => {
      const jaFavoritada = listaAtual.some(
        (item) => String(item.id) === String(serie.id)
      );

      if (jaFavoritada) {
        return listaAtual.filter(
          (item) => String(item.id) !== String(serie.id)
        );
      }

      return [...listaAtual, serie];
    });
  }

  function ehFavorito(id) {
    return favoritos.some(
      (serie) => String(serie.id) === String(id)
    );
  }

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        carregandoFavoritos,
        alternarFavorito,
        ehFavorito,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const contexto = useContext(FavoritosContext);

  if (!contexto) {
    throw new Error(
      'useFavoritos precisa ser usado dentro de FavoritosProvider.'
    );
  }

  return contexto;
}
