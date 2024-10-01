
import { FontAwesome } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLOR } from "../CommonConst";

const Header = () => {
    const navigation = useNavigation();

    const handleCreatePost = () => {
        navigation.navigate("CreatePost");
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
            </View>
        </SafeAreaView>
    );
}

export default Header;