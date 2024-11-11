import React from 'react';
import { View, Text, Image } from 'react-native';
import bellIcon from '../assets/bell.png';
import { formatMessageTime } from '../utils/DatetimeUtils';
import { TouchableOpacity } from 'react-native';

const NotificationItem = ({ notification, onPress }) => {
    const { content, isRead, imageUrl } = notification;
    return (
        <TouchableOpacity onPress={onPress}>
            <View className={`flex-row my-0.5 justify-between items-center p-2  rounded-lg ${isRead ? 'bg-gray-200' : 'bg-gray-300'}`}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} className="w-16 h-16 mr-4 rounded-full" />
                ) : (
                    <Image source={bellIcon} resizeMode='contain' className="w-16 h-16 mr-4" />
                )}
                <Text className={`text-sm w-60 ${isRead ? 'text-gray-600' : 'text-black font-semibold'}`}>
                    {content}
                </Text>
                <Text className="text-xs text-gray-500 ml-auto">{formatMessageTime(notification.updatedAt)}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default NotificationItem;