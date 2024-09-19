import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, Pressable, ImageBackground, TouchableOpacity } from 'react-native';
import AuthAPI from "../API/AuthAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const data = {
      email,
      password
    };

    AuthAPI.login(data)
      .then(response => {
        console.log(response.data);
        AsyncStorage.setItem('token', response.data.token);
        AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        navigation.replace('Nav');
      })
      .catch(error => {
        console.error(error);
        setError(error.response?.data.message);
      });
  }


  const images = [
    require('../assets/pictureDoctor.jpg'),
    require('../assets/pictureDoctor2.jpg'),
    require('../assets/doctor_picture.jpg'),
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState((currentImageIndex + 1) % images.length);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => {
          const newIndex = (prev + 1) % images.length;
          setNextImageIndex((newIndex + 1) % images.length);
          return newIndex;
        });
        setFadeIn(true);
      }, 300); // Change image after fade-out
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <ImageBackground
            source={images[currentImageIndex]}
            className="flex-1 justify-center p-5"  // Kích thước phủ đầy
            resizeMode="cover">
            <View className="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-50" />

            <View className="flex-1 justify-center p-2 ">
                <View className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                    <View >
                        <Text className="text-xl font-bold text-center" >ĐĂNG NHẬP</Text>
                    </View>
                    <View className="mt-5">
                        <Text className="text-xl font-bold text-left" >Email</Text>
                        <TextInput
                            className="border border-black rounded-lg h-10 p-2 mt-2 bg-white"
                            onChangeText={setEmail}
                            placeholder="Nhập email"
                            value={email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    <View className="mt-5">
                        <Text className="text-xl font-bold text-left">Mật khẩu:</Text>
                        <TextInput
                            className="border border-black rounded-lg h-10 p-2 mt-2 bg-white"
                            onChangeText={setPassword}
                            placeholder="Nhập mật khẩu"
                            value={password}
                            secureTextEntry
                        />
                    </View>
                    <View className="mt-5">
                        <TouchableOpacity onPress={() => navigation.navigate('FillEmail')}>
                            <Text className="text-blue-500 text-right">Quên mật khẩu?</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="mt-5">
                        <Button title="Đăng nhập" onPress={handleLogin} />
                    </View>
                    <View className="mt-5 flex-row justify-center">
                        <Text className="text-center">Chưa có tài khoản?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text className="text-blue-500 ml-2">Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </ImageBackground>

  );
}

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
  subText: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  errorText: {
    color: 'red',
    backgroundColor: 'pink',
  },
  input: {
    width: 300,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});

export default LoginScreen;