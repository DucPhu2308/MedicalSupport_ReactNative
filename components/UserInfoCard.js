import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const UserInfoCard = ({ user }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <>
      <View className="flex-row items-center p-3 bg-gray-100 rounded-md m-2">
        <Image
          source={{ uri: user.avatar }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <View className="ml-3">
          <Text className="font-bold text-lg">{user.name}</Text>
          <Text>{user.bio}</Text>
          <Text className="text-yellow-500 font-semibold">{user.role}</Text>
        </View>
        <View className="ml-auto">
          <TouchableOpacity
            onPress={handleFollow}
            className="px-4 py-2 bg-blue-500 rounded-full"
          >
            <Text className="text-white font-semibold">
              {isFollowing ? "Đang theo dõi" : "Theo dõi"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: "#ccc",
          marginVertical: 8,
        }}
      />
    </>
  );
};

export default UserInfoCard;
