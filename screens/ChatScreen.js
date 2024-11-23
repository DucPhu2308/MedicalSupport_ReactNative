import { View, TextInput, FlatList, Text, RefreshControl } from 'react-native';
import ChatItem from '../components/ChatItem';
import { styled } from 'nativewind';
import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatAPI } from '../API/ChatAPI';
import { UserAPI } from '../API/UserAPI';
import { useFocusEffect } from '@react-navigation/native';

function ChatScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState('');
  const [debounceSearch, setDebounceSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);


  async function getChats() {
    const response = await ChatAPI.getChats();
    if (response.data) {
      setChats(response.data);
    }

  }

  useEffect(() => {
    getChats();

    AsyncStorage.getItem('user').then((data) => {
      setUser(JSON.parse(data));
    });

  }, []);

  useFocusEffect(
    useCallback(() => {
      getChats();
    }, [])
  );

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

  const onRefresh = async () => {
    setRefreshing(true);
    await getChats();
    setRefreshing(false);
  };

  const handlePrivateChat = async (userId) => {
    const response = await ChatAPI.getPrivateChat(userId);
    const chat = response.data;
    const friend = chat.participants.find((participant) => participant._id !== user._id);
    navigation.navigate('ChatDetail', { chatId: chat._id, friend });
};

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
                lastMessage={null} 
                onPress={() => handlePrivateChat(item._id)}
              />;
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
              isRead={item.isRead}
              onPress={() => navigation.navigate('ChatDetail', { chatId: item._id, friend })}
              username={`${friend.firstName} ${friend.lastName}`}
              lastMessage={item.lastMessage} />;
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )
      }

    </View>
  );
}

export default ChatScreen;