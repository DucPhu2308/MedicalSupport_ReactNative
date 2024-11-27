import { useEffect, useState } from "react";
import { FlatList, View, Image, Text, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserAPI } from "../API/UserAPI";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLOR } from "../CommonConst";

const ListUserFollowScreen = ({ navigation }) => {
    const [listUserFollow, setListUserFollow] = useState([]);
    const [isFollow, setIsFollow] = useState(false);
    const route = useRoute();
    const { following } = route.params;

    useEffect(() => {
        setListUserFollow(following);
    }, []);



    const handleFollow = async () => {
        try {
            await UserAPI.followUser(searchUser._id);
            setIsFollow(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnfollow = async () => {
        try {
            await UserAPI.unfollowUser(searchUser._id);
            setIsFollow(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleViewProfile = (user) => {
        navigation.navigate("Profile", { searchUser: user });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 8, borderBottomWidth: 1, borderBottomColor: "#e0e0e0", backgroundColor: COLOR.PRIMARY }}>
                <Text style={{ fontWeight: "bold", color: "white" }}>Danh sách theo dõi bạn</Text>
            </View>
            <FlatList
                data={listUserFollow}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleViewProfile(item)}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 8, borderBottomWidth: 1, borderBottomColor: "#e0e0e0" }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image
                                    source={{ uri: item.avatar }}
                                    style={{ width: 50, height: 50, borderRadius: 25 }}
                                />
                                <Text style={{ marginLeft: 8, fontWeight: "bold" }} >{item.firstName} {item.lastName}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

export default ListUserFollowScreen;
