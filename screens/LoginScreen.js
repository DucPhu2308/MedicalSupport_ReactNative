import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import AuthAPI from "../API/AuthAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({navigation}) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Đăng nhập</Text>
      <Text style={styles.errorText}>{error}</Text>
      
      <TextInput 
        value={email}
        onChangeText={setEmail}
        style={styles.input} placeholder="Email" />
      <TextInput 
        value={password}
        onChangeText={setPassword}
        style={styles.input} placeholder="Mật khẩu" secureTextEntry={true} />
      <Button title="Đăng nhập" onPress={handleLogin} />

      <Text style={styles.subText}>
        Chưa có tài khoản?
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={{color: 'blue'}}> Đăng ký ngay</Text>
        </Pressable>
      </Text>

      <Text style={styles.subText}>
        
        <Pressable onPress={() => navigation.navigate('FillEmail')}>
          <Text style={{color: 'blue'}}> Quên mật khẩu?</Text>
        </Pressable>
      </Text>

    </View>
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