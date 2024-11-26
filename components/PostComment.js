import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { CommentAPI } from '../API/CommentAPI';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const PostComment = () => {
  const [visibleReplies, setVisibleReplies] = useState({});
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToUsername, setReplyingToUsername] = useState(null);
  const [commentsData, setCommentsData] = useState([]);
  const route = useRoute();
  const { post } = route.params;

  const [likeCount, setLikeCount] = useState(0);
  const [loveCount, setLoveCount] = useState(0);
  const [surpriseCount, setSurpriseCount] = useState(0);
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Holds the URI of the selected image

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await CommentAPI.getCommentByPostId(post._id);
        setCommentsData(response.data.comments);
      } catch (error) {
        console.error(error);
      }
    };
    getComments();
  }, [post._id]);

  useEffect(() => {
    getUser();
    setLikeCount(post.lovedBy.length);
    setLoveCount(post.likedBy.length);
    setSurpriseCount(post.surprisedBy.length);
  }, [post.lovedBy, post.likedBy, post.surprisedBy]);

  const toggleReplies = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReply = (commentId, username) => {
    setReplyingTo(commentId);
    setReplyingToUsername(username);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyingToUsername(null);
  };

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user !== null) {
        setUser(JSON.parse(user));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addReplyToComment = (comments, commentId, newReply) => {
    return comments.map((comment) => {
      if (comment._id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      }
      if (comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, commentId, newReply),
        };
      }
      return comment;
    });
  };

  const handleSend = () => {
    try {
      const data = new FormData();
      data.append('content', newComment);
      data.append('postId', post._id);
      data.append('userId', user._id);

      if (replyingTo) {
        data.append('parentCommentId', replyingTo);
      }

      if (selectedImage) {
        data.append('imageContent', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      }


      CommentAPI.createComment(data)
        .then((response) => {
          const newReply = response.data;

          if (replyingTo) {
            setCommentsData((prevComments) =>
              addReplyToComment(prevComments, replyingTo, newReply)
            );
          } else {
            setCommentsData((prev) => [...prev, newReply]);
          }

          setNewComment('');
          setReplyingTo(null);
          setReplyingToUsername(null);
          setSelectedImage(null);

        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const deleteImage = () => {
    setSelectedImage(null); // Clear the selected image
  };

  const renderReplies = (replies) => {
    return replies.map((reply) => (
      <View key={reply._id} className="pl-6 mt-2">
        <View className="flex-row items-start">
          <Image
            source={{ uri: reply.author.avatar }}
            className="w-8 h-8 rounded-full"
          />
          <View className="ml-2 flex-1">
            <Text className="text-gray-900 font-bold">{reply.author.firstName} {reply.author.lastName}</Text>
            <Text className="text-gray-700">{reply.content}</Text>
            {reply.image && (
              <Image source={{ uri: reply.image }} className="w-1/2 h-32 mt-2 rounded-md" />
            )}
            <View className="flex-row mt-2">
              <TouchableOpacity className="mr-4">
                <Text className="text-gray-500">Thích {reply.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleReply(reply._id, `${reply.author.firstName} ${reply.author.lastName}`)}>
                <Text className="text-gray-500">Phản hồi</Text>
              </TouchableOpacity>
            </View>
            {reply.replies && reply.replies.length > 0 && (
              <View className="border-l border-gray-300 mt-2">
                {renderReplies(reply.replies)}
              </View>
            )}
          </View>
        </View>
      </View>
    ));
  };

  return (
    <View className="flex-1 mt-4 bg-gray-100">
      <View className="p-4 bg-white flex-row items-center justify-between border-b border-gray-300">
        <Text className="text-gray-900 font-bold">
          <FontAwesome name="thumbs-o-up" size={24} color="gray" />
          <FontAwesome name="heart" size={24} color="red" />
          <FontAwesome name="smile-o" size={24} color="yellow" />
          {loveCount + likeCount + surpriseCount}
        </Text>
      </View>

      <ScrollView className="flex-1">
        {commentsData.length === 0 ? (
          <View className="p-4">
            <Text className="text-gray-500">Chưa có bình luận nào</Text>
          </View>
        ) : (commentsData.map((comment) => (
          <View key={comment._id} className="p-4">
            <View className="flex-row items-start">
              <Image
                source={{ uri: comment.author.avatar }}
                className="w-10 h-10 rounded-full"
              />
              <View className="ml-2 flex-1">
                <Text className="text-gray-900 font-bold">{comment.author.firstName} {comment.author.lastName}</Text>
                <Text className="text-gray-700">{comment.content}</Text>
                {comment.image && (
                  <Image source={{ uri: comment.image }} className="w-1/2 h-32 mt-2 rounded-md" />
                )}
                <View className="flex-row mt-2">
                  <TouchableOpacity className="mr-4">
                    <Text className="text-gray-500">Thích {comment.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleReply(comment._id, `${comment.author.firstName} ${comment.author.lastName}`)}>
                    <Text className="text-gray-500">Phản hồi</Text>
                  </TouchableOpacity>
                </View>
                {comment.replies && (
                  <View className="mt-2">
                    <TouchableOpacity onPress={() => toggleReplies(comment._id)}>
                      <Text className="text-gray-500">
                        {visibleReplies[comment._id]
                          ? 'Ẩn phản hồi'
                          : `Xem ${comment.replies.length} phản hồi khác...`}
                      </Text>
                    </TouchableOpacity>
                    {visibleReplies[comment._id] && (
                      <View className="border-l border-gray-300 mt-2">
                        {renderReplies(comment.replies)}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        )))}
      </ScrollView>

      <View className="p-2 border-t border-gray-300 bg-white">
        {replyingTo && (
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-500">
              Đang phản hồi <Text className="font-bold">{replyingToUsername}</Text>
            </Text>
            <TouchableOpacity onPress={handleCancelReply}>
              <Text className="text-blue-500">Hủy</Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="flex-row items-center">
          <Image
            source={{ uri: user?.avatar }}
            className="w-10 h-10 rounded-full"
          />
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Viết bình luận..."
            className="flex-1 mx-2 p-2 border border-gray-300 rounded-full"
          />
          <TouchableOpacity onPress={pickImage} className="mr-2">
            <FontAwesome name="image" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSend}>
            <Text className="text-blue-500 font-bold">Gửi</Text>
          </TouchableOpacity>
        </View>
        {selectedImage && (
          <View className="mt-2 ml-5 flex-row items-center">
            <View className="relative">
              <Image source={{ uri: selectedImage }} className="w-32 h-32 rounded-md" />
              <TouchableOpacity onPress={deleteImage} className="absolute top-0 right-0 p-1 bg-gray-800 rounded-full">
                <FontAwesome name="times-circle" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default PostComment;
