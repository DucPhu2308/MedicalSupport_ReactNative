import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import PostAPI from "../API/PostAPI";
import { UserAPI } from "../API/UserAPI";
import PostItem from "../components/PostItem";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const ProfileScreen = ({ route }) => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [listUserFollow, setListUserFollow] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const navigation = useNavigation();
    const [countFollowing, setCountFollowing] = useState(0);
    const { searchUser } = route.params;

    const fetchUser = async (id) => {
        try {
            const res = await UserAPI.getUserById(id);
            setUser(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPosts = async (id) => {
        try {
            const res = await PostAPI.getPostByUserId(id);
            setPosts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCurrentUser = async () => {
        const user = await AsyncStorage.getItem("user");
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    };

    const fetchListUserFollow = async (id) => {
        try {
            const res = await UserAPI.getFollowers(id);
            setListUserFollow(res.data);
            setCountFollowing(res.data.following.length);
        } catch (error) {
            console.error(error);
        }
    };

    const checkIfFollowing = () => {
        const following = listUserFollow.following || [];
        const isFollowingUser = following.some(follower => follower._id === currentUser._id);
        setIsFollowing(isFollowingUser);
    };

    useFocusEffect(
        useCallback(() => {
            fetchUser(searchUser._id);
            fetchPosts(searchUser._id);
            fetchListUserFollow(searchUser._id);
            fetchCurrentUser();
        }, [searchUser])
    );

    useEffect(() => {
        checkIfFollowing();
    }, [listUserFollow]);

    const handleFollow = async (id) => {
        try {
            await UserAPI.followUser(id);
            fetchListUserFollow(searchUser._id);  // Cập nhật danh sách người theo dõi
        } catch (error) {
            console.error(error);
        }
    };

    const renderProfileHeader = () => (
        <View className="bg-bluelight">
            <View className="relative">
                <Image
                    source={{ uri: user.avatar }}
                    className="w-full h-40 "
                />
                <View className="absolute bottom-0 left-4 transform translate-y-1/2">
                    <View className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white overflow-hidden">
                        <Image source={{ uri: user.avatar }} className="w-full h-full" />
                    </View>
                </View>
            </View>

            <View className="px-4 mt-5">
                <Text className="text-2xl font-bold">{user.firstName} {user.lastName}</Text>

                <View className="flex-row mt-4 space-x-2">

                    {currentUser._id === user._id ? (
                        <TouchableOpacity className="flex-1 bg-gray-300 py-2 rounded-lg items-center" onPress={() => navigation.navigate('UpdateProfile')}>
                            <Text className="text-gray-700 font-semibold">Chỉnh sửa thông tin</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity className="flex-1 bg-blue-500 py-2 rounded-lg items-center">
                                <Text className="text-white font-semibold">+ Nhắn tin</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 bg-gray-300 py-2 rounded-lg items-center"
                                onPress={() => handleFollow(user._id)}
                            >
                                <Text className="text-gray-700 font-semibold">
                                    {isFollowing ? "Hủy theo dõi" : "Theo dõi"}
                                </Text>
                            </TouchableOpacity>
                        </>

                    )}
                </View>

                <View className="mt-6">
                    <Text className="text-lg font-semibold">Giới thiệu</Text>
                </View>

                <View className="mt-6">
                    <Text className="text-lg font-semibold">Theo dõi bạn</Text>
                    <Text className="text-gray-500 mb-2"> {countFollowing} người</Text>
                    <FlatList
                        data={listUserFollow.following}
                        keyExtractor={(item) => item._id}
                        numColumns={3}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{ flex: 1, alignItems: 'flex-start', marginBottom: 10 }}
                                onPress={() => navigation.navigate('Profile', { searchUser: item })}
                            >
                                <View className="w-24 h-24 rounded-lg bg-gray-300 border-2 border-white overflow-hidden">
                                    <Image source={{ uri: item.avatar }} className="w-full h-full" />
                                </View>
                                <Text className="text-center font-bold mt-2 text-sm">{item.firstName} {item.lastName}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ alignItems: 'flex-start' }}
                    />
                    <TouchableOpacity className="py-2 bg-gray-200 rounded-lg items-center mt-2" onPress={() => navigation.navigate('ListUserFollow', { following: listUserFollow.following })}>
                        <Text className="text-blue-600 font-semibold">Xem tất cả </Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-lg font-semibold mt-6">Bài viết</Text>
            </View>
        </View>
    );

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <PostItem post={item} />}
            ListHeaderComponent={renderProfileHeader}
        />
    );
};

export default ProfileScreen;
