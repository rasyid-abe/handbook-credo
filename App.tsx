import 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './app/context/navigation/AuthStack';
import AppStack from './app/context/navigation/AppStack';

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
        {
          authState?.authenticated ? <AppStack /> : <AuthStack />
        }
    </NavigationContainer>
  )
}
