import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import Header from "../components/Header";
import SearchScreen from "../screens/SearchScreen";
import PostDetailScreen from "../screens/PostDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import ChatDetailScreen from "../screens/ChatDetailScreen";
import AppointmentScreen from "../screens/AppointmentScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const NavigationBar = () => {
  const [searchUser, setSearchUser] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    fetchsearchUser();
  }, []);

  const fetchsearchUser = async () => {
    const user = await AsyncStorage.getItem("user");
    if (user) {
      setSearchUser(JSON.parse(user));
    }
  };

  const handleClickTab = (routeName) => {
    if (routeName === "Profile") {
      navigation.navigate("Profile", { searchUser });
    } else {
      navigation.navigate(routeName);
    }
  }
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbox" : "chatbox-outline";
          } else if (route.name === "Profile" && searchUser) {
            iconName = focused ? "person" : "person-outline";
          }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={30} color={color} onPress={()=>handleClickTab(route.name)} />;
                },
                tabBarActiveTintColor: '#008DDA',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Appointment" component={AppointmentScreen} />
            {/* Hide SearchScreen from the tab bar */}
            <Tab.Screen name="Search" component={SearchScreen} options={{
                tabBarButton: () => null,
                tabBarVisible: false,
                headerShown: false
            }} />
            <Tab.Screen name="PostDetail" component={PostDetailScreen} options={{
                tabBarButton: () => null,
                tabBarVisible: false,
                headerShown: false
            }} />
            {/* <Tab.Screen name="ChatDetail" component={ChatDetailScreen} options={{
                tabBarButton: () => null,
                tabBarVisible: false,
                headerShown: false
            }} /> */}
          </Tab.Navigator>
  );
};

export default NavigationBar;
