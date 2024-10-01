
import { FontAwesome } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native";

const Header = () => {
    const navigation = useNavigation();

    const handleCreatePost = () => {
        navigation.navigate("CreatePost");
    }
    return (
        <View className="flex-row justify-between items-center p-2 pt-7 bg-blue-500">
            <Text className="text-white text-2xl font-bold" >My App</Text>
            <View className="flex-row">
                <TouchableOpacity className="mr-4" onPress={handleCreatePost}>
                    <FontAwesome name="plus-circle" size={30} color="#fff"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                    <FontAwesome name="search" size={30} color="#fff"/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Header;