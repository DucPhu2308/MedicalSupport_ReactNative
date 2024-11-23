import React from 'react';
import { View, Text, Image } from 'react-native';
import { styled } from 'nativewind';
import { MessageType } from '../API/ChatAPI';
import { formatMessageTime } from '../utils/DatetimeUtils';
import { TouchableOpacity } from 'react-native';

const ChatItem = ({ avatarUrl, username, lastMessage, onPress, isRead = true }) => {
  return (
    <TouchableOpacity onPress={onPress} 
      className={`flex-row items-center p-3 border-b border-gray-300 rounded-xl
        ${isRead ? '' : 'bg-[#efe6d0]'}`}
    >
      <Image
        source={{ uri: avatarUrl }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View>
        <Text className="font-bold">{username}</Text>
        {lastMessage && (
          <Text className={`${isRead ? '' : 'font-bold'}`}>
            {lastMessage.type === MessageType.TEXT && <Text>{lastMessage.content}</Text>}
            {lastMessage.type === MessageType.IMAGE && <Text>{"🖼️"}</Text>}
            {lastMessage.type === MessageType.APPOINTMENT && <Text>{"📅"}</Text>}
            <Text className="text-gray-500 ">{" · " + formatMessageTime(lastMessage.createdAt)}</Text>
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default styled(ChatItem);
