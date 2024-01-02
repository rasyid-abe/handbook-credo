import { AuthProvider, useAuth } from './app/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/context/screens/Home';
import Login from './app/context/screens/Login';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <Layout></Layout>
    </AuthProvider>
  );
}

export const Layout = () => {
  const {authState, onLogin, onLogout} = useAuth()

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {
          authState?.authenticated ? 
          <Stack.Screen name="Home" component={Home}></Stack.Screen> : 
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}
