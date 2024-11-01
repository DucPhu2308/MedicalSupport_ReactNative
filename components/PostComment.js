import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { CommentAPI } from '../API/CommentAPI';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { set } from 'date-fns';
// Sample comments with nested replies structure
const commentsData = [
  {
    id: 1,
    username: 'Lê Đình Hiếu',
    text: 'Khi nào đội bóng cần giữ nguyên tỉ số cứ alo Văn Toàn vì Toàn Hoà chứ thắng đâu 😆',
    likes: 41,
    replies: [
      {
        id: 2,
        username: 'Trang',
        text: 'Lê Đình Hiếu cười nội thương 😂',
        likes: 0,
        replies: [],
      },
    ],
  },
  {
    id: 3,
    username: 'Huỳnh Tấn Tiên',
    text: 'Banh ra thấy chữ công phượng cái mềm xìu lun',
    likes: 106,
    replies: [
      {
        id: 4,
        username: 'Lê Như Duyên',
        text: 'Ở đây tao thấy có nhiều óc chó...',
        likes: 0,
        replies: [
          {
            id: 5,
            username: 'Hoàng Long',
            text: 'T thấy đúng luôn.',
            likes: 0,
            replies: [],
          },
        ],
      },
    ],
  },
];

const PostComment = () => {
  const [visibleReplies, setVisibleReplies] = useState({}); // To track which comments have visible replies
  const [newComment, setNewComment] = useState(''); // For input text
  const [replyingTo, setReplyingTo] = useState(null); // To track which comment or reply we are responding to
  const [replyingToUsername, setReplyingToUsername] = useState(null); // To track username being replied to
  const [commentsData, setCommentsData] = useState([]); // To store comments data
  const route = useRoute(); 
  const { post } = route.params;

  const [likeCount, setLikeCount] = useState(0);
  const [loveCount, setLoveCount] = useState(0);
  const [surpriseCount, setSurpriseCount] = useState(0);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await CommentAPI.getCommentByPostId(post._id);
        setCommentsData(response.data);
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

  // Toggle replies visibility
  const toggleReplies = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Handle reply logic for any comment or reply
  const handleReply = (commentId, username) => {
    setReplyingTo(commentId); // Set the ID of the comment or reply being replied to
    setReplyingToUsername(username); // Set the username being replied to
  };

  // Handle canceling reply
  const handleCancelReply = () => {
    setReplyingTo(null); // Reset reply mode
    setReplyingToUsername(null); // Clear username state
  };

  const getUser = async () => {
    try{
      const user = await AsyncStorage.getItem('user');
      if(user !== null){
        setUser(JSON.parse(user));
      }
    }
    catch(error){
      console.error(error);
    }
  }

  // Handle send comment logic
  const addReplyToComment = (comments, commentId, newReply) => {
    return comments.map((comment) => {
      if (comment._id === commentId) {
        // Add the new reply to the comment's replies array
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      }
      // Recursively find and add the reply to nested replies
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
      const data = {
        content: newComment,
        postId: post._id,
        userId: user._id,
        parentCommentId: replyingTo, // Set parentCommentId if replying to a comment
      };
  
      CommentAPI.createComment(data)
        .then((response) => {
          const newReply = response.data;
  
          if (replyingTo) {
            // If replying to a comment, add the reply to the correct comment's replies array
            setCommentsData((prevComments) =>
              addReplyToComment(prevComments, replyingTo, newReply)
            );
          } else {
            // If not replying, add the comment to the top-level comments array
            setCommentsData((prev) => [...prev, newReply]);
          }
  
          setNewComment(''); // Clear input
          setReplyingTo(null); // Reset reply mode
          setReplyingToUsername(null); // Clear username state
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  // Recursive function to render nested replies
  const renderReplies = (replies) => {
    return replies.map((reply) => (
      <View key={reply._id} className="pl-6 mt-2">
        <View className="flex-row items-start">
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            className="w-8 h-8 rounded-full"
          />
          <View className="ml-2 flex-1">
            <Text className="text-gray-900 font-bold">{reply.author.firstName} {reply.author.lastName}</Text>
            <Text className="text-gray-700">{reply.content}</Text>
            <View className="flex-row mt-2">
              <TouchableOpacity className="mr-4">
                <Text className="text-gray-500">Thích {reply.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleReply(reply._id, `${reply.author.firstName}${reply.author.lastName}`)}>
                <Text className="text-gray-500">Phản hồi</Text>
              </TouchableOpacity>
            </View>

            {/* Render replies recursively */}
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
      {/* Header with Reactions */}
      <View className="p-4 bg-white flex-row items-center justify-between border-b border-gray-300">
        <Text className="text-gray-900 font-bold"> 
          <FontAwesome name="thumbs-o-up" size={24} color="gray" />
          <FontAwesome name="heart" size={24} color="red" />
          {loveCount+likeCount+surpriseCount}
        </Text>
      </View>

      {/* Comments Section */}
      <ScrollView className="flex-1">
        {commentsData.map((comment) => (
          <View key={comment._id} className="p-4">
            <View className="flex-row items-start">
              <Image
                source={{ uri: 'https://via.placeholder.com/50' }}
                className="w-10 h-10 rounded-full"
              />
              <View className="ml-2 flex-1">
                <Text className="text-gray-900 font-bold">{comment.author.firstName} {comment.author.lastName}</Text>
                <Text className="text-gray-700">{comment.content}</Text>
                <View className="flex-row mt-2">
                  <TouchableOpacity className="mr-4">
                    <Text className="text-gray-500">Thích {comment.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleReply(comment._id,`${comment.author.firstName}${comment.author.lastName}`)}>
                    <Text className="text-gray-500">Phản hồi</Text>
                  </TouchableOpacity>
                </View>

                {/* Toggle reply visibility */}
                {comment.replies && (
                  <View className="mt-2">
                    <TouchableOpacity onPress={() => toggleReplies(comment._id)}>
                      <Text className="text-gray-500">
                        {visibleReplies[comment._id]
                          ? 'Ẩn phản hồi'
                          : `Xem ${comment.replies.length} phản hồi khác...`}
                      </Text>
                    </TouchableOpacity>

                    {/* Render replies if visible */}
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
        ))}
      </ScrollView>

      {/* Footer with Input Form */}
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
            source={{ uri: 'https://via.placeholder.com/50' }}
            className="w-10 h-10 rounded-full"
          />
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Viết bình luận..."
            className="flex-1 mx-2 p-2 border border-gray-300 rounded-full"
          />
          <TouchableOpacity onPress={handleSend}>
            <Text className="text-blue-500 font-bold">Gửi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostComment;
