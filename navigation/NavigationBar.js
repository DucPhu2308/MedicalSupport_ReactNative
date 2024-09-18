import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import Header from "../components/Header";
import SearchScreen from "../screens/SearchScreen";
import PostDetailScreen from "../screens/PostDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator()

const NavigationBar = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                header: () => <Header />,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused
                            ? 'home'
                            : 'home-outline';
                    } else if (route.name === 'Chat') {
                        iconName = focused ? 'chatbox' : 'chatbox-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={30} color={color} />;
                },
                tabBarActiveTintColor: '#008DDA',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
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


        </Tab.Navigator>
    )
}

export default NavigationBar;