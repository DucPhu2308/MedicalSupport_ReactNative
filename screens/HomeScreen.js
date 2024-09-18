import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import PostAPI from '../API/PostAPI';
import PostItem from '../components/PostItem';

const HomeScreen = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  AsyncStorage.getItem('user')
    .then(data => {
      setUser(JSON.parse(data));
    })
    .catch(error => {
      console.error(error);
    });

  useEffect(() => {
    const getAllPost = async () => {
      try {
        const response = await PostAPI.getAllPost();
        console.log(response.data);
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getAllPost();
  }, []);
  return (
    <View>
      {/* <Text style={styles.text}>Trang chủ</Text>
      <Text>{user && ('Chào ' + user.firstName + ' ' + user.lastName + '!')}</Text> */}
      <FlatList
        data={posts}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <PostItem post={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
