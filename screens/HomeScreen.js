import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import PostAPI from '../API/PostAPI';
import PostItem from '../components/PostItem';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 5;

  const navigation = useNavigation();

  const getPosts = async () => {
    setLoading(true);
    try {
      const response = await PostAPI.getPostPagination(page, LIMIT);
      setPosts([...posts, ...response.data]);
      if (response.data.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  
  useEffect(() => {
    getPosts();
  }, [page]);

  handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  }

  return (
    <View>
      {/* <Text style={styles.text}>Trang chủ</Text>
      <Text>{user && ('Chào ' + user.firstName + ' ' + user.lastName + '!')}</Text> */}
      <FlatList
        onEndReached={handleLoadMore}
        data={posts}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <PostItem post={item} />}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />
    </View>
  );
};

export default HomeScreen;
