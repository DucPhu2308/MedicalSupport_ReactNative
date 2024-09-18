import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem('user')
            .then(data => {
                setUser(JSON.parse(data));
            })
            .catch(error => {
                console.error(error);
            });
    });

    return (
        <View className="p-2">
            <Text className="text-2xl font-semibold">Thông tin của bạn</Text>
            <Text className="text-lg">{user?.firstName} {user?.lastName}</Text>
            <Text className="text-lg">{user?.email}</Text>
        </View>
    );
}

export default ProfileScreen;