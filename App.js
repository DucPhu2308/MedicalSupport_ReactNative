import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IntroScreen from "./screens/IntroScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import FillOtpScreen from "./screens/FillOtpScreen";
import FillEmailScreen from "./screens/FillEmailScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import NavigationBar from "./navigation/NavigationBar";
import CreatePostScreen from "./screens/CreatePostScreen";
import AppointmentScreen from "./screens/AppointmentScreen";
import AppointmentDetailScreen from "./screens/AppointmentDetailScreen";
import ChatDetailScreen from './screens/ChatDetailScreen';
import PostComment from './components/PostComment';

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
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Stack.Screen name="ChatDetail" component={ChatDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Nav"
          component={NavigationBar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FillOtp"
          component={FillOtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FillEmail"
          component={FillEmailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AppointmentScreen"
          component={AppointmentScreen}
          options={{ title: "Danh sách cuộc hẹn" }}
        />
        <Stack.Screen
          name="AppointmentDetailScreen"
          component={AppointmentDetailScreen}
          options={{ title: "Thông tin chi tiết" }}
        />

        <Stack.Screen
          name="CreatePost"
          component={CreatePostScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="PostComment" component={PostComment} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
