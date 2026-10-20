import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import { FavoritosProvider } from './src/context/FavoritosContext';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HomeScreen from './src/screens/HomeScreen';
import DetalhesSerieScreen from './src/screens/DetalhesSerieScreen';
import FavoritosScreen from './src/screens/FavoritosScreen';
import CadastrarSerieScreen from './src/screens/CadastrarSerieScreen';
import PerfilScreen from './src/screens/PerfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TelaProvisoria({ route }) {
  const titulo = route.params?.titulo ?? 'Em breve';

  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitulo}>{titulo}</Text>

      <Text style={styles.placeholderTexto}>
        Esta tela será desenvolvida em breve.
      </Text>
    </View>
  );
}

function InicioScreen({ navigation }) {
  return (
    <HomeScreen
      onAbrirSerie={(serie) =>
        navigation.getParent()?.navigate('DetalhesSerie', { serie })
      }
    />
  );
}

function MenuPrincipal() {
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
        component={InicioScreen}
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
      />

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
        component={CadastrarSerieScreen}
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
      />

      <Tab.Screen
        name="MinhasSeries"
        component={TelaProvisoria}
        initialParams={{ titulo: 'Minhas séries' }}
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
      />

      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
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
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <FavoritosProvider>
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
                onLoginSucesso={() => navigation.replace('Principal')}
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

          <Stack.Screen
            name="Principal"
            component={MenuPrincipal}
          />

          <Stack.Screen
            name="DetalhesSerie"
            component={DetalhesSerieScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritosProvider>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: '#080808',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  placeholderTitulo: {
    color: '#E50914',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  placeholderTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
  },

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
