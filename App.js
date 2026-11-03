
import { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import { FavoritosProvider } from './src/context/FavoritosContext';
import { MinhasSeriesProvider } from './src/context/MinhasSeriesContext';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HomeScreen from './src/screens/HomeScreen';
import DetalhesSerieScreen from './src/screens/DetalhesSerieScreen';
import FavoritosScreen from './src/screens/FavoritosScreen';
import CadastrarSerieScreen from './src/screens/CadastrarSerieScreen';
import MinhasSeriesScreen from './src/screens/MinhasSeriesScreen';
import PerfilScreen from './src/screens/PerfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function InicioScreen({ navigation, usuario }) {
  return (
    <HomeScreen
      onAbrirSerie={(serie) =>
        navigation.getParent()?.navigate('DetalhesSerie', {
          serie,
          usuario,
        })
      }
    />
  );
}

function MenuPrincipal({ usuario, onSair }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: '#292929',
          height: 68,
          paddingBottom: 7,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#E50914',
        tabBarInactiveTintColor: '#AAAAAA',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-variant-outline"
              size={size}
              color={color}
            />
          ),
        }}
      >
        {(props) => (
          <InicioScreen
            {...props}
            usuario={usuario}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Favoritos"
        component={FavoritosScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="heart-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="CadastrarSerie"
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <View style={styles.botaoMais}>
              <MaterialCommunityIcons
                name="plus"
                size={30}
                color="#FFFFFF"
              />
            </View>
          ),
        }}
      >
        {(props) => (
          <CadastrarSerieScreen
            {...props}
            usuario={usuario}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="MinhasSeries"
        options={{
          tabBarLabel: 'Minhas séries',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="movie-open-outline"
              size={size}
              color={color}
            />
          ),
        }}
      >
        {(props) => (
          <MinhasSeriesScreen
            {...props}
            usuario={usuario}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Perfil"
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              size={size}
              color={color}
            />
          ),
        }}
      >
        {(props) => (
          <PerfilScreen
            {...props}
            usuario={usuario}
            onSair={onSair}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  return (
    <FavoritosProvider>
      <MinhasSeriesProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: '#080808',
              },
            }}
          >
            <Stack.Screen name="Splash">
              {({ navigation }) => (
                <SplashScreen
                  onFinish={() => navigation.replace('Login')}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Login">
              {({ navigation }) => (
                <LoginScreen
                  onIrCadastro={() => navigation.navigate('Cadastro')}
                  onLoginSucesso={(usuario) => {
                    setUsuarioLogado(usuario);
                    navigation.replace('Principal');
                  }}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Cadastro">
              {({ navigation }) => (
                <CadastroScreen
                  onVoltarLogin={() => navigation.navigate('Login')}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Principal">
              {({ navigation }) => (
                <MenuPrincipal
                  usuario={usuarioLogado}
                  onSair={() => {
                    setUsuarioLogado(null);

                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    });
                  }}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="DetalhesSerie"
              component={DetalhesSerieScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MinhasSeriesProvider>
    </FavoritosProvider>
  );
}

const styles = StyleSheet.create({
  botaoMais: {
    width: 43,
    height: 43,
    backgroundColor: '#E50914',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -17,
  },
});
