import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList } from "react-native";
import PostItem from "../components/PostItem";
import PostAPI from "../API/PostAPI";

const SearchScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [posts, setPosts] = useState([]);

    const handleSearch = async () => {
        const response = await PostAPI.searchPost(search);
        console.log("search post", response.data);
        setPosts(response.data);
    };
    return (
        <>
            <View className="flex-row justify-between items-center p-2 pt-7 bg-blue-500">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mx-2">
                    <FontAwesome name="arrow-left" size={30} color="#fff" />
                </TouchableOpacity>
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={handleSearch}
                    className="p-1 text-white rounded-lg w-60 flex-grow bg-blue-400" placeholder="Tìm kiếm..." />
            </View>
            {
                posts.length > 0 ? (
                    <FlatList
                        data={posts}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => <PostItem post={item} />}
                    />
                ) :
                    (<View className="flex-1 justify-center items-center">
                        <Text className="text-lg">Tìm kiếm bài viết...</Text>
                    </View>)
            }

        </>
    );
};

export default SearchScreen;