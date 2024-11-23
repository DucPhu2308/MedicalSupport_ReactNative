import { useCallback, useEffect, useState } from "react";
import PostAPI from "../API/PostAPI";
import PostItem from "../components/PostItem";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const PublishPostScreen = ({ navigation }) => {
    const [listPost, setListPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});

    const currentUser = async () => {
        const user = await AsyncStorage.getItem("user");
        if (user) {
            setUser(JSON.parse(user));
        }
        
    };

    useEffect(() => {
        currentUser();
    }, [navigation]);

    const fetchPost = async () => {
        try {
            // Call API to get list of posts
            const response = await PostAPI.getAllPost();
            const pendingPosts = response.data.filter(post => post.status === "PENDING" && post.tags.some(tag => tag._id === user.doctorInfo.specialities[0]));
            const sortedPosts = pendingPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setListPost(sortedPosts);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            currentUser();
            fetchPost();
        }, [navigation])
    );

    const renderPublishPostHeader = () => (
        <View >
            
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <SafeAreaView>
            <FlatList
                data={listPost}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <PostItem post={item} navigation={navigation} onDelete={fetchPost} />}
                ListHeaderComponent={renderPublishPostHeader}
            />
        </SafeAreaView>
        
    );
};

export default PublishPostScreen;