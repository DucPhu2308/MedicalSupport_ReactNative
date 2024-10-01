import { View, TextInput, FlatList, Text } from 'react-native';
import ChatItem from '../components/ChatItem';
import { styled } from 'nativewind';
import { useState } from 'react';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatAPI } from '../API/ChatAPI';
import { UserAPI } from '../API/UserAPI';

function ChatScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState('');
  const [debounceSearch, setDebounceSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    async function getChats() {
      const response = await ChatAPI.getChats();
      if (response.data) {
        setChats(response.data);
      }

    }
    getChats();

    AsyncStorage.getItem('user').then((data) => {
      setUser(JSON.parse(data));
    });

  }, []);

  // debounce search for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    }
  }, [search]);

  // search for user by email
  useEffect(() => {
    if (debounceSearch) {
      UserAPI.findUserByEmail(debounceSearch).then((response) => {
        setSearchResult(response.data);
      });
    } else {
      setSearchResult([]);
    }
  }, [debounceSearch]);

  return (
    <View className="flex-1 bg-[#f8f1e9] p-4">
      <TextInput
        className="bg-gray-200 rounded-full px-4 py-2 mb-4"
        placeholder="Tìm đoạn trò chuyện"
        value={search}
        onChangeText={(text) => {
          setSearch(text);
        }}
      />

      {search.trim() !== "" ? (
        searchResult.length > 0 ? (
          <FlatList
            data={searchResult}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              return <ChatItem avatarUrl={item.avatar}
                username={`${item.firstName} ${item.lastName}`}
                lastMessage={null} />;
            }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Không tìm thấy kết quả</Text>
          </View>
        )
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const friend = item.participants.find((participant) => participant._id !== user._id);
            return <ChatItem avatarUrl={friend.avatar}
              onPress={() => navigation.navigate('ChatDetail', { chatId: item._id })}
              username={`${friend.firstName} ${friend.lastName}`}
              lastMessage={item.lastMessage} />;
          }}
        />
      )
      }

    </View>
  );
}

export default ChatScreen;