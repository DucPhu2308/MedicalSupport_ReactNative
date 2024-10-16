import { View, Text, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ImageViewing from 'react-native-image-viewing';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState, useEffect } from 'react';
import { CommentAPI } from '../API/CommentAPI';
import PostAPI from '../API/PostAPI';
import PostComment from './PostComment';
import { set } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Kích hoạt plugin relativeTime
dayjs.extend(relativeTime);

const emotions = [
    { id: 1, name: 'Like', icon: 'thumbs-o-up', color: '#1877F2' },
    { id: 2, name: 'Love', icon: 'heart', color: '#F33E58' },
    { id: 3, name: 'Haha', icon: 'smile-o', color: '#FFD700' },
    { id: 4, name: 'Wow', icon: 'surprise', color: '#FFA500' },
    { id: 5, name: 'Sad', icon: 'frown-o', color: '#1C9CEA' },
    { id: 6, name: 'Angry', icon: 'angry', color: '#F44336' },
];


const PostItem = ({ post }) => {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false); // Modal visibility state
    const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Selected image index
    const [selectedEmotion, setSelectedEmotion] = useState(null); // Selected emotion
    const [showEmotions, setShowEmotions] = useState(false); // Toggle emotion icons
    const [commentsCount, setCommentsCount] = useState(post.comments.length); // Comments count
    const [reactionCount, setReactionCount] = useState(post.reactions.length); // Reactions count
    const [user, setUser] = useState(null);

    const getUser = async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            setUser(JSON.parse(user));
        } catch (error) {
            console.error(error); 
        }
    };


    useEffect(() => {
        getUser();
        setCommentsCount(post.comments.length);
        setSelectedEmotion(
            post.lovedBy.some((user) => user._id === user?._id) ? emotions[1] : null || 
            post.likedBy.some((user) => user._id === user?._id) ? emotions[0] : null ||
            post.surprisedBy.some((user) => user._id === user?._id) ? emotions[0] : null);
    }, [post.comments.length, post.likedBy]);

    const openImageViewer = (index) => {
        setSelectedImageIndex(index); // Đặt ảnh được chọn
        setVisible(true); // Hiện modal
    };

    const handleEmotionSelect = (emotion) => {
        try {
            const data = {
                type: emotion.name,
            };
            PostAPI.reactPost(post._id, data)
                .then((response) => {
                    setSelectedEmotion(emotion); // Set selected emotion
                    setShowEmotions(false); // Hide emotion icons
                })
        }
        catch (error) {
            console.error(error);
        }

    };

    const handleLike = () => {
        // Nếu đã chọn cảm xúc, click thường sẽ reset về trạng thái chưa chọn
        if (selectedEmotion) {
            setSelectedEmotion(null); // Reset về trạng thái Like mặc định (đen)
        } else {
            setSelectedEmotion(emotions[0]); // Nếu chưa chọn, thì chọn Like
        }
    };

    const handleLongPress = () => {
        setShowEmotions(true); // Hiện danh sách cảm xúc
    };

    const renderImages = (images) => {
        const imageCount = images.length;

        if (imageCount === 1) {
            return (
                <TouchableOpacity onPress={() => openImageViewer(0)}>
                    <Image
                        source={{ uri: images[0] }}
                        className="w-full h-48 rounded-lg mt-3"
                    />
                </TouchableOpacity>
            );
        }

        if (imageCount === 2) {
            return (
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    {images.slice(0, 2).map((image, index) => (
                        <TouchableOpacity key={index} onPress={() => openImageViewer(index)} style={{ flex: 1, marginRight: index === 0 ? 4 : 0 }}>
                            <Image
                                source={{ uri: image }}
                                style={{ width: '100%', height: 192, borderRadius: 10 }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }

        if (imageCount === 3) {
            return (
                <View style={{ marginTop: 8 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                        {images.slice(0, 2).map((image, index) => (
                            <TouchableOpacity key={index} onPress={() => openImageViewer(index)} style={{ flex: 1, marginRight: index === 0 ? 4 : 0 }}>
                                <Image
                                    source={{ uri: image }}
                                    style={{ width: '100%', height: 96, borderRadius: 10 }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity onPress={() => openImageViewer(2)}>
                        <Image
                            source={{ uri: images[2] }}
                            style={{ width: '100%', height: 96, borderRadius: 10 }}
                        />
                    </TouchableOpacity>
                </View>
            );
        }

        if (imageCount === 4) {
            return (
                <View style={{ marginTop: 8 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                        {images.slice(0, 2).map((image, index) => (
                            <TouchableOpacity key={index} onPress={() => openImageViewer(index)} style={{ flex: 1, marginRight: index === 0 ? 4 : 0 }}>
                                <Image
                                    source={{ uri: image }}
                                    style={{ width: '100%', height: 96, borderRadius: 10 }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {images.slice(2, 4).map((image, index) => (
                            <TouchableOpacity key={index} onPress={() => openImageViewer(index + 2)} style={{ flex: 1, marginRight: index === 0 ? 4 : 0 }}>
                                <Image
                                    source={{ uri: image }}
                                    style={{ width: '100%', height: 96, borderRadius: 10 }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            );
        }

        if (imageCount >= 5) {
            return (
                <View style={{ marginTop: 8 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                        {images.slice(0, 3).map((image, index) => (
                            <TouchableOpacity key={index} onPress={() => openImageViewer(index)} style={{ flex: 1, marginRight: index < 2 ? 4 : 0 }}>
                                <Image
                                    source={{ uri: image }}
                                    style={{ width: '100%', height: 96, borderRadius: 10 }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {images.slice(3, 5).map((image, index) => {
                            if (index === 1 && imageCount > 5) {
                                return (
                                    <TouchableOpacity key={index} onPress={() => openImageViewer(4)} style={{ flex: 1 }}>
                                        <View style={{ width: '100%', height: 96, borderRadius: 10, position: 'relative' }}>
                                            <Image
                                                source={{ uri: image }}
                                                style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                            />
                                            <View style={{
                                                position: 'absolute',
                                                top: 0, left: 0,
                                                width: '100%', height: '100%',
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 10
                                            }}>
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>+{imageCount - 5}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                            return (
                                <TouchableOpacity key={index} onPress={() => openImageViewer(index + 3)} style={{ flex: 1, marginRight: index === 0 ? 4 : 0 }}>
                                    <Image
                                        source={{ uri: image }}
                                        style={{ width: '100%', height: 96, borderRadius: 10 }}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            );
        }

    };

    const handleCommentPress = () => {
        navigation.navigate('PostComment', { post });
    };


    const formatTime = (createdAt) => {
        return dayjs(createdAt).fromNow();
    };

    return (
        <View className="bg-orange-100 p-4 rounded-lg m-1">
            {/* Header */}

            <View className="flex-row justify-between items-center">
                {/* Avatar and user info */}
                <View className="flex-row items-center">
                    <Image
                        source={{ uri: 'https://via.placeholder.com/50' }} // Replace with avatar URL
                        className="w-12 h-12 rounded-full"
                    />
                    <View className="ml-3">
                        <Text className="font-bold">{post.author.firstName} {post.author.lastName}</Text>
                        <Text className="text-gray-500 text-xs">{formatTime(post.createdAt)}</Text>
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
            <Text className="font-bold text-lg mt-2">{post.title}
                <Text className="text-gray-500 text-sm font-normal" onTouchEnd={() => navigation.navigate('PostDetail', { post })}> - Xem chi tiết</Text>
            </Text>

            {/* Categories */}
            <View className="flex-row mt-1">
                <Text className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                    Cate 1
                </Text>
                <Text className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Cate 2
                </Text>
            </View>

            {/* Images */}
            {post.images.length > 0 && renderImages(post.images)}

            {/* Image Modal */}
            <ImageViewing
                images={post.images.map((image) => ({ uri: image }))}
                imageIndex={selectedImageIndex}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            />

            <View className="flex-row mt-3 justify-between items-center">
                {/* Emotion Button */}
                <View>
                    <Text>
                        5 lượt thích
                    </Text>
                </View>
                <View>
                    <Text>
                        {commentsCount} bình luận
                    </Text>
                </View>
            </View>
            {/* Emotion List */}
            {showEmotions && (
                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                    {emotions.map((emotion) => (
                        <TouchableOpacity
                            key={emotion.id}
                            onPress={() => handleEmotionSelect(emotion)}
                            style={{ marginHorizontal: 4 }}
                        >
                            <FontAwesome name={emotion.icon} size={28} color={emotion.color} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            {/* Footer */}
            <View className="flex-row mt-3 justify-between items-center">
                {/* Emotion Button */}
                <View>
                    <TouchableOpacity
                        className="flex-row items-center"
                        onPress={handleLike} // Xử lý nhấn ngắn
                        onLongPress={handleLongPress} // Xử lý giữ lâu
                    >
                        {selectedEmotion ? (
                            <FontAwesome name={selectedEmotion.icon} size={24} color={selectedEmotion.color} />
                        ) : (
                            <FontAwesome name={'thumbs-o-up'} size={24} color={'gray'} />
                        )}
                        <Text className="ml-2 text-gray-700">
                            {selectedEmotion ? selectedEmotion.name : 'Like'}
                        </Text>
                    </TouchableOpacity>


                </View>

                {/* Comment Button */}
                {/* Toggle comments section */}
                <View className="flex-row mt-3 justify-between items-center">
                    <TouchableOpacity className="flex-row items-center" onPress={handleCommentPress}>
                        <FontAwesome name="comment-o" size={24} color="gray" />
                        <Text className="ml-2 text-gray-700">Bình luận</Text>
                    </TouchableOpacity>
                </View>


            </View>
        </View>
    );
};

export default PostItem;
