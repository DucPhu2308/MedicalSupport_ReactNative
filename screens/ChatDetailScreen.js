import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLOR } from '../CommonConst';
import { ChatAPI, MessageType } from '../API/ChatAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageItem from '../components/MessageItem/MessageItem';
import { connectSocket } from '../API/Socket';
import { launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { EncodingType, readAsStringAsync } from 'expo-file-system';

const ChatDetailScreen = ({ navigation, route }) => {
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageListRef = useRef(null);
    const { chatId } = route.params;

    useEffect(() => {
        connectSocket().then((socket) => {
            setSocket(socket);
        });
        AsyncStorage.getItem('user').then((data) => {
            setUser(JSON.parse(data));
        });

        async function getMessages() {
            const response = await ChatAPI.getMessages(chatId);
            setMessages(response.data);
        }
        getMessages();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('receive-message', (message) => {
                console.log('Nhận tin nhắn:', message);
                setMessages(prevMessages => [message, ...prevMessages]);
                // scroll to bottom (the list is inverted)
                messageListRef.current?.scrollToOffset({ animated: true, offset: 0 });
            });
        }
    }, [socket]);

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            socket.emit('send-message', {
                chat: chatId,
                content: newMessage.trim(),
                type: MessageType.TEXT,
            });
        }
        setNewMessage('');
    };

    const handleSendImage = async () => {
        // Yêu cầu quyền truy cập vào thư viện ảnh
        const { status } = await requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này.');
            return;
        }

        // Mở thư viện ảnh
        const result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsMultipleSelection: true, // Tính năng này hiện tại chưa được hỗ trợ trên iOS
            quality: 1, // Chất lượng ảnh
        });

        if (!result.canceled && result.assets) {
            const files = result.assets;

            try {
                // Nén các file ảnh
                const compressedFiles = await Promise.all(
                    files.map(async (file) => {
                        const manipulatedImage = await manipulateAsync(
                            file.uri,
                            [{ resize: { width: 1080 } }], // Resize ảnh
                            { compress: 0.7, format: SaveFormat.JPEG } // Nén ảnh với chất lượng 70%
                        );

                        const base64Image = await readAsStringAsync(manipulatedImage.uri, {
                            encoding: EncodingType.Base64,
                          });
                        
                        const binaryBuffer = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));

                        return binaryBuffer;
                    })
                );

                // Gửi ảnh đã nén qua socket
                socket.emit('send-message', {
                    chat: chatId,
                    content: compressedFiles,
                    type: MessageType.IMAGE,
                });
            } catch (error) {
                console.error('Lỗi khi nén hoặc gửi ảnh:', error);
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f8f1e9]">
            <StatusBar backgroundColor={COLOR.PRIMARY} barStyle='light-content' />
            {/* Header */}
            <View className="flex-row items-center justify-between bg-blue-500 px-4 py-2">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mx-2">
                    <FontAwesome name="arrow-left" size={30} color="#fff" />
                </TouchableOpacity>
                <View className="flex-row items-center">
                    <TouchableOpacity>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/50' }}
                            className="w-10 h-10 rounded-full"
                        />
                    </TouchableOpacity>
                    <View className="ml-3">
                        <Text className="text-white font-bold">Username</Text>
                        <Text className="text-white text-sm">đang hoạt động</Text>
                    </View>
                </View>
                <View className="flex-row space-x-4">
                    <TouchableOpacity>
                        <FontAwesome name="phone" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name="info-circle" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-1 bg-[#f8f1e9]">
                {/* List messages */}
                <View className="flex flex-col px-1">
                    <FlatList
                        ref={messageListRef}
                        data={messages}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => {
                            const isSent = item.sender._id === user._id;
                            return <MessageItem message={item} isSent={isSent} />
                        }}
                        inverted
                    />
                </View>

            </View>

            {/* Footer */}
            <View className="flex-row items-center bg-white p-2 border-t border-gray-300">
                <TouchableOpacity onPress={handleSendImage} className="mr-3">
                    {/* Icon hình ảnh */}
                    <FontAwesome name="image" size={24} color={COLOR.PRIMARY} />
                </TouchableOpacity>
                <TouchableOpacity className="mr-3">
                    <FontAwesome name="calendar" size={24} color={COLOR.PRIMARY} />
                </TouchableOpacity>
                <TextInput
                    className="flex-1 bg-gray-200 rounded-2xl px-4 py-2 mr-3 max-h-28"
                    placeholder="Nhập tin nhắn..."
                    multiline
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <TouchableOpacity onPress={handleSendMessage}>
                    <FontAwesome name="send" size={24} color={COLOR.PRIMARY} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ChatDetailScreen;
