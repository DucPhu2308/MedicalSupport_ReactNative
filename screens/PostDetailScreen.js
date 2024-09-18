import { Text, TouchableOpacity, View, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const PostDetailScreen = ({ route }) => {
    const { post } = route.params;
    const navigation = useNavigation();

    return (
        <>
            <View className="flex-row justify-between items-center p-2 pt-7 bg-blue-500">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mx-2">
                    <FontAwesome name="arrow-left" size={30} color="#fff" />
                </TouchableOpacity>

                <Text className="flex-1 text-center text-white text-lg">
                    {post.title}
                </Text>

                {/* View rỗng để cân bằng với nút back */}
                <View className="mx-2" style={{ width: 30 }} />
            </View>



            <View className="bg-orange-100 p-4 rounded-lg m-1">
                {/* Header */}
                <View className="flex-row justify-between items-center">
                    {/* Avatar và thông tin người dùng */}
                    <View className="flex-row items-center">
                        <Image
                            source={{ uri: 'https://via.placeholder.com/50' }} // Thay bằng link avatar
                            className="w-12 h-12 rounded-full"
                        />
                        <View className="ml-3">
                            <Text className="font-bold">{post.author.firstName} {post.author.lastName}</Text>
                            <Text className="text-gray-500 text-xs">{post.createdAt}</Text>
                        </View>
                    </View>

                    {/* Badge */}
                    <View className="flex-row items-center">

                        <Text className="text-xs text-white bg-yellow-400 px-2 py-1 rounded-full ml-1">
                            <FontAwesome name="check-circle" size={16} color="white" />
                            Bác sĩ
                        </Text>
                    </View>
                </View>

                {/* Title */}
                <Text className="font-bold text-lg mt-2">{post.content}</Text>

                {/* Categories */}
                <View className="flex-row mt-1">
                    <Text className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                        Cate 1
                    </Text>
                    <Text className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Cate 2
                    </Text>
                </View>

                {/* Image */}
                {post.images.length > 0 && (
                    <Image
                        source={{ uri: post.images[0] }} // Thay bằng link ảnh
                        className="w-full h-48 rounded-lg mt-3"
                    />
                )}

                {/* Footer */}
                {/* Like & Comment Buttons */}
                <View className="flex-row mt-3 justify-between items-center">
                    {/* Like Button */}
                    <TouchableOpacity className="flex-row items-center">
                        <FontAwesome
                            name={'thumbs-o-up'}
                            size={24}
                            color={'gray'}
                        />
                        <Text className="ml-2 text-gray-700">{'Like'}</Text>
                    </TouchableOpacity>

                    {/* Comment Button */}
                    <TouchableOpacity className="flex-row items-center">
                        <FontAwesome name="comment-o" size={24} color="gray" />
                        <Text className="ml-2 text-gray-700">Comment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>

    );
};

export default PostDetailScreen;