import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLOR } from '../CommonConst';
import { ChatAPI } from '../API/ChatAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageItem from '../components/MessageItem/MessageItem';

const ChatDetailScreen = ({ navigation, route }) => {
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const { chatId } = route.params;

    useEffect(() => {
        AsyncStorage.getItem('user').then((data) => {
            setUser(JSON.parse(data));
        });

        async function getMessages() {
            const response = await ChatAPI.getMessages(chatId);
            setMessages(response.data);
        }
        getMessages();
    }, []);

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
                <TouchableOpacity className="mr-3">
                    {/* Icon hình ảnh */}
                    <FontAwesome name="image" size={24} color={COLOR.PRIMARY} />
                </TouchableOpacity>
                <TouchableOpacity className="mr-3">
                    <FontAwesome name="calendar" size={24} color={COLOR.PRIMARY} />
                </TouchableOpacity>
                <TextInput
                    className="flex-1 bg-gray-200 rounded-full px-4 py-2 mr-3"
                    placeholder="Nhập tin nhắn..."
                />
                <TouchableOpacity>
                    <FontAwesome name="send" size={24} color={COLOR.PRIMARY} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ChatDetailScreen;
