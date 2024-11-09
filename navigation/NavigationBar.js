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
import NotificationScreen from "../screens/NotificationScreen";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../redux/slices/notificationSlice";
import { getUnreadCount } from "../redux/slices/chatSlice";

const Tab = createBottomTabNavigator();

const NavigationBar = () => {
  const dispatch = useDispatch();
  const unreadCount = useSelector((state) => state.notification.unreadCount);
  const unreadChatCount = useSelector((state) => state.chat.unreadChatCount);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(getUnreadCount());
  }, []);


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
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          header: () => <Header />,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
  
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Chat") {
              iconName = focused ? "chatbox" : "chatbox-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Appointment") {
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === "Notification") {
              iconName = focused ? "notifications" : "notifications-outline";
            }
  
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={30} color={color} onPress={()=>handleClickTab(route.name)} />;
          },
          tabBarActiveTintColor: '#008DDA',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chat" component={ChatScreen}
          options={{
            tabBarBadge: unreadChatCount > 0 ? unreadChatCount : null,
          }}
        />
        <Tab.Screen name="Appointment" component={AppointmentScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Notification" component={NotificationScreen} 
          options={{
            tabBarBadge: unreadCount > 0 ? unreadCount : null,
          }}  
        />
  
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
    </>
  );
};

export default NavigationBar;
