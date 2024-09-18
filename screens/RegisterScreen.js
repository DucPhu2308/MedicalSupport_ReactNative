import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import AuthAPI from "../API/AuthAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    const handleRegister = () => {
        const data = {
            email,
            password,
            firstName,
            lastName,
        };

        AuthAPI.register(data)
            .then(response => {
                console.log(response.data);
                AsyncStorage.setItem('email', email);
                navigation.navigate('FillOtp');
            })
            .catch(error => {
                console.error(error);
                setError(error.response.data.message);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Đăng ký</Text>
            <Text style={styles.errorText}>{error}</Text>

            <TextInput
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input} placeholder="Họ và tên đệm" />

            <TextInput
                value={lastName}
                onChangeText={setLastName}
                style={styles.input} placeholder="Tên" />

            <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input} placeholder="Email" />

            <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.input} placeholder="Mật khẩu" secureTextEntry={true} />
            <Button title="Đăng ký" onPress={handleRegister} />

            <Text style={styles.subText}>
                Đã có tài khoản?
                <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text style={{ color: 'blue' }}> Đăng nhập</Text>
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

export default RegisterScreen;