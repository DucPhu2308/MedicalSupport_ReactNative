import { Text, TextInput, TouchableOpacity, View, ScrollView, Image, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo
import { useEffect, useState } from 'react';
import PostAPI from "../API/PostAPI";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { DepartmentAPI } from "../API/DepartmentAPI";
import { set } from "date-fns";
export default function CreatePostScreen() {
    const [selectedImages, setSelectedImages] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImageForDetail, setSelectedImageForDetail] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const navigation = useNavigation();
    const [selectedTopic, setSelectedTopic] = useState('all');
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        DepartmentAPI.getAll().
            then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleCreatePost = () => {
        if (!title || !content) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        let tags = [];
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (selectedTopic !== 'all') {
            formData.append('tags', selectedTopic);
        }
        else{
            departments.forEach((department) => {
                tags.push(department._id);
            });
            formData.append('tags', tags);
        }
        selectedImages.forEach((image, index) => {
            formData.append('images', {
                name: `image-${index}.jpg`,
                type: 'image/jpeg',
                uri: image,
            });
        });

        console.log(selectedImages)

        console.log(formData);

        PostAPI.createPost(formData)
            .then(response => {
                console.log(response.data);
                alert('Đăng bài viết thành công!');
                navigation.goBack();
            })
            .catch(error => {
                console.error(error);
                alert('Đăng bài viết thất bại!');
            });
    };

    const handleCloseScreenCreatePost = () => {
        navigation.goBack();
    };

    // Function to pick an image
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission denied!');
            return;
        }


        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImages([...selectedImages, result.assets[0].uri]);
        }
    };

    // Function to delete an image
    const deleteImage = (index) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
    };

    // Function to open modal with the selected image
    const openImageDetail = (imageUri) => {
        setSelectedImageForDetail(imageUri);
        setModalVisible(true);
    };

    // Function to close modal
    const closeModal = () => {
        setModalVisible(false);
        setSelectedImageForDetail(null);
    };

    return (
        <View className="flex-1 justify-center p-2" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <View className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
                <View className="justify-center">
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity onPress={handleCloseScreenCreatePost}>
                            <FontAwesome name="close" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="font-bold text-xl">Tạo bài viết</Text>
                        <TouchableOpacity onPress={handleCreatePost}>
                            <Text className="font-bold text-blue-500">Đăng</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View className="mt-5">
                        {/* Input */}
                        <TextInput
                            placeholder="Nhập tiêu đề bài viết"
                            className="border-b-2 border-gray-200"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled={true}>
                            <TextInput
                                placeholder="Nhập nội dung bài viết"
                                multiline
                                numberOfLines={4}
                                value={content}
                                onChangeText={setContent}
                                style={{ borderBottomWidth: 2, borderColor: 'gray', padding: 5 }}
                            />
                        </ScrollView>

                        <View className="mt-3">
                            <Text className="text-sm text-gray-500 mb-1">Chọn chủ đề bài viết</Text>
                            <View style={{
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 10, // Bo tròn góc
                                overflow: 'hidden',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <Picker
                                    selectedValue={selectedTopic}
                                    onValueChange={(itemValue) => setSelectedTopic(itemValue)}
                                    style={{  color: 'gray' }}
                                >
                                    <Picker.Item label="Tất cả" value="all" />
                                    {departments.map((department) => (
                                        <Picker.Item key={department._id} label={department.name} value={department._id} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* Image Upload */}
                        <View className="flex-row mt-3">
                            <TouchableOpacity
                                className="bg-gray-200 w-24 h-24 items-center justify-center"
                                onPress={pickImage}
                            >
                                <FontAwesome name="image" size={24} color="gray" />
                            </TouchableOpacity>

                            <View className="flex-1 ml-3">
                                <Text className="text-sm text-gray-500">Thêm ảnh vào bài viết</Text>
                            </View>
                        </View>

                        {/* Display Selected Images with Delete Button and Detail View */}
                        {selectedImages.length > 0 && (
                            <ScrollView className="flex-row mt-3" horizontal>
                                {selectedImages.map((imageUri, index) => (
                                    <View key={index} style={{ position: 'relative', marginRight: 10 }}>
                                        <TouchableOpacity onPress={() => openImageDetail(imageUri)}>
                                            <Image
                                                source={{ uri: imageUri }}
                                                style={{ width: 100, height: 100, borderRadius: 8 }}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                position: 'absolute',
                                                top: 5,
                                                right: 5,
                                                backgroundColor: 'rgba(0,0,0,0.6)',
                                                borderRadius: 12,
                                                padding: 2,
                                            }}
                                            onPress={() => deleteImage(index)}
                                        >
                                            <FontAwesome name="times-circle" size={18} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </View>

            {/* Modal for Image Detail View */}
            {selectedImageForDetail && (
                <Modal visible={isModalVisible} transparent={true}>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity
                            style={{ position: 'absolute', top: 40, right: 20 }}
                            onPress={closeModal}
                        >
                            <FontAwesome name="times" size={30} color="white" />
                        </TouchableOpacity>
                        <Image
                            source={{ uri: selectedImageForDetail }}
                            style={{ width: '90%', height: '80%', borderRadius: 10 }}
                            resizeMode="contain"
                        />
                    </View>
                </Modal>
            )}
        </View>
    );
}
