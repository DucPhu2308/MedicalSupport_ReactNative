import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroScreen from './screens/IntroScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import FillOtpScreen from './screens/FillOtpScreen';
import FillEmailScreen from './screens/FillEmailScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import NavigationBar from './navigation/NavigationBar';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro">
        <Stack.Screen 
          name="Intro" 
          component={IntroScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Stack.Screen name="Nav" component={NavigationBar} options={{ headerShown: false }} />
        <Stack.Screen name="FillOtp" component={FillOtpScreen} />
        <Stack.Screen name="FillEmail" component={FillEmailScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}