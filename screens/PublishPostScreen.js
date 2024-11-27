import { useCallback, useEffect, useState } from "react";
import PostAPI from "../API/PostAPI";
import PostItem from "../components/PostItem";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";

const PublishPostScreen = ({ navigation }) => {
    const [listPost, setListPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchPost = async () => {
        try {

            const response = await PostAPI.getAllPost();
            const pendingPosts = response.data.filter(post =>
                post.status === "PENDING" &&
                post.tags.some(tag => tag._id === user.doctorInfo.specialities[0])
            );
            const sortedPosts = pendingPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setListPost(sortedPosts);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchPost();
    }, []);

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
        <View>
            <FlatList
                data={listPost}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <PostItem post={item} navigation={navigation} onDelete={fetchPost} />}
                ListHeaderComponent={renderPublishPostHeader}
            />
        </View>
        
    );
};

export default PublishPostScreen;
