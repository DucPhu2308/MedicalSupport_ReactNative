import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, Pressable, ImageBackground, TouchableOpacity } from 'react-native';
import AuthAPI from "../API/AuthAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DefaultLayoutLogReg from "../layouts/DefaultLayoutLogReg";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = () => {
    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
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



  return (
    <DefaultLayoutLogReg>
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
          {error ? <Text className='text-red-500 text-center mt-2'>{error}</Text> : null}
          <View className="mt-5">
            <TouchableOpacity onPress={() => navigation.navigate('FillEmail')}>
              <Text className="text-blue-500 text-right">Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity className='bg-blue-500 p-3 rounded-lg mt-5' onPress={handleLogin}>
            <Text className='text-white text-center font-bold'>Đăng nhập</Text>
          </TouchableOpacity>
          <View className="mt-5 flex-row justify-center">
            <Text className="text-center">Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-blue-500 ml-2">Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </DefaultLayoutLogReg>

  );
}
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   subText: {
//     fontSize: 16,
//     fontWeight: 'normal',
//   },
//   errorText: {
//     color: 'red',
//     backgroundColor: 'pink',
//   },
//   input: {
//     width: 300,
//     height: 40,
//     margin: 12,
//     borderWidth: 1,
//     padding: 10,
//   }
// });

export default LoginScreen;