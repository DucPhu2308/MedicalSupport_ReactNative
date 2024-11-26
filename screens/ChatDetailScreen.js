import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
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
import ApptDialog from '../components/ApptDialog';
import { useSocket } from '../contexts/SocketProvider';
import { useAuth } from '../contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { markChatAsRead } from '../redux/slices/chatSlice';

const ChatDetailScreen = ({ navigation, route }) => {
    const socket = useSocket();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageListRef = useRef(null);
    const { chatId, friend } = route.params;

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [showApptDialog, setShowApptDialog] = useState(false);

    const LIMIT = 10;

    const getMessages = async () => {
        setLoading(true);
        try {
            const response = await ChatAPI.getMessagesPagination(chatId, page, LIMIT);
            const newMessages = response.data;
            // filter out duplicated messages
            const filteredMessages = newMessages.filter((msg) => !messages.some((m) => m._id === msg._id));
            setMessages(prevMessages => [...prevMessages, ...filteredMessages]);
            if (response.data.length < LIMIT) {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        dispatch(markChatAsRead(chatId));
    }, [dispatch]);

    useEffect(() => {
        getMessages();
    }, [page]);

    handleLoadMore = () => {
        if (hasMore && !loading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleNewMessage = (message) => {
        setMessages(prevMessages => [message, ...prevMessages]);
        // scroll to bottom (the list is inverted)
        messageListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    };

    useEffect(() => {
        if (socket) {
            socket.on('receive-message', handleNewMessage);

            socket.on('update-message', (message) => {
                if (message.chat === chatId) {
                    const newMessages = messages.map((msg) => {
                        if (msg._id === message._id) {
                            return message;
                        }
                        return msg;
                    });
                    setMessages(newMessages);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('receive-message', handleNewMessage);
                socket.off('update-message');
            }
        };
    }, [socket, messages]);

    const createAppt = (appt) => {
        socket.emit('send-message', {
            chat: chatId,
            content: appt,
            type: MessageType.APPOINTMENT,
        });
        setShowApptDialog(false);
    };

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
            <ApptDialog createAppt={createAppt} open={showApptDialog} onClose={() => setShowApptDialog(false)} />
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
                            source={{ uri: friend.avatar }}
                            className="w-10 h-10 rounded-full"
                        />
                    </TouchableOpacity>
                    <View className="ml-3">
                        <Text className="text-white font-bold">{`${friend.firstName} ${friend.lastName}`}</Text>
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
                        onEndReached={handleLoadMore}
                        ListFooterComponent={
                            loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
                        }
                    />
                </View>

            </View>

            {/* Footer */}
            <View className="flex-row items-center bg-white p-2 border-t border-gray-300">
                <TouchableOpacity onPress={handleSendImage} className="mr-3">
                    {/* Icon hình ảnh */}
                    <FontAwesome name="image" size={24} color={COLOR.PRIMARY} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowApptDialog(true)} className="mr-3">
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
