import { RadioButton, Text, TextInput } from "react-native-paper";
import { UserAPI } from "../API/UserAPI";
import { useContext, useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Image, View, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from "react-native-safe-area-context";


const UpdateProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState(null);
    const [dob, setDob] = useState(new Date());
    const [selectedImage, setSelectedImage] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            setEmail(user.email || "");
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setGender(user.gender === "male" ? true : false); // true cho nam, false cho nữ
            setDob(user.dob ? new Date(user.dob) : new Date());
            setUserId(user._id);
        }
    }, [user]);


    const fetchUser = async () => {
        try {
            const res = await AsyncStorage.getItem("user");
            if (res) {
                setUser(JSON.parse(res));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateProfile = async () => {
        const data = new FormData();
        data.append("firstName", firstName);
        data.append("lastName", lastName);
        data.append("email", email);
        data.append("dob", dob.toISOString().split('T')[0]);    
        data.append("gender",gender);
        if (avatar) {
            data.append("avatar", {
                uri: avatar,
                type: 'image/jpeg',
                name: 'avatar.jpg',
            });
        }
        try {
            await UserAPI.updateProfile(data);
            Alert.alert("Cập nhật thông tin thành công!");
            await reloadUpdatedUser(userId);
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    };

    const reloadUpdatedUser = async (id) => {
        try {
            const res = await UserAPI.getUserById(id);
            await AsyncStorage.setItem("user", JSON.stringify(res.data));
            setUser(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChooseImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            //const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
            setAvatar(result.assets[0].uri);
        }
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(false);
        setDob(currentDate);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>
                Cập nhật thông tin cá nhân
            </Text>
            <View style={{ marginBottom: 16, alignItems: "center" }}>
                <Image
                    source={{ uri: selectedImage || user.avatar }}
                    style={{ width: 128, height: 128, borderRadius: 64 }}
                />
                <TouchableOpacity onPress={handleChooseImage} style={{ marginTop: 8 }}>
                    <Text style={{ color: "blue" }}>Chọn ảnh đại diện</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text>Họ và tên lót:</Text>
                <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Nhập họ và tên lót"
                    style={{ backgroundColor: "white", marginTop: 8 }}
                />
            </View>

            <View style={{ marginTop: 16 }}>
                <Text>Tên:</Text>
                <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Nhập tên"
                    style={{ backgroundColor: "white", marginTop: 8 }}
                />
            </View>

            <View style={{ marginTop: 16 }}>
                <Text>Email:</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    style={{ backgroundColor: "white", marginTop: 8 }}
                    disabled={true}
                />
            </View>

            <View style={{ marginTop: 16 }}>
                <Text>Ngày sinh:</Text>
                <TouchableOpacity
                    style={{ padding: 12, borderWidth: 1, borderColor: "#ccc", marginTop: 8 }}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text>{dob.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={dob}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
            </View>

            <View style={{ marginTop: 16 }}>
                <Text>Giới tính:</Text>
                <RadioButton.Group onValueChange={(value) => setGender(value === "true")} value={gender ? "true" : "false"}>
                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 8 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <RadioButton value="true" />
                            <Text>Nam</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <RadioButton value="false" />
                            <Text>Nữ</Text>
                        </View>
                    </View>
                </RadioButton.Group>
            </View>


            <TouchableOpacity
                style={{
                    backgroundColor: "#007bff",
                    padding: 12,
                    borderRadius: 8,
                    alignItems: "center",
                    marginTop: 24,
                }}
                onPress={handleUpdateProfile}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Cập nhật</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default UpdateProfileScreen;
