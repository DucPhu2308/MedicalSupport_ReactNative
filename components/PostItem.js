import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ImageViewing from 'react-native-image-viewing';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
// Kích hoạt plugin relativeTime
dayjs.extend(relativeTime);

const PostItem = ({ post }) => {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false); // Modal visibility state
    const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Selected image index


    const openImageViewer = (index) => {
        setSelectedImageIndex(index); // Đặt ảnh được chọn
        setVisible(true); // Hiện modal
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

            {/* Footer */}
            <View className="flex-row mt-3 justify-between items-center">
                {/* Like Button */}
                <TouchableOpacity className="flex-row items-center">
                    <FontAwesome name={'thumbs-o-up'} size={24} color={'gray'} />
                    <Text className="ml-2 text-gray-700">Like</Text>
                </TouchableOpacity>

                {/* Comment Button */}
                <TouchableOpacity className="flex-row items-center">
                    <FontAwesome name="comment-o" size={24} color="gray" />
                    <Text className="ml-2 text-gray-700">Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PostItem;
