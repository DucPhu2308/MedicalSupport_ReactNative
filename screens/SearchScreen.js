import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import PostItem from "../components/PostItem";
import UserInfoCard from "../components/UserInfoCard";
import PostAPI from "../API/PostAPI";
import UserAPI from "../API/UserAPI";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [filteredItems, setFilteredItems] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await PostAPI.getAllPost();
        const responseUser = await UserAPI.getAllUser();
        const postsWithType = response.data.map((post) => ({
          ...post,
          type: "post",
        }));
        const usersWithType = responseUser.data.map((user) => ({
          ...user,
          type: "user",
        }));
        setAllPosts(postsWithType);
        setAllUsers(usersWithType);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  useEffect(() => {
    if (search) {
      const normalizedSearch = removeAccents(search);

      const filteredPosts = allPosts.filter((post) => {
        const fullName = `${post.author.firstName} ${post.author.lastName}`;
        return (
          removeAccents(post.title).includes(normalizedSearch) ||
          removeAccents(fullName).includes(normalizedSearch)
        );
      });

      const filteredUsers = allUsers.filter((user) =>
        removeAccents(`${user.firstName} ${user.lastName}`).includes(
          normalizedSearch
        )
      );

      const combinedItems = [
        ...(tab !== "posts" ? filteredUsers : []),
        ...(tab !== "people" ? filteredPosts : []),
      ];

      setFilteredItems(combinedItems);
    } else {
      setFilteredItems([]);
    }
  }, [search, tab, allPosts, allUsers]);

  const renderItem = ({ item }) => {
    if (item.type === "user") {
      return (
        <UserInfoCard
          user={{
            name: `${item.firstName} ${item.lastName}`,
            bio: item.email,
            avatar: item.avatar || "https://via.placeholder.com/150",
            role: item.roles[0],
          }}
        />
      );
    }
    return (
      <>
        <PostItem post={item} />
        <View
          style={{
            height: 1,
            backgroundColor: "#ccc",
            marginVertical: 8,
          }}
        />
      </>
    );
  };

  return (
    <SafeAreaView>
      <View className="flex-row justify-between items-center p-2 bg-blue-500">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mx-2">
          <FontAwesome name="arrow-left" size={30} color="#fff" />
        </TouchableOpacity>
        <TextInput
          value={search}
          onChangeText={setSearch}
          className="p-1 text-white rounded-lg w-60 flex-grow bg-blue-400"
          placeholder="Tìm kiếm..."
        />
      </View>

      {search ? (
        <View className="flex-row justify-around p-2 bg-gray-100">
          <TouchableOpacity
            onPress={() => setTab("all")}
            className={`px-4 py-2 rounded-full ${
              tab === "all" ? "bg-pink-300" : "bg-gray-200"
            }`}
          >
            <Text>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("people")}
            className={`px-4 py-2 rounded-full ${
              tab === "people" ? "bg-yellow-300" : "bg-gray-200"
            }`}
          >
            <Text>Mọi người</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("posts")}
            className={`px-4 py-2 rounded-full ${
              tab === "posts" ? "bg-blue-300" : "bg-gray-200"
            }`}
          >
            <Text>Bài viết</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {search ? (
        <View className="flex-1">
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item._id || item.name}
            renderItem={renderItem}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default SearchScreen;
