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
import { SocketProvider } from "./contexts/SocketProvider";
import { AuthProvider } from "./contexts/AuthContext";
import ListUserFollowScreen from "./screens/ListUserFollowScreen";
import UpdateProfileScreen from "./screens/UpdateProfileScreen";
import { Provider } from "react-redux";
import store from "./redux/store";
import SocketEventListener from "./components/SocketEventListener";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ProfileScreen from "./screens/ProfileScreen";
import PostDetailScreen from "./screens/PostDetailScreen";
import PublishPostScreen from "./screens/PublishPostScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SocketProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login">
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
                <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ headerShown: false }} />
                <Stack.Screen name="PostComment" component={PostComment} options={{ headerShown: false }} />
                <Stack.Screen name="ListUserFollow" component={ListUserFollowScreen} options={{ headerShown: false }} />
                <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} options={{ headerShown: false }} />
              </Stack.Navigator>
              <SocketEventListener />
            </NavigationContainer>
          </SafeAreaProvider>
        </SocketProvider>
      </AuthProvider>
    </Provider>
  );
}
