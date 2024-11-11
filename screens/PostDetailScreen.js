import { Text, TouchableOpacity, View, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLOR } from "../CommonConst";
import { format } from "date-fns"; // Import date formatting function
import PostItem from "../components/PostItem";
const PostDetailScreen = ({ route }) => {
    const { post } = route.params;
    const navigation = useNavigation();

    // Format the createdAt date
    const formattedDate = post.createdAt
        ? format(new Date(post.createdAt), 'dd/MM/yyyy')
        : '';

    return (
        <SafeAreaView>
            <StatusBar backgroundColor={COLOR.PRIMARY} barStyle='light-content'/>
            <View className="flex-row justify-between items-center p-2 bg-blue-500">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mx-2">
                    <FontAwesome name="arrow-left" size={30} color="#fff" />
                </TouchableOpacity>

                <Text className="flex-1 text-center text-white text-lg">
                    {post.title}
                </Text>

                <View className="mx-2" style={{ width: 30 }} />
            </View>

            <PostItem post={post} navigation={navigation} />

            {/* <View className="bg-orange-100 p-4 rounded-lg m-1">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Image
                            source={{ uri: post.author?.avatar }}
                            className="w-12 h-12 rounded-full"
                        />
                        <View className="ml-3">
                            <Text className="font-bold">{post.author?.firstName} {post.author?.lastName}</Text>
                            <Text className="text-gray-500 text-xs">{formattedDate}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        {post.author?.role === 'DOCTOR' && (
                            <Text className="text-xs text-white bg-red-400 px-2 py-1 rounded-full">
                                {'Bác sĩ'}
                            </Text>
                        )}
                    </View>
                </View>

                <Text className="font-bold text-lg mt-2">{post.content}</Text>

                <View className="flex-row mt-1">
                    {post.tags?.map((tag, index) => (
                        <Text
                            key={index}
                            className="text-xs text-white bg-blue-400 px-2 py-1 rounded-full ml-1">
                            {tag.name}
                        </Text>
                    ))}
                </View>

                {post.images?.length > 0 && (
                    <Image
                        source={{ uri: post.images[0] }}
                        className="w-full h-48 rounded-lg mt-3"
                    />
                )}

                <View className="flex-row mt-3 justify-between items-center">
                    <TouchableOpacity className="flex-row items-center">
                        <FontAwesome
                            name={'thumbs-o-up'}
                            size={24}
                            color={'gray'}
                        />
                        <Text className="ml-2 text-gray-700">{'Like'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center" onPress={() => navigation.navigate('PostComment', { post })}>
                        <FontAwesome name="comment-o" size={24} color="gray" />
                        <Text className="ml-2 text-gray-700">Comment</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
        </SafeAreaView>
    );
};

export default PostDetailScreen;
