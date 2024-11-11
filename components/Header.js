import { FontAwesome } from "@expo/vector-icons";
import { Text, TouchableOpacity, View, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLOR } from "../CommonConst";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = () => {
    const navigation = useNavigation();

    const handleCreatePost = () => {
        navigation.navigate("CreatePost");
    }

    const handleLogout = () => {
        Alert.alert(
            "Đăng xuất",
            "Bạn có chắc muốn đăng xuất không?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Đăng xuất",
                    onPress: () => {
                        AsyncStorage.removeItem("user");
                        navigation.navigate("Login");
                    }
                }
            ],
            { cancelable: true }
        );
    }

    return (
        <SafeAreaView className="flex-row justify-between items-center p-2 bg-blue-500">
            <StatusBar backgroundColor={COLOR.PRIMARY} barStyle='light-content'/>
            <Text className="text-white text-2xl font-bold" >My App</Text>
            <View className="flex-row">
                <TouchableOpacity className="mr-4" onPress={handleCreatePost}>
                    <FontAwesome name="plus-circle" size={30} color="#fff"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                    <FontAwesome name="search" size={30} color="#fff"/>
                </TouchableOpacity>
                <TouchableOpacity className="ml-4" onPress={handleLogout}>
                    <FontAwesome name="sign-out" size={30} color="#fff"/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default Header;
